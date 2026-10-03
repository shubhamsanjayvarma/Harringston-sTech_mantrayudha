"""
NovaMart Support Ticket Schema & SLAs.
Reused and customized from awesome-llm-apps/customer_support_ticket_agent.
Enforces 4-tier priority levels, categories, and deterministic NovaMart SLAs.
"""

from datetime import datetime, timezone
from enum import Enum
import random
from typing import Optional
from pydantic import BaseModel, Field, model_validator


class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TicketCategory(str, Enum):
    CANCELLATION = "cancellation"
    REFUND = "refund"
    RETURN = "return"
    REPLACEMENT = "replacement"
    DELIVERY = "delivery"
    WARRANTY = "warranty"
    FRAUD_DISPUTE = "fraud_dispute"
    GENERAL = "general"


# Official NovaMart SLA resolution target hours
SLA_HOURS_MAP: dict[Priority, int] = {
    Priority.CRITICAL: 4,    # Critical battery/safety or severe dispute: 4 hours
    Priority.HIGH: 24,       # High priority / large disputes: 24 hours
    Priority.MEDIUM: 72,     # Standard investigations / logistics checks: 72 hours
    Priority.LOW: 120,       # General feedback / minor inquiries: 120 hours (5 business days)
}

# Default team routing mapping based on category
CATEGORY_TEAM_MAP: dict[TicketCategory, str] = {
    TicketCategory.CANCELLATION: "Tier 1 Support",
    TicketCategory.REFUND: "Refunds & Payments",
    TicketCategory.RETURN: "Tier 1 Support",
    TicketCategory.REPLACEMENT: "Tier 1 Support",
    TicketCategory.DELIVERY: "Logistics Desk",
    TicketCategory.WARRANTY: "Technical Support",
    TicketCategory.FRAUD_DISPUTE: "Trust & Safety",
    TicketCategory.GENERAL: "Customer Experience",
}


def generate_ticket_id() -> str:
    """Generate a unique NovaMart ticket identifier (TICK-XXXXX)."""
    return f"TICK-{random.randint(10000, 99999)}"


class SupportTicket(BaseModel):
    """
    Standardized NovaMart Support Ticket model with Pydantic validation
    and SLA binding.
    """
    ticket_id: str = Field(
        default_factory=generate_ticket_id,
        description="Unique NovaMart ticket identifier (TICK-XXXXX)"
    )
    customer_id: str = Field(
        ...,
        description="Authenticated customer ID (e.g. CUST-00001)"
    )
    order_id: Optional[str] = Field(
        default=None,
        description="Associated order ID if inquiry is order-specific (e.g. ORD-000001)"
    )
    category: TicketCategory = Field(
        ...,
        description="Domain category for the ticket"
    )
    priority: Priority = Field(
        ...,
        description="Assigned ticket priority (low, medium, high, critical)"
    )
    subject: str = Field(
        ...,
        min_length=3,
        description="Concise summary or subject line of the issue"
    )
    description: str = Field(
        ...,
        min_length=5,
        description="Detailed description of the customer issue, evidence, and verified facts"
    )
    resolution_target_hours: int = Field(
        default=72,
        description="Deterministic SLA resolution deadline in hours"
    )
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
        description="Timestamp when the ticket was created (YYYY-MM-DD HH:MM:SS)"
    )
    status: str = Field(
        default="open",
        description="Ticket status: open, in_progress, resolved, closed"
    )
    assigned_team: Optional[str] = Field(
        default=None,
        description="Department / team responsible for the ticket"
    )
    resolution: Optional[str] = Field(
        default=None,
        description="Resolution details if resolved"
    )

    @model_validator(mode="before")
    @classmethod
    def populate_defaults(cls, data: any) -> any:
        """
        Automatically bind SLA resolution hours and default assigned team
        if not explicitly provided.
        """
        if isinstance(data, dict):
            # Resolve priority
            priority_val = data.get("priority")
            if priority_val:
                if isinstance(priority_val, str):
                    try:
                        p_enum = Priority(priority_val.lower())
                    except ValueError:
                        p_enum = Priority.MEDIUM
                else:
                    p_enum = priority_val
                
                # Bind SLA target hours if omitted or 0
                if "resolution_target_hours" not in data or not data["resolution_target_hours"]:
                    data["resolution_target_hours"] = SLA_HOURS_MAP.get(p_enum, 72)

            # Resolve assigned_team if omitted
            if "assigned_team" not in data or not data["assigned_team"]:
                cat_val = data.get("category")
                if cat_val:
                    if isinstance(cat_val, str):
                        try:
                            cat_enum = TicketCategory(cat_val.lower())
                            data["assigned_team"] = CATEGORY_TEAM_MAP.get(cat_enum, "Tier 1 Support")
                        except ValueError:
                            data["assigned_team"] = "Tier 1 Support"
                    elif isinstance(cat_val, TicketCategory):
                        data["assigned_team"] = CATEGORY_TEAM_MAP.get(cat_val, "Tier 1 Support")

            # Ensure ticket_id has prefix
            if "ticket_id" not in data or not data["ticket_id"]:
                data["ticket_id"] = generate_ticket_id()

            # Ensure created_at format
            if "created_at" not in data or not data["created_at"]:
                data["created_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

        return data

    def to_db_row(self) -> dict:
        """Serializes model to match the SQLite support_tickets table columns."""
        return {
            "ticket_id": self.ticket_id,
            "customer_id": self.customer_id,
            "order_id": self.order_id,
            "created_at": self.created_at,
            "category": self.category.value if isinstance(self.category, TicketCategory) else str(self.category),
            "subcategory": self.subject,
            "priority": self.priority.value if isinstance(self.priority, Priority) else str(self.priority),
            "status": self.status,
            "assigned_team": self.assigned_team or "Tier 1 Support",
            "issue_summary": self.description,
            "resolution": self.resolution,
            "created_by": "agent",
            "resolved_at": None,
            "conversation_id": None
        }
