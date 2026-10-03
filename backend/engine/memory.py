"""
NovaMart Agent Memory, Conversation State, Pronoun Resolution, and Disambiguation.
Reused and customized from awesome-llm-apps/ai_customer_support_agent.
Enforces Law 07 (Stateful Context Continuity) and Law 01 (Ground Truth Primacy).
"""

from datetime import datetime, timezone
import json
import re
from typing import Any, Dict, List, Optional

from backend.db.connection import get_connection


class ConversationMemoryManager:
    """
    Manages historical session transcripts, context retrieval, and message logging
    from the SQLite conversations and conversation_messages tables.
    """

    def __init__(self, db_conn=None):
        self._conn = db_conn

    def _get_conn(self):
        return self._conn if self._conn else get_connection()

    def get_customer_history(self, customer_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves recent conversation records and their messages for a customer.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        
        cursor.execute(
            """
            SELECT conversation_id, customer_id, order_id, ticket_id, channel, started_at, status, handled_by, messages
            FROM conversations
            WHERE customer_id = ?
            ORDER BY started_at DESC
            LIMIT ?
            """,
            (customer_id, limit),
        )
        conversations = []
        for row in cursor.fetchall():
            conv = dict(row)
            raw_msgs = conv.get("messages")
            if isinstance(raw_msgs, str):
                try:
                    conv["messages"] = json.loads(raw_msgs)
                except Exception:
                    conv["messages"] = []
            elif not isinstance(raw_msgs, list):
                conv["messages"] = []
            conversations.append(conv)

        return conversations

    def get_recent_history(self, customer_id: str, limit: int = 3) -> str:
        """
        Returns a formatted string of recent conversation messages for prompt context injection.
        """
        convs = self.get_customer_history(customer_id, limit=limit)
        if not convs:
            return ""
        lines = []
        for c in convs:
            msgs = c.get("messages", [])
            for m in msgs[-3:]:
                sender = m.get("sender", "user")
                text = m.get("text", "")
                if text:
                    lines.append(f"{sender}: {text}")
        return "\n".join(lines)

    def get_conversation(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a single conversation by its ID.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT conversation_id, customer_id, order_id, ticket_id, channel, started_at, status, handled_by, messages
            FROM conversations
            WHERE conversation_id = ?
            """,
            (conversation_id,),
        )
        row = cursor.fetchone()
        if not row:
            return None
        conv = dict(row)
        raw_msgs = conv.get("messages")
        if isinstance(raw_msgs, str):
            try:
                conv["messages"] = json.loads(raw_msgs)
            except Exception:
                conv["messages"] = []
        elif not isinstance(raw_msgs, list):
            conv["messages"] = []
        return conv

    def get_customer_tickets(self, customer_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves existing support tickets for a customer to verify open complaints.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT ticket_id, customer_id, order_id, created_at, category, subcategory, priority, status, assigned_team, issue_summary
            FROM support_tickets
            WHERE customer_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (customer_id, limit),
        )
        return [dict(row) for row in cursor.fetchall()]

    def build_memory_context(self, customer_id: str, limit: int = 3) -> str:
        """
        Builds a concise summary string of past conversations and open tickets
        for prompt injection, preventing re-asking questions already answered.
        (Adapted from awesome-llm-apps customer support agent pattern).
        """
        conversations = self.get_customer_history(customer_id, limit=limit)
        tickets = self.get_customer_tickets(customer_id, limit=3)

        if not conversations and not tickets:
            return "No previous conversation history or open support tickets on record."

        context_lines = ["=== RELEVANT CUSTOMER CONVERSATION & TICKET HISTORY ==="]

        if tickets:
            context_lines.append("\n[Prior Support Tickets]:")
            for t in tickets:
                order_ref = f" (Order: {t['order_id']})" if t.get('order_id') else ""
                context_lines.append(
                    f"- Ticket {t['ticket_id']}{order_ref}: Status: {t['status']}, Priority: {t['priority']}, "
                    f"Team: {t['assigned_team']}, Summary: {t['issue_summary']}"
                )

        if conversations:
            context_lines.append("\n[Past Conversations]:")
            for conv in conversations:
                date_str = conv.get("started_at", "Unknown Date")
                order_str = f" [Rel: {conv['order_id']}]" if conv.get("order_id") else ""
                context_lines.append(f"\n* Conversation {conv['conversation_id']} ({date_str}){order_str} - Status: {conv['status']}:")
                # Show last 3 messages of conversation
                recent_msgs = conv.get("messages", [])[-3:]
                for m in recent_msgs:
                    context_lines.append(f"    - {m['role'].upper()}: {m['message']}")

        context_lines.append("=========================================================")
        return "\n".join(context_lines)

    def store_message(
        self,
        conversation_id: str,
        role: str,
        message: str,
        timestamp: Optional[str] = None,
    ) -> None:
        """
        Appends a message to the conversation_messages table.
        """
        ts = timestamp or datetime.now(timezone.utc).isoformat()
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT messages FROM conversations WHERE conversation_id = ?",
            (conversation_id,),
        )
        row = cursor.fetchone()
        if row:
            raw = row["messages"] if isinstance(row, dict) or hasattr(row, "keys") else row[0]
            if isinstance(raw, str):
                try:
                    msgs = json.loads(raw)
                except Exception:
                    msgs = []
            elif isinstance(raw, list):
                msgs = raw
            else:
                msgs = []
            msgs.append({"role": role, "timestamp": ts, "message": message})
            cursor.execute(
                "UPDATE conversations SET messages = ? WHERE conversation_id = ?",
                (json.dumps(msgs), conversation_id),
            )
        else:
            msgs = [{"role": role, "timestamp": ts, "message": message}]
            cursor.execute(
                """
                INSERT INTO conversations (conversation_id, customer_id, channel, started_at, status, handled_by, messages)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (conversation_id, "UNKNOWN", "chat", ts, "open", "bot", json.dumps(msgs)),
            )
        conn.commit()


class PronounContextResolver:
    """
    Resolves conversational pronouns ('it', 'that', 'the broken screen', 'photo sent yesterday')
    against historical conversation messages and customer orders.
    Enforces Law 07: Stateful Context Continuity.
    """

    PRONOUN_PATTERNS = [
        re.compile(r"\b(it|this|that|them|those|the item|the product|the order|the package)\b", re.IGNORECASE),
        re.compile(r"\b(broken screen|damaged|not working|faulty|defective)\b", re.IGNORECASE),
    ]

    EVIDENCE_PATTERNS = [
        re.compile(r"(photo|picture|image|video|proof|evidence)\s+(sent|uploaded|provided|shared|given)", re.IGNORECASE),
        re.compile(r"(already|yesterday|earlier)\s+(sent|uploaded|provided|shared|attached)", re.IGNORECASE),
        re.compile(r"(sent|uploaded)\s+(it|photo|picture)\s+(yesterday|earlier|before)", re.IGNORECASE),
    ]

    def resolve_context(
        self,
        user_message: str,
        customer_id: str,
        recent_messages: Optional[List[Dict[str, Any]]] = None,
        recent_orders: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Resolves pronouns and references in user_message.
        Returns extracted entities, evidence flags, and context enrichment.
        """
        result = {
            "original_message": user_message,
            "has_pronouns": False,
            "resolved_order_id": None,
            "resolved_product_name": None,
            "evidence_previously_provided": False,
            "identified_issue": None,
            "context_notes": [],
        }

        # Check for evidence mentions
        for pat in self.EVIDENCE_PATTERNS:
            if pat.search(user_message):
                result["evidence_previously_provided"] = True
                result["context_notes"].append("Customer indicated evidence/photo was already submitted.")
                break

        # Check for pronouns
        has_pronoun = any(pat.search(user_message) for pat in self.PRONOUN_PATTERNS)
        result["has_pronouns"] = has_pronoun

        # Direct extraction from current user message
        direct_order = re.search(r"ORD-\d{5,6}", user_message)
        if direct_order:
            result["resolved_order_id"] = direct_order.group(0)
            result["context_notes"].append(f"Extracted order ID {result['resolved_order_id']} directly from message.")

        # Check for defect/damage description directly in user message
        msg_low = user_message.lower()
        if "broken screen" in msg_low:
            result["identified_issue"] = "broken screen"
        elif "defective" in msg_low or "damaged" in msg_low:
            result["identified_issue"] = "defective/damaged item"
        elif "not delivered" in msg_low or "missing" in msg_low or "never arrived" in msg_low:
            result["identified_issue"] = "delivery dispute"

        # Scan recent messages to identify previously discussed order or product
        if recent_messages:
            # Search in reverse (most recent message first)
            for m in reversed(recent_messages):
                text = m.get("message", "")
                
                # Check for explicit order ID format (ORD-XXXXXX)
                order_match = re.search(r"ORD-\d{5,6}", text)
                if order_match and not result["resolved_order_id"]:
                    result["resolved_order_id"] = order_match.group(0)
                    result["context_notes"].append(f"Resolved order reference {result['resolved_order_id']} from conversation history.")

                # Check for evidence mentions in history
                if not result["evidence_previously_provided"]:
                    for pat in self.EVIDENCE_PATTERNS:
                        if pat.search(text):
                            result["evidence_previously_provided"] = True
                            result["context_notes"].append("Evidence/photo submission verified in prior conversation turns.")
                            break

                # Check for defect/damage description if not yet set
                if not result["identified_issue"]:
                    if "broken screen" in text.lower():
                        result["identified_issue"] = "broken screen"
                    elif "defective" in text.lower() or "damaged" in text.lower():
                        result["identified_issue"] = "defective/damaged item"
                    elif "not delivered" in text.lower() or "missing" in text.lower():
                        result["identified_issue"] = "delivery dispute"

        # If order still not identified, check recent orders
        if not result["resolved_order_id"] and recent_orders:
            # If customer only has 1 order, bind it
            if len(recent_orders) == 1:
                result["resolved_order_id"] = recent_orders[0].get("order_id")
                result["resolved_product_name"] = recent_orders[0].get("product_name")
            else:
                # Match product names mentioned in the user message
                msg_lower = user_message.lower()
                for o in recent_orders:
                    p_name = (o.get("product_name") or "").lower()
                    if p_name and any(word in msg_lower for word in p_name.split() if len(word) > 3):
                        result["resolved_order_id"] = o.get("order_id")
                        result["resolved_product_name"] = o.get("product_name")
                        break

        # If order still not identified, query customer's recent tickets or conversations
        # ONLY if customer is actually referring to a prior issue or pronoun
        if not result["resolved_order_id"] and customer_id and (has_pronoun or result["evidence_previously_provided"]):
            try:
                conn = self._conn if hasattr(self, "_conn") and self._conn else get_connection()
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT order_id FROM support_tickets WHERE customer_id = ? AND order_id IS NOT NULL ORDER BY created_at DESC LIMIT 1",
                    (customer_id,),
                )
                t_row = cursor.fetchone()
                if t_row and t_row[0]:
                    result["resolved_order_id"] = t_row[0]
                    result["context_notes"].append(f"Resolved order reference {result['resolved_order_id']} from customer support ticket history.")
                else:
                    cursor.execute(
                        "SELECT order_id FROM conversations WHERE customer_id = ? AND order_id IS NOT NULL ORDER BY started_at DESC LIMIT 1",
                        (customer_id,),
                    )
                    c_row = cursor.fetchone()
                    if c_row and c_row[0]:
                        result["resolved_order_id"] = c_row[0]
                        result["context_notes"].append(f"Resolved order reference {result['resolved_order_id']} from previous conversation transcript.")
            except Exception:
                pass

        return result


class DisambiguationCache:
    """
    Session-level cache for candidate orders across conversational turns.
    Enforces Gap 08 (Candidate Disambiguation Gate) from spec/12.
    When a customer query matches multiple orders, candidates are cached here.
    Resolves natural selections ('the first one', 'the second one', 'NM-1101', '#1').
    """

    _cache: Dict[str, List[Dict[str, Any]]] = {}

    @classmethod
    def cache_candidates(cls, session_id: str, candidates: List[Dict[str, Any]]) -> None:
        """
        Store candidate orders for a session.
        """
        cls._cache[session_id] = candidates

    store_candidates = cache_candidates

    @classmethod
    def get_candidates(cls, session_id: str) -> List[Dict[str, Any]]:
        """
        Retrieve stored candidates for a session.
        """
        return cls._cache.get(session_id, [])

    @classmethod
    def resolve_selection(cls, session_id: str, user_input: str) -> Optional[Dict[str, Any]]:
        """
        Resolves customer natural language selection to a specific candidate order.
        Handles ordinals, numbers, order ID substrings, and product names.
        """
        candidates = cls._cache.get(session_id, [])
        if not candidates:
            return None

        clean_input = user_input.strip().lower()

        # 1. Ordinal / Index matching
        first_indicators = ["first", "1st", "#1", "number 1", "former", "the first one", "the 1st one", "option 1"]
        second_indicators = ["second", "2nd", "#2", "number 2", "latter", "the second one", "the 2nd one", "option 2"]
        third_indicators = ["third", "3rd", "#3", "number 3", "the third one", "option 3"]

        if any(ind in clean_input for ind in first_indicators) or clean_input == "1":
            if len(candidates) >= 1:
                return candidates[0]

        if any(ind in clean_input for ind in second_indicators) or clean_input == "2":
            if len(candidates) >= 2:
                return candidates[1]

        if any(ind in clean_input for ind in third_indicators) or clean_input == "3":
            if len(candidates) >= 3:
                return candidates[2]

        # 2. Exact or substring match on order_id
        for cand in candidates:
            cand_id = (cand.get("order_id") or "").lower()
            if cand_id and cand_id in clean_input:
                return cand
            # Check digits only (e.g. 000001 or 1101)
            digits = re.sub(r"\D", "", cand_id)
            if digits and digits in clean_input:
                return cand

        # 3. Match by product name or keyword
        for cand in candidates:
            p_name = (cand.get("product_name") or "").lower()
            if p_name and any(token in clean_input for token in p_name.split() if len(token) > 3):
                return cand

        return None

    @classmethod
    def clear(cls, session_id: str) -> None:
        """
        Clears the cached candidates for a session.
        """
        cls._cache.pop(session_id, None)
