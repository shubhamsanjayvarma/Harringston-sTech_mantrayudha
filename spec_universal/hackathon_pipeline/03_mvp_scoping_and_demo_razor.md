# Phase 3: MVP Scoping, Triaging & Golden Demo Razor Specification

> **File:** `spec_universal/hackathon_pipeline/03_mvp_scoping_and_demo_razor.md`  
> **Parent Protocol:** `00_master_hackathon_operating_system.md`  
> **Format Standard:** Strict Hybrid YAML Architecture (Rule 6 & Rule 7)  
> **Prerequisite Input:** `spec/03_candidate_products_and_repos.md` & `spec/03_competitor_leverage_report.md` (Phase 2 Deliverables)  
> **Execution Engine:** Analytical pruning + time-boxed prioritization + covert demo hardening  

---

## 🎯 Objective & Core Invariants

Phase 3 transforms the competitive leverage blueprint into a strictly time-budgeted, fail-safe MVP build contract, eliminating all commodity development, mandating authentic visual mocks, enforcing localhost/SQLite-first validation before free-tier cloud deployment, and covertly demo-proofing the 2-minute judge path.

```yaml
phase_specification:
  phase_id: "PHASE_03_MVP_SCOPING_AND_DEMO_RAZOR"
  mission: "Freeze P0/P1 scope under the 70% buildable time rule, ban non-demo features via the Golden Demo Path Razor, mandate authentic visual mocking for auth and payments, enforce localhost/SQLite-first architecture prior to free-tier cloud staging, and construct covert offline anti-crash shields in spec/04_mvp_execution_blueprint.md."
  core_scoping_invariants:
    1_the_70_percent_rule: "Coding is strictly capped at 70% of total hackathon hours; remaining 30% is permanently reserved for testing, polish, and pitch rehearsal."
    2_the_golden_demo_razor: "If an element does not sit directly on the 2-minute live judging path, building it is strictly prohibited."
    3_authentic_visual_mocking: "Auth and payment gateways are hardcoded on the backend, but their frontend interfaces must appear 100% authentic, polished, and production-ready."
    4_localhost_sqlite_first: "The entire application must be 100% functional on localhost and local SQLite before any cloud deployment is initiated."
    5_free_tier_only_cloud_staging: "All external deployment targets (Vercel, Supabase, Railway/Render) must strictly utilize free service quotas with zero paid dependencies."
    6_covert_demo_resilience: "Demo presets and offline fallback caches must never be labeled as 'Demo', 'Mock', or 'Sample'—they must present as authentic enterprise scenarios."
```

---

## 📋 Milestone Execution Contracts (Strict Hybrid YAML)

### Milestone 1: Time-Budget Mapping & Capacity Sizing (The 70% Buildable Rule)

```yaml
milestone:
  milestone_id: "M1_time_budget_and_capacity_sizing"
  phase_name: "Time-Budget Mapping & Capacity Sizing"
  objective: "Quantify total competition hours into exact buildable and buffer allocations, establishing hard capacity bounds to prevent scope creep."
  designated_skills:
    - "planning-and-task-breakdown"
    - "doubt-driven-development"

  input_contracts:
    prerequisite_files:
      - "spec/[hackathon_name]_brief.md"
      - "spec/03_competitor_leverage_report.md"
    required_context: "Official hackathon duration and schedule deadlines from Phase 1 reconnaissance"

  autonomous_execution_steps:
    1_extract_total_duration: "Extract total competition hours from spec/[hackathon_name]_brief.md and assign target operational bracket."
    2_apply_bracket_classification:
      bracket_a_extreme_sprint:
        duration_range: "12 - 18 Hours"
        feature_capacity: "1 Core Baseline Workflow + 1 Leverage Kill Feature only"
        ui_footprint: "Single-page dashboard, pre-built 21st.dev components, static mock secondary tabs"
      bracket_b_standard_hackathon:
        duration_range: "24 - 36 Hours"
        feature_capacity: "2 Core Baseline Workflows + 1-2 Leverage Features + Live Interactive State"
        ui_footprint: "Multi-view application with interactive filters, live toast notifications, and dark mode"
      bracket_c_extended_competition:
        duration_range: "48+ Hours"
        feature_capacity: "Full Baseline Parity on primary modules + multi-point leverage + real-time sync"
        ui_footprint: "Complete responsive web application with multi-device preview"
    3_compute_time_allocations:
      buildable_coding_hours: "Total Hackathon Hours * 0.70 (Strict coding ceiling)"
      reserved_buffer_hours: "Total Hackathon Hours * 0.30 (Reserved strictly for automated testing, bug triage, polish, and pitch defense)"
    4_initialize_execution_blueprint: "Create spec/04_mvp_execution_blueprint.md with calculated capacity bounds and time-budget constraints."

  output_artifacts:
    primary_target: "spec/04_mvp_execution_blueprint.md"
    schema_definition: |
      time_budget_and_capacity:
        total_competition_hours: "number"
        target_bracket: "BRACKET_A | BRACKET_B | BRACKET_C"
        maximum_buildable_coding_hours: "number (70%)"
        reserved_testing_and_pitch_hours: "number (30%)"
        hard_code_freeze_timestamp_iso: "ISO-8601 string"

  validation_gate:
    exit_criteria:
      - "spec/04_mvp_execution_blueprint.md exists with mathematical capacity bounds."
      - "Buildable hours strictly equals total hours * 0.70."
      - "30% buffer explicitly accounted for."
```

---

### Milestone 2: The "Golden Demo Path" Razor (Rule 2 Invariant)

```yaml
milestone:
  milestone_id: "M2_golden_demo_path_razor"
  phase_name: "The Golden Demo Path Razor & Minute-by-Minute Scripting"
  objective: "Script the precise, linear 2-minute user journey presented to judges, strictly banning any feature, route, or setting not on this direct path."
  designated_skills:
    - "planning-and-task-breakdown"
    - "doubt-driven-development"
    - "code-simplification"

  input_contracts:
    prerequisite_files:
      - "spec/03_competitor_leverage_report.md"
    required_context: "Baseline Parity requirements and Leverage Kill Features from Phase 2"

  autonomous_execution_steps:
    1_script_the_2_minute_judge_flow:
      minute_0_to_1:
        narrative: "Establish the problem hook and demonstrate table-stakes capability matching the incumbent."
        user_interaction: "User lands on clean, professional UI, loads pre-seeded target input, and triggers baseline analysis."
        expected_system_state: "Instant response (<1s) rendering structured baseline results."
      minute_1_to_2:
        narrative: "Trigger the Leverage Kill Feature—the decisive unfair advantage that solves the incumbent's hated flaw."
        user_interaction: "User triggers our primary differentiator (e.g. 1-click automated fix, local-first export, zero-config translation)."
        expected_system_state: "Visual progress state transitioning into transformed high-value output ('Aha!' moment)."
      minute_2_to_3:
        narrative: "Verify the result, display technical depth/architecture, and execute instant clean export."
        user_interaction: "User inspects verified output and triggers export (JSON, Markdown, or direct sync)."
        expected_system_state: "Success toast and verified output preview displayed."
    2_apply_the_razor_cut: "Conduct exhaustive audit of all brainstormed ideas; aggressively prune any button, route, settings tab, or configuration panel not visited during Minutes 0-3."
    3_curate_demo_input_payloads: "Define 2 pre-tested, deterministic input payloads guaranteed to showcase maximum system capability without triggering latency or edge cases."

  output_artifacts:
    primary_target: "spec/04_mvp_execution_blueprint.md"
    schema_definition: |
      golden_demo_path:
        minute_0_to_1_hook_and_parity:
          user_action: "string"
          visible_ui: "string"
          expected_latency_ms: "number (<1000)"
        minute_1_to_2_leverage_kill_moment:
          user_action: "string"
          visible_ui: "string"
          hero_aha_moment: "string"
        minute_2_to_3_verification_and_export:
          user_action: "string"
          visible_ui: "string"
          export_output_format: "string"
        pruned_features_banned_by_razor:
          - feature_name: "string"
            rationale: "Off the 2-minute judge path"
        deterministic_demo_payloads:
          primary_scenario:
            input_data: "string or object"
            expected_output_highlight: "string"
          secondary_backup_scenario:
            input_data: "string or object"
            expected_output_highlight: "string"

  validation_gate:
    exit_criteria:
      - "Golden demo path is mapped minute-by-minute with exact user interactions and expected UI states."
      - "All features not on the 2-minute path are explicitly cataloged in pruned_features_banned_by_razor."
      - "Deterministic demo payloads documented."
```

---

### Milestone 3: 3-Tier Feature Triaging & Authentic Visual Mocking

```yaml
milestone:
  milestone_id: "M3_feature_triaging_and_authentic_mocking"
  phase_name: "3-Tier Feature Triaging & Authentic Visual Mocking"
  objective: "Categorize all planned functionality into P0 Core, P1 Fast-Follows, and P2 Strategic Mocks, ensuring mocked auth/billing appears 100% real and production-grade in the UI."
  designated_skills:
    - "planning-and-task-breakdown"
    - "frontend-ui-engineering"
    - "doubt-driven-development"

  input_contracts:
    prerequisite_files:
      - "spec/04_mvp_execution_blueprint.md"
    required_context: "Golden demo path and capacity limits established in Milestones 1 and 2"

  autonomous_execution_steps:
    1_triage_p0_core_engine:
      rule: "Must be 100% functional, real application logic, and verified via smoke testing (clean build + zero-crash demo walkthrough)."
      components:
        - "1 Essential Baseline Workflow (table-stakes incumbent capability)"
        - "1-2 Leverage Kill Features (flaw inverters)"
      budget_percentage: 60

    2_triage_p1_fast_follows:
      rule: "Build ONLY IF P0 core engine smoke test passes with >30% remaining buildable time; otherwise discard immediately."
      components:
        - "Export to Markdown / PDF / CSV"
        - "Keyboard navigation shortcuts or dark/light theme switch"
        - "Secondary analytical charts or telemetry cards"
      budget_percentage: 15

    3_triage_p2_authentic_visual_mocks:
      rule: "Strictly banned from custom backend coding. Mock backend persistence and auth state while rendering authentic, visually indistinguishable UI elements."
      user_authentication:
        backend_strategy: "Hardcode active session: `currentUser = { name: 'Dr. Evelyn Reed', role: 'Lead Auditor', email: 'e.reed@acme-corp.com', avatar: 'https://images.unsplash.com/...' }`"
        frontend_ui: "Render authentic profile avatar chip, enterprise workspace switcher, and realistic sign-in/switch-user modal."
      payment_and_billing:
        backend_strategy: "Hardcode active subscription state: `accountStatus = { tier: 'Enterprise Plan', status: 'Active', renewal: '2027-01-01' }`"
        frontend_ui: "Render polished 'Enterprise Tier' badge, feature access locks (all unlocked for demo), and clean billing summary card."
      email_and_sms_verification:
        backend_strategy: "Log verification tokens directly to server stdout or mock in-memory bus."
        frontend_ui: "Display high-polish in-app success toast: 'Verification email sent to registered enterprise domain'."
      multi_tenant_rbac:
        backend_strategy: "Flat single-tenant SQLite database table."
        frontend_ui: "Display multi-role dropdown selector with realistic enterprise titles."

  output_artifacts:
    primary_target: "spec/04_mvp_execution_blueprint.md"
    schema_definition: |
      feature_triage_matrix:
        p0_core_engine_features:
          - feature_name: "string"
            layer: "BASELINE_PARITY | LEVERAGE_KILL_FEATURE"
            verification_criterion: "string"
        p1_fast_follow_candidates:
          - feature_name: "string"
            drop_condition: "Drop if buildable time < 30%"
        p2_authentic_visual_mocks:
          authentication:
            hardcoded_session_data: "object"
            ui_components_to_render: ["string"]
          billing_and_payments:
            hardcoded_tier_state: "object"
            ui_components_to_render: ["string"]
          notifications_and_emails:
            mock_strategy: "In-app toast"
          multi_tenancy:
            database_structure: "Single-tenant local SQLite"

  validation_gate:
    exit_criteria:
      - "P0 features clearly separated from P1 and P2."
      - "Zero custom OAuth or Stripe gateway logic scheduled for development."
      - "All mocked systems have concrete authentic UI component specifications defined."
```

---

### Milestone 4: Local-First SQLite Architecture & Free-Tier Cloud Staging

```yaml
milestone:
  milestone_id: "M4_local_first_and_free_cloud_staging"
  phase_name: "Local-First SQLite Architecture & Free-Tier Cloud Staging Strategy"
  objective: "Enforce strict localhost and SQLite-first completion before cloud migration, establishing zero-cost deployment blueprints using exclusively free-tier service quotas."
  designated_skills:
    - "api-and-interface-design"
    - "ci-cd-and-automation"
    - "doubt-driven-development"

  input_contracts:
    prerequisite_files:
      - "spec/04_mvp_execution_blueprint.md"
    required_context: "Feature triage matrix and backend requirements from Milestone 3"

  autonomous_execution_steps:
    1_localhost_sqlite_first_mandate:
      invariant: "Cloud deployment is strictly locked until localhost is 100% functional."
      execution_rules:
        - "Step 1: Build database schemas and queries on local SQLite (`data/app.db`)."
        - "Step 2: Run backend server on `http://localhost:8000` (or `3001`)."
        - "Step 3: Run frontend on `http://localhost:5173` (Vite)."
        - "Step 4: Verify the entire Golden Demo Path end-to-end on localhost."
        - "Step 5: Run automated test suite; only when 100% green is cloud staging permitted."

    2_free_tier_cloud_deployment_blueprint:
      zero_cost_axiom: "Always use ONLY free service tiers; zero credit cards or paid quotas required."
      frontend_hosting:
        provider: "Vercel Free Tier (Hobby)"
        configuration: "Direct GitHub integration, standard Vite/Next build command, automatic preview deployments"
      database_persistence:
        primary_cloud_target: "Supabase Free Tier (Managed PostgreSQL)"
        sqlite_fallback_target: "Railway Persistent Volume / Render Disk or in-memory SQLite"
        schema_portability: "Maintain DDL scripts that cleanly run on both local SQLite and PostgreSQL via clean ORM / raw SQL abstraction (e.g. Prisma / Drizzle / Kysely)"
      backend_web_service:
        primary_cloud_target: "Railway Free Tier or Render Free Tier (Web Service)"
        configuration: "Docker container or native Node/Python buildpack, environment variables injected via CLI/dashboard"

    3_cloud_cutover_verification_gate:
      rule: "Cloud deployment is a presentation convenience, NOT an execution dependency. If cloud deployment experiences DNS delays or deployment queues, immediately revert presentation to localhost."

  output_artifacts:
    primary_target: "spec/04_mvp_execution_blueprint.md"
    schema_definition: |
      deployment_and_staging_strategy:
        local_first_invariants:
          database_engine: "SQLite (local file: data/app.db)"
          local_api_endpoint: "http://localhost:8000"
          local_frontend_endpoint: "http://localhost:5173"
          cloud_migration_precondition: "100% passing automated test suite on localhost"
        free_tier_cloud_stack:
          frontend:
            platform: "Vercel"
            plan: "Free / Hobby"
          backend:
            platform: "Railway OR Render"
            plan: "Free Tier Web Service"
          database:
            platform: "Supabase"
            plan: "Free Tier PostgreSQL (500MB storage, 2 projects)"
          cost_footprint: "$0.00 (Zero paid service dependencies)"
        instant_presentation_fallback: "Present on localhost:5173 if cloud deployment exhibits latency or rate limits"

  validation_gate:
    exit_criteria:
      - "Localhost SQLite-first development order is explicitly codified as an unskippable prerequisite."
      - "All designated cloud platforms are verified 100% free tier (Vercel, Supabase, Railway/Render)."
      - "Localhost fallback protocol established for the live pitch."
```

---

### Milestone 5: Covert Demo-Proofing & Anti-Crash Offline Fallback

```yaml
milestone:
  milestone_id: "M5_covert_demo_proofing_and_offline_shield"
  phase_name: "Covert Demo-Proofing & Anti-Crash Offline Fallback"
  objective: "Architect invisible offline fallback caches and authentic scenario selectors—strictly avoiding 'Demo' or 'Mock' labels—to guarantee zero live crashes during judging."
  designated_skills:
    - "frontend-ui-engineering"
    - "api-and-interface-design"
    - "verification-before-completion"

  input_contracts:
    prerequisite_files:
      - "spec/04_mvp_execution_blueprint.md"
    required_context: "Golden demo path and API integration contracts"

  autonomous_execution_steps:
    1_covert_unlabeled_demo_mode:
      labeling_ban: "NEVER use labels like 'Demo', 'Mock', 'Sample Data', or 'Fake' in UI buttons, banners, or tooltips."
      authentic_selector_designs:
        option_a_enterprise_case_studies: "Render a realistic workspace dropdown: 'Acme Global Logistics (Case Study)', 'Starlight Financial Audit', or 'Northwind Medical Records'."
        option_b_quick_start_templates: "Render standard production action: '⚡ Quick-Start Scenario: High-Volume Ingestion' or 'Load Compliance Benchmark Dataset'."
        option_c_covert_url_param: "Provide hidden query parameter: `?scenario=enterprise_verified` to pre-seed inputs seamlessly without visible UI toggles."

    2_deterministic_json_fallback_shield:
      rule: "Every external API, LLM call, or web scraper route must be shielded with an offline cache wrapper."
      implementation_pattern:
        timeout_bound_ms: 6000
        cache_location: "src/mock/offline_resilience_fixtures.json"
        behavior: "If external API exceeds 6000ms, returns HTTP 429 (Rate Limit), or throws a network drop (ERR_INTERNET_DISCONNECTED), silently return the cached authentic response without throwing an unhandled UI error."
        user_feedback: "Render normal success UI with realistic processing indicators; never show 'Fallback triggered' or 'Mock data loaded' alerts."

    3_compile_and_freeze_blueprint: "Consolidate all 5 milestones into the final, authoritative spec/04_mvp_execution_blueprint.md and update project knowledge graph."

  output_artifacts:
    primary_target: "spec/04_mvp_execution_blueprint.md"
    schema_definition: |
      covert_demo_shield_specification:
        unlabeled_scenario_selection:
          ui_component_type: "Case Study Dropdown | Quick-Start Template Card | Query Param"
          production_labels:
            - "Enterprise Case Study: Acme Corp"
            - "Standard Compliance Audit Dataset"
            - "High-Concurrency Benchmark Stream"
          forbidden_labels: ["Demo", "Mock", "Sample", "Test Data", "Fake"]
        offline_fallback_fixtures:
          timeout_threshold_ms: 6000
          fixture_file_path: "src/mock/offline_resilience_fixtures.json"
          shielded_endpoints:
            - endpoint: "string"
              cached_fixture_key: "string"
        pitch_readiness_status: "READY_FOR_PHASE_04_ARCHITECTURE"

  validation_gate:
    exit_criteria:
      - "Zero 'Demo' or 'Mock' labels permitted in UI specifications."
      - "Offline JSON fallback strategy documented with 6000ms timeout threshold."
      - "spec/04_mvp_execution_blueprint.md fully populated and frozen."
      - "Ready for Phase 4: Lean 7-Layer Architecture."
```

---

## 🔒 Verification & Anti-Bloat Guardrails

```yaml
anti_bloat_and_execution_guardrails:
  the_70_percent_cap:
    enforcement: "Any PRD or architecture expanding beyond 70% buildable time is automatically rejected."
  the_no_cloud_blocker_rule:
    enforcement: "If cloud deployment takes >20 minutes to debug, cancel deployment and present 100% on localhost."
  zero_paid_services_invariant:
    enforcement: "Reject any tool, database, or API requiring a paid credit card subscription."
  unlabeled_demo_integrity:
    enforcement: "Audit UI code during Phase 5 to ensure string 'Demo' or 'Mock' does not appear in user-facing views."
```
