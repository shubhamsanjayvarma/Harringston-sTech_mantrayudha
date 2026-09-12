# System Design Specification Suite

> **Authoritative Knowledge Base & Navigation Index**

This directory houses the comprehensive 7-layer System Design & Operational Architecture specification suite.

## Navigation & Routing Guide

To prevent context bloat and ensure precision retrieval during implementation planning, **consult the master routing guide first**:

👉 **[`00_system_design_routing_and_navigation_guide.md`](file:///c:/Project_Struct/spec/system_design/00_system_design_routing_and_navigation_guide.md)**

The routing guide provides:
1. **7-Phase Implementation Planning Matrix:** Maps each stage of drafting an architecture plan (Estimation $\to$ Macro Archetype $\to$ Ingress/Data $\to$ Domain/Concurrency $\to$ Telemetry $\to$ Deployment $\to$ TDD Verification) to the exact layer and section.
2. **Requirement Quick-Lookup Table:** 30+ keywords (e.g., Keyset pagination, HikariCP connection pool, S3 lifecycle break-even, Kafka SpanLinks, cgroups CFS math, GDPR Crypto-Shredding) pointing to exact sections.
3. **Anti-Context Bloat Protocols:** Instructions for AI agents to selectively inspect slices rather than dumping all documents into context.

---

## Suite Directory

1. **[`00_system_design_routing_and_navigation_guide.md`](file:///c:/Project_Struct/spec/system_design/00_system_design_routing_and_navigation_guide.md):** The master routing guide and lookup matrix.
2. **[`01_non_negotiable_rules_and_principles.md`](file:///c:/Project_Struct/spec/system_design/01_non_negotiable_rules_and_principles.md):** Zero-Trust security, quantitative estimation formulas (QPS, ELU, Storage multiplier, DAWS cache RAM), Zero-SPOF checklist, and SRE reliability axioms.
3. **[`02_high_level_design_and_distributed_systems.md`](file:///c:/Project_Struct/spec/system_design/02_high_level_design_and_distributed_systems.md):** Distributed ingress, keyset vs offset pagination (DNF expansion), proxies, DNS Anycast, CDN directives, stateless autoscaling, outbox CDC, and sagas.
4. **[`03_low_level_design_and_object_oriented_architecture.md`](file:///c:/Project_Struct/spec/system_design/03_low_level_design_and_object_oriented_architecture.md):** Tactical DDD, aggregate root invariants, design patterns, HikariCP connection pool physics, and secondary indexing write amplification.
5. **[`04_system_archetypes_and_decision_matrices.md`](file:///c:/Project_Struct/spec/system_design/04_system_archetypes_and_decision_matrices.md):** Macro architectures, 7 system archetypes, storage class matrix, cache eviction matrix, load balancer algorithm matrix, and access control matrix.
6. **[`05_system_design_verification_and_testing_playbook.md`](file:///c:/Project_Struct/spec/system_design/05_system_design_verification_and_testing_playbook.md):** 44 automated test specifications covering Space/Time Complexity, Logic, Chaos, and STRIDE/OWASP threat suites.
7. **[`06_observability_telemetry_and_reliability_engineering.md`](file:///c:/Project_Struct/spec/system_design/06_observability_telemetry_and_reliability_engineering.md):** Multi-Window Multi-Burn-Rate alerting with low-QPS PromQL guards, RED/USE methods, OpenTelemetry distributed tracing with SpanLinks, and health checks.
8. **[`07_deployment_operations_governance_and_finops.md`](file:///c:/Project_Struct/spec/system_design/07_deployment_operations_governance_and_finops.md):** Progressive delivery (Blue/Green DDL lock timeout defense, Canary ACA, Rolling preStop 15s, Shadow egress mocks), 4 DR tiers with 3rd-region witness, cgroup CFS throttling math, S3 break-even, and GDPR Article 17 Dual-Phase Crypto-Shredding.
