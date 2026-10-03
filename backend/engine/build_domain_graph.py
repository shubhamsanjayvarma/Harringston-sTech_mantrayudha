"""Builds the dedicated Domain Knowledge Graph for NovaMart.

Extracts semantic nodes, rule relationships, category constraints,
and table ontologies from markdown policy and catalog specifications.
Outputs standard Graphify-compatible graph.json and GRAPH_REPORT.md in:
backend/domain_knowledge/graphify-out/
"""

import json
from pathlib import Path
import re
from typing import Any, Dict, List, Set

BASE_DIR = Path(__file__).resolve().parent.parent
DOMAIN_DIR = BASE_DIR / "domain_knowledge"
OUT_DIR = DOMAIN_DIR / "graphify-out"


def build_domain_graph():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    nodes: List[Dict[str, Any]] = []
    links: List[Dict[str, Any]] = []
    node_ids: Set[str] = set()

    def add_node(node_id: str, label: str, node_type: str, source_file: str, summary: str, properties: Dict[str, Any] = None):
        if node_id not in node_ids:
            node_ids.add(node_id)
            nodes.append({
                "id": node_id,
                "label": label,
                "type": node_type,
                "file_type": "markdown",
                "source_file": source_file,
                "summary": summary,
                "community": 1,
                "properties": properties or {},
            })

    def add_link(source: str, target: str, relation: str, context: str = ""):
        links.append({
            "source": source,
            "target": target,
            "relation": relation,
            "context": context,
        })

    # -------------------------------------------------------------------------
    # 1. CORE POLICY NODES
    # -------------------------------------------------------------------------
    add_node(
        "policy_cutoff",
        "Policy Version Cutoff Date (2026-06-01)",
        "policy_anchor",
        "policies/refund_policy_v2.md",
        "Orders placed before 2026-06-01 follow Policy v1. Orders placed on or after follow Policy v2.",
        {"cutoff_date": "2026-06-01", "rule": "Evaluated strictly by orders.order_date, never current time"}
    )

    add_node(
        "policy_refund_v1",
        "Refund Policy v1 (Prior to 2026-06-01)",
        "policy_document",
        "policies/refund_policy_v1.md",
        "Orders < 2026-06-01: Change-of-mind 10 calendar days, Defect 15 calendar days, Restocking fee Rs 0 across all categories, Human approval limit Rs 1,00,000.",
        {"change_of_mind_days": 10, "defect_days": 15, "restocking_fee_rate": 0.0, "approval_threshold": 100000.0}
    )

    add_node(
        "policy_refund_v2",
        "Refund Policy v2 (Current, >= 2026-06-01)",
        "policy_document",
        "policies/refund_policy_v2.md",
        "Orders >= 2026-06-01: Change-of-mind 7 calendar days (+2d Gold / +3d Platinum), Defect 10 calendar days, Restocking fee 5% max Rs 2,500 on electronics, Human approval limit Rs 75,000.",
        {"change_of_mind_days": 7, "defect_days": 10, "restocking_fee_rate": 0.05, "restocking_fee_cap": 2500.0, "approval_threshold": 75000.0}
    )
    add_link("policy_refund_v2", "policy_refund_v1", "SUPERSEDES", "Cutoff date 2026-06-01")
    add_link("policy_refund_v2", "policy_cutoff", "GOVERNED_BY", "Order date determines version")

    add_node(
        "rule_restocking_fee",
        "5% Electronics Restocking Fee Rule",
        "policy_rule",
        "policies/refund_policy_v2.md",
        "Under Policy v2 change-of-mind returns, high-value electronics incur a 5% restocking fee capped at Rs 2,500. Defective/damaged returns ALWAYS incur Rs 0 fee.",
        {"rate": 0.05, "cap": 2500.0, "reason_scope": "change_of_mind_only"}
    )
    add_link("policy_refund_v2", "rule_restocking_fee", "CONTAINS_RULE")

    add_node(
        "policy_cancellation",
        "Cancellation Policy (Pre-Shipment)",
        "policy_document",
        "policies/cancellation_policy.md",
        "Orders can be cancelled before dispatch (status placed, confirmed, processing) for 100% refund including shipping fees. Exempt from human approval thresholds regardless of amount.",
        {"exempt_from_human_approval": True, "full_shipping_refund": True}
    )

    add_node(
        "policy_warranty",
        "Warranty Policy (Brand / Manufacturer)",
        "policy_document",
        "policies/warranty_policy.md",
        "Electronics carry 12-24 months manufacturer warranty. After return window closes, customer must be guided to brand authorized service centers with invoice.",
        {"coverage_months_min": 12, "coverage_months_max": 24}
    )

    add_node(
        "policy_shipping",
        "Shipping & Delivery Policy",
        "policy_document",
        "policies/shipping_policy.md",
        "Free delivery on orders >= Rs 1,000, flat Rs 79 otherwise. Orders >= Rs 5,000 require OTP verification. Goodwill credit Rs 100 per 3 full days late beyond ETA (max Rs 300).",
        {"free_threshold": 1000.0, "fee": 79.0, "otp_threshold": 5000.0, "goodwill_per_3d": 100.0, "goodwill_cap": 300.0}
    )

    add_node(
        "policy_escalation",
        "Customer Escalation & Safety Policy",
        "policy_document",
        "policies/customer_escalation_policy.md",
        "Mandatory human escalation matrix: Tier 1 Support (standard disputes), Refunds & Payments (>24h pending payment), Logistics Desk (OTP dispute / transit loss), Technical Support (battery swelling / safety), Trust & Safety (serial returns / fraud).",
        {"critical_sla_hours": 4, "high_sla_hours": 24, "medium_sla_hours": 72, "low_sla_hours": 120}
    )

    # -------------------------------------------------------------------------
    # 2. CATEGORY NODES & SPECIAL CONSTRAINTS
    # -------------------------------------------------------------------------
    categories = [
        ("category_laptops", "Laptops", True, "Restocking fee applicable on v2 change-of-mind (5% max Rs 2500). Free replacement on DOA within 10 days."),
        ("category_tablets", "Tablets", True, "Restocking fee applicable on v2 change-of-mind (5% max Rs 2500)."),
        ("category_cameras", "Cameras", True, "Restocking fee applicable on v2 change-of-mind (5% max Rs 2500)."),
        ("category_monitors", "Monitors", True, "Restocking fee applicable on v2 change-of-mind (5% max Rs 2500). Zero dead-pixel warranty within 10 days."),
        ("category_smartphones", "Smartphones", False, "No restocking fee. 7d mind / 10d defect return window. Brand warranty 12 months."),
        ("category_headphones", "Headphones", False, "Over-ear headphones returnable in intact box. No restocking fee."),
        ("category_earbuds", "Earbuds & In-Ear Audio", False, "Hygiene non-returnable if inner seal broken or unsealed unless defective on arrival."),
        ("category_smartwatches", "Smartwatches", False, "Standard electronics return window. Must include original magnetic charging cable."),
        ("category_gaming", "Gaming Consoles & Gear", False, "Hardware returnable within window. Digital download vouchers non-refundable once scratched."),
        ("category_keyboards", "Keyboards", False, "Returnable within window. Switches and cables must be included."),
        ("category_mice", "Mice & Pointers", False, "Returnable within window with USB dongle."),
        ("category_speakers", "Bluetooth Speakers", False, "Returnable within window. Water damage not covered under defect warranty."),
        ("category_networking", "Routers & Networking", False, "Returnable within window with adapter."),
        ("category_accessories", "Accessories & Cables", False, "Unsealed cables and used screen protectors non-returnable."),
    ]

    for cat_id, cat_name, is_restocking, rule_desc in categories:
        add_node(
            cat_id,
            f"Category: {cat_name}",
            "product_category",
            f"products/{cat_name.lower().split()[0]}.md",
            rule_desc,
            {"category_name": cat_name, "is_restocking_category": is_restocking}
        )
        if is_restocking:
            add_link(cat_id, "rule_restocking_fee", "SUBJECT_TO_FEE", "5% capped at Rs 2,500 on v2 change-of-mind")

    # Specific hygiene non-returnable rule
    add_node(
        "rule_hygiene_exclusion",
        "Hygiene & Intimate Device Return Exclusion",
        "policy_exception",
        "policies/return_policy_v2.md",
        "In-ear earbuds with broken seals, unsealed internal packaging cables, and used screen protectors are strictly non-returnable for hygiene reasons unless confirmed DOA.",
        {"scope": ["Earbuds", "Accessories"]}
    )
    add_link("category_earbuds", "rule_hygiene_exclusion", "BLOCKED_BY_HYGIENE")
    add_link("category_accessories", "rule_hygiene_exclusion", "BLOCKED_BY_HYGIENE")

    # Safety emergency rule
    add_node(
        "rule_safety_emergency",
        "Life-Safety Critical Escalation Rule",
        "safety_guardrail",
        "policies/customer_escalation_policy.md",
        "Any report of battery swelling, smoking, burning smell, sparks, or severe overheating immediately halts standard flow, provides immediate disconnect advice, and dispatches critical ticket to Technical Support.",
        {"action": "BLOCK_STANDARD_FLOW", "priority": "critical", "team": "Technical Support"}
    )
    add_link("policy_escalation", "rule_safety_emergency", "INCLUDES_SAFETY_GUARD")

    # OTP contradiction rule
    add_node(
        "rule_otp_contradiction",
        "OTP-Verified Delivery Contradiction Guardrail",
        "fraud_guardrail",
        "policies/customer_escalation_policy.md",
        "If orders.delivery_otp_verified == 1 and customer claims package not delivered, automated refund/replacement is strictly BLOCKED. Escalated to Logistics Desk for forensic audit.",
        {"action": "BLOCK_REFUND", "team": "Logistics Desk"}
    )
    add_link("policy_shipping", "rule_otp_contradiction", "ENFORCES_OTP_CHECK")

    # -------------------------------------------------------------------------
    # 3. RELATIONAL SCHEMA ONTOLOGY
    # -------------------------------------------------------------------------
    tables = [
        ("table_customers", "Table: customers (1,500 records)", "schema/database_ontology.md", "Stores account profile, shipping address, and loyalty_tier (bronze, silver, gold, platinum)."),
        ("table_orders", "Table: orders (8,000 records)", "schema/database_ontology.md", "Stores order_date (policy version anchor), order_status, total_amount, courier, tracking, actual_delivery_date, delivery_otp_verified."),
        ("table_order_items", "Table: order_items (12,444 records)", "schema/database_ontology.md", "Stores line item quantity, unit_price, discount, and final_price (gross refund = round(final_price * 1.18, 2))."),
        ("table_products", "Table: products (300 items)", "schema/database_ontology.md", "Stores catalog items, category, returnable, replacement_available, warranty_months."),
        ("table_support_tickets", "Table: support_tickets (2,500+ records)", "schema/database_ontology.md", "Stores ticket_id, category, priority (critical/high/medium/low), escalation_team, status."),
    ]
    for tid, tname, sfile, sdesc in tables:
        add_node(tid, tname, "database_entity", sfile, sdesc)

    add_link("table_customers", "table_orders", "HAS_MANY_ORDERS")
    add_link("table_orders", "table_order_items", "HAS_MANY_ITEMS")
    add_link("table_order_items", "table_products", "REFERENCES_PRODUCT")
    add_link("table_orders", "policy_cutoff", "ANCHORED_BY_ORDER_DATE")
    add_link("table_orders", "rule_otp_contradiction", "VERIFIED_BY_OTP")

    # -------------------------------------------------------------------------
    # WRITE GRAPH JSON AND REPORT
    # -------------------------------------------------------------------------
    graph_payload = {
        "directed": True,
        "multigraph": False,
        "graph": {
            "name": "NovaMart Domain Knowledge Graph",
            "version": "1.0",
            "description": "Semantic knowledge graph over NovaMart store policies, product category constraints, and SQLite ontology."
        },
        "nodes": nodes,
        "links": links,
    }

    graph_file = OUT_DIR / "graph.json"
    with open(graph_file, "w", encoding="utf-8") as f:
        json.dump(graph_payload, f, indent=2, ensure_ascii=False)

    report_lines = [
        "# NovaMart Domain Knowledge Graph Report",
        "",
        f"**Total Domain Entities**: {len(nodes)}  ",
        f"**Semantic Relationships / Edges**: {len(links)}  ",
        "",
        "## Domain Entity Breakdown",
        f"- Policy Documents: {sum(1 for n in nodes if n['type'] == 'policy_document')}",
        f"- Policy Rules & Anchors: {sum(1 for n in nodes if n['type'] in ('policy_rule', 'policy_anchor', 'policy_exception'))}",
        f"- Product Categories: {sum(1 for n in nodes if n['type'] == 'product_category')}",
        f"- Safety & Fraud Guardrails: {sum(1 for n in nodes if n['type'] in ('safety_guardrail', 'fraud_guardrail'))}",
        f"- Database Schema Entities: {sum(1 for n in nodes if n['type'] == 'database_entity')}",
        "",
        "## Key Semantic Edges",
    ]
    for edge in links:
        report_lines.append(f"- `[{edge['source']}]` --({edge['relation']})--> `[{edge['target']}]`: {edge['context']}")

    report_file = OUT_DIR / "GRAPH_REPORT.md"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines) + "\n")

    print(f"Domain knowledge graph successfully built: {len(nodes)} nodes, {len(links)} edges written to {graph_file}")
    return graph_payload


if __name__ == "__main__":
    build_domain_graph()
