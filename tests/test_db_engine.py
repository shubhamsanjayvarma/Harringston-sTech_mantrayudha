"""Unit and smoke verification tests for NovaMart In-Memory Relational Engine."""

import time
import pytest
from backend.config import (
    APPROVAL_THRESHOLD_V1,
    APPROVAL_THRESHOLD_V2,
    COURIER_CODES,
    OTP_DELIVERY_THRESHOLD,
    POLICY_CUTOFF_DATE_STR,
    RESTOCKING_CATEGORIES,
    RESTOCKING_FEE_MAX_CAP,
    RESTOCKING_FEE_RATE,
    SLA_DEFINITIONS,
)
from backend.db.connection import (
    close_master_connection,
    fetch_all,
    fetch_one,
    get_db_connection,
    get_master_connection,
)
from backend.db.loader import initialize_in_memory_engine, load_all_data
from backend.db.models import (
    Conversation,
    Customer,
    Order,
    OrderItem,
    Product,
    Review,
    SupportTicket,
)


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """Ensure in-memory engine is populated for tests."""
    conn = initialize_in_memory_engine()
    yield conn
    close_master_connection()


def test_system_config_constants():
    """Verify policy constants match specifications."""
    assert POLICY_CUTOFF_DATE_STR == "2026-06-01"
    assert APPROVAL_THRESHOLD_V1 == 100000.0
    assert APPROVAL_THRESHOLD_V2 == 75000.0
    assert RESTOCKING_CATEGORIES == {"Laptops", "Tablets", "Cameras", "Monitors"}
    assert RESTOCKING_FEE_RATE == 0.05
    assert RESTOCKING_FEE_MAX_CAP == 2500.0
    assert OTP_DELIVERY_THRESHOLD == 5000.0
    assert "BAX" in COURIER_CODES
    assert "critical" in SLA_DEFINITIONS


def test_table_row_counts():
    """Verify exact ground-truth row counts for all 7 datasets."""
    expected_counts = {
        "customers": 1500,
        "orders": 8000,
        "order_items": 12444,
        "products": 300,
        "reviews": 3000,
        "support_tickets": 2500,
        "conversations": 1500,
    }

    conn = get_db_connection()
    for table, expected in expected_counts.items():
        row = fetch_one(f"SELECT COUNT(*) as count FROM {table}", conn=conn)
        assert row is not None
        if table in ("support_tickets", "conversations"):
            assert row["count"] >= expected, f"Table {table} expected at least {expected} rows, got {row['count']}"
        else:
            assert row["count"] == expected, f"Table {table} expected {expected} rows, got {row['count']}"
    conn.close()


def test_b_tree_indexes():
    """Verify required B-Tree indexes exist."""
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT name FROM sqlite_master WHERE type = 'index'")
    indexes = {row["name"] for row in cur.fetchall()}

    required_indexes = [
        "idx_orders_customer_id",
        "idx_orders_order_id",
        "idx_orders_order_date",
        "idx_order_items_order_id",
        "idx_order_items_product_id",
        "idx_support_tickets_customer_id",
        "idx_support_tickets_order_id",
        "idx_reviews_product_id",
    ]

    for idx in required_indexes:
        assert idx in indexes, f"Missing required index: {idx}"
    conn.close()


def test_query_performance_under_5ms():
    """Verify high-frequency query latency is under 5ms."""
    conn = get_db_connection()

    queries = [
        "SELECT * FROM customers WHERE customer_id = 'CUST-00001'",
        "SELECT * FROM orders WHERE customer_id = 'CUST-00615'",
        """SELECT oi.*, p.product_name, p.category 
           FROM order_items oi 
           JOIN products p ON oi.product_id = p.product_id 
           WHERE oi.order_id = 'ORD-000001'""",
        "SELECT * FROM support_tickets WHERE customer_id = 'CUST-00055'",
        "SELECT * FROM reviews WHERE product_id = 'PROD-00001'",
        "SELECT * FROM conversations WHERE conversation_id = 'CONV-000001'",
    ]

    for q in queries:
        t0 = time.perf_counter()
        rows = fetch_all(q, conn=conn)
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        assert len(rows) > 0, f"Query returned empty: {q}"
        assert elapsed_ms < 5.0, f"Query took {elapsed_ms:.2f}ms, exceeding 5ms threshold"

    conn.close()


def test_pydantic_model_hydration():
    """Verify Pydantic models hydrate cleanly from database rows."""
    conn = get_db_connection()

    cust_row = fetch_one("SELECT * FROM customers LIMIT 1", conn=conn)
    customer = Customer.model_validate(cust_row)
    assert customer.customer_id.startswith("CUST-")

    order_row = fetch_one("SELECT * FROM orders LIMIT 1", conn=conn)
    order = Order.model_validate(order_row)
    assert order.order_id.startswith("ORD-")

    item_row = fetch_one("SELECT * FROM order_items LIMIT 1", conn=conn)
    item = OrderItem.model_validate(item_row)
    assert item.order_item_id.startswith("OI-")

    prod_row = fetch_one("SELECT * FROM products LIMIT 1", conn=conn)
    prod = Product.model_validate(prod_row)
    assert prod.product_id.startswith("PROD-")

    rev_row = fetch_one("SELECT * FROM reviews LIMIT 1", conn=conn)
    rev = Review.model_validate(rev_row)
    assert rev.review_id.startswith("REV-")

    ticket_row = fetch_one("SELECT * FROM support_tickets LIMIT 1", conn=conn)
    ticket = SupportTicket.model_validate(ticket_row)
    assert ticket.ticket_id.startswith("TICK-")

    conv_row = fetch_one("SELECT * FROM conversations LIMIT 1", conn=conn)
    conv_data = dict(conv_row)
    import json
    conv_data["messages"] = json.loads(conv_data["messages"])
    conv = Conversation.model_validate(conv_data)
    assert conv.conversation_id.startswith("CONV-")
    assert len(conv.messages) > 0

    conn.close()
