"""Automated API Endpoint Tests for NovaMart FastAPI Gateway.

Verifies:
- Root and Health check endpoints
- Data inspection endpoints (customers, orders, products)
- Demo presets listing and execution
- Chat processing endpoint
- Batch benchmark evaluation endpoints
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_root_index():
    """Verify root system metadata."""
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["service"] == "NovaMart AI Customer Support Agent Gateway"
    assert data["status"] == "ONLINE"
    assert "/docs" in data["documentation"]


def test_health_check():
    """Verify health check and database connectivity."""
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert data["orders_indexed"] >= 8000


def test_engine_status():
    """Verify policy constants and SLA configuration."""
    resp = client.get("/api/status")
    assert resp.status_code == 200
    data = resp.json()
    assert data["policy_transition"]["v1_approval_threshold_inr"] == 100000.0
    assert data["policy_transition"]["v2_approval_threshold_inr"] == 75000.0
    assert data["policy_transition"]["restocking_fee_rate"] == 0.05
    assert data["policy_transition"]["restocking_fee_max_inr"] == 2500.0


def test_data_inspection_customer():
    """Verify customer profile lookup and PII scrubbing."""
    resp = client.get("/api/data/customers/CUST-00001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["customer_id"] == "CUST-00001"
    assert "first_name" in data
    # Sensitive internal flags must not leak
    assert "delivery_otp_verified" not in data


def test_data_inspection_order():
    """Verify order detail lookup with joined items."""
    resp = client.get("/api/data/orders/ORD-000001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["order_id"] == "ORD-000001"
    assert "items" in data
    assert len(data["items"]) > 0


def test_data_inspection_product():
    """Verify product specifications lookup."""
    resp = client.get("/api/data/products/PROD-00001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["product_id"] == "PROD-00001"
    assert "price" in data


def test_demo_presets_list():
    """Verify listing of all 6 official judge scenarios."""
    resp = client.get("/api/demo/list")
    assert resp.status_code == 200
    presets = resp.json()
    assert len(presets) == 6
    scenario_ids = [p["scenario_id"] for p in presets]
    assert "scenario_01_order_tracking" in scenario_ids
    assert "scenario_06_otp_contradiction" in scenario_ids


def test_demo_run_preset():
    """Verify single 1-click execution for Scenario 1."""
    resp = client.post("/api/demo/run/scenario_01_order_tracking")
    assert resp.status_code == 200
    result = resp.json()
    assert result["status"] == "PASS"
    assert result["expected_move"] == "ANSWER"
    assert result["actual_move"] == "ANSWER"
    assert "audit_trace" in result
    assert len(result["audit_trace"]) >= 5


def test_chat_endpoint():
    """Verify POST /api/chat with offline_mode=True."""
    payload = {
        "customer_id": "CUST-00139",
        "message": "Where is my order ORD-001042?",
        "reference_time": "2026-10-03T14:00:00+05:30",
        "offline_mode": True,
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["terminal_move"] == "ANSWER"
    assert "ORD-001042" in data["response"]
    assert data["execution_time_ms"] > 0
    assert len(data["audit_trace"]) >= 5


def test_eval_batch_run_all():
    """Verify automated batch evaluation endpoint."""
    resp = client.post("/api/eval/run-all")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_scenarios"] == 6
    assert data["passed_scenarios"] == 6
    assert data["pass_rate_percentage"] == 100.0
    assert data["avg_latency_ms"] > 0


def test_eval_summary():
    """Verify retrieval of the latest benchmark summary."""
    resp = client.get("/api/eval/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_scenarios"] == 6
    assert data["passed_scenarios"] == 6
