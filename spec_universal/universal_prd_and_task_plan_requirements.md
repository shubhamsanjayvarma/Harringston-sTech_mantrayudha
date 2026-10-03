# Universal Documentation & Task Plan Requirements

> **Scope & Authority:** This document outlines the universal, project-agnostic requirements for formulating Technical Stack PRDs and Feature Implementation Task Plans. Every software system or tool built within this workspace must adhere to these specifications before writing or touching any code.

---

## 1. The Technical Stack PRD Requirements

Before selecting or committing to a technical stack, conduct thorough research to ensure the proposed stack provides optimal efficiency, performance, and speed:

1. **Language & Runtime Selection:**
   - Objectively evaluate candidates (e.g., Rust vs. Go vs. Python vs. TypeScript) based on compute profile (CPU-bound, I/O-bound, memory constraints).
   - Never pick a language by habit or default; substantiate the choice with concrete efficiency benchmarks and architectural fit.
2. **Modern Tooling & Package Management:**
   - Select high-performance package managers and tooling (e.g., `uv` over `pip`, `pnpm` over `npm`, `cargo` with optimized profiles).
3. **Official Dependencies & Exact Version Pinning:**
   - All libraries and packages must originate strictly from official, trusted registries (crates.io, PyPI, npm) — never untrusted forks, mirrors, or typosquats.
   - Specify the exact package names and pinned version numbers (no loose wildcards).
4. **Research Validation:**
   - Follow the template defined in [`spec_universal/tech_stack_prd_template.md`](spec_universal/tech_stack_prd_template.md).

---

## 2. Implementation PRD & Micro-Feature Task Plan Architecture

Never treat a feature or tool as a monolithic implementation block. Deconstruct the entire deliverable into micro-feature-oriented implementation plans, maintaining dedicated task plan files for each independent milestone or component.

### Mandatory Structure for Every Task Plan

Every task plan (`task.md` or milestone plan) must strictly include the following six core sections:

```yaml
task_plan_structure:
  section_a:
    title: "Tool / Feature Description & Scope"
    details: "Clear functional overview defining what is being built, user stories, and acceptance boundaries."
  section_b:
    title: "Codebase Navigation via Graphify"
    details: "Query the knowledge graph (graphify query) to identify relevant symbols, dependencies, callers, and existing architectural patterns before writing code."
  section_c:
    title: "Smoke Verification & Demo Quality Gates"
    details: "Define explicit compilation checks (npm run build or tsc --noEmit), the 2-minute Golden Demo Path walkthrough, and fail-safe mock fallback fixtures."
  section_d:
    title: "Knowledge Graph Synchronization"
    details: "Mandatory step to execute 'graphify update .' upon completing code modifications to keep AST and community graphs current."
  section_e:
    title: "Security & Architectural Guardrails"
    details: "Explicit constraints specifying what the feature must NOT do (e.g., destructive filesystem operations, prototype pollution risks)."
  section_f:
    title: "Mandatory Agent Skill Mapping"
    details: "Explicitly name and assign the designated available skills from the skills catalog to be activated during execution (e.g., 21st-ui-build, frontend-ui-engineering, systematic-debugging)."
```

---

## 3. Strict Execution Protocol

1. **Refer to Project Rules First:**
   - Consult [`.agents/AGENTS.md`](.agents/AGENTS.md) for full procedural rules and guardrails.
2. **Zero Code Touched Before Approval:**
   - In accordance with planning guidelines, do not create, modify, or refactor any source code until the implementation plan has been reviewed and verified.
3. **Smoke Verification Compliance:**
   - All verification plans must adhere to [`spec_universal/hackathon_smoke_verification_template.md`](spec_universal/hackathon_smoke_verification_template.md).
