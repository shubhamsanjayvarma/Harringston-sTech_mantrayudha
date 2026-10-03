# Project Context, Core Philosophy, Design DNA & Incident Telemetry

> **Purpose:** This file is the centralized, automatically injected project memory. It captures the product philosophy, core architectural mechanisms, design DNA, operational caveats, and mistake/error logs. Because this file is located in `.agents/rules/`, it is automatically injected into the agent's context across every session.

---

## 0. Active Hackathon Ground Truth & Anti-Drift Context (Injected)
> **Permanent Operational Memory:** When Phase 1 Milestone 0 completes hackathon reconnaissance (reading PDFs/portal), the agent writes the active competition parameters below. Because this file is located in `.agents/rules/`, these constraints are permanently injected across every turn and cannot be forgotten.

```yaml
active_hackathon_context:
  status: "INITIALIZING / RECONNAISSANCE"
  hackathon_name: "TBD (Populated during Phase 1 Milestone 0)"
  competition_tier: "STANDARD | ELITE_INSTITUTIONAL"
  submission_deadline_iso: "TBD"
  primary_track_or_problem: "TBD"
  judging_rubric_weights:
    innovation_and_wedge: "TBD"
    technical_depth: "TBD"
    demo_and_polish: "TBD"
    track_alignment: "TBD"
  mandatory_sponsor_tech_to_integrate:
    - sponsor: "TBD"
      required_sdk: "TBD"
      target_bounty: "TBD"
  non_negotiable_constraints:
    - "Must be greenfield (built during the event)"
    - "All code committed to public GitHub"
  elite_intelligence:
    status: "NOT_APPLICABLE | ACTIVE_AUDIT"
    target_jury_archetype: "ACADEMIC | STATUTORY_PSU | ENTERPRISE_ARCHITECT | VC_COMMERCIAL"
    audited_past_winner_count: 0
    enforced_winning_patterns: []
    prohibited_fatal_traps: []
    round_by_round_delta_log: []
```

---

## 1. Product Philosophy & Core Vision
- **Product Identity:** The High-Velocity Hackathon & Venture Build Operating System, engineered to autonomously discover real user pain, dismantle incumbents, build high-performance MVPs via the Golden Demo Path, and win competitions through flawless live demos.
- **Guiding Principles:**
  - *The Golden Demo Path Razor:* If a feature is not on the 2-minute judge path, it is strictly banned from being built.
  - *Sentiment Arbitrage:* Every product wedge must trace to verifiable 1-star to 3-star user complaints from G2, Reddit, or Trustpilot.
  - *Zero Speculative Bloat:* Mandatory mocking of commodity layers (auth, billing); maximum velocity on the differentiating core.
  - *Defensive Engineering by Default:* Zero-Trust input boundaries, offline fallback caches, and automated destructive command interception.

---

## 2. Core Mechanisms & System Architecture
- **The 7-Phase Hackathon Pipeline (`spec_universal/hackathon_pipeline/`):**
  1. *Idea Discovery & Scoring (`01_`)*: Parallel 4-subagent research (YC/a16z/Reddit/VCs) with 9-parameter matrix.
  2. *Competitor Teardown & Sentiment Mining (`02_`)*: Incumbent audit, 1-3 star review scraping, and flaw inversion.
  3. *MVP Scoping & Demo Razor (`03_`)*: 12h/24h/48h brackets, Golden Path razor, P0/P1/P2 triaging, and offline shields.
  4. *Lean 7-Layer Architecture (`04_`)*: Consolidated PRD, BaaS decisions, typed API contracts, and FSM state models.
  5. *Rapid UI Scaffolding (`05_`)*: 21st.dev component assembly, dark mode DNA, and the "⚡ Load Judge Demo" preset.
  6. *Golden-Path Smoke Verification (`06_`)*: Build cleanly (`npm run build` or `tsc --noEmit`) and verify the 2-minute judge walkthrough with zero console errors. Enterprise 4-tier TDD and STRIDE threat testing are strictly disabled.
  7. *Demo Pitch & Judge Proofing (`07_`)*: 3-minute pitch formula and tri-layer fail-safe shields (JSON fallback, demo mode, 60fps video backup).
- **Layered System Design Hierarchy:** Lean Hackathon Architecture (Frontend + Serverless/BaaS/Local SQLite + Model API + Local Mock Fixtures).
- **Knowledge Graph as Ground Truth:** AST-based code understanding via Graphify (`graphify-out/`). Always queried before reading raw source code, and refreshed with `graphify update .` post-implementation.
- **Golden-Path Smoke Verification Gate:** Clean compilation and zero-crash browser verification. Dedicated security fuzzing and Big-O testing are disabled.
- **Specification Governance:** Reusable framework templates reside in `spec_universal/`. Active hackathon artifacts reside in `spec/` and can be pushed (Rule 30).
- **Proactive Living Document Duty (Rule 31):** Autonomous preparation and maintenance of living specs without user prompting.
- **Harmful Command Prevention Hook (Rule 32):** Physical interceptor `.agents/scripts/destructive_command_guard.py` active via `.agents/hooks.json`.
- **Knowledge Dump Intake (Rule 33):** Surgical intake and deduplication protocol via `dump/`.
- **Frontend Design Bible & Token Primacy (Rule 34):** Mandatory adherence to spec_universal/frontend_design_bible.md.
- **Hackathon Speedrun Execution (Rule 35):** Execution through the streamlined hackathon speedrun pipeline.

---

## 3. Design DNA & Visual / Interaction Standards
- **Aesthetic Direction:** High-contrast, clean typography, purposeful whitespace, and refined dark/light tokens.
- **Motion & Kinetic Choreography:** Subtle, physics-based micro-interactions that enhance spatial awareness without causing layout shift or latency.
- **Frontend Tool Orchestration:**
  - *MotionSites (`motionsites`)*: Art direction, color mood, kinetic rhythm, and motion design prompt specifications.
  - *21st.dev (`21st` / `21st-*` skills)*: Concrete component code supply (React, Tailwind, shadcn), design tokens, and deterministic UI audits (WCAG a11y, responsive breakpoints).
- **Responsive & Accessibility Baseline:** Full keyboard navigation, WCAG 2.2 AA contrast compliance, explicit touch target dimensions (>= 44px), and zero layout reflow.

---

## 4. Error Recovery & Rapid Bug Triage

During the ~6-hour hackathon speedrun, logging formal YAML incident telemetry records on every routine runtime bug or compiler warning is **suspended**. Fix bugs immediately and surgically in place, verify via smoke test, and proceed with the build.

The structured incident schema below is reserved only for post-hackathon post-mortems or permanent cross-repo synchronization collisions:

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

incident_telemetry_records:
  - incident_id: "INC-20260914-01"
    timestamp: "2026-09-14T12:35:00+05:30"
    severity: "HIGH"
    category: "RULE_COLLISION_AND_OVERWRITE"
    symptom_and_error_signature:
      description: "Syncing AGENTS.md from Universal_Project_Boilerplate overwrote Hackathon_Boilerplate Rule 39 (Hackathon Speedrun Pipeline) with Frontend Design Bible instead of appending sequentially as Rule 40."
      exact_error_output: |
        Overwriting existing Rule 39 in Hackathon_Boilerplate during cross-repo sync.
      triggering_operation: "Copy-Item from Universal_Project_Boilerplate/.agents/AGENTS.md to Hackathon_Boilerplate/.agents/AGENTS.md"
    root_cause_analysis:
      trigger_action: "Whole-file copy of AGENTS.md without verifying downstream repo rule numbering differences."
      underlying_mechanism: "Universal_Project_Boilerplate had 38 rules prior to adding Rule 39, whereas Hackathon_Boilerplate had already codified the 7-Phase Hackathon Speedrun Pipeline as Rule 39."
      untested_assumption: "Assumed both repositories shared the exact same rule index and contents prior to the commit."
    remediation_and_hardening:
      immediate_fix: "Codified Rule 39 as Universal Frontend Design Bible and preserved the 7-Phase Hackathon Speedrun Pipeline as Rule 40 in Hackathon_Boilerplate/.agents/AGENTS.md, updated CONTEXT.md cross-references."
      regression_test_created: "Sequential rule index validation verifying 40 continuous rules in AGENTS.md."
      preventive_rule_or_guardrail: "Rule 38 Surgical Knowledge Merge Protocol & Zero Destruction / Immutability Invariant: NEVER overwrite existing numbered rules; always inspect diff and append sequentially."
      status: "RESOLVED_AND_FORTIFIED"
```

---

## 5. Operational Invariants & Runtime Caveats
- **Local Rules Isolation & Physical Guardrail:** `.agents/AGENTS.md` is strictly local and must NEVER be pushed to remote (Rule 29). Commits to it are physically blocked by `.githooks/pre-commit`.
- **Universal Specs Immutability & Physical Guardrail:** `spec_universal/` contains the universal baseline and must NEVER be altered during project execution unless explicitly directed by user (Rule 30). Commits to it are physically blocked by `.githooks/pre-commit`.
- **Project Specs Commit Scope:** `spec/` houses project-specific specs/PRDs and is explicitly permitted to be staged, committed, and pushed to the remote repository (Rule 30).
- **Explicit Authorization for Git Actions:** Never commit, push, or open PRs autonomously without explicit user direction (Rule 24).
- **Component Wrapper Closures:** Always verify matching closing parentheses `});` when wrapping React components in `memo` or HOCs (Rule 25).
- **State Scope Verification:** Never prune destructured variables without complete JSX tree reference validation (Rule 26).
- **Test File Extensions:** JSX test files must strictly use `.tsx` to prevent parser ambiguity (Rule 28).
- **Automated Harmful Command Interceptor:** Calls to `run_command` are automatically inspected by `.agents/scripts/destructive_command_guard.py` via `.agents/hooks.json` (Rule 32). Destructive operations (mass deletion, raw block format, git force push, drop database) are physically blocked.
- **Knowledge Dump Intake & Merge Protocol:** External files in `dump/` must be processed via Rule 33 with strict deduplication, zero overwrite of existing rules, and extraction of novel differentials only.
