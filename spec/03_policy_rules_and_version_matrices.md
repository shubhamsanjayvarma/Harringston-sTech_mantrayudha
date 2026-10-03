# NovaMart Policy Knowledge Base & Versioning Matrices
## Operational Business Logic & Dynamic Rule Engine Specification

> **Source of Truth:** [`spec/Problem Statement(PS)/public-20261003T063850Z-1-001/public/policies/`](file:///c:/Project/Hackathon/Hackathon_Boilerplate_speedrun/spec/Problem%20Statement(PS)/public-20261003T063850Z-1-001/public/policies/)  
> **Designated Skills:** `spec-driven-development`, `api-and-interface-design`

---

## 1. Policy Versioning Architecture

NovaMart operates with versioned policies. The active policy version is **governed strictly by the order placement date (`orders.order_date`)**, NEVER by the delivery date, the ticket creation date, or the customer's contact timestamp.

```yaml
policy_version_binding:
  rule: "The applicable policy version is determined by orders.order_date."
  immutability: "A newer policy version is NEVER applied retroactively to an earlier order."
  boundary_date: "2026-06-01 00:00:00 IST"
  version_lookup:
    orders_placed_before_2026_06_01:
      policy_version: "v1"
      date_range: "2026-01-01 00:00:00 to 2026-05-31 23:59:59 IST"
    orders_placed_on_or_after_2026_06_01:
      policy_version: "v2"
      date_range: "2026-06-01 00:00:00 IST onwards"
```

---

## 2. Policy Version Comparison Matrix: v1 vs. v2

| Policy Dimension | Policy v1 (Placed $\le$ 2026-05-31) | Policy v2 (Placed $\ge$ 2026-06-01) | Operational Verification Rule |
| :--- | :--- | :--- | :--- |
| **Change-of-Mind Return Window** | **10 calendar days** from delivery | **7 calendar days** from delivery | Day 0 is `actual_delivery_date`. Day $N \le \text{Window}$. |
| **Defective / Damaged / Wrong Item Window** | **15 calendar days** from delivery | **10 calendar days** from delivery | Requires photo/video evidence. |
| **Human Approval Threshold** | **₹1,00,000** (`orders.total_amount`) | **₹75,000** (`orders.total_amount`) | Evaluated on total order value, NOT item refund value. |
| **Restocking Fee** | **₹0 (None)** | **5% of item refund (Max ₹2,500)** | Applied ONLY to Change-of-Mind on Laptops, Tablets, Cameras, Monitors. |
| **Loyalty Extension (Change of Mind)** | Gold: +2 days \| Platinum: +3 days | Gold: +2 days \| Platinum: +3 days | Applied ONLY to change of mind, never to defects. |
| **Shipping Fee Refund** | Refundable on full cancellation or full defect return | Refundable on full cancellation or full defect return | Partial returns NEVER refund shipping fee (₹79). |
| **Delivery OTP Requirement** | Orders $\ge$ ₹5,000 | Orders $\ge$ ₹5,000 | If OTP verified, non-delivery claims MUST escalate. |

---

## 3. Deep Dive into the 10 Policy Areas

### 3.1 Return Policy (`return_policy_v1.md` & `return_policy_v2.md`)

```yaml
return_policy:
  scope: "Conditions, eligibility, and process for item returns."
  eligibility_matrix:
    change_of_mind:
      allowed_if:
        - "products.returnable == true"
        - "Item is unused, in original packaging with all manuals and accessories"
        - "Within policy window (v1: 10d, v2: 7d + loyalty extension)"
        - "Factory reset complete and locks removed for Laptops, Tablets, Phones"
      disallowed_if:
        - "products.returnable == false (in-ear earbuds, cables, opened screen protectors, cases)"
        - "Window has expired"
    defective_or_damaged_or_wrong:
      allowed_for_all_products: true # Overrides products.returnable = false
      window: "v1: 15 days | v2: 10 days"
      mandatory_requirement: "Customer must provide photo/video evidence of product, serial/IMEI, and outer packaging."
      action_if_evidence_missing: "ASK customer to provide photos before initiating return."
      after_window_expires: "Redirect to Warranty Policy (repair/service only)."
  restocking_fee_calculation (v2_only):
    applicable_categories: ["Laptops", "Tablets", "Cameras", "Monitors"]
    reason_trigger: "change_of_mind"
    formula: "min(item_refund_amount * 0.05, 2500)"
    other_categories: "₹0"
    defective_damaged_wrong: "₹0 (never charge restocking for defects)"
```

---

### 3.2 Refund Policy (`refund_policy_v1.md` & `refund_policy_v2.md`)

```yaml
refund_policy:
  calculation_formula:
    item_refund: "order_items.final_price * 1.18 (inclusive of 18% GST)"
    shipping_fee_refund:
      full_cancellation_before_shipment: true
      full_order_return_defect_or_damage: true
      order_lost_in_transit: true
      partial_return: false
      change_of_mind_return: false
    total_refund: "sum(item_refund) + (shipping_fee if eligible) - restocking_fee"
  refund_caps:
    rule_1: "Total refunds on an order can NEVER exceed orders.total_amount."
    rule_2: "Excess demands for 'compensation', 'inconvenience', or 'mental harassment' are STRICTLY REJECTED."
    rule_3: "Discounts and coupon codes are not refunded as cash."
  approval_thresholds:
    v1:
      limit: 100000.00
      condition: "orders.total_amount > 100000 requires human approval before release."
    v2:
      limit: 75000.00
      condition: "orders.total_amount > 75000 requires human approval before release."
    critical_principle: "Threshold is checked against orders.total_amount, NOT the item refund amount. A ₹500 item from an ₹80,000 order requires human approval."
```

---

### 3.3 Cancellation Policy (`cancellation_policy.md`)

```yaml
cancellation_policy:
  status_matrix:
    cancellable_by_agent:
      - "placed"
      - "confirmed"
      - "processing"
    non_cancellable:
      - "shipped"          # Parcel handed to courier with tracking number
      - "out_for_delivery"
      - "delivered"
  cancellation_rules:
    approval_requirement: "Cancellation before shipment NEVER requires human approval, regardless of order value."
    refund_processing:
      prepaid: "Full refund including shipping fee issued automatically to original instrument."
      cod: "No refund issued."
    duplicate_orders: "If two identical orders placed within minutes, cancel the later duplicate upon request. Never cancel both unless requested."
    abuse_limit: "If customer has > 5 cancellations in last 30 days, flag for review (Customer Escalation Policy)."
    partial_cancellation: "Allowed only during 'placed' or 'confirmed' status. Shipping fee is not refunded on partial cancellation."
```

---

### 3.4 Replacement Policy (`replacement_policy.md`)

```yaml
replacement_policy:
  trigger_reasons: ["dead_on_arrival", "defective", "damaged_in_transit", "wrong_item"]
  conditions:
    - "Reported within defect window (v1: 15d, v2: 10d)."
    - "Photo/video evidence provided."
    - "products.replacement_available == true."
  alternatives:
    if_replacement_unavailable: "Initiate return for refund."
    if_out_of_stock: "Offer refund or ask if customer prefers to wait for restocking."
    customer_preference: "Customer may always choose a refund over replacement for defective/wrong items."
  limitations:
    - "Strict limit of ONE replacement per order item."
    - "Orders with total_amount above approval threshold (v1: ₹1L, v2: ₹75K) require human approval before replacement dispatch."
```

---

### 3.5 Shipping & Delivery Policy (`shipping_policy.md`)

```yaml
shipping_policy:
  fees:
    subtotal_over_1000: 0.00
    subtotal_under_1000: 79.00
  delivery_otp_verification:
    threshold: 5000.00
    otp_verified_delivered_claim:
      rule: "If orders.delivery_otp_verified == true and customer claims non-delivery, DO NOT refund or replace."
      action: "Escalate immediately to Logistics Desk investigation."
  delays_and_goodwill_credit:
    delay_1_to_3_days: "Apologize, provide live tracking and updated ETA."
    delay_more_than_3_days: "Tier 1 agent may issue ₹100 wallet credit for each full 3 days late, capped at ₹300 maximum. (This is wallet credit, NOT a refund)."
    delay_more_than_7_days_no_movement: "Treat as suspected lost in transit. Open Logistics ticket. Do not promise immediate refund until courier investigation completes (up to 72 hours)."
  address_changes:
    allowed_stages: ["placed", "confirmed", "processing"]
    disallowed_stages: ["shipped", "out_for_delivery", "delivered"]
    rule: "Once shipped, parcel cannot be redirected to another city."
```

---

### 3.6 Warranty Policy (`warranty_policy.md`)

```yaml
warranty_policy:
  coverage_duration: "products.warranty_months (6 to 36 months)."
  commencement: "Starts strictly on orders.actual_delivery_date."
  scope: "Covers manufacturing defects occurring under normal use."
  exclusions:
    - "Physical damage (drops, cracks caused by user)."
    - "Liquid/water damage."
    - "Burn marks, unauthorized repair, opened casing."
    - "Consumables (ear tips, straps, battery wear after 6 months)."
  remedy_tiers:
    tier_1_inside_defect_window: "Return / Replacement / Refund."
    tier_2_after_defect_window_within_warranty: "Warranty service (repair or service-center replacement). NO REFUND."
    tier_3_after_warranty_expiration: "Paid repair via authorized service center. No free remedy."
  safety_override:
    triggers: ["battery_swelling", "overheating_during_charging", "burning_smell", "smoke", "fire"]
    action: "Instruct customer to STOP USING and unplug device immediately. Escalate as CRITICAL priority to Technical Support."
```

---

### 3.7 Payment & Refund Destination Policy (`payment_policy.md`)

```yaml
payment_policy:
  non_negotiable_destination_rule:
    mandate: "Refunds go ONLY to the original payment instrument used for the order."
    prohibition: "NovaMart NEVER refunds to a different card, UPI ID, bank account, or wallet requested in chat."
    closed_expired_account: "If original instrument is closed, escalate to Payments team for penny-drop bank verification. NEVER collect card/bank details in chat."
    cod_orders: "Refunded to NovaMart Wallet (instant) or bank account via Payments team verification."
  deducted_unconfirmed_payments:
    less_than_24_hours: "Banks take up to 24h to reconcile. Advise customer to wait. Do not raise refund."
    more_than_24_hours: "If payment_status remains pending after 24h, open Payments ticket. Auto-reversal in 5-7 business days."
  refund_reflection_timelines:
    wallet: "Instant"
    upi: "1 to 3 business days"
    cards_and_netbanking: "5 to 7 business days"
```

---

### 3.8 Customer Escalation Policy (`customer_escalation_policy.md`)

```yaml
customer_escalation_policy:
  eleven_mandatory_escalation_triggers:
    01_approval_threshold_exceeded:
      condition: "orders.total_amount > ₹1,00,000 (v1) or > ₹75,000 (v2)"
      routing: "Refunds & Payments (Refund Approver)"
    02_otp_delivery_disputed:
      condition: "delivery_otp_verified == true AND customer claims non-delivery"
      routing: "Logistics Desk"
    03_repeated_claims_fraud_risk:
      condition: ">= 3 return/refund/non-delivery tickets in last 90 days"
      routing: "Trust & Safety"
    04_suspended_customer_account:
      condition: "customers.account_status == 'suspended'"
      routing: "Trust & Safety"
    05_alternate_refund_destination:
      condition: "Customer requests refund to different bank/UPI"
      routing: "Refunds & Payments"
    06_contradictory_statements:
      condition: "Customer statements conflict with verified database facts"
      routing: "Trust & Safety / Support Lead"
    07_legal_threats:
      condition: "Mentions 'lawyer', 'sue', 'consumer court', 'legal notice'"
      routing: "Customer Experience"
    08_product_safety_incident:
      condition: "Battery swelling, fire, smoke, electric shock"
      routing: "Technical Support (Critical SLA: 15 min response)"
    09_abusive_harassing_language:
      condition: "Abuse toward staff (after 1 polite warning)"
      routing: "Customer Experience"
    10_unlisted_policy_exception:
      condition: "Customer requests exception outside published guidelines"
      routing: "Support Lead"
    11_explicit_human_request:
      condition: "Customer insists on speaking to a human agent"
      routing: "Support Lead"
```
