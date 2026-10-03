"""Data ingestion and schema builder for NovaMart AI Customer Support Agent.

Ingests the 7 master datasets from CSV and JSON into SQLite (shared in-memory or file),
handles type conversions, null values, creates relational tables and B-Tree indexes.
"""

import csv
import json
import sqlite3
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

from backend.config import (
    DATA_DIR,
    PERSISTENT_DB_PATH,
    SQLITE_SHARED_MEM_URI,
)
from backend.db.connection import get_db_connection, get_master_connection

TABLE_SCHEMAS = """
CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT,
    date_of_birth TEXT,
    city TEXT,
    state TEXT,
    pincode INTEGER,
    address TEXT,
    customer_since TEXT,
    customer_segment TEXT,
    account_status TEXT NOT NULL,
    preferred_language TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spend REAL DEFAULT 0.0,
    loyalty_tier TEXT DEFAULT 'bronze'
);

CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    order_date TEXT NOT NULL,
    order_status TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    subtotal REAL NOT NULL,
    discount REAL DEFAULT 0.0,
    shipping_fee REAL DEFAULT 0.0,
    tax REAL DEFAULT 0.0,
    total_amount REAL NOT NULL,
    shipping_address TEXT,
    city TEXT,
    state TEXT,
    estimated_delivery_date TEXT,
    actual_delivery_date TEXT,
    tracking_number TEXT,
    courier TEXT,
    delivery_status TEXT,
    delivery_otp_verified INTEGER DEFAULT 0,
    cancellation_status TEXT DEFAULT 'none',
    refund_status TEXT DEFAULT 'none',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price REAL NOT NULL,
    discount REAL DEFAULT 0.0,
    final_price REAL NOT NULL,
    item_status TEXT DEFAULT 'delivered',
    return_status TEXT DEFAULT 'none',
    refund_amount REAL DEFAULT 0.0,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS products (
    product_id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    brand TEXT,
    description TEXT,
    price REAL NOT NULL,
    mrp REAL NOT NULL,
    discount_percent REAL DEFAULT 0.0,
    stock_quantity INTEGER DEFAULT 0,
    warranty_months INTEGER DEFAULT 0,
    returnable INTEGER DEFAULT 1,
    replacement_available INTEGER DEFAULT 1,
    rating REAL,
    review_count INTEGER DEFAULT 0,
    weight_kg REAL,
    color TEXT,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    order_id TEXT,
    rating INTEGER NOT NULL,
    title TEXT,
    review_text TEXT,
    review_date TEXT,
    verified_purchase INTEGER DEFAULT 1,
    helpful_votes INTEGER DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    order_id TEXT,
    created_at TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    assigned_team TEXT,
    issue_summary TEXT,
    resolution TEXT,
    created_by TEXT DEFAULT 'customer',
    resolved_at TEXT,
    conversation_id TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE IF NOT EXISTS conversations (
    conversation_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    order_id TEXT,
    ticket_id TEXT,
    channel TEXT NOT NULL,
    language TEXT DEFAULT 'English',
    started_at TEXT NOT NULL,
    status TEXT DEFAULT 'resolved',
    handled_by TEXT DEFAULT 'bot',
    messages TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id)
);
"""

INDEX_SCHEMAS = """
-- Required B-Tree Indexes per Specification
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order_id ON support_tickets(order_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Additional Helpful Query Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON conversations(order_id);
CREATE INDEX IF NOT EXISTS idx_conversations_ticket_id ON conversations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
"""


def _parse_str(val: Any) -> Optional[str]:
    """Parse string or return None if empty/null."""
    if val is None:
        return None
    s = str(val).strip()
    return s if s and s.lower() != "nan" and s.lower() != "null" else None


def _parse_int(val: Any, default: int = 0) -> int:
    """Parse integer safely."""
    if val is None:
        return default
    s = str(val).strip()
    if not s or s.lower() in ("nan", "null"):
        return default
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return default


def _parse_float(val: Any, default: Optional[float] = 0.0) -> Optional[float]:
    """Parse float safely, returning default if null/empty."""
    if val is None:
        return default
    s = str(val).strip()
    if not s or s.lower() in ("nan", "null"):
        return default
    try:
        return float(s)
    except (ValueError, TypeError):
        return default


def _parse_bool(val: Any, default: int = 0) -> int:
    """Parse boolean into SQLite integer (0 or 1)."""
    if val is None:
        return default
    s = str(val).strip().lower()
    if s in ("true", "1", "t", "yes", "y"):
        return 1
    elif s in ("false", "0", "f", "no", "n"):
        return 0
    return default


def load_customers(conn: sqlite3.Connection, filepath: Path) -> int:
    """Ingest customers.csv."""
    rows: List[Tuple[Any, ...]] = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append((
                _parse_str(r["customer_id"]),
                _parse_str(r["first_name"]),
                _parse_str(r["last_name"]),
                _parse_str(r["email"]),
                _parse_str(r["phone"]),
                _parse_str(r.get("gender")),
                _parse_str(r.get("date_of_birth")),
                _parse_str(r.get("city")),
                _parse_str(r.get("state")),
                _parse_int(r.get("pincode")),
                _parse_str(r.get("address")),
                _parse_str(r.get("customer_since")),
                _parse_str(r.get("customer_segment")),
                _parse_str(r["account_status"]),
                _parse_str(r.get("preferred_language")),
                _parse_int(r.get("total_orders"), 0),
                _parse_float(r.get("total_spend"), 0.0),
                _parse_str(r.get("loyalty_tier")) or "bronze",
            ))

    conn.executemany(
        """
        INSERT OR REPLACE INTO customers (
            customer_id, first_name, last_name, email, phone, gender,
            date_of_birth, city, state, pincode, address, customer_since,
            customer_segment, account_status, preferred_language,
            total_orders, total_spend, loyalty_tier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def load_orders(conn: sqlite3.Connection, filepath: Path) -> int:
    """Ingest orders.csv."""
    rows: List[Tuple[Any, ...]] = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append((
                _parse_str(r["order_id"]),
                _parse_str(r["customer_id"]),
                _parse_str(r["order_date"]),
                _parse_str(r["order_status"]),
                _parse_str(r["payment_method"]),
                _parse_str(r["payment_status"]),
                _parse_float(r.get("subtotal"), 0.0),
                _parse_float(r.get("discount"), 0.0),
                _parse_float(r.get("shipping_fee"), 0.0),
                _parse_float(r.get("tax"), 0.0),
                _parse_float(r.get("total_amount"), 0.0),
                _parse_str(r.get("shipping_address")),
                _parse_str(r.get("city")),
                _parse_str(r.get("state")),
                _parse_str(r.get("estimated_delivery_date")),
                _parse_str(r.get("actual_delivery_date")),
                _parse_str(r.get("tracking_number")),
                _parse_str(r.get("courier")),
                _parse_str(r.get("delivery_status")),
                _parse_bool(r.get("delivery_otp_verified"), 0),
                _parse_str(r.get("cancellation_status")) or "none",
                _parse_str(r.get("refund_status")) or "none",
            ))

    conn.executemany(
        """
        INSERT OR REPLACE INTO orders (
            order_id, customer_id, order_date, order_status, payment_method,
            payment_status, subtotal, discount, shipping_fee, tax, total_amount,
            shipping_address, city, state, estimated_delivery_date,
            actual_delivery_date, tracking_number, courier, delivery_status,
            delivery_otp_verified, cancellation_status, refund_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def load_order_items(conn: sqlite3.Connection, filepath: Path) -> int:
    """Ingest order_items.csv."""
    rows: List[Tuple[Any, ...]] = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append((
                _parse_str(r["order_item_id"]),
                _parse_str(r["order_id"]),
                _parse_str(r["product_id"]),
                _parse_int(r.get("quantity"), 1),
                _parse_float(r.get("unit_price"), 0.0),
                _parse_float(r.get("discount"), 0.0),
                _parse_float(r.get("final_price"), 0.0),
                _parse_str(r.get("item_status")) or "delivered",
                _parse_str(r.get("return_status")) or "none",
                _parse_float(r.get("refund_amount"), 0.0),
            ))

    conn.executemany(
        """
        INSERT OR REPLACE INTO order_items (
            order_item_id, order_id, product_id, quantity, unit_price,
            discount, final_price, item_status, return_status, refund_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def load_products(conn: sqlite3.Connection, filepath: Path) -> int:
    """Ingest products.csv."""
    rows: List[Tuple[Any, ...]] = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append((
                _parse_str(r["product_id"]),
                _parse_str(r["sku"]),
                _parse_str(r["product_name"]),
                _parse_str(r["category"]),
                _parse_str(r.get("subcategory")),
                _parse_str(r.get("brand")),
                _parse_str(r.get("description")),
                _parse_float(r.get("price"), 0.0),
                _parse_float(r.get("mrp"), 0.0),
                _parse_float(r.get("discount_percent"), 0.0),
                _parse_int(r.get("stock_quantity"), 0),
                _parse_int(r.get("warranty_months"), 0),
                _parse_bool(r.get("returnable"), 1),
                _parse_bool(r.get("replacement_available"), 1),
                _parse_float(r.get("rating"), None),
                _parse_int(r.get("review_count"), 0),
                _parse_float(r.get("weight_kg"), None),
                _parse_str(r.get("color")),
                _parse_str(r.get("status")) or "active",
            ))

    conn.executemany(
        """
        INSERT OR REPLACE INTO products (
            product_id, sku, product_name, category, subcategory, brand,
            description, price, mrp, discount_percent, stock_quantity,
            warranty_months, returnable, replacement_available, rating,
            review_count, weight_kg, color, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def load_reviews(conn: sqlite3.Connection, filepath: Path) -> int:
    """Ingest reviews.csv."""
    rows: List[Tuple[Any, ...]] = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append((
                _parse_str(r["review_id"]),
                _parse_str(r["product_id"]),
                _parse_str(r["customer_id"]),
                _parse_str(r.get("order_id")),
                _parse_int(r.get("rating"), 5),
                _parse_str(r.get("title")),
                _parse_str(r.get("review_text")),
                _parse_str(r.get("review_date")),
                _parse_bool(r.get("verified_purchase"), 1),
                _parse_int(r.get("helpful_votes"), 0),
            ))

    conn.executemany(
        """
        INSERT OR REPLACE INTO reviews (
            review_id, product_id, customer_id, order_id, rating,
            title, review_text, review_date, verified_purchase, helpful_votes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def load_support_tickets(conn: sqlite3.Connection, filepath: Path) -> int:
    """Ingest support_tickets.csv."""
    rows: List[Tuple[Any, ...]] = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append((
                _parse_str(r["ticket_id"]),
                _parse_str(r["customer_id"]),
                _parse_str(r.get("order_id")),
                _parse_str(r["created_at"]),
                _parse_str(r["category"]),
                _parse_str(r.get("subcategory")),
                _parse_str(r.get("priority")) or "medium",
                _parse_str(r.get("status")) or "open",
                _parse_str(r.get("assigned_team")),
                _parse_str(r.get("issue_summary")),
                _parse_str(r.get("resolution")),
                _parse_str(r.get("created_by")) or "customer",
                _parse_str(r.get("resolved_at")),
                _parse_str(r.get("conversation_id")),
            ))

    conn.executemany(
        """
        INSERT OR REPLACE INTO support_tickets (
            ticket_id, customer_id, order_id, created_at, category,
            subcategory, priority, status, assigned_team, issue_summary,
            resolution, created_by, resolved_at, conversation_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def load_conversations(conn: sqlite3.Connection, filepath: Path) -> int:
    """Ingest conversations.json."""
    with open(filepath, mode="r", encoding="utf-8") as f:
        data = json.load(f)

    rows: List[Tuple[Any, ...]] = []
    for item in data:
        messages_json = json.dumps(item.get("messages", []), ensure_ascii=False)
        rows.append((
            _parse_str(item["conversation_id"]),
            _parse_str(item["customer_id"]),
            _parse_str(item.get("order_id")),
            _parse_str(item.get("ticket_id")),
            _parse_str(item.get("channel")),
            _parse_str(item.get("language")) or "English",
            _parse_str(item.get("started_at")),
            _parse_str(item.get("status")) or "resolved",
            _parse_str(item.get("handled_by")) or "bot",
            messages_json,
        ))

    conn.executemany(
        """
        INSERT OR REPLACE INTO conversations (
            conversation_id, customer_id, order_id, ticket_id, channel,
            language, started_at, status, handled_by, messages
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def load_all_data(
    db_conn: Optional[sqlite3.Connection] = None,
    data_dir: Optional[Path] = None,
    persist_to_disk: bool = True,
) -> Dict[str, int]:
    """Ingest all 7 datasets into SQLite.
    
    Creates tables, inserts data inside transactions, creates B-Tree indexes,
    and optionally persists a snapshot to backend/novamart.db.
    """
    start_time = time.perf_counter()
    target_data_dir = data_dir or DATA_DIR

    conn = db_conn or get_master_connection(SQLITE_SHARED_MEM_URI)

    # 1. Create Tables
    conn.executescript(TABLE_SCHEMAS)
    conn.commit()

    # 2. Ingest Data
    counts: Dict[str, int] = {}
    
    customers_path = target_data_dir / "customers.csv"
    orders_path = target_data_dir / "orders.csv"
    order_items_path = target_data_dir / "order_items.csv"
    products_path = target_data_dir / "products.csv"
    reviews_path = target_data_dir / "reviews.csv"
    support_tickets_path = target_data_dir / "support_tickets.csv"
    conversations_path = target_data_dir / "conversations.json"

    counts["customers"] = load_customers(conn, customers_path)
    counts["orders"] = load_orders(conn, orders_path)
    counts["order_items"] = load_order_items(conn, order_items_path)
    counts["products"] = load_products(conn, products_path)
    counts["reviews"] = load_reviews(conn, reviews_path)
    counts["support_tickets"] = load_support_tickets(conn, support_tickets_path)
    counts["conversations"] = load_conversations(conn, conversations_path)
    conn.commit()

    # 3. Create B-Tree Indexes
    conn.executescript(INDEX_SCHEMAS)
    conn.commit()

    elapsed = (time.perf_counter() - start_time) * 1000.0

    # 4. Optional backup to disk
    if persist_to_disk:
        PERSISTENT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        file_conn = sqlite3.connect(PERSISTENT_DB_PATH)
        conn.backup(file_conn)
        file_conn.close()

    print(f"Data ingestion completed in {elapsed:.2f}ms: {counts}")
    return counts


def initialize_in_memory_engine(force_reload: bool = False) -> sqlite3.Connection:
    """Ensure in-memory shared engine is populated and ready for sub-millisecond queries.
    
    If persistent disk file exists and not force_reload, copies from disk.
    Otherwise runs full ingestion into shared memory.
    """
    mem_conn = get_master_connection(SQLITE_SHARED_MEM_URI)

    # Check if tables already exist and have rows
    cur = mem_conn.cursor()
    try:
        cur.execute("SELECT COUNT(*) FROM customers")
        existing_count = cur.fetchone()[0]
        if existing_count == 1500 and not force_reload:
            return mem_conn
    except Exception:
        pass

    # If persistent DB exists, restore from it
    if PERSISTENT_DB_PATH.exists() and not force_reload:
        try:
            file_conn = sqlite3.connect(PERSISTENT_DB_PATH)
            file_conn.backup(mem_conn)
            file_conn.close()
            # Verify count
            cur.execute("SELECT COUNT(*) FROM customers")
            if cur.fetchone()[0] == 1500:
                return mem_conn
        except Exception:
            pass

    # Full ingestion
    load_all_data(db_conn=mem_conn, persist_to_disk=True)
    return mem_conn


if __name__ == "__main__":
    print("Initializing NovaMart In-Memory Relational Engine...")
    mem_conn = get_master_connection(SQLITE_SHARED_MEM_URI)
    counts = load_all_data(db_conn=mem_conn, persist_to_disk=True)

    print("\n--- Row Count Verification ---")
    expected = {
        "customers": 1500,
        "orders": 8000,
        "order_items": 12444,
        "products": 300,
        "reviews": 3000,
        "support_tickets": 2500,
        "conversations": 1500,
    }
    all_match = True
    for table, count in expected.items():
        actual = counts.get(table, 0)
        match = actual == count
        all_match = all_match and match
        print(f"Table '{table}': {actual} rows (Expected: {count}) [{'PASS' if match else 'FAIL'}]")

    print("\n--- Query Latency Benchmark (<5ms target) ---")
    benchmarks = [
        ("Customer by ID", "SELECT * FROM customers WHERE customer_id = 'CUST-00001'"),
        ("Orders by Customer ID", "SELECT * FROM orders WHERE customer_id = 'CUST-00615'"),
        ("Order Items with Products (JOIN)", 
         """SELECT oi.*, p.product_name, p.category 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.product_id 
            WHERE oi.order_id = 'ORD-000001'"""),
        ("Customer Tickets", "SELECT * FROM support_tickets WHERE customer_id = 'CUST-00055'"),
        ("Product Reviews", "SELECT * FROM reviews WHERE product_id = 'PROD-00001'"),
        ("Conversation by ID", "SELECT * FROM conversations WHERE conversation_id = 'CONV-000001'"),
    ]

    for label, query in benchmarks:
        timings = []
        for _ in range(10):
            t0 = time.perf_counter()
            cur = mem_conn.cursor()
            cur.execute(query)
            _ = cur.fetchall()
            t1 = time.perf_counter()
            timings.append((t1 - t0) * 1000.0)
        avg_ms = sum(timings) / len(timings)
        min_ms = min(timings)
        print(f"{label}: avg {avg_ms:.3f}ms (min {min_ms:.3f}ms) [{'PASS' if avg_ms < 5.0 else 'FAIL'}]")
