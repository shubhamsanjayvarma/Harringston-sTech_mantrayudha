# Phase 6: Lean 4-Tier TDD & Security Verification Specification

> **File:** `spec_universal/hackathon_pipeline/06_lean_4tier_tdd_and_security.md`  
> **Parent Protocol:** `00_master_hackathon_operating_system.md`  
> **Source Synthesis:** `Universal_Project_Boilerplate` (`spec_universal/tdd_4tier_testing_template.md`)  
> **Execution Mode:** Automated test-driven development + STRIDE threat verification  
> **Designated Skills:** `test-driven-development`, `cyber-security-frameworks`, `systematic-debugging`

---

## 🎯 Objective

Implement an **automated, fast-executing 4-tier test suite** tailored for hackathon velocity ($<30\text{ seconds}$ total runtime). Proves to hackathon judges that your MVP is not fragile vaporware, but a resilient, high-performance, and secure software system.

---

## 🧪 The 4-Tier Hackathon Testing Matrix

```yaml
hackathon_tdd_matrix:
  tier_1_performance_and_bounds:
    category: "Space & Time Complexity Testing"
    objective: "Verify that core algorithms and API responses execute well within live judging presentation limits."
    target_bounds:
      api_latency: "p95 < 4000ms (using performance.now())"
      client_render_time: "< 150ms for complex visualizations"
    test_file_pattern: "tests/performance/**/*.perf.test.ts"

  tier_2_logic_and_state_machine:
    category: "Core Functional Logic & FSM Testing"
    objective: "Verify all state transitions on the Golden Demo Path and ensure graceful handling of edge cases."
    target_coverage:
      - "Full execution of the primary Golden Path"
      - "Handling empty inputs, malformed URLs, and null payloads"
      - "Zero division and boundary conditions"
    test_file_pattern: "tests/unit/**/*.test.ts"

  tier_3_ui_and_contract_integration:
    category: "Integration & Contract Testing"
    objective: "Verify frontend component mounting, typed API contract enforcement, and offline fallback switches."
    target_coverage:
      - "Hero comparison component mounts without crashing"
      - "Offline fallback JSON fixture successfully loads when external API is unreachable"
      - "Demo preset button reliably hydrates state"
    test_file_pattern: "tests/integration/**/*.test.tsx"

  tier_4_stride_and_owasp_security:
    category: "Cyber Attack & Input Hardening (STRIDE / OWASP)"
    objective: "Active adversarial fuzzing on all demo input fields to ensure zero vulnerability to injection or XSS."
    threat_vectors:
      xss: "Inject `<script>alert('pwned')</script>` -> verify sanitized output"
      injection: "Inject SQL / NoSQL tautologies (`' OR '1'='1`) -> verify rejection"
      dos_payloads: "Send 10MB payload -> verify 413 Payload Too Large or size-capped rejection"
    test_file_pattern: "tests/security/**/*.security.test.ts"
```

---

## 💻 Concrete Test Suite Templates

### 1. Type 1 Performance Bounds Test (`tests/performance/latency.perf.test.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { executeCoreWorkflow } from '../../src/services/core_engine';

describe('Type 1: Time & Space Complexity Bounds', () => {
  it('executes core workflow within the 4-second demo threshold', async () => {
    const start = performance.now();
    const result = await executeCoreWorkflow({ mode: 'fast' });
    const duration = performance.now() - start;

    expect(result).toBeDefined();
    // 4000ms upper bound ensures smooth demo pacing
    expect(duration).toBeLessThan(4000);
  });
});
```

### 2. Type 2 Logic & Edge Case Test (`tests/unit/workflow.test.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { transformPayload } from '../../src/services/transformer';

describe('Type 2: Functional Logic & State Transitions', () => {
  it('correctly inverts competitor flaw into leverage output', () => {
    const input = { legacyFlawPresent: true, sampleCount: 50 };
    const output = transformPayload(input);

    expect(output.flawEliminated).toBe(true);
    expect(output.speedMultiplier).toBeGreaterThan(1.0);
  });

  it('handles empty or malformed inputs without throwing unhandled exceptions', () => {
    expect(() => transformPayload(null as any)).not.toThrow();
    const fallback = transformPayload({} as any);
    expect(fallback.status).toBe('safe_default');
  });
});
```

### 3. Type 3 UI & Offline Fallback Integration Test (`tests/integration/demo_shield.test.tsx`)
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DemoView } from '../../src/components/DemoView';
import fallbackFixture from '../../src/mock/demo_fallback.json';

describe('Type 3: UI Rendering & Offline Fallback Shields', () => {
  it('renders hero view cleanly with fallback fixture when API is offline', () => {
    render(<DemoView initialData={fallbackFixture} isOffline={true} />);
    expect(screen.getByText(/Leverage Kill Feature/i)).toBeInTheDocument();
    expect(screen.getByTestId('demo-status-pill')).toHaveTextContent(/Offline Ready/i);
  });
});
```

### 4. Type 4 STRIDE / OWASP Security Fuzzing Test (`tests/security/input_hardening.security.test.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../../src/utils/sanitizer';

describe('Type 4: STRIDE & OWASP Input Hardening', () => {
  it('sanitizes malicious script tags (Tampering / XSS)', () => {
    const maliciousInput = "<img src=x onerror=alert('xss')><script>eval('evil')</script>";
    const cleaned = sanitizeInput(maliciousInput);

    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('onerror=');
  });

  it('rejects oversized Denial of Service (DoS) memory payloads', () => {
    const hugePayload = 'A'.repeat(5 * 1024 * 1024); // 5MB string
    expect(() => sanitizeInput(hugePayload)).toThrow(/Payload exceeds maximum size/i);
  });
});
```

---

## 🚀 Execution & Verification Commands

Add a single consolidated script to `package.json`:
```json
"scripts": {
  "test:all": "vitest run",
  "test:perf": "vitest run tests/performance",
  "test:security": "vitest run tests/security",
  "test:fast": "vitest run --reporter=verbose"
}
```

**Quality Checklist Before Committing:**
- [ ] All 4 test types represented in `tests/`.
- [ ] Entire test suite executes in $<30\text{ seconds}$ locally.
- [ ] Zero failing tests or unhandled promise rejections.
- [ ] Pre-commit hook (`.githooks/pre-commit`) passes cleanly without `--no-verify`.
