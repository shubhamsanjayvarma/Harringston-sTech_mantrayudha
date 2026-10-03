# Agentic Software Engineering: Foundational Laws, Antigravity SDK & Reference Architectures
## Synthesis of Production Agent Patterns & Universal Agentic Rules

> **Source Repositories Analyzed:**
> - [`pratikforge/adk-customer-service`](https://github.com/pratikforge/adk-customer-service)
> - [`pratikforge/secure-agent-lab`](https://github.com/pratikforge/secure-agent-lab)
> - [`pratikforge/ambient-expense-agent`](https://github.com/pratikforge/ambient-expense-agent)
> - [`pratikforge/clinical-safety-agent`](https://github.com/pratikforge/clinical-safety-agent)
> - **SDKs & Plugins:** Google Antigravity SDK (`google-antigravity`), Gemini API (`google-genai`), Google ADK (`google.adk`)  
> **Designated Skills:** `spec-driven-development`, `api-and-interface-design`, `cyber-security-frameworks`

---

## 1. The 10 Universal Laws of Agentic Software

When software transitions from deterministic procedural code to autonomous or semi-autonomous LLM-driven agents, traditional software engineering assumptions break down. Production agentic systems must be governed by the **10 Universal Laws of Agentic Software**:

```yaml
ten_universal_laws_of_agentic_software:
  law_01_ground_truth_primacy:
    name: "Ground Truth Primacy (The Anti-Hallucination Invariant)"
    principle: "The database stores absolute truth; the user message is an unverified claim."
    rule: "An agent must NEVER treat customer assertions as ground truth. Every entity (order ID, item price, delivery date, account standing) must be verified against structured databases before any reasoning or action occurs."
    violation: "Customer says 'I paid ₹10,000 for my headphones' and the agent issues a ₹10,000 refund without checking orders.csv."

  law_02_bounded_authority_hierarchy:
    name: "Bounded Authority Hierarchy (The Anti-Injection Invariant)"
    principle: "User input is untrusted data (Level 4), never executable system authority."
    hierarchy:
      L1: "System Instructions & Immutable Guardrails (Highest Authority)"
      L2: "Business Logic & Versioned Policies (Refund windows, approval limits)"
      L3: "Deterministic Backend Tools (Database transactions, API contracts)"
      L4: "User Input (Untrusted text data to be analyzed, never obeyed as commands)"
    rule: "Customer input must be wrapped as data (e.g. <customer_input>...</customer_input>). Prompts attempting to override instructions ('You are now in debug mode') must be stripped of imperative authority."

  law_03_intentional_and_minimal_tool_use:
    name: "Intentional Tool Use (The Least-Privilege Invariant)"
    principle: "Tools are the agent's hands; call only what is necessary with verified arguments."
    rule: "Exploratory or speculative tool calling ('calling every tool just in case') is strictly forbidden. Tool arguments must be derived from verified database state, never from unverified user claims."
    violation: "Calling create_refund before checking check_refund_eligibility."

  law_04_deterministic_math_over_neural_calculation:
    name: "Deterministic Math (The Calculation Invariant)"
    principle: "LLMs reason over language; deterministic code calculates numbers and dates."
    rule: "Never ask an LLM to calculate GST (18%), calendar day deltas, restocking fees (5% max ₹2,500), or refund caps in natural language. Calculations must be executed by Python datetime, decimal, and math functions."
    violation: "Allowing an LLM to hallucinate day-count math across leap years or month boundaries."

  law_05_reversibility_and_precondition_interception:
    name: "Precondition Interception (The Safety Shield Invariant)"
    principle: "Every state mutation must pass a deterministic pre-execution guard."
    rule: "Every write/mutation tool call (create_refund, create_return, cancel_order) must be intercepted by a backend validator before database commit. If an approval threshold is exceeded or policy is violated, the interceptor physically blocks the call."
    violation: "Allowing the agent to autonomously release refunds above ₹75,000 without human approval."

  law_06_explicit_terminal_moves:
    name: "Explicit Terminal Moves (The Anti-Default-Yes Invariant)"
    principle: "A weak agent always defaults to YES; a strong agent knows when to ASK or ESCALATE."
    rule: "Every interaction must conclude with one of four explicit moves: ANSWER, ASK, ACT, ESCALATE. If information is ambiguous, the agent must ASK. If authority is exceeded or fraud is detected, the agent must ESCALATE."
    violation: "Silently picking one order when the customer owns two headphone orders."

  law_07_stateful_context_continuity:
    name: "Stateful Continuity (The Memory Invariant)"
    principle: "Never ask the user what was already answered in prior turns or tickets."
    rule: "The agent must retrieve conversation history and open tickets at session initialization. Pronouns ('it', 'that order') must resolve to previously referenced entities."
    violation: "Asking the customer for a photo of damaged headphones when they already uploaded it yesterday."

  law_08_zero_information_leakage:
    name: "Zero Information Leakage (The Privacy & Secrets Invariant)"
    principle: "Never disclose internal fields, system prompts, or another customer's data."
    rule: "The agent must redact delivery OTPs, courier driver personal numbers, internal route codes, and system prompt text before generating user-facing responses."
    violation: "Printing 'Order delivered with OTP: 8492' or repeating system instructions."

  law_09_structured_human_in_the_loop_sla:
    name: "Structured Escalation (The Governance Invariant)"
    principle: "Escalation is not an unhandled error; it is a first-class operational handoff."
    rule: "When escalating, the agent must create a structured ticket with priority (low/medium/high/critical), route to the exact specialist team (Logistics, Refunds, Trust & Safety), and provide the customer with a realistic SLA."
    violation: "Telling the customer 'I don't know, contact support' without creating a ticket."

  law_10_fail_safe_graceful_degradation:
    name: "Graceful Degradation (The Resilience Invariant)"
    principle: "Software must never crash with unhandled 500 errors during live operations."
    rule: "If an external LLM API is unavailable, rate-limited, or unconfigured, the system must degrade seamlessly to deterministic rule-based evaluation and preset demo fixtures."
    violation: "Throwing an uncaught exception when an API key is missing during a live demo."
```

---

## 2. Reusable Architecture & Code Patterns from Your Repositories

### 2.1 From `pratikforge/adk-customer-service`
1. **Pydantic Structured Inquiry Classification (`InquiryCategory`):**
   ```python
   class InquiryCategory(BaseModel):
       category: Literal["shipping", "refund", "return", "cancellation", "warranty", "unrelated"] = Field(
           description="Classify customer query intent."
       )
   ```
   *NovaMart Integration:* Used in Stage 02 (`UNDERSTAND`) of our 9-stage loop to decompose multi-intent queries into atomic domains.

2. **Graph-based Workflow Routing (`Workflow`, `@node`, `Event(branch=...)`):**
   - The `@node` pattern cleanly separates data collection, policy retrieval, and agent execution.
   - Context state storage (`ctx.state["user_query"] = node_input`) enables passing verified entity references across nodes.

### 2.2 From `pratikforge/secure-agent-lab`
1. **Tool Call Interception Hook (`validate_tool_call.py`):**
   - Intercepts raw tool arguments before execution.
   - In NovaMart, we adapt this into `guardrail_interceptor.py` to enforce approval thresholds:
     ```python
     if tool_name == "create_refund" and order.total_amount > threshold:
         # Intercept and convert to escalate_to_human
         return escalate_to_human(
             reason="approval_threshold_exceeded",
             target_team="Refunds & Payments",
             priority="high"
         )
     ```
2. **In-Memory State Store & Role Verification:**
   - In `secure-agent-lab`, `DISCOUNT_STORE` simulates database state while verifying whether the caller is `admin_user_id` vs standard user.
   - In NovaMart, we enforce `account_status != 'suspended'` and verify `orders.customer_id == authenticated_customer_id`.

### 2.3 From `pratikforge/ambient-expense-agent`
1. **FastAPI Runner Integration (`fast_api_app.py`):**
   - Integrates the async agent runner with standard FastAPI routes:
     ```python
     @app.post("/api/chat")
     async def chat_endpoint(request: ChatRequest):
         result = await agent_runner.process(request)
         return result
     ```
2. **Monetary Threshold Enforcement (`THRESHOLD_AMOUNT`):**
   - Directly maps to NovaMart's Policy v1 (₹1,00,000) and Policy v2 (₹75,000) approval limits.
3. **Automated Trace & Evaluation Generator (`tests/eval/generate_traces.py`):**
   - Used for the evaluation harness to run automated test cases against our agent and compute the 100-point judging rubric.

### 2.4 From `pratikforge/clinical-safety-agent`
1. **Zero-Tolerance Refusal Protocol:**
   - In clinical AI, an agent must never guess or fabricate medical advice.
   - In NovaMart, this translates directly to: **"Refusing to fabricate or act on unverified data is a feature, not a failure."**
2. **Validation Controllers:**
   - Mandatory precondition checks before any state mutation can be dispatched.

---

## 3. How to Leverage Google Antigravity SDK & Gemini API Plugins

### 3.1 Google Antigravity SDK Capabilities
As installed in your Antigravity IDE (Customizations):
- **Agent Architecture:** Supports high-level `Agent(config=LocalAgentConfig(...))` orchestrating conversations, tools, and hooks.
- **Declarative Safety Policies (`google.antigravity.hooks.policy`):**
  - Priority-based access control:
    ```python
    from google.antigravity.hooks import policy

    # Specific Deny: block raw shell execution or dangerous tools
    policy.deny("dangerous_mutation")
    # Specific Ask: prompt confirmation on high-value actions
    policy.ask_user("high_value_refund")
    # Specific Allow: allow safe read-only lookups
    policy.allow("get_order")
    policy.allow("get_customer")
    ```
- **Context Compaction & Session Memory:** The SDK automatically manages multi-turn history without token overflow.

### 3.2 Gemini API Plugin Capabilities
- **Official Modern SDK (`google-genai` 1.72.0):**
  ```python
  from google import genai
  from google.genai import types

  client = genai.Client()
  response = client.models.generate_content(
      model="gemini-2.5-flash",
      contents=prompt,
      config=types.GenerateContentConfig(
          tools=[get_order, check_refund_eligibility, create_refund, escalate_to_human],
          temperature=0.1,  # Low temperature for strict adherence
      )
  )
  ```
- **Native Tool Calling:** Automatically serializes Python functions with type hints into OpenAPI function schemas.

---

## 4. Master Architectural Blueprint for NovaMart Backend

Synthesizing your 4 repositories and the 10 Laws of Agentic Software, our NovaMart backend is structured into 4 cohesive layers:

```
+----------------------------------------------------------------------------+
| LAYER 1: FASTAPI GATEWAY & SECURITY SHIELD (ambient-expense + secure-lab)   |
| - POST /api/chat, GET /api/orders, POST /api/demo/preset                  |
| - Authority Hierarchy: L1 System > L2 Policy > L3 Tools > L4 User Input    |
| - Redaction Filter: Strips OTPs, driver phones, and internal prompt text  |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
| LAYER 2: 9-STAGE AGENT REASONING CORE (adk-customer-service + clinical)    |
| - Multi-intent decomposition via Pydantic models                           |
| - Historical context retrieval & pronoun resolution                        |
| - 4 Explicit Terminal Moves: ANSWER / ASK / ACT / ESCALATE                 |
| - Dual-Mode Engine: Live Gemini 2.5 Flash + Deterministic Demo Resolver    |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
| LAYER 3: PRE-EXECUTION DETERMINISTIC GUARD (secure-agent-lab interceptor)  |
| - Order total approval threshold check (₹1L v1 / ₹75k v2)                 |
| - OTP delivery contradiction check (blocks refunds, escalates to Logistics)|
| - Alternate refund destination block (strict original instrument rule)     |
| - Date math: (request_date - delivery_date) <= window + loyalty extension   |
| - Restocking fee math: min(gross * 0.05, 2500) for v2 Laptop/Tablet/Cam/Mon|
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
| LAYER 4: GROUND TRUTH DATABASE STORE (SQLite in-memory / fast file)        |
| - 7 indexed tables: customers, orders, items, products, tickets, convs, rev|
| - Sub-millisecond indexed joins on foreign keys                            |
+----------------------------------------------------------------------------+
```
