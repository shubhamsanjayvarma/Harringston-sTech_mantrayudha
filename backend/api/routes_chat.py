"""Chat API endpoints for NovaMart Customer Support Agent."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.engine.agent_loop import NovaMartAgentLoop

router = APIRouter(prefix="/api/chat", tags=["Chat"])
_agent_loop = NovaMartAgentLoop()


class ChatRequest(BaseModel):
    customer_id: str = Field(..., description="Unique customer ID (e.g. CUST-00001)")
    message: str = Field(..., description="Customer message text")
    conversation_id: Optional[str] = Field(default=None, description="Optional active conversation ID")
    reference_time: Optional[str] = Field(default=None, description="ISO-8601 simulated conversation timestamp")
    offline_mode: bool = Field(default=False, description="Force offline rule execution")
    history: Optional[List[Dict[str, Any]]] = Field(default=None, description="Prior conversation dialogue turns")


class ChatResponse(BaseModel):
    customer_id: str
    terminal_move: str
    response: str
    created_ticket_id: Optional[str] = None
    execution_time_ms: float
    audit_trace: List[Dict[str, Any]]


@router.post("", response_model=ChatResponse)
async def process_chat(req: ChatRequest) -> ChatResponse:
    """Processes customer dialogue through the 9-stage verified agent loop."""
    ref_dt = None
    if req.reference_time:
        try:
            ref_dt = datetime.fromisoformat(req.reference_time)
        except ValueError:
            pass

    try:
        result = _agent_loop.process_message(
            customer_id=req.customer_id,
            message=req.message,
            conversation_id=req.conversation_id,
            reference_time=ref_dt,
            offline_mode=req.offline_mode,
            history=req.history,
        )
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent loop error: {str(e)}")
