# Master Hackathon Operating System & Speedrun Protocol

> **Repository:** `Hackathon_Boilerplate`  
> **Purpose:** Comprehensive, time-boxed operating system designed for autonomous AI agents and engineering teams to win hackathons and venture build competitions.  
> **Core Thesis:** *Hackathons are not won by writing 10,000 lines of fragile code; they are won by solving real user pain mined from incumbent competitors, delivering a rock-solid core MVP via the Golden Demo Path, and executing an undeniable 3-minute pitch backed by offline fail-safes.*

---

## ⚡ The 7-Phase Hackathon Operating Pipeline

The entire hackathon lifecycle is structured into 7 sequential, milestone-driven phases. Each phase has its own dedicated specification in `spec_universal/hackathon_pipeline/`:

```yaml
hackathon_pipeline_architecture:
  phase_1_idea_discovery_and_scoring:
    spec_file: "spec_universal/hackathon_pipeline/01_idea_discovery_and_scoring.md"
    objective: "Execute multi-modal hackathon reconnaissance (reading PDFs/docs, scraping portal via kimi-webbridge); enforce Dual-Storage Mandate (exhaustive spec/[hackathon_name]_brief.md + permanent anti-drift lock in .agents/rules/CONTEXT.md Section 0); for elite/institutional tracks, execute Milestone 0.5 forensic audit of past winners; for multi-PS competitions, execute Milestone 0.8 Multi-Modal PS Hunting & Compulsory HITL Selection (pre-filter team tech stack intake, triage down to Top 5 shortlist in spec/01_ps_hunting_shortlist.md for mandatory user choice); execute Milestone 0.9 Domain Scope Assessment (niching broad PSs into sharp micro-wedges or proceeding directly to product hunt); run 4-subagent parallel research across YC, a16z, Reddit, and VCs; score on 9 parameters to output Top 10 validated ideas."
    time_allocation: "Hour 0 - Hour 2"
    primary_skills:
      - "kimi-webbridge"
      - "research subagents"
      - "idea-refine"
      - "doubt-driven-development"

  phase_2_competitor_teardown_and_sentiment_mining:
    spec_file: "spec_universal/hackathon_pipeline/02_competitor_teardown_and_sentiment_mining.md"
    objective: "Identify candidate commercial incumbents AND past winner/open-source repositories; compile candidate directory in spec/03_candidate_products_and_repos.md prior to deep surgical analysis; audit pricing/workflows and codebase dependencies; mine 1-3 star reviews on G2/Reddit/GitHub; invert flaws into product leverage; and define Baseline Parity + Kill Feature in spec/03_competitor_leverage_report.md."
    time_allocation: "Hour 2 - Hour 4"
    primary_skills:
      - "kimi-webbridge"
      - "context-engineering"

  phase_3_mvp_scoping_and_demo_razor:
    spec_file: "spec_universal/hackathon_pipeline/03_mvp_scoping_and_demo_razor.md"
    objective: "Enforce 70% buildable coding rule; apply 2-Minute Golden Demo Path Razor; mandate authentic visual mocks for auth/billing; enforce localhost/SQLite-first completion before free-tier cloud deployment (Vercel, Supabase, Railway/Render); and build covert offline JSON fallback caches (never labeled 'demo') in spec/04_mvp_execution_blueprint.md."
    time_allocation: "Hour 4 - Hour 5"
    primary_skills:
      - "planning-and-task-breakdown"
      - "doubt-driven-development"
      - "code-simplification"

  phase_4_lean_7layer_architecture:
    spec_file: "spec_universal/hackathon_pipeline/04_lean_7layer_architecture.md"
    objective: "Rapidly draft high-signal design specifications: Lean PRD, BaaS tech stack (Supabase/Convex), macro data-flow contracts, and domain state machines without enterprise bloat."
    time_allocation: "Hour 5 - Hour 6"
    primary_skills:
      - "spec-driven-development"
      - "api-and-interface-design"

  phase_5_rapid_ui_scaffolding:
    spec_file: "spec_universal/hackathon_pipeline/05_rapid_ui_scaffolding.md"
    objective: "Assemble production-grade frontend in minutes using 21st.dev components, Tailwind CSS, Lucide icons, and pre-built design tokens rather than writing CSS from scratch."
    time_allocation: "Hour 6 - Hour 10"
    primary_skills:
      - "21st-ui-build"
      - "frontend-ui-engineering"

  phase_6_lean_4tier_tdd_and_security:
    spec_file: "spec_universal/hackathon_pipeline/06_lean_4tier_tdd_and_security.md"
    objective: "Enforce rapid automated test suites across all 4 tiers (Execution bounds, Golden Path logic, UI rendering contracts, and STRIDE/OWASP threat hardening on demo input fields)."
    time_allocation: "Hour 10 - Hour 18"
    primary_skills:
      - "test-driven-development"
      - "cyber-security-frameworks"
      - "systematic-debugging"

  phase_7_demo_pitch_and_judge_proofing:
    spec_file: "spec_universal/hackathon_pipeline/07_demo_pitch_and_judge_proofing.md"
    objective: "Formulate the 3-minute pitch script (Hook, Problem, Solution, Live Demo, Impact), construct zero-latency preset modes, and package offline backup video recordings to prevent live Wi-Fi crashes."
    time_allocation: "Hour 18 - Hour 24"
    primary_skills:
      - "shipping-and-launch"
      - "verification-before-completion"
```

---

## 🧭 Time-Budget Brackets & Execution Velocity

```yaml
time_budget_matrix:
  bracket_a_extreme_sprint:
    duration: "12 - 18 Hours"
    p0_scope: "1 Core Baseline Workflow + 1 Leverage Kill Feature only."
    ui_strategy: "Single-page dashboard, pre-tested 21st.dev components, hardcoded mock data for all secondary tabs."
    demo_strategy: "Pre-recorded 60fps walkthrough video running side-by-side with live UI."

  bracket_b_standard_hackathon:
    duration: "24 - 36 Hours"
    p0_scope: "2 Core Baseline Workflows + 1-2 Leverage Features + Live Interactive State."
    ui_strategy: "Multi-view application with interactive filters, live toast notifications, and dark mode."
    demo_strategy: "Live demo using pre-seeded test accounts + instant fallback JSON caches on all external API routes."

  bracket_c_extended_competition:
    duration: "48+ Hours"
    p0_scope: "Full Baseline Parity on primary modules + multi-point leverage additions + real-time multi-client sync."
    ui_strategy: "Complete responsive web app with mobile preview and polished micro-interactions."
    demo_strategy: "Two connected devices interacting in real time (e.g., judge device and admin dashboard)."
```

---

## 🛡️ Non-Negotiable Operational Invariants

1. **The Golden Demo Path Razor**: If a feature, toggle, or settings tab does not sit directly on the 2-minute judging script, it is strictly banned from being coded (Rule 2).
2. **Sentiment Arbitrage**: Every project built with this boilerplate must trace its core differentiation to verifiable user complaints extracted from G2, Reddit, or Trustpilot.
3. **Mandatory Mocking of Commodity Layers**: Never spend hackathon hours writing custom OAuth flows, password reset emails, or Stripe webhooks. Always use mock sessions and hardcoded enterprise tiers.
4. **Offline Resilience**: Every external LLM, third-party API, or web scraping call must have a deterministic local fallback JSON cache to survive conference Wi-Fi drops.
5. **Physical Interceptor Hook Active**: All terminal commands are guarded by `.agents/scripts/destructive_command_guard.py` via `.agents/hooks.json` to prevent accidental destructive operations.
