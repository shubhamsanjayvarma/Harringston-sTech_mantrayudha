# NovaMart Relational Database Ontology & Schema Guide

This document defines the relational architecture, table relationships, and data access contracts for NovaMart AI Customer Support Agent.

## 1. Relational Table Schemas

### `customers` (1,500 rows)
- `customer_id` (TEXT, PK): Unique identifier formatted as `CUST-XXXXX` (e.g., `CUST-00001` to `CUST-01500`).
- `first_name`, `last_name` (TEXT): Customer full name.
- `email`, `phone` (TEXT): Contact details.
- `address`, `city`, `state`, `pincode` (TEXT): Delivery address.
- `loyalty_tier` (TEXT): `bronze`, `silver`, `gold`, `platinum`.
  - **Gold Tier Benefit**: +2 calendar days extension for Change-of-Mind returns.
  - **Platinum Tier Benefit**: +3 calendar days extension for Change-of-Mind returns.
- `account_created_date` (TEXT): Registration timestamp.

### `orders` (8,000 rows)
- `order_id` (TEXT, PK): Formatted as `ORD-XXXXXX` (e.g., `ORD-001042`, `ORD-003621`).
- `customer_id` (TEXT, FK -> customers.customer_id): Authenticated owner of the order.
- `order_date` (TEXT): Purchase timestamp (ISO 8601). Defines policy version:
  - `< 2026-06-01`: Policy v1 (10d mind / 15d defect, ₹0 restocking fee, ₹100,000 approval limit).
  - `>= 2026-06-01`: Policy v2 (7d mind / 10d defect, 5% max ₹2,500 restocking fee on electronics, ₹75,000 approval limit).
- `order_status` (TEXT): `placed`, `confirmed`, `processing`, `shipped`, `in_transit`, `out_for_delivery`, `delivered`, `cancelled`, `returned`.
- `total_amount` (REAL): Order grand total in INR.
- `shipping_fee` (REAL): Flat ₹79 for orders under ₹1,000; ₹0 for orders ₹1,000+.
- `payment_method` (TEXT): `upi`, `credit_card`, `debit_card`, `net_banking`, `novamart_wallet`, `cash_on_delivery`.
- `courier` (TEXT): `BlueArrow Express`, `SwiftLane`, `KaveriCargo`, `DeltaPost`, `RoadRunner Logistics`.
- `tracking_number` (TEXT): Unique shipping barcode.
- `estimated_delivery_date` (TEXT): Expected arrival date.
- `actual_delivery_date` (TEXT): Actual delivery timestamp (Day 0 anchor for return window).
- `delivery_otp_verified` (INTEGER): `1` if customer verified OTP on delivery, `0` otherwise.
  - **Invariant**: If `delivery_otp_verified == 1`, non-delivery dispute claims are BLOCKED from auto-refund and escalated to Logistics Desk.

### `order_items` (12,444 rows)
- `order_item_id` (TEXT, PK): Formatted as `ITEM-XXXXXX`.
- `order_id` (TEXT, FK -> orders.order_id): Parent order reference.
- `product_id` (TEXT, FK -> products.product_id): Purchased item.
- `quantity` (INTEGER): Quantity ordered.
- `unit_price` (REAL): Base unit price.
- `discount_percent` (REAL): Applied discount.
- `final_price` (REAL): Net item price before 18% GST.
  - **Gross Item Refund**: `round(final_price * 1.18, 2)`.

### `products` (300 rows across 14 categories)
- `product_id` (TEXT, PK): Formatted as `PROD-XXXXX`.
- `product_name` (TEXT): Descriptive item title.
- `category` (TEXT): `Laptops`, `Tablets`, `Cameras`, `Monitors`, `Smartphones`, `Headphones`, `Earbuds`, `Smartwatches`, `Gaming`, `Keyboards`, `Mice`, `Speakers`, `Networking`, `Accessories`.
  - **Restocking Fee Category**: `Laptops`, `Tablets`, `Cameras`, `Monitors` (5% capped at ₹2,500 under Policy v2).
- `price` (REAL): Retail price.
- `returnable` (INTEGER): `1` if returnable, `0` for hygiene non-returnable items (opened earbuds, unsealed cables).
- `replacement_available` (INTEGER): `1` if eligible for free replacement.
- `warranty_months` (INTEGER): 12 or 24 months manufacturer warranty.

### `support_tickets` (2,500+ rows)
- `ticket_id` (TEXT, PK): Formatted as `TICK-XXXXX`.
- `customer_id` (TEXT, FK -> customers.customer_id).
- `order_id` (TEXT, FK -> orders.order_id).
- `category` (TEXT): `cancellation`, `refund`, `return`, `replacement`, `delivery`, `warranty`, `fraud_dispute`, `general`.
- `priority` (TEXT): `critical` (4h SLA), `high` (24h SLA), `medium` (72h SLA), `low` (120h SLA).
- `escalation_team` (TEXT): `Tier 1 Support`, `Refunds & Payments`, `Logistics Desk`, `Technical Support`, `Trust & Safety`.

### `conversations` (1,500 historical chat threads)
- `conversation_id` (TEXT, PK), `customer_id` (TEXT), `message_history` (JSON).

---

## 2. Entity Relationship Graph

```
customers (1) ───────────< orders (N) ───────────< order_items (N)
     │                         │                          │
     │                         │                          ▼
     │                         ▼                     products (1)
     └───────────────< support_tickets (N)
```
