"""System configuration and policy constants for NovaMart AI Customer Support Agent.

Ground Truth references:
- spec/02_database_schema_and_entity_relations.md
- spec/06_product_catalog_and_category_rules.md
- spec/12_exhaustive_cross_examination_and_gap_resolution.md
"""

from datetime import datetime
import os
from pathlib import Path
from typing import Dict, Set
from dotenv import load_dotenv

# Load local environment variables from .env
load_dotenv()

# Project Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "spec" / "Problem Statement(PS)" / "public-20261003T063850Z-1-001" / "public"
PERSISTENT_DB_PATH = BASE_DIR / "backend" / "novamart.db"

# LLM Model Configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or ""
MODEL_NAME = os.environ.get("MODEL_NAME", "gemini-3.6-flash")
ENABLE_LIVE_MODEL = os.environ.get("ENABLE_LIVE_MODEL", "true").lower() in ("true", "1", "yes")

# Database Connection URIs
SQLITE_SHARED_MEM_URI = "file:novamart_mem?mode=memory&cache=shared"
SQLITE_FILE_URI = f"file:{PERSISTENT_DB_PATH.as_posix()}"

# Policy Version Cutoff Date (2026-06-01 00:00:00 IST)
# Orders placed before this timestamp follow v1; on or after follow v2
POLICY_CUTOFF_DATE_STR = "2026-06-01"
POLICY_CUTOFF_DATETIME = datetime(2026, 6, 1, 0, 0, 0)
POLICY_CUTOFF_DATE = POLICY_CUTOFF_DATETIME
POLICY_V2_CUTOFF = POLICY_CUTOFF_DATE_STR
DEFAULT_REFERENCE_DATETIME = datetime(2026, 10, 3, 14, 0, 0)

# Human Approval Thresholds (Refund, Return, Replacement)
# Pre-shipment cancellations are exempt from human approval regardless of order amount
APPROVAL_THRESHOLD_V1 = 100000.0  # INR 1,00,000 for Policy v1
APPROVAL_THRESHOLD_V2 = 75000.0   # INR 75,000 for Policy v2

# High-Value Restocking Categories (Subject to Restocking Fee under Policy v2 Change-of-Mind)
RESTOCKING_CATEGORIES: Set[str] = {
    "Laptops",
    "Tablets",
    "Cameras",
    "Monitors",
}
RESTOCKING_FEE_CATEGORIES = RESTOCKING_CATEGORIES

# Restocking Fee Formula Parameters (Policy v2 Change-of-Mind)
# Restocking Fee = min(0.05 * item_refund_amount, 2500.0)
RESTOCKING_FEE_RATE = 0.05          # 5% of item refund
RESTOCKING_FEE_MAX_CAP = 2500.0     # Capped at INR 2,500
RESTOCKING_FEE_MAX = RESTOCKING_FEE_MAX_CAP

# Delivery Security & OTP Verification Threshold
# Orders >= INR 5,000 require OTP verification on delivery
OTP_DELIVERY_THRESHOLD = 5000.0

# Shipping Fee Rules
FREE_SHIPPING_THRESHOLD = 1000.0  # Free shipping if subtotal after discount >= INR 1,000
STANDARD_SHIPPING_FEE = 79.0      # Flat INR 79 otherwise
GST_RATE = 0.18                   # 18% GST rate

# Goodwill Credit for Shipping Delays
GOODWILL_CREDIT_PER_3_DAYS = 100.0  # INR 100 for each full 3 days late beyond ETA
GOODWILL_CREDIT_MAX_CAP = 300.0     # Maximum goodwill credit capped at INR 300

# Courier Codes and Mapping
COURIER_CODES: Dict[str, str] = {
    "BAX": "BlueArrow Express",
    "SLN": "SwiftLane",
    "KVC": "KaveriCargo",
    "DLP": "DeltaPost",
    "RRL": "RoadRunner Logistics",
}

COURIER_PREFIXES = tuple(COURIER_CODES.keys())
COURIER_NAMES = tuple(COURIER_CODES.values())

# Loyalty Tier Extensions (Calendar Days for Change-of-Mind Returns)
LOYALTY_RETURN_WINDOW_EXTENSIONS: Dict[str, int] = {
    "bronze": 0,
    "silver": 0,
    "gold": 2,
    "platinum": 3,
}

# Return & Refund Windows by Reason (in Days from actual_delivery_date as Day 0)
RETURN_WINDOWS_V1: Dict[str, int] = {
    "change_of_mind": 7,
    "defective": 7,
    "damaged": 7,
    "wrong_item": 7,
    "missing_item": 7,
}

RETURN_WINDOWS_V2: Dict[str, int] = {
    "change_of_mind": 7,    # + loyalty extension
    "defective": 10,        # Extended to 10 days in v2
    "damaged": 10,          # Extended to 10 days in v2
    "wrong_item": 10,       # Extended to 10 days in v2
    "missing_item": 10,     # Extended to 10 days in v2
}

# SLA Definitions for Support Tickets
SLA_DEFINITIONS = {
    "critical": {
        "first_response_minutes": 15,
        "resolution_hours": 4,
        "description": "First response 15 min | Resolution 4 hours",
    },
    "high": {
        "first_response_minutes": 60,
        "resolution_hours": 24,
        "description": "First response 1 hour | Resolution 24 hours",
    },
    "medium": {
        "first_response_minutes": 240,
        "resolution_business_days": 3,
        "description": "First response 4 hours | Resolution 3 business days",
    },
    "low": {
        "first_response_minutes": 1440,
        "resolution_business_days": 5,
        "description": "First response 24 hours | Resolution 5 business days",
    },
}

SLA_MATRIX = {"critical": 4, "high": 24, "medium": 72, "low": 120}

# Escalation Teams
ESCALATION_TEAMS = (
    "Tier 1 Support",
    "Refunds & Payments",
    "Logistics Desk",
    "Technical Support",
    "Trust & Safety",
    "Customer Experience",
    "Support Lead",
)

# Abuse Frequency Thresholds
MAX_CANCELLATIONS_30_DAYS = 5
MAX_CLAIMS_90_DAYS = 3
