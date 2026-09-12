# Project Context, Core Philosophy, Design DNA & Incident Telemetry

> **Purpose:** This file is the centralized, automatically injected project memory. It captures the product philosophy, core architectural mechanisms, design DNA, operational caveats, and mistake/error logs. Because this file is located in `.agents/rules/`, it is automatically injected into the agent's context across every session.

---

## 1. Product Philosophy & Core Vision
- **Product Identity:** Universal, robust, production-grade software foundation engineered for uncompromising reliability, security, and velocity.
- **Guiding Principles:**
  - *Zero Speculative Bloat:* Minimum code to solve the verified requirement; reject unrequested abstractions.
  - *Empirical Verification Over Assumption:* Every architectural claim, performance bound, and functional flow must be provable via automated tests.
  - *Defensive Engineering by Default:* Zero-Trust input boundaries, strict typed contracts, and secure session management.

---

## 2. Core Mechanisms & System Architecture
- **Layered System Design Hierarchy:** 7-layer architecture codified under `spec_universal/system_design/` (routed via `00_system_design_routing_and_navigation_guide.md`).
- **Knowledge Graph as Ground Truth:** AST-based code understanding via Graphify (`graphify-out/`). Always queried before reading raw source code, and refreshed with `graphify update .` post-implementation.
- **Strict 4-Tier Testing Pipeline:** All features and refactors must clear:
  1. Space & Time Complexity Testing (Big-O scaling & performance bounds).
  2. Logic & State Transition Testing.
  3. UI, Contract & Integration Chaos Drills.
  4. STRIDE / OWASP Top 10 Security & Sandbox Attack Scenarios.
- **Specification Governance:** Universal requirements and system design specifications are codified under `spec_universal/` and are strictly **immutable** during project execution unless explicitly requested. Project-specific PRDs, architecture docs, and task plans reside in `spec/` and are **allowed to be pushed** to the repository (Rule 35).
- **Proactive Living Document Duty (Rule 36):** The agent has an autonomous duty to prepare Anchor documents during initialization and proactively maintain/synchronize Living documents (PRD, ADRs, App Flow, Data Model, Implementation Plans) throughout execution without requiring explicit user prompting.
- **Embedded Pre-Code TDD Invariant:** TDD is not a separate phase; test harness formulation across all 4 tiers is an embedded pre-requisite gate before any code writing or error remediation.
- **Mandatory Post-Code Dead Code & Orphan Sweep:** Between writing code and executing test verification, the agent MUST explicitly sweep for and eliminate any dead code, unused imports, orphaned types, or temporary stubs directly or indirectly caused by the changes (skills: `code-simplification`, `code-review-and-quality`).

---

## 3. Design DNA & Visual / Interaction Standards
- **Aesthetic Direction:** High-contrast, clean typography, purposeful whitespace, and refined dark/light tokens.
- **Motion & Kinetic Choreography:** Subtle, physics-based micro-interactions that enhance spatial awareness without causing layout shift or latency.
- **Frontend Tool Orchestration:**
  - *MotionSites (`motionsites`)*: Art direction, color mood, kinetic rhythm, and motion design prompt specifications.
  - *21st.dev (`21st` / `21st-*` skills)*: Concrete component code supply (React, Tailwind, shadcn), design tokens, and deterministic UI audits (WCAG a11y, responsive breakpoints).
- **Responsive & Accessibility Baseline:** Full keyboard navigation, WCAG 2.2 AA contrast compliance, explicit touch target dimensions (>= 44px), and zero layout reflow.

---

## 4. Error Log, Incident Telemetry & Root Cause Analyses

Whenever an execution mistake, test regression, compilation error, or operational failure occurs, record it immediately in this section under `incident_telemetry_records` using the strict schema below. Do not use informal tables.

```yaml
incident_telemetry_schema:
  incident_id: "INC-YYYYMMDD-XX"               # Unique sequential ID (e.g. INC-20260912-01)
  timestamp: "ISO-8601 string"                 # e.g. 2026-09-12T20:56:00+05:30
  severity: "CRITICAL | HIGH | MEDIUM | LOW"   # CRITICAL: Build/Commit blocked; HIGH: State/Logic corruption; MEDIUM: Lint/Type; LOW: Friction
  category: "PARSER_SYNTAX | TYPE_MISMATCH | COMPILATION | STATE_LEAK | SECURITY_VULNERABILITY | CONCURRENCY | ENVIRONMENT"
  
  symptom_and_error_signature:
    description: "Crisp 1-line description of observable failure"
    exact_error_output: |
      [Paste verbatim compiler, linter, test runner, or bash error snippet here]
    triggering_operation: "Exact tool call, script, or command executed"

  root_cause_analysis:
    trigger_action: "What exact code change or procedure triggered it?"
    underlying_mechanism: "Why did the runtime, engine, or parser reject it?"
    untested_assumption: "What implicit assumption failed?"

  remediation_and_hardening:
    immediate_fix: "Exact surgical diff or fix applied"
    regression_test_created: "tests/regression/inc_YYYYMMDD_XX.test.ts"
    preventive_rule_or_guardrail: "Rule reference in AGENTS.md or pre-commit hook"
    status: "RESOLVED_AND_FORTIFIED | MITIGATED | INVESTIGATING"

incident_telemetry_records: []
```

---

## 5. Operational Invariants & Runtime Caveats
- **Local Rules Isolation & Physical Guardrail:** `.agents/AGENTS.md` is strictly local and must NEVER be pushed to remote (Rule 34). Commits to it are physically blocked by `.githooks/pre-commit`.
- **Universal Specs Immutability & Physical Guardrail:** `spec_universal/` contains the universal baseline and must NEVER be altered during project execution unless explicitly directed by user (Rule 35). Commits to it are physically blocked by `.githooks/pre-commit`.
- **Project Specs Commit Scope:** `spec/` houses project-specific specs/PRDs and is explicitly permitted to be staged, committed, and pushed to the remote repository (Rule 35).
- **Explicit Authorization for Git Actions:** Never commit, push, or open PRs autonomously without explicit user direction (Rule 28).
- **Component Wrapper Closures:** Always verify matching closing parentheses `});` when wrapping React components in `memo` or HOCs (Rule 29).
- **State Scope Verification:** Never prune destructured variables without complete JSX tree reference validation (Rule 30).
- **Test File Extensions:** JSX test files must strictly use `.tsx` to prevent parser ambiguity (Rule 33).
