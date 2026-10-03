"""
NovaMart Multi-Intent Decomposition & Dependency DAG Sequencer.
Implements Gap 07 (Multi-Intent Sequential Decomposition) from spec/12
and Section 16 of the NovaMart Handbook.
"""

from enum import Enum
import re
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field


class IntentType(str, Enum):
    DELIVERY_INQUIRY = "delivery_inquiry"
    REFUND_REQUEST = "refund_request"
    RETURN_REQUEST = "return_request"
    CANCELLATION_REQUEST = "cancellation_request"
    ADDRESS_CHANGE = "address_change"
    REPLACEMENT_REQUEST = "replacement_request"
    WARRANTY_CLAIM = "warranty_claim"
    PRODUCT_INQUIRY = "product_inquiry"
    GENERAL_INQUIRY = "general_inquiry"
    ESCALATION_REQUEST = "escalation_request"


class IntentNode(BaseModel):
    """An individual intent node in the execution DAG."""
    intent_id: int
    intent_type: IntentType
    description: str
    target_order_id: Optional[str] = None
    dependencies: List[int] = Field(default_factory=list)
    status: str = "pending"  # pending, ready, blocked, completed, rejected
    result: Optional[Dict[str, Any]] = None
    rejection_reason: Optional[str] = None


class MultiIntentPlan(BaseModel):
    """The complete DAG execution plan for compound customer messages."""
    raw_message: str
    nodes: List[IntentNode]
    execution_order: List[int]
    summary: str


class MultiIntentSequencer:
    """
    Decomposes bundled customer requests (e.g. 'order not arrived + refund + change address')
    into discrete DAG nodes and enforces sequential execution dependencies.
    """

    INTENT_DETECTORS = [
        (
            IntentType.ADDRESS_CHANGE,
            re.compile(r"\b(change\s+(my\s+)?address|update\s+(my\s+)?address|new\s+address|deliver\s+to\s+another|ship\s+to\b|wrong\s+address)\b", re.IGNORECASE),
            "Customer requested to update the shipping/delivery address."
        ),
        (
            IntentType.DELIVERY_INQUIRY,
            re.compile(r"\b(never\s+arrived|not\s+arrived|where\s+is\s+my\s+order|tracking|delayed|late\s+delivery|not\s+delivered|delivery\s+status|hasn'?t\s+arrived|how\s+many\s+days|how\s+long|when\s+will|delivery\s+time|shipping\s+time|transit\s+time)\b", re.IGNORECASE),
            "Customer inquiring about delivery timelines, delayed parcel, or shipping status."
        ),
        (
            IntentType.CANCELLATION_REQUEST,
            re.compile(r"\b(cancel\s+(the\s+|my\s+)?order|cancellation|stop\s+the\s+order)\b", re.IGNORECASE),
            "Customer requested order cancellation."
        ),
        (
            IntentType.RETURN_REQUEST,
            re.compile(r"\b(return\s+(the\s+|my\s+)?item|return\s+this|return\s+request|send\s+it\s+back|pick\s+up\s+return)\b", re.IGNORECASE),
            "Customer requested an item return."
        ),
        (
            IntentType.REFUND_REQUEST,
            re.compile(r"\b(refund|money\s+back|reimburse|return\s+payment|refund\s+amount)\b", re.IGNORECASE),
            "Customer requested a monetary refund."
        ),
        (
            IntentType.REPLACEMENT_REQUEST,
            re.compile(r"\b(replace|replacement|exchange)\b", re.IGNORECASE),
            "Customer requested item replacement or exchange."
        ),
        (
            IntentType.WARRANTY_CLAIM,
            re.compile(r"\b(warranty|repair|stopped\s+working|malfunction|broken\s+screen|swollen\s+battery)\b", re.IGNORECASE),
            "Customer filing a warranty or defective hardware claim."
        ),
        (
            IntentType.ESCALATION_REQUEST,
            re.compile(r"\b(human\s+agent|talk\s+to\s+human|speak\s+with\s+a\s+person|manager|supervisor|escalate)\b", re.IGNORECASE),
            "Customer explicitly requested transfer to a human specialist."
        ),
        (
            IntentType.PRODUCT_INQUIRY,
            re.compile(r"\b(compatible|specifications|specs|battery\s+capacity|features|dimensions|weight)\b", re.IGNORECASE),
            "Customer asking for product specifications or technical details."
        ),
    ]

    @classmethod
    def decompose_message(
        cls,
        user_message: str,
        active_order_id: Optional[str] = None
    ) -> MultiIntentPlan:
        """
        Parses bundled customer requests into discrete intent DAG nodes.
        Wired with dependency edges.
        """
        nodes: List[IntentNode] = []
        matched_types = set()
        node_id_counter = 1

        # Check explicit order ID mentioned in message
        order_match = re.search(r"ORD-\d{5,6}", user_message)
        referenced_order = order_match.group(0) if order_match else active_order_id

        for intent_type, pattern, desc in cls.INTENT_DETECTORS:
            if pattern.search(user_message):
                if intent_type not in matched_types:
                    matched_types.add(intent_type)
                    nodes.append(
                        IntentNode(
                            intent_id=node_id_counter,
                            intent_type=intent_type,
                            description=desc,
                            target_order_id=referenced_order,
                        )
                    )
                    node_id_counter += 1

        # Fallback to general inquiry if no specific intent matched
        if not nodes:
            nodes.append(
                IntentNode(
                    intent_id=1,
                    intent_type=IntentType.GENERAL_INQUIRY,
                    description="General customer inquiry or conversation.",
                    target_order_id=referenced_order,
                )
            )

        # Wire dependency DAG edges
        cls._wire_dependencies(nodes)

        # Compute topological execution order
        execution_order = cls._compute_execution_order(nodes)

        summary = f"Decomposed into {len(nodes)} distinct intents: " + ", ".join(
            f"[{n.intent_id}: {n.intent_type.value}]" for n in nodes
        )

        return MultiIntentPlan(
            raw_message=user_message,
            nodes=nodes,
            execution_order=execution_order,
            summary=summary,
        )

    @classmethod
    def _wire_dependencies(cls, nodes: List[IntentNode]) -> None:
        """
        Establishes sequential dependencies between intents:
        - Delivery inquiry must resolve before refund request can be processed.
        - Cancellation must be evaluated before refund request.
        - Address change must evaluate shipping status.
        """
        node_by_type: Dict[IntentType, IntentNode] = {n.intent_type: n for n in nodes}

        # 1. Delivery inquiry must resolve before refund
        if IntentType.DELIVERY_INQUIRY in node_by_type and IntentType.REFUND_REQUEST in node_by_type:
            delivery_node = node_by_type[IntentType.DELIVERY_INQUIRY]
            refund_node = node_by_type[IntentType.REFUND_REQUEST]
            if delivery_node.intent_id not in refund_node.dependencies:
                refund_node.dependencies.append(delivery_node.intent_id)

        # 2. Cancellation must resolve before refund
        if IntentType.CANCELLATION_REQUEST in node_by_type and IntentType.REFUND_REQUEST in node_by_type:
            cancel_node = node_by_type[IntentType.CANCELLATION_REQUEST]
            refund_node = node_by_type[IntentType.REFUND_REQUEST]
            if cancel_node.intent_id not in refund_node.dependencies:
                refund_node.dependencies.append(cancel_node.intent_id)

        # 3. Return request must resolve before refund
        if IntentType.RETURN_REQUEST in node_by_type and IntentType.REFUND_REQUEST in node_by_type:
            return_node = node_by_type[IntentType.RETURN_REQUEST]
            refund_node = node_by_type[IntentType.REFUND_REQUEST]
            if return_node.intent_id not in refund_node.dependencies:
                refund_node.dependencies.append(return_node.intent_id)

    @classmethod
    def _compute_execution_order(cls, nodes: List[IntentNode]) -> List[int]:
        """
        Topological sort of intent nodes based on dependencies.
        """
        order: List[int] = []
        visited = set()
        node_map = {n.intent_id: n for n in nodes}

        def visit(n_id: int):
            if n_id in visited:
                return
            node = node_map.get(n_id)
            if not node:
                return
            for dep_id in node.dependencies:
                visit(dep_id)
            visited.add(n_id)
            order.append(n_id)

        for node in nodes:
            visit(node.intent_id)

        return order

    @classmethod
    def validate_preconditions(
        cls,
        node: IntentNode,
        order_context: Optional[Dict[str, Any]],
    ) -> Tuple[bool, Optional[str]]:
        """
        Evaluates operational preconditions for a specific intent node.
        Example: Blocks address change if order is already shipped/delivered.
        """
        if not order_context:
            return True, None

        status = (order_context.get("order_status") or "").lower()
        delivery_status = (order_context.get("delivery_status") or "").lower()

        # Precondition for Address Change:
        # Shipped, in transit, out for delivery, or delivered cannot be changed.
        if node.intent_type == IntentType.ADDRESS_CHANGE:
            if status in ["shipped", "delivered"] or delivery_status in ["in_transit", "out_for_delivery", "delivered"]:
                return (
                    False,
                    f"Address change blocked: Order {order_context.get('order_id')} has already shipped ({delivery_status or status}). Parcels in transit cannot be rerouted per NovaMart Shipping Policy §3.",
                )

        # Precondition for Cancellation:
        # Delivered or shipped orders cannot be cancelled directly via button.
        if node.intent_type == IntentType.CANCELLATION_REQUEST:
            if status in ["delivered"] or delivery_status in ["delivered"]:
                return (
                    False,
                    f"Cancellation blocked: Order {order_context.get('order_id')} is already delivered. Please initiate a return request instead.",
                )
            if status in ["shipped"] or delivery_status in ["in_transit", "out_for_delivery"]:
                return (
                    False,
                    f"Cancellation blocked: Order {order_context.get('order_id')} is already in transit. Please refuse delivery upon arrival for return to origin.",
                )

        return True, None
