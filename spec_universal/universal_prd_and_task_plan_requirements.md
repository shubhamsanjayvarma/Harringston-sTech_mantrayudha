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
   - Follow the template defined in [`spec_universal/tech_stack_prd_template.md`](file:///c:/Project_Struct/spec_universal/tech_stack_prd_template.md).

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
    title: "Automated Verification, Pre-Commit Hooks & CI/CD Setup"
    details: "Define explicit test scripts across all 4 TDD categories (Complexity, Logic, Integration, STRIDE/OWASP), strict pre-commit hooks, GitHub Actions CI workflows, and automated evaluation scripts."
  section_d:
    title: "Knowledge Graph Synchronization"
    details: "Mandatory step to execute 'graphify update .' upon completing code modifications to keep AST and community graphs current."
  section_e:
    title: "Security & Architectural Guardrails"
    details: "Explicit negative permissions and constraints specifying what the feature must NOT do (e.g., forbidden endpoints, unauthorized external network calls, destructive filesystem operations, prototype pollution risks)."
  section_f:
    title: "Mandatory Agent Skill Mapping"
    details: "Explicitly name and assign the designated available skills from the skills catalog to be activated during execution (e.g., test-driven-development, frontend-ui-engineering, cyber-security-frameworks, performance-optimization)."
```

---

## 3. Strict Execution Protocol

1. **Refer to Project Rules First:**
   - Consult [`.agents/AGENTS.md`](file:///c:/Project_Struct/.agents/AGENTS.md) for full procedural rules and guardrails.
2. **Zero Code Touched Before Approval:**
   - In accordance with TDD and planning guidelines, do not create, modify, or refactor any source code until the implementation plan has been reviewed and verified.
3. **4-Tier Testing Compliance:**
   - All test plans must adhere strictly to [`spec_universal/tdd_4tier_testing_template.md`](file:///c:/Project_Struct/spec_universal/tdd_4tier_testing_template.md).
