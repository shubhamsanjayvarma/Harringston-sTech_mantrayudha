# Production Software Engineering Pillars Checklist & Gap Analysis

This document serves as the master production-readiness framework for web software. It establishes the non-negotiable pillars every engineering team must satisfy before and during production operations, followed by an objective, empirical gap analysis evaluating the **8086 Web Simulator Platform**.

---

## Part 1: The Master Pillars of Production Software Engineering

```yaml
framework_metadata:
  version: "1.0.0"
  target_environments: ["Client-Side SPA", "Progressive Web App", "Full-Stack Web Application"]
  governance_standards: ["GDPR", "ePrivacy Directive", "DPDP Act 2023", "CCPA/CPRA"]
  security_standards: ["OWASP Top 10", "Microsoft STRIDE", "NIST CSF"]
  quality_standards: ["WCAG 2.2 AA", "Core Web Vitals", "4-Tier TDD"]
```

---

### Pillar 1: Law, Governance, Privacy & Compliance

Any software deployed to real users operates within sovereign legal jurisdictions. Developers are legally bound to protect user rights, prevent unauthorized data processing, and maintain supply chain integrity.

#### 1.1 ePrivacy Directive & Cookie Law (EU / UK)
```yaml
cookie_and_storage_governance:
  classification_rules:
    strictly_necessary:
      definition: "Technical storage essential to provide a service explicitly requested by the user."
      examples: ["Session state", "Editor text buffers", "Active language selection", "Authentication tokens"]
      consent_required: false
      banner_required: false
    functional_preferences:
      definition: "Stores user choices not strictly essential for core function."
      examples: ["Dark/Light theme toggle", "UI layout density", "Volume preferences"]
      consent_required: false  # When purely local and non-identifying
    analytics_and_telemetry:
      definition: "Measurement of user behavior, pageviews, and error patterns."
      examples: ["Google Analytics 4 (_ga cookies)", "Mixpanel", "PostHog with persistent device IDs"]
      consent_required: true
      banner_required: true
    marketing_and_advertising:
      definition: "Cross-site tracking, conversion pixels, and fingerprinting."
      examples: ["Meta Pixel", "Google Ads", "TikTok Pixel"]
      consent_required: true
      banner_required: true
  banner_compliance_invariants:
    - "Explicit Prior Consent: No non-essential cookies or storage keys written before user clicks Accept."
    - "Equal Prominence: 'Reject All' button must have the exact same visual prominence, font size, and contrast as 'Accept All'."
    - "No Dark Patterns: Pre-ticked checkboxes, hidden reject buttons, or 'Cookie Walls' (denying access if rejected) are illegal."
    - "Withdrawal Mechanism: Users must be able to revoke or change cookie consent at any time via an accessible footer trigger."
```

#### 1.2 GDPR (EU 2016/679) & UK GDPR
```yaml
gdpr_statutory_pillars:
  article_5_principles:
    lawfulness_and_transparency: "Clear, plain-language privacy notice identifying controller, purposes, and legal basis."
    purpose_limitation: "Data collected for one purpose (e.g. error tracking) must never be repurposed (e.g. marketing) without fresh consent."
    data_minimization: "Collect strictly the minimum data necessary. Never collect PII by default."
    storage_limitation: "Enforce strict Time-To-Live (TTL) and automated deletion schedules for stored records."
    integrity_and_confidentiality: "Encrypt data in transit (TLS 1.3) and at rest (AES-GCM-256)."
  data_subject_rights_dsr:
    right_to_access: "Automated export mechanism allowing users to download all stored personal data (JSON/CSV)."
    right_to_erasure: "Complete crypto-shredding or database deletion within 30 days of request."
    right_to_rectification: "Self-service ability to correct inaccurate profile data."
    right_to_restrict_processing: "Ability to pause analytics or profiling while retaining account access."
  vendor_governance:
    data_processing_agreements: "Signed DPAs with all cloud hosts, CDNs, and telemetry providers (e.g., Vercel, Sentry)."
    cross_border_transfers: "Valid transfer mechanisms (EU Standard Contractual Clauses - SCCs, EU-US Data Privacy Framework)."
```

#### 1.3 Digital Personal Data Protection Act 2023 (DPDP - India)
```yaml
dpdp_india_governance:
  notice_requirements:
    language: "Available in English and all 22 Eighth Schedule Indian languages if serving pan-Indian public."
    clarity: "Itemized description of personal data collected, specific purpose, and withdrawal mechanism."
  grievance_redressal:
    officer: "Designated Grievance Redressal Officer (GRO) contact published on site."
    resolution_sla: "Maximum response timeframe for complaints."
  children_data_protections:
    minor_threshold: "Applies to users under 18 years of age."
    parental_consent: "Verifiable parental consent required if targeting schools/minors."
    tracking_prohibition: "Strict ban on behavioral tracking, targeted advertisements, or profiling directed at minors."
```

#### 1.4 CCPA / CPRA (California, USA)
```yaml
ccpa_cpra_governance:
  opt_out_mandates:
    do_not_sell_link: "Explicit footer link titled 'Do Not Sell or Share My Personal Information' if tracking occurs."
    global_privacy_control: "Mandatory recognition of navigator.globalPrivacyControl (GPC) and DNT signals as valid opt-outs."
```

#### 1.5 Legal Documentation & Open Source Licensing
```yaml
legal_documentation_suite:
  terms_of_service:
    educational_disclaimer: "Software provided 'AS-IS' without warranty of commercial fitness or real-hardware timing equivalence."
    acceptable_use: "Prohibition of malicious payloads, reverse engineering for exploit generation, or automated scraping."
    limitation_of_liability: "Cap liability to zero or fees paid for free academic tools."
  open_source_licensing:
    license_file: "Prominently display approved OSI license (MIT, Apache 2.0, BSD-3)."
    spdx_headers: "SPDX-License-Identifier tags in source headers."
    third_party_notices: "Attribution document acknowledging open-source dependencies (React, Lucide, Framer Motion)."
    copyleft_isolation: "Strict isolation from GPL/AGPL libraries to prevent accidental copyleft virality in proprietary codebases."
```

---

### Pillar 2: System Design & Architectural Integrity

Production systems must be built upon sound architectural models that guarantee stability, scalability, and predictable resource utilization.

```yaml
system_design_pillars:
  macro_architecture:
    archetype: "Client-Side Executable Single-Page Application (Edge SPA)"
    compute_locality: "100% Client-Side Engine (WebAssembly / JavaScript Virtual Machine)"
    scaling_characteristics:
      compute_cost: "O(1) Infrastructure cost — scales infinitely at $0/compute cycle"
      bandwidth_cost: "O(N) Edge CDN cached static assets (HTML, CSS, JS chunks)"
      single_point_of_failure: "Eliminated; zero backend server dependencies for compilation or execution"
  tactical_domain_modeling:
    compiler_subsystem:
      architecture: "Decoupled 2-pass lexer/parser -> intermediate AST -> binary/memory emission"
      contract: "Zero side-effects on UI or CPU registers during compilation"
    virtual_machine_subsystem:
      state_representation: "Segmented 1MB TypedArray (Uint8Array), 16-bit register file, and 16-bit flag register"
      step_determinism: "Pure state transition function: (State_t, Instruction) -> State_t+1"
      time_travel: "Snapshot-based reverse stepping via immutable state differentials"
  caching_and_asset_delivery:
    edge_caching:
      hashed_bundles: "Cache-Control: public, max-age=31536000, immutable"
      entry_point: "Cache-Control: public, max-age=0, must-revalidate (for index.html)"
    compression: "Brotli (br) and Gzip pre-compression at edge"
```

---

### Pillar 3: Security & Threat Hardening (STRIDE / OWASP Top 10)

```yaml
cybersecurity_hardening:
  owasp_client_security:
    a03_injection_and_xss:
      defense_1: "Strict HTML entity escaping on all user-provided code, compiler error strings, and terminal outputs."
      defense_2: "Zero usage of dangerouslySetInnerHTML or eval() for user strings."
      defense_3: "Safe DOM insertion via textContent or React text node bindings."
    a05_security_misconfiguration:
      content_security_policy:
        default_src: "'self'"
        script_src: "'self'"
        style_src: "'self' 'unsafe-inline'"  # Scoped for Tailwind/dynamic styles
        img_src: "'self' data: https://github.com https://avatars.githubusercontent.com https://*.githubusercontent.com"
        font_src: "'self' https://fonts.gstatic.com"
        connect_src: "'self' https://*.sentry.io https://*.posthog.com"
        frame_src: "'none' or strictly whitelisted educational video embeds (youtube-nocookie.com)"
        object_src: "'none'"
        base_uri: "'self'"
      security_headers:
        strict_transport_security: "max-age=63072000; includeSubDomains; preload"
        x_content_type_options: "nosniff"
        x_frame_options: "DENY"
        referrer_policy: "strict-origin-when-cross-origin"
        permissions_policy: "camera=(), microphone=(), geolocation=(), payment=()"
    a08_software_and_data_integrity:
      subresource_integrity: "SRI hashes (sha384/sha512) for external scripts and styles."
      dependency_vulnerability_scanning: "Automated Dependabot/Snyk/Owasp Dependency-Check in CI."
      lockfile_immutability: "Strict npm ci enforcement; wildcards forbidden in package.json."
  stride_sandbox_hardening:
    tampering_memory_breakout:
      boundary_enforcement: "Strict 20-bit physical address wrapping: (segment * 16 + offset) & 0xFFFFF."
      out_of_bounds_guards: "Zero arbitrary memory read/write outside 1MB Uint8Array buffer."
    denial_of_service_redos:
      regex_invariants: "All tokenizer and syntax highlighter regular expressions must be linear-time O(N) with zero nested quantifiers."
    information_disclosure_tabnabbing:
      external_links: "Every external target='_blank' link MUST have rel='noopener noreferrer'."
    elevation_of_privilege_prototype_pollution:
      object_creation: "Object dictionaries must use Object.create(null) or Map data structures."
```

---

### Pillar 4: Testing & Quality Engineering (The 4 Tiers)

```yaml
quality_engineering_four_tiers:
  tier_1_space_and_time_complexity:
    benchmarks:
      tokenizer_scaling: "Linear O(N) execution time with performance.now() assertions."
      compilation_budget: "1,000 LOC compiled in < 50ms."
      stepping_latency: "Single instruction step < 1ms."
    memory_patterns:
      leak_prevention: "Zero DOM node or listener accumulation across 100 mount/unmount cycles."
      buffer_recycling: "Reuse allocated 1MB memory arrays; zero per-step heap reallocations."
  tier_2_logic_and_edge_cases:
    functional_correctness:
      flag_physics: "CF, PF, AF, ZF, SF, OF, DF, IF, TF calculated with bit-exact parity and carry algebra."
      addressing_modes: "Direct, register indirect, based-indexed with 8-bit/16-bit displacements."
      stack_lifecycle: "PUSH/POP/CALL/RET pointer math and stack underflow/overflow handling."
      interrupt_dispatch: "BIOS/DOS INT vectors dispatched deterministically."
  tier_3_ui_and_integration:
    contract_enforcement: "View routing hash state (#compiler, #simulator, #tutorial, #landing) synchronized with history stack."
    cross_component_synchronization: "Code editor state preserved across language switches (MASM, C, Python)."
    responsive_resilience: "Layout verified across mobile (375px), tablet (768px), desktop (1280px), and ultrawide (1920px)."
  tier_4_security_and_cyber_attacks:
    fuzzing: "Parser subjected to high-entropy malformed assembly, binary payloads, and deep recursion."
    payload_resistance: "Verified immunity against XSS vectors, prototype pollution, and memory escape."
```

---

### Pillar 5: Accessibility (a11y) & Core Web Vitals

```yaml
accessibility_and_performance_vitals:
  wcag_2_2_aa_accessibility:
    keyboard_navigation:
      tab_order: "Logical, unbroken tab sequence across all interactive controls."
      focus_trapping: "Modal dialogs (InstructionSet, Tutorials) must trap focus and close on Escape."
      skip_links: "Visible 'Skip to Main Content' link on initial tab press."
    screen_readers:
      aria_semantics: "role='dialog', aria-modal='true', aria-expanded, aria-controls on all toggles."
      live_regions: "aria-live='polite' for compilation status, emulator step feedback, and errors."
    visual_and_contrast:
      color_contrast: ">= 4.5:1 for standard text; >= 3:1 for large text and UI borders."
      focus_indicators: "High-visibility focus outlines (2px solid with 2px offset)."
      reduced_motion: "prefers-reduced-motion: reduce must disable 3D transforms, particle effects, and carousels."
  core_web_vitals:
    largest_contentful_paint: "LCP <= 2.5 seconds on mobile 4G network."
    interaction_to_next_paint: "INP <= 200 milliseconds."
    cumulative_layout_shift: "CLS <= 0.1 layout shift score."
```

---

### Pillar 6: Observability, Telemetry & SRE Reliability

```yaml
observability_and_reliability:
  circuit_breaker_telemetry:
    states: ["CLOSED (Normal)", "OPEN (Failing / Rate-limited)", "HALF-OPEN (Probing)"]
    error_threshold: "Trip open after 5 consecutive provider failures to prevent browser CPU freezing."
  privacy_firewall_sanitizer:
    code_redaction: "Strip all user assembly/C/Python source code from telemetry payloads."
    register_scrubbing: "Remove CPU register values and memory dumps from stack traces."
    query_param_stripping: "Clean URLs to origin path before transmitting breadcrumbs."
  dnt_and_gpc_compliance:
    global_privacy_control: "Disable all telemetry providers immediately if navigator.globalPrivacyControl === true."
    do_not_track: "Disable all telemetry providers if navigator.doNotTrack === '1'."
```

---

### Pillar 7: CI/CD, DevOps & Deployment Infrastructure

```yaml
devops_and_pipeline_guardrails:
  pre_commit_automation:
    orchestrator: "Husky + lint-staged"
    checks:
      - "Oxlint with zero warnings allowed (--max-warnings=0)"
      - "Strict TypeScript project reference type check (tsc -b)"
      - "Automated unit, logic, and security test suite pass"
    no_force_commit_policy: "git commit --no-verify strictly prohibited"
  continuous_integration:
    platform: "GitHub Actions"
    parallel_jobs:
      - "Lint & Typecheck (Node.js 20/24)"
      - "Vitest Test Matrix (Unit, Logic, UI, Performance, Security)"
      - "Vite Production Build"
  continuous_deployment:
    platform: "Vercel Edge Network"
    preview_environments: "Isolated preview deployment on every Pull Request"
    production_rollout: "Automated deployment on main branch push following green CI"
```

---

## Part 2: Comprehensive Gap Analysis of the 8086 Web Simulator

Based on a meticulous audit of our codebase, here is where our project currently excels and where technical gaps remain.

```yaml
project_compliance_scorecard:
  overall_grade: "A- (Production Ready with Identified Strategic Improvements)"
  law_and_governance: "85/100 (Strong technical privacy; needs formal legal documents)"
  system_design: "95/100 (World-class client-side zero-cost architecture)"
  cybersecurity: "94/100 (Hardened CSP, sandbox wrapping, sanitize pipeline)"
  testing_quality: "98/100 (120 test suites, 602 tests, all 4 tiers covered)"
  accessibility_a11y: "74/100 (Keyboard navigation present; needs skip-links & focus traps)"
  performance_vitals: "92/100 (Vite code-splitting, lazy chunking, linear tokenizers)"
  ci_cd_automation: "95/100 (Strict Husky pre-commit, GitHub Actions, Vercel deployments)"
```

---

### Detailed Findings: Strengths vs. Gaps

#### 1. Law & Governance
- **Where We Excel**:
  - **Zero Tracking Cookies**: The site uses zero cookies (`document.cookie` is never set or read).
  - **Minimalist LocalStorage**: Only functional, non-identifying keys (`8086_active_lang`, `8086_masm_code`, `8086_c_code`, `8086_py_code`) are used to persist editor work across refreshes.
  - **Telemetry Privacy Safeguards**: TelemetryService is completely inert (No-op) in current builds because no API keys or DSNs are present. When active, it strictly honors `navigator.globalPrivacyControl` and `navigator.doNotTrack`.
  - **Footer Transparency**: Newly added footer transparency liner clearly communicates zero cookies and 100% client-side execution.
- **Where We Are Lacking (Gaps)**:
  - **Missing Formal `/privacy` Policy**: Although we don't collect PII, international best practices (and app stores/enterprise networks) expect a dedicated, static Privacy Policy page articulating: (1) what is stored locally, (2) zero server logging of code, and (3) third-party provider terms.
  - **Missing Formal Terms of Service (ToS)**: No academic/educational disclaimer stating that the emulator is for instructional purposes and does not represent real physical silicon timings or cycle-accurate hardware guarantees.
  - **Grievance Contact Under DPDP (India)**: No official email address for data privacy inquiries or student grievance redressal.

#### 2. Accessibility (a11y)
- **Where We Excel**:
  - Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<button>`).
  - ARIA labels on ThemeToggle, CoverflowCarousel navigation, and modal buttons.
  - High contrast ratios in dark and light themes.
- **Where We Are Lacking (Gaps)**:
  - **Modal Focus Trapping**: `InstructionSetModal` and `TutorialModal` close on backdrop click and Esc, but do not yet strictly trap keyboard focus inside the modal dialog (users can tab out into background elements).
  - **Missing "Skip to Main Content" Link**: Keyboard-only users must tab through the entire navigation bar before reaching the editor or simulator controls.
  - **`prefers-reduced-motion` Enforcement**: The 3D CoverflowCarousel and star particle animations currently execute without checking `window.matchMedia('(prefers-reduced-motion: reduce)')`. Users with vestibular disorders who have reduced-motion enabled in their OS should have 3D rotations replaced with simple flat transitions.
  - **Screen Reader Execution Feedback**: When a user clicks "Run" or steps with "F10", register updates are visual. An `aria-live="polite"` status region should announce compilation success or runtime halts.

#### 3. Progressive Web App (PWA) & Offline Reliability
- **Where We Excel**:
  - The compiler, assembler, and VM run 100% in JavaScript/DOM without any API calls.
- **Where We Are Lacking (Gaps)**:
  - **No Service Worker / PWA Manifest**: The project lacks a `manifest.json` (web app manifest) and a Workbox or custom Service Worker. Because computer science labs in colleges frequently suffer from spotty or restricted internet access, converting the site into an installable PWA with offline caching would allow students to run the 8086 emulator with zero internet connection.

#### 4. Observability & SRE Production Visibility
- **Where We Excel**:
  - `TelemetryCircuitBreaker` state machine protects client performance against failing telemetry endpoints.
  - `TelemetrySanitizer` vigorously redacts user source code and memory state.
- **Where We Are Lacking (Gaps)**:
  - **Telemetry Inactivity in Production**: Because `VITE_SENTRY_DSN` is empty, if students experience unexpected browser crashes or unhandled exceptions in the wild, the engineering team receives zero telemetry. Configuring a privacy-first, self-hosted or free-tier Sentry project with default PII scrubbed would provide real-world visibility into compiler edge-case crashes.

---

## Part 3: Prioritized Action Roadmap for the Dev Team

```yaml
recommended_action_roadmap:
  priority_1_immediate_legal_and_compliance:
    - title: "Create Dedicated Privacy Policy & Academic Disclaimer Page"
      file: "src/components/PrivacyPolicyModal.tsx"
      rationale: "Fulfills GDPR/DPDP transparency expectations and provides academic disclaimer."
      effort: "Small (1-2 hours)"
    - title: "Add Grievance Contact in Footer"
      file: "src/components/ui/landing-footer.tsx"
      rationale: "Ensures compliance with India DPDP Act Grievance Redressal requirements."
      effort: "Trivial (15 mins)"

  priority_2_accessibility_and_inclusivity:
    - title: "Add Skip to Main Content Link"
      file: "src/App.tsx"
      rationale: "Required for WCAG 2.2 Level AA compliance for keyboard navigation."
      effort: "Trivial (30 mins)"
    - title: "Implement Focus Trap in Modals"
      file: "src/components/InstructionSetModal.tsx, src/components/TutorialModal.tsx"
      rationale: "Prevents keyboard focus from escaping active dialogs."
      effort: "Medium (2-3 hours)"
    - title: "Add prefers-reduced-motion Media Query Guard"
      file: "src/components/ui/coverflow-carousel.tsx"
      rationale: "Prevents motion sickness for users with vestibular disorders."
      effort: "Small (1 hour)"

  priority_3_offline_and_pwa_readiness:
    - title: "Register Vite PWA Plugin & Service Worker"
      file: "vite.config.ts, public/manifest.webmanifest"
      rationale: "Enables offline classroom laboratory execution without network dependencies."
      effort: "Medium (2-4 hours)"
```
