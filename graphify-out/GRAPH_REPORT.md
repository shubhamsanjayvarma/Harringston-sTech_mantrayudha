# Graph Report - MantraYudha - Harringstons Tech  (2026-10-03)

## Corpus Check
- 135 files · ~314,051 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2105 nodes · 3587 edges · 133 communities (124 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `239d8a55`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- live-browser.js
- handleManualEditActivity
- modern-screenshot.umd.js
- startVariantObserver
- setLiveState
- App.tsx
- initPageChat
- mountSvelteComponentVariant
- el
- captureElementToBlob
- renderDesignVisual
- resumeSession
- devDependencies
- Code Review and Quality
- Security and Hardening
- Test-Driven Development
- cleanup
- Git Workflow and Versioning
- Responsive Design
- Browser Testing with DevTools
- Shipping and Launch
- API and Interface Design
- CI/CD and Automation
- Frontend UI Engineering
- What You Must Do When Invoked
- Context Engineering
- Deprecation and Migration
- onboard.md
- Incremental Implementation
- Code Simplification
- Debugging and Error Recovery
- Product Requirements Document (PRD)
- new-work.md
- init
- compilerOptions
- Documentation and ADRs
- The Toolkit
- Performance Optimization
- ReOrder: Keep Your Regulars Ordering Direct
- handleInsertCreate
- createLiveBrowserSessionState
- Interview Me
- Planning and Task Breakdown
- createLiveBrowserDomHelpers
- Doubt-Driven Development
- AGENTS.md
- animate.md
- live.md
- Handle `generate`
- Idea Refine
- Tech Stack PRD Template
- Generate Report
- impeccable/SKILL.md
- Process
- Using Agent Skills
- README.md
- New visual work
- optimize.md
- Scan mode (approach C: auto-extract, then confirm descriptive language)
- Spec-Driven Development
- 📋 The Unified Architecture Specification Template
- Refinement & Evaluation Criteria
- Universal Documentation & Task Plan Requirements
- spec/README.md
- critique.md
- Simplify the Design
- Hardening Dimensions
- Project Architecture Initialization & Six-Document System Playbook
- Source-Driven Development
- clarify.md
- The Surgical Knowledge Merge Protocol
- Nielsen's 10 Heuristics
- Generate Combined Critique Report
- document.md
- polish.md
- quieter.md
- Phase 5: Rapid UI Scaffolding & Component Assembly Specification
- Init flow
- 🏆 Hackathon_Boilerplate
- syncEditBadgeHitProxies
- 3. Milestones & Task Breakdown
- 📋 Milestone Execution Contracts (Strict Hybrid YAML)
- 📋 Milestone Execution Contracts (Strict Hybrid YAML)
- 📋 Milestone Execution Contracts (Strict Hybrid YAML)
- Ideation Frameworks Reference
- Hackathon Speedrun Verification Template — Reusable Agent Instructions
- Common Cognitive Load Violations
- Hackathon Speedrun System Architecture Guide
- iOS platform
- Operate mode depth (and Read notes)
- Shape
- Phase 7: Demo Pitch, Storyboarding & Judge-Proofing Specification
- Project Context, Core Philosophy, Design DNA & Incident Telemetry
- graphify reference: extra exports and benchmark
- adapt.native.md
- Android platform
- colorize.md
- Persona-Based Design Testing
- doctor.md
- Extract Flow
- live-setup.md
- Generate Report
- Cognitive Load Assessment
- Impeccable Asset Producer
- Impeccable Finish Reviewer
- Impeccable Manual Edit Applier
- live-browser-ignores.js
- evaluate_command
- graphify reference: query, path, explain
- Diagnostic Scan
- bolder.md
- $impeccable hooks
- Visualize: Direction Comps & Asset Production
- impeccable
- Phase 6: Golden-Path Smoke Verification Specification
- Impeccable Documenter
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- Heuristics Scoring Guide
- 01. NovaMart Hackathon Wedge & 2-Minute Demo Script
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- extraction-spec.md
- idea-refine.sh
- workflows/graphify.md
- pre-commit
- Universal Frontend Design Bible & Anti-Slop Architectural Standard

## God Nodes (most connected - your core abstractions)
1. `setLiveState()` - 32 edges
2. `resumeSession()` - 32 edges
3. `connectSSE()` - 31 edges
4. `showToast()` - 30 edges
5. `el()` - 29 edges
6. `initGlobalBar()` - 29 edges
7. `handleKeyDown()` - 27 edges
8. `buildInsertConfigureRow()` - 26 edges
9. `injectSvelteComponentsFromManifest()` - 26 edges
10. `cleanup()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `enableInlineEdit()` --indirect_call--> `own()`  [INFERRED]
  .agents/skills/impeccable/scripts/live-browser.js → .agents/skills/impeccable/scripts/live-browser-dom.js
- `layoutFlowChildren()` --indirect_call--> `pickable()`  [INFERRED]
  .agents/skills/impeccable/scripts/live-browser.js → .agents/skills/impeccable/scripts/live-browser-dom.js
- `AccountDrawerProps` --references--> `DeliveryLocation`  [EXTRACTED]
  frontend/src/components/AccountDrawer.tsx → frontend/src/types/index.ts
- `CartDrawerProps` --references--> `DeliveryLocation`  [EXTRACTED]
  frontend/src/components/CartDrawer.tsx → frontend/src/types/index.ts
- `LocationModalProps` --references--> `DeliveryLocation`  [EXTRACTED]
  frontend/src/components/LocationModal.tsx → frontend/src/types/index.ts

## Import Cycles
- None detected.

## Communities (133 total, 9 thin omitted)

### Community 0 - "live-browser.js"
Cohesion: 0.06
Nodes (64): applyEditing(), applyGlobalBarLabelState(), applyParamDefaults(), applyParamValue(), applyPlaceholderDimensions(), applyPlaceholderSizingStyles(), attachSteerFocusGuard(), buildLocatorForLeaf() (+56 more)

### Community 1 - "handleManualEditActivity"
Cohesion: 0.06
Nodes (58): addManualContextText(), canRestoreManualEditElement(), clearStoredManualApplyState(), collectEditableTextRows(), visit(), collectManualContextPieces(), walk(), contextElementForManualEdit() (+50 more)

### Community 2 - "modern-screenshot.umd.js"
Cohesion: 0.09
Nodes (55): ae(), be(), bt(), Ce(), s(), Ct(), de(), dt() (+47 more)

### Community 3 - "startVariantObserver"
Cohesion: 0.09
Nodes (52): applyConfigureBarChrome(), buildCyclingRow(), buildSavingRow(), closedClipPath(), closeTunePopover(), commitAcceptedVariantToDom(), completeParameterGenerationIfReady(), completeParameterPublication() (+44 more)

### Community 4 - "setLiveState"
Cohesion: 0.11
Nodes (49): beginNewLiveConfiguration(), buildPickedAnchorSnapshot(), cancelEditing(), cancelEditingToPicking(), cancelInsertConfigure(), clearAnnotations(), clearInsertPicking(), disableInlineEdit() (+41 more)

### Community 5 - "App.tsx"
Cohesion: 0.09
Nodes (29): App(), AccountDrawer(), AccountDrawerProps, AnnouncementBar(), CartDrawer(), CartDrawerProps, CategoryNav(), CategoryNavProps (+21 more)

### Community 6 - "initPageChat"
Cohesion: 0.09
Nodes (46): armPageChatForTyping(), attachSteerFocusDebug(), buildSteerProcessingDots(), buildSteerQueueHint(), clearSteerAwaitTimer(), collapsePageChat(), configureVoiceContext(), expandPageChat() (+38 more)

### Community 7 - "mountSvelteComponentVariant"
Cohesion: 0.07
Nodes (44): acceptedDomAlreadyClean(), applyOriginalAttrsToSvelteAnchor(), buildSvelteExpressionTextMap(), buildSveltePropValuesFromLiveElement(), buildSveltePropValuesV2(), clearHandledWrapperReloadStamp(), cloneWithoutElements(), collectTextNodes() (+36 more)

### Community 8 - "el"
Cohesion: 0.09
Nodes (41): actionLabel(), bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl(), buildConfigureCountControl(), buildConfigureRow(), buildConfigureSubmitButton() (+33 more)

### Community 9 - "captureElementToBlob"
Cohesion: 0.07
Nodes (40): averageRgb01(), beginEditPin(), bufferToBase64(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), captureChromeNodes(), captureElementFromRenderedAncestor() (+32 more)

### Community 10 - "renderDesignVisual"
Cohesion: 0.07
Nodes (40): buildCollapsible(), buildColorModels(), buildDesignHeader(), buildListHtml(), buildRadiiModels(), buildTypographyModels(), copyToClipboard(), cssSafe() (+32 more)

### Community 11 - "resumeSession"
Cohesion: 0.10
Nodes (39): abandonForeignSession(), applySavedSessionMeta(), clampVariantIndex(), connectSSE(), discardOrphanedSession(), enterRecoveryWaitingForAnchor(), findActiveSessionSummary(), findAdoptableServerSession() (+31 more)

### Community 12 - "devDependencies"
Cohesion: 0.05
Nodes (38): autoprefixer, clsx, dependencies, clsx, lucide-react, react, react-dom, tailwind-merge (+30 more)

### Community 13 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 14 - "Security and Hardening"
Cohesion: 0.07
Nodes (29): Always Do (No Exceptions), Ask First (Requires Human Approval), Broken Access Control, Broken Authentication, Common Rationalizations, Cross-Site Scripting (XSS), File Upload Safety, Injection (SQL, NoSQL, OS Command) (+21 more)

### Community 15 - "Test-Driven Development"
Cohesion: 0.07
Nodes (28): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Name Tests Descriptively, One Assertion Per Concept, Overview, Prefer Real Implementations Over Mocks (+20 more)

### Community 16 - "cleanup"
Cohesion: 0.13
Nodes (28): abortSvelteComponentInjection(), cleanup(), cleanupAcceptedSession(), clearHandled(), clearMountErrorCard(), clearScrollY(), clearSession(), discardedWrappers() (+20 more)

### Community 17 - "Git Workflow and Versioning"
Cohesion: 0.07
Nodes (26): 1. Commit Early, Commit Often, 2. Atomic Commits, 3. Descriptive Messages, 4. Keep Concerns Separate, 5. Size Your Changes, Branch Naming, Branching Strategy, Change Summaries (+18 more)

### Community 18 - "Responsive Design"
Cohesion: 0.08
Nodes (25): Assess Adaptation Challenge, Breakpoints: Content-Driven, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Detect Input Method, Not Just Screen Size, Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Patterns (+17 more)

### Community 19 - "Browser Testing with DevTools"
Cohesion: 0.08
Nodes (24): Accessibility Verification with DevTools, Available Tools, Browser Testing with DevTools, Clean Console Standard, Common Rationalizations, Console Analysis Patterns, Content Boundary Markers, For Network Issues (+16 more)

### Community 20 - "Shipping and Launch"
Cohesion: 0.08
Nodes (24): Accessibility, Code Quality, Common Rationalizations, Documentation, Error Reporting, Feature Flag Strategy, Infrastructure, Monitoring and Observability (+16 more)

### Community 21 - "API and Interface Design"
Cohesion: 0.08
Nodes (23): 1. Contract First, 2. Consistent Error Semantics, 3. Validate at Boundaries, 4. Prefer Addition Over Modification, 5. Predictable Naming, API and Interface Design, Common Rationalizations, Core Principles (+15 more)

### Community 22 - "CI/CD and Automation"
Cohesion: 0.08
Nodes (23): Automation Beyond CI, Basic CI Pipeline, Build Cop Role, CI/CD and Automation, CI Optimization, Common Rationalizations, Dependabot / Renovate, Deployment Strategies (+15 more)

### Community 23 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (23): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+15 more)

### Community 24 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 25 - "Context Engineering"
Cohesion: 0.09
Nodes (22): Anti-Patterns, Common Rationalizations, Confusion Management, Context Engineering, Context Packing Strategies, Level 1: Rules Files, Level 2: Specs and Architecture, Level 3: Relevant Source Files (+14 more)

### Community 26 - "Deprecation and Migration"
Cohesion: 0.09
Nodes (22): Adapter Pattern, Code Is a Liability, Common Rationalizations, Compulsory vs Advisory Deprecation, Core Principles, Deprecation and Migration, Deprecation Planning Starts at Design Time, Feature Flag Migration (+14 more)

### Community 27 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 28 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 29 - "Code Simplification"
Cohesion: 0.09
Nodes (21): 1. Preserve Behavior Exactly, 2. Follow Project Conventions, 3. Prefer Clarity Over Cleverness, 4. Maintain Balance, 5. Scope to What Changed, Code Simplification, Common Rationalizations, Language-Specific Guidance (+13 more)

### Community 30 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 31 - "Product Requirements Document (PRD)"
Cohesion: 0.12
Nodes (15): 10. Assumptions & Constraints, 11. Dependencies, 12. Risks & Open Questions, 13. Timeline / Milestones, 14. Appendix, 1. Title & Summary, 2. Problem Statement, 3. Goals & Success Metrics (+7 more)

### Community 32 - "new-work.md"
Cohesion: 0.13
Nodes (14): Recommended Actions, Craft (deprecated alias), Apply, Live-mode signature params, Set the spatial thesis, Two isolated assessments, Verify, Visitor mode (+6 more)

### Community 33 - "init"
Cohesion: 0.15
Nodes (21): agentHasWorkInFlight(), agentStatusText(), barPaletteForTheme(), brandMarkSvg(), buildParamsPanel(), designPanelCss(), detectPageTheme(), ensureAgentPollTooltip() (+13 more)

### Community 34 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+13 more)

### Community 35 - "Documentation and ADRs"
Cohesion: 0.10
Nodes (20): ADR Lifecycle, ADR Template, API Documentation, Architecture Decision Records (ADRs), Changelog Maintenance, Common Rationalizations, Document Known Gotchas, Documentation and ADRs (+12 more)

### Community 36 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 37 - "Performance Optimization"
Cohesion: 0.10
Nodes (20): Common Rationalizations, Core Web Vitals Targets, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Overview, Performance Budget (+12 more)

### Community 38 - "ReOrder: Keep Your Regulars Ordering Direct"
Cohesion: 0.11
Nodes (17): Example 1: Vague Early-Stage Concept (Full 3-Phase Session), Example 2: Feature Idea Within an Existing Product (Codebase-Aware), Example 3: Process/Workflow Idea (Non-Product), Ideation Session Examples, Key Assumptions to Validate, MVP Scope, Not Doing (and Why), Open Questions (+9 more)

### Community 39 - "handleInsertCreate"
Cohesion: 0.12
Nodes (16): buildInsertPlaceholderSnapshotFromDom(), captureAndEmit(), checkpointPayload(), compileShader(), extractContext(), handleInsertCreate(), maybePrefetchPage(), reportVariantMounted() (+8 more)

### Community 40 - "createLiveBrowserSessionState"
Cohesion: 0.21
Nodes (15): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+7 more)

### Community 41 - "Interview Me"
Cohesion: 0.11
Nodes (17): Common Rationalizations, Example, Interaction with Other Skills, Interview Me, Loading Constraints, Output, Overview, Red Flags (+9 more)

### Community 42 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (17): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+9 more)

### Community 43 - "createLiveBrowserDomHelpers"
Cohesion: 0.16
Nodes (11): createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable(), rectIsUsableAnchor(), uiAppend() (+3 more)

### Community 44 - "Doubt-Driven Development"
Cohesion: 0.12
Nodes (15): Common Rationalizations, Cross-model escalation, Doubt-Driven Development, Interaction with Other Skills, Loading Constraints, Overview, Red Flags, Step 1: CLAIM — Surface what stands (+7 more)

### Community 46 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 47 - "live.md"
Cohesion: 0.12
Nodes (15): Cleanup, Exit, First-time setup, Handle `accept`, Handle `discard`, Handle fallback, Handle `manual_edit_apply`, Handle `prefetch` (+7 more)

### Community 48 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0-4 per variant), 8. Signal done (+8 more)

### Community 49 - "Idea Refine"
Cohesion: 0.13
Nodes (14): Anti-patterns to Avoid, Detailed Instructions, How It Works, Idea Refine, Output, Phase 1: Understand & Expand (Divergent), Phase 2: Evaluate & Converge, Phase 3: Sharpen & Ship (+6 more)

### Community 50 - "Tech Stack PRD Template"
Cohesion: 0.14
Nodes (13): 10. Alternatives Rejected (Decision Log), 11. Open Questions / Risks, 12. Research Log, 1. Overview, 2. Selection Criteria, 3. Research Checklist, 4. Language & Runtime, 5. Package / Dependency Manager (+5 more)

### Community 51 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Implementation Integrity (CRITICAL), Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+6 more)

### Community 52 - "impeccable/SKILL.md"
Cohesion: 0.15
Nodes (10): Craft floor, Refuse, Verify, Command guidance, No-argument routing: the context-aware menu, Workflow questions, Commands, How to design (+2 more)

### Community 53 - "Process"
Cohesion: 0.13
Nodes (14): 1. Define "working" before instrumenting, 2. Pick the right signal for each question, 3. Structured logging, 4. Metrics, 5. Distributed tracing, 6. Alerting, 7. Verify the telemetry itself, Common Rationalizations (+6 more)

### Community 54 - "Using Agent Skills"
Cohesion: 0.13
Nodes (14): 1. Surface Assumptions, 2. Manage Confusion Actively, 3. Push Back When Warranted, 4. Enforce Simplicity, 5. Maintain Scope Discipline, 6. Verify, Don't Assume, Core Operating Behaviors, Failure Modes to Avoid (+6 more)

### Community 55 - "README.md"
Cohesion: 0.15
Nodes (10): Master Hackathon Operating System & Speedrun Protocol, 🛡️ Non-Negotiable Operational Invariants, ⚡ The 7-Phase Hackathon Operating Pipeline, 🧭 Time-Budget Brackets & Execution Velocity, 🎯 Objective & Intake Modes, Phase 1: Idea Discovery, Validation & Scoring Specification, 🔒 Security & Anti-Evasion Guardrails, 🏆 Hackathon Operating System & Speedrun Framework (+2 more)

### Community 56 - "New visual work"
Cohesion: 0.14
Nodes (14): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Both paths (+6 more)

### Community 57 - "optimize.md"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP < 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 58 - "Scan mode (approach C: auto-extract, then confirm descriptive language)"
Cohesion: 0.15
Nodes (13): Component translation rules, Narrative mapping, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Step 1: Find the design assets, Step 2: Auto-extract what can be auto-extracted, Step 2b: Stage the frontmatter, Step 3: Ask the user for qualitative language (+5 more)

### Community 59 - "Spec-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Keeping the Spec Alive, Overview, Phase 1: Specify, Phase 2: Plan, Phase 3: Tasks, Phase 4: Implement, Red Flags (+4 more)

### Community 60 - "📋 The Unified Architecture Specification Template"
Cohesion: 0.15
Nodes (12): 🎯 Objective, Phase 4: Lean 7-Layer Architecture & Specification Suite, Section 1: Lean Product Requirements (PRD), Section 2: Technology Stack & ADR, Section 3: Macro Architecture & Typed API Contracts, Section 4: Domain Model & State Transitions, Section 5: Smoke Verification & Demo Reliability Plan, Section 6: Demo Telemetry & Visual SRE (+4 more)

### Community 61 - "Refinement & Evaluation Criteria"
Cohesion: 0.17
Nodes (11): 1. User Value, 2. Feasibility, 3. Differentiation, Assumption Audit, Core Evaluation Dimensions, Decision Framework, Might Be True (Nice to Have), Must Be True (Dealbreakers) (+3 more)

### Community 62 - "Universal Documentation & Task Plan Requirements"
Cohesion: 0.33
Nodes (5): 1. The Technical Stack PRD Requirements, 2. Implementation PRD & Micro-Feature Task Plan Architecture, 3. Strict Execution Protocol, Mandatory Structure for Every Task Plan, Universal Documentation & Task Plan Requirements

### Community 64 - "critique.md"
Cohesion: 0.17
Nodes (11): Action Summary, Ask the User, Assessment A: Design Review, Assessment B: Detector + Browser Evidence, Assessment Orchestration, Deliver the Report, Hard Invariants, Persist the Snapshot (+3 more)

### Community 65 - "Simplify the Design"
Cohesion: 0.17
Nodes (11): Assess Current State, Code Simplification, Content Simplification, Document Removed Complexity, Information Architecture, Interaction Simplification, Layout Simplification, Plan Simplification (+3 more)

### Community 66 - "Hardening Dimensions"
Cohesion: 0.17
Nodes (11): Accessibility Resilience, Assess Hardening Needs, Edge Cases & Boundary Conditions, Error Handling, Hardening Dimensions, Input Validation & Sanitization, Internationalization (i18n), Performance Resilience (+3 more)

### Community 67 - "Project Architecture Initialization & Six-Document System Playbook"
Cohesion: 0.05
Nodes (39): 1. Executive Summary & Core Rules, 2. The Six-Document System Taxonomy, 3. Document 01: Product Requirements Document (PRD), 4. Document 02: Technical Design Document (TDD / TRD), 5. Document 03: App Flow & State Map, 6. Document 04: UI/UX Design Brief, 7. Document 05: Backend Design & Data Model, 8. Document 06: Engineering Implementation Plan (+31 more)

### Community 68 - "Source-Driven Development"
Cohesion: 0.17
Nodes (11): Common Rationalizations, Overview, Red Flags, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns, Step 4: Cite Your Sources (+3 more)

### Community 69 - "clarify.md"
Cohesion: 0.18
Nodes (10): Actions and navigation, Audit the language, Errors and permissions, Forms, Help and instructional text, Loading, empty, and success states, Rewrite by function, Set the message hierarchy (+2 more)

### Community 70 - "The Surgical Knowledge Merge Protocol"
Cohesion: 0.25
Nodes (7): 1. Zero Direct Overwrite & Preservation Invariant, 2. Forensic Deduplication & Overlap Detection, 3. Extraction of High-Value Differentials Only, 4. Deterministic Destination Routing, 5. Automatic Cleanup, Knowledge & Reference Dump Inbox (`dump/`), The Surgical Knowledge Merge Protocol

### Community 71 - "Nielsen's 10 Heuristics"
Cohesion: 0.18
Nodes (11): 10. Help and Documentation, 1. Visibility of System Status, 2. Match Between System and Real World, 3. User Control and Freedom, 4. Consistency and Standards, 5. Error Prevention, 6. Recognition Rather Than Recall, 7. Flexibility and Efficiency of Use (+3 more)

### Community 72 - "Generate Combined Critique Report"
Cohesion: 0.18
Nodes (11): Design Health Score, Design Specificity Verdict, Generate Combined Critique Report, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider (+3 more)

### Community 73 - "document.md"
Cohesion: 0.18
Nodes (10): Pitfalls, Seed mode, Step 1: Route through new-work's workshop, Step 2: Write seed DESIGN.md, Step 3: Confirm, Style guidelines, The frontmatter: token schema, The markdown body: eight sections (canonical order) (+2 more)

### Community 74 - "polish.md"
Cohesion: 0.18
Nodes (10): 1. Establish the system, 2. Gather the evidence, 3. Triage, 4. Polish the whole path, 5. Verify and finish, Color, imagery, and icons, Content and code, Flow and hierarchy (+2 more)

### Community 75 - "quieter.md"
Cohesion: 0.18
Nodes (10): Assess Current State, Color Refinement, Composition Refinement, Motion Reduction, Plan Refinement, Refine the Design, Simplification, Verify Quality (+2 more)

### Community 76 - "Phase 5: Rapid UI Scaffolding & Component Assembly Specification"
Cohesion: 0.18
Nodes (10): 🎯 Objective, Phase 5: Rapid UI Scaffolding & Component Assembly Specification, 🔒 Quality & Accessibility Standards, Step 1: Initialize Component Engine, Step 2: Scaffold Core Layout via 21st-ui-build Skill, Step 3: Integrate Real-Time Visual Feedback, Step 4: Add the "Demo Preset Button", 🛠️ Step-by-Step Rapid UI Assembly Workflow (+2 more)

### Community 77 - "Init flow"
Cohesion: 0.20
Nodes (10): Completion gate, Init flow, Step 1: Load current state, Step 2: Explore the project, Step 3: Interview for product truth, Step 4: Write PRODUCT.md, Step 5: Record workflow defaults, Step 6: Wrap up or resume (+2 more)

### Community 78 - "🏆 Hackathon_Boilerplate"
Cohesion: 0.33
Nodes (6): 🏆 Hackathon_Boilerplate, 🛡️ Non-Negotiable Operational Invariants, ⚡ Overview & Philosophy, 🚀 Quickstart: Starting a New Hackathon, 📂 The 7-Phase Hackathon Pipeline, ⏱️ Time-Budget Brackets

### Community 79 - "syncEditBadgeHitProxies"
Cohesion: 0.27
Nodes (10): bindEditBadgeProxy(), editBadgeProxyTargets(), initEditBadge(), initEditBadgeHitProxies(), positionEditBadge(), proxyMouseEvent(), setImportantStyle(), styleEditBadgeProxy() (+2 more)

### Community 80 - "3. Milestones & Task Breakdown"
Cohesion: 0.20
Nodes (9): 1. Project Context & Objectives, 2. Designated Skills Mapping, 3. Milestones & Task Breakdown, 4. Mandatory Plan Guardrails Block (Rule 31), Milestone 1: UI Scaffolding & Visual Foundation (`frontend-ui-engineering`), Milestone 2: Hero & Product Cards Scaffolding (`frontend-ui-engineering`), Milestone 3: Reactive State & Interactive Drawers (`frontend-ui-engineering`, `api-and-interface-design`), Milestone 4: Dead-Code Sweep, Verification & Polish (`code-review-and-quality`) (+1 more)

### Community 81 - "📋 Milestone Execution Contracts (Strict Hybrid YAML)"
Cohesion: 0.20
Nodes (10): Milestone 0.5: Elite-Tier Historical Hackathon Intelligence & Past Winner Forensic Audit, Milestone 0.8: Multi-Modal Problem Statement Hunting & Compulsory HITL Selection Funnel, Milestone 0.9: Domain Scope Assessment & Micro-Wedge Niching, Milestone 0: Hackathon Reconnaissance & Anti-Drift Context Lock, Milestone 1: Scope Lock & Source Matrix Definition, Milestone 2: Parallel Subagent Research Spawning, Milestone 3: Consolidation, Deduplication & Quality Filtering, Milestone 4: 9-Parameter Hackathon Scoring & Validation Matrix (+2 more)

### Community 82 - "📋 Milestone Execution Contracts (Strict Hybrid YAML)"
Cohesion: 0.20
Nodes (9): Milestone 1: Actual Available Product, Incumbent & Past Winner Multi-Channel Discovery, Milestone 2: Product Workflow, Pricing & Codebase Forensic Teardown, Milestone 3: Negative Review & Sentiment Mining, Milestone 4: Complaint-to-Leverage Translation (The "Flaw Inversion"), Milestone 5: The Hackathon Differentiation Blueprint & Pitch Contrast, 📋 Milestone Execution Contracts (Strict Hybrid YAML), 🎯 Objective & The Parity + Leverage Formula, Phase 2: Available Product Search, Competitor Teardown & Sentiment Mining Specification (+1 more)

### Community 83 - "📋 Milestone Execution Contracts (Strict Hybrid YAML)"
Cohesion: 0.20
Nodes (9): Milestone 1: Time-Budget Mapping & Capacity Sizing (The 70% Buildable Rule), Milestone 2: The "Golden Demo Path" Razor (Rule 2 Invariant), Milestone 3: 3-Tier Feature Triaging & Authentic Visual Mocking, Milestone 4: Local-First SQLite Architecture & Free-Tier Cloud Staging, Milestone 5: Covert Demo-Proofing & Anti-Crash Offline Fallback, 📋 Milestone Execution Contracts (Strict Hybrid YAML), 🎯 Objective & Core Invariants, Phase 3: MVP Scoping, Triaging & Golden Demo Razor Specification (+1 more)

### Community 84 - "Ideation Frameworks Reference"
Cohesion: 0.22
Nodes (8): Analogous Inspiration, Constraint-Based Ideation, First Principles Thinking, How Might We (HMW), Ideation Frameworks Reference, Jobs to Be Done (JTBD), Pre-mortem, SCAMPER

### Community 85 - "Hackathon Speedrun Verification Template — Reusable Agent Instructions"
Cohesion: 0.29
Nodes (6): 🛡️ Exception: Targeted Unit Tests Only, Gate 1: Compilation & Typing Gate, Gate 2: The Golden-Path Demo Walkthrough Gate, Hackathon Speedrun Verification Template — Reusable Agent Instructions, 🎯 The 2 Verification Gates, ⚡ The Speedrun Verification Philosophy

### Community 86 - "Common Cognitive Load Violations"
Cohesion: 0.22
Nodes (9): 1. The Wall of Options, 2. The Memory Bridge, 3. The Hidden Navigation, 4. The Jargon Barrier, 5. The Visual Noise Floor, 6. The Inconsistent Pattern, 7. The Multi-Task Demand, 8. The Context Switch (+1 more)

### Community 87 - "Hackathon Speedrun System Architecture Guide"
Cohesion: 0.33
Nodes (5): 🚫 Enterprise Over-Engineering Banned During Speedruns, Hackathon Speedrun System Architecture Guide, 🏛️ The Hackathon 3-Tier Stack, ⚡ The "⚡ Load Judge Demo" Preset Button, 🛡️ Tri-Layer Fail-Safe Shield (Zero Live Demo Crashes)

### Community 88 - "iOS platform"
Cohesion: 0.22
Nodes (9): Color & materials, Components & controls, iOS platform, Layout & structure, Motion, The iOS slop test, Touch targets, Typography (+1 more)

### Community 89 - "Operate mode depth (and Read notes)"
Cohesion: 0.22
Nodes (9): Color, Components, Layout, Motion, Operate mode depth (and Read notes), Product constraints, Product permissions, The product slop test (+1 more)

### Community 90 - "Shape"
Cohesion: 0.22
Nodes (8): Cadence, Confirm and stop, Phase 1: Discovery interview, Phase 2: Resolve the design direction, Phase 3: Write the brief, Round 1: purpose, people, and outcome, Round 2: material, behavior, and boundaries, Shape

### Community 91 - "Phase 7: Demo Pitch, Storyboarding & Judge-Proofing Specification"
Cohesion: 0.22
Nodes (9): 🔒 Final Pre-Flight Pitch Checklist, 🎯 Judge Q&A Defense Matrix, 🎯 Objective, Phase 7: Demo Pitch, Storyboarding & Judge-Proofing Specification, Question 1: "How is this different from [Incumbent]?", Question 2: "What happens if external APIs or network calls fail?", Question 3: "How does this scale to production?", ⏱️ The 3-Minute Pitch Script Formula (+1 more)

### Community 92 - "Project Context, Core Philosophy, Design DNA & Incident Telemetry"
Cohesion: 0.25
Nodes (7): 0. Active Hackathon Ground Truth & Anti-Drift Context (Injected), 1. Product Philosophy & Core Vision, 2. Core Mechanisms & System Architecture, 3. Design DNA & Visual / Interaction Standards, 4. Error Recovery & Rapid Bug Triage, 5. Operational Invariants & Runtime Caveats, Project Context, Core Philosophy, Design DNA & Incident Telemetry

### Community 93 - "graphify reference: extra exports and benchmark"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 94 - "adapt.native.md"
Cohesion: 0.25
Nodes (7): Adaptation Strategies, Assess Adaptation Challenge, Implement & Verify, Orientation & foldables, Phone → Tablet (iPad / large screens), Platform → platform (iOS ↔ Android), Web → native (porting a website or web app)

### Community 95 - "Android platform"
Cohesion: 0.25
Nodes (8): Android platform, Color & theming, Components & motion, Layout & structure, The Android slop test, Touch targets, Typography, Verifying the build

### Community 96 - "colorize.md"
Cohesion: 0.25
Nodes (7): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode

### Community 97 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 98 - "doctor.md"
Cohesion: 0.25
Nodes (7): Monorepo notes, Opting out of the boot check, Step 1: Run the pass, Step 2: Act by severity, Step 3: Deprecated fields are binding, Step 4: Do not overclaim on truth drift, What this owns, and what it does not

### Community 99 - "Extract Flow"
Cohesion: 0.25
Nodes (7): Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 100 - "live-setup.md"
Cohesion: 0.25
Nodes (7): append-arrays, append-string, Config drift, Consent prompt (use this phrasing), CSP detection (first-time only), Troubleshooting, Write the config

### Community 101 - "Generate Report"
Cohesion: 0.29
Nodes (7): Audit Health Score, Detailed Findings by Severity, Executive Summary, Generate Report, Patterns & Systemic Issues, Platform Conformance Verdict, Positive Findings

### Community 102 - "Cognitive Load Assessment"
Cohesion: 0.29
Nodes (7): Cognitive Load Assessment, Cognitive Load Checklist, Extraneous Load: Bad Design, Germane Load: Learning Effort, Intrinsic Load: The Task Itself, The Working Memory Rule, Three Types of Cognitive Load

### Community 103 - "Impeccable Asset Producer"
Cohesion: 0.29
Nodes (6): Core Rule, Decision Comps, Impeccable Asset Producer, Input Contract, Output Contract, The job

### Community 104 - "Impeccable Finish Reviewer"
Cohesion: 0.29
Nodes (6): Checks, in order, Disposition, Impeccable Finish Reviewer, Input Contract, Output Contract, Verdict Pass

### Community 105 - "Impeccable Manual Edit Applier"
Cohesion: 0.29
Nodes (6): Checks, Entry Atomicity, Impeccable Manual Edit Applier, Input Contract, Output Contract, Workflow

### Community 106 - "live-browser-ignores.js"
Cohesion: 0.52
Nodes (6): globToRegex(), matchesScope(), normalizeIgnoreRule(), normalizeIgnoreValue(), pageCandidates(), resolveDetectIgnores()

### Community 107 - "evaluate_command"
Cohesion: 0.47
Nodes (5): evaluate_command(), main(), normalize_command(), De-obfuscates command strings across 4 phases to prevent regex evasion: Phase…, Evaluates command against forensic patterns after normalization. Returns…

### Community 108 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 109 - "Diagnostic Scan"
Cohesion: 0.33
Nodes (6): 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Diagnostic Scan

### Community 110 - "bolder.md"
Cohesion: 0.33
Nodes (5): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat

### Community 111 - "$impeccable hooks"
Cohesion: 0.33
Nodes (6): Constraints, Failure modes, Flow, $impeccable hooks, Routing, Triage findings

### Community 112 - "Visualize: Direction Comps & Asset Production"
Cohesion: 0.33
Nodes (5): After approval: the comp becomes a spec, Generate three compositional options, One approval point, Plates and provenance, Visualize: Direction Comps & Asset Production

### Community 113 - "impeccable"
Cohesion: 0.60
Nodes (5): impeccable script, check_download(), fetch_url(), probe_ok(), setup_help()

### Community 114 - "Phase 6: Golden-Path Smoke Verification Specification"
Cohesion: 0.33
Nodes (5): ⚠️ Enterprise Testing Suspension Notice, 🎯 Objective, Phase 6: Golden-Path Smoke Verification Specification, 🧪 The 2 Hackathon Verification Gates, 🛡️ Tri-Layer Fail-Safe Shield Verification

### Community 115 - "Impeccable Documenter"
Cohesion: 0.40
Nodes (4): Impeccable Documenter, Input Contract, Output Contract, Workflow

### Community 116 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 117 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 118 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 119 - "Heuristics Scoring Guide"
Cohesion: 0.50
Nodes (4): Heuristics Scoring Guide, Issue Severity (P0–P3), Reference Material, Score Summary

### Community 120 - "01. NovaMart Hackathon Wedge & 2-Minute Demo Script"
Cohesion: 0.50
Nodes (3): 01. NovaMart Hackathon Wedge & 2-Minute Demo Script, 1. Product Overview & Wedge, 2. The 2-Minute Judge Walkthrough Script

### Community 262 - "Universal Frontend Design Bible & Anti-Slop Architectural Standard"
Cohesion: 0.18
Nodes (10): 1. Executive Summary & Design System Philosophy, 2. Watertight 5-Layer Frontend Tool Stack & Execution Lifecycle, 3. The 6-Category Anti-Slop Codex (What NOT to Use), 4. Token Architecture & Root `DESIGN.md` Contract, 5. Core Web Vitals, Render Physics & Performance Budgets, 6. Client-Side Security & Threat Hardening (STRIDE & OWASP), 7. Legacy Strangler Fig Refactoring & Design Drift Prevention, 8. Frontend Smoke Verification & Golden-Path Quality Gates (+2 more)

## Knowledge Gaps
- **1067 isolated node(s):** `idea-refine.sh script`, `name`, `private`, `version`, `type` (+1062 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Reference Material` connect `Heuristics Scoring Guide` to `critique.md`, `Persona-Based Design Testing`, `Cognitive Load Assessment`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `Handle `generate`` connect `Handle `generate`` to `live.md`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `idea-refine.sh script`, `name`, `private` to the rest of the system?**
  _1067 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `live-browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.058173076923076925 - nodes in this community are weakly interconnected._
- **Should `handleManualEditActivity` be split into smaller, more focused modules?**
  _Cohesion score 0.056866303690260134 - nodes in this community are weakly interconnected._
- **Should `modern-screenshot.umd.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08959899749373433 - nodes in this community are weakly interconnected._
- **Should `startVariantObserver` be split into smaller, more focused modules?**
  _Cohesion score 0.0889894419306184 - nodes in this community are weakly interconnected._