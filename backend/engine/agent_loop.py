"""NovaMart 9-Stage Hybrid Agent Reasoning Loop.

Implements the layered reasoning system described in:
- spec/01 (The 9-Stage Loop & 4 Terminal Moves)
- spec/07 (Backend System Architecture)
- spec/08 (Laws of Agentic Software)
- spec/11 (Hybrid AI + Deterministic Safety Guardrails)
- spec/12 (The 10 Forensic Gap Resolutions)
- spec/13 (Input Sanitization & RBAC)

Dual-mode:
1. Live Mode: Gemini 2.5 Flash via google-genai SDK with function calling
2. Deterministic Offline Fallback: 100% offline rule-graph execution for crash-proof judge walkthroughs.
"""

from datetime import datetime, timezone
import json
import os
import re
import time
from typing import Any, Dict, List, Optional, Tuple

from backend.config import (
    APPROVAL_THRESHOLD_V1,
    APPROVAL_THRESHOLD_V2,
    DEFAULT_REFERENCE_DATETIME,
    GST_RATE,
    LOYALTY_RETURN_WINDOW_EXTENSIONS,
    POLICY_CUTOFF_DATE,
    RESTOCKING_CATEGORIES,
    RESTOCKING_FEE_MAX_CAP,
    RESTOCKING_FEE_RATE,
    RETURN_WINDOWS_V1,
    RETURN_WINDOWS_V2,
)
from backend.db.connection import fetch_all, fetch_one, get_db_connection
from backend.engine.faq_engine import resolve_general_policy_query
from backend.engine.guardrail_interceptor import RuleMerger, SecurityGuardrail, Verdict
from backend.engine.memory import (
    ConversationMemoryManager,
    DisambiguationCache,
    PronounContextResolver,
)
from backend.engine.multi_intent import IntentType, MultiIntentSequencer
from backend.engine.persona_prompts import (
    contain_user_input,
    get_system_prompt,
    sanitize_input,
)
from backend.engine.policy_rules import (
    calculate_delay_goodwill,
    calculate_item_refund,
    calculate_restocking_fee,
    check_abuse_patterns,
    check_return_window,
    compute_shipping_fee_refund,
    determine_policy_version,
    handle_pending_payment,
    requires_human_approval,
    resolve_reference_time,
)
from backend.engine.ticket_schema import Priority, SupportTicket, TicketCategory
from backend.engine.tools import (
    TOOL_REGISTRY,
    TOOL_SCHEMAS,
    calculate_refund,
    check_refund_eligibility,
    create_refund,
    create_return,
    create_support_ticket,
    escalate_to_human,
    get_category_constraints,
    get_conversations,
    get_customer,
    get_customer_orders,
    get_order,
    get_product,
    query_store_policy,
)
from backend.engine.workflow_graph import (
    ADKWorkflowGraph,
    TerminalMove,
    WorkflowContext,
    WorkflowStage,
)


class NovaMartAgentLoop:
    """Executes the complete 9-stage loop for customer requests."""

    def __init__(self, use_gemini: bool = True):
        self.use_gemini = use_gemini
        self.api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        self.memory_manager = ConversationMemoryManager()
        self.pronoun_resolver = PronounContextResolver()

    def process_message(
        self,
        customer_id: str,
        message: str,
        conversation_id: Optional[str] = None,
        reference_time: Optional[datetime] = None,
        offline_mode: bool = False,
        history: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Main execution entrypoint for a single customer message turn."""
        start_time = time.perf_counter()

        # Resolve calendar anchor
        ref_time = resolve_reference_time(reference_time, None)

        effective_conv_id = conversation_id or f"CONV-{customer_id}"
        current_api_key = self.api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        ctx = WorkflowContext(
            customer_id=customer_id,
            message=message,
            conversation_id=effective_conv_id,
            reference_time=ref_time,
            offline_mode=offline_mode or (not current_api_key),
        )
        ctx.collected_entities["client_history"] = history or []

        # ----------------------------------------------------------------------
        # STAGE 01: USER REQUEST
        # ----------------------------------------------------------------------
        ctx.log_stage(WorkflowStage.USER_REQUEST, "Received customer message", {"raw_length": len(message)})
        
        # Verify authenticated customer exists
        customer = fetch_one("SELECT * FROM customers WHERE customer_id = ?", (customer_id,))
        if not customer:
            ctx.terminal_move = TerminalMove.ANSWER
            ctx.response_text = f"I could not verify your account ({customer_id}). Please check your customer ID or register for an account."
            return self._build_result(ctx, start_time)

        # Immediate Suspended Account Gate
        if customer.get("account_status") == "suspended":
            ctx.terminal_move = TerminalMove.ESCALATE
            ticket_res = escalate_to_human(
                customer_id=customer_id,
                order_id=None,
                reason="account_suspended",
                team="Trust & Safety",
                priority="high",
                case_summary="Customer account is suspended; automated support suspended.",
            )
            ctx.created_ticket_id = ticket_res.get("ticket_id")
            ctx.response_text = "Your account is currently under review by our Trust & Safety team. I have transferred your case to a specialist for assistance (Ticket #" + str(ctx.created_ticket_id) + ")."
            return self._build_result(ctx, start_time)

        # ----------------------------------------------------------------------
        # STAGE 02: UNDERSTAND
        # ----------------------------------------------------------------------
        sanitized = SecurityGuardrail.sanitize_user_input(message)
        ctx.sanitized_message = sanitized

        # Check prompt injection / system override attempt
        is_injection = RuleMerger.evaluate_pre_tool(
            intent="inquiry",
            customer_id=customer_id,
            order_record=None,
            tool_call_params={"message": message},
            conversation_context={"sanitized": sanitized},
        )
        if is_injection.is_blocked and (is_injection.rule_name == "PROMPT_INJECTION_DEFENSE" or "Prompt injection" in is_injection.reason):
            ctx.log_stage(WorkflowStage.UNDERSTAND, "Prompt injection attempt neutralized under L1 authority")
            # If adversarial attempt includes demanding refunds/money/overrides:
            if re.search(r"\b(refund|approve|credit|transfer|money|₹|\$|\d{3,})\b", sanitized, re.I):
                ctx.terminal_move = TerminalMove.ESCALATE
                oid_m = re.search(r"\b(ORD-\d{6}|NM-?\d{4,6})\b", sanitized, re.I)
                extracted_oid = oid_m.group(1).upper() if oid_m else None
                ticket_res = escalate_to_human(
                    customer_id=customer_id,
                    order_id=extracted_oid,
                    reason="adversarial_prompt_injection_attempt",
                    team="Trust & Safety",
                    priority="high",
                    case_summary=f"Adversarial prompt injection attempt with unauthorized refund demand: {sanitized}",
                )
                ctx.created_ticket_id = ticket_res.get("ticket_id")
                ctx.response_text = (
                    "I cannot process administrative commands, override instructions, or unauthorized refund demands. "
                    f"Your request has been neutralized under system authority and escalated to our Trust & Safety team for security review (Ticket #{ctx.created_ticket_id})."
                )
                return self._build_result(ctx, start_time)
            elif not re.search(r"ORD-\d+|NM\d+|order|return|broken|damaged|delay", message, re.I):
                ctx.terminal_move = TerminalMove.ANSWER
                ctx.response_text = "I am NovaMart's customer support assistant. I can only assist with verified orders, returns, and catalog queries. How can I assist you with your purchases today?"
                return self._build_result(ctx, start_time)

        # Multi-intent decomposition
        intent_plan = MultiIntentSequencer.decompose_message(sanitized)
        ctx.parsed_intents = [{"id": n.intent_id, "type": n.intent_type.value, "desc": n.description} for n in intent_plan.nodes]
        ctx.log_stage(WorkflowStage.UNDERSTAND, intent_plan.summary, {"intents": ctx.parsed_intents})

        # Memory & Pronoun resolution
        resolved_context = self.pronoun_resolver.resolve_context(sanitized, customer_id)
        ctx.collected_entities["resolved_context"] = resolved_context

        # Pre-check Critical Thermal / Battery Safety Incident Check (Warranty Policy §6)
        if re.search(r"\b(smoke|smoking|spark|sparking|fire|swelling|swollen|overheating|burned|burning)\b", sanitized, re.IGNORECASE):
            ctx.terminal_move = TerminalMove.ESCALATE
            ticket_res = escalate_to_human(
                customer_id=customer_id,
                order_id=None,
                reason="product_safety_incident",
                team="Technical Support",
                priority="critical",
                case_summary=f"CRITICAL SAFETY HAZARD reported: {sanitized}",
            )
            ctx.created_ticket_id = ticket_res.get("ticket_id")
            ctx.response_text = (
                "⚠️ Safety Alert: Please disconnect and stop using or charging the device immediately, and place it in a cool, fire-safe location away from flammable materials.\n\n"
                f"I have escalated this incident to our Technical Support Safety Team under critical priority (Ticket #{ctx.created_ticket_id}). A safety lead will contact you within 15 minutes."
            )
            return self._build_result(ctx, start_time)

        # ----------------------------------------------------------------------
        # STAGE 02b: LIVE MODEL REASONING GATE (Gemini 2.5 Flash via google-genai)
        # ----------------------------------------------------------------------
        if self.use_gemini and not ctx.offline_mode and current_api_key:
            gemini_result = self._execute_gemini_turn(ctx, customer, sanitized, start_time, current_api_key)
            if gemini_result is not None:
                return gemini_result

        # ----------------------------------------------------------------------
        # STAGE 03: COLLECT INFO
        # ----------------------------------------------------------------------
        ctx.log_stage(WorkflowStage.COLLECT_INFO, "Extracting entity identifiers and matching orders")
        
        # 1. Extract Order ID
        order_match = re.search(r"\b(ORD-\d{6}|NM-?\d{4,6})\b", sanitized, re.IGNORECASE)
        order_id = None
        if order_match:
            raw_id = order_match.group(1).upper()
            if raw_id.startswith("NM"):
                # Normalize NM to ORD format or search tracking
                nm_digits = re.sub(r"\D", "", raw_id)
                order_id = f"ORD-{int(nm_digits):06d}"
            else:
                order_id = raw_id
        elif resolved_context.get("resolved_order_id"):
            order_id = resolved_context["resolved_order_id"]

        # Check active turn-to-turn candidate disambiguation cache
        cached_pick = DisambiguationCache.resolve_selection(customer_id, sanitized)
        if cached_pick:
            order_id = cached_pick["order_id"]
            ctx.log_stage(WorkflowStage.COLLECT_INFO, f"Disambiguation resolved to order {order_id}")

        # Check if user mentioned an order ID that does not exist in DB
        if order_match and not order_id:
            order_id = order_match.group(1).upper()

        order_record = None
        if order_id:
            order_record = fetch_one("SELECT * FROM orders WHERE order_id = ?", (order_id,))
            if not order_record:
                # Order does not exist in DB! Per Iron Rule: DO NOT FABRICATE
                ctx.terminal_move = TerminalMove.ASK
                ctx.response_text = f"I couldn't find order {order_id} in your NovaMart account. Could you please double-check the order number or check your order history?"
                ctx.log_stage(WorkflowStage.COLLECT_INFO, f"Non-existent order {order_id} flagged - triggered ASK")
                return self._build_result(ctx, start_time)
            
            # Check ownership
            if order_record["customer_id"] != customer_id:
                ctx.terminal_move = TerminalMove.ANSWER
                ctx.response_text = "For security and privacy reasons, I can only assist with orders placed under your authenticated account."
                return self._build_result(ctx, start_time)
        else:
            # Check if customer inquiry is a general policy/FAQ/catalog query before checking customer orders
            early_faq = resolve_general_policy_query(
                sanitized_message=sanitized,
                customer_id=customer_id,
                active_order=None,
                customer_record=customer,
            )
            if early_faq:
                move, reply_text = early_faq
                ctx.terminal_move = move
                ctx.response_text = reply_text
                ctx.log_stage(WorkflowStage.RETRIEVE_POLICY, "Answered via NovaMart Policy Knowledge Base", {"query": sanitized})
                return self._build_result(ctx, start_time)

            # No explicit order ID in message. Check if customer has multiple orders matching category/product keyword
            orders = fetch_all(
                "SELECT o.*, p.product_name, p.category, oi.final_price, oi.order_item_id FROM orders o "
                "JOIN order_items oi ON o.order_id = oi.order_id "
                "JOIN products p ON oi.product_id = p.product_id "
                "WHERE o.customer_id = ? ORDER BY o.order_date DESC",
                (customer_id,),
            )
            
            # Filter by message keywords (e.g. headphones, earbuds, laptop, phone)
            keywords = ["headphone", "earbud", "audio", "laptop", "tablet", "camera", "monitor", "watch", "speaker", "mouse", "keyboard", "phone"]
            detected_kw = [k for k in keywords if k in sanitized.lower()]
            has_order_action_intent = bool(
                re.search(
                    r"\b(i\s+bought|i\s+ordered|i\s+purchased|my\s+(order|item|package|parcel|headphones?|earbuds?|laptop|phone|tablet|camera|monitor|watch|speaker|mouse|keyboard)|"
                    r"want\s+to\s+return|return\s+the|refund\s+the|cancel\s+the|where\s+is\s+(my|the)|status\s+of\s+(my|the)|tracking\s+for\s+(my|the)|"
                    r"arrived\s+damaged|is\s+broken|defective\s+unit|didn't\s+work)\b",
                    sanitized,
                    re.IGNORECASE,
                )
            )
            if detected_kw and has_order_action_intent:
                seen_orders = set()
                matching_orders = []
                for o in orders:
                    oid = o["order_id"]
                    if oid not in seen_orders:
                        if any(k in o["product_name"].lower() or k in o["category"].lower() for k in detected_kw):
                            seen_orders.add(oid)
                            matching_orders.append(o)
                if len(matching_orders) > 1:
                    # AMBIGUITY DETECTED: Handbook §13 - Do not guess!
                    DisambiguationCache.store_candidates(customer_id, matching_orders)
                    candidate_lines = []
                    for idx, c in enumerate(matching_orders[:3], start=1):
                        delivered_str = f", delivered {c['actual_delivery_date']}" if c.get('actual_delivery_date') else f", status: {c['order_status']}"
                        candidate_lines.append(f"{idx}. {c['order_id']} ({c['product_name']}, ₹{int(c['total_amount']):,}{delivered_str})")
                    
                    ctx.terminal_move = TerminalMove.ASK
                    ctx.response_text = (
                        f"I found {len(matching_orders)} matching orders on your account:\n"
                        + "\n".join(candidate_lines)
                        + "\nWhich order would you like to discuss?"
                    )
                    ctx.log_stage(WorkflowStage.COLLECT_INFO, "Ambiguity detected: multiple matching orders - triggered ASK")
                    return self._build_result(ctx, start_time)
                elif len(matching_orders) == 1:
                    order_record = matching_orders[0]
                    order_id = order_record["order_id"]
            elif orders and has_order_action_intent:
                # Default to latest order if single recent order exists and user asked to act on it
                if len(orders) == 1:
                    order_record = orders[0]
                    order_id = order_record["order_id"]

        # Look up active (in-flight) order for customer context if order_record not determined
        active_order = order_record
        if not active_order:
            active_order = fetch_one(
                "SELECT * FROM orders WHERE customer_id = ? AND order_status IN ('out_for_delivery', 'shipped', 'in_transit', 'processing', 'confirmed', 'placed') ORDER BY order_date DESC LIMIT 1",
                (customer_id,),
            )

        # ----------------------------------------------------------------------
        # STAGE 04: VERIFY
        # ----------------------------------------------------------------------
        ctx.log_stage(WorkflowStage.VERIFY, "Executing deterministic safety assertions")
        
        # 1. Thermal / Battery Safety Incident Check (Warranty Policy §6)
        if re.search(r"\b(smoke|smoking|spark|sparking|fire|swelling|swollen|overheating|burned|burning)\b", sanitized, re.IGNORECASE):
            ctx.terminal_move = TerminalMove.ESCALATE
            ticket_res = escalate_to_human(
                customer_id=customer_id,
                order_id=order_id,
                reason="product_safety_incident",
                team="Technical Support",
                priority="critical",
                case_summary=f"CRITICAL SAFETY HAZARD reported: {sanitized}",
            )
            ctx.created_ticket_id = ticket_res.get("ticket_id")
            ctx.response_text = (
                "⚠️ Safety Alert: Please disconnect and stop using or charging the device immediately, and place it in a cool, fire-safe location away from flammable materials.\n\n"
                f"I have escalated this incident to our Technical Support Safety Team under critical priority (Ticket #{ctx.created_ticket_id}). A safety lead will contact you within 15 minutes."
            )
            return self._build_result(ctx, start_time)

        # 2. Abuse Pattern Check (>5 cancels in 30d, >=3 claims in 90d)
        db_conn = get_db_connection()
        abuse_flag = check_abuse_patterns(customer_id, db_conn, ref_time)
        db_conn.close()
        if abuse_flag:
            ctx.terminal_move = TerminalMove.ESCALATE
            ticket_res = escalate_to_human(
                customer_id=customer_id,
                order_id=order_id,
                reason="repeated_claims_fraud_risk",
                team="Trust & Safety",
                priority="high",
                case_summary=abuse_flag["reason"],
            )
            ctx.created_ticket_id = ticket_res.get("ticket_id")
            ctx.response_text = (
                f"I am escalating your request to our Trust & Safety team for verification (Ticket #{ctx.created_ticket_id}). "
                "A specialist will review your account history and get back to you within 24 hours."
            )
            return self._build_result(ctx, start_time)

        # 3. Delivery Non-Delivery with Verified OTP Contradiction (Iron Rule)
        is_delivery_dispute = bool(re.search(r"\b(never\s+received|didn't\s+receive|did\s+not\s+receive|not\s+delivered|missing\s+parcel)\b", sanitized, re.IGNORECASE))
        if order_record and is_delivery_dispute and order_record.get("delivery_otp_verified"):
            ctx.terminal_move = TerminalMove.ESCALATE
            ticket_res = escalate_to_human(
                customer_id=customer_id,
                order_id=order_id,
                reason="otp_delivery_disputed",
                team="Logistics Desk",
                priority="high",
                case_summary=f"Customer disputes delivery for order {order_id}, but delivery was OTP-verified on {order_record.get('actual_delivery_date')}.",
            )
            ctx.created_ticket_id = ticket_res.get("ticket_id")
            ctx.response_text = (
                f"Our records show that order {order_id} was successfully delivered and verified with a one-time password (OTP) on {order_record.get('actual_delivery_date')}.\n\n"
                "Because OTP-verified deliveries require investigation with the courier logistics team, I have created an investigation ticket (Ticket #"
                + str(ctx.created_ticket_id)
                + "). Our Logistics Desk will review the delivery geotag and courier proof of delivery within 3 business days."
            )
            return self._build_result(ctx, start_time)

        # 4. Alternate Payment Instrument Request (Payment Policy §5)
        if re.search(r"\b(different\s+(account|bank|upi|card)|another\s+(account|bank|upi|card)|wife's|friend's|brother's)\b", sanitized, re.IGNORECASE):
            ctx.terminal_move = TerminalMove.ESCALATE
            ticket_res = escalate_to_human(
                customer_id=customer_id,
                order_id=order_id,
                reason="alternate_refund_destination_requested",
                team="Refunds & Payments",
                priority="medium",
                case_summary="Customer requested refund to an alternate payment instrument in chat.",
            )
            ctx.created_ticket_id = ticket_res.get("ticket_id")
            ctx.response_text = (
                "NovaMart policy strictly mandates that refunds can only be processed to the original payment instrument used during checkout. "
                "We cannot process refunds to a different bank account, UPI ID, or third-party card in chat.\n\n"
                f"If your original account is closed, I have routed your request to Refunds & Payments (Ticket #{ctx.created_ticket_id}) for secure penny-drop verification."
            )
            return self._build_result(ctx, start_time)

        # ----------------------------------------------------------------------
        # STAGE 05: RETRIEVE POLICY & REASONING
        # ----------------------------------------------------------------------
        ctx.log_stage(WorkflowStage.RETRIEVE_POLICY, "Binding policy version and calculating windows")

        # 1. First evaluate General Policy & FAQ inquiries (timelines, return rules, payments)
        faq_eval = resolve_general_policy_query(
            sanitized_message=sanitized,
            customer_id=customer_id,
            active_order=active_order or order_record,
            customer_record=customer,
        )
        if faq_eval:
            move, reply_text = faq_eval
            ctx.terminal_move = move
            ctx.response_text = reply_text
            ctx.log_stage(WorkflowStage.RETRIEVE_POLICY, "Answered via NovaMart Policy Knowledge Base", {"query": sanitized})
            return self._build_result(ctx, start_time)

        if order_record:
            policy_version = determine_policy_version(order_record["order_date"])
            ctx.applicable_policy_version = policy_version

            # Check if this is an Order Tracking query
            if re.search(r"\b(where\s+is|track|status|when\s+will|eta|delivery\s+date)\b", sanitized, re.IGNORECASE) and not re.search(r"\b(refund|return|cancel)\b", sanitized, re.IGNORECASE):
                ctx.terminal_move = TerminalMove.ANSWER
                courier_name = order_record.get("courier") or "our delivery partner"
                status = order_record.get("order_status")
                eta = order_record.get("estimated_delivery_date") or "shortly"
                actual = order_record.get("actual_delivery_date")
                
                if status == "delivered":
                    ctx.response_text = f"Order {order_id} was delivered on {actual} via {courier_name}."
                elif status == "out_for_delivery":
                    ctx.response_text = f"Order {order_id} is out for delivery today with {courier_name} and is expected to arrive by 6 PM. You will receive an SMS once delivered."
                elif status == "shipped" or status == "in_transit":
                    ctx.response_text = f"Order {order_id} is currently in transit with {courier_name}. Expected delivery date is {eta}."
                elif status in ["placed", "confirmed", "processing"]:
                    ctx.response_text = f"Order {order_id} is currently {status} and will be handed over to our courier partner shortly. Expected delivery is {eta}."
                else:
                    ctx.response_text = f"Order {order_id} status is {status}."
                return self._build_result(ctx, start_time)

            # Check if this is an Order Cancellation query
            if re.search(r"\b(cancel|cancellation)\b", sanitized, re.IGNORECASE) and not re.search(r"\b(return|refund)\b", sanitized, re.IGNORECASE):
                status = order_record["order_status"]
                if status in ["placed", "confirmed", "processing"]:
                    # CANCEL PERMITTED (Gap 03: pre-shipment cancel exempt from approval threshold)
                    ctx.terminal_move = TerminalMove.ACT
                    # Update status
                    from backend.db.connection import execute_write
                    execute_write("UPDATE orders SET order_status = 'cancelled', cancellation_status = 'approved', refund_status = 'processed' WHERE order_id = ?", (order_id,))
                    refund_amt = order_record["total_amount"] if order_record["payment_method"] != "cash_on_delivery" else 0.0
                    ctx.response_text = f"Order {order_id} has been successfully cancelled. A full refund of ₹{int(refund_amt):,} (including shipping fee) has been released to your original payment method."
                    return self._build_result(ctx, start_time)
                elif status in ["shipped", "out_for_delivery"]:
                    ctx.terminal_move = TerminalMove.ANSWER
                    ctx.response_text = f"Order {order_id} has already been handed over to the courier ({order_record.get('courier')}) and cannot be cancelled. You can refuse delivery at your doorstep, and a full refund will be processed once the parcel returns to our warehouse."
                    return self._build_result(ctx, start_time)
                else:
                    ctx.terminal_move = TerminalMove.ANSWER
                    ctx.response_text = f"Order {order_id} has already been delivered or closed (status: {status}). Please use our return process if you wish to return it."
                    return self._build_result(ctx, start_time)

            # Check Return / Refund query
            if re.search(r"\b(refund|return|damaged|defective|broken|wrong\s+item)\b", sanitized, re.IGNORECASE):
                # Retrieve order items
                items = fetch_all(
                    "SELECT oi.*, p.product_name, p.category, p.returnable, p.replacement_available FROM order_items oi "
                    "JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?",
                    (order_id,),
                )
                if not items:
                    ctx.terminal_move = TerminalMove.ANSWER
                    ctx.response_text = f"No line items found for order {order_id}."
                    return self._build_result(ctx, start_time)

                target_item = items[0]
                is_damaged = bool(re.search(r"\b(damaged|broken|cracked|defective|faulty|dead)\b", sanitized, re.IGNORECASE))
                reason = "defective" if is_damaged else "change_of_mind"

                # Check evidence guard for damage:
                # If customer is merely reporting damage without an explicit refund command, ask for photo.
                # If customer is explicitly demanding a refund (e.g. demanding ₹10,000 on ORD-007741),
                # evaluate policy window, cap the refund, and take action (ACT).
                has_explicit_refund_demand = bool(re.search(r"\b(give\s+me|refund|credit|pay)\b", sanitized, re.IGNORECASE) and re.search(r"₹?\s*(\d{1,3}(?:,\d{3})*|\d+)", sanitized))
                if is_damaged and not resolved_context.get("evidence_previously_provided") and not re.search(r"\b(photo|image|uploaded|sent|attached)\b", sanitized, re.IGNORECASE) and not has_explicit_refund_demand:
                    ctx.terminal_move = TerminalMove.ASK
                    ctx.response_text = f"I'm sorry to hear that your {target_item['product_name']} arrived damaged. Could you please share a clear photo or video of the damage so we can verify the defect and process your return or replacement?"
                    return self._build_result(ctx, start_time)

                # Check Return Window
                window_eval = check_return_window(
                    order_date=order_record["order_date"],
                    delivery_date=order_record.get("actual_delivery_date") or order_record.get("order_date"),
                    return_reason=reason,
                    loyalty_tier=customer.get("loyalty_tier", "bronze"),
                    reference_time=ref_time,
                )

                if not window_eval["is_within_window"]:
                    ctx.terminal_move = TerminalMove.ANSWER
                    ctx.response_text = (
                        f"Your request for order {order_id} is outside the {window_eval['max_allowed_days']}-day {reason.replace('_', ' ')} window "
                        f"(delivered on {order_record.get('actual_delivery_date')}, {window_eval['elapsed_days']} days ago under Policy {policy_version.upper()}). "
                        "While a refund or return is no longer possible, we would be happy to help you raise a manufacturer warranty claim for service."
                    )
                    return self._build_result(ctx, start_time)

                # Calculate Refund Cap & Restocking
                refund_calc = calculate_item_refund(
                    final_price=target_item["final_price"],
                    return_reason=reason,
                    category=target_item["category"],
                    policy_version=policy_version,
                )

                # Cap check against customer demand (e.g. ₹10,000 demand on ₹2,499 order)
                demand_match = re.search(r"₹?\s*(\d{1,3}(?:,\d{3})*|\d+)\s*(?:refund|rupees)?", sanitized)
                valid_refund = refund_calc["net_refund"]
                
                # Check Approval Threshold
                if requires_human_approval("refund", order_record["order_status"], order_record["total_amount"], policy_version):
                    ctx.terminal_move = TerminalMove.ESCALATE
                    ticket_res = escalate_to_human(
                        customer_id=customer_id,
                        order_id=order_id,
                        reason="approval_threshold_exceeded",
                        team="Refunds & Payments",
                        priority="high",
                        case_summary=f"Order total ₹{int(order_record['total_amount']):,} exceeds approval limit under Policy {policy_version.upper()}.",
                    )
                    ctx.created_ticket_id = ticket_res.get("ticket_id")
                    ctx.response_text = (
                        f"Because the order total (₹{int(order_record['total_amount']):,}) exceeds our Tier 1 approval threshold under Policy {policy_version.upper()}, "
                        f"I have submitted your refund of ₹{int(valid_refund):,} to a Refund Approver for authorization (Ticket #{ctx.created_ticket_id})."
                    )
                    return self._build_result(ctx, start_time)

                # Terminal Move: ACT with Capped Refund
                ctx.terminal_move = TerminalMove.ACT
                refund_res = create_refund(
                    order_id=order_id,
                    amount=valid_refund,
                    reason=reason,
                    destination="original_payment_method",
                )

                restock_note = f" (after ₹{int(refund_calc['restocking_fee']):,} restocking fee)" if refund_calc["restocking_fee"] > 0 else ""
                demanded_val = None
                if demand_match:
                    try:
                        demanded_val = float(demand_match.group(1).replace(",", ""))
                    except Exception:
                        pass
                cap_note = ""
                if demanded_val and demanded_val > valid_refund:
                    cap_note = f"You requested ₹{int(demanded_val):,}, but per NovaMart policy, refunds are strictly capped at the purchase price of ₹{valid_refund:,.2f}. "
                ctx.response_text = (
                    f"I have verified order {order_id} ({target_item['product_name']}). {cap_note}"
                    f"Your return request has been authorized and a capped refund of ₹{valid_refund:,.2f}{restock_note} has been issued to your original payment method. "
                    "Please have the item packed with all accessories for courier pickup within 24–48 hours."
                )
                return self._build_result(ctx, start_time)

        # ----------------------------------------------------------------------
        # Check General FAQ & Policy Knowledge Engine
        # ----------------------------------------------------------------------
        faq_eval = resolve_general_policy_query(
            sanitized_message=sanitized,
            customer_id=customer_id,
            active_order=active_order or order_record,
            customer_record=customer,
        )
        if faq_eval:
            move, reply_text = faq_eval
            ctx.terminal_move = move
            ctx.response_text = reply_text
            ctx.log_stage(WorkflowStage.RETRIEVE_POLICY, "Answered via NovaMart Policy Knowledge Base", {"query": sanitized})
            return self._build_result(ctx, start_time)

        # Check for order status inquiry without explicit order ID
        if re.search(r"\b(where\s+is\s+(my\s+)?order|my\s+order\s+status|track\s+(my\s+)?order|check\s+(my\s+)?order|delivery\s+update|any\s+orders?)\b", sanitized, re.IGNORECASE):
            if active_order:
                status = active_order.get("order_status")
                oid = active_order.get("order_id")
                courier = active_order.get("courier") or "SwiftLane"
                eta = active_order.get("estimated_delivery_date") or "today"
                ctx.terminal_move = TerminalMove.ANSWER
                if status == "out_for_delivery":
                    ctx.response_text = f"Your order {oid} is currently out for delivery today with {courier} and is scheduled to reach you by 6:00 PM!"
                elif status in ["shipped", "in_transit"]:
                    ctx.response_text = f"Your order {oid} is currently in transit with {courier}. Expected delivery date is {eta}."
                else:
                    ctx.response_text = f"Your order {oid} is currently {status}. Our team is preparing your package for dispatch (Expected: {eta})."
                return self._build_result(ctx, start_time)
            else:
                # Check recent orders on customer account
                recent_orders = fetch_all(
                    "SELECT order_id, order_status, total_amount, actual_delivery_date, order_date FROM orders WHERE customer_id = ? ORDER BY order_date DESC LIMIT 3",
                    (customer_id,),
                )
                if recent_orders:
                    ctx.terminal_move = TerminalMove.ANSWER
                    lines = []
                    for o in recent_orders:
                        dt = o.get("actual_delivery_date") or o.get("order_date", "").split(" ")[0]
                        lines.append(f"• **{o['order_id']}**: Status `{o['order_status']}` (Total: ₹{int(o['total_amount']):,}, {dt})")
                    ctx.response_text = (
                        "You don't have any in-flight packages right now. Here are your most recent orders:\n"
                        + "\n".join(lines)
                        + "\n\nIf you need help with returns, refunds, or details for any of these, just let me know the Order ID!"
                    )
                    return self._build_result(ctx, start_time)
                else:
                    ctx.terminal_move = TerminalMove.ANSWER
                    ctx.response_text = "You do not have any active or previous orders on your NovaMart account yet. Once you place an order, you can track it live right here!"
                    return self._build_result(ctx, start_time)

        # Check for friendly greeting
        if re.search(r"^(hi|hello|hey|good\s+morning|good\s+afternoon|good\s+evening|namaste|greetings)\b", sanitized, re.IGNORECASE):
            ctx.terminal_move = TerminalMove.ANSWER
            cust_name = customer.get("first_name") or "there"
            ctx.response_text = f"Hello {cust_name}! 👋 Welcome to NovaMart Support. How can I assist you today? You can ask about order tracking, delivery timelines, return & refund policies, product recommendations, or warranty."
            return self._build_result(ctx, start_time)

        # Check for assistant identity and capabilities
        if re.search(r"\b(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+novamart|how\s+can\s+you\s+help|what\s+do\s+you\s+do)\b", sanitized, re.IGNORECASE):
            ctx.terminal_move = TerminalMove.ANSWER
            ctx.response_text = (
                "I am **NovaMart AI Customer Support Assistant**! 🛒✨\n\n"
                "I can assist you with:\n"
                "• **Live Order Tracking**: Instant status and courier updates on your parcels.\n"
                "• **Returns & Refunds**: Checking return windows, calculating restocking fees, and authorizing capped refunds.\n"
                "• **Order Cancellations**: Instant pre-shipment cancellations with 100% refund.\n"
                "• **Policy Information**: Delivery timelines, warranty claims, and accepted payment methods.\n"
                "• **Product Catalog**: Checking electronics, gadgets, and grocery availability.\n"
                "• **Human Escalations**: Dispatching priority tickets to Logistics, Payments, and Technical Support.\n\n"
                "How can I assist you today?"
            )
            return self._build_result(ctx, start_time)

        # Fallback general query with helpful domain guidance
        ctx.terminal_move = TerminalMove.ANSWER
        cust_name = customer.get("first_name") or "there"
        
        # Check if customer has recent orders to provide quick reference
        recent_orders = fetch_all(
            "SELECT order_id, order_status, total_amount, actual_delivery_date, order_date FROM orders WHERE customer_id = ? ORDER BY order_date DESC LIMIT 2",
            (customer_id,),
        )
        order_hint = ""
        if recent_orders:
            order_lines = [f"• **{o['order_id']}** (Status: `{o['order_status']}`, Total: ₹{int(o['total_amount']):,})" for o in recent_orders]
            order_hint = "\n\n📦 **Your Recent Orders**:\n" + "\n".join(order_lines) + "\n*(Share any Order ID above to track, cancel, or initiate a return)*"

        ctx.response_text = (
            f"Hello {cust_name}! I'm happy to help you with your inquiry. "
            "I can assist you with:\n"
            "• **Delivery & Shipping**: Timelines across India (3–5 days metro, 10–15 min quick groceries), charges (free over ₹1,000), and OTP verification.\n"
            "• **Returns & Refunds**: 7-day change-of-mind / 10-day defect windows, restocking fee rules, and refund status.\n"
            "• **Orders & Tracking**: Live status, courier details, and pre-shipment cancellations.\n"
            "• **Products & Warranty**: Official brand warranty (12–24 months) and catalog recommendations.\n"
            "• **Customer Care**: Toll-free helpline (1800-419-NOVA) and escalation to human specialists."
            f"{order_hint}\n\n"
            "Could you please share a bit more detail about what you need assistance with?"
        )
        return self._build_result(ctx, start_time)

    def _execute_gemini_turn(
        self,
        ctx: WorkflowContext,
        customer: Dict[str, Any],
        sanitized_input: str,
        start_time: float,
        api_key: str,
    ) -> Optional[Dict[str, Any]]:
        """Executes a live Gemini 2.5 Flash reasoning turn with official google-genai SDK tools."""
        try:
            import functools
            from google import genai
            from google.genai import types

            # Query customer's orders directly from SQLite
            cust_orders = fetch_all(
                "SELECT order_id, order_date, order_status, total_amount, estimated_delivery_date, actual_delivery_date, tracking_number, courier FROM orders WHERE customer_id = ? ORDER BY order_date DESC LIMIT 10",
                (customer.get("customer_id"),),
            )
            ongoing_orders = [o for o in cust_orders if (o.get("order_status") or "").lower() in ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "in_transit"]]
            delivered_orders = [o for o in cust_orders if (o.get("order_status") or "").lower() == "delivered"]

            order_lines = []
            for o in cust_orders:
                order_lines.append(
                    f"• {o.get('order_id')}: Placed {o.get('order_date')}, Status '{o.get('order_status')}', Total ₹{o.get('total_amount')}, Courier: {o.get('courier')} ({o.get('tracking_number')})"
                )
            orders_str = "\n".join(order_lines) if order_lines else "No orders found in database."

            cust_context = (
                f"Customer ID: {customer.get('customer_id')}\n"
                f"Name: {customer.get('first_name')} {customer.get('last_name')}\n"
                f"Email: {customer.get('email')}\n"
                f"Phone: {customer.get('phone')}\n"
                f"City: {customer.get('city')}, {customer.get('state')}\n"
                f"Loyalty Tier: {customer.get('loyalty_tier', 'bronze')}\n"
                f"Account Status: {customer.get('account_status', 'active')}\n"
                f"Total Spend: ₹{customer.get('total_spend', 0)}\n\n"
                f"=== SQLite DATABASE GROUND TRUTH: CUSTOMER ORDERS ===\n"
                f"Total Orders: {len(cust_orders)} | Ongoing/In-Transit Orders: {len(ongoing_orders)} | Delivered Orders: {len(delivered_orders)}\n"
                f"{orders_str}\n\n"
                f"CRITICAL GROUND TRUTH RULES:\n"
                f"1. When customer asks if they have ANY ongoing, pending, or in-transit orders, refer to the count above: There are {len(ongoing_orders)} ongoing orders and {len(delivered_orders)} delivered orders. If ongoing orders is 0, explicitly tell them all orders have already been delivered and they have 0 ongoing orders!\n"
                f"2. Never claim you are 'checking' and then stop. The ground truth data is right above. Answer immediately with facts!"
            )

            # Build multi-turn conversational transcript and SDK history
            client_history = ctx.collected_entities.get("client_history") or []
            gemini_history = []
            dialogue_turns = []

            if client_history:
                for h in client_history:
                    r = (h.get("role") or "user").lower()
                    c = h.get("content") or h.get("text") or ""
                    if not c.strip():
                        continue
                    genai_role = "user" if r in ["user", "customer"] else "model"
                    dialogue_turns.append(f"{genai_role.upper()}: {c}")
                    gemini_history.append(
                        types.Content(
                            role=genai_role,
                            parts=[types.Part.from_text(text=c)],
                        )
                    )
            else:
                db_hist = self.memory_manager.get_recent_history(customer.get("customer_id"))
                if db_hist:
                    dialogue_turns.append(db_hist)

            memory_context = f"=== ACTIVE MULTI-TURN CONVERSATION TRANSCRIPT ===\n" + "\n".join(dialogue_turns) if dialogue_turns else ""
            ref_time_str = ctx.reference_time.strftime("%Y-%m-%d %H:%M:%S")

            system_prompt = get_system_prompt(
                customer_context=cust_context,
                memory_context=memory_context,
                reference_time=ref_time_str,
            )

            untrusted_user_envelope = contain_user_input(sanitized_input)

            mutated_action = {"performed": False, "type": "ANSWER", "ticket_id": None}

            def wrap_tool(fn, tool_name: str):
                @functools.wraps(fn)
                def tool_wrapper(**kwargs):
                    ctx.log_stage(WorkflowStage.ACT, f"Gemini invoked tool '{tool_name}'", kwargs)

                    varnames = fn.__code__.co_varnames
                    if "customer_id" in varnames and not kwargs.get("customer_id"):
                        kwargs["customer_id"] = customer.get("customer_id")
                    if "authenticated_customer_id" in varnames and not kwargs.get("authenticated_customer_id"):
                        kwargs["authenticated_customer_id"] = customer.get("customer_id")
                    if "reference_time" in varnames and not kwargs.get("reference_time"):
                        kwargs["reference_time"] = ref_time_str

                    if tool_name in ["create_refund", "create_return"]:
                        order_rec = None
                        if kwargs.get("order_id"):
                            order_rec = fetch_one("SELECT * FROM orders WHERE order_id = ?", (kwargs["order_id"],))
                        verdict = RuleMerger.evaluate_pre_tool(
                            intent="refund" if tool_name == "create_refund" else "return",
                            customer_id=customer.get("customer_id"),
                            order_record=order_rec,
                            tool_call_params=kwargs,
                            conversation_context={"sanitized": sanitized_input},
                        )
                        if verdict.is_blocked:
                            ctx.log_stage(
                                WorkflowStage.VERIFY,
                                f"RuleMerger blocked mutation tool '{tool_name}'",
                                {"reason": verdict.reason},
                            )
                            return {
                                "status": "BLOCKED",
                                "error": verdict.rule_name,
                                "reason": verdict.reason,
                                "suggested_action": verdict.suggested_action,
                            }

                    res = fn(**kwargs)

                    if tool_name in ["create_refund", "create_return"]:
                        mutated_action["performed"] = True
                        mutated_action["type"] = "ACT"
                    elif tool_name in ["create_support_ticket", "escalate_to_human"]:
                        mutated_action["performed"] = True
                        mutated_action["type"] = "ESCALATE"
                        if isinstance(res, dict) and res.get("ticket_id"):
                            mutated_action["ticket_id"] = res["ticket_id"]
                            ctx.created_ticket_id = res["ticket_id"]

                    stage_to_log = WorkflowStage.RETRIEVE_POLICY if ("policy" in tool_name or "category" in tool_name) else WorkflowStage.ACT
                    ctx.log_stage(stage_to_log, f"Tool '{tool_name}' returned", {"result_summary": str(res)[:200]})
                    return res

                return tool_wrapper

            wrapped_tools = [
                wrap_tool(get_customer, "get_customer"),
                wrap_tool(get_customer_orders, "get_customer_orders"),
                wrap_tool(get_order, "get_order"),
                wrap_tool(get_product, "get_product"),
                wrap_tool(get_conversations, "get_conversations"),
                wrap_tool(check_refund_eligibility, "check_refund_eligibility"),
                wrap_tool(calculate_refund, "calculate_refund"),
                wrap_tool(create_return, "create_return"),
                wrap_tool(create_refund, "create_refund"),
                wrap_tool(create_support_ticket, "create_support_ticket"),
                wrap_tool(escalate_to_human, "escalate_to_human"),
                wrap_tool(query_store_policy, "query_store_policy"),
                wrap_tool(get_category_constraints, "get_category_constraints"),
            ]

            client = genai.Client(api_key=api_key)
            primary_model = os.environ.get("MODEL_NAME") or "gemini-3.6-flash"
            candidate_models = [primary_model]
            for fallback in ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.1-flash-lite"]:
                if fallback not in candidate_models:
                    candidate_models.append(fallback)

            config = types.GenerateContentConfig(
                system_instruction=system_prompt,
                tools=wrapped_tools,
                temperature=0.2,
                automatic_function_calling=types.AutomaticFunctionCallingConfig(maximum_remote_calls=5),
            )

            response = None
            successful_model = None
            for model_name in candidate_models:
                try:
                    ctx.log_stage(WorkflowStage.REASON, f"Executing live Gemini reasoning turn (model: {model_name})")
                    chat = client.chats.create(model=model_name, config=config, history=gemini_history if gemini_history else None)
                    resp = chat.send_message(untrusted_user_envelope)
                    if resp and resp.text:
                        response = resp
                        successful_model = model_name
                        break
                except Exception as model_err:
                    ctx.log_stage(
                        WorkflowStage.REASON,
                        f"Model {model_name} unavailable: {type(model_err).__name__}",
                        {"error": str(model_err)[:150]}
                    )
                    continue

            if not response or not response.text:
                ctx.log_stage(
                    WorkflowStage.RETRIEVE_POLICY,
                    "Gemini live execution fallback (all candidate models exhausted)",
                    {"candidates": candidate_models},
                )
                return None

            clean_text = response.text.strip()
            move_match = re.search(r"[\*\_\(]*\s*(?:TERMINAL\s+MOVE:?\s*)?(ANSWER|ASK|ACT|ESCALATE)\s*[\*\_\)]*$", clean_text, flags=re.IGNORECASE)
            explicit_move = move_match.group(1).upper() if move_match else None
            clean_text = re.sub(r"\n*[\*\_\(]*\s*(?:TERMINAL\s+MOVE:?\s*)?(ANSWER|ASK|ACT|ESCALATE)\s*[\*\_\)]*\n*$", "", clean_text, flags=re.IGNORECASE).strip()
            ctx.response_text = clean_text

            if mutated_action["performed"]:
                ctx.terminal_move = TerminalMove.ACT if mutated_action["type"] == "ACT" else TerminalMove.ESCALATE
                if mutated_action["ticket_id"]:
                    ctx.created_ticket_id = mutated_action["ticket_id"]
            elif explicit_move:
                ctx.terminal_move = TerminalMove[explicit_move]
            else:
                is_question = bool(re.search(r"\b(which\s+(order|item|one)|could\s+you\s+(please\s+)?(provide|clarify|share|specify)|can\s+you\s+(please\s+)?confirm|\?)\b", ctx.response_text, re.IGNORECASE))
                if is_question and any(k in ctx.response_text.lower() for k in ["which order", "which of your", "order id", "photo", "share a"]):
                    ctx.terminal_move = TerminalMove.ASK
                else:
                    ctx.terminal_move = TerminalMove.ANSWER

            ctx.log_stage(WorkflowStage.VERIFY_RESULT, f"Delivered response via Gemini ({successful_model}, {ctx.terminal_move.value})")
            return self._build_result(ctx, start_time)

        except Exception as e:
            ctx.log_stage(
                WorkflowStage.RETRIEVE_POLICY,
                f"Gemini live execution fallback ({type(e).__name__}: {str(e)})",
                {"error": str(e)},
            )
            return None

    def _build_result(self, ctx: WorkflowContext, start_time: float) -> Dict[str, Any]:
        """Constructs final standardized audit envelope."""
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        res = {
            "customer_id": ctx.customer_id,
            "terminal_move": ctx.terminal_move.value,
            "response": ctx.response_text,
            "created_ticket_id": ctx.created_ticket_id,
            "execution_time_ms": elapsed_ms,
            "audit_trace": ctx.execution_trace,
        }
        # Persist conversation turn to SQLite memory
        try:
            conv_id = ctx.conversation_id or f"CONV-{ctx.customer_id}"
            if ctx.message:
                self.memory_manager.store_message(conv_id, "user", ctx.message)
            if ctx.response_text:
                self.memory_manager.store_message(conv_id, "assistant", ctx.response_text)
        except Exception:
            pass
        return res
