"""Unit tests for Gemini 2.5 Flash reasoning integration & fallback in NovaMartAgentLoop."""

from datetime import datetime
from unittest.mock import MagicMock, patch
import pytest

from backend.engine.agent_loop import NovaMartAgentLoop
from backend.engine.workflow_graph import TerminalMove


def test_agent_loop_offline_fallback():
    """Verifies that NovaMartAgentLoop works cleanly in offline mode or when API key is missing."""
    loop = NovaMartAgentLoop(use_gemini=False)
    result = loop.process_message(
        customer_id="CUST-00001",
        message="What is your return policy?",
        reference_time=datetime(2026, 10, 3, 14, 0, 0),
        offline_mode=True,
    )
    assert result["terminal_move"] == "ANSWER"
    assert "return" in result["response"].lower() or "policy" in result["response"].lower()
    assert result["execution_time_ms"] > 0


def test_agent_loop_gemini_turn_mocked():
    """Verifies that _execute_gemini_turn handles live model responses with tools."""
    loop = NovaMartAgentLoop(use_gemini=True)
    loop.api_key = "fake_test_key"

    mock_client = MagicMock()
    mock_chat = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Per NovaMart Return Policy v2 §3, you have a 7-day change of mind window for electronics."
    mock_chat.send_message.return_value = mock_response
    mock_client.chats.create.return_value = mock_chat

    with patch("google.genai.Client", return_value=mock_client):
        result = loop.process_message(
            customer_id="CUST-00001",
            message="Can I return an item after 5 days?",
            reference_time=datetime(2026, 10, 3, 14, 0, 0),
            offline_mode=False,
        )

        assert result["terminal_move"] in ["ANSWER", "ASK", "ACT", "ESCALATE"]
        assert "NovaMart" in result["response"]
        # Audit trace should include Gemini reasoning stage
        trace_stages = [t["stage"] for t in result["audit_trace"]]
        assert "06_reason" in trace_stages or "05_retrieve_policy" in trace_stages


def test_agent_loop_gemini_exception_graceful_fallback():
    """Verifies that if the Gemini API throws a network or quota error, it falls back without crashing."""
    loop = NovaMartAgentLoop(use_gemini=True)
    loop.api_key = "fake_test_key"

    mock_client = MagicMock()
    mock_client.chats.create.side_effect = RuntimeError("Rate limit 429 quota exceeded")

    with patch("google.genai.Client", return_value=mock_client):
        result = loop.process_message(
            customer_id="CUST-00001",
            message="Where is my order?",
            reference_time=datetime(2026, 10, 3, 14, 0, 0),
            offline_mode=False,
        )

        # Must NOT crash! Must fall back to deterministic response:
        assert result["terminal_move"] in ["ANSWER", "ASK"]
        assert len(result["response"]) > 0
        # Audit trace should have fallback entry
        fallback_entries = [t for t in result["audit_trace"] if "fallback" in t["detail"].lower()]
        assert len(fallback_entries) > 0
