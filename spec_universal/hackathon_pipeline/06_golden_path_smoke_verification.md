# Phase 6: Golden-Path Smoke Verification Specification

> **File:** `spec_universal/hackathon_pipeline/06_golden_path_smoke_verification.md`  
> **Parent Protocol:** `00_master_hackathon_operating_system.md`  
> **Execution Mode:** Smoke verification, build validation, and Golden-Path demo walkthrough  
> **Designated Skills:** `systematic-debugging`, `verification-before-completion`, `shipping-and-launch`

---

## 🎯 Objective

In a ~6-hour hackathon, writing exhaustive 4-tier test suites (Big-O scaling tests, DOM leak checks, STRIDE/OWASP cyber attack scripts) is **strictly disabled**. Hackathon judges evaluate visual polish, core problem solving, and a flawless 2-minute live demo.

Phase 6 enforces **Golden-Path Smoke Verification**: ensuring code compiles cleanly without fatal syntax/type errors and the 2-minute judge presentation path executes in the browser without unhandled runtime crashes or red console errors.

---

## 🧪 The 2 Hackathon Verification Gates

```yaml
hackathon_verification_gates:
  gate_1_compilation_and_types:
    category: "Build & Syntax Gate"
    objective: "Guarantee that the application builds cleanly with zero fatal compiler or linter errors."
    command: "npm run build" # or "tsc --noEmit"
    exit_criteria:
      - "Build exit code 0"
      - "Zero blocking TypeScript type errors"
      - "No broken module imports or syntax parse errors"

  gate_2_golden_path_demo:
    category: "Live Demo Walkthrough Gate"
    objective: "Verify that the entire 2-minute judge walkthrough executes smoothly in the browser."
    environment: "Localhost browser (or preview build)"
    verification_checklist:
      - "Landing/Hero view loads instantly (<1s)"
      - "'⚡ Load Judge Demo' preset button reliably hydrates state in 1 click"
      - "Primary differentiating feature (the 'Wedge') executes to completion"
      - "DevTools Console has zero red unhandled exceptions or error crashes"
      - "Offline fallback fixture triggers seamlessly if external APIs are unreachable"
```

---

## 🛡️ Tri-Layer Fail-Safe Shield Verification

To guarantee zero live demo crashes during judging:

1. **Instant Offline Mock Fallbacks**:
   Every external API call (OpenAI, Gemini, third-party REST endpoints) must be wrapped with a fallback to pre-seeded local JSON (`src/mock/demo_fallback.json`). If the API request times out (>3000ms), returns 429/500, or wifi drops, the UI seamlessly renders the pre-recorded fixture.
2. **The "⚡ Load Judge Demo" Preset Button**:
   Ensure the preset button populates all input forms with realistic, persuasive data so the presenter never has to type manually under pressure during the pitch.

---

## ⚠️ Enterprise Testing Suspension Notice

- **Type 1 (Space & Time Complexity)**: Benchmark tests (`performance.now()`) are **disabled**. Smooth 60fps rendering is verified visually in the browser.
- **Type 3 (DOM Leak & Chaos Tests)**: Dedicated chaos tests are **disabled**. Component rendering is checked manually.
- **Type 4 (STRIDE / OWASP Security Fuzzing)**: Dedicated security test scripts (`*.security.test.ts`) are **disabled**. The prototype is a local demonstration, not a publicly deployed banking portal.
- **Targeted Unit Tests (Exception Only)**: Write unit tests *only* if your project includes a complex, mission-critical mathematical algorithm where a silent logic flaw would invalidate the demo pitch.
