"""Ground truth query endpoints for inspecting entities."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException

from backend.db.connection import fetch_all, fetch_one
from backend.engine.guardrail_interceptor import SecurityGuardrail

router = APIRouter(prefix="/api/data", tags=["Data"])


@router.get("/customers/{customer_id}")
async def get_customer_profile(customer_id: str) -> Dict[str, Any]:
    """Retrieves customer record by ID."""
    customer = fetch_one("SELECT * FROM customers WHERE customer_id = ?", (customer_id,))
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return SecurityGuardrail.scrub_sensitive_fields(customer)


@router.get("/orders/{order_id}")
async def get_order_details(order_id: str) -> Dict[str, Any]:
    """Retrieves order record with items by ID."""
    order = fetch_one("SELECT * FROM orders WHERE order_id = ?", (order_id,))
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    items = fetch_all(
        "SELECT oi.*, p.product_name, p.category, p.brand, p.warranty_months FROM order_items oi "
        "JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?",
        (order_id,),
    )
    result = dict(order)
    result["items"] = items
    return SecurityGuardrail.scrub_sensitive_fields(result)


@router.get("/products/{product_id}")
async def get_product_specs(product_id: str) -> Dict[str, Any]:
    """Retrieves product record by ID."""
    product = fetch_one("SELECT * FROM products WHERE product_id = ?", (product_id,))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
