# NovaMart Agent Tools & API Function Calling Contracts
## Bounded Execution Sandbox & Deterministic Verification Specification

> **Source of Truth:** [`spec/Problem Statement(PS)/Mantra_Yudha_Handbook_for_Participants.pdf`](file:///c:/Project/Hackathon/Hackathon_Boilerplate_speedrun/spec/Problem%20Statement(PS)/Mantra_Yudha_Handbook_for_Participants.pdf) (Page 7)  
> **Designated Skills:** `api-and-interface-design`, `spec-driven-development`

---

## 1. Tool Execution Philosophy: Tools Are the Agent's Hands

Without tools, the AI agent is merely an untrusted conversational text generator. Tools provide the agent with read-access to ground-truth databases and write-access to bounded operational mutations.

```yaml
tool_governance_rules:
  01_intentionality: "Every tool call must have an explicit factual justification. Redundant or exploratory calls ('just in case') are strictly penalized."
  02_pre_execution_guard: "Every write/mutation tool call must be intercepted and validated by the backend deterministic verification engine before database execution."
  03_parameter_integrity: "Tool arguments must be derived directly from verified database records, never from unverified customer assertions."
  04_security_redaction: "Read tools must strictly redact internal-only fields (e.g. delivery OTP, courier driver personal numbers, internal investigation flags) before context injection."
```

---

## 2. Complete Tool Catalog & Schemas (Strict YAML)

### 2.1 Information Retrieval Tools (Read-Only)

#### `get_customer`
```yaml
name: "get_customer"
description: "Retrieves complete customer profile, loyalty tier, account standing, and contact info by customer_id or email."
parameters:
  type: "object"
  properties:
    customer_id:
      type: "string"
      format: "CUST-XXXXX"
      description: "Unique NovaMart customer identifier."
    email:
      type: "string"
      format: "email"
      description: "Customer email address."
  required: []
  constraint: "Must provide at least customer_id OR email."
returns:
  customer_id: "string"
  name: "string"
  email: "string"
  phone: "string"
  account_status: "string (active | inactive | suspended)"
  loyalty_tier: "string (bronze | silver | gold | platinum)"
  total_orders: "integer"
  total_spend: "number"
  customer_since: "string"
redaction_guard: "Never returns payment card numbers or hashed credentials."
```

#### `get_order`
```yaml
name: "get_order"
description: "Retrieves order master details, shipping state, item lines, payment status, and delivery tracking."
parameters:
  type: "object"
  properties:
    order_id:
      type: "string"
      format: "ORD-XXXXXX"
      description: "Unique NovaMart order identifier."
  required: ["order_id"]
returns:
  order_id: "string"
  customer_id: "string"
  order_date: "string (YYYY-MM-DD HH:MM:SS)"
  order_status: "string"
  delivery_status: "string"
  tracking_number: "string"
  courier: "string"
  estimated_delivery_date: "string"
  actual_delivery_date: "string | null"
  total_amount: "number"
  payment_method: "string"
  payment_status: "string"
  cancellation_status: "string"
  refund_status: "string"
  delivery_otp_verified: "boolean"
  items:
    type: "array"
    items:
      order_item_id: "string"
      product_id: "string"
      quantity: "integer"
      unit_price: "number"
      discount: "number"
      final_price: "number"
      item_status: "string"
      return_status: "string"
redaction_guard: "STRICT: Do NOT leak internal courier driver route codes or delivery OTP values to the agent context."
```

#### `get_product`
```yaml
name: "get_product"
description: "Retrieves product technical specs, warranty window, returnability, and replacement flags."
parameters:
  type: "object"
  properties:
    product_id:
      type: "string"
      format: "PROD-XXXXX"
    sku:
      type: "string"
  required: []
  constraint: "Must provide product_id OR sku."
returns:
  product_id: "string"
  sku: "string"
  product_name: "string"
  category: "string"
  subcategory: "string"
  brand: "string"
  price: "number"
  warranty_months: "integer"
  returnable: "boolean"
  replacement_available: "boolean"
  technical_specifications: "object (attributes from category markdown)"
```

#### `get_conversations`
```yaml
name: "get_conversations"
description: "Pulls prior conversation transcripts and session history for the authenticated customer."
parameters:
  type: "object"
  properties:
    customer_id:
      type: "string"
      format: "CUST-XXXXX"
  required: ["customer_id"]
returns:
  conversations:
    type: "array"
    items:
      conversation_id: "string"
      started_at: "string"
      channel: "string"
      handled_by: "string"
      summary: "string"
      messages: "array of {role, timestamp, message}"
continuity_rule: "Enables resolution of pronouns and prevents re-asking questions already answered yesterday."
```

---

### 2.2 Policy Reasoning & Computation Tools (Deterministic Logic)

#### `check_refund_eligibility`
```yaml
name: "check_refund_eligibility"
description: "Evaluates policy version, computes calendar windows, and asserts return/refund eligibility."
parameters:
  type: "object"
  properties:
    order_id:
      type: "string"
    order_item_id:
      type: "string"
    reason:
      type: "string"
      enum: ["change_of_mind", "defective", "damaged_in_transit", "wrong_item", "not_delivered"]
    request_date:
      type: "string (YYYY-MM-DD HH:MM:SS)"
      description: "Timestamp of customer query (from current conversation)."
  required: ["order_id", "order_item_id", "reason", "request_date"]
returns:
  eligible: "boolean"
  policy_version_applied: "string (v1 | v2)"
  days_since_delivery: "integer"
  allowed_window_days: "integer (includes loyalty tier extension)"
  requires_human_approval: "boolean (true if orders.total_amount > threshold)"
  restocking_fee_applicable: "boolean"
  ineligibility_reason: "string | null"
```

#### `calculate_refund`
```yaml
name: "calculate_refund"
description: "Computes the exact allowable refund amount, deducting restocking fee and capping at max limits."
parameters:
  type: "object"
  properties:
    order_id:
      type: "string"
    order_item_id:
      type: "string"
    reason:
      type: "string"
      enum: ["change_of_mind", "defective", "damaged_in_transit", "wrong_item", "cancelled_before_shipment"]
    include_shipping_fee:
      type: "boolean"
      description: "True only if whole order is cancelled before shipment or full order returned for defect."
  required: ["order_id", "order_item_id", "reason"]
returns:
  item_final_price: "number"
  tax_amount_18_pct: "number"
  gross_refund: "number (final_price * 1.18)"
  shipping_fee_refunded: "number (0.00 or 79.00)"
  restocking_fee_deducted: "number (min(gross_refund * 0.05, 2500) if v2 and applicable)"
  net_refund_amount: "number"
  order_total_cap: "number"
```

---

### 2.3 Operational Action Tools (State Mutations)

#### `create_return`
```yaml
name: "create_return"
description: "Opens an official return request for an eligible order item after verification."
parameters:
  type: "object"
  properties:
    order_id:
      type: "string"
    order_item_id:
      type: "string"
    return_reason:
      type: "string"
      enum: ["change_of_mind", "defective", "damaged_in_transit", "wrong_item"]
    evidence_verified:
      type: "boolean"
      description: "True if photos/videos were received and verified for damage/defect."
  required: ["order_id", "order_item_id", "return_reason", "evidence_verified"]
returns:
  return_id: "string"
  order_id: "string"
  order_item_id: "string"
  status: "pickup_scheduled"
  pickup_window: "24 to 48 hours"
  qc_timeline: "2 business days after warehouse arrival"
precondition_guard: "Throws error if evidence_verified == false for defect/damaged reasons."
```

#### `create_refund`
```yaml
name: "create_refund"
description: "Issues a verified monetary refund to the original payment method."
parameters:
  type: "object"
  properties:
    order_id:
      type: "string"
    order_item_id:
      type: "string"
    amount:
      type: "number"
      description: "Calculated refund amount. Must strictly match calculate_refund output."
    destination:
      type: "string"
      enum: ["original_payment_method", "wallet"]
      description: "Strictly original instrument. COD defaults to wallet."
    reason:
      type: "string"
  required: ["order_id", "order_item_id", "amount", "destination", "reason"]
returns:
  refund_id: "string"
  status: "processed"
  amount: "number"
  destination: "string"
  eta: "Instant for wallet | 1-3 days for UPI | 5-7 days for cards"
precondition_guard:
  - "BLOCKED if orders.total_amount > ₹1,00,000 (v1) or > ₹75,000 (v2) -> Must ESCALATE instead."
  - "BLOCKED if destination != original_payment_method (unless COD to wallet)."
  - "BLOCKED if customer account is suspended."
```

#### `create_support_ticket`
```yaml
name: "create_support_ticket"
description: "Opens a support ticket for tracking, logistics investigations, or follow-up."
parameters:
  type: "object"
  properties:
    customer_id:
      type: "string"
    order_id:
      type: "string"
      nullable: true
    category:
      type: "string"
      enum: ["delivery", "refund", "return", "warranty", "technical", "fraud_suspicion", "complaint"]
    priority:
      type: "string"
      enum: ["low", "medium", "high", "critical"]
    assigned_team:
      type: "string"
      enum: ["Tier 1 Support", "Refunds & Payments", "Logistics Desk", "Technical Support", "Trust & Safety", "Customer Experience"]
    issue_summary:
      type: "string"
  required: ["customer_id", "category", "priority", "assigned_team", "issue_summary"]
returns:
  ticket_id: "string (format: TICK-XXXXX)"
  status: "open"
  created_at: "string"
```

#### `escalate_to_human`
```yaml
name: "escalate_to_human"
description: "Hands off case to a human specialist team with complete context payload and generates a high-priority ticket."
parameters:
  type: "object"
  properties:
    customer_id:
      type: "string"
    order_id:
      type: "string"
      nullable: true
    escalation_reason:
      type: "string"
      enum:
        - "approval_threshold_exceeded"
        - "otp_delivery_disputed"
        - "repeated_claims_fraud_risk"
        - "account_suspended"
        - "alternate_refund_destination_requested"
        - "contradictory_statements"
        - "legal_threat"
        - "product_safety_incident"
        - "abusive_language"
        - "human_agent_requested"
    target_team:
      type: "string"
      enum: ["Refunds & Payments", "Logistics Desk", "Trust & Safety", "Customer Experience", "Technical Support", "Support Lead"]
    priority:
      type: "string"
      enum: ["medium", "high", "critical"]
    case_summary:
      type: "string"
      description: "Structured briefing including verified facts, policy citations, and customer claims."
  required: ["customer_id", "escalation_reason", "target_team", "priority", "case_summary"]
returns:
  ticket_id: "string"
  escalation_status: "transferred"
  sla_response_time: "string"
  customer_message: "string to communicate to customer"
```
