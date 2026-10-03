"""Domain Knowledge Graph Query Interface for NovaMart.

Provides high-speed semantic traversal and factual lookups
from the dedicated domain knowledge graph (policies, product constraints,
and database schema relationships).
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

GRAPH_PATH = Path(__file__).resolve().parent.parent / "domain_knowledge" / "graphify-out" / "graph.json"


class DomainKnowledgeGraph:
    """In-memory loaded domain knowledge graph for ultra-fast policy reasoning."""

    _instance: Optional["DomainKnowledgeGraph"] = None

    def __init__(self, graph_file: Optional[Path] = None):
        self.graph_file = graph_file or GRAPH_PATH
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.links: List[Dict[str, Any]] = []
        self._load()

    @classmethod
    def get_instance(cls) -> "DomainKnowledgeGraph":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load(self):
        if not self.graph_file.exists():
            return
        with open(self.graph_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            for node in data.get("nodes", []):
                self.nodes[node["id"]] = node
            self.links = data.get("links", [])

    def query(self, term: str) -> List[Dict[str, Any]]:
        """Finds all nodes matching the search term."""
        term_lower = term.lower()
        results = []
        for node in self.nodes.values():
            label = node.get("label", "").lower()
            summary = node.get("summary", "").lower()
            if term_lower in label or term_lower in summary:
                results.append(node)
        return results

    def get_policy(self, policy_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves exact policy document or rule node."""
        return self.nodes.get(policy_id)

    def get_category_rules(self, category_name: str) -> Dict[str, Any]:
        """Retrieves category specific rules and exceptions."""
        cat_key = f"category_{category_name.lower().split()[0]}"
        cat_node = self.nodes.get(cat_key)
        if not cat_node:
            # Fallback search
            matches = [n for n in self.nodes.values() if n.get("type") == "product_category" and category_name.lower() in n.get("label", "").lower()]
            cat_node = matches[0] if matches else None

        if not cat_node:
            return {"category": category_name, "is_restocking": False, "rules": "Standard 7-day return window"}

        # Check linked rules
        linked_edges = [e for e in self.links if e["source"] == cat_node["id"] or e["target"] == cat_node["id"]]
        return {
            "category": category_name,
            "label": cat_node["label"],
            "summary": cat_node["summary"],
            "properties": cat_node.get("properties", {}),
            "edges": linked_edges,
        }

    def explain_restocking_rule(self, category: str, return_reason: str, policy_version: str) -> Dict[str, Any]:
        """Determines restocking fee application from the domain graph."""
        if policy_version.lower() == "v1":
            return {
                "applicable": False,
                "fee_percent": 0.0,
                "max_cap": 0.0,
                "reason": "Policy v1 (< 2026-06-01) exempts all categories from restocking fees."
            }
        
        if return_reason.lower() != "change_of_mind":
            return {
                "applicable": False,
                "fee_percent": 0.0,
                "max_cap": 0.0,
                "reason": "Defective, damaged, or DOA items never incur restocking fees under any policy."
            }

        cat_info = self.get_category_rules(category)
        is_restocking = cat_info.get("properties", {}).get("is_restocking_category", False)
        if is_restocking:
            return {
                "applicable": True,
                "fee_percent": 5.0,
                "max_cap": 2500.0,
                "reason": f"Under Policy v2 (>= 2026-06-01), change-of-mind returns on {category} incur a 5% restocking fee capped at ₹2,500."
            }
        
        return {
            "applicable": False,
            "fee_percent": 0.0,
            "max_cap": 0.0,
            "reason": f"Category {category} is exempt from restocking fees."
        }


# Global singleton instance
domain_graph = DomainKnowledgeGraph.get_instance()
