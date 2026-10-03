# Project Rules

Please add your custom instructions for this project below.

1. Think Before Coding
   Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.

2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
   Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
   Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

   - Step 1: [Step] → verify: [check]
   - Step 2: [Step] → verify: [check]
   - Step 3: [Step] → verify: [check]
   Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

5. Graphify as Primary Knowledge Base
   STRICTLY avoid raw grepping and searching through the codebase. Instead, ALWAYS use Graphify as your primary source of codebase knowledge. Always use the knowledge graph in all cases unless there is an explicit need to refer to a particular code snippet directly.
   Furthermore:

- Every implementation plan MUST explicitly start the search phase with Graphify.
- At the end of implementation, when changes are made, the plan MUST explicitly mention updating the Graphify knowledge graph.

6. Lean Planning Architecture for Speedrun
   In a hackathon speedrun (~6-hour build window), operational speed is paramount. While keeping zero prose bloat, specifications and task plans should be rapid and lightweight:
   - **Markdown Envelope (`.md`)**: Use standard `#` and `##` headings for clear visual hierarchy.
   - **Zero Prose Bloat**: Eliminate conversational filler. Keep all task instructions crisp, direct, and actionable.
   - **Streamlined Milestones**: Plans should focus directly on: (1) UI Layout/Scaffold, (2) Core Feature Logic/API, (3) Mock Fallbacks & Demo Presets. Exhaustive multi-page YAML schemas with heavy prerequisite declarations are relaxed in favor of rapid, readable execution blocks.

7. Strict YAML Primacy for Data Modeling & Domain Structures
   During the detailed explanation of features, schemas, and system state machines, prefer YAML over JSON (except where JSON is strictly required by third-party tool contracts, such as `package.json`).

8. Hackathon Speedrun Verification & Golden-Path Smoke Testing
   In this rapid prototyping hackathon environment (~6-hour build window), exhaustive enterprise 4-tier TDD and production-grade security/complexity test suites are strictly suspended to maximize velocity towards a working, crash-proof demo.
   - **Smoke Verification Invariant**: Before claiming completion, the code must pass 2 objective gates:
     1. *Compilation & Lint Gate*: The project builds cleanly (`npm run build` or `tsc --noEmit`) without fatal syntax or type errors.
     2. *Golden-Path Demo Gate*: The end-to-end 2-minute judge walkthrough renders and executes without unhandled console errors or runtime crashes.
   - **Targeted Unit Testing (Exceptions Only)**: Write unit tests ONLY for mission-critical core mathematical algorithms or complex data transformations where a silent calculation bug would break the demo pitch. UI components, styling, and standard CRUD are verified visually in the browser rather than through tedious unit test harnesses.
   - **Zero Enterprise Security/Complexity Test Overhead**: Do NOT write Type 1 Big-O benchmarks (`performance.now()`), Type 3 DOM node leak tests, or Type 4 STRIDE / OWASP Top 10 fuzzing scripts. The application is a local prototype, not a publicly deployed production banking portal.

9. Rapid Error Recovery & Frictionless Fixes
   During the hackathon speedrun, logging formal YAML incident telemetry records in `.agents/rules/CONTEXT.md` on every runtime bug or compiler error is suspended.
   - Fix bugs immediately and surgically in place, verify via smoke test, and proceed with the build.
   - Use `.agents/rules/CONTEXT.md` only for high-level permanent anchor facts (active hackathon theme, judging criteria weights, team stack choices). Do not accumulate operational friction with micro-incident logs.

10. Pre-Commit Hooks and Automation (`.githooks/`)
    The repository includes versioned native Git hooks in `.githooks/` configured via `git config core.hooksPath .githooks`. These hooks automate basic guardrails to ensure code integrity.
    - **Physical Immutability Guard (`.githooks/pre-commit`)**: The pre-commit hook automatically inspects staged files and physically terminates any `git commit` that attempts to modify `spec_universal/` (Rule 30). Project-specific specifications in `spec/` and source code are permitted.

11. No Force Commits
    Under no circumstances should you use destructive git commands (`git push --force`) to corrupt history. Address genuine syntax or build failures surgically before proceeding.

12. Lean Hackathon Planning (Actionable Milestones & Smoke Verification)
    Keep implementation plans concise, highly actionable, and fast to review. Plans must outline:
    - **Milestone 1**: UI Scaffolding & Visual Flow (Tailwind, Lucide, 21st.dev components).
    - **Milestone 2**: Core Feature Logic & API Integration (the "Wedge").
    - **Milestone 3**: Fail-Safe Mock Fallbacks & "⚡ Load Demo Data" Preset.
    - **Verification**: Exact command to build (`npm run build`) and manual Golden-Path check.
    Do NOT include bloated theoretical specifications, Big-O benchmarks, or STRIDE threat models in hackathon plans.

13. Hackathon-Ready Git Automation
    Hooks should ensure basic integrity (e.g. valid syntax, no syntax breakages) without blocking emergency commits on non-critical lint warnings or omitted test suites during crunch time. Never allow automated gates to prevent the team from saving working code before submission.

14. Template Literal Escaping Error
    When writing TypeScript or JavaScript code using \write_to_file\, NEVER escape the dollar sign in template literals (e.g. use \${}, NOT \\${}). Doing so causes a PARSE_ERROR (Invalid Unicode escape sequence) in parsers like oxc.

15. CI vs Local Performance Thresholds
    When writing time or space complexity performance tests using `performance.now()` bounds, NEVER assume that CI runners (like GitHub Actions) execute as fast as the local environment. Always set generous upper-bounds (e.g., 3x-5x local speeds) for `toBeLessThan` assertions and Vitest timeout durations to prevent flaky CI pipelines.

16. Oxlint `eslint-disable` Comment Placement
    When attempting to bypass a linter warning in `oxlint` (e.g., `react-hooks/exhaustive-deps`), the `// eslint-disable-next-line` directive MUST be placed on the exact line immediately preceding the target code structure (like the dependency array closing bracket `}, []);`). Placing it above a regular code comment will cause oxlint to ignore the directive and fail the build.

17. Feature Branch & PR Workflow (The Safety Net)
    NEVER develop new features or tests directly on the `main` branch.
    - **Local Isolation:** Always create a new branch (e.g., `feat/ui-updates`) for your work. If the code breaks irreparably or a massive conflict occurs locally, simply delete the branch and reset to `main`.
    - **Remote PRs:** When ready, push the branch and open a Pull Request. Never push directly to `main`.
    - **Reverting:** If an issue is discovered _after_ merging to `main`, do not attempt to manually track and revert individual scattered commits via the terminal. Instead, track the issue to the specific PR and use GitHub's 1-click "Revert Pull Request" feature to cleanly undo the entire feature block at once.

18. Kimi WebBridge React Textarea Injection
    When filling highly controlled React components (like the main code editor) via Kimi WebBridge, the native fill command may fail with an Uncaught exception. If this happens, ALWAYS use the evaluate action with the nativeInputValueSetter and dispatch an input event to securely set the value, rather than failing or asking for help.

19. Unused Default React Imports under Strict JSX Runtime
    When writing or refactoring React components in projects configured with modern JSX transform (`"jsx": "react-jsx"`) and strict TypeScript (`noUnusedLocals: true`), NEVER add default `import React from "react"` unless explicitly referencing `React.*` properties. Unused default imports trigger compiler error TS6133 and fail pre-commit hooks.

20. Hackathon Code Quality: Visual Impact, Clean Contracts & Lean Execution
    In a hackathon speedrun, code quality is measured by demo reliability, visual polish, and clean modularity rather than theoretical security test suites.
    - **Visual Polish & Design Taste**: Interfaces must look modern, production-grade, and deliberate (leveraging Rule 34 and 21st.dev components).
    - **Zero Redundant Bloat**: Keep code lean and focused strictly on the 2-minute judge path per Rule 2.
    - **Contract Integrity**: Maintain clear TypeScript types and predictable state transitions.
    - **No Dedicated Test Overhead**: Dedicated `*.security.test.*` and `*.perf.test.*` test files are strictly disabled for the hackathon prototype.

21. Single-Pass Rapid Planning (Zero Multi-Subagent Review Overhead)
    In a 6-hour hackathon, spawning multiple subagents to debate and critique implementation plans is strictly suspended. Planning must be rapid, single-pass, and directly actionable. Present the plan directly to the user for immediate approval so coding can begin without multi-agent wait cycles.

22. Automated PR Lifecycle via GitHub CLI (`gh`)
    Whenever creating, managing, or merging Pull Requests, ALWAYS use the GitHub CLI (`gh pr create`, `gh pr merge`, etc.) directly from the terminal rather than requesting manual web UI steps from the user. Ensure the PR title, body summary, base branch (`main`), and head branch are clearly specified, and proceed with automated PR creation and merging where structurally appropriate.

23. System Design Specification Routing & Anti-Context Bloat
    During a 6-hour hackathon, heavy enterprise system design specifications (QPS capacity math, sharding, HikariCP pool math, multi-burn-rate PromQL alerting) are completely bypassed in favor of the 3-step Hackathon Sprint. If consulting architectural concepts, consult `spec_universal/hackathon_system_architecture.md` without dumping large files into context.

24. Explicit User Authorization for Commits and Pull Requests
    NEVER commit changes, create pull requests, or merge pull requests autonomously. You MUST ONLY commit or perform Git PR lifecycle actions (staging, committing, pushing, opening PRs, or merging PRs) when the USER explicitly instructs you to do so. Until explicit direction is given, keep all modifications strictly in the local working directory for review.

25. Strict Closure Matching for Component Wrappers (`React.memo` / HOCs)
    When refactoring a functional component declaration to wrap it in `React.memo` or a higher-order component (e.g., `export const ComponentName = memo(function ComponentName(...) { ... });`), ALWAYS verify that the closing parenthesis `});` matches the opening wrapper. Missing closing parentheses cause abrupt `[PARSE_ERROR] Expected ')' but found 'EOF'` errors in Vite/oxc transforms and fail test pipelines.

26. Full Scope Verification Before Pruning State Variables
    When refactoring components or removing dead code/helper functions, NEVER delete or omit top-level destructured variables (e.g. `changedFlags`, `busActivity`) without thoroughly searching the entire JSX tree for references. Even if a helper function is neutralized, the variable may still be referenced in conditional styles or sub-components, leading to runtime `ReferenceError` crashes during rendering.

27. Mandatory Skill Attribution in Implementation Plans & Execution
    Whenever creating an implementation plan or defining execution steps, you MUST explicitly identify and name the specific available skill(s) (from the `<skills>` catalog) to be used for each phase, milestone, or task during execution:
    - **Explicit Skill Mapping in Plans**: Every phase, component task, or verification workflow in `implementation_plan.md` must state the exact designated skill (e.g., `using-agent-skills`, `frontend-ui-engineering` or `21st-ui-build` for UI implementation, `planning-and-task-breakdown` for scoping, `debugging-and-error-recovery` or `systematic-debugging` for bug triage, `code-review-and-quality` before finalizing, `git-workflow-and-versioning` or `ci-cd-and-automation` for delivery).
    - **Execution by Designated Skill**: During execution, the agent must activate and strictly follow the procedural guidelines of the assigned skill rather than improvising generic, unstandardized workflows.
    - **Zero Unattributed Steps**: Generic plans with tasks that lack explicit skill attribution violate this rule and must be rejected during plan formulation.

28. Strict File Extensions for JSX Test Suites
    When creating or editing test files that render React components or contain JSX elements (e.g. `<Component />`), ALWAYS use the `.tsx` file extension. Using `.ts` causes Vite/oxc parser failures because `<` is treated as a generic type argument.

29. Master Boilerplate AGENTS.md vs Downstream Cloned Project Isolation
    In this master boilerplate repository (`Universal_Project_Boilerplate`), `.agents/AGENTS.md` is versioned and maintained on `main` as the authoritative agent operating system, guaranteeing that whenever this repository is cloned into a new project (`git clone`), the cloned workspace inherits the full 38-rule architecture and automated safety hooks out of the box.
    - **Downstream Cloned Isolation**: Once cloned to start a specific product or application, `.agents/AGENTS.md` should remain confined to the local workspace to avoid polluting downstream product codebases, unless explicitly updating the master boilerplate standard itself.

30. Universal Specifications (`spec_universal/`) vs. Project-Specific Specifications (`spec/`)
    All specifications, PRDs, architecture plans, and task plans must strictly follow this directory separation and lifecycle rule:
    - **`spec_universal/` (Immutable Foundation & Physical Commit Block)**: Houses universal, project-agnostic architecture guidelines, templates, testing playbooks, and PRD templates. These files are shared standards applicable across all projects. **`spec_universal/` MUST NOT be altered, edited, or modified during the course of any project unless the user specifically and explicitly instructs to do so.** Any attempt to commit changes to `spec_universal/` during a project is physically terminated by `.githooks/pre-commit`.
    - **`spec/` (Project-Specific & Push-Allowed)**: Reserved strictly for **project-specific** documentation. All PRDs, technical stack specifications, feature implementation task plans, and architecture documents created specifically for this repository must be saved within `spec/`. Unlike `.agents/AGENTS.md` and `spec_universal/`, documents and artifacts in the `spec/` folder **are explicitly allowed to be staged, committed, and pushed** to the repository when authorized.

31. Hackathon Speedrun Lifecycle, 3-Phase Sprint & Smoke Verification Invariant
    In this ~6-hour hackathon environment, heavy enterprise specification generation (HLD capacity math, multi-burn-rate PromQL, tactical DDD matrices) is strictly suspended. The agent follows the **3-Phase Hackathon Sprint**:
    
    ```yaml
    hackathon_speedrun_lifecycle:
      sprint_phase_1_the_wedge:
        document: "01. Hackathon Wedge & 2-Minute Demo Script"
        duration_target: "15 - 20 minutes"
        objective: "Define the core problem, 1 unfair technical differentiator, and the exact 2-minute judge walkthrough."
        designated_skills:
          - "idea-refine"
          - "planning-and-task-breakdown"
        output_target: "spec/01_hackathon_wedge.md"

      sprint_phase_2_rapid_assembly:
        document: "02. Rapid UI & Core Feature Implementation"
        duration_target: "3 - 4 hours"
        objective: "Scaffold visual components with 21st.dev / Tailwind, hook up core API/model logic, and verify ideal user path."
        designated_skills:
          - "21st-ui-build"
          - "frontend-ui-engineering"
        output_target: "Working localhost prototype"

      sprint_phase_3_judge_proofing:
        document: "03. Fail-Safe Mock Fallbacks & Demo Presets"
        duration_target: "30 - 45 minutes"
        objective: "Ensure zero live demo crashes: wire up offline JSON fallback fixtures and embed the '⚡ Load Judge Demo' preset button."
        designated_skills:
          - "shipping-and-launch"
          - "verification-before-completion"
        output_target: "100% crash-proof demo readiness"

    embedded_smoke_verification_invariant:
      mandate: "In a 6-hour hackathon, verification is smoke-driven to maximize velocity."
      core_gates:
        compilation_gate: "The project compiles cleanly (e.g. npm run build or tsc --noEmit) with zero syntax/type errors."
        golden_path_gate: "The 2-minute judge demo flow renders smoothly in browser with zero unhandled runtime crashes or red console errors."
      enterprise_tdd_status: "4-tier TDD, Big-O benchmarks, and STRIDE/OWASP threat test suites are strictly disabled for the local hackathon prototype."

    post_code_dead_code_sweep:
      timing: "MANDATORY intermediate phase: immediately after code is written/modified, and strictly BEFORE executing build checks."
      assigned_skills:
        - "code-simplification"
        - "code-review-and-quality"
      mandate: "Eliminate unused imports, orphaned types, and temporary helper stubs caused by new code (prevents strict TS6133 failures)."
      protocol:
        1_orphan_import_and_variable_sweep: "Strip unused imports, variables, or types."
        2_full_scope_jsx_and_hook_verification: "Verify no lingering references in JSX or hooks per Rule 26."
        3_abandoned_code_and_scratch_removal: "Remove leftover debug logs, scratch files, and experiments."
        4_surgical_boundary: "Touch only your own mess per Rule 3."

    mandatory_plan_guardrails_block:
      mandate: "Every implementation plan should briefly affirm core safety invariants:"
      required_guardrail_declarations:
        1_harmful_command_boundaries: "Affirm zero destructive commands (rm -rf, format, DROP TABLE per Rule 32)."
        2_vcs_and_git_isolation: "Affirm that all changes remain local and will not be pushed without explicit user authorization."
        3_golden_path_verification: "Affirm verification via smoke build and 2-minute demo path."
    ```

32. Harmful Command Prevention, Non-Negotiable Reversibility & Automated Interceptor Hook (`.agents/hooks.json`)
    Under absolutely no circumstances should the agent execute destructive, irreversible, or high-risk commands that cause mass filesystem deletion, volume formatting, unconfirmed database drops, or VCS history loss.
    - **Non-Negotiable Invariant of Reversibility**: Every action, schema migration, or operational script executed by the agent must have a safe, deterministic rollback path. Destructive operations without a zero-downtime recovery or backup plan are strictly prohibited.
    - **Physical PreToolUse Command Interceptor (`.agents/hooks.json`)**: All calls to `run_command` are automatically intercepted prior to execution by `.agents/scripts/destructive_command_guard.py`. The guard de-obfuscates the input through a 4-phase forensic normalization pipeline (NFKC unicode canonicalization, shell escape stripping, quote coalescing, and flag unbundling) and matches against 6 threat categories:
      1. *Mass Filesystem Deletion*: `rm -rf /`, `rm -rf ~`, `Remove-Item -Recurse -Force`, `rmdir /s /q`, `del /f /s /q`.
      2. *Disk & Block Device Destruction*: `mkfs`, `dd if=/dev/...`, `diskpart clean`, `format C:`, `Clear-Disk`.
      3. *Git Force Destruction*: `git push --force`, `git push -f`, `git push +refspec`, `git push --delete`, `git reset --hard`, `git clean -fdx`, `git branch -D`.
      4. *Database Drops & Mass Deletes*: `DROP DATABASE`, `DROP TABLE`, `TRUNCATE TABLE`, unconstrained `DELETE FROM` (or `1=1` tautology), `FLUSHALL`/`FLUSHDB`.
      5. *OS & System Integrity Hijack*: Fork bombs (`:(){ :|:& };:`), forced shutdowns/reboots, terminating critical Windows processes (`lsass`, `csrss`), tampering with BCD or disabling Windows Defender/Firewall.
      6. *Privilege Escalation & Exfiltration*: Pipe-to-shell (`curl ... | bash`, `irm ... | iex`), encoded PowerShell (`-enc`), `chmod 777 /`, dumping SAM/SYSTEM hives.
    - **Zero-Bypass Policy**: When a threat pattern is spotted, the hook physically emits `{"decision": "deny"}` with exit code interception, completely terminating the command before shell dispatch.

33. Knowledge Dump Intake & Surgical Merge Protocol (`dump/`)
    The `dump/` directory serves as a transient inbox for external reference files, rules from other projects (`AGENTS.md`), or architecture playbooks. Whenever files are placed into `dump/`, the agent must process them under the **Surgical Knowledge Merge Protocol**:
    - **Zero Destruction / Immutability of Existing State**: Never overwrite, alter, or rewrite existing rules in `.agents/AGENTS.md`, `.agents/rules/CONTEXT.md`, or `spec_universal/`. Existing numbering, contracts, and guardrails must remain fully intact.
    - **Forensic Deduplication**: Rigorously compare incoming content against all existing 37 rules and universal specifications. If a concept (e.g. TDD, pre-commit hooks, zero-trust, git PR workflows) is already covered, REJECT the duplicate.
    - **High-Value Differential Extraction Only**: Extract ONLY genuinely novel capabilities, unhandled edge-case warnings, or valuable architectural patterns.
    - **Deterministic Destination Routing**:
      - New behavioral rules or guardrails $\to$ append incrementally as new numbered rules in `.agents/AGENTS.md`.
      - Project DNA, runtime quirks, or mistake patterns $\to$ append to `.agents/rules/CONTEXT.md`.
      - Architecture templates or specifications $\to$ integrate into the appropriate `spec_universal/` document.
    - **Audit & Clean**: Provide a clear report of what was extracted vs. rejected (and why) before clearing the processed dump file.

34. Universal Frontend Design Bible, Design Token Primacy & Anti-Slop Enforcement Protocol (`spec_universal/frontend_design_bible.md`)
    Whenever implementing, refactoring, or reviewing frontend interfaces, components, or styles, the agent MUST strictly adhere to the **Universal Frontend Design Bible** located at `spec_universal/frontend_design_bible.md`.
    - **Anchored Root DESIGN.md Prerequisite**: Before writing, modifying, or refactoring frontend code, verify or initialize a canonical root `DESIGN.md` capturing primitive, semantic, and component tokens. Components must NEVER ingest raw color hex codes, hardcoded pixel spacings, or arbitrary z-indices (Zero-Primitive Ingestion Invariant).
    - **Watertight 5-Layer Tool Stack Pipeline**:
      1. *Layer 1 (Reference Grounding)*: Use `awesome-design-md` to extract structural design tokens and layout mechanics from production design systems without copying trademarked branding.
      2. *Layer 2 (Aesthetic Governor)*: Anchor to `frontend-design` as the baseline and activate strictly ONE mutually exclusive aesthetic governor (`minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `design-taste-frontend`, or `high-end-visual-design`). Never combine competing aesthetic governors.
      3. *Layer 3 (Production Builders)*: Build accessible HTML5/React component architectures via `frontend-ui-engineering`, accelerate primitives with `21st-ui-build`, and sandbox WebGL/Three.js assets via `img2threejs`.
      4. *Layer 4 (Preflight Polish)*: Audit micro-typography, tabular figures, optical alignment, and zero-data states with `impeccable` and `21st-ui-review`.
      5. *Layer 5 (Physical Verification)*: Validate runtime performance and accessibility in real browsers using `playwright-cli` and `browser-testing-with-devtools`.
    - **Zero Tolerance for Visual Slop**: Strictly enforce the 6-Category Anti-Slop Codex (banning generic purple radial glows, floating isometric cubes, monotonous 3-column cards, AI buzzword salads, trapless modals, and layout shifts).
    - **Core Web Vitals & Render Bounds**: Maintain high visual responsiveness (smooth 60fps frame rate, clean typography, avoid layout shifts, virtualize massive lists if necessary).
    - **Rapid Frontend Smoke Verification**: Verify visually in the browser. Ensure responsive layout, smooth interactions, and zero console errors on the Golden Demo path without requiring 4-tier TDD test scripts.

35. The 7-Phase Hackathon Speedrun Pipeline & Golden Demo Razor (`spec_universal/hackathon_pipeline/`)
    Whenever operating in a hackathon, competition, or venture sprint context within this repository, or whenever the user drops hackathon materials (rulebooks, PDFs, spreadsheets, portal URLs, problem statement catalogs, or camera photos of problem sheets into `dump/` or chat), the agent MUST autonomously execute through the **7-Phase Hackathon Operating System** formatted under the Hybrid YAML Standard without skipping milestones or taking arbitrary shortcuts:

    ```yaml
    hackathon_speedrun_operating_contract:
      dump_intake_and_autonomous_activation:
        trigger: "User places hackathon source materials in dump/ or provides competition URLs/text in chat."
        autonomous_action: "Immediately activate Phase 1 Milestone 0 (M0_hackathon_reconnaissance). Do NOT ask the user how to proceed; execute reconnaissance and present the competition brief."

      phase_1_idea_discovery_validation_and_scoring:
        designated_spec: "spec_universal/hackathon_pipeline/01_idea_discovery_and_scoring.md"
        primary_skills:
          - "kimi-webbridge"
          - "research subagent"
          - "context-engineering"
          - "idea-refine"
          - "doubt-driven-development"
        milestone_execution_sequence:
          m0_hackathon_reconnaissance:
            action: "Ingest local PDFs, rulebooks, and slide decks in dump/ via view_file or python parsers; scrape live portal via kimi-webbridge."
            dual_storage_mandate:
              human_dossier: "Generate exhaustive, structured competition guide at spec/[hackathon_name]_brief.md (rules, deadlines, tracks, judging percentages, sponsor bounties)."
              permanent_agent_memory: "Write active_hackathon_context block directly into .agents/rules/CONTEXT.md Section 0, locking deadlines, judging weights, and mandatory sponsor SDKs into every subsequent agent turn."
            exit_criteria: "spec/[hackathon_name]_brief.md exists and CONTEXT.md Section 0 is fully populated."

          m0_5_elite_hackathon_intelligence:
            condition: "Mandatory for elite/institutional competitions (multi-round elimination, statutory/ministry/academic juries, or explicit elite_tier: true)."
            action: "Deploy kimi-webbridge and research subagents across Devpost winner galleries, Kaggle solutions, X (Twitter) threads, and GitHub repos to forensically audit 5-10 past winners."
            analysis: "Map each winner's decisive winning edge versus structural weaknesses and unsolved gaps; profile 4 jury archetypes (Academic, Statutory/PSU, Enterprise Architect, VC); codify recurring winning patterns vs fatal traps; establish the Round-by-Round Delta Protocol."
            output: "spec/00_elite_hackathon_intelligence.md and sync elite_intelligence constraints into CONTEXT.md Section 0."

          m0_8_ps_hunting_and_compulsory_hitl_gate:
            condition: "Triggered when organizer provides a catalog of candidate problem statements (softcopy PDFs/sheets or hardcopy photo scans in dump/)."
            action: "Execute multimodal ingestion/OCR; run Compulsory Pre-Filter Team Stack Intake (gather team languages, frameworks, GPU/local limits); execute the 5-stage triage filter (Data Access, 24h Feasibility, Crowd Avoidance, Live Demo Impact, Team Fit)."
            hitl_gate: "Generate comparative dossier in spec/01_ps_hunting_shortlist.md presenting Top 5 candidates; HALT execution and await explicit user selection of Primary PS (P0) and Backup PS (P1)."
            lock: "Compile spec/01_selected_problem_statement.md and sync primary_track_or_problem into CONTEXT.md Section 0."

          m0_9_domain_scope_assessment_and_niching:
            action: "Classify selected PS granularity: if BROAD_OPEN_DOMAIN, decompose into micro-workflows and niche down to exactly 1 killer micro-wedge with 2-minute visual live demo viability (ban broad multi-module bloat); if NARROW_PRESCRIPTIVE_SPEC, confirm exact functional boundaries."
            output: "Append product_wedge_specification block into spec/01_selected_problem_statement.md."

          m1_scope_lock_and_source_matrix:
            action: "Formulate 5 domain query variations, map 3 source tiers (Tier 1: YC/a16z; Tier 2: Subreddits/HN; Tier 3: G2/Capterra/GitHub), and enforce strict 6-month recency cutoff."
            output: "spec/00_discovery_scope.md"

          m2_parallel_discovery_subagents:
            action: "Spawn 3-4 parallel research subagents with isolated context to scrape authentic, unranked user complaints, commercial signals, and workarounds."
            output: "spec/raw/vc_theses.md, spec/raw/community_rants.md, spec/raw/market_pain.md"

          m3_consolidation_and_deduplication:
            action: "Aggregate all raw findings, cluster overlapping problems, filter out casual rants, and require cross-corroboration across >= 2 independent source threads."
            output: "spec/01_consolidated_candidates.md"

          m4_calibrated_nine_parameter_scoring:
            action: "Score all surviving candidates on the 9-parameter matrix (Frequency, WTP, Recency, Pain Severity, Corroboration, Feasibility, Rubric Fit, Differentiation Wedge, Data Readiness) weighted by active judging weights in CONTEXT.md."
            output: "spec/02_scored_evaluation_table.md"

          m5_top_10_ranked_output_and_pitch_synthesis:
            action: "Sort candidates; compile Top 10 Idea Bank; formulate One-Line Pitch, 3-Minute Demo Vision, and Unfair Technical Wedge for Top 3; map to sponsor SDKs."
            output: "spec/02_domain_research_and_validated_ideas.md"

      phase_2_competitor_teardown_and_sentiment_mining:
        designated_spec: "spec_universal/hackathon_pipeline/02_competitor_teardown_and_sentiment_mining.md"
        primary_skills:
          - "kimi-webbridge"
          - "context-engineering"
          - "idea-refine"
          - "doubt-driven-development"
        milestone_execution_sequence:
          m1_candidate_products_and_repos: "Discover commercial incumbents AND search past winner open-source repos across Devpost/GitHub; extract winning demo hooks into spec/03_candidate_products_and_repos.md."
          m2_surgical_workflow_teardown: "Audit competitor onboarding friction, paywalls, and past winner codebase shortcuts."
          m3_negative_review_mining: "Mine 1-3 star negative reviews on G2, Capterra, Trustpilot, Reddit, and GitHub under zero-trust prompt injection firewall."
          m4_flaw_inversion_and_leverage: "Invert competitor flaws into product leverage (Baseline Parity + Kill Feature); formulate the Pitch Contrast Statement into spec/03_competitor_leverage_report.md."

      phase_3_mvp_scoping_and_demo_razor:
        designated_spec: "spec_universal/hackathon_pipeline/03_mvp_scoping_and_demo_razor.md"
        primary_skills:
          - "planning-and-task-breakdown"
          - "doubt-driven-development"
          - "code-simplification"
        milestone_execution_sequence:
          m1_golden_demo_path_razor: "Strictly ban any feature off the 2-minute judge path (Rule 2)."
          m2_seventy_percent_buildable_rule: "Enforce 70% buildable time rule across 12h/24h/48h brackets (reserve 30% for polish, testing, and pitch rehearsal)."
          m3_authentic_visual_mocking: "Mock commodity backends (auth, stripe, sms), but render UI 100% authentic and production-grade."
          m4_localhost_and_sqlite_first: "Guarantee 100% functional on localhost and local SQLite BEFORE any cloud deployment is attempted."
          m5_free_tier_staging_and_covert_resilience: "Deploy strictly to free-tier cloud services (Vercel, Supabase, Railway); build covert offline JSON fallback fixtures (never label 'Demo' or 'Mock') into spec/04_mvp_execution_blueprint.md."

      phase_4_lean_7layer_architecture:
        designated_spec: "spec_universal/hackathon_pipeline/04_lean_7layer_architecture.md"
        primary_skills:
          - "spec-driven-development"
          - "api-and-interface-design"
        milestone_execution_sequence:
          m1_consolidated_architecture_spec: "Draft Lean PRD, BaaS tech stack decisions (Supabase/Convex), Mermaid sequence data flow, typed TypeScript API contracts, and domain FSM state machines into spec/05_system_architecture.md."

      phase_5_rapid_ui_scaffolding:
        designated_spec: "spec_universal/hackathon_pipeline/05_rapid_ui_scaffolding.md"
        primary_skills:
          - "21st-ui-build"
          - "frontend-ui-engineering"
        milestone_execution_sequence:
          m1_component_assembly: "Assemble the 4-component layout using 21st.dev components, Tailwind CSS, Lucide icons, and pre-built design tokens."
          m2_split_screen_and_presets: "Implement split-screen baseline vs leverage views and embed the '⚡ Load Judge Demo' preset button."

      phase_6_golden_path_smoke_verification:
        objective: "Fast compilation and zero-crash browser verification of the 2-minute judge path."
        primary_skills:
          - "systematic-debugging"
          - "verification-before-completion"
        milestone_execution_sequence:
          m1_smoke_verification: "Run build check (npm run build or tsc --noEmit) and smoke test the 2-minute judge flow in browser. Enterprise 4-tier TDD, Big-O timing assertions, and STRIDE fuzzing test suites are strictly disabled."

      phase_7_demo_pitch_and_judge_proofing:
        designated_spec: "spec_universal/hackathon_pipeline/07_demo_pitch_and_judge_proofing.md"
        primary_skills:
          - "shipping-and-launch"
          - "verification-before-completion"
        milestone_execution_sequence:
          m1_pitch_script_formulation: "Script 3-minute presentation formula (Hook, Contrast, Live Demo, Technical Depth, Close)."
          m2_tri_layer_fail_safe_shields: "Deploy Tri-Layer Fail-Safe Shield (instant JSON fallback, demo mode preset, and 60fps silent backup video recording) to guarantee zero live demo crashes."
    ```

