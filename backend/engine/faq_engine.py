"""NovaMart Policy Knowledge Base & General FAQ Engine.

Provides authoritative, zero-hallucination answers to general customer queries
regarding delivery timelines, locations, return windows, non-returnable items,
restocking fees, cancellations, payments, warranties, exchanges, and product
catalog searches, grounded in the NovaMart Policy Handbook and SQLite database.
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

    # If the user is trying to perform an action on a specific order ID or their specific purchase,
    # let the order execution loop handle it.
    has_specific_order_id = bool(re.search(r"\b(ORD-\d{6}|NM-?\d{4,6})\b", text, re.IGNORECASE))
    has_specific_purchase_claim = bool(
        re.search(
            r"\b(i\s+bought\s+last|i\s+ordered\s+last|my\s+order\s+was|i\s+never\s+received\s+order|"
            r"give\s+me\s+.*refund\s+for|refund\s+now\s+for|already\s+sent\s+the\s+photo)\b",
            text,
            re.IGNORECASE,
        )
    )
    if has_specific_order_id or has_specific_purchase_claim:
        # Allow tracking inquiry to be answered if simple question
        if not re.search(r"\b(how\s+to\s+track|track\s+policy|where\s+to\s+track)\b", text, re.IGNORECASE):
            return None

    # -------------------------------------------------------------------------
    # 1. NON-RETURNABLE & HYGIENE ITEMS (Earbuds, Cables, Screen Protectors)
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(opened\s+(earbuds?|tws|headphones?|box|package|seal)|"
        r"(earbuds?|cables?|screen\s+protectors?)\s+.*(return|refund)|"
        r"can\s+i\s+return\s+.*(earbuds?|cables?|screen\s+protector|opened)|"
        r"non[\s-]returnable|hygiene|what\s+(items|products)\s+(cannot|can\s+not)\s+be\s+returned)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Non-Returnable & Hygiene Policy:\n"
            "• **In-Ear Earbuds & TWS**: Once the original seal or packaging is opened, in-ear earbuds cannot be returned for change-of-mind due to strict personal hygiene and sanitary regulations.\n"
            "• **Cables & Screen Protectors**: Unsealed charging/data cables and screen protectors with peeled adhesive are non-returnable for change-of-mind.\n"
            "• **Perishable Groceries & Food**: Fresh fruits, vegetables, dairy, and meat cannot be returned once delivery is accepted at your doorstep.\n"
            "• **Defective or Dead-on-Arrival (DOA) Exception**: If your earbuds, accessories, or electronics arrived physically damaged, cracked, or defective, you are 100% covered! You are entitled to a free 1-to-1 replacement or full refund within **10 days** of delivery upon sharing clear unboxing or defect photos.\n\n"
            "If your item arrived defective, simply share your Order ID and we will help you raise a defect claim!",
        )

    # -------------------------------------------------------------------------
    # 2. ADDRESS CHANGE RULES (Checked before delivery cities to avoid greedy city match)
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(can\s+i\s+change\s+(my\s+)?address|change\s+delivery\s+address|update\s+shipping\s+address|"
        r"wrong\s+address|update\s+my\s+address|change\s+address\s+to|change\s+my\s+delivery\s+address)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "Delivery Address Update Rules:\n"
            "• **Before Shipment (`placed`, `confirmed`, `processing`)**: You can update your delivery address once by providing your Order ID and new pincode before the package is handed to the courier.\n"
            "• **After Courier Handover (`shipped`, `out_for_delivery`)**: Addresses cannot be modified in transit because packages are routed by regional courier hubs. You may refuse delivery at your doorstep for a full refund or arrange pickup from the local courier facility.\n\n"
            "Please provide your Order ID if you would like to verify whether your address can still be updated.",
        )

    # -------------------------------------------------------------------------
    # 3. DAMAGED / BROKEN / DEFECTIVE ITEMS (General Guarantee Policy)
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(what\s+if\s+.*(broken|damaged|defective|cracked|doesn't\s+work)|"
        r"(arrived|item|product|package)\s+(is\s+)?(broken|damaged|cracked|defective|faulty)|"
        r"broken\s+item|damaged\s+product|dead\s+on\s+arrival|doa\b)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Damaged or Defective Item Guarantee: 🛡️\n"
            "• **10-Day Window**: If any product arrives damaged, broken, cracked, or defective, you are entitled to a free 1-to-1 replacement or 100% full refund within **10 calendar days** of delivery.\n"
            "• **Zero Deductions**: Defective and damaged returns incur **₹0 restocking fee** and receive 100% full reimbursement, including shipping fees.\n"
            "• **Simple Verification**: To protect against courier mishandling, simply share a clear photo or short video showing the defect and outer shipping label.\n\n"
            "If you received a damaged item, please share your **Order ID** (e.g. `ORD-001042`) so we can initiate your replacement or refund immediately!",
        )

    # -------------------------------------------------------------------------
    # 4. DELIVERY LOCATIONS, TIMELINES & HYPERLOCAL GROCERY
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(deliver\s+to|delivering\s+to|do\s+you\s+deliver|"
        r"delivery\s+(time|times|duration|timeline|timelines|estimate|speed|delay|charges?|fees?|cost|coverage|areas?|locations?|pincodes?)|"
        r"shipping\s+(time|times|duration|timeline|charges?|fees?|cost)|"
        r"how\s+many\s+days|how\s+long\s+(does|for)\s+delivery|how\s+fast\s+(is|do\s+you)\s+deliver|"
        r"when\s+will\s+.*(deliver|arrive|reach)|free\s+shipping|"
        r"grocery\s+delivery|quick\s+commerce|10\s*minutes?|dark\s*stores?|"
        r"(bangalore|mumbai|delhi|kolkata|chennai|hyderabad|pune|ahmedabad|jaipur|lucknow|chandigarh|bengaluru))\b",
        text,
        re.IGNORECASE,
    ):
        base_answer = (
            "NovaMart Delivery Timelines, Coverage & Shipping Details: 🚚\n"
            "• **Nationwide Service**: We deliver to Bangalore, Mumbai, Delhi, and all serviceable pincodes across India!\n"
            "• **Metro Cities**: 3–5 business days transit for standard retail orders.\n"
            "• **Other Cities & Towns**: 5–8 business days (up to 10 days for remote or northeastern pincodes).\n"
            "• **Hyperlocal Dark Store (Groceries & Essentials)**: Delivered in **10–15 minutes** flat from our temperature-controlled local dark stores.\n"
            "• **Shipping Charges**: **FREE shipping** on all orders of ₹1,000 or more; flat ₹79 otherwise.\n"
            "• **Doorstep Verification**: High-value orders of ₹5,000 and above are delivered with a secure 4-digit OTP sent to your registered mobile."
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
            base_answer + "\n\nIf you have already placed an order, share your Order ID (e.g. `ORD-001042`) right here for live courier tracking!",
        )

    # -------------------------------------------------------------------------
    # 5. LATE DELIVERY & GOODWILL WALLET CREDIT
    # -------------------------------------------------------------------------
    if re.search(
        r"\b((late|delayed)\s+(delivery|order|package|parcel|shipment)|"
        r"delivery\s+(is|was)\s+(late|delayed)|why\s+is\s+(my\s+)?order\s+late|"
        r"goodwill\s+credit|compensation\s+for\s+delay|late\s+package)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Delayed Delivery Policy & Goodwill Compensation:\n"
            "• **Standard Delays (1–3 days beyond ETA)**: Weather or courier route bottlenecks can occasionally cause minor delays. We track transit milestones in real time and notify you via SMS.\n"
            "• **Late Delivery Goodwill Credit**: If your order arrives **more than 3 full days late** beyond the promised delivery ETA, NovaMart provides an automatic goodwill wallet credit of **₹100 for each full 3 days late** (up to a maximum cap of **₹300**).\n"
            "• **Suspected Lost in Transit (>7 days no movement)**: If a parcel exhibits zero courier tracking scans for more than 7 days, we open an urgent Logistics investigation (resolved within 72 hours) and issue a 100% refund or free replacement.\n\n"
            "To check the tracking status or goodwill eligibility for your shipment, please provide your Order ID (e.g. `ORD-001042`).",
        )

    # -------------------------------------------------------------------------
    # 6. RESTOCKING FEE RULES
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(restocking\s+fees?|restocking\s+charges?|why\s+(is\s+there|do\s+you\s+charge)\s+a\s+restocking|"
        r"5%\s+(fee|charge|restocking)|deduct\s+5%)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Restocking Fee Policy:\n"
            "• **Applicable Categories**: A 5% restocking fee (strictly capped at **₹2,500**) applies **only** to change-of-mind returns on four high-value electronics categories: **Laptops, Tablets, Cameras, and Monitors** under Policy v2 (orders placed on or after June 1, 2026).\n"
            "• **Zero Fee for Defects**: If the product arrived defective, damaged, or dead-on-arrival, the restocking fee is **₹0** (no deduction).\n"
            "• **Zero Fee on Other Categories**: Smartphones, headphones, accessories, home goods, and groceries carry **₹0** restocking fee.\n"
            "• **Why It Applies**: High-value electronics require certified diagnostic lab inspection, anti-static cleaning, secure factory data wipes, and repackaging before return to stock.",
        )

    # -------------------------------------------------------------------------
    # 7. LOYALTY TIERS & EXTENSIONS
    # -------------------------------------------------------------------------
    if re.search(
        r"\b((gold|platinum|bronze|silver)\s+(tier|member|loyalty)|"
        r"loyalty\s+(tier|program|rewards?|benefits?|bonus|points?|coins?)|"
        r"tier\s+benefits?)\b",
        text,
        re.IGNORECASE,
    ):
        user_tier = (customer_record.get("loyalty_tier") or "bronze").capitalize() if customer_record else "Standard"
        return (
            TerminalMove.ANSWER,
            f"NovaMart Customer Loyalty Program (Your Current Tier: **{user_tier}**): 🌟\n"
            "• **Bronze & Silver Members**: Standard 7-day change-of-mind return window.\n"
            "• **Gold Members**: **+2 bonus calendar days** on change-of-mind returns (total 9 days).\n"
            "• **Platinum Members**: **+3 bonus calendar days** on change-of-mind returns (total 10 days).\n"
            "• **Reward Coins**: Earn 1 Coin for every ₹100 spent across all purchases. Coins can be redeemed at checkout for instant cash discounts.\n"
            "• *Note*: Loyalty extensions apply specifically to change-of-mind returns. Defective/damaged returns have a generous 10-day window across all tiers.",
        )

    # -------------------------------------------------------------------------
    # 8. RETURN POLICY & RETURN WINDOWS
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(return\s+policy|how\s+(do|can)\s+i\s+return|return\s+window|return\s+period|"
        r"how\s+many\s+days\s+to\s+return|can\s+i\s+return|returnable|"
        r"return\s+rules?|return\s+guidelines?|change\s+of\s+mind)\b",
        text,
        re.IGNORECASE,
    ):
        loyalty = (customer_record.get("loyalty_tier") or "bronze").capitalize() if customer_record else "Standard"
        loyalty_bonus = " (+2 days Gold bonus)" if loyalty == "Gold" else (" (+3 days Platinum bonus)" if loyalty == "Platinum" else "")

        return (
            TerminalMove.ANSWER,
            f"NovaMart Return Policy Overview (Your Tier: **{loyalty}**):\n"
            f"• **Change-of-Mind Returns**: 7 calendar days from delivery{loyalty_bonus} under Policy v2 (10 days under Policy v1). Items must be unused in original packaging with all accessories.\n"
            "• **Defective or Damaged Items**: 10 calendar days from delivery (with photo/video verification).\n"
            "• **Restocking Fee**: A 5% fee (capped at ₹2,500) applies exclusively to change-of-mind returns on high-value electronics (Laptops, Tablets, Cameras, Monitors). ₹0 fee for defect/damage returns.\n"
            "• **Non-Returnable Items**: Opened in-ear earbuds, unsealed cables, and used screen protectors for hygiene reasons.\n"
            "• **Doorstep Pickup**: Once approved, our courier partner picks up the package from your address within 24–48 hours.\n\n"
            "To initiate a return, provide your Order ID and item name, and I will check your eligibility instantly!",
        )

    # -------------------------------------------------------------------------
    # 9. REPLACEMENT & EXCHANGE POLICY
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(exchange|replacement|replace\s+(my\s+)?(item|product|order)|can\s+i\s+exchange|"
        r"swap\s+for|exchange\s+policy|replacement\s+policy)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Replacement & Exchange Policy:\n"
            "• **Defective or Damaged Products**: Eligible for a free 1-to-1 replacement within **10 days** of delivery upon sharing photo/video proof.\n"
            "• **Size / Color Variants**: For lifestyle and apparel products, doorstep exchange is supported subject to stock availability in your local dark store.\n"
            "• **Out-of-Stock Electronics**: If an exact replacement unit is unavailable, an immediate 100% refund to your original payment method will be issued.\n\n"
            "To request a replacement, please provide your Order ID and tell me what went wrong with the item!",
        )

    # -------------------------------------------------------------------------
    # 10. CANCELLATION POLICY
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(cancellation\s+policy|how\s+(do|can)\s+i\s+cancel|can\s+i\s+cancel|cancel\s+my\s+order|"
        r"cancel\s+policy|cancellation\s+charges?|cancel\s+fee|cancellation\s+rules?)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Cancellation Policy:\n"
            "• **Before Shipment (`placed`, `confirmed`, `processing`)**: Free instant cancellation at 100% refund, including all shipping fees. Zero cancellation charge.\n"
            "• **After Courier Handover (`shipped`, `out_for_delivery`)**: Orders cannot be stopped while moving in transit. You can refuse delivery at your doorstep when the delivery partner arrives, and a full refund will be initiated once the package returns to our hub.\n"
            "• **Delivered Orders**: Delivered items cannot be cancelled; please use our Return Policy within the return window.\n\n"
            "To cancel an active order, please provide your Order ID (e.g. `ORD-001042`).",
        )

    # -------------------------------------------------------------------------
    # 11. REFUND TIMELINES, DESTINATION & DELAYED REFUNDS (Checked before general payment methods)
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(refund\s+(policy|timeline|timelines|destination|time|times|speed|timeframe|duration|period|method|methods)|"
        r"when\s+will\s+i\s+get\s+my\s+refund|how\s+long\s+(does|for)\s+refund|"
        r"money\s+back\s+time|refund\s+to\s+bank|refund\s+to\s+upi|how\s+do\s+refunds\s+work|"
        r"(why\s+(was|is)\s+my\s+)?refund\s+(delayed|pending|late|not\s+received))\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Refund Policy & Timelines:\n"
            "• **Refund Destination**: Strictly refunded to the **original payment instrument** used at checkout. For security and fraud prevention, we never transfer funds to third-party bank accounts or different UPI IDs in chat.\n"
            "• **NovaMart Wallet**: Instant credit upon approval.\n"
            "• **UPI Transfers**: 1–3 business days after release to your registered VPA.\n"
            "• **Credit / Debit Cards & Net Banking**: 5–7 business days (dependent on your issuing bank's settlement cycle).\n"
            "• **Cash on Delivery (COD)**: Refunded instantly to NovaMart Wallet or transferred via verified penny-drop bank verification.\n"
            "• **Late Delivery Goodwill**: ₹100 wallet credit for every full 3 days late beyond ETA (up to ₹300).\n\n"
            "If your refund status shows approved but hasn't reflected after the expected window, share your Order ID and we'll pull your bank reference (RRN/UTR) number!",
        )

    # -------------------------------------------------------------------------
    # 12. PAYMENT METHODS, COD LIMITS & BILLING / DEDUCTED ISSUES
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(payment\s+methods?|cod\b|cash\s+on\s+delivery|money\s+deducted|payment\s+deducted|"
        r"amount\s+deducted|account\s+debited|debited\s+from|payment\s+failed|payment\s+pending|"
        r"deducted\s+but\s+not\s+placed|accepted\s+payments?|charged\s+twice|double\s+charge|"
        r"can\s+i\s+pay\s+(via|with)|credit\s+card|debit\s+card|net\s+banking|upi|"
        r"cod\s+limit|maximum\s+cod|is\s+cod\s+available\s+for)\b",
        text,
        re.IGNORECASE,
    ):
        # Specific COD limit check (e.g. ₹60,000)
        high_cod_match = re.search(r"₹?\s*(\d{1,3}(?:,\d{3})*|\d+)", text)
        if high_cod_match and "cod" in text:
            try:
                val = float(high_cod_match.group(1).replace(",", ""))
                if val > 50000:
                    return (
                        TerminalMove.ANSWER,
                        f"NovaMart Cash on Delivery (COD) Limit Notice:\n"
                        f"• COD is strictly available on orders **up to ₹50,000**.\n"
                        f"• For orders exceeding ₹50,000 (such as your mentioned ₹{int(val):,}), payment must be completed via secure prepaid options (UPI, Credit/Debit Card, Net Banking, or NovaMart Wallet).\n"
                        "• All orders of ₹5,000 or more include mandatory OTP verification upon delivery for your safety.",
                    )
            except Exception:
                pass

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
            "• **Cash on Delivery (COD)**: Available on orders up to ₹50,000.\n"
            "• **Taxes**: 18% GST is added transparently at checkout.",
        )

    # -------------------------------------------------------------------------
    # 13. WARRANTY & DEFECTIVE HARDWARE
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(warranty|guarantee|warranty\s+period|how\s+does\s+warranty\s+work|"
        r"brand\s+warranty|repair\s+policy|warranty\s+claim|service\s+center|"
        r"warranty\s+for\s+(smartphones?|laptops?|electronics?|phones?|tablets?|monitors?))\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Product Warranty & Service Coverage:\n"
            "• **Official Brand Warranty**: All electronics, gadgets, and appliances sold on NovaMart carry official manufacturer warranties (typically 12 to 24 months, with up to 36 months on select monitors and components).\n"
            "• **First 10 Days**: Direct doorstep replacement or 100% refund by NovaMart for manufacturing defects or transit damage (with photo/video verification).\n"
            "• **After 10 Days**: Servicing and warranty repairs are covered by brand-authorized service centers nationwide using your official NovaMart GST tax invoice.\n"
            "• **Exclusions**: Physical drop damage, cracked screens caused by user impact, liquid damage, and unauthorized third-party tampering are not covered under standard manufacturer warranty.\n"
            "• **Invoice Download**: Your GST tax invoice is accessible anytime under **My Account > Orders**.\n\n"
            "Share your Order ID or product name if you need help claiming warranty!",
        )

    # -------------------------------------------------------------------------
    # 14. INVOICE & TAX / GST INQUIRIES
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(invoice|download\s+invoice|tax\s+invoice|bill\b|receipt|gst\s+bill|get\s+invoice)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Invoices & Tax Bills:\n"
            "• **Official Tax Invoice**: Every NovaMart order generates an official GST-compliant tax invoice showing itemised GST breakdowns (18% on electronics).\n"
            "• **How to Download**: Log into your account and navigate to **My Account > Recent Orders** in the top menu. Select your order and click **Download Tax Invoice (PDF)**.\n"
            "• **Warranty Proof**: Your NovaMart invoice serves as valid proof of purchase at all brand-authorized service centers nationwide.",
        )

    # -------------------------------------------------------------------------
    # 15. HOW TO TRACK ORDERS
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
            "3. **SMS Alerts**: You will receive automated dispatch SMS alerts with your courier tracking link (SwiftLane, KaveriCargo, BlueArrow Express).",
        )

    # -------------------------------------------------------------------------
    # 16. HUMAN AGENT / CUSTOMER CARE HOTLINE
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
    # 17. OFFERS, DISCOUNTS & COUPONS
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
    # 18. POLICY V1 VS V2 COMPARISON
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(policy\s+v1\s+vs\s+v2|policy\s+versions?|difference\s+between\s+policy|cutoff\s+date)\b",
        text,
        re.IGNORECASE,
    ):
        return (
            TerminalMove.ANSWER,
            "NovaMart Policy Versioning Rules (Cutoff: **June 1, 2026**):\n"
            "• **Policy v1 (Orders placed before 2026-06-01)**:\n"
            "  - Change of mind: 10 calendar days | Defect window: 15 days.\n"
            "  - Restocking fee: ₹0 across all categories.\n"
            "  - Tier 1 Approval limit: ₹1,00,000.\n"
            "• **Policy v2 (Orders placed on or after 2026-06-01)**:\n"
            "  - Change of mind: 7 calendar days (+2d Gold / +3d Platinum bonus) | Defect window: 10 days.\n"
            "  - Restocking fee: 5% (capped at ₹2,500) on Laptops, Tablets, Cameras, Monitors for change-of-mind.\n"
            "  - Tier 1 Approval limit: ₹75,000.\n"
            "• **Note**: The policy version is determined strictly by `orders.order_date`, never retroactively.",
        )

    # -------------------------------------------------------------------------
    # 19. GENERAL BOT CAPABILITIES & ASSISTANCE
    # -------------------------------------------------------------------------
    if re.search(
        r"\b(can\s+you\s+help\s+me|help\s+me|what\s+can\s+i\s+ask|what\s+can\s+you\s+do|"
        r"how\s+can\s+you\s+assist|support\s+options|what\s+are\s+your\s+features|who\s+are\s+you|"
        r"what\s+is\s+novamart)\b",
        text,
        re.IGNORECASE,
    ):
        cust_name = customer_record.get("first_name") if customer_record else "there"
        return (
            TerminalMove.ANSWER,
            f"Hello {cust_name}! 👋 I am **NovaMart AI Customer Support Assistant**! 🛒✨\n\n"
            "Here is what I can assist you with right now:\n"
            "• 📦 **Live Order Tracking**: Provide your Order ID (e.g. `ORD-001042`) for instant transit milestones & courier status.\n"
            "• 🔄 **Returns & Exchanges**: Check return eligibility, calculate restocking fees, and book pickup within policy windows.\n"
            "• 💰 **Refunds & Cancellations**: Cancel unshipped orders for 100% instant refund, or check refund timelines.\n"
            "• 🛡️ **Warranty & Repairs**: Look up manufacturer warranty terms and service center procedures.\n"
            "• 🛒 **Catalog & Recommendations**: Inquire about laptops, phones, earbuds, groceries, and current discounts.\n"
            "• 🧑‍💼 **Human Escalation**: Connect directly to Logistics, Refunds, or Technical Support teams with priority ticketing.\n\n"
            "How can I assist you with your purchases today?",
        )

    # -------------------------------------------------------------------------
    # 20. PRODUCT CATALOG SEARCH & BROWSING
    # -------------------------------------------------------------------------
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
        "gaming", "accessories",
        "groceries", "fruits", "vegetables", "dairy", "snacks"
    ]
    has_browsing_intent = bool(
        re.search(
            r"\b(do\s+you\s+(have|sell)|show\s+me|recommend|looking\s+for|what\s+products?|"
            r"buy\s+a|price\s+of|catalog|search\s+for|what\s+do\s+you\s+sell|"
            r"what\s+products\s+do\s+you\s+have|available\s+products?)\b",
            text,
            re.IGNORECASE,
        )
    )
    matched_cat = [k for k in catalog_keywords if re.search(rf"\b{k}\b", text, re.IGNORECASE)]

    # If general browsing inquiry without specific product keyword
    if has_browsing_intent and not matched_cat:
        try:
            sample_prods = fetch_all(
                "SELECT category, COUNT(*) as cnt, MIN(price) as min_p, MAX(price) as max_p "
                "FROM products GROUP BY category ORDER BY cnt DESC LIMIT 6"
            )
            cat_lines = []
            for cp in sample_prods:
                cat_lines.append(f"• **{cp['category']}**: {cp['cnt']} items available (from ₹{int(cp['min_p']):,})")
            return (
                TerminalMove.ANSWER,
                "NovaMart carries over 300+ certified products across 14 categories with nationwide delivery:\n"
                + "\n".join(cat_lines)
                + "\n\nYou can browse full categories in our top navigation bar, or ask me for recommendations in any category (e.g. *'Recommend top laptops'* or *'Show earbuds under ₹5,000'*)!",
            )
        except Exception:
            return (
                TerminalMove.ANSWER,
                "NovaMart offers top-rated products across Smartphones, Laptops, Audio & Earbuds, Cameras, Tablets, Smartwatches, and Fresh Groceries! You can browse the catalog in the top navigation bar.",
            )

    if (has_browsing_intent or "recommend" in text or "price of" in text or "search for" in text) and matched_cat:
        term = matched_cat[0]
        # Map grocery synonyms
        query_term = term
        if term in ["groceries", "fruits", "vegetables", "dairy", "snacks"]:
            query_term = "groceries"

        try:
            prods = fetch_all(
                "SELECT product_name, category, price, rating FROM products "
                "WHERE category LIKE ? OR product_name LIKE ? "
                "ORDER BY rating DESC, price ASC LIMIT 4",
                (f"%{query_term}%", f"%{query_term}%"),
            )
            if prods:
                lines = []
                for p in prods:
                    lines.append(f"• **{p['product_name']}** ({p['category']}): ₹{int(p['price']):,} • ⭐ {p['rating']}/5.0")
                return (
                    TerminalMove.ANSWER,
                    f"Yes! Here are top-rated **{term.capitalize()}** available on NovaMart:\n"
                    + "\n".join(lines)
                    + f"\n\nYou can explore more items in the **{prods[0]['category']}** category in the top navigation bar or add them directly to your cart!",
                )
        except Exception:
            pass

    # Not an FAQ pattern
    return None
