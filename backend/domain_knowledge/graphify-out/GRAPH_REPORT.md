# NovaMart Domain Knowledge Graph Report

**Total Domain Entities**: 30  
**Semantic Relationships / Edges**: 16  

## Domain Entity Breakdown
- Policy Documents: 6
- Policy Rules & Anchors: 3
- Product Categories: 14
- Safety & Fraud Guardrails: 2
- Database Schema Entities: 5

## Key Semantic Edges
- `[policy_refund_v2]` --(SUPERSEDES)--> `[policy_refund_v1]`: Cutoff date 2026-06-01
- `[policy_refund_v2]` --(GOVERNED_BY)--> `[policy_cutoff]`: Order date determines version
- `[policy_refund_v2]` --(CONTAINS_RULE)--> `[rule_restocking_fee]`: 
- `[category_laptops]` --(SUBJECT_TO_FEE)--> `[rule_restocking_fee]`: 5% capped at Rs 2,500 on v2 change-of-mind
- `[category_tablets]` --(SUBJECT_TO_FEE)--> `[rule_restocking_fee]`: 5% capped at Rs 2,500 on v2 change-of-mind
- `[category_cameras]` --(SUBJECT_TO_FEE)--> `[rule_restocking_fee]`: 5% capped at Rs 2,500 on v2 change-of-mind
- `[category_monitors]` --(SUBJECT_TO_FEE)--> `[rule_restocking_fee]`: 5% capped at Rs 2,500 on v2 change-of-mind
- `[category_earbuds]` --(BLOCKED_BY_HYGIENE)--> `[rule_hygiene_exclusion]`: 
- `[category_accessories]` --(BLOCKED_BY_HYGIENE)--> `[rule_hygiene_exclusion]`: 
- `[policy_escalation]` --(INCLUDES_SAFETY_GUARD)--> `[rule_safety_emergency]`: 
- `[policy_shipping]` --(ENFORCES_OTP_CHECK)--> `[rule_otp_contradiction]`: 
- `[table_customers]` --(HAS_MANY_ORDERS)--> `[table_orders]`: 
- `[table_orders]` --(HAS_MANY_ITEMS)--> `[table_order_items]`: 
- `[table_order_items]` --(REFERENCES_PRODUCT)--> `[table_products]`: 
- `[table_orders]` --(ANCHORED_BY_ORDER_DATE)--> `[policy_cutoff]`: 
- `[table_orders]` --(VERIFIED_BY_OTP)--> `[rule_otp_contradiction]`: 
