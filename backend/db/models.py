"""Typed Pydantic domain models for NovaMart relational entities.

Corresponds to the 7 master datasets specified in spec/02_database_schema_and_entity_relations.md.
"""

from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, ConfigDict, Field


class Customer(BaseModel):
    """Customer account profile and loyalty attributes."""
    model_config = ConfigDict(from_attributes=True)

    customer_id: str = Field(..., description="Unique customer ID in format CUST-XXXXX")
    first_name: str
    last_name: str
    email: str
    phone: str
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[int] = None
    address: Optional[str] = None
    customer_since: Optional[str] = None
    customer_segment: Optional[str] = "regular"
    account_status: str = Field(default="active", description="active, inactive, suspended")
    preferred_language: Optional[str] = "English"
    total_orders: int = 0
    total_spend: float = 0.0
    loyalty_tier: str = Field(default="bronze", description="bronze, silver, gold, platinum")


class Order(BaseModel):
    """Order transaction master record."""
    model_config = ConfigDict(from_attributes=True)

    order_id: str = Field(..., description="Unique order ID in format ORD-XXXXXX")
    customer_id: str = Field(..., description="Foreign key to Customer")
    order_date: str
    order_status: str = Field(
        ...,
        description="placed, confirmed, processing, shipped, out_for_delivery, delivered, cancelled, returned, partially_returned",
    )
    payment_method: str
    payment_status: str = Field(..., description="paid, pending, failed, refunded, partially_refunded")
    subtotal: float
    discount: float = 0.0
    shipping_fee: float = 0.0
    tax: float = 0.0
    total_amount: float
    shipping_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    estimated_delivery_date: Optional[str] = None
    actual_delivery_date: Optional[str] = None
    tracking_number: Optional[str] = None
    courier: Optional[str] = None
    delivery_status: Optional[str] = None
    delivery_otp_verified: bool = False
    cancellation_status: str = "none"
    refund_status: str = "none"


class OrderItem(BaseModel):
    """Individual line item within an order."""
    model_config = ConfigDict(from_attributes=True)

    order_item_id: str = Field(..., description="Unique order item ID in format OI-XXXXXX")
    order_id: str = Field(..., description="Foreign key to Order")
    product_id: str = Field(..., description="Foreign key to Product")
    quantity: int = 1
    unit_price: float
    discount: float = 0.0
    final_price: float
    item_status: str = Field(default="delivered")
    return_status: str = Field(default="none")
    refund_amount: float = 0.0


class Product(BaseModel):
    """Product catalog specification."""
    model_config = ConfigDict(from_attributes=True)

    product_id: str = Field(..., description="Unique product ID in format PROD-XXXXX")
    sku: str
    product_name: str
    category: str
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    price: float
    mrp: float
    discount_percent: float = 0.0
    stock_quantity: int = 0
    warranty_months: int = 0
    returnable: bool = True
    replacement_available: bool = True
    rating: float = 0.0
    review_count: int = 0
    weight_kg: Optional[float] = None
    color: Optional[str] = None
    status: str = "active"


class Review(BaseModel):
    """Customer review and feedback."""
    model_config = ConfigDict(from_attributes=True)

    review_id: str = Field(..., description="Unique review ID in format REV-XXXXXX")
    product_id: str
    customer_id: str
    order_id: Optional[str] = None
    rating: int
    title: Optional[str] = None
    review_text: Optional[str] = None
    review_date: Optional[str] = None
    verified_purchase: bool = True
    helpful_votes: int = 0


class SupportTicket(BaseModel):
    """Support case and escalation log."""
    model_config = ConfigDict(from_attributes=True)

    ticket_id: str = Field(..., description="Unique ticket ID in format TICK-XXXXX")
    customer_id: str
    order_id: Optional[str] = None
    created_at: str
    category: str
    subcategory: Optional[str] = None
    priority: str = Field(default="medium", description="low, medium, high, critical")
    status: str = Field(default="open", description="open, in_progress, escalated, resolved, closed")
    assigned_team: Optional[str] = None
    issue_summary: Optional[str] = None
    resolution: Optional[str] = None
    created_by: str = "customer"
    resolved_at: Optional[str] = None
    conversation_id: Optional[str] = None


class Message(BaseModel):
    """Individual message in a multi-turn conversation."""
    model_config = ConfigDict(from_attributes=True)

    role: str = Field(..., description="customer or agent")
    timestamp: str
    message: str


class Conversation(BaseModel):
    """Multi-turn customer support dialogue thread."""
    model_config = ConfigDict(from_attributes=True)

    conversation_id: str = Field(..., description="Unique conversation ID in format CONV-XXXXXX")
    customer_id: str
    order_id: Optional[str] = None
    ticket_id: Optional[str] = None
    channel: str = Field(..., description="chat, whatsapp, email, phone_transcript")
    language: str = "English"
    started_at: str
    status: str = Field(default="resolved")
    handled_by: str = Field(default="bot", description="bot, human, bot_then_human")
    messages: List[Union[Message, Dict[str, Any]]] = Field(default_factory=list)
