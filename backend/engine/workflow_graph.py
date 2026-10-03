"""ADK 2.0 Graph Workflow Engine & State Nodes.

Implements the 9-stage reasoning loop defined in spec/01 (The Agent Loop)
and spec/09 (ADK 2.0 Workflow Engine & Deployment Specification).

Stages:
01. USER REQUEST
02. UNDERSTAND
03. COLLECT INFO
04. VERIFY
05. RETRIEVE POLICY
06. REASON
07. DECIDE
08. ACTION
09. VERIFY RESULT -> Emits Terminal Move (ANSWER | ASK | ACT | ESCALATE)
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional


class TerminalMove(str, Enum):
    ANSWER = "ANSWER"
    ASK = "ASK"
    ACT = "ACT"
    ESCALATE = "ESCALATE"


class WorkflowStage(str, Enum):
    USER_REQUEST = "01_user_request"
    UNDERSTAND = "02_understand"
    COLLECT_INFO = "03_collect_info"
    VERIFY = "04_verify"
    RETRIEVE_POLICY = "05_retrieve_policy"
    REASON = "06_reason"
    DECIDE = "07_decide"
    ACTION = "08_action"
    VERIFY_RESULT = "09_verify_result"


@dataclass
class WorkflowContext:
    """Carries end-to-end conversation and execution state across nodes."""
    customer_id: str
    message: str
    conversation_id: Optional[str] = None
    reference_time: Optional[datetime] = None
    offline_mode: bool = False

    # Stage outputs
    current_stage: WorkflowStage = WorkflowStage.USER_REQUEST
    sanitized_message: str = ""
    parsed_intents: List[Dict[str, Any]] = field(default_factory=list)
    collected_entities: Dict[str, Any] = field(default_factory=dict)
    verification_checks: List[Dict[str, Any]] = field(default_factory=list)
    applicable_policy_version: str = "v2"
    rule_verdicts: List[Dict[str, Any]] = field(default_factory=list)
    tools_called: List[Dict[str, Any]] = field(default_factory=list)
    terminal_move: TerminalMove = TerminalMove.ANSWER
    terminal_reason: str = ""
    response_text: str = ""
    execution_trace: List[Dict[str, Any]] = field(default_factory=list)
    created_ticket_id: Optional[str] = None

    def log_stage(self, stage: WorkflowStage, detail: str, data: Optional[Dict[str, Any]] = None) -> None:
        """Records an immutable audit trace entry."""
        self.current_stage = stage
        entry = {
            "stage": stage.value,
            "timestamp": datetime.now().isoformat(),
            "detail": detail,
            "data": data or {},
        }
        self.execution_trace.append(entry)


class ADKWorkflowGraph:
    """Coordinates state transitions across the 9-stage loop."""

    @staticmethod
    def transition(ctx: WorkflowContext, next_stage: WorkflowStage, reason: str) -> None:
        ctx.log_stage(next_stage, f"Transitioning to {next_stage.value}: {reason}")
