"""
NovaMart Bounded Deterministic Tools & Gemini Function Calling Schemas.
Implements the 10 core tools with Pydantic validation, ground truth DB querying,
redaction guards, and authorization assertions.
Strictly follows spec/04, spec/08, spec/10, and spec/12.
"""

from datetime import datetime, timezone
import json
import random
import re
from typing import Any, Callable, Dict, List, Optional
from pydantic import BaseModel, Field, ValidationError

from backend.config import (
    APPROVAL_THRESHOLD_V1,
    APPROVAL_THRESHOLD_V2,
    GST_RATE,
    LOYALTY_RETURN_WINDOW_EXTENSIONS,
    POLICY_CUTOFF_DATE_STR,
    RESTOCKING_CATEGORIES,
    RESTOCKING_FEE_MAX_CAP,
    RESTOCKING_FEE_RATE,
    RETURN_WINDOWS_V1,
    RETURN_WINDOWS_V2,
    SLA_DEFINITIONS,
)
from backend.db.connection import get_connection
from backend.engine.ticket_schema import Priority, SupportTicket, TicketCategory


# ==============================================================================
# 1. Pydantic Parameter Models for Input Validation
# ==============================================================================

class GetCustomerInput(BaseModel):
    customer_id: Optional[str] = Field(default=None, description="Unique NovaMart customer ID (CUST-XXXXX)")
    email: Optional[str] = Field(default=None, description="Customer registered email address")


class GetOrderInput(BaseModel):
    order_id: str = Field(..., description="Unique NovaMart order ID (ORD-XXXXXX)")
    authenticated_customer_id: str = Field(..., description="Authenticated customer ID asserting ownership")


class GetProductInput(BaseModel):
    product_id: Optional[str] = Field(default=None, description="Product ID (PROD-XXXXX)")
    sku: Optional[str] = Field(default=None, description="Product SKU code")


class GetConversationsInput(BaseModel):
    customer_id: str = Field(..., description="Unique customer ID (CUST-XXXXX)")


class CheckRefundEligibilityInput(BaseModel):
    order_id: str = Field(..., description="Order ID to evaluate")
    item_id: str = Field(..., description="Order item ID or Product ID to evaluate")
    reason: str = Field(..., description="Return reason (change_of_mind, defective, damaged, wrong_item)")
    reference_time: Optional[str] = Field(default=None, description="Conversation reference timestamp (YYYY-MM-DD HH:MM:SS)")


class CalculateRefundInput(BaseModel):
    order_id: str = Field(..., description="Order ID for refund calculation")
    item_id: str = Field(..., description="Order item ID or Product ID")
    reason: str = Field(..., description="Return or cancellation reason")
    include_shipping_fee: bool = Field(default=False, description="Whether full shipping fee should be refunded")


class CreateReturnInput(BaseModel):
    order_id: str = Field(..., description="Order ID for return")
    item_id: str = Field(..., description="Order item ID to return")
    reason: str = Field(..., description="Verified return reason")
    evidence_verified: bool = Field(default=True, description="True if evidence/photos were verified for defect/damage")


class CreateRefundInput(BaseModel):
    order_id: str = Field(..., description="Order ID to issue refund for")
    amount: float = Field(..., gt=0, description="Exact monetary refund amount in INR")
    reason: str = Field(..., description="Reason for refund")
    destination: str = Field(default="original_payment_method", description="Refund destination (original_payment_method or wallet)")


class CreateSupportTicketInput(BaseModel):
    customer_id: str = Field(..., description="Customer ID creating the ticket")
    category: str = Field(..., description="Ticket domain category")
    priority: str = Field(..., description="Priority level (low, medium, high, critical)")
    subject: str = Field(..., description="Concise subject of the issue")
    description: str = Field(..., description="Detailed description of the problem and facts")
    order_id: Optional[str] = Field(default=None, description="Associated order ID if any")
    assigned_team: Optional[str] = Field(default=None, description="Target team if pre-routed")


class EscalateToHumanInput(BaseModel):
    customer_id: str = Field(..., description="Customer ID being escalated")
    order_id: Optional[str] = Field(default=None, description="Associated order ID if relevant")
    reason: str = Field(..., description="Standardized escalation reason code")
    team: str = Field(..., description="Target specialist department")
    priority: str = Field(..., description="Ticket priority (medium, high, critical)")
    case_summary: Optional[str] = Field(default=None, description="Brief summary of verified facts, customer claims, and policy rationale")


# ==============================================================================
# 2. Tool Implementations (Deterministic Logic & Ground Truth DB Execution)
# ==============================================================================

def get_customer(customer_id: Optional[str] = None, email: Optional[str] = None) -> Dict[str, Any]:
    """
    Retrieves complete customer profile, loyalty tier, account standing, and contact info.
    Redacts internal credentials or sensitive hashes.
    """
    if not customer_id and not email:
        return {"error": "Must provide at least customer_id or email."}

    conn = get_connection()
    cursor = conn.cursor()

    if customer_id:
        cursor.execute("SELECT * FROM customers WHERE customer_id = ?", (customer_id,))
    else:
        cursor.execute("SELECT * FROM customers WHERE email = ?", (email,))

    row = cursor.fetchone()
    if not row:
        return {"error": f"Customer not found for {'customer_id: ' + customer_id if customer_id else 'email: ' + email}."}

    cust = dict(row)
    # Assemble sanitized customer record
    return {
        "customer_id": cust.get("customer_id"),
        "name": f"{cust.get('first_name', '')} {cust.get('last_name', '')}".strip(),
        "email": cust.get("email"),
        "phone": cust.get("phone"),
        "account_status": cust.get("account_status"),
        "loyalty_tier": cust.get("loyalty_tier"),
        "total_orders": cust.get("total_orders"),
        "total_spend": cust.get("total_spend"),
        "customer_since": cust.get("customer_since"),
        "city": cust.get("city"),
        "state": cust.get("state"),
        "pincode": cust.get("pincode"),
    }


def get_order(order_id: str, authenticated_customer_id: str) -> Dict[str, Any]:
    """
    Retrieves order details, items, shipping state, and delivery tracking.
    CRITICAL SECURITY INVARIANTS:
    - Asserts customer ownership: orders.customer_id MUST match authenticated_customer_id.
    - REDACTION GUARD: Strictly suppresses internal delivery_otp_verified and courier driver phone numbers.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
    order_row = cursor.fetchone()
    if not order_row:
        return {"error": f"Order {order_id} not found."}

    order = dict(order_row)

    # Ownership assertion
    if order.get("customer_id") != authenticated_customer_id:
        return {
            "error": "ACCESS_DENIED",
            "message": f"Order {order_id} does not belong to authenticated customer {authenticated_customer_id}. Access denied.",
        }

    # Fetch order item lines
    cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
    items = [dict(r) for r in cursor.fetchall()]

    # Security Redaction: Strip internal delivery_otp_verified and any driver phone
    sanitized_order = {
        "order_id": order.get("order_id"),
        "customer_id": order.get("customer_id"),
        "order_date": order.get("order_date"),
        "order_status": order.get("order_status"),
        "delivery_status": order.get("delivery_status"),
        "tracking_number": order.get("tracking_number"),
        "courier": order.get("courier"),
        "estimated_delivery_date": order.get("estimated_delivery_date"),
        "actual_delivery_date": order.get("actual_delivery_date"),
        "subtotal": order.get("subtotal"),
        "discount": order.get("discount"),
        "shipping_fee": order.get("shipping_fee"),
        "tax": order.get("tax"),
        "total_amount": order.get("total_amount"),
        "payment_method": order.get("payment_method"),
        "payment_status": order.get("payment_status"),
        "cancellation_status": order.get("cancellation_status"),
        "refund_status": order.get("refund_status"),
        "shipping_address": order.get("shipping_address"),
        "items": items,
        # NOTICE: delivery_otp_verified and driver route data are deliberately REDACTED!
    }

    return sanitized_order


def get_product(product_id: Optional[str] = None, sku: Optional[str] = None) -> Dict[str, Any]:
    """
    Retrieves product specs, warranty window, returnability, and replacement flags.
    """
    if not product_id and not sku:
        return {"error": "Must provide at least product_id or sku."}

    conn = get_connection()
    cursor = conn.cursor()

    if product_id:
        cursor.execute("SELECT * FROM products WHERE product_id = ?", (product_id,))
    else:
        cursor.execute("SELECT * FROM products WHERE sku = ?", (sku,))

    row = cursor.fetchone()
    if not row:
        return {"error": f"Product not found for {'product_id: ' + product_id if product_id else 'sku: ' + sku}."}

    prod = dict(row)
    return {
        "product_id": prod.get("product_id"),
        "sku": prod.get("sku"),
        "product_name": prod.get("product_name"),
        "category": prod.get("category"),
        "subcategory": prod.get("subcategory"),
        "brand": prod.get("brand"),
        "description": prod.get("description"),
        "price": prod.get("price"),
        "mrp": prod.get("mrp"),
        "discount_percent": prod.get("discount_percent"),
        "stock_quantity": prod.get("stock_quantity"),
        "warranty_months": prod.get("warranty_months"),
        "returnable": bool(prod.get("returnable")),
        "replacement_available": bool(prod.get("replacement_available")),
        "rating": prod.get("rating"),
        "review_count": prod.get("review_count"),
        "status": prod.get("status"),
    }


def get_conversations(customer_id: str) -> Dict[str, Any]:
    """
    Retrieves prior conversations and message history for context continuity.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT conversation_id, customer_id, order_id, ticket_id, channel, started_at, status, handled_by, messages
        FROM conversations
        WHERE customer_id = ?
        ORDER BY started_at DESC
        LIMIT 5
        """,
        (customer_id,),
    )
    conversations = []
    for r in cursor.fetchall():
        conv = dict(r)
        raw_msgs = conv.get("messages")
        if isinstance(raw_msgs, str):
            try:
                conv["messages"] = json.loads(raw_msgs)
            except Exception:
                conv["messages"] = []
        elif not isinstance(raw_msgs, list):
            conv["messages"] = []
        conversations.append(conv)

    return {"customer_id": customer_id, "conversations": conversations}


def check_refund_eligibility(
    order_id: str,
    item_id: str,
    reason: str,
    reference_time: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Evaluates policy version, calculates calendar return window, loyalty tier extensions,
    and asserts return/refund eligibility.
    Enforces Gap 01 (Dynamic conversation reference time) and Gap 03 (Pre-shipment approval exemption).
    """
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Fetch Order
    cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
    order_row = cursor.fetchone()
    if not order_row:
        return {"eligible": False, "ineligibility_reason": f"Order {order_id} not found."}
    order = dict(order_row)

    # 2. Fetch Customer for loyalty tier
    cursor.execute("SELECT loyalty_tier, account_status FROM customers WHERE customer_id = ?", (order.get("customer_id"),))
    cust_row = cursor.fetchone()
    loyalty_tier = cust_row["loyalty_tier"] if cust_row else "bronze"
    account_status = cust_row["account_status"] if cust_row else "active"

    if account_status == "suspended":
        return {
            "eligible": False,
            "ineligibility_reason": "Customer account is suspended. Transactions and refunds are blocked.",
            "requires_human_approval": True,
            "escalate_team": "Trust & Safety",
        }

    # 3. Fetch Item & Product
    cursor.execute(
        """
        SELECT oi.*, p.product_name, p.category, p.subcategory, p.returnable, p.replacement_available
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ? AND (oi.order_item_id = ? OR oi.product_id = ?)
        """,
        (order_id, item_id, item_id),
    )
    item_row = cursor.fetchone()
    if not item_row:
        return {"eligible": False, "ineligibility_reason": f"Item {item_id} not found in order {order_id}."}
    item = dict(item_row)

    # 4. Check if product is marked non-returnable in catalog
    if not item.get("returnable") and reason in ["change_of_mind"]:
        return {
            "eligible": False,
            "ineligibility_reason": f"Product '{item.get('product_name')}' ({item.get('category')}) is designated non-returnable under NovaMart category policy.",
            "policy_version_applied": "v2" if (order.get("order_date") or "") >= POLICY_CUTOFF_DATE_STR else "v1",
        }

    # 5. Determine Policy Version (order_date < 2026-06-01 -> v1, else -> v2)
    order_date_str = order.get("order_date", "")
    policy_version = "v1" if order_date_str < POLICY_CUTOFF_DATE_STR else "v2"

    # 6. Parse timestamps for window calculation
    # Delivery date is Day 0
    actual_delivery = order.get("actual_delivery_date")
    if not actual_delivery:
        # If order not yet delivered
        order_status = (order.get("order_status") or "").lower()
        if order_status in ["placed", "confirmed", "processing"]:
            # Pre-shipment cancellation
            return {
                "eligible": True,
                "policy_version_applied": policy_version,
                "days_since_delivery": 0,
                "allowed_window_days": 0,
                "requires_human_approval": False,  # Gap 03: Pre-shipment cancellation never needs human approval!
                "restocking_fee_applicable": False,
                "ineligibility_reason": None,
                "note": "Pre-shipment cancellation is eligible without fee or approval.",
            }
        elif order_status in ["shipped", "in_transit", "out_for_delivery"]:
            return {
                "eligible": False,
                "ineligibility_reason": "Order is currently in transit. Please receive delivery and inspect or refuse package upon arrival.",
                "policy_version_applied": policy_version,
            }

    try:
        delivery_dt = datetime.strptime(actual_delivery[:10], "%Y-%m-%d").date()
    except Exception:
        delivery_dt = datetime.now(timezone.utc).date()

    # Reference time (Gap 01: conversation reference time, not system clock!)
    if reference_time:
        try:
            ref_dt = datetime.strptime(reference_time[:10], "%Y-%m-%d").date()
        except Exception:
            ref_dt = delivery_dt
    else:
        ref_dt = delivery_dt

    days_since_delivery = (ref_dt - delivery_dt).days

    # 7. Allowed Window Calculation
    clean_reason = reason.lower().replace(" ", "_")
    windows_table = RETURN_WINDOWS_V1 if policy_version == "v1" else RETURN_WINDOWS_V2
    base_window = windows_table.get(clean_reason, 7)

    # Category specific overrides
    cat = (item.get("category") or "").lower()
    if cat in ["groceries", "personal care", "beauty", "perishables"]:
        base_window = 0  # Non-returnable unless defective on delivery
        if clean_reason == "change_of_mind":
            return {
                "eligible": False,
                "policy_version_applied": policy_version,
                "days_since_delivery": days_since_delivery,
                "allowed_window_days": 0,
                "ineligibility_reason": "Perishable, grocery, and personal care items cannot be returned for change of mind.",
            }

    # Loyalty extension (applies only to change of mind)
    loyalty_ext = LOYALTY_RETURN_WINDOW_EXTENSIONS.get((loyalty_tier or "bronze").lower(), 0) if clean_reason == "change_of_mind" else 0
    total_allowed_window = base_window + loyalty_ext

    # Check window expiry
    if days_since_delivery > total_allowed_window:
        return {
            "eligible": False,
            "policy_version_applied": policy_version,
            "days_since_delivery": days_since_delivery,
            "allowed_window_days": total_allowed_window,
            "loyalty_extension_days": loyalty_ext,
            "requires_human_approval": False,
            "restocking_fee_applicable": False,
            "ineligibility_reason": f"Return window expired ({days_since_delivery} days elapsed since delivery on {actual_delivery[:10]}; policy allows {total_allowed_window} days including loyalty extension).",
        }

    # 8. Human Approval Threshold
    threshold = APPROVAL_THRESHOLD_V1 if policy_version == "v1" else APPROVAL_THRESHOLD_V2
    order_total = float(order.get("total_amount") or 0.0)
    requires_approval = order_total > threshold

    # 9. Restocking Fee Check (Policy v2 Change-of-Mind on high-value categories)
    restocking_applicable = False
    if policy_version == "v2" and clean_reason == "change_of_mind":
        prod_cat = item.get("category") or ""
        prod_sub = item.get("subcategory") or ""
        if prod_cat in RESTOCKING_CATEGORIES or prod_sub in RESTOCKING_CATEGORIES:
            restocking_applicable = True

    return {
        "eligible": True,
        "policy_version_applied": policy_version,
        "days_since_delivery": days_since_delivery,
        "allowed_window_days": total_allowed_window,
        "loyalty_extension_days": loyalty_ext,
        "requires_human_approval": requires_approval,
        "approval_threshold": threshold,
        "order_total": order_total,
        "restocking_fee_applicable": restocking_applicable,
        "ineligibility_reason": None,
    }


def calculate_refund(
    order_id: str,
    item_id: str,
    reason: str,
    include_shipping_fee: bool = False,
) -> Dict[str, Any]:
    """
    Computes exact allowable refund amount, deducting restocking fee and capping at order total.
    Enforces Gap 04 (Shipping Fee Refund Matrix).
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
    order_row = cursor.fetchone()
    if not order_row:
        return {"error": f"Order {order_id} not found."}
    order = dict(order_row)

    cursor.execute(
        """
        SELECT oi.*, p.category, p.subcategory
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ? AND (oi.order_item_id = ? OR oi.product_id = ?)
        """,
        (order_id, item_id, item_id),
    )
    item_row = cursor.fetchone()
    if not item_row:
        return {"error": f"Item {item_id} not found in order {order_id}."}
    item = dict(item_row)

    # Policy Version
    order_date_str = order.get("order_date", "")
    policy_version = "v1" if order_date_str < POLICY_CUTOFF_DATE_STR else "v2"

    final_price = float(item.get("final_price") or 0.0)
    tax_amount = round(final_price * GST_RATE, 2)
    gross_refund = round(final_price + tax_amount, 2)

    # Restocking fee calculation
    restocking_fee = 0.0
    clean_reason = reason.lower().replace(" ", "_")
    cat = item.get("category") or ""
    sub = item.get("subcategory") or ""
    if policy_version == "v2" and clean_reason == "change_of_mind":
        if cat in RESTOCKING_CATEGORIES or sub in RESTOCKING_CATEGORIES:
            restocking_fee = min(gross_refund * RESTOCKING_FEE_RATE, RESTOCKING_FEE_MAX_CAP)

    # Shipping fee refund logic (Gap 04)
    shipping_refunded = 0.0
    if include_shipping_fee:
        shipping_refunded = float(order.get("shipping_fee") or 0.0)

    net_refund = round(gross_refund - restocking_fee + shipping_refunded, 2)
    order_total = float(order.get("total_amount") or 0.0)

    # Strict Cap at order total amount
    capped_net_refund = min(net_refund, order_total)

    return {
        "order_id": order_id,
        "item_id": item.get("order_item_id"),
        "product_id": item.get("product_id"),
        "policy_version": policy_version,
        "item_final_price": final_price,
        "tax_amount_18_pct": tax_amount,
        "gross_refund": gross_refund,
        "shipping_fee_refunded": shipping_refunded,
        "restocking_fee_deducted": round(restocking_fee, 2),
        "net_refund_amount": capped_net_refund,
        "order_total_cap": order_total,
    }


def create_return(
    order_id: str,
    item_id: str,
    reason: str,
    evidence_verified: bool = True,
) -> Dict[str, Any]:
    """
    Opens an official return request for an eligible order item.
    Updates order_items return status in SQLite.
    """
    clean_reason = reason.lower().replace(" ", "_")
    if clean_reason in ["defective", "damaged_in_transit", "damaged"] and not evidence_verified:
        return {
            "error": "EVIDENCE_REQUIRED",
            "message": "Return cannot be scheduled without customer photographic/video evidence verification for defect or damage claims.",
        }

    conn = get_connection()
    cursor = conn.cursor()

    return_id = f"RET-{random.randint(10000, 99999)}"

    # Update order_items in SQLite
    cursor.execute(
        """
        UPDATE order_items
        SET return_status = 'return_requested'
        WHERE order_id = ? AND (order_item_id = ? OR product_id = ?)
        """,
        (order_id, item_id, item_id),
    )
    conn.commit()

    return {
        "return_id": return_id,
        "order_id": order_id,
        "item_id": item_id,
        "status": "pickup_scheduled",
        "pickup_window": "24 to 48 hours",
        "qc_timeline": "2 business days after warehouse arrival",
        "instructions": "Please ensure item is packed with original tags, box, and accessories.",
    }


def create_refund(
    order_id: str,
    amount: float,
    reason: str,
    destination: str = "original_payment_method",
) -> Dict[str, Any]:
    """
    Issues a verified monetary refund to original payment instrument or wallet.
    Precondition guards:
    - Blocks if order total exceeds approval threshold (₹100k v1 / ₹75k v2) unless pre-shipment cancellation.
    - Blocks if customer account is suspended.
    - Blocks if OTP contradiction detected (delivered with OTP but customer claims non-delivery).
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
    order_row = cursor.fetchone()
    if not order_row:
        return {"error": f"Order {order_id} not found."}
    order = dict(order_row)

    # 1. Customer account status check
    cursor.execute("SELECT account_status FROM customers WHERE customer_id = ?", (order.get("customer_id"),))
    cust_row = cursor.fetchone()
    if cust_row and cust_row["account_status"] == "suspended":
        return {
            "error": "ACCOUNT_SUSPENDED",
            "message": "Customer account is suspended. Autonomous refund blocked. Escalating to Trust & Safety.",
        }

    # 2. OTP Contradiction check
    clean_reason = reason.lower()
    if "not delivered" in clean_reason or "never arrived" in clean_reason:
        if order.get("delivery_otp_verified") == 1:
            return {
                "error": "OTP_CONTRADICTION",
                "message": f"Order {order_id} was delivered with secure OTP verification. Direct refund blocked. Escalating to Logistics Desk for courier investigation.",
                "requires_escalation": True,
                "team": "Logistics Desk",
            }

    # 3. Monetary Threshold check (Gap 03: exempt if pre-shipment cancellation)
    order_status = (order.get("order_status") or "").lower()
    is_pre_shipment = order_status in ["placed", "confirmed", "processing"]
    policy_version = "v1" if (order.get("order_date") or "") < POLICY_CUTOFF_DATE_STR else "v2"
    threshold = APPROVAL_THRESHOLD_V1 if policy_version == "v1" else APPROVAL_THRESHOLD_V2

    if float(order.get("total_amount") or 0.0) > threshold and not is_pre_shipment:
        return {
            "error": "APPROVAL_THRESHOLD_EXCEEDED",
            "message": f"Order total (₹{order.get('total_amount')}) exceeds autonomous approval limit of ₹{threshold:,.0f}. Mandatory escalation to Refunds & Payments team required.",
            "requires_escalation": True,
            "team": "Refunds & Payments",
        }

    # 4. Cash on delivery destination check (Gap 06)
    if order.get("payment_method") == "cash_on_delivery" and destination == "original_payment_method":
        destination = "wallet"

    refund_id = f"REF-{random.randint(10000, 99999)}"

    # Update orders in SQLite
    cursor.execute(
        """
        UPDATE orders
        SET refund_status = 'refund_issued'
        WHERE order_id = ?
        """,
        (order_id,),
    )
    conn.commit()

    return {
        "refund_id": refund_id,
        "order_id": order_id,
        "status": "processed",
        "amount": amount,
        "destination": destination,
        "eta": "Instant for NovaMart Wallet | 1-3 business days for UPI | 5-7 business days for Cards",
    }


def create_support_ticket(
    customer_id: str,
    category: str,
    priority: str,
    subject: str,
    description: str,
    order_id: Optional[str] = None,
    assigned_team: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Opens an official support ticket in SQLite with SLA resolution targets.
    """
    try:
        p_enum = Priority(priority.lower())
    except ValueError:
        p_enum = Priority.MEDIUM

    try:
        c_enum = TicketCategory(category.lower())
    except ValueError:
        c_enum = TicketCategory.GENERAL

    ticket = SupportTicket(
        customer_id=customer_id,
        order_id=order_id,
        category=c_enum,
        priority=p_enum,
        subject=subject,
        description=description,
        assigned_team=assigned_team,
    )

    db_row = ticket.to_db_row()
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO support_tickets (
            ticket_id, customer_id, order_id, created_at, category, subcategory,
            priority, status, assigned_team, issue_summary, resolution, created_by,
            resolved_at, conversation_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            db_row["ticket_id"],
            db_row["customer_id"],
            db_row["order_id"],
            db_row["created_at"],
            db_row["category"],
            db_row["subcategory"],
            db_row["priority"],
            db_row["status"],
            db_row["assigned_team"],
            db_row["issue_summary"],
            db_row["resolution"],
            db_row["created_by"],
            db_row["resolved_at"],
            db_row["conversation_id"],
        ),
    )
    conn.commit()

    return {
        "ticket_id": ticket.ticket_id,
        "status": ticket.status,
        "created_at": ticket.created_at,
        "category": ticket.category.value,
        "priority": ticket.priority.value,
        "assigned_team": ticket.assigned_team,
        "resolution_target_hours": ticket.resolution_target_hours,
        "sla_description": SLA_DEFINITIONS.get(ticket.priority.value, {}).get("description", "Standard SLA"),
    }


def escalate_to_human(
    customer_id: str,
    order_id: Optional[str],
    reason: str,
    team: str,
    priority: str,
    case_summary: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Hands off case to a specialist human department with complete context payload,
    generates a high-priority ticket, and binds realistic SLA.
    """
    summary = case_summary or f"Escalated case for customer {customer_id}: {reason}."
    ticket_res = create_support_ticket(
        customer_id=customer_id,
        category="general",
        priority=priority,
        subject=f"Escalation: {reason}",
        description=summary,
        order_id=order_id,
        assigned_team=team,
    )

    sla_info = SLA_DEFINITIONS.get(priority.lower(), SLA_DEFINITIONS["medium"])
    response_sla = f"{sla_info.get('first_response_minutes', 60)} minutes"

    return {
        "ticket_id": ticket_res["ticket_id"],
        "escalation_status": "transferred",
        "target_team": team,
        "priority": priority,
        "sla_first_response": response_sla,
        "resolution_target_hours": ticket_res["resolution_target_hours"],
        "customer_message": (
            f"I have transferred your case to our {team} specialist team under Ticket #{ticket_res['ticket_id']}. "
            f"A specialist will review your file and respond within {response_sla}. "
            f"Expected resolution timeframe: {ticket_res['resolution_target_hours']} hours."
        ),
    }


# ==============================================================================
# 3. Tool Registry & Gemini 2.5 Flash / Google ADK Function Declarations
# ==============================================================================

TOOL_REGISTRY: Dict[str, Callable] = {
    "get_customer": get_customer,
    "get_order": get_order,
    "get_product": get_product,
    "get_conversations": get_conversations,
    "check_refund_eligibility": check_refund_eligibility,
    "calculate_refund": calculate_refund,
    "create_return": create_return,
    "create_refund": create_refund,
    "create_support_ticket": create_support_ticket,
    "escalate_to_human": escalate_to_human,
}

TOOL_SCHEMAS: List[Dict[str, Any]] = [
    {
        "name": "get_customer",
        "description": "Retrieves complete customer profile, loyalty tier, account standing, and contact info by customer_id or email.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "customer_id": {
                    "type": "STRING",
                    "description": "Unique NovaMart customer identifier (CUST-XXXXX).",
                },
                "email": {
                    "type": "STRING",
                    "description": "Customer registered email address.",
                },
            },
        },
    },
    {
        "name": "get_order",
        "description": "Retrieves order master details, shipping state, item lines, and delivery tracking. Asserts customer ownership and redacts delivery OTP values.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "order_id": {
                    "type": "STRING",
                    "description": "Unique NovaMart order identifier (ORD-XXXXXX).",
                },
                "authenticated_customer_id": {
                    "type": "STRING",
                    "description": "Authenticated customer ID requesting access (e.g. CUST-00001).",
                },
            },
            "required": ["order_id", "authenticated_customer_id"],
        },
    },
    {
        "name": "get_product",
        "description": "Retrieves product technical specs, warranty window, returnability, and replacement flags.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "product_id": {
                    "type": "STRING",
                    "description": "Unique product ID (PROD-XXXXX).",
                },
                "sku": {
                    "type": "STRING",
                    "description": "Product SKU code.",
                },
            },
        },
    },
    {
        "name": "get_conversations",
        "description": "Pulls prior conversation transcripts and session history for the authenticated customer.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "customer_id": {
                    "type": "STRING",
                    "description": "Unique customer ID (CUST-XXXXX).",
                },
            },
            "required": ["customer_id"],
        },
    },
    {
        "name": "check_refund_eligibility",
        "description": "Evaluates policy version (v1 vs v2), computes calendar windows with loyalty extensions, and asserts return/refund eligibility.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "order_id": {
                    "type": "STRING",
                    "description": "Order ID to check.",
                },
                "item_id": {
                    "type": "STRING",
                    "description": "Order item ID or Product ID.",
                },
                "reason": {
                    "type": "STRING",
                    "description": "Return reason: change_of_mind, defective, damaged, wrong_item.",
                },
                "reference_time": {
                    "type": "STRING",
                    "description": "Conversation reference timestamp (YYYY-MM-DD HH:MM:SS) for historical date math.",
                },
            },
            "required": ["order_id", "item_id", "reason"],
        },
    },
    {
        "name": "calculate_refund",
        "description": "Computes exact allowable refund amount, deducting restocking fee (Policy v2) and capping at order total.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "order_id": {
                    "type": "STRING",
                    "description": "Order ID.",
                },
                "item_id": {
                    "type": "STRING",
                    "description": "Order item ID or product ID.",
                },
                "reason": {
                    "type": "STRING",
                    "description": "Return reason.",
                },
                "include_shipping_fee": {
                    "type": "BOOLEAN",
                    "description": "True only if full order is cancelled before shipment or full order returned for defect.",
                },
            },
            "required": ["order_id", "item_id", "reason"],
        },
    },
    {
        "name": "create_return",
        "description": "Opens an official return request for an eligible order item after verification.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "order_id": {
                    "type": "STRING",
                    "description": "Order ID.",
                },
                "item_id": {
                    "type": "STRING",
                    "description": "Order item ID.",
                },
                "reason": {
                    "type": "STRING",
                    "description": "Verified return reason.",
                },
                "evidence_verified": {
                    "type": "BOOLEAN",
                    "description": "True if customer provided photographic/video evidence of damage or defect.",
                },
            },
            "required": ["order_id", "item_id", "reason"],
        },
    },
    {
        "name": "create_refund",
        "description": "Issues a verified monetary refund to original payment instrument or wallet. Intercepts high-value thresholds and OTP contradictions.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "order_id": {
                    "type": "STRING",
                    "description": "Order ID.",
                },
                "amount": {
                    "type": "NUMBER",
                    "description": "Calculated net refund amount.",
                },
                "reason": {
                    "type": "STRING",
                    "description": "Refund justification reason.",
                },
                "destination": {
                    "type": "STRING",
                    "description": "Refund destination: original_payment_method or wallet.",
                },
            },
            "required": ["order_id", "amount", "reason"],
        },
    },
    {
        "name": "create_support_ticket",
        "description": "Opens a support ticket with deterministic SLA resolution deadlines and routing.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "customer_id": {
                    "type": "STRING",
                    "description": "Customer ID.",
                },
                "category": {
                    "type": "STRING",
                    "description": "Ticket category: cancellation, refund, return, replacement, delivery, warranty, fraud_dispute, general.",
                },
                "priority": {
                    "type": "STRING",
                    "description": "Priority: low, medium, high, critical.",
                },
                "subject": {
                    "type": "STRING",
                    "description": "Subject summary.",
                },
                "description": {
                    "type": "STRING",
                    "description": "Detailed explanation of issue.",
                },
                "order_id": {
                    "type": "STRING",
                    "description": "Associated order ID if any.",
                },
            },
            "required": ["customer_id", "category", "priority", "subject", "description"],
        },
    },
    {
        "name": "escalate_to_human",
        "description": "Hands off case to a human specialist team with complete briefing and generates a high-priority ticket.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "customer_id": {
                    "type": "STRING",
                    "description": "Customer ID.",
                },
                "order_id": {
                    "type": "STRING",
                    "description": "Order ID if relevant.",
                },
                "reason": {
                    "type": "STRING",
                    "description": "Standardized escalation reason.",
                },
                "team": {
                    "type": "STRING",
                    "description": "Target team: Refunds & Payments, Logistics Desk, Trust & Safety, Technical Support, Tier 1 Support, Customer Experience.",
                },
                "priority": {
                    "type": "STRING",
                    "description": "Priority: medium, high, critical.",
                },
                "case_summary": {
                    "type": "STRING",
                    "description": "Dossier briefing with verified facts, customer claims, and policy rationale.",
                },
            },
            "required": ["customer_id", "reason", "team", "priority"],
        },
    },
]
