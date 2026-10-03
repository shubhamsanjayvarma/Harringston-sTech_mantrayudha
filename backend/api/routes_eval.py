"""Evaluation API endpoints for NovaMart Customer Support Agent.

Enables automated batch evaluation across all official benchmark scenarios:
- Calculates pass rates against ground-truth expected moves
- Benchmarks latency (avg ms per decision)
- Summarizes decision fidelity for the judge panel
"""

import time
from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

from backend.api.routes_demo import DEMO_SCENARIOS, run_preset

router = APIRouter(prefix="/api/eval", tags=["Evaluation"])

# In-memory storage for the latest batch evaluation run
_LATEST_EVAL_CACHE: Optional[Dict[str, Any]] = None


class ScenarioEvalResult(BaseModel):
    scenario_id: str
    title: str
    customer: str
    expected_move: str
    actual_move: str
    status: str
    execution_time_ms: float
    ticket_created: bool
    response_preview: str


class BatchEvalResponse(BaseModel):
    total_scenarios: int
    passed_scenarios: int
    failed_scenarios: int
    pass_rate_percentage: float
    avg_latency_ms: float
    total_duration_ms: float
    scenarios: List[ScenarioEvalResult]


@router.post("/run-all", response_model=BatchEvalResponse)
async def run_all_scenarios() -> BatchEvalResponse:
    """Executes all 6 official judge scenarios sequentially and compiles evaluation metrics."""
    global _LATEST_EVAL_CACHE
    start_total = time.perf_counter()
    results: List[ScenarioEvalResult] = []
    latencies: List[float] = []

    for scenario_id in DEMO_SCENARIOS.keys():
        scenario_output = await run_preset(scenario_id)
        is_pass = scenario_output["status"] == "PASS"
        latency = scenario_output["execution_time_ms"]
        latencies.append(latency)

        preview = scenario_output["agent_response"]
        if len(preview) > 120:
            preview = preview[:117] + "..."

        results.append(
            ScenarioEvalResult(
                scenario_id=scenario_id,
                title=scenario_output["title"],
                customer=scenario_output["customer"],
                expected_move=scenario_output["expected_move"],
                actual_move=scenario_output["actual_move"],
                status="PASS" if is_pass else "FAIL",
                execution_time_ms=latency,
                ticket_created=bool(scenario_output.get("created_ticket_id")),
                response_preview=preview,
            )
        )

    total_duration = round((time.perf_counter() - start_total) * 1000, 2)
    passed_count = sum(1 for r in results if r.status == "PASS")
    total_count = len(results)
    pass_rate = round((passed_count / total_count * 100) if total_count > 0 else 0.0, 1)
    avg_latency = round(sum(latencies) / len(latencies), 2) if latencies else 0.0

    eval_data = {
        "total_scenarios": total_count,
        "passed_scenarios": passed_count,
        "failed_scenarios": total_count - passed_count,
        "pass_rate_percentage": pass_rate,
        "avg_latency_ms": avg_latency,
        "total_duration_ms": total_duration,
        "scenarios": [r.model_dump() for r in results],
    }
    _LATEST_EVAL_CACHE = eval_data

    return BatchEvalResponse(**eval_data)


@router.get("/summary")
async def get_eval_summary() -> Dict[str, Any]:
    """Retrieves the most recent evaluation metrics or a default status."""
    if _LATEST_EVAL_CACHE is not None:
        return _LATEST_EVAL_CACHE
    return {
        "status": "NOT_RUN_YET",
        "message": "Call POST /api/eval/run-all to execute the official benchmark suite.",
        "benchmark_scenarios_available": len(DEMO_SCENARIOS),
    }
