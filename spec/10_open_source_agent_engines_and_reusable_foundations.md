# Open-Source Agent Engines & Reusable Foundations
## Accelerated Architecture Integration: awesome-llm-apps & agency-agents

> **Source Repositories Analyzed:**
> - [`Shubhamsaboo/awesome-llm-apps`](https://github.com/Shubhamsaboo/awesome-llm-apps) (100+ open-source AI agents, ADK crash courses, Agentic RAG)
> - [`msitarzewski/agency-agents`](https://github.com/msitarzewski/agency-agents) (328 specialized production AI agent personas, orchestration, and zero-trust verification)  
> **Designated Skills:** `spec-driven-development`, `api-and-interface-design`, `cyber-security-frameworks`

---

## 1. Executive Strategy: Pre-Built Agents Over Ground-Up Reinvention

Rather than manually writing agent prompt pipelines, state loops, and ticket formatting from scratch, we directly adopt battle-tested, production-proven agent architectures from **`awesome-llm-apps`** and **`agency-agents`**, customizing them with NovaMart's ground-truth database and versioned policies.

```yaml
accelerated_integration_strategy:
  objective: "Accelerate backend delivery by directly embedding pre-built open-source agent patterns."
  core_benefits:
    1_speed: "Saves 2+ hours of boilerplate development during the hackathon speedrun."
    2_battle_tested_prompts: "Adopts production-grade persona and zero-trust instruction architectures."
    3_native_adk_and_gemini: "Direct compatibility with Google ADK and modern google-genai SDK."
    4_modular_customization: "Plugs NovaMart's 7 datasets and 10 tools directly into pre-built slots."
```

---

## 2. Component Analysis & Extraction from `awesome-llm-apps`

From `Shubhamsaboo/awesome-llm-apps`, we extract four key modular engines:

### 2.1 Google ADK Customer Support Ticket Agent
* **Source Path:** `ai_agent_framework_crash_course/google_adk_crash_course/3_structured_output_agent/3_1_customer_support_ticket_agent/customer_support_agent/agent.py`
* **Direct Reusable Components:**
  - Pydantic models for structured escalation and ticket generation:
    ```python
    from enum import Enum
    from pydantic import BaseModel, Field

    class Priority(str, Enum):
        LOW = "low"
        MEDIUM = "medium"
        HIGH = "high"
        CRITICAL = "critical"

    class SupportTicket(BaseModel):
        title: str = Field(description="A concise summary of the issue")
        description: str = Field(description="Detailed description of the problem")
        priority: Priority = Field(description="The ticket priority level")
        category: str = Field(description="The department this ticket belongs to")
        steps_to_reproduce: list[str] | None = Field(default=None)
        estimated_resolution_time: str = Field(description="Estimated resolution time")
    ```
  - *NovaMart Customization:* Powers our `escalate_to_human` tool and `create_support_ticket` tool with official NovaMart priority SLAs (Critical: 15m, High: 1h, Medium: 4h, Low: 24h).

### 2.2 Customer Support Agent with Multi-Turn Memory
* **Source Path:** `advanced_ai_agents/single_agent_apps/ai_customer_support_agent/customer_support_agent.py`
* **Direct Reusable Components:**
  - Context building from historical sessions:
    ```python
    def build_memory_context(prior_conversations: list) -> str:
        context = "Relevant past conversations & verified facts:\n"
        for conv in prior_conversations:
            context += f"- [{conv['started_at']}] {conv['summary']}\n"
        return context
    ```
  - *NovaMart Customization:* Connects directly to `conversations.json` and `support_tickets.csv` to resolve pronouns ("it", "the photo from yesterday") without re-asking questions.

### 2.3 Forensic Fraud & Discrepancy Cross-Examiner
* **Source Path:** `advanced_ai_agents/single_agent_apps/ai_fraud_investigation_agent/fraud_investigation_agent.py`
* **Direct Reusable Components:**
  - Forensic reasoning prompt template:
    *"You are not a chatbot; you are an investigator. Treat claims as unverified assertions until cross-examined against public records."*
  - *NovaMart Customization:* Powers our Level 4 customer input sanitization and OTP delivery conflict detector.

### 2.4 Gemini Agentic RAG Engine
* **Source Path:** `rag_tutorials/gemini_agentic_rag/agentic_rag_gemini.py`
* **Direct Reusable Components:**
  - Native initialization of `from google import genai` (`genai.Client()`).
  - Low-temperature tool calling configuration with `types.GenerateContentConfig`.

---

## 3. Persona & System Architecture Extraction from `agency-agents`

From `msitarzewski/agency-agents`, we extract two elite operational agent blueprints:

### 3.1 Agentic Identity & Trust Architect (`specialized/agentic-identity-trust.md`)
* **Core Philosophy:**
  > *"Ensures every AI agent can prove who it is, what it's allowed to do, and what it actually did. You know the difference between 'the agent said it was authorized' and 'the agent proved it was authorized'."*
* **Direct Implementation in NovaMart:**
  - Injected as our **Level 1 System Authority Guardrail**:
    1. Zero-trust by default: Never take user-stated dollar amounts or delivery states as proof.
    2. Tamper-evident execution: Every mutation must record order ID, amount, and policy citation.
    3. Strict permission boundaries: Intercept any attempt to refund above ₹75,000 (v2) or ₹1,00,000 (v1).

### 3.2 Multi-Agent Systems Architect (`engineering/engineering-multi-agent-systems-architect.md`)
* **Core Philosophy:**
  > *"Treats a team of AI agents like a distributed system — if it only survives the demo and not production load, ambiguous inputs, and cascading failures, it isn't architecture yet."*
* **Direct Implementation in NovaMart:**
  - Enforces our 4 explicit terminal states (`ANSWER`, `ASK`, `ACT`, `ESCALATE`).
  - Guarantees graceful degradation: If live Gemini API drops, fallback to deterministic offline rules engine.

---

## 4. Master Integrated Agent Topology

Combining the pre-built components into a unified, high-speed NovaMart backend:

```
+-------------------------------------------------------------------------------+
| INCOMING REQUEST (Customer Message, Session ID, Timestamp)                     |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| 1. INTENT & MEMORY INTAKE (from awesome-llm-apps customer_support_agent)      |
|    - Inject prior conversations from conversations.json (resolve pronouns)    |
|    - Structured classification via Pydantic InquiryCategory                   |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| 2. ZERO-TRUST FORENSIC AUDITOR (from agency-agents agentic-identity-trust)     |
|    - L1 System Rules > L2 Policy > L3 Tools > L4 Customer Input               |
|    - Cross-examine customer claims against SQLite database (Ground Truth)     |
|    - Detect fake orders, duplicate claims, and OTP contradictions             |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| 3. DETERMINISTIC POLICY ENGINE (NovaMart v1 vs v2 Rule Engine)                 |
|    - Resolve Policy Version: order_date < June 2026 -> v1, else -> v2        |
|    - Compute calendar window: delivery_date + window + loyalty extension       |
|    - Compute restocking fee: 5% max ₹2,500 on v2 Laptops/Tablets/Cams/Monitors |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| 4. STRUCTURED ACTION & ESCALATION (from awesome-llm-apps ticket_agent)         |
|    - If safe & verified: execute create_refund / create_return                 |
|    - If threshold exceeded or fraud detected: generate SupportTicket          |
|    - Emit Terminal Move: ANSWER / ASK / ACT / ESCALATE                         |
+-------------------------------------------------------------------------------+
```

---

## 5. Summary of Reusable Assets for Fast Implementation

| Asset Name | Source Repo | Target File in Our Project | Development Time Saved |
| :--- | :--- | :--- | :--- |
| **`SupportTicket` Schema** | `awesome-llm-apps` | `backend/engine/tools.py` | 30 minutes |
| **Memory Builder** | `awesome-llm-apps` | `backend/engine/agent_loop.py` | 30 minutes |
| **Zero-Trust System Prompt** | `agency-agents` | `backend/engine/guardrail_interceptor.py` | 45 minutes |
| **Forensic Cross-Examiner** | `awesome-llm-apps` | `backend/engine/policy_rules.py` | 30 minutes |
| **FastAPI Agent Runner** | `ambient-expense-agent` | `backend/main.py` | 30 minutes |
| **Total Estimated Time Saved:** | | | **~2 hours 45 minutes** |
