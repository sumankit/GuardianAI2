"""
GuardianAI — Helpers
Shared utility functions used across agents.
"""

from __future__ import annotations

import re
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict


# ── ID / timestamp helpers ─────────────────────────────────────────────────


def generate_request_id() -> str:
    """Generate a unique request ID."""
    return str(uuid.uuid4())


def utc_now_iso() -> str:
    """Return current UTC time as ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


# ── Text helpers ───────────────────────────────────────────────────────────


def truncate(text: str, max_len: int = 500) -> str:
    """Truncate text for safe logging / display."""
    if len(text) <= max_len:
        return text
    return text[:max_len] + "…"


def normalize_whitespace(text: str) -> str:
    """Collapse multiple whitespace into single space."""
    return re.sub(r"\s+", " ", text).strip()


def strip_html(text: str) -> str:
    """Remove HTML tags from text."""
    return re.sub(r"<[^>]+>", "", text).strip()


def redact_pii(text: str) -> str:
    """
    Basic PII redaction:
    - Emails
    - Phone numbers (US-style)
    - Credit card–like patterns
    """
    text = re.sub(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[EMAIL REDACTED]", text
    )
    text = re.sub(
        r"\b(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
        "[PHONE REDACTED]",
        text,
    )
    text = re.sub(r"\b(?:\d[ -]*?){13,16}\b", "[CARD REDACTED]", text)
    return text


# ── Risk helpers ───────────────────────────────────────────────────────────


def score_to_label(score: float) -> str:
    """Convert a 0–1 risk score to a human-readable label."""
    if score >= 0.85:
        return "critical"
    elif score >= 0.65:
        return "high"
    elif score >= 0.40:
        return "medium"
    else:
        return "low"


def label_to_color(label: str) -> str:
    """Map risk label to a hex color for the frontend."""
    return {
        "critical": "#ef4444",
        "high": "#f97316",
        "medium": "#f59e0b",
        "low": "#22c55e",
    }.get(label, "#6b7280")


# ── Timer context manager ──────────────────────────────────────────────────


class Timer:
    """Simple wall-clock timer."""

    def __enter__(self):
        self._start = time.perf_counter()
        return self

    def __exit__(self, *_):
        self.elapsed_ms = round((time.perf_counter() - self._start) * 1000, 2)


# ── Structured response builder ────────────────────────────────────────────


def build_response(
    request_id: str,
    action: str,
    original_prompt: str,
    sanitized_prompt: str,
    risk_score: float,
    risk_label: str,
    explanation: str,
    matched_patterns: list,
    rag_context: list,
    escalated: bool,
    latency_ms: float,
    extra: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    response = {
        "request_id": request_id,
        "timestamp": utc_now_iso(),
        "action": action,  # "blocked" | "sanitized" | "allowed"
        "original_prompt": original_prompt,
        "sanitized_prompt": sanitized_prompt,
        "risk_score": round(risk_score, 4),
        "risk_label": risk_label,
        "explanation": explanation,
        "matched_patterns": matched_patterns,
        "rag_similar_attacks": rag_context,
        "escalated": escalated,
        "latency_ms": latency_ms,
    }
    if extra:
        response.update(extra)
    return response
