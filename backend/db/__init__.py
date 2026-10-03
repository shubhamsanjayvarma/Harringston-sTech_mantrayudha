"""NovaMart Database Package.

Exports connection managers, relational models, and ingestion loaders.
"""

from backend.db.connection import (
    close_master_connection,
    execute_script,
    execute_write,
    fetch_all,
    fetch_one,
    get_db_connection,
    get_master_connection,
)
from backend.db.loader import initialize_in_memory_engine, load_all_data
from backend.db.models import (
    Conversation,
    Customer,
    Message,
    Order,
    OrderItem,
    Product,
    Review,
    SupportTicket,
)

__all__ = [
    "close_master_connection",
    "execute_script",
    "execute_write",
    "fetch_all",
    "fetch_one",
    "get_db_connection",
    "get_master_connection",
    "load_all_data",
    "initialize_in_memory_engine",
    "Customer",
    "Order",
    "OrderItem",
    "Product",
    "Review",
    "SupportTicket",
    "Message",
    "Conversation",
]
