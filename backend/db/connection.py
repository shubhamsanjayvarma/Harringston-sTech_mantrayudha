"""SQLite in-memory shared and file-backed database connection manager.

Maintains a persistent master connection to prevent shared in-memory SQLite
databases from being garbage collected between requests.
"""

import sqlite3
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

from backend.config import PERSISTENT_DB_PATH, SQLITE_SHARED_MEM_URI

DB_PATH = PERSISTENT_DB_PATH

_lock = threading.Lock()
_master_connection: Optional[sqlite3.Connection] = None
_active_db_target: str = str(PERSISTENT_DB_PATH) if PERSISTENT_DB_PATH.exists() else SQLITE_SHARED_MEM_URI


def get_master_connection(
    target: Optional[str] = None,
    enforce_foreign_keys: bool = False,
) -> sqlite3.Connection:
    """Return or initialize the persistent master connection.
    
    Keeping this connection open ensures that in-memory databases with
    cache=shared persist across individual worker requests.
    """
    global _master_connection, _active_db_target

    with _lock:
        if target is not None and target != _active_db_target:
            if _master_connection is not None:
                try:
                    _master_connection.close()
                except Exception:
                    pass
                _master_connection = None
            _active_db_target = target

        if _master_connection is None:
            db_uri = _active_db_target
            is_file = not db_uri.startswith("file:") or "mode=memory" not in db_uri

            if is_file and not db_uri.startswith("file:"):
                # Plain file path
                Path(db_uri).parent.mkdir(parents=True, exist_ok=True)
                conn = sqlite3.connect(
                    db_uri,
                    check_same_thread=False,
                    timeout=30.0,
                )
            else:
                conn = sqlite3.connect(
                    db_uri,
                    uri=True,
                    check_same_thread=False,
                    timeout=30.0,
                )

            conn.row_factory = sqlite3.Row
            # Performance Pragmas
            conn.execute("PRAGMA temp_store = MEMORY;")
            conn.execute("PRAGMA cache_size = -64000;")  # 64MB cache
            if enforce_foreign_keys:
                conn.execute("PRAGMA foreign_keys = ON;")
            _master_connection = conn

        return _master_connection


def get_db_connection(
    target: Optional[str] = None,
    enforce_foreign_keys: bool = False,
) -> sqlite3.Connection:
    """Get a connection to the active SQLite database.
    
    Ensures master connection is active before spawning child connections.
    """
    master = get_master_connection(target=target, enforce_foreign_keys=enforce_foreign_keys)

    # In shared memory mode, new connections attach to the same shared cache
    db_uri = target or _active_db_target
    is_file = not db_uri.startswith("file:") or "mode=memory" not in db_uri

    if is_file and not db_uri.startswith("file:"):
        conn = sqlite3.connect(
            db_uri,
            check_same_thread=False,
            timeout=30.0,
        )
    else:
        conn = sqlite3.connect(
            db_uri,
            uri=True,
            check_same_thread=False,
            timeout=30.0,
        )

    conn.row_factory = sqlite3.Row
    if enforce_foreign_keys:
        conn.execute("PRAGMA foreign_keys = ON;")
    return conn


# Alias for backward and cross-module compatibility
get_connection = get_db_connection


def fetch_one(
    query: str,
    params: Union[Tuple[Any, ...], Dict[str, Any]] = (),
    conn: Optional[sqlite3.Connection] = None,
) -> Optional[Dict[str, Any]]:
    """Execute a SELECT query and return the first row as a dictionary."""
    owns_conn = False
    if conn is None:
        conn = get_db_connection()
        owns_conn = True

    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        if row is None:
            return None
        return dict(row)
    finally:
        if owns_conn:
            conn.close()


def fetch_all(
    query: str,
    params: Union[Tuple[Any, ...], Dict[str, Any]] = (),
    conn: Optional[sqlite3.Connection] = None,
) -> List[Dict[str, Any]]:
    """Execute a SELECT query and return all rows as dictionaries."""
    owns_conn = False
    if conn is None:
        conn = get_db_connection()
        owns_conn = True

    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        if owns_conn:
            conn.close()


def execute_write(
    query: str,
    params: Union[Tuple[Any, ...], Dict[str, Any]] = (),
    conn: Optional[sqlite3.Connection] = None,
) -> int:
    """Execute an INSERT/UPDATE/DELETE query and return lastrowid or rowcount."""
    owns_conn = False
    if conn is None:
        conn = get_db_connection()
        owns_conn = True

    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        return cursor.lastrowid if cursor.lastrowid else cursor.rowcount
    finally:
        if owns_conn:
            conn.close()


def execute_script(
    sql_script: str,
    conn: Optional[sqlite3.Connection] = None,
) -> None:
    """Execute a multi-statement SQL script."""
    owns_conn = False
    if conn is None:
        conn = get_db_connection()
        owns_conn = True

    try:
        conn.executescript(sql_script)
        conn.commit()
    finally:
        if owns_conn:
            conn.close()


def close_master_connection() -> None:
    """Close master connection if it exists."""
    global _master_connection
    with _lock:
        if _master_connection is not None:
            try:
                _master_connection.close()
            except Exception:
                pass
            _master_connection = None
