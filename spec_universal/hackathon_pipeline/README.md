# 🏆 Hackathon Operating System & Speedrun Framework

> **Location:** `spec_universal/hackathon_pipeline/`  
> **Repository:** `Hackathon_Boilerplate`

This directory houses the complete, chronological 7-phase execution suite designed to autonomously research, design, build, test, and pitch winning products at hackathons and fast-paced venture competitions.

---

## 📑 Specification Navigation Index

| Phase | Specification Document | Key Capabilities & Deliverables |
| :---: | :--- | :--- |
| **Overview** | [`00_master_hackathon_operating_system.md`](00_master_hackathon_operating_system.md) | Master speedrun protocol, time-budget brackets (4-6h / 12h / 24h / 48h), and operational invariants. |
| **Phase 1** | [`01_idea_discovery_and_scoring.md`](01_idea_discovery_and_scoring.md) | Multi-modal reconnaissance (PDFs/portal), 15m speedrun fast-track, `[hackathon_name]_brief.md`, `CONTEXT.md` anti-drift lock, Elite Hackathon intelligence (M0.5), Multi-Modal PS Hunting & Top 5 HITL Shortlist (M0.8), Domain Scope & Niching (M0.9), 4-subagent research (YC/a16z/Reddit/VCs), 9-parameter matrix, and Top 10 Idea Bank. |
| **Phase 2** | [`02_competitor_teardown_and_sentiment_mining.md`](02_competitor_teardown_and_sentiment_mining.md) | Discovered candidate products & past winner repo directory (`03_candidate_products_and_repos.md`), surgical workflow/codebase teardown, 1-3 star review mining (G2, Reddit, GitHub), flaw inversion, and baseline parity + kill feature (`03_competitor_leverage_report.md`). |
| **Phase 3** | [`03_mvp_scoping_and_demo_razor.md`](03_mvp_scoping_and_demo_razor.md) | 2-Minute Golden Demo Path Razor, 70% buildable rule, P0/P1/P2 triaging with authentic visual mocks, localhost/SQLite-first completion, free-tier cloud staging (Vercel/Supabase/Railway), and covert demo resilience (`04_mvp_execution_blueprint.md`). |
| **Phase 4** | [`04_lean_7layer_architecture.md`](04_lean_7layer_architecture.md) | Consolidated 7-layer architecture: Lean PRD, BaaS tech stack ADR, Mermaid data flow, typed API contracts, and FSM. |
| **Phase 5** | [`05_rapid_ui_scaffolding.md`](05_rapid_ui_scaffolding.md) | Fast 21st.dev component assembly, dark mode visual DNA, split-screen hero layout, and the "⚡ Load Judge Demo" preset. |
| **Phase 6** | [`06_golden_path_smoke_verification.md`](06_golden_path_smoke_verification.md) | Smoke verification: clean compilation (`npm run build` or `tsc --noEmit`), zero-crash 2-minute judge walkthrough, and fail-safe local JSON fallbacks. |
| **Phase 7** | [`07_demo_pitch_and_judge_proofing.md`](07_demo_pitch_and_judge_proofing.md) | 3-Minute pitch script formula, tri-layer fail-safe shields (JSON fallback, demo mode, 60fps video backup), and Q&A defense. |

---

## 🚀 How to Execute in an Active Hackathon

When starting a new hackathon, initialize an active competition workspace under `spec/`:
```bash
# Example: creating your active event workspace
mkdir -p spec/active_competition/
```
Follow the phases in sequential order. Output artifacts will be saved into `spec/`:
1. `spec/[hackathon_name]_brief.md`, `spec/00_elite_hackathon_intelligence.md`, `spec/01_ps_hunting_shortlist.md`, `spec/01_selected_problem_statement.md`, `spec/02_domain_research_and_validated_ideas.md`
2. `spec/03_candidate_products_and_repos.md`, `spec/03_competitor_leverage_report.md`
3. `spec/04_mvp_execution_blueprint.md`
4. `spec/05_system_architecture.md`
5. Implementation in `src/` (UI scaffolding + core differentiating logic)
6. Smoke verification via `npm run build` and zero-crash browser walkthrough
7. Pitch rehearsal using `07_demo_pitch_and_judge_proofing.md`
