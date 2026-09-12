# Project Rules

Please add your custom instructions for this project below.

1. Think Before Coding
   Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask. 2. Simplicity First
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

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
   Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

5. Graphify as Primary Knowledge Base
   STRICTLY avoid raw grepping and searching through the codebase. Instead, ALWAYS use Graphify as your primary source of codebase knowledge. Always use the knowledge graph in all cases unless there is an explicit need to refer to a particular code snippet directly.
   Furthermore:

- Every implementation plan MUST explicitly start the search phase with Graphify.
- At the end of implementation, when changes are made, the plan MUST explicitly mention updating the Graphify knowledge graph.

6. Specifications Format
   All specs must ONLY use the `.md` extension and the file structure when cross 3rd degree nesting should be then made into yaml format.

7. Structure and Features Detailing
   During the detailed explanation of features and when creating structures, ALWAYS use YAML instead of JSON.

8. Strict Test-Driven Development (TDD), Testing Template & Security
   Before writing, changing, or touching even a single line of code, you MUST create a proper plan for implementation.
   All plans and procedures must adhere to "TEST DRIVEN DEVELOPMENT" and COMPULSORILY follow `spec_universal/tdd_4tier_testing_template.md`.
   Every implementation or general plan MUST explicitly include all 4 categories of testing defined in `spec_universal/tdd_4tier_testing_template.md`:
   - **Type 1: Space & Time Complexity Testing** (Big-O scaling, strict performance upper-bounds using `performance.now()`, memory allocation patterns, and DoS resilience).
   - **Type 2: Logic Testing** (Functional correctness, state transitions, domain-specific operations/semantics, edge cases, zero-division, invalid operands).
   - **Type 3: UI & Integration Testing** (End-to-end workflows, component lifecycle, contract enforcement, theme toggle, responsive layout, and DOM node leak prevention).
   - **Type 4: QA & Security Testing (STRIDE / OWASP Top 10)** (Threat modeling: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege, XSS/injection sanitization, parser fuzzing, and sandbox memory boundary verification).
     For cyber attack test scripts, refer to the STRIDE framework, OWASP Top 10, and other established frameworks. Do not accumulate the explanations of these frameworks in this file to avoid context rot; instead, utilize the `cyber-security-frameworks` skill.

9. Error Logging, Incident Telemetry & Continuous Learning (`.agents/rules/CONTEXT.md`)
   Whenever you make a mistake, break a build, or encounter an error/regression during execution, you MUST immediately log the incident in `.agents/rules/CONTEXT.md` under `incident_telemetry_records`.
   - **Strict YAML Incident Schema**: Informal tables or vague summaries are strictly forbidden. Every incident entry must adhere to the structured YAML schema (Incident ID, ISO-8601 timestamp, severity level, category taxonomy, exact error signature, triggering operation, underlying mechanism, untested assumption, immediate surgical fix, regression test created, and preventive rule/guardrail).
   - **Centralized Permanent Memory**: `.agents/rules/CONTEXT.md` is the centralized, permanent project memory: you MUST record and maintain the core mechanisms, product philosophy, design DNA, visual standards, and critical operational notes specific to this project within `.agents/rules/CONTEXT.md`. Because it resides in `.agents/rules/`, it is automatically injected into context on every session, ensuring continuous, project-wide awareness without polluting `AGENTS.md`.

10. Pre-Commit Hooks and Automation
    Whenever possible and structurally applicable, you MUST include a plan and scripts for pre-commit hooks (e.g., using Husky or native Git hooks). These hooks should automate our guardrails, testing, and formatting to ensure no code is permanently committed without passing the established validation and security checks.

11. No Force Commits
    Under absolutely no circumstances should you ever use force commits (e.g., `git commit --no-verify`, `git push --force`) to bypass the pre-commit hooks or automated tests. If a commit is failing, the underlying code or test MUST be fixed before proceeding. If a pre-commit hook fails, you MUST stop, create a clear solving plan to address the failure, and then try again. Bypassing guardrails is strictly forbidden.

12. No Vague Plans (Strict Adherence to Structure & 4 Testing Types)
    Whenever making an implementation plan or a detailed architectural spec, you MUST NOT make a vague or generic plan. You must strictly follow the required structure, particularly Rules #5, #8, and `spec_universal/tdd_4tier_testing_template.md`. Every single plan document must independently and explicitly include its own Graphify Search/Update phases, Guardrails, and ALL 4 categories of testing (Space/Time Complexity, Logic Testing, UI/Integration Testing, and STRIDE/OWASP Security Testing). Creating a separate, generic "testing" file instead of embedding these 4 testing sections into the specific component plans is a violation of this rule.

13. Strict Pre-Commit Hook Standards
    Whenever setting up or modifying pre-commit hooks, you MUST configure them with maximum strictness. NEVER write generic or weak hooks. You must ensure that the hooks proactively block commits by strictly checking types (e.g., `tsc --noEmit`), enforcing zero-tolerance linting (e.g., `--max-warnings=0`), and comprehensively running all associated test suites (including unit, integration, and security tests). Do not assume basic validation is enough; enforce the highest code quality standards directly in the automation pipeline.

16. Template Literal Escaping Error
    When writing TypeScript or JavaScript code using \write_to_file\, NEVER escape the dollar sign in template literals (e.g. use \${}, NOT \\${}). Doing so causes a PARSE_ERROR (Invalid Unicode escape sequence) in parsers like oxc.

18. CI vs Local Performance Thresholds
    When writing time or space complexity performance tests using `performance.now()` bounds, NEVER assume that CI runners (like GitHub Actions) execute as fast as the local environment. Always set generous upper-bounds (e.g., 3x-5x local speeds) for `toBeLessThan` assertions and Vitest timeout durations to prevent flaky CI pipelines.

19. Oxlint `eslint-disable` Comment Placement
    When attempting to bypass a linter warning in `oxlint` (e.g., `react-hooks/exhaustive-deps`), the `// eslint-disable-next-line` directive MUST be placed on the exact line immediately preceding the target code structure (like the dependency array closing bracket `}, []);`). Placing it above a regular code comment will cause oxlint to ignore the directive and fail the build.

20. Feature Branch & PR Workflow (The Safety Net)
    NEVER develop new features or tests directly on the `main` branch.
    - **Local Isolation:** Always create a new branch (e.g., `feat/ui-updates`) for your work. If the code breaks irreparably or a massive conflict occurs locally, simply delete the branch and reset to `main`.
    - **Remote PRs:** When ready, push the branch and open a Pull Request. Never push directly to `main`.
    - **Reverting:** If an issue is discovered _after_ merging to `main`, do not attempt to manually track and revert individual scattered commits via the terminal. Instead, track the issue to the specific PR and use GitHub's 1-click "Revert Pull Request" feature to cleanly undo the entire feature block at once.

21. Kimi WebBridge React Textarea Injection
    When filling highly controlled React components (like the main code editor) via Kimi WebBridge, the native fill command may fail with an Uncaught exception. If this happens, ALWAYS use the evaluate action with the nativeInputValueSetter and dispatch an input event to securely set the value, rather than failing or asking for help.

23. Unused Default React Imports under Strict JSX Runtime
    When writing or refactoring React components in projects configured with modern JSX transform (`"jsx": "react-jsx"`) and strict TypeScript (`noUnusedLocals: true`), NEVER add default `import React from "react"` unless explicitly referencing `React.*` properties. Unused default imports trigger compiler error TS6133 and fail pre-commit hooks.

24. Mandatory Cybersecurity, Performance, Structural Integrity & Efficiency Standards
    Whenever any code is written, modified, or refactored, the following four pillars MUST be strictly preserved and accompanied by dedicated automated verification scripts:
    - **Cybersecurity & Threat Hardening**: All inputs, memory accesses, parser outputs, and state transformations must be hardened against adversarial exploits (e.g., prototype pollution, XSS/injection, ReDoS, memory sandbox breakout, and STRIDE/OWASP vulnerabilities). Dedicated security test scripts (e.g., `tests/security/*.security.test.*` or `*.stride.test.*`) MUST be written to actively attempt adversarial attacks against the code.
    - **Performance & Computational Efficiency**: Code must be architected for minimal execution time and optimal space complexity (e.g., avoiding unnecessary re-renders, redundant allocations, unindexed lookups, or unmemoized computations). Performance test scripts (e.g., `tests/performance/*.perf.test.*`) with strict execution time upper-bounds (`performance.now()`) and memory stability checks MUST be written to verify efficiency.
    - **Structural Integrity & Clean Architecture**: Follow strict separation of concerns, modular contracts, consistent typing, and predictable data flow. Integration and contract tests MUST enforce that component boundaries, state immutability, and module interfaces remain intact.
    - **Zero Speculative Bloat / Lean Code**: Keep code concise, readable, and focused strictly on the user's requirements without over-abstraction or dead code.

25. Multi-Subagent Adversarial Plan Review & Trajectory-Wide Hardening
    For all major, architectural, or lengthy implementation tasks, the initial draft of the implementation plan MUST undergo rigorous adversarial self-criticism before presenting it for approval or writing any code:
    - **Multi-Perspective Scrutiny via Subagents**: Spawn dedicated subagents (e.g., Security & Vulnerability Auditor, Architectural & Logic Critic, Performance Bounds Reviewer) to independently stress-test the draft plan, uncover loopholes, find unhandled edge cases, and challenge assumptions.
    - **Trajectory-Wide Remediation**: Any discovered flaws, vulnerabilities, or weak points MUST NOT be deferred as "fixes at the end" or post-implementation patches. They MUST be directly resolved and integrated throughout the entire milestone-by-milestone trajectory of the implementation plan itself.
    - **Fortified Final Submission**: Only after the plan has been adversarially critiqued, fortified, and all discovered loopholes systematically patched across every milestone should the finalized implementation plan be presented for user review.

26. Automated PR Lifecycle via GitHub CLI (`gh`)
    Whenever creating, managing, or merging Pull Requests, ALWAYS use the GitHub CLI (`gh pr create`, `gh pr merge`, etc.) directly from the terminal rather than requesting manual web UI steps from the user. Ensure the PR title, body summary, base branch (`main`), and head branch are clearly specified, and proceed with automated PR creation and merging where structurally appropriate.

27. System Design Specification Routing & Anti-Context Bloat
    When designing architectures or writing implementation plans, NEVER dump, view, or inject all 7 system design specification files into context simultaneously. Doing so triggers severe context bloat and degrades reasoning.
    Instead, ALWAYS consult [`spec_universal/system_design/00_system_design_routing_and_navigation_guide.md`](spec_universal/system_design/00_system_design_routing_and_navigation_guide.md) to route precisely to the relevant layer and section based on the current planning phase or requirement:
    - **Phase 1: Requirements & Capacity Estimation** $\to$ Refer to `01_non_negotiable_rules_and_principles.md` (Section 8: QPS, ELU, Storage Multiplier, DAWS Cache RAM; Section 9: SPOF; Section 10: SRE SLI/SLO/SLA & Latency Budgeting).
    - **Phase 2: Macro Architecture & Archetype Selection** $\to$ Refer to `04_system_archetypes_and_decision_matrices.md` (Section 1: Monolith vs Microservices vs Serverless; Section 2: The 7 System Archetypes; Section 3.1 & 3.5: Database & Storage Selection Matrix; Section 3.2: Communication Protocols).
    - **Phase 3: High-Level Ingress, Networking & Data Tier** $\to$ Refer to `02_high_level_design_and_distributed_systems.md` (Section 2: Sharding & Hotspot Salting; Section 4: Caching Hierarchies & XFetch; Section 8: Outbox, CDC & Sagas; Section 9: Keyset Pagination with DNF & Deprecation; Section 10: Proxies, DNS, CDN; Section 11: Stateless Autoscaling).
    - **Phase 4: Low-Level Domain Modeling, Indexing & Concurrency** $\to$ Refer to `03_low_level_design_and_object_oriented_architecture.md` (Section 1: Tactical DDD & Aggregate Root Laws; Section 3.3: HikariCP DB Pool Physics; Section 4: Scoped Context Lifecycle; Section 6: Secondary Indexing Write Amplification & Covering Indexes).
    - **Phase 5: Observability, Telemetry & SRE Alerting** $\to$ Refer to `06_observability_telemetry_and_reliability_engineering.md` (Section 2: Multi-Burn-Rate Alerting with Low-QPS PromQL Guards; Section 3: RED/USE Methods; Section 4: Distributed Tracing & Kafka SpanLinks; Section 7: 3-Tier Health Probes).
    - **Phase 6: Deployment Topology, Disaster Recovery, Governance & FinOps** $\to$ Refer to `07_deployment_operations_governance_and_finops.md` (Section 1: Blue/Green DDL Lock Defense, Canary ACA, Rolling preStop 15s, Shadow Sandboxing, Feature Flags; Section 2: 4 DR Tiers & 3rd-Region Witness Quorum; Section 3: cgroups CFS Math & S3 Break-Even; Section 4: Merkle Audit Logs & GDPR Crypto-Shredding).
    - **Phase 7: Verification & TDD Test Harness Formulation** $\to$ Refer to `05_system_design_verification_and_testing_playbook.md` (All 4 Categories: Type 1 Complexity, Type 2 Logic, Type 3 Chaos, Type 4 STRIDE/OWASP).
      For specific technical requirements, use the Quick-Lookup Table in `00_system_design_routing_and_navigation_guide.md` and view only the targeted line slices needed for the task.

28. Explicit User Authorization for Commits and Pull Requests
    NEVER commit changes, create pull requests, or merge pull requests autonomously. You MUST ONLY commit or perform Git PR lifecycle actions (staging, committing, pushing, opening PRs, or merging PRs) when the USER explicitly instructs you to do so. Until explicit direction is given, keep all modifications strictly in the local working directory for review.

29. Strict Closure Matching for Component Wrappers (`React.memo` / HOCs)
    When refactoring a functional component declaration to wrap it in `React.memo` or a higher-order component (e.g., `export const ComponentName = memo(function ComponentName(...) { ... });`), ALWAYS verify that the closing parenthesis `});` matches the opening wrapper. Missing closing parentheses cause abrupt `[PARSE_ERROR] Expected ')' but found 'EOF'` errors in Vite/oxc transforms and fail test pipelines.

30. Full Scope Verification Before Pruning State Variables
    When refactoring components or removing dead code/helper functions, NEVER delete or omit top-level destructured variables (e.g. `changedFlags`, `busActivity`) without thoroughly searching the entire JSX tree for references. Even if a helper function is neutralized, the variable may still be referenced in conditional styles or sub-components, leading to runtime `ReferenceError` crashes during rendering.

31. Mandatory Skill Attribution in Implementation Plans & Execution
    Whenever creating an implementation plan or defining execution steps, you MUST explicitly identify and name the specific available skill(s) (from the `<skills>` catalog) to be used for each phase, milestone, or task during execution:
    - **Explicit Skill Mapping in Plans**: Every phase, component task, or verification workflow in `implementation_plan.md` must state the exact designated skill (e.g., `using-agent-skills`, `test-driven-development` for test creation, `frontend-ui-engineering` or `21st-ui-build` for UI implementation, `cyber-security-frameworks` or `security-and-hardening` for STRIDE/OWASP hardening, `performance-optimization` for benchmarks, `debugging-and-error-recovery` or `systematic-debugging` for bug triage, `code-review-and-quality` before finalizing, `git-workflow-and-versioning` or `ci-cd-and-automation` for delivery).
    - **Execution by Designated Skill**: During execution, the agent must activate and strictly follow the procedural guidelines of the assigned skill rather than improvising generic, unstandardized workflows.
    - **Zero Unattributed Steps**: Generic plans with tasks that lack explicit skill attribution violate this rule and must be rejected during plan formulation.

33. Strict File Extensions for JSX Test Suites
    When creating or editing test files that render React components or contain JSX elements (e.g. `<Component />`), ALWAYS use the `.tsx` file extension. Using `.ts` causes Vite/oxc parser failures because `<` is treated as a generic type argument.

34. Never Push `.agents/AGENTS.md`
    Under absolutely no circumstances should `.agents/AGENTS.md` ever be staged, committed, or pushed to the remote repository. It is a strictly local agent instruction file. Always keep all modifications to `.agents/AGENTS.md` confined to your local working directory.

35. Universal Specifications (`spec_universal/`) vs. Project-Specific Specifications (`spec/`)
    All specifications, PRDs, architecture plans, and task plans must strictly follow this directory separation and lifecycle rule:
    - **`spec_universal/` (Immutable Foundation)**: Houses universal, project-agnostic architecture guidelines, templates, system design layer specifications (`00_` to `07_`), testing playbooks, and PRD templates. These files are shared standards applicable across all projects. **`spec_universal/` MUST NOT be altered, edited, or modified during the course of any project unless the user specifically and explicitly instructs to do so.**
    - **`spec/` (Project-Specific & Push-Allowed)**: Reserved strictly for **project-specific** documentation. All PRDs, technical stack specifications, feature implementation task plans, and architecture documents created specifically for this repository must be saved within `spec/`. Unlike `.agents/AGENTS.md` (which is strictly local), documents and artifacts in the `spec/` folder **are allowed to be staged, committed, and pushed** to the repository when authorized.

36. Development Lifecycle Phase-to-Spec Routing Matrix, Living Document Duty & Embedded TDD Invariant
    Whenever working on any stage of project development, the agent must NEVER perform speculative reading or dump arbitrary folders into context. Instead, route deterministically using the following specification matrix.
    
    - **Autonomous Duty to Prepare and Maintain Documents**: It is the agent's explicit, proactive duty to prepare, maintain, and synchronize these documents throughout the project lifecycle, even without explicit user prompting. Anchor documents must be prepared during project initialization, while Living documents must be continuously updated in real-time alongside code changes, schema migrations, and architectural decisions.
    
    ```yaml
    lifecycle_specification_matrix:
      phase_1_product_definition:
        document: "01. Product Requirements Document (PRD)"
        lifecycle_type: "ANCHOR"
        characteristics: "High inertia; frozen for V1 release; defines user problem, goals, non-goals, FRs, acceptance criteria."
        designated_spec_bundle:
          - "spec_universal/project_architecture_initialization.md (Section 3)"
          - "spec_universal/universal_prd_and_task_plan_requirements.md"
          - "spec_universal/product_requirements_document_template.md"
        output_target: "spec/prd.md"

      phase_2_tech_stack_selection:
        document: "02. Technical Design & ADRs"
        lifecycle_type: "LIVING"
        characteristics: "Baseline stack set early; Architecture Decision Records appended continuously as choices evolve."
        designated_spec_bundle:
          - "spec_universal/project_architecture_initialization.md (Section 4)"
          - "spec_universal/tech_stack_prd_template.md"
          - "spec_universal/system_design/04_system_archetypes_and_decision_matrices.md"
        output_target:
          baseline: "spec/tech_stack.md"
          adrs: "spec/adr/*.md"

      phase_3_macro_system_architecture:
        document: "High-Level Design (HLD)"
        lifecycle_type: "LIVING"
        characteristics: "Capacity math (QPS, storage, RAM), data tier sharding, caching tiers, outbox, SPOF audits."
        designated_spec_bundle:
          - "spec_universal/system_design/01_non_negotiable_rules_and_principles.md (Sections 8, 9, 10)"
          - "spec_universal/system_design/02_high_level_design_and_distributed_systems.md"
        output_target: "spec/hld_architecture.md"

      phase_4_user_journeys_and_state:
        document: "03. App Flow & State Map"
        lifecycle_type: "LIVING"
        characteristics: "Expands screen-by-screen across all 6 UI states (Ideal, Loading, Empty, Validation, Error, Offline), route guards, redirects."
        designated_spec_bundle:
          - "spec_universal/project_architecture_initialization.md (Section 5)"
        output_target: "spec/app_flow_and_state_map.md"

      phase_5_visual_system_design:
        document: "04. UI/UX Design Brief"
        lifecycle_type: "ANCHOR"
        characteristics: "Visual tokens (colors, typography, spacing, radii, shadows) and WCAG 2.2 AA accessibility contracts."
        designated_spec_bundle:
          - "spec_universal/project_architecture_initialization.md (Section 6)"
        tools_and_skills:
          - "motionsites (art direction & motion prompts)"
          - "21st-ui-build / 21st-* (component code & design sync)"
        output_target: "spec/ui_ux_design_brief.md"

      phase_6_domain_modeling_persistence:
        document: "05. Backend Design & Data Model"
        lifecycle_type: "LIVING"
        characteristics: "Tactical DDD (aggregates, entities, value objects), relational schemas, indexes, pool math, RBAC/ABAC matrix."
        designated_spec_bundle:
          - "spec_universal/project_architecture_initialization.md (Section 7)"
          - "spec_universal/system_design/03_low_level_design_and_object_oriented_architecture.md"
        output_target:
          design: "spec/backend_design_and_data_model.md"
          code: "migrations/*"

      phase_7_task_breakdown_milestones:
        document: "06. Engineering Implementation Plan"
        lifecycle_type: "LIVING"
        characteristics: "Dependency-ordered tasks; thin vertical slice first, incremental milestones, rollback plans."
        designated_spec_bundle:
          - "spec_universal/project_architecture_initialization.md (Section 8)"
          - "spec_universal/universal_prd_and_task_plan_requirements.md (Task Plan Spec)"
        output_target: "spec/implementation_plan.md"

      phase_8_production_operations_sre:
        document: "Operations, Telemetry & SRE"
        lifecycle_type: "LIVING"
        characteristics: "Multi-burn-rate alerts, RED/USE metrics, W3C traceparent, 3-tier health probes, zero-502 rolling deploys, FinOps, GDPR."
        designated_spec_bundle:
          - "spec_universal/system_design/06_observability_telemetry_and_reliability_engineering.md"
          - "spec_universal/system_design/07_deployment_operations_governance_and_finops.md"
          - "spec_universal/production_software_engineering_pillars_and_gap_analysis.md"
        output_target: "ci_cd_workflows_and_telemetry"

      cross_phase_standards:
        document: "07. Authoritative References & Standards"
        lifecycle_type: "ANCHOR"
        characteristics: "OWASP ASVS, W3C WCAG 2.2, Azure Well-Architected, Microsoft patterns, Agile Manifesto."
        designated_spec_bundle:
          - "spec_universal/project_architecture_initialization.md (Section 9)"
        output_target: "permanent_reference_baseline"

    embedded_tdd_invariant:
      mandate: "TDD is NOT a standalone downstream phase; it is an embedded pre-requisite gate in EVERY code or task execution."
      pre_code_inspection_bundle:
        - "spec_universal/tdd_4tier_testing_template.md"
        - "spec_universal/system_design/05_system_design_verification_and_testing_playbook.md"
      mandatory_4_tiers:
        type_1: "Space & Time Complexity (Big-O scaling, performance.now() upper bounds, memory stability)"
        type_2: "Logic & State Transitions (nominal flows, domain invariants, edge cases, error conditions)"
        type_3: "UI, Contract & Integration Chaos (component lifecycle, route guards, theme toggle, DOM leak checks)"
        type_4: "STRIDE / OWASP Top 10 Security (IDOR cross-user checks, XSS/injection sanitization, auth tamper)"
      execution_rule: "Red-Green-Refactor: tests MUST be written and fail before touching any implementation code."
      telemetry_rule: "Any regression or failure MUST be logged in .agents/rules/CONTEXT.md."

    post_code_dead_code_sweep:
      timing: "MANDATORY intermediate phase: immediately after code is written/modified, and strictly BEFORE executing tests or linter checks."
      assigned_skills:
        - "code-simplification"
        - "code-review-and-quality"
      mandate: "Actively search for, detect, and eliminate all dead code, unused imports, orphaned types, and temporary helper stubs caused directly or indirectly by the changes."
      protocol:
        1_orphan_import_and_variable_sweep: "Strip any unused imports, variables, constants, or types made redundant by new code (prevents strict TS6133 failures)."
        2_full_scope_jsx_and_hook_verification: "Per Rule 30, before pruning any destructured variable or helper, search the complete JSX tree, hooks, and styles to guarantee no remaining runtime references."
        3_abandoned_code_and_scratch_removal: "Remove all temporary console logs, scratch functions, unreached conditional branches, and commented-out experiments."
        4_surgical_boundary: "Touch only your own mess per Rule 3. Do not prune unrelated pre-existing code unless explicitly instructed."
    ```