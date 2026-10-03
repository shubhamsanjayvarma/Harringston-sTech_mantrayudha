"""NovaMart Hybrid Safety Interceptor and Guardrail Engine.

Adapted from clinical-safety-agent hybrid deterministic architecture.
Enforces immovable pre-flight barriers, input sanitization, data scrubbing,
and the Golden Invariant: If verdict is BLOCK, no mutation tool can execute.
"""

from __future__ import annotations

import html
import re
import unicodedata
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set, Union

from backend.engine.policy_rules import (
    determine_policy_version,
    requires_human_approval,
)


# ---------------------------------------------------------------------------
# Data Models & Verdict
# ---------------------------------------------------------------------------

@dataclass
class Verdict:
    """Represents the deterministic outcome of a pre-tool execution evaluation."""
    verdict: str  # "BLOCK", "PASS", "WARN"
    reason: str
    terminal_action: str  # "ANSWER", "ASK", "ACT", "ESCALATE"
    rule_name: Optional[str] = None
    escalation_team: Optional[str] = None
    escalation_priority: Optional[str] = "medium"  # "low", "medium", "high", "critical"
    override_params: Optional[Dict[str, Any]] = None
    user_message: Optional[str] = None
    is_blocked: bool = False

    def __post_init__(self) -> None:
        if self.verdict == "BLOCK":
            self.is_blocked = True


# ---------------------------------------------------------------------------
# Security Guardrail (PII, Ingestion Sanitization, Scrubbing)
# ---------------------------------------------------------------------------

class SecurityGuardrail:
    """Security filter for raw inputs, data exposure, and RBAC enforcement."""

    SENSITIVE_KEYS: Set[str] = {
        "delivery_otp_verified",
        "driver_phone",
        "route_id",
        "route_ids",
        "driver_id",
        "secret",
        "token",
        "password",
        "internal_notes",
        "fraud_risk_score",
    }

    # Banned control characters and directional overrides
    CONTROL_CHAR_REGEX = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u202A-\u202E]")
    CONSECUTIVE_SPACE_REGEX = re.compile(r"[ \t]{10,}")

    @classmethod
    def sanitize_user_input(cls, raw_text: Optional[str]) -> str:
        """Sanitize raw user input to defang injection, XSS, and exploit attempts.
        
        1. Strip null bytes and control chars.
        2. Unicode normalization (NFKC).
        3. Remove directional overrides (e.g. U+202E).
        4. Compress excessive whitespace (>10 spaces).
        5. HTML entity escape (<script>, <img>, etc.).
        6. Length cap (1000 characters).
        """
        if not raw_text:
            return ""

        # 1. Strip null bytes & control chars
        cleaned = cls.CONTROL_CHAR_REGEX.sub("", str(raw_text))

        # 2. Unicode NFKC normalization
        cleaned = unicodedata.normalize("NFKC", cleaned)

        # 3. Collapse excessive whitespace
        cleaned = cls.CONSECUTIVE_SPACE_REGEX.sub(" ", cleaned)

        # 4. HTML entity escape to defang scripts & HTML injection
        cleaned = html.escape(cleaned.strip())

        # 5. Length cap
        return cleaned[:1000]

    @classmethod
    def check_data_access_violation(
        cls,
        customer_id: str,
        requested_entity_owner_id: str,
    ) -> bool:
        """Enforce strict horizontal access control (RBAC).
        
        Returns True if there is an access violation (customer_id != requested owner).
        """
        if not customer_id or not requested_entity_owner_id:
            return True
        return customer_id.strip() != requested_entity_owner_id.strip()

    @classmethod
    def scrub_sensitive_fields(cls, payload: Any) -> Any:
        """Recursively scrub internal-only or security-sensitive fields from payloads.
        
        Suppresses delivery_otp_verified, courier driver phone, route IDs, and secrets.
        """
        if isinstance(payload, dict):
            cleaned_dict = {}
            for k, v in payload.items():
                if k.lower() in cls.SENSITIVE_KEYS:
                    continue
                cleaned_dict[k] = cls.scrub_sensitive_fields(v)
            return cleaned_dict
        elif isinstance(payload, list):
            return [cls.scrub_sensitive_fields(item) for item in payload]
        else:
            return payload


# ---------------------------------------------------------------------------
# Rule Merger (The Clinical Safety Gatekeeper)
# ---------------------------------------------------------------------------

class RuleMerger:
    """Hybrid rule merger evaluating proposed agent moves before database mutation.
    
    The Golden Invariant: If verdict is BLOCK, no tool mutation can proceed.
    """

    PROMPT_INJECTION_PATTERNS = [
        re.compile(r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions", re.IGNORECASE),
        re.compile(r"system\s+(override|prompt|command|instructions)", re.IGNORECASE),
        re.compile(r"you\s+are\s+now\s+in\s+(debug|developer|admin|root|god)\s+mode", re.IGNORECASE),
        re.compile(r"(repeat|print|reveal|leak|show)\s+(your\s+)?(initial\s+|system\s+)?prompt", re.IGNORECASE),
        re.compile(r"override\s+all\s+(checks|rules|policies)", re.IGNORECASE),
        re.compile(r"dan\s+mode|jailbreak", re.IGNORECASE),
    ]

    SAFETY_HAZARD_PATTERNS = [
        re.compile(r"\b(swollen|swelling|bulging)\s+battery\b", re.IGNORECASE),
        re.compile(r"\bbattery\s+(swollen|swelling|bulging|expanded)\b", re.IGNORECASE),
        re.compile(r"\b(overheating|extremely\s+hot|caught\s+fire|sparking|sparks)\b", re.IGNORECASE),
        re.compile(r"\b(burning\s+smell|smell\s+of\s+burning|smoke|smoking)\b", re.IGNORECASE),
        re.compile(r"\b(electric\s+shock|shocking\s+me)\b", re.IGNORECASE),
    ]

    NON_DELIVERY_PATTERNS = [
        re.compile(r"\b(never\s+received|not\s+received|did\s+not\s+receive|didn't\s+receive)\b", re.IGNORECASE),
        re.compile(r"\b(never\s+arrived|not\s+arrived|did\s+not\s+arrive|package\s+missing)\b", re.IGNORECASE),
        re.compile(r"\b(marked\s+delivered\s+but\s+not|not\s+delivered)\b", re.IGNORECASE),
    ]

    LEGAL_THREAT_PATTERNS = [
        re.compile(r"\b(lawyer|attorney|sue\s+you|suing|consumer\s+court|legal\s+notice)\b", re.IGNORECASE),
    ]

    @classmethod
    def is_prompt_injection(cls, text: str) -> bool:
        """Detect prompt injection attempts in customer input."""
        if not text:
            return False
        return any(pattern.search(text) for pattern in cls.PROMPT_INJECTION_PATTERNS)

    @classmethod
    def has_safety_hazard(cls, text: str) -> bool:
        """Detect critical hardware or life-safety threats."""
        if not text:
            return False
        return any(pattern.search(text) for pattern in cls.SAFETY_HAZARD_PATTERNS)

    @classmethod
    def has_non_delivery_claim(cls, text: str) -> bool:
        """Detect customer asserting an item was not delivered."""
        if not text:
            return False
        return any(pattern.search(text) for pattern in cls.NON_DELIVERY_PATTERNS)

    @classmethod
    def has_legal_threat(cls, text: str) -> bool:
        """Detect legal threats or consumer court mentions."""
        if not text:
            return False
        return any(pattern.search(text) for pattern in cls.LEGAL_THREAT_PATTERNS)

    @classmethod
    def evaluate_pre_tool(
        cls,
        intent: str,
        customer_id: str,
        order_record: Optional[Dict[str, Any]],
        tool_call_params: Optional[Dict[str, Any]] = None,
        conversation_context: Optional[Dict[str, Any]] = None,
    ) -> Verdict:
        """Pre-flight interceptor for tool execution requests.
        
        Evaluates the 6 mandatory blocks plus access controls before allowing mutations.
        """
        tool_call_params = tool_call_params or {}
        conversation_context = conversation_context or {}
        user_message_text = str(conversation_context.get("latest_user_message") or "")
        combined_text = f"{intent} {user_message_text} {str(tool_call_params)}"

        # -------------------------------------------------------------------
        # Block 6: Prompt Injection Defense
        # -------------------------------------------------------------------
        if cls.is_prompt_injection(combined_text):
            return Verdict(
                verdict="BLOCK",
                rule_name="PROMPT_INJECTION_DEFENSE",
                reason="Prompt injection / system override pattern detected. Untrusted customer command disregarded.",
                terminal_action="ANSWER",
                user_message=(
                    "I am unable to process administrative commands or override instructions. "
                    "I am NovaMart's customer support assistant and can help you with orders, returns, and deliveries."
                ),
            )

        # -------------------------------------------------------------------
        # Block 3: Hardware / Battery Safety Critical Protocol
        # -------------------------------------------------------------------
        if cls.has_safety_hazard(combined_text):
            return Verdict(
                verdict="BLOCK",
                reason="Critical product safety incident detected (battery/thermal/fire/shock hazard).",
                terminal_action="ESCALATE",
                escalation_team="Technical Support",
                escalation_priority="critical",
                user_message=(
                    "CRITICAL SAFETY ADVICE: Please immediately stop using the device, disconnect any chargers, "
                    "and place the device in a cool, fire-safe location away from flammable items. "
                    "I have escalated this incident to our Technical Support Safety Lead with critical priority."
                ),
            )

        # -------------------------------------------------------------------
        # Legal Threat Escalation
        # -------------------------------------------------------------------
        if cls.has_legal_threat(combined_text):
            return Verdict(
                verdict="BLOCK",
                reason="Legal dispute / consumer court threat detected.",
                terminal_action="ESCALATE",
                escalation_team="Customer Experience",
                escalation_priority="high",
                user_message=(
                    "I understand your concern. To ensure this matter receives appropriate legal and policy review, "
                    "I am transferring your case to our Customer Experience Senior Specialist team."
                ),
            )

        # -------------------------------------------------------------------
        # Cross-Account RBAC Violation Check
        # -------------------------------------------------------------------
        if order_record:
            order_owner = str(order_record.get("customer_id") or "")
            if order_owner and SecurityGuardrail.check_data_access_violation(customer_id, order_owner):
                return Verdict(
                    verdict="BLOCK",
                    reason="Access control violation: Order does not belong to authenticated customer.",
                    terminal_action="ANSWER",
                    user_message=(
                        "For security and privacy reasons, I can only provide assistance with orders "
                        "placed under your authenticated account."
                    ),
                )

        # -------------------------------------------------------------------
        # Block 5: Disambiguation Check (2+ matching candidate orders)
        # -------------------------------------------------------------------
        candidate_orders = conversation_context.get("matching_orders")
        if candidate_orders and len(candidate_orders) > 1 and not tool_call_params.get("order_id"):
            candidates_formatted = "\n".join(
                f"- Order {c.get('order_id')}: {c.get('product_name', 'Item')} "
                f"(Delivered: {c.get('delivery_date', 'N/A')}, Total: Rs {c.get('total_amount', 'N/A')})"
                for c in candidate_orders
            )
            return Verdict(
                verdict="BLOCK",
                reason="Multiple candidate orders match the request. Customer disambiguation required.",
                terminal_action="ASK",
                user_message=(
                    f"I found {len(candidate_orders)} matching orders in your account. "
                    f"Which one would you like assistance with?\n{candidates_formatted}"
                ),
            )

        # -------------------------------------------------------------------
        # Customer Standing Check (Suspended Account)
        # -------------------------------------------------------------------
        customer_standing = conversation_context.get("account_status", "active")
        if customer_standing == "suspended" and intent in {"create_refund", "create_return", "cancel_order"}:
            return Verdict(
                verdict="BLOCK",
                reason="Customer account is suspended. State mutations are prohibited.",
                terminal_action="ESCALATE",
                escalation_team="Trust & Safety",
                escalation_priority="high",
                user_message=(
                    "Your account is currently under administrative review. "
                    "I have routed your request to our Trust & Safety team for assistance."
                ),
            )

        # If evaluating a mutation action against an order record
        if order_record:
            # ---------------------------------------------------------------
            # Block 1: Disputed Delivery with OTP Verified
            # ---------------------------------------------------------------
            otp_verified = bool(order_record.get("delivery_otp_verified"))
            is_non_delivery_intent = (
                intent in {"not_delivered", "claim_non_delivery"}
                or cls.has_non_delivery_claim(combined_text)
                or tool_call_params.get("reason") in {"not_delivered", "lost_in_transit"}
            )
            if otp_verified and is_non_delivery_intent and intent in {"create_refund", "create_return", "check_refund_eligibility", "not_delivered"}:
                return Verdict(
                    verdict="BLOCK",
                    rule_name="OTP_CONTRADICTION_DEFENSE",
                    reason="Order delivery was verified via customer OTP. Under Shipping Policy, non-delivery claims require Logistics investigation.",
                    terminal_action="ESCALATE",
                    escalation_team="Logistics Desk",
                    escalation_priority="high",
                    user_message=(
                        "Our courier records confirm that delivery for this order was verified using a secure OTP. "
                        "Because of this verification, an automated refund cannot be issued. "
                        "I have escalated your case to our Logistics Desk for a formal courier investigation."
                    ),
                )

            # ---------------------------------------------------------------
            # Block 2: Alternate Refund Destination Block
            # ---------------------------------------------------------------
            requested_destination = tool_call_params.get("destination")
            has_alternate_dest_text = bool(
                re.search(r"\b(refund\s+to\s+(my\s+)?(other|different|another|new)\s+(bank|upi|account|card))\b", combined_text, re.I)
                or re.search(r"\b(send\s+to\s+upi|my\s+upi\s+id\s+is|bank\s+transfer)\b", user_message_text, re.I)
            )
            payment_method = str(order_record.get("payment_method") or "").lower()

            if requested_destination and requested_destination not in {"original_payment_method", "wallet"}:
                return Verdict(
                    verdict="BLOCK",
                    reason="Refund destination must strictly be original payment method or wallet.",
                    terminal_action="ESCALATE",
                    escalation_team="Refunds & Payments",
                    escalation_priority="medium",
                    user_message=(
                        "NovaMart policy strictly requires refunds to be processed to the original payment method. "
                        "We cannot send funds to a different card or UPI ID in chat. "
                        "I am transferring this to our Payments team for verification."
                    ),
                )

            if has_alternate_dest_text and payment_method != "cod":
                return Verdict(
                    verdict="BLOCK",
                    reason="Customer requested refund to alternate bank/UPI account.",
                    terminal_action="ESCALATE",
                    escalation_team="Refunds & Payments",
                    escalation_priority="medium",
                    user_message=(
                        "For financial security, refunds are strictly credited back to the original payment instrument. "
                        "If your original account is closed, our Payments team can verify your new details via a secure process."
                    ),
                )

            # ---------------------------------------------------------------
            # Human Approval Threshold Check
            # ---------------------------------------------------------------
            total_amount = float(order_record.get("total_amount") or 0.0)
            order_date = order_record.get("order_date")
            policy_version = determine_policy_version(order_date) if order_date else "v2"
            order_status = str(order_record.get("order_status") or "")

            if intent in {"create_refund", "create_return", "approve_replacement"}:
                if requires_human_approval(intent, order_status, total_amount, policy_version):
                    threshold = 100000.0 if policy_version == "v1" else 75000.0
                    return Verdict(
                        verdict="BLOCK",
                        reason=(
                            f"Order total (Rs {total_amount:,.2f}) exceeds the {policy_version} "
                            f"human approval threshold (Rs {threshold:,.2f})."
                        ),
                        terminal_action="ESCALATE",
                        escalation_team="Refunds & Payments",
                        escalation_priority="high",
                        user_message=(
                            f"Because this order's total value (Rs {total_amount:,.2f}) exceeds the automated approval limit, "
                            "this request requires review by our Refunds & Payments specialist team before release."
                        ),
                    )

            # ---------------------------------------------------------------
            # Block 4: Refund Amount requested > allowable limit
            # ---------------------------------------------------------------
            if intent in {"create_refund", "calculate_refund"}:
                requested_amt = float(tool_call_params.get("amount") or 0.0)
                max_allowable = total_amount
                if requested_amt > max_allowable and max_allowable > 0:
                    capped_amt = round(max_allowable, 2)
                    return Verdict(
                        verdict="WARN",
                        reason=f"Requested refund amount Rs {requested_amt:.2f} exceeds order total Rs {max_allowable:.2f}. Capped to maximum.",
                        terminal_action="ACT",
                        override_params={"amount": capped_amt},
                        user_message=(
                            f"Note: NovaMart policy caps the maximum refund at the total order value of Rs {capped_amt:.2f}. "
                            "Excess claims cannot be approved."
                        ),
                    )

            # ---------------------------------------------------------------
            # Defect / Damage Evidence Verification Gate
            # ---------------------------------------------------------------
            if intent in {"create_return", "create_replacement"}:
                reason = str(tool_call_params.get("return_reason") or "").lower()
                evidence_verified = bool(tool_call_params.get("evidence_verified", False))
                if reason in {"defective", "damaged_in_transit", "damaged", "wrong_item"} and not evidence_verified:
                    return Verdict(
                        verdict="BLOCK",
                        reason="Mandatory photo/video evidence has not been verified for defective/damaged claim.",
                        terminal_action="ASK",
                        user_message=(
                            "To process a return or replacement for a damaged or defective item, "
                            "please provide clear photos showing the damaged product, the serial number/IMEI, and outer packaging."
                        ),
                    )

        # -------------------------------------------------------------------
        # Default: PASS
        # -------------------------------------------------------------------
        return Verdict(
            verdict="PASS",
            reason="All deterministic guardrails and security checks passed.",
            terminal_action="ACT",
        )
