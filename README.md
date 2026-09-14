# 🏆 Hackathon_Boilerplate

> **The High-Velocity Hackathon & Venture Build Operating System**  
> *Autonomously discover validated ideas, dismantle market incumbents, build high-performance MVPs via the Golden Demo Path, and win competitions with flawless live presentations.*

---

## ⚡ Overview & Philosophy

In fast-paced hackathons (12h, 24h, 48h), speed without discipline leads to the #1 failure mode: **ideation paralysis, rushed spaghetti code, broken live demos, and unfocused pitches.**

`Hackathon_Boilerplate` is an autonomous operating system engineered for AI coding agents and human developers. It shifts the competitive paradigm from *"guessing random ideas and building toys"* to **empirical sentiment arbitrage**:

1. **Evidence-Backed Ideation:** Discover real, unserved user pain across YC, a16z, Reddit, and VC thesis libraries.
2. **Sentiment Arbitrage:** Tear down the category's market incumbent, mine their 1-star to 3-star reviews on G2/Reddit/GitHub, and invert their flaws into an unfair product wedge.
3. **The Golden Demo Path Razor:** Strictly ban any button, toggle, or feature that does not sit directly on the 2-minute judging presentation.
4. **Lean 7-Layer Architecture:** Fast-track high-density architecture specs (PRD, BaaS decisions, typed API contracts, deterministic state machines) without enterprise bloat.
5. **Rapid UI Scaffolding:** Assemble a venture-backed visual interface in under 4 hours using 21st.dev components, Tailwind CSS, Lucide icons, and Framer Motion.
6. **Lean 4-Tier TDD & Security:** Automated $<30$s test suite covering execution bounds ($<4000\text{ ms}$), Golden Path logic, UI contracts, and STRIDE/OWASP input fuzzing.
7. **Tri-Layer Fail-Safe Demo Shield:** Zero-latency preset demo mode, deterministic local JSON fallbacks, and 60fps silent backup video so your live pitch never crashes.

---

## 📂 The 7-Phase Hackathon Pipeline

All operational playbooks and executable specifications live under [`spec_universal/hackathon_pipeline/`](spec_universal/hackathon_pipeline/):

| Phase | Specification Document | Core Capabilities & Deliverables | Time Budget |
| :---: | :--- | :--- | :---: |
| **00** | [`00_master_hackathon_operating_system.md`](spec_universal/hackathon_pipeline/00_master_hackathon_operating_system.md) | Master speedrun protocol, operational invariants, and time-budget brackets. | Foundation |
| **01** | [`01_idea_discovery_and_scoring.md`](spec_universal/hackathon_pipeline/01_idea_discovery_and_scoring.md) | Dual-mode intake, 4-subagent parallel research, 9-parameter scoring matrix, Top 10 Idea Bank. | Hour 0–2 |
| **02** | [`02_competitor_teardown_and_sentiment_mining.md`](spec_universal/hackathon_pipeline/02_competitor_teardown_and_sentiment_mining.md) | Incumbent teardown, 1-3 star review mining (G2/Reddit), flaw inversion, and pitch contrast. | Hour 2–4 |
| **03** | [`03_mvp_scoping_and_demo_razor.md`](spec_universal/hackathon_pipeline/03_mvp_scoping_and_demo_razor.md) | Golden Demo Path Razor, 70% buildable time rule, P0/P1/P2 triaging, and mandatory mocks. | Hour 4–5 |
| **04** | [`04_lean_7layer_architecture.md`](spec_universal/hackathon_pipeline/04_lean_7layer_architecture.md) | Consolidated 7-layer architecture: Lean PRD, BaaS tech stack ADR, Mermaid data flow, typed contracts. | Hour 5–6 |
| **05** | [`05_rapid_ui_scaffolding.md`](spec_universal/hackathon_pipeline/05_rapid_ui_scaffolding.md) | 21st.dev component assembly, dark mode visual DNA, and the "⚡ Load Judge Demo" preset. | Hour 6–10 |
| **06** | [`06_lean_4tier_tdd_and_security.md`](spec_universal/hackathon_pipeline/06_lean_4tier_tdd_and_security.md) | Fast $<30$s test suite: Type 1 perf bounds, Type 2 logic, Type 3 UI, and Type 4 STRIDE fuzzing. | Hour 10–18 |
| **07** | [`07_demo_pitch_and_judge_proofing.md`](spec_universal/hackathon_pipeline/07_demo_pitch_and_judge_proofing.md) | 3-Minute pitch formula, tri-layer fail-safe shields (JSON fallback, demo mode, backup video), Q&A defense. | Hour 18–24 |

---

## ⏱️ Time-Budget Brackets

```yaml
time_budget_matrix:
  bracket_a_extreme_sprint (12 - 18h):
    scope: "1 Core Baseline Workflow + 1 Hero Leverage Kill Feature only."
    strategy: "Single-page dashboard, pre-tested components, hardcoded mock data for all secondary tabs."
    demo: "Pre-recorded 60fps walkthrough video running side-by-side with live UI."

  bracket_b_standard_hackathon (24 - 36h):
    scope: "2 Core Baseline Workflows + 1-2 Leverage Features + Live Interactive State."
    strategy: "Multi-view app with interactive filters, live toast notifications, and dark mode."
    demo: "Live interactive demo using pre-seeded test accounts + instant fallback JSON caches on all APIs."

  bracket_c_extended_competition (48h+):
    scope: "Full Baseline Parity on primary modules + multi-point leverage additions + real-time sync."
    strategy: "Complete responsive web app with mobile preview and polished micro-interactions."
    demo: "Two connected devices interacting in real time (e.g., judge device and admin dashboard)."
```

---

## 🛡️ Non-Negotiable Operational Invariants

1. **The Golden Demo Path Razor (Rule 2):** If a feature or setting does not sit directly on the 2-minute judging script, it is strictly banned from being coded.
2. **Mandatory Mocking of Commodities:** Never waste hackathon hours writing custom OAuth flows, password reset emails, or Stripe payment webhooks. Always use mock sessions and hardcoded enterprise tier badges.
3. **Offline Resilience:** Every external LLM or API integration must have a deterministic local fallback JSON cache to survive venue Wi-Fi drops.
4. **Physical Harmful Command Prevention Hook (Rule 32):** All terminal commands are guarded by `.agents/scripts/destructive_command_guard.py` via `.agents/hooks.json`.
5. **Physical Immuntability Guard (Rule 29 & 30):** Pre-commit hook (`.githooks/pre-commit`) prevents accidental commits to protected templates.

---

## 🚀 Quickstart: Starting a New Hackathon

1. **Clone this repository for your competition:**
   ```bash
   git clone https://github.com/pratikforge/Hackathon_Boilerplate.git my-hackathon-app
   cd my-hackathon-app
   ```

2. **Initialize Git Hooks:**
   ```bash
   git config core.hooksPath .githooks
   ```

3. **Tell your AI Agent:**
   > *"We are competing in [Hackathon Name]. The theme is [Theme/Track]. Execute Phase 1 of `spec_universal/hackathon_pipeline/` to discover and score the Top 10 validated ideas."*

4. **Follow the 7-Phase Protocol:**
   The agent will systematically guide the project from problem intake to a winning 3-minute pitch.
