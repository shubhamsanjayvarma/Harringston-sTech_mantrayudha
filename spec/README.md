# NovaMart Project Specifications (`spec/`)

This directory is the definitive, project-specific knowledge base for the **NovaMart AI Customer Support Agent** (Mantra Yudha Hackathon).

> **Single Source of Truth:**
> All specifications in this directory are grounded directly in the official materials provided under [`spec/Problem Statement(PS)/`](Problem%20Statement(PS)/), including the official participant handbook and public datasets.

---

## Specification Navigation Index

| Index | Document | Purpose & Core Content |
| :---: | :--- | :--- |
| **01** | [`01_hackathon_mission_and_rules.md`](01_hackathon_mission_and_rules.md) | Official challenge overview, the Iron Principle, the 4 terminal moves (`ANSWER`, `ASK`, `ACT`, `ESCALATE`), 9-stage reasoning loop, Good vs. Weak Agent matrix, and the 100-point scoring rubric. |
| **02** | [`02_database_schema_and_entity_relations.md`](02_database_schema_and_entity_relations.md) | Complete YAML schemas and constraints for all 7 relational datasets (1,500 customers, 8,000 orders, 12,444 items, 300 products, 3,000 reviews, 2,500 tickets, 1,500 conversations), ER diagram, and financial arithmetic. |
| **03** | [`03_policy_rules_and_version_matrices.md`](03_policy_rules_and_version_matrices.md) | Complete compilation of all 10 policy areas, Policy v1 vs v2 comparison matrix, cutoff dates (`2026-06-01`), calendar window arithmetic, restocking fee formulas (5% max ₹2,500), approval thresholds, and 11 escalation triggers. |
| **04** | [`04_agent_tools_and_api_contracts.md`](04_agent_tools_and_api_contracts.md) | OpenAPI/YAML function calling specifications for the 10 core agent tools (`get_*`, `check_*`, `calculate_*`, `create_*`, `escalate_*`), input/output schemas, and pre-execution safety interceptor guards. |
| **05** | [`05_adversarial_defense_and_edge_cases.md`](05_adversarial_defense_and_edge_cases.md) | Deep drilldown into the 13 capability categories from the handbook, 4-tier prompt authority hierarchy (L1-L4), prompt injection containment defenses, and the operational "Do Not Act" matrix. |
| **06** | [`06_product_catalog_and_category_rules.md`](06_product_catalog_and_category_rules.md) | Catalog breakdown of 300 products across 14 categories, non-returnable hygiene rules (in-ear earbuds, opened accessories), restocking fee applicability (Laptops, Tablets, Cameras, Monitors), and technical attribute schemas. |
| **07** | [`07_system_architecture_and_backend_blueprint.md`](07_system_architecture_and_backend_blueprint.md) | Complete backend system architecture: SQLite memory store, deterministic verification engine, 9-stage loop state machine, REST API contracts, 6 official judge demo presets, and implementation roadmap. |
| **08** | [`08_agentic_software_rules_and_reference_architectures.md`](08_agentic_software_rules_and_reference_architectures.md) | Foundational 10 Laws of Agentic Software, Google Antigravity SDK & Gemini API plugin integration, and forensic code patterns extracted from user repositories (`adk-customer-service`, `secure-agent-lab`, `ambient-expense-agent`, `clinical-safety-agent`). |
| **09** | [`09_adk_2_0_workflow_engine_and_deployment_specification.md`](09_adk_2_0_workflow_engine_and_deployment_specification.md) | ADK 2.0 Graph Workflow Engine (`Workflow`, `@node`, `Edge`, `Event`, `Context`), `agents-cli` deployment workflow, `agents-cli-manifest.yaml` specification for Google Agent Runtime, and execution optimizations. |
| **10** | [`10_open_source_agent_engines_and_reusable_foundations.md`](10_open_source_agent_engines_and_reusable_foundations.md) | Integration of pre-built open-source agent engines: `awesome-llm-apps` (ADK Support Ticket Agent, Multi-Turn Memory, Forensic Cross-Examiner) and `agency-agents` (Agentic Identity & Trust Architect, Multi-Agent Systems Architect). |
| **11** | [`11_hybrid_engine_and_graphify_knowledge_architecture.md`](11_hybrid_engine_and_graphify_knowledge_architecture.md) | Hybrid Deterministic Safety Engine (adapted from `clinical-safety-agent`: Rule Merger, PII/Secret Scrubber, LLM advisory bounds) and Graphify Knowledge System vs Vector RAG comparison. |
| **12** | [`12_exhaustive_cross_examination_and_gap_resolution.md`](12_exhaustive_cross_examination_and_gap_resolution.md) | Forensic cross-examination audit of handbook, 10 policies, and 14 category catalogs against master specs. Solves the 10 missing links: dynamic conversation timestamp anchor, delay goodwill math (INR 100/3d max 300), pre-shipment cancellation approval exemption, shipping fee refund matrix, 24h bank pending gate, COD wallet/bank protocol, multi-intent decomposition DAG, and candidate disambiguation gate. |
| **13** | [`13_input_sanitization_access_control_and_edge_cases.md`](13_input_sanitization_access_control_and_edge_cases.md) | Input sanitization, script camouflage & XSS defenses, multi-tiered RBAC (Customer, Tier 1 AI Agent, Human Specialist, DB Admin), strict data redaction (PII, OTPs, driver phones), and unknown/out-of-distribution request handling protocols. |

---

> **Universal Standards:** For universal, project-agnostic architecture templates and testing guidelines, refer to [`spec_universal/`](../spec_universal/).
