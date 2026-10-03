"""NovaMart Deterministic Policy Rules Engine.

Implements exact, auditable business logic and version matrices for NovaMart AI Customer Support Agent.
All financial arithmetic strictly enforces 2-decimal-place rounding (round(val, 2)).
"""

from __future__ import annotations

import re
import sqlite3
from datetime import date, datetime, time, timedelta, timezone
from typing import Any, Dict, List, Optional, Union


# ---------------------------------------------------------------------------
# Constants & Reference Boundaries
# ---------------------------------------------------------------------------

POLICY_V2_BOUNDARY = datetime(2026, 6, 1, 0, 0, 0, tzinfo=timezone.utc)

RESTOCKING_CATEGORIES = {
    "laptops",
    "laptop",
    "tablets",
    "tablet",
    "cameras",
    "camera",
    "monitors",
    "monitor",
}

PRE_SHIPMENT_STATUSES = {"placed", "confirmed", "processing"}

CHANGE_OF_MIND_REASONS = {
    "change_of_mind",
    "change of mind",
    "buyer_remorse",
    "not_needed",
    "unwanted",
}

DEFECT_OR_DAMAGE_REASONS = {
    "defective",
    "damaged",
    "damaged_in_transit",
    "wrong_item",
    "dead_on_arrival",
    "faulty",
    "broken",
    "missing_parts",
}

FULL_SHIPPING_REFUND_REASONS = {
    "cancellation_before_shipment",
    "cancelled_before_shipment",
    "cancel_order",
    "cancellation",
    "defective",
    "damaged",
    "damaged_in_transit",
    "wrong_item",
    "lost_in_transit",
}


# ---------------------------------------------------------------------------
# Helper Datetime Parsers
# ---------------------------------------------------------------------------

def _parse_datetime_flexible(dt_val: Union[str, datetime, date, None]) -> Optional[datetime]:
    """Parse various datetime representations into a timezone-aware UTC datetime."""
    if dt_val is None:
        return None
    if isinstance(dt_val, datetime):
        if dt_val.tzinfo is None:
            return dt_val.replace(tzinfo=timezone.utc)
        return dt_val.astimezone(timezone.utc)
    if isinstance(dt_val, date):
        return datetime.combine(dt_val, time.min, tzinfo=timezone.utc)
    
    val_str = str(dt_val).strip()
    if not val_str:
        return None

    # Try ISO formats
    # Handle possible 'Z' suffix
    val_clean = val_str.replace("Z", "+00:00")
    for fmt in (
        "%Y-%m-%d %H:%M:%S%z",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%d",
    ):
        try:
            parsed = datetime.strptime(val_clean, fmt)
            if parsed.tzinfo is None:
                return parsed.replace(tzinfo=timezone.utc)
            return parsed.astimezone(timezone.utc)
        except ValueError:
            continue

    # Fallback to fromisoformat
    try:
        parsed = datetime.fromisoformat(val_clean)
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except Exception:
        pass

    return None


# ---------------------------------------------------------------------------
# 1. Reference Time Resolution
# ---------------------------------------------------------------------------

def resolve_reference_time(
    request_time: Optional[Union[str, datetime]] = None,
    conversation_history: Optional[List[Dict[str, Any]]] = None,
) -> datetime:
    """Resolve dynamic calendar anchor, eliminating system clock drift.
    
    Adheres strictly to Customer Escalation Policy Sec 2:
    "use conversation's current time, not your own clock".
    """
    if request_time is not None:
        parsed = _parse_datetime_flexible(request_time)
        if parsed is not None:
            return parsed

    if conversation_history:
        for msg in reversed(conversation_history):
            ts = msg.get("timestamp") or msg.get("created_at") or msg.get("time")
            if ts:
                parsed = _parse_datetime_flexible(ts)
                if parsed is not None:
                    return parsed

    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# 2. Policy Version Determination
# ---------------------------------------------------------------------------

def determine_policy_version(order_date: Union[str, datetime, date]) -> str:
    """Determine policy version strictly based on order placement date.
    
    - Orders placed before 2026-06-01 00:00:00 IST -> "v1"
    - Orders placed on or after 2026-06-01 00:00:00 IST -> "v2"
    """
    parsed = _parse_datetime_flexible(order_date)
    if parsed is None:
        # Default fallback to latest policy if missing
        return "v2"
    
    if parsed < POLICY_V2_BOUNDARY:
        return "v1"
    return "v2"


# ---------------------------------------------------------------------------
# 3. Return Window Arithmetic
# ---------------------------------------------------------------------------

def check_return_window(
    order_date: Union[str, datetime, date],
    delivery_date: Optional[Union[str, datetime, date]],
    return_reason: str,
    loyalty_tier: Optional[str] = None,
    reference_time: Optional[Union[str, datetime]] = None,
) -> Dict[str, Any]:
    """Check return window eligibility with calendar arithmetic and loyalty extensions.
    
    Day 0 is delivery_date.
    Policy v1: 10d mind / 15d defect
    Policy v2: 7d mind / 10d defect
    Loyalty extensions: Gold +2d, Platinum +3d (STRICTLY on change-of-mind only).
    """
    version = determine_policy_version(order_date)
    parsed_ref = resolve_reference_time(reference_time)
    parsed_del = _parse_datetime_flexible(delivery_date)

    if parsed_del is None:
        return {
            "eligible": False,
            "policy_version": version,
            "days_since_delivery": None,
            "base_window_days": 0,
            "loyalty_extension_days": 0,
            "allowed_window_days": 0,
            "ineligibility_reason": "Order has not been delivered yet or delivery date is unavailable.",
        }

    # Calendar day difference: (reference_date - delivery_date)
    days_elapsed = (parsed_ref.date() - parsed_del.date()).days
    if days_elapsed < 0:
        days_elapsed = 0

    reason_clean = return_reason.strip().lower().replace(" ", "_")
    is_change_of_mind = (
        reason_clean in CHANGE_OF_MIND_REASONS or "mind" in reason_clean or "remorse" in reason_clean
    )

    # Base window
    if version == "v1":
        base_window = 10 if is_change_of_mind else 15
    else:
        base_window = 7 if is_change_of_mind else 10

    # Loyalty extension applies strictly to change-of-mind
    loyalty_clean = (loyalty_tier or "").strip().lower()
    loyalty_extension = 0
    if is_change_of_mind:
        if loyalty_clean == "gold":
            loyalty_extension = 2
        elif loyalty_clean == "platinum":
            loyalty_extension = 3

    allowed_window = base_window + loyalty_extension
    eligible = days_elapsed <= allowed_window

    ineligibility_reason = None
    if not eligible:
        reason_type = "change-of-mind" if is_change_of_mind else "defect/damaged"
        ineligibility_reason = (
            f"The {allowed_window}-day return window for {reason_type} has expired "
            f"({days_elapsed} days have passed since delivery)."
        )

    return {
        "eligible": eligible,
        "is_within_window": eligible,
        "policy_version": version,
        "days_since_delivery": days_elapsed,
        "elapsed_days": days_elapsed,
        "base_window_days": base_window,
        "loyalty_extension_days": loyalty_extension,
        "allowed_window_days": allowed_window,
        "max_allowed_days": allowed_window,
        "ineligibility_reason": ineligibility_reason,
    }


# ---------------------------------------------------------------------------
# 4. Restocking Fee Calculation
# ---------------------------------------------------------------------------

def calculate_restocking_fee(
    category: str,
    return_reason: str,
    policy_version: str,
    item_gross: float,
) -> float:
    """Calculate restocking fee.
    
    5% capped at Rs 2500 strictly on v2 change-of-mind for:
    Laptops, Tablets, Cameras, Monitors.
    Rs 0.00 otherwise.
    """
    if policy_version.strip().lower() != "v2":
        return 0.0

    reason_clean = return_reason.strip().lower().replace(" ", "_")
    is_change_of_mind = (
        reason_clean in CHANGE_OF_MIND_REASONS or "mind" in reason_clean or "remorse" in reason_clean
    )
    if not is_change_of_mind:
        return 0.0

    cat_clean = category.strip().lower()
    if cat_clean not in RESTOCKING_CATEGORIES:
        return 0.0

    fee = min(item_gross * 0.05, 2500.0)
    return round(fee, 2)


# ---------------------------------------------------------------------------
# 5. Item Refund Calculation
# ---------------------------------------------------------------------------

def calculate_item_refund(
    final_price: float,
    return_reason: str,
    category: str,
    policy_version: str,
) -> Dict[str, float]:
    """Calculate gross refund inclusive of 18% GST, deducting restocking fee.
    
    gross = round(final_price * 1.18, 2)
    net_refund = round(gross - restocking_fee, 2)
    """
    price_val = round(float(final_price), 2)
    gross = round(price_val * 1.18, 2)
    tax_amount = round(gross - price_val, 2)

    fee = calculate_restocking_fee(
        category=category,
        return_reason=return_reason,
        policy_version=policy_version,
        item_gross=gross,
    )
    net_refund = round(gross - fee, 2)

    return {
        "final_price": price_val,
        "tax_amount": tax_amount,
        "gross_refund": gross,
        "restocking_fee": fee,
        "net_refund": net_refund,
    }


# ---------------------------------------------------------------------------
# 6. Delivery Delay Goodwill Credit Algorithm
# ---------------------------------------------------------------------------

def calculate_delay_goodwill(
    eta: Union[str, datetime, date],
    current_time: Union[str, datetime, date],
    status: str,
) -> Dict[str, Any]:
    """Compute delivery delay goodwill wallet credit based on Shipping Policy Sec 4.
    
    - Delivered or <= ETA: none
    - 1-3 days late: reassure & track
    - 4-7 days late: Rs 100 per full 3 days late, capped at max Rs 300
    - > 7 days late: Escalate to Logistics Desk (suspected lost in transit)
    """
    if status.strip().lower() == "delivered":
        return {
            "eligible": False,
            "goodwill_amount": 0.0,
            "action": "none",
            "message": "Order is already delivered.",
        }

    parsed_eta = _parse_datetime_flexible(eta)
    parsed_curr = _parse_datetime_flexible(current_time)

    if parsed_eta is None or parsed_curr is None:
        return {
            "eligible": False,
            "goodwill_amount": 0.0,
            "action": "none",
            "message": "ETA or current time unavailable.",
        }

    delay_days = (parsed_curr.date() - parsed_eta.date()).days
    if delay_days < 1:
        return {
            "eligible": False,
            "goodwill_amount": 0.0,
            "action": "none",
            "delay_days": delay_days,
            "message": "Delivery is on schedule.",
        }
    elif 1 <= delay_days <= 3:
        return {
            "eligible": False,
            "goodwill_amount": 0.0,
            "action": "reassure_and_track",
            "delay_days": delay_days,
            "message": f"Delivery is delayed by {delay_days} day(s). Apologize and provide live tracking/revised ETA.",
        }
    elif 4 <= delay_days <= 7:
        full_three_day_periods = delay_days // 3
        credit = min(full_three_day_periods * 100.0, 300.0)
        return {
            "eligible": True,
            "goodwill_amount": round(credit, 2),
            "action": "issue_wallet_credit",
            "delay_days": delay_days,
            "message": f"Issued INR {credit:.2f} goodwill wallet credit for {delay_days}-day delivery delay.",
        }
    else:  # delay_days > 7
        return {
            "eligible": False,
            "goodwill_amount": 300.0,
            "action": "escalate_lost_in_transit",
            "team": "Logistics Desk",
            "ticket_category": "lost_in_transit",
            "delay_days": delay_days,
            "message": (
                f"Delivery is delayed by {delay_days} days (> 7 days). "
                "Package suspected lost in transit. Escalate to Logistics Desk for courier investigation."
            ),
        }


# ---------------------------------------------------------------------------
# 7. Shipping Fee Refund Matrix
# ---------------------------------------------------------------------------

def compute_shipping_fee_refund(
    is_full_order: bool,
    reason: str,
    shipping_fee_paid: float,
) -> float:
    """Determine refundable shipping fee.
    
    Refundable in full ONLY on whole-order cancellation before shipment
    or full order return due to defect/damage/wrong item/lost in transit.
    Partial returns and change-of-mind NEVER refund shipping fee (Rs 0.00).
    """
    if not is_full_order:
        return 0.0

    reason_clean = reason.strip().lower().replace(" ", "_")
    if (
        reason_clean in FULL_SHIPPING_REFUND_REASONS
        or reason_clean in DEFECT_OR_DAMAGE_REASONS
        or "cancel" in reason_clean
    ):
        return round(float(shipping_fee_paid), 2)

    return 0.0


# ---------------------------------------------------------------------------
# 8. Human Approval Requirement
# ---------------------------------------------------------------------------

def requires_human_approval(
    action_type: str,
    order_status: str,
    total_amount: float,
    policy_version: str,
) -> bool:
    """Determine whether an action requires human approval.
    
    CRITICAL RULE (Cancellation Policy Sec 2):
    Pre-shipment cancellations (placed, confirmed, processing) are ALWAYS exempt
    from human approval regardless of order amount.
    
    For other actions (refunds, returns, replacements):
    Evaluated against orders.total_amount:
    - v1: > Rs 1,00,000 requires human approval
    - v2: > Rs 75,000 requires human approval
    """
    action_clean = action_type.strip().lower()
    status_clean = order_status.strip().lower()

    if (
        action_clean in {"cancel_order", "cancellation", "cancel", "cancel_order_pre_shipment"}
        and status_clean in PRE_SHIPMENT_STATUSES
    ):
        return False

    threshold = 100000.0 if policy_version.strip().lower() == "v1" else 75000.0
    return float(total_amount) > threshold


# ---------------------------------------------------------------------------
# 9. Abuse Pattern Detection
# ---------------------------------------------------------------------------

def check_abuse_patterns(
    customer_id: str,
    db_conn: sqlite3.Connection,
    current_time: Optional[Union[str, datetime]] = None,
) -> Optional[Dict[str, Any]]:
    """Scan database for abuse patterns (throttling & fraud prevention).
    
    - > 5 cancellations in the last 30 days -> Escalate to Trust & Safety.
    - >= 3 return/refund/non-delivery claims in the last 90 days -> Escalate to Trust & Safety.
    """
    ref_time = resolve_reference_time(current_time)
    cursor = db_conn.cursor()

    # 1. Cancellations in last 30 days
    cutoff_30 = (ref_time - timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM orders
        WHERE customer_id = ?
          AND (order_status = 'cancelled' OR cancellation_status IN ('approved', 'auto_cancelled'))
          AND order_date >= ?
        """,
        (customer_id, cutoff_30),
    )
    cancel_count = cursor.fetchone()[0]
    if cancel_count > 5:
        return {
            "flag": "HIGH_CANCELLATION_FREQUENCY",
            "escalate": True,
            "team": "Trust & Safety",
            "cancel_count": cancel_count,
            "reason": f"Customer has {cancel_count} cancellations in the last 30 days (threshold: > 5).",
        }

    # 2. Return/refund/non-delivery claims in last 90 days
    cutoff_90 = (ref_time - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")
    claim_categories = (
        "refund",
        "return",
        "delivery",
        "damaged_product",
        "wrong_product",
        "missing_product",
        "fraud_suspicion",
    )
    placeholders = ",".join("?" for _ in claim_categories)
    cursor.execute(
        f"""
        SELECT COUNT(*)
        FROM support_tickets
        WHERE customer_id = ?
          AND category IN ({placeholders})
          AND created_at >= ?
        """,
        (customer_id, *claim_categories, cutoff_90),
    )
    claim_count = cursor.fetchone()[0]
    if claim_count >= 3:
        return {
            "flag": "EXCESSIVE_CLAIMS_PATTERN",
            "escalate": True,
            "team": "Trust & Safety",
            "claim_count": claim_count,
            "reason": f"Customer has {claim_count} claims in the last 90 days (threshold: >= 3).",
        }

    return None


# ---------------------------------------------------------------------------
# 10. 24-Hour Bank Payment Pending Gate
# ---------------------------------------------------------------------------

def handle_pending_payment(
    order_date: Union[str, datetime, date],
    current_time: Optional[Union[str, datetime, date]] = None,
) -> Dict[str, Any]:
    """Handle unconfirmed / pending payments per Payment Policy Sec 3.
    
    - < 24 hours: Advise customer to wait up to 24h for bank reconciliation.
    - >= 24 hours: Escalate to Refunds & Payments for auto-reversal investigation.
    """
    parsed_order = _parse_datetime_flexible(order_date)
    parsed_curr = resolve_reference_time(current_time)

    if parsed_order is None:
        return {
            "action": "ANSWER",
            "elapsed_hours": 0.0,
            "message": "Order placement date not found. Please verify order details.",
        }

    elapsed_seconds = max((parsed_curr - parsed_order).total_seconds(), 0.0)
    elapsed_hours = round(elapsed_seconds / 3600.0, 2)

    if elapsed_hours < 24.0:
        return {
            "action": "ANSWER",
            "elapsed_hours": elapsed_hours,
            "message": (
                "Banks can take up to 24 hours to confirm payment. "
                "Please allow until the 24-hour mark for reconciliation before raising a dispute."
            ),
        }
    else:
        return {
            "action": "ESCALATE",
            "team": "Refunds & Payments",
            "category": "pending_payment_verification",
            "elapsed_hours": elapsed_hours,
            "message": (
                f"Payment has remained pending for {elapsed_hours:.1f} hours (> 24 hours). "
                "Escalating to Refunds & Payments for auto-reversal investigation (5-7 business days)."
            ),
        }
