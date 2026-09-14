# Layer 0: System Design Routing, Implementation Planning & Navigation Guide

> **Purpose & Anti-Context Bloat Protocol:** This document is the **authoritative navigation switchboard** for the 7-layer System Design Specification Suite. AI coding agents and systems architects must consult this guide to determine **which specific document, section, and formula to reference** during each phase of creating an implementation plan or addressing specific technical requirements. 
> 
> **CRITICAL AGENT RULE:** **NEVER** indiscriminately read or inject all 7 specification files into your prompt context simultaneously. Doing so triggers catastrophic context bloat, degrades reasoning quality, and violates Rule #23. Instead, follow the precision routing tables below to retrieve only the exact section required for your active task.

---

## 1. Specification Suite Map

```
c:\Project_Struct\spec_universal\system_design\
├── 00_system_design_routing_and_navigation_guide.md  (THIS SWITCHBOARD)
├── 01_non_negotiable_rules_and_principles.md         (Constitution, Estimation, SPOF, SRE Axioms)
├── 02_high_level_design_and_distributed_systems.md   (Ingress, CDN, Proxies, Keyset, Data Tier, Sagas)
├── 03_low_level_design_and_object_oriented_architecture.md (DDD Invariants, HikariCP, Indexing, Patterns)
├── 04_system_archetypes_and_decision_matrices.md     (Archetypes, Storage/Cache/LB/AuthZ Matrices)
├── 05_system_design_verification_and_testing_playbook.md (44 TDD Tests: Complexity, Logic, Chaos, Security)
├── 06_observability_telemetry_and_reliability_engineering.md (Burn Rates, RED/USE, OTel Traces, Logging)
└── 07_deployment_operations_governance_and_finops.md (Blue/Green, DR Tiers, FinOps, Crypto-Shredding)
```

---

## 2. Implementation Plan Phase-to-Document Routing Matrix

When crafting an `implementation_plan.md`, follow this 7-phase sequence. Refer **only** to the designated layer and section for each phase:

```yaml
implementation_planning_lifecycle:
  phase_1_requirements_and_capacity:
    target_layer: "Layer 1 (01_non_negotiable_rules_and_principles.md)"
    sections_to_consult:
      - "Section 2: Zero-Trust Architecture Core Axioms (mTLS, TLS 1.3, Container security)"
      - "Section 8: Quantitative Back-of-the-Envelope Estimation (QPS, ELU, Storage, Cache RAM, Bandwidth)"
      - "Section 9: Single Point of Failure (SPOF) Invariant & Audit Checklist"
      - "Section 10: SRE Reliability Axioms & Latency Budget Allocation (SLI/SLO/SLA, Hop Budget, Tail Latency)"
    deliverables:
      - "Explicit NFR numbers (p99 latency in ms, QPS, monthly data growth)"
      - "Calculated Equivalent Load Units (ELU) with write contention factor"
      - "Unified physical storage projection with 5x-8x multipliers"
      - "Hop-by-hop latency budget table summing to target p99"

  phase_2_macro_architecture_and_archetype:
    target_layer: "Layer 4 (04_system_archetypes_and_decision_matrices.md)"
    sections_to_consult:
      - "Section 1: Macro Architecture Selection (Modular Monolith vs Microservices vs Serverless)"
      - "Section 2: The 7 System Archetypes (Geo-Distributed, Multi-Tenant SaaS, Vector RAG, Ledgers, etc.)"
      - "Section 3.1 & 3.5: Database & Storage Class Selection Matrix (Relational vs NoSQL vs Object vs Block)"
      - "Section 3.2: Communication Protocols Matrix (REST vs gRPC vs GraphQL vs WebSockets vs SSE)"
      - "Section 3.3: Distributed Consistency & Consensus Models (Strong vs Eventual vs Causal)"
    deliverables:
      - "Selected macro archetype with concrete trade-off justification"
      - "Selected primary database engine and storage tier from decision matrix"
      - "Selected communication protocols for edge vs internal service hops"

  phase_3_ingress_networking_and_data_tier:
    target_layer: "Layer 2 (02_high_level_design_and_distributed_systems.md)"
    sections_to_consult:
      - "Section 2: Data Tier & Storage Engineering (Consistent Hashing, Virtual Nodes, Hotspot Salting)"
      - "Section 4: Caching Hierarchies & Stampede Defense (L1 Caffeine + L2 Redis, XFetch, CoDel)"
      - "Section 7: Traffic Resilience Engineering (Token Bucket, Circuit Breakers, Full Jitter Backoff)"
      - "Section 8: Asynchronous Messaging & Transactions (Transactional Outbox, CDC, Idempotent Consumer, Sagas)"
      - "Section 9: Advanced API Design (Keyset Pagination with DNF, API Versioning, RFC 8594/9745 Deprecation)"
      - "Section 10: Network Ingress, Proxies & Discovery (Reverse Proxy, API Gateway, Service Mesh, DNS, CDN)"
      - "Section 11: Stateless Service Design & Auto-Scaling (Pre-signed URLs, Queue Lag Scaling Signals)"
    deliverables:
      - "High-Level distributed ingress and data tier ASCII/Mermaid topology"
      - "Keyset pagination SQL query structure with DNF expansion and HMAC signature"
      - "Transactional outbox schema and event emission pipeline"
      - "CDN cache directives and surrogate key purge mechanism"

  phase_4_low_level_code_domain_and_concurrency:
    target_layer: "Layer 3 (03_low_level_design_and_object_oriented_architecture.md)"
    sections_to_consult:
      - "Section 1: Tactical Domain-Driven Design (Value Objects with bigint, 3 Aggregate Root Laws, CQRS)"
      - "Section 2: Design Patterns in Modern Architecture (Step-Builder, Strategy, State, Decorator)"
      - "Section 3: Concurrency, Thread Safety & State Management (Goetz Pool Formula, HikariCP Physics, Deadlocks)"
      - "Section 4: Safe Context Propagation & Deserialization (AsyncLocalStorage, ThreadLocal.remove, Streaming I/O)"
      - "Section 6: Secondary Indexing Write Amplification (TreeDepth random writes, INCLUDE covering indexes)"
    deliverables:
      - "Domain Aggregate Root interface with ID-only references"
      - "HikariCP connection pool sizing formula matching DB cores and pod replicas"
      - "Covering indexes (Index-Only Scans) and partial indexes for hot queries"
      - "Context propagation interceptors with guaranteed try-finally cleanup"

  phase_5_observability_and_sre_telemetry:
    target_layer: "Layer 6 (06_observability_telemetry_and_reliability_engineering.md)"
    sections_to_consult:
      - "Section 2: SRE Reliability Metrics & Multi-Burn-Rate Alerting (Google SRE formulas, low-QPS guards)"
      - "Section 3: Telemetry Frameworks (RED method for microservices, USE method for resources)"
      - "Section 4: Distributed Tracing & W3C Propagation (traceparent, Kafka SpanLink invariant, tail-sampling RAM)"
      - "Section 5: Structured Logging & Event Correlation (OpenTelemetry/ECS JSON schema, PII masking)"
      - "Section 7: Health Check Taxonomy & Probing Protocol (Startup vs Liveness vs Readiness isolation)"
    deliverables:
      - "PromQL multi-window burn rate alert definitions with sample volume guards"
      - "RED method metric specifications for all API endpoints"
      - "Kafka consumer SpanLink context attachment logic"
      - "Segregated Kubernetes health probe endpoints (/livez, /readyz, /startupz)"

  phase_6_deployment_governance_and_finops:
    target_layer: "Layer 7 (07_deployment_operations_governance_and_finops.md)"
    sections_to_consult:
      - "Section 1: Progressive Delivery (Blue/Green with lock_timeout DDL defense, Canary ACA, Rolling preStop 15s, Shadow egress mocks, SipHash-2-4 Feature Flags)"
      - "Section 2: Disaster Recovery & Business Continuity (4 DR tiers, 3rd-region witness quorum, automated sandbox drills)"
      - "Section 3: Cloud FinOps & Cost Optimization (cgroup CFS throttling with automaxprocs, S3 break-even formula, VPC Gateway Endpoints)"
      - "Section 4: Governance & Compliance (RFC 6962 Merkle trees, S3 Object Lock WORM SCP, GDPR Dual-Phase Crypto-Shredding, OPA/Rego ABAC)"
    deliverables:
      - "Zero-downtime database migration plan with Expand-Contract and lock_timeout"
      - "Pod lifecycle configuration with preStop: sleep 15 and terminationGracePeriodSeconds"
      - "DR tier selection with RPO/RTO targets and active-active witness quorum topology"
      - "GDPR Article 17 Crypto-Shredding specification with decoupled Key Management Tier"

  phase_7_verification_and_tdd_playbook:
    target_layer: "Layer 5 (05_system_design_verification_and_testing_playbook.md)"
    sections_to_consult:
      - "Section 2: Testing Type 1: Space & Time Complexity Testing (TC-COMPLEXITY-01..10)"
      - "Section 3: Testing Type 2: Logic & Structural Integrity Testing (TC-LOGIC-01..12)"
      - "Section 4: Testing Type 3: Integration & Chaos Testing (TC-CHAOS-01..12)"
      - "Section 5: Testing Type 4: QA & Security Testing - STRIDE / OWASP (TC-SEC-STRIDE-01..15, TC-SEC-OWASP-01..14)"
    deliverables:
      - "Complete 4-category test suite embedded directly into component plans"
      - "Specific mathematical assertions using performance.now() with Rule 15 CI margins"
      - "Chaos injection scenarios (canary rollback, spot preemption drain, probe isolation)"
      - "STRIDE exploit scripts (crypto-shredding verification, WORM deletion block, Merkle preimage rejection)"
```

---

## 3. Requirement & Technical Keyword Quick-Lookup Table

When tackling a specific requirement, jump straight to the exact document and section using this lookup table:

| Technical Requirement / Domain | Target Document | Primary Section | Key Concepts & Patterns to Apply |
| :--- | :--- | :--- | :--- |
| **API Deprecation & Sunsetting** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 9.3 | RFC 8594 (`Sunset`), RFC 9745 (`Deprecation`), 4-phase brownout schedule |
| **API Gateway & Routing** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 10 | Token translation, reverse proxy vs gateway vs mesh, rate limiting |
| **Access Control (RBAC/ABAC)** | [`04_system_archetypes...md`](file:///c:/Project_Struct/spec_universal/system_design/04_system_archetypes_and_decision_matrices.md) | Section 3.8 | RBAC vs ABAC vs ReBAC (Zanzibar); Open Policy Agent (OPA) / Rego |
| **Audit Logs & Verifiable Trails** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 4.1 & 4.2 | RFC 6962 Merkle tree domain separation ($0x00$/$0x01$), S3 Object Lock WORM |
| **Auto-Scaling Signals** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 11.2 | Queue depth/lag derivative, p99 latency vs lagging CPU utilization |
| **Back-of-Envelope Capacity Math** | [`01_non_negotiable_rules...md`](file:///c:/Project_Struct/spec_universal/system_design/01_non_negotiable_rules_and_principles.md) | Section 8 | Average QPS, Equivalent Load Units (ELU), sub-second bursts, Unified Storage Formula |
| **Cache Stampede / Thundering Herd** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 4.2 & 5.1 | Distributed Singleflight mutex lease, Vattani XFetch probabilistic early refresh |
| **Caching Tier & Invalidation** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md)<br>[`04_system_archetypes...md`](file:///c:/Project_Struct/spec_universal/system_design/04_system_archetypes_and_decision_matrices.md) | Layer 2 Sec 4<br>Layer 4 Sec 3.4 & 3.6 | L1 Caffeine + L2 Redis invalidation bus; Cache-aside vs Write-through; LRU/LFU/ARC |
| **Canary Deployments** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 1.2 | Step-wise traffic shifting ($1\% \to 5\% \to 25\% \to 100\%$), Automated Canary Analysis (ACA) |
| **Circuit Breakers & Retries** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 7.1 & 7.3 | Closed/Open/Half-Open state machine, Marc Brooker Full Jitter exponential backoff |
| **Cloud FinOps & Cost Reduction** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 3 | cgroup CFS math (`automaxprocs`), S3 break-even math, VPC Gateway Endpoints ($0.00) |
| **Consistent Hashing & Hotspots** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 2.1 | Karger ring with 256 vnodes, deterministic key salting ($S=16$), micro-TTL L1 absorption |
| **Database Connection Pooling** | [`03_low_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/03_low_level_design_and_object_oriented_architecture.md) | Section 3.3 | HikariCP formula: $(N_{\text{cores}} \times 2) + N_{\text{spindles}}$; per-pod distribution limits |
| **Database Schema Migrations** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 1.1 | Expand-Contract pattern, `SET lock_timeout = '2000ms'` DDL lock starvation defense |
| **Database Selection** | [`04_system_archetypes...md`](file:///c:/Project_Struct/spec_universal/system_design/04_system_archetypes_and_decision_matrices.md) | Section 3.1 & 3.5 | Relational vs Document vs Key-Value vs Wide-Column vs Lakehouse decision matrix |
| **Disaster Recovery (DR)** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 2 | 4 DR Tiers (Backup, Pilot Light, Warm Standby, Active-Active), RPO/RTO, 3rd-region witness |
| **Distributed Tracing** | [`06_observability_telemetry...md`](file:///c:/Project_Struct/spec_universal/system_design/06_observability_telemetry_and_reliability_engineering.md) | Section 4 | W3C `traceparent`, async Kafka `SpanLink` invariant, tail-sampling memory sizing formula |
| **Domain-Driven Design (Tactical)** | [`03_low_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/03_low_level_design_and_object_oriented_architecture.md) | Section 1 | Entities vs Value Objects (bigint cents), 3 Aggregate Root Laws, CQRS separation |
| **Feature Flags & Dark Launch** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 1.5 | Sub-50ns SipHash-2-4 with secret salt, prototype-pollution-safe AST, signed Ed25519 SSE |
| **GDPR Article 17 Right-to-Erasure** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 4.3 | Dual-Phase Crypto-Shredding: Per-user DEKs in decoupled Key Tier, pinned memory zeroization |
| **Health Check Probes** | [`06_observability_telemetry...md`](file:///c:/Project_Struct/spec_universal/system_design/06_observability_telemetry_and_reliability_engineering.md) | Section 7 | Startup vs Liveness vs Readiness probe isolation; never ping downstream DB in /livez |
| **Idempotency & Message Deduplication** | [`01_non_negotiable_rules...md`](file:///c:/Project_Struct/spec_universal/system_design/01_non_negotiable_rules_and_principles.md)<br>[`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Layer 1 Sec 3<br>Layer 2 Sec 8.1 | Scoped keys `(tenant_id:user_id:key)`; composite idempotency table `(tenant, group, event)` |
| **Kubernetes Rolling Update 502s** | [`07_deployment_operations...md`](file:///c:/Project_Struct/spec_universal/system_design/07_deployment_operations_governance_and_finops.md) | Section 1.3 | Pod termination race defense: `preStop: sleep 15`, `terminationGracePeriodSeconds: 60` |
| **Pagination (Keyset vs. Offset)** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 9.1 | B+ Tree $O(N)$ leaf traversal hazard, DNF boolean SQL expansion, HMAC signed cursor |
| **Rate Limiting Algorithms** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 7.2 | Token Bucket, Leaky Bucket, Sliding Window Log/Counter comparison and redis lua scripts |
| **SRE Alerting & Burn Rates** | [`06_observability_telemetry...md`](file:///c:/Project_Struct/spec_universal/system_design/06_observability_telemetry_and_reliability_engineering.md) | Section 2 & 6 | Multi-Window Multi-Burn-Rate (14.4x / 6.0x / 1.0x), low-QPS statistical guards in PromQL |
| **Secondary Indexing Write Costs** | [`03_low_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/03_low_level_design_and_object_oriented_architecture.md) | Section 6 | $O(\text{TreeDepth})$ write penalty per index; covering index with `INCLUDE`; partial indexes |
| **Single Point of Failure (SPOF)** | [`01_non_negotiable_rules...md`](file:///c:/Project_Struct/spec_universal/system_design/01_non_negotiable_rules_and_principles.md) | Section 9 | Multi-AZ (min 3 AZs) stateful clusters, stateless compute, zero-SPOF audit checklist |
| **Structured Logging** | [`06_observability_telemetry...md`](file:///c:/Project_Struct/spec_universal/system_design/06_observability_telemetry_and_reliability_engineering.md) | Section 5 | Single-line JSON conforming to OTel/ECS schema, streaming zero-allocation PII masking |
| **Tail Latency Amplification** | [`01_non_negotiable_rules...md`](file:///c:/Project_Struct/spec_universal/system_design/01_non_negotiable_rules_and_principles.md)<br>[`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Layer 1 Sec 10.3<br>Layer 2 Sec 8.3 | Dean & Barroso law $P = 1 - (1-p)^m$; hedged requests; tied deadlines (`grpc-timeout`) |
| **Testing & Verification (TDD)** | [`05_system_design_verification...md`](file:///c:/Project_Struct/spec_universal/system_design/05_system_design_verification_and_testing_playbook.md) | Sections 2–5 | All 4 Categories: Type 1 Complexity, Type 2 Logic, Type 3 Chaos, Type 4 STRIDE/OWASP |
| **Transactional Outbox & Sagas** | [`02_high_level_design...md`](file:///c:/Project_Struct/spec_universal/system_design/02_high_level_design_and_distributed_systems.md) | Section 8.1 & 8.2 | Atomic outbox table with CDC Debezium; Saga semantic locking (`PENDING_*` state) |
| **Zero-Trust Security & mTLS** | [`01_non_negotiable_rules...md`](file:///c:/Project_Struct/spec_universal/system_design/01_non_negotiable_rules_and_principles.md) | Section 2 | Explicit attestation on every hop, SPIFFE/SPIRE mTLS, RFC 8693 token exchange, no 0-RTT |

---

## 4. Agent Execution Guidelines: Anti-Context Bloat Standard

To maintain high reasoning quality and prevent memory pollution:

```yaml
agent_operational_rules:
  rule_1_precision_retrieval:
    directive: "DO NOT load all 7 specification documents. Use the Quick-Lookup Table above to select ONLY the 1 or 2 relevant layers."
  rule_2_slice_inspection:
    directive: "When inspecting a layer, use view_file with explicit StartLine and EndLine to view only the target section."
  rule_3_formula_citation:
    directive: "In implementation plans, cite the exact formula or schema (e.g. 'Per Layer 1 Sec 8.1, ELU = QPS_read + 10 * QPS_write') rather than copying large text blocks."
  rule_4_plan_section_alignment:
    directive: "Structure the implementation plan sections to correspond directly with Phases 1 through 7 of the Planning Matrix."
```
