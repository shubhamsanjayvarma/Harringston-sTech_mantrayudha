# Hackathon Speedrun Verification Template — Reusable Agent Instructions

> **Purpose:** This document is the lean, high-velocity smoke verification template for ~6-hour hackathons and venture build competitions. It replaces heavy enterprise 4-tier TDD with pragmatic, crash-proof demo verification.

---

## ⚡ The Speedrun Verification Philosophy

In a 6-hour hackathon:
- **Judges evaluate:** Visual design, interaction polish, authentic problem solving, and a rock-solid 2-minute live demo.
- **Judges do NOT evaluate:** Big-O allocation benchmarks, DOM memory leak assertions, or STRIDE threat fuzzing.
- **Goal:** 100% crash-proof demo readiness, zero build errors, zero red console crashes during presentation.

---

## 🎯 The 2 Verification Gates

Every milestone or feature must pass 2 objective gates before claiming completion:

### Gate 1: Compilation & Typing Gate
Run the project build or type-check command:
```bash
npm run build
# OR
npx tsc --noEmit
```
**Exit Criteria:**
- Exit code 0.
- Zero fatal TypeScript syntax or typing errors.
- Modern JSX TS6133 zero-unused-imports compliance.

### Gate 2: The Golden-Path Demo Walkthrough Gate
Verify in a local browser (or automated browser tool):
1. **Initial Mount**: Landing/Dashboard view mounts cleanly without blank screens.
2. **"⚡ Load Judge Demo" Preset**: Clicking the preset hydrates form inputs instantly with realistic data.
3. **Core Differentiating Feature (The "Wedge")**: Executes end-to-end and renders final result.
4. **Console Cleanliness**: Zero unhandled `TypeError`, `ReferenceError`, or red unhandled promise rejections in DevTools console.
5. **Fail-Safe Fallback Shield**: If external APIs are unavailable or slow (>3s), verify that pre-seeded local JSON fixtures load silently without displaying broken states.

---

## 🛡️ Exception: Targeted Unit Tests Only

Write unit tests **only** when your solution relies on a complex, core mathematical or algorithmic data transformation where a silent logic flaw would directly invalidate the demo pitch (e.g., custom optimization algorithm, complex financial calculation).

For standard UI components, state management, and API calls, verify visually in the browser rather than spending time writing mock test harnesses.
