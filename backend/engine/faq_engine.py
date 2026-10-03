"""NovaMart Policy Knowledge Base & General FAQ Engine.

Provides authoritative, zero-hallucination answers to general customer queries
regarding delivery timelines, return windows, restocking fees, cancellations,
payments, warranties, exchanges, and product catalog searches, grounded in the
NovaMart Policy Handbook and SQLite database.
"""

import re
from typing import Any, Dict, Optional, Tuple
from backend.db.connection import fetch_all
from backend.engine.workflow_graph import TerminalMove


def resolve_general_policy_query(
    sanitized_message: str,
    customer_id: str,
    active_order: Optional[Dict[str, Any]] = None,
    customer_record: Optional[Dict[str, Any]] = None,
) -> Optional[Tuple[TerminalMove, str]]:
    """Evaluates whether the customer message is a general policy, product, or FAQ inquiry.
    
    Returns:
        Optional tuple of (TerminalMove, response_text). Returns None if not a recognized FAQ.
    """
    text = sanitized_message.lower().strip()

    # -------------------------------------------------------------------------
    # 1. DELIVERY TIMELINES & SHIPPING CHARGES
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(how\s+many\s+days|how\s+long|how\s+fast|"
        r"(delivery|shipping|transit)\s+(time|times|duration|timeline|timelines|estimate|speed|delay|charges?|fees?|cost)|"
        r"when\s+will\s+.*(deliver|arrive|reach)|free\s+shipping)\b",
        text,
        re.IGNORECASE,
    ):
        base_answer = (
            "NovaMart delivery timelines and shipping details:\n"
            "• **Metro Cities**: 3–5 business days transit.\n"
            "• **Other Cities**: 5–8 business days (up to 10 days for remote pincodes).\n"
            "• **Hyperlocal Dark Store**: 10–15 minutes for fresh groceries and essentials.\n"
            "• **Shipping Charges**: Free shipping on orders of ₹1,000 or more; flat ₹79 otherwise.\n"
            "• **Delivery Verification**: Orders ₹5,000 and above are handed over with a secure OTP."
        )

        if active_order:
            status = active_order.get("order_status", "")
            oid = active_order.get("order_id", "")
            courier = active_order.get("courier") or "SwiftLane"
            eta = active_order.get("estimated_delivery_date") or "today"

            if status == "out_for_delivery":
                order_note = f"\n\n📦 **Your Active Order {oid}**: Currently **out for delivery today** with {courier} and is scheduled to reach you by 6:00 PM!"
            elif status in ["shipped", "in_transit"]:
                order_note = f"\n\n📦 **Your Active Order {oid}**: Currently in transit with {courier}. Expected delivery is {eta}."
            elif status in ["placed", "confirmed", "processing"]:
                order_note = f"\n\n📦 **Your Active Order {oid}**: Currently {status} and will be handed to our courier within 1–3 business days (Expected: {eta})."
            else:
                order_note = f"\n\nIf you would like to track a specific parcel, please mention your Order ID (e.g. {oid})."
            return TerminalMove.ANSWER, base_answer + order_note

        return (
            TerminalMove.ANSWER,
            base_answer + "\n\nIf you have placed an order, simply share your Order ID (e.g. ORD-001042) to track its live progress!",
        )

    # -------------------------------------------------------------------------
    # 2. RETURN POLICY & RETURN WINDOWS
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(return\s+policy|how\s+(do|can)\s+i\s+return|return\s+window|return\s+period|"
        r"how\s+many\s+days\s+to\s+return|can\s+i\s+return|returnable|restocking\s+fee|"
        r"return\s+rules?|return\s+guidelines?)\b",
        text,
        re.IGNORECASE,
    ) and not re.search(r"\b(ORD-\d{6}|NM-?\d{4,6})\b", text, re.IGNORECASE):
        loyalty = (customer_record.get("loyalty_tier") or "bronze").capitalize() if customer_record else "Standard"
        loyalty_bonus = " (+2 days Gold bonus)" if loyalty == "Gold" else (" (+3 days Platinum bonus)" if loyalty == "Platinum" else "")

        return (
            TerminalMove.ANSWER,
            f"NovaMart Return Policy Overview (Your Tier: **{loyalty}**):\n"
            f"• **Change-of-Mind Returns**: 7 calendar days from delivery{loyalty_bonus}. Items must be unused in original packaging.\n"
            "• **Defective or Damaged Items**: 10 calendar days from delivery (with photo/video verification).\n"
            "• **Restocking Fee**: A 5% fee (capped at ₹2,500) applies exclusively to change-of-mind returns on high-value electronics (Laptops, Tablets, Cameras, Monitors). ₹0 fee for defect/damage returns.\n"
            "• **Non-Returnable Items**: Opened in-ear earbuds, unsealed cables, and used screen protectors for hygiene reasons.\n\n"
            "To start a return, provide your Order ID and the item name, and I will check your eligibility instantly!",
        )

    # -------------------------------------------------------------------------
    # 3. REPLACEMENT & EXCHANGE POLICY
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(exchange|replacement|replace\s+(my\s+)?(item|product|order)|can\s+i\s+exchange|"
        r"swap\s+for|exchange\s+policy|replacement\s+policy)\b",
        text,
        re.IGNORECASE,
    ) and not re.search(r"\b(ORD-\d{6}|NM-?\d{4,6})\b", text, re.IGNORECASE):
        return (
            TerminalMove.ANSWER,
            "NovaMart Replacement & Exchange Policy:\n"
            "• **Defective or Damaged Products**: Eligible for a free 1-to-1 replacement within **10 days** of delivery upon sharing photo/video proof.\n"
            "• **Size / Color Variants**: For lifestyle products, doorstep exchange is supported subject to stock availability in your dark store.\n"
            "• **Electronics**: If an exact replacement unit is unavailable, an immediate 100% refund to your original payment method will be issued.\n\n"
            "To request a replacement, please provide your Order ID and describe the reason!",
        )

    # -------------------------------------------------------------------------
    # 4. CANCELLATION POLICY
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(cancellation\s+policy|how\s+(do|can)\s+i\s+cancel|can\s+i\s+cancel|cancel\s+my\s+order|"
        r"cancel\s+policy|cancellation\s+charges?|cancel\s+fee|cancellation\s+rules?)\b",
        text,
        re.IGNORECASE,
    ) and not re.search(r"\b(ORD-\d{6}|NM-?\d{4,6})\b", text, re.IGNORECASE):
        return (
            TerminalMove.ANSWER,
            "NovaMart Cancellation Policy:\n"
            "• **Before Shipment (`placed`, `confirmed`, `processing`)**: Free instant cancellation at 100% refund, including shipping fees. No cancellation charge.\n"
            "• **After Shipment (`shipped`, `out_for_delivery`)**: Orders cannot be stopped in transit. You can refuse delivery at your doorstep, and a full refund will be issued once the package returns to our hub.\n"
            "• **Delivered Orders**: Cannot be cancelled; please raise a return under our Return Policy.\n\n"
            "To cancel an active order, please provide your Order ID (e.g. ORD-001042).",
        )

    # -------------------------------------------------------------------------
    # 5. REFUND TIMELINES & DESTINATION
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(refund\s+policy|when\s+will\s+i\s+get\s+my\s+refund|how\s+long\s+(does|for)\s+refund|"
        r"refund\s+timeline|refund\s+destination|money\s+back\s+time|refund\s+to\s+bank|"
        r"refund\s+to\s+upi|refund\s+method|how\s+do\s+refunds\s+work)\b",
        text,
        re.IGNORECASE,
    ) and not re.search(r"\b(ORD-\d{6}|NM-?\d{4,6})\b", text, re.IGNORECASE):
        return (
            TerminalMove.ANSWER,
            "NovaMart Refund Policy & Timelines:\n"
            "• **Refund Destination**: Strictly refunded to the **original payment instrument** used at checkout. For security, we never transfer funds to a different account in chat.\n"
            "• **UPI Transfers**: 1–3 business days after release.\n"
            "• **Credit / Debit Cards & Net Banking**: 5–7 business days to reflect on your statement.\n"
            "• **NovaMart Wallet**: Instant credit.\n"
            "• **Cash on Delivery (COD)**: Refunded instantly to NovaMart Wallet or via verified penny-drop bank verification.\n"
            "• **Late Delivery Goodwill**: ₹100 wallet credit for every full 3 days late beyond ETA (up to ₹300).",
        )

    # -------------------------------------------------------------------------
    # 6. PAYMENT METHODS & MONEY / BILLING DEDUCTED ISSUES
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(payment\s+methods?|cod|cash\s+on\s+delivery|money\s+deducted|payment\s+deducted|"
        r"amount\s+deducted|account\s+debited|debited\s+from|payment\s+failed|payment\s+pending|"
        r"deducted\s+but\s+not\s+placed|accepted\s+payments?|charged\s+twice|double\s+charge|"
        r"why\s+was\s+(i\s+charged|my\s+payment\s+deducted|money\s+deducted))\b",
        text,
        re.IGNORECASE,
    ):
        if re.search(r"\b(deducted|pending|debited|failed|charged|twice|double)\b", text, re.IGNORECASE):
            return (
                TerminalMove.ANSWER,
                "Payment & Billing Guidelines:\n"
                "• **Pending Bank Confirmations**: Banks can take up to 24 hours to confirm payment settlement. If your order was placed under 24 hours ago, please allow a short window for confirmation.\n"
                "• **Failed / Unconfirmed Transactions**: If payment status remains pending after 24 hours or fails completely, your bank will automatically reverse the full amount within 5–7 business days.\n"
                "• **Duplicate Charges**: If an amount was deducted twice, the duplicate capture will be auto-refunded by our payment gateway within 48 hours.\n\n"
                "If you need us to trace a specific failed transaction, please share your registered mobile number or Order ID.",
            )
        return (
            TerminalMove.ANSWER,
            "Accepted Payment Methods on NovaMart:\n"
            "• **UPI**: Google Pay, PhonePe, Paytm, BHIM.\n"
            "• **Cards**: Visa, MasterCard, RuPay credit and debit cards.\n"
            "• **Net Banking**: All major Indian commercial banks.\n"
            "• **NovaMart Wallet**: Instant checkout and one-click refunds.\n"
            "• **Cash on Delivery (COD)**: Available on orders up to ₹50,000.",
        )

    # -------------------------------------------------------------------------
    # 7. WARRANTY & DEFECTIVE HARDWARE
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(warranty|guarantee|warranty\s+period|how\s+does\s+warranty\s+work|"
        r"brand\s+warranty|repair\s+policy|warranty\s+claim|service\s+center)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Product Warranty & Service:\n"
            "• **Official Brand Warranty**: All electronic products and appliances sold on NovaMart carry official manufacturer warranties (typically 12 to 24 months).\n"
            "• **First 10 Days**: Direct doorstep replacement or refund by NovaMart for defects or transit damage (with photo verification).\n"
            "• **After 10 Days**: Servicing is handled by brand-authorized service centers nationwide using your official NovaMart invoice.\n"
            "• **Invoice Download**: Your GST tax invoice is accessible anytime under **My Account > Orders**.\n\n"
            "Share your Order ID or product name if you need warranty assistance!",
        )

    # -------------------------------------------------------------------------
    # 8. DISCOUNTS, OFFERS & COUPONS
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(offers?|discounts?|coupons?|promos?|promo\s+code|deals?|cashback|sale\b)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Active Offers & Discounts: 🏷️\n"
            "• **NOVA10**: 10% off on your first grocery & essentials purchase (up to ₹200).\n"
            "• **TECHFEST**: Flat ₹1,500 instant discount on laptops & monitors using HDFC/ICICI cards.\n"
            "• **FREEDEL**: Free shipping on all orders above ₹1,000.\n"
            "• **Loyalty Rewards**: Earn 1 Reward Coin for every ₹100 spent. Redeem coins at checkout for instant cash discounts!\n\n"
            "Visit our **Offers** page in the top menu to view all active deals.",
        )

    # -------------------------------------------------------------------------
    # 9. ADDRESS CHANGE RULES
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(can\s+i\s+change\s+(my\s+)?address|change\s+delivery\s+address|update\s+shipping\s+address|"
        r"wrong\s+address|update\s+my\s+address)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "Delivery Address Update Rules:\n"
            "• **Before Shipment (`placed`, `confirmed`, `processing`)**: You can update your delivery address once by providing your Order ID and new pincode.\n"
            "• **After Courier Handover (`shipped`, `out_for_delivery`)**: Addresses cannot be modified in transit because packages are routed by courier hubs. You may refuse delivery at your doorstep for a full refund or arrange pickup from the local courier facility.\n\n"
            "Please provide your Order ID if you would like to verify whether your order can be updated.",
        )

    # -------------------------------------------------------------------------
    # 10. HOW TO TRACK ORDERS
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(how\s+(do|can)\s+i\s+track|track\s+order|tracking\s+my\s+order|where\s+to\s+track)\b",
        text,
        re.IGNORECASE,
    ):
        active_note = f" (Your active order is **{active_order['order_id']}**)" if active_order else ""
        return (
            TerminalMove.ANSWER,
            f"Tracking Your NovaMart Order{active_note}:\n"
            "1. **In-Chat Tracking**: Type your Order ID (e.g. `Where is order ORD-001042?`) right here for live courier updates.\n"
            "2. **My Account**: Navigate to your **Account > Recent Orders** page in the top menu to view detailed shipment timelines.\n"
            "3. **SMS Alerts**: You will receive an automated dispatch SMS with your courier tracking link (SwiftLane, KaveriCargo, BlueArrow Express).",
        )

    # -------------------------------------------------------------------------
    # 11. HUMAN AGENT / CUSTOMER CARE HOTLINE
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(talk\s+to\s+(a\s+)?human|human\s+agent|speak\s+with\s+a\s+person|customer\s+care\s+number|"
        r"toll\s*free|phone\s+number|call\s+support|contact\s+support|helpline|customer\s+support)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Customer Support Contacts:\n"
            "• **Toll-Free Helpline**: 1800-419-NOVA (1800-419-6682), available daily from 6:00 AM to 12:00 AM IST.\n"
            "• **Email**: `support@novamart.in`\n"
            "• **Escalations**: If you have a disputed claim or complex case, let me know your Order ID and I can dispatch an escalation ticket directly to our Logistics, Payments, or Technical Support team!",
        )

    # -------------------------------------------------------------------------
    # 12. PRODUCT CATALOG SEARCH & RECOMMENDATIONS
    # -------------------------------------------------------------------------
    # Must not intercept order-specific actions, returns, damage claims, or memory continuity
    if re.search(r"\b(ORD-\d{6}|NM-?\d{4,6}|refund|return|cancel|damaged|broken|photo|sent|yesterday|crack|arrived|defective|bought|purchased|deliver)\b", text, re.IGNORECASE):
        return None

    catalog_keywords = [
        "laptop", "laptops", "notebook",
        "phone", "phones", "smartphone", "smartphones", "mobile",
        "earbud", "earbuds", "tws",
        "headphone", "headphones",
        "camera", "cameras",
        "monitor", "monitors",
        "keyboard", "keyboards",
        "mouse", "mice",
        "tablet", "tablets", "ipad",
        "smartwatch", "smartwatches", "watch",
        "speaker", "speakers", "bluetooth speaker",
        "gaming console", "accessories",
        "groceries", "fruits", "vegetables"
    ]
    has_browsing_intent = bool(re.search(r"\b(do\s+you\s+(have|sell)|show\s+me|recommend|looking\s+for|what\s+products?|buy\s+a|price\s+of|catalog|search\s+for)\b", text, re.IGNORECASE))
    matched_cat = [k for k in catalog_keywords if re.search(rf"\b{k}\b", text, re.IGNORECASE)]

    if has_browsing_intent and (matched_cat or "product" in text):
        term = matched_cat[0] if matched_cat else "laptop"
        try:
            prods = fetch_all(
                "SELECT product_name, category, price, rating FROM products "
                "WHERE category LIKE ? OR product_name LIKE ? "
                "ORDER BY rating DESC, price ASC LIMIT 3",
                (f"%{term}%", f"%{term}%"),
            )
            if prods:
                lines = []
                for p in prods:
                    lines.append(f"• **{p['product_name']}** ({p['category']}): ₹{int(p['price']):,} • ⭐ {p['rating']}/5.0")
                return (
                    TerminalMove.ANSWER,
                    f"Yes! Here are top-rated **{term.capitalize()}** available on NovaMart:\n"
                    + "\n".join(lines)
                    + f"\n\nYou can explore more options in the **{prods[0]['category']}** category in the top navigation bar or add them to your cart!"
                )
        except Exception:
            pass

    # Not an FAQ pattern
    return None
