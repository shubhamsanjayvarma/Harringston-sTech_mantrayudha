# Project Architecture Initialization & Six-Document System Playbook

> **Context & Origin:** Based on Arnie Verma's Vibe Coding Playbook (@byarnieverma) for practical AI-assisted engineering and structured agent orchestration.
> **Scope & Purpose:** Codifies the comprehensive initialization framework required before writing or changing any production code. These documents give AI coding agents stable, unambiguous constraints so they make fewer inconsistent decisions, prevent scope creep, and enforce strict correctness.

---

## 1. Executive Summary & Core Rules

AI coding tools generate code rapidly, but they require humans and architects to explicitly define what "correct" means. These architectural initialization documents reduce ambiguity, establish verifiable boundaries, and anchor the build to real user problems rather than arbitrary feature sprawl.

### The Three Golden Rules of Project Initialization
1. **Define the Smallest Useful Version:** Every speculative feature introduces scope creep and compounding bugs. Always scope the absolute minimum viable slice that delivers real value.
2. **Separate Facts, Decisions, and Open Questions:** Never present unvalidated assumptions as hard requirements. Label what is empirically verified, what is an intentional architectural decision, and what remains an open question.
3. **Version Documents with the Code:** Architecture documentation must be treated as living artifacts co-versioned with the codebase. When code or requirements evolve, check and update the affected specifications immediately.

### Fast Path vs. Production Depth
- **Fast Path (Lean Prototype):** A rapid hackathon or weekend prototype may combine these initial specifications into a single lean document.
- **Production Depth:** Any application handling money/payments, personal identifiable data (PII/PHI), multiple tenant roles, or regulated domains requires the full, exhaustive depth of all six distinct document layers.

---

## 2. The Six-Document System Taxonomy

| # | Specification Document | Core Purpose & Scope | Primary Deliverables |
| :-: | :--- | :--- | :--- |
| **01** | **Product Requirements Document (PRD)** | Define the problem, target users, scope boundaries, and verifiable success criteria. | User stories, acceptance criteria, goals/non-goals, success metrics. |
| **02** | **Technical Design Document (TDD / TRD)** | Architecture, tech stack, service boundaries, integrations, constraints, and trade-offs. | System context, decision records (ADRs), API boundaries, security posture. |
| **03** | **App Flow & State Map** | Map user journeys, screens, permissions, lifecycle states, actions, and redirects. | Screen inventory, state transitions (loading/empty/error), route guards. |
| **04** | **UI/UX Design Brief** | Visual system, design tokens, device responsiveness, interactions, and accessibility. | Design direction, color/typography tokens, component rules, WCAG 2.2 AA. |
| **05** | **Backend Design & Data Model** | Schemas, relational access rules, CRUD permissions, storage, APIs, and events. | Database tables, indexes, RBAC/ABAC access matrix, auth lifecycle. |
| **06** | **Engineering Implementation Plan** | Break architectural designs into small, testable tasks ordered strictly by dependency. | Thin vertical slices, automated test gates, done criteria, rollback paths. |
| **07** | **Authoritative References & Standards** | Established engineering frameworks and official documentation anchors. | Industry standards (OWASP, W3C WCAG, Microsoft, Azure Well-Architected). |

---

## 3. Document 01: Product Requirements Document (PRD)

### Purpose
Ties the technical build directly to a validated user problem instead of a disconnected pile of features. Guides trade-offs without pretending the product will never evolve.

### Mandatory Inclusions
- **Product Summary:** One-sentence synthesis of user, problem, and intended outcome.
- **Target User & Current Alternatives:** Exactly who experiences the problem, when it occurs, and what workaround or competitor they use today.
- **V1 Goals vs. Non-Goals:** Explicit boundaries of what is in scope and what is strictly rejected for this release.
- **Observable Functional Requirements:** Broken down into `Must-Have` vs. `Future / Later`.
- **User Stories with Testable Acceptance Criteria:** Formatted with `Given [context], When [action], Then [observable result]`.
- **Success Signals & Metrics:** Baseline, target, window, and measurement method.
- **Assumptions, Risks, Dependencies, and Open Questions:** Explicitly labeled.

### Quality Verification Gate
> **Check:** Could an external engineer or agent write tests and implement every must-have requirement without needing to ask what was meant? If not, the acceptance criteria are too loose.

### Copy/Paste Template
```markdown
# Product Requirements Document (PRD)

## 1. PRODUCT SUMMARY
[Target User] + [Core Problem] + [Intended Outcome in one sentence]

## 2. TARGET USER & CURRENT ALTERNATIVE
- Target User: [Detailed persona, role, or user archetype]
- Trigger Context: [When and where does this problem occur?]
- Current Workaround / Alternative: [What do they use today? (Spreadsheets, competitors, manual effort)]

## 3. V1 GOALS / NON-GOALS
- Core Goals:
  1. [Goal 1]
  2. [Goal 2]
- Non-Goals (Strictly Out of Scope for V1):
  1. [Non-goal 1]
  2. [Non-goal 2]

## 4. FUNCTIONAL REQUIREMENTS
### FR-01 — [Short Feature Name]
- Description: [Required system behavior]
- Acceptance Criteria:
  - Given [precondition/context]
  - When [user action or event]
  - Then [observable system result]
- Edge / Failure / Empty / Loading Behavior:
  - [Describe system behavior under failure or empty states]

## 5. SUCCESS SIGNALS & METRICS
| Metric Name | Baseline (if known) | V1 Target | Measurement Window |
| :--- | :--- | :--- | :--- |
| [e.g., Onboarding completion rate] | [0%] | [> 80%] | [First 14 days] |

## 6. ASSUMPTIONS, RISKS & OPEN QUESTIONS
- [ASSUMPTION]: [Description of assumption being made]
- [RISK]: [Potential technical, user, or business risk]
- [OPEN QUESTION]: [Unresolved item requiring clarification]
```

---

## 4. Document 02: Technical Design Document (TDD / TRD)

### Purpose
Explains how the system operates under the hood, how components interact across trust boundaries, and why major technical decisions were made. It is not a shopping list of libraries; it documents architecture, constraints, trade-offs, and consequences.

### Mandatory Inclusions
- **System Context & Topology:** Client, server runtime, database instances, external third-party APIs, and explicit trust boundaries.
- **Core Technology Stack:** Frontend, backend, persistence, hosting, and deployment pipeline.
- **External APIs & Integrations:** Purpose, data exchanged, failure handling, rate limits, latency budgets, and cost assumptions.
- **Security & Privacy Posture:** Secret management, transport encryption (mTLS/TLS 1.3), data at rest encryption, retention schedules, and threat vectors.
- **Performance, Observability & Environment Isolation:** Latency SLOs, health checks, metrics, and structured logging.
- **Architectural Decision Records (ADRs):** Major choices, alternatives evaluated, trade-offs accepted, and triggers for reconsideration.

### Security Invariant
> **CRITICAL:** Never paste live secrets, private API keys, or production credentials into any design document or agent prompt. Reference environment variable identifiers only (e.g., `process.env.STRIPE_SECRET_KEY`).

### Baseline Architecture Selection Matrix
| Architecture Area | Technology Decision | Operational Reason & Constraint |
| :--- | :--- | :--- |
| **Frontend** | [Framework + Version Policy] | [Fit for product requirements, SSR/CSR, team proficiency] |
| **Backend** | [Runtime + API Protocol] | [Throughput, concurrency model, REST/gRPC/GraphQL fit] |
| **Data Persistence** | [Database Engine + Region] | [Data model, ACID vs eventual consistency, data residency] |
| **Identity & Access** | [Provider + Session Model] | [JWT/Opaque sessions, RBAC/ABAC, MFA, recovery flows] |
| **Delivery & Infra** | [Hosting Provider + CI/CD] | [Preview deploys, rollback safety, automated test gates] |

### Architecture Decision Record (ADR) Template
```markdown
### ADR-[Number]: [Short Decision Title]
- Status: [Proposed | Accepted | Deprecated | Replaced]
- Context & Requirements: [What problem or constraint triggered this decision?]
- Options Considered:
  1. [Option A]: [Pros / Cons]
  2. [Option B]: [Pros / Cons]
- Final Choice: [Selected option]
- Rationale: [Why this choice best satisfies the constraints]
- Consequences & Trade-offs: [Incurred costs, architectural limitations, risks]
- Revisit When: [Concrete future trigger to re-evaluate this decision]
```

---

## 5. Document 03: App Flow & State Map

### Purpose
Maps everything the user experiences, what interactions are permitted, and what state transitions occur across every screen and background process. A static list of URL routes is insufficient; every screen requires an operational state contract.

### Mandatory Inclusions
- **Screen Inventory:** Route, purpose, permitted roles, and authentication guards.
- **Primary User Journeys:** Step-by-step walkthroughs of critical flows (signup, first-value action, core workflow, payment, account recovery).
- **Navigation & Layout Rules:** Responsive desktop vs. mobile navigation paradigms (drawers, bottom sheets, sidebars).
- **The Six Core UI States per Screen:**
  1. *Ideal / Populated State* (standard content rendered)
  2. *Loading State* (skeletons, spinners, disabled controls)
  3. *Empty State* (no data yet, with clear call-to-action)
  4. *Validation State* (field-level warnings and inline errors)
  5. *System Error State* (server down, network dropped, retry CTA)
  6. *Offline State* (cached data read-only, action queueing)
- **Edge Conditions & Redirects:** Session expiration, destructive action confirmations, permission denials, and browser back-button handling.

### Quality Verification Gate
> **Check:** Trace a brand-new user and a returning user from entry to journey completion. Repeat the trace assuming: (1) no data, (2) invalid input, and (3) network/API failure.

### Screen Specification Template
```markdown
### SCREEN: [Screen Name]
- Route: [/path/to/view]
- Purpose: [Primary user goal on this screen]
- Allowed Roles: [Anonymous | Authenticated | Admin | Owner]
- Entry Conditions & Guards: [Pre-requisite state or session checks]
- Required Data: [Payloads or queries needed before rendering]
- Primary & Secondary Actions:
  - Primary: [Main CTA button/action]
  - Secondary: [Alternative actions/links]
- Success Outcome / Next Route: [Where does the user land after completion?]
- State Handling:
  - Loading: [Skeleton screens, progress bars]
  - Empty: [Zero-data copy + CTA]
  - Error: [Inline alerts, toast notifications]
- Mobile Responsiveness: [Layout shifts, drawer adaptations]
- Telemetry & Analytics: [Events dispatched on view/click]
```

### User Journey Walkthrough Template
```markdown
### JOURNEY: [User Goal, e.g., Onboarding to First Project Created]
1. Entry Point: [Initial screen, invitation link, or landing page]
2. User Action: [User inputs credentials or project details]
3. System Response: [Validation, async API request, state transition]
4. Decision / Branching: [Success path vs validation failure vs payment required]
5. Completion State: [Confirmation modal, redirected to dashboard]
- Recovery Path: [How user recovers if process fails mid-way]
- Permission / Auth Edge Case: [Behavior if session expires during flow]
- Testable Success Assertion: [Automated E2E check proving journey passed]
```

---

## 6. Document 04: UI/UX Design Brief

### Purpose
Defines a coherent visual language, interaction choreography, and design tokens across all components and viewports. "Make it look like Linear/Stripe" is a visual mood, not a design system. This brief extracts actionable, reusable tokens and interaction rules.

### Mandatory Inclusions
- **Design Principles & Visual Tone:** 3 defining adjectives (e.g., dense, utilitarian, calm vs. airy, playful, consumer).
- **Design Tokens by Role:**
  - Color Tokens: Surface/background, foreground/text, primary brand, secondary, warning, danger, focus rings.
  - Typography Scale: Heading, body, caption, monospace (weights, line-heights, letter-spacing).
  - Spacing & Geometry: Base 4px/8px grid scale, border radii, border widths, elevation/shadows.
- **Component Design Guidelines:** Standard behaviors for inputs, buttons, data tables, modals, badges, and feedback toasts.
- **Responsive Breakpoints:** Mobile (<640px), tablet (640px-1024px), desktop (>1024px).
- **Accessibility Standards (WCAG 2.2 AA):** Contrast ratios (>= 4.5:1 text, >= 3:1 UI), visible keyboard focus rings, touch targets (>= 44x44px), screen-reader labels, and `prefers-reduced-motion` compliance.
- **Reference Principles:** Extract underlying UX principles (e.g., optimistic updates, keyboard command palettes) rather than cloning proprietary branding.

### Copy/Paste Template
```markdown
# UI/UX Design Brief

## 1. DESIGN DIRECTION & BRAND TONE
- Three Core Adjectives: [e.g., Utilitarian, Focused, Kinetic]
- Should Feel Like: [e.g., Professional IDE, responsive desktop tool]
- Must NOT Feel Like: [e.g., Cluttered social app, slow enterprise portal]

## 2. DESIGN TOKENS
- Colors:
  - Background/Surface: [Tokens or Hex codes]
  - Text/Foreground: [Tokens or Hex codes]
  - Primary / Accent: [Tokens or Hex codes]
  - Destructive / Danger: [Tokens or Hex codes]
  - Focus Ring: [Tokens or Hex codes]
- Typography:
  - Headings: [Font family, weights]
  - Body: [Font family, size, line-height]
  - Code / Data: [Monospace font family]
- Spacing Scale: [Base 4px / 8px scale: 4, 8, 12, 16, 24, 32, 48, 64px]
- Radii & Shadows: [Corner radii scale and elevation shadows]

## 3. COMPONENT INTERACTION RULES
- Buttons: [Hover, active, disabled, and loading states]
- Inputs & Forms: [Floating/stacked labels, inline validation, tab order]
- Cards & Tables: [Row density, hover highlights, empty row handling]
- Modals & Sheets: [Backdrop blur, escape-key closing, focus traps]
- Feedback & Alerts: [Toast timeouts, banner persistence]

## 4. RESPONSIVE & ACCESSIBILITY CONTRACT
- Touch Targets: Minimum 44x44px on all interactive elements.
- Contrast Ratio: Strict WCAG 2.2 AA (>= 4.5:1 for normal text).
- Keyboard Navigation: All actions reachable via Tab/Enter/Space; explicit visible focus ring.
- Reduced Motion: Respect `prefers-reduced-motion` by disabling spring animations.
```

---

## 7. Document 05: Backend Design & Data Model

### Purpose
Defines how persistence, business data, relational models, APIs, and access boundaries are structured and enforced. UI form hiding is not security; all authorization and invariants must be validated on the backend.

### Mandatory Inclusions
- **Relational Schema / Data Model:** Tables, field types, nullability, defaults, primary keys (UUIDs), foreign key relations, cascade behaviors, and timestamps (`created_at`, `updated_at`).
- **Index Strategy:** Indexes formulated directly around query read/write access patterns, compound indexes, and uniqueness constraints.
- **RBAC / ABAC Access Matrix:** Exhaustive mapping of roles (Anonymous, User, Member, Admin, Owner) to permissions (Create, Read, Update, Delete) per entity.
- **Authentication & Identity Lifecycle:** Sign-up, email verification, session tokens (opaque/JWT), refresh mechanisms, password reset/recovery, and account deletion.
- **Authorization Enforcement Tier:** Database-level Row-Level Security (RLS) or server middleware authorization guards.
- **API Contracts & Integrations:** REST/RPC schemas, payload validation schemas (Zod/Pydantic), deterministic error codes, and idempotency key handling for mutating calls.
- **Data Governance & Retention:** Soft vs. hard deletion, audit logging, backup cycles, and sensitive data segregation.

### Security Invariant
> **CRITICAL:** Always test cross-tenant and cross-user data access (IDOR). Can User A read or mutate User B's records by tampering with the URL or payload ID? Row-level authorization must enforce tenant isolation.

### Entity Schema Template
```markdown
### TABLE: [table_name]
| Field Name | Type & Nullability | Constraints & Indexing | Business Purpose / Notes |
| :--- | :--- | :--- | :--- |
| `id` | UUID, NOT NULL | PRIMARY KEY, Default: `gen_random_uuid()` | Immutable unique identifier |
| `tenant_id` | UUID, NOT NULL | FOREIGN KEY (`tenants.id`), INDEXED | Multi-tenant partition key |
| `user_id` | UUID, NOT NULL | FOREIGN KEY (`users.id`), INDEXED | Entity creator / owner |
| `[attribute]` | VARCHAR(255), NOT NULL | UNIQUE / CHECK constraint | Domain specific data |
| `created_at` | TIMESTAMPTZ, NOT NULL | Default: `NOW()` | Audit record creation time |
| `updated_at` | TIMESTAMPTZ, NOT NULL | Default: `NOW()`, auto-trigger | Last mutation timestamp |
```

### Access Control Matrix Template
| Entity / Resource | Action | Role: Owner | Role: Member | Role: Admin | Role: Anonymous |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Project** | Create | Allowed | Denied | Allowed | Denied (401) |
| **Project** | Read | Own records | Tenant shared | All in tenant | Denied (401) |
| **Project** | Update | Allowed | Denied (403) | Allowed | Denied (401) |
| **Project** | Delete | Allowed (Audited)| Denied (403) | Allowed (Audited)| Denied (401) |

---

## 8. Document 06: Engineering Implementation Plan

### Purpose
Translates the product requirements and technical architecture into discrete, ordered tasks. Avoids vague directives like "build frontend, then build backend". Tasks must be ordered by strict dependencies, with thin vertical slices prioritized.

### The Thin End-to-End Vertical Slice Principle
After laying repository and CI/CD foundations, always build one small, complete vertical slice (UI $\to$ API $\to$ Database $\to$ Response) before building horizontal layers. This uncovers integration traps, typing mismatches, and deployment friction immediately.

### Recommended Milestone Sequence
1. **Foundation:** Repository scaffold, linting/typechecking, CI pipeline, environment configuration, and health check endpoint.
2. **Thin Vertical Slice:** One complete end-to-end journey proven across UI, API, and database.
3. **Identity & Tenant Boundaries:** Authentication, session management, and server-side authorization guards.
4. **Core Features:** Ordered strictly by dependency, with full state handling and test suites.
5. **External Integrations:** Third-party APIs, webhooks, sandboxed testing, and idempotency guarantees.
6. **UI Polish & Accessibility:** Breakpoint handling, keyboard traps, WCAG contrast verification, and micro-interactions.
7. **Production Hardening:** Rate limiting, audit logging, backup verification, and threat review.
8. **Deployment & Release:** Database migrations (expand-contract), environment variables, monitoring, and zero-downtime cutover.

### Task Specification Template
```markdown
### TASK-[ID]: [Descriptive Action Title]
- Intended Outcome: [Observable user or system capability delivered]
- Affected Layers: [Frontend | Backend | Database | Infrastructure]
- Prerequisites & Dependencies: [Tasks that must complete before this begins]
- Implementation Guide: [Key interfaces, architectural patterns, files touched]
- Acceptance Criteria: [Explicit conditions that must be satisfied]
- Required Tests (TDD):
  - Type 1 Complexity: [Performance & Big-O bounds]
  - Type 2 Logic: [Functional correctness & edge cases]
  - Type 3 Integration: [End-to-end contract & lifecycle]
  - Type 4 Security: [STRIDE/OWASP input sanitization & auth checks]
- Security & Boundary Checks: [Access verification, secret isolation]
- Observability: [Logs, metrics, trace spans emitted]
- Rollback Strategy: [Safe steps to undo change if regression occurs]
- Definition of Done Evidence: [Command output, test runs, CI green status]
```

### Definition of Done (DoD) Checklist
Before any task or pull request is declared complete:
- [ ] All functional acceptance criteria pass under nominal, empty, and error conditions.
- [ ] Automated tests (Complexity, Logic, Integration, STRIDE/OWASP) pass without warnings or flaky retries.
- [ ] Server-side authorization and input validation are active and tested.
- [ ] Structured logging and error handling provide clear debugging context without leaking sensitive credentials or PII.
- [ ] Related documentation and schemas are updated to reflect the change.
- [ ] The change is deployable, backwards-compatible, and safely reversible.

---

## 9. Authoritative Engineering References

The standards, frameworks, and patterns codified across these six documents are grounded directly in established industry engineering literature:

- **Product Requirements & User Needs:**
  - *Atlassian Agile Product Management:* [Product Requirements & Agile Flexibility](https://www.atlassian.com/agile/product-management/requirements)
  - *Agile Alliance:* [The Agile Manifesto and Principles](https://agilemanifesto.org/)
- **Technical Design & Architecture Decision Records:**
  - *Microsoft Learn:* [Functional and Technical Design Documents](https://learn.microsoft.com/en-us/dynamics365/guidance/patterns/create-functional-technical-design-document)
  - *Microsoft Azure Architecture Center:* [Architecture Decision Records (ADR)](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record)
  - *Azure Well-Architected Framework:* [Purposeful Architecture Diagrams](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/design-diagrams)
  - *Hacker News / Engineering Community:* [Design Document Engineering Forum](https://news.ycombinator.com/item?id=44779428)
- **User Experience, Flow & Accessibility:**
  - *W3C Standards:* [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
  - *Adobe Design Basics:* [How to Build User Flow Diagrams](https://business.adobe.com/au/blog/basics/how-to-make-a-user-flow-diagram)
- **Application Security & Authorization:**
  - *OWASP Foundation:* [Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
  - *OWASP Cheat Sheet Series:* [Authorization Architecture Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- **Database Design & Relational Persistence:**
  - *Microsoft Technical Documentation:* [Relational Database Design Fundamentals](https://support.microsoft.com/en-us/office/database-design-basics-eb2159cf-1e30-401a-8084-bd4f9c9ca1f5)
