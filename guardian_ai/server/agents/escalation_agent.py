"""
GuardianAI — Escalation Agent
Tracks and manages critical/high-risk incidents for review.

Uses simple risk thresholds to decide whether a request needs to be
escalated for human review, on top of the blocked/sanitized/allowed
action already decided in app.py's run_pipeline.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from utils.logger import logger

# Escalate anything at or above this risk score (0–1 float, matches app.py's scale)
ESCALATION_RISK_THRESHOLD = 0.85

# Categories that always trigger escalation regardless of score
HIGH_SEVERITY_CATEGORIES = {
    "exfiltration",
    "encoded_payload",
    "delimiter_injection",
    "system_prompt_leak",
    "prompt_injection",
}


class EscalationAgent:
    def __init__(self):
        self.is_ready: bool = False
        self._escalations: Dict[str, Dict[str, Any]] = {}

    async def initialize(self):
        """Nothing heavy to load — just marks the agent ready."""
        self.is_ready = True
        logger.info("[EscalationAgent] Ready ✅")

    @property
    def total_escalations(self) -> int:
        return len(self._escalations)

    def should_escalate(self, risk_score: float, categories: List[str]) -> bool:
        """Decide whether this request needs human review."""
        if risk_score >= ESCALATION_RISK_THRESHOLD:
            return True
        if set(categories) & HIGH_SEVERITY_CATEGORIES:
            return True
        return False

    async def escalate(
        self,
        request_id: str,
        prompt: str,
        detection: Dict[str, Any],
        sanitizer_output: Dict[str, Any],
        action: str,
    ) -> Dict[str, Any]:
        """Create and store an escalation record for review."""
        escalation_id = f"ESC-{uuid.uuid4().hex[:8]}"

        record = {
            "escalation_id": escalation_id,
            "request_id": request_id,
            "prompt": prompt,
            "action": action,
            "risk_score": detection.get("risk_score", 0.0),
            "risk_label": detection.get("risk_label", "unknown"),
            "attack_categories": detection.get("attack_categories", []),
            "explanation": sanitizer_output.get("explanation", ""),
            "status": "open",
            "reviewer": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "resolved_at": None,
        }

        self._escalations[escalation_id] = record

        logger.warning(
            f"[EscalationAgent] 🚨 Escalated {escalation_id} | "
            f"risk={record['risk_score']} | categories={record['attack_categories']}"
        )

        return record

    def get_escalations(
        self, limit: int = 20, status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Return escalation records, most recent first."""
        records = list(self._escalations.values())
        if status:
            records = [r for r in records if r["status"] == status]
        records.sort(key=lambda r: r["created_at"], reverse=True)
        return records[:limit]

    def resolve_escalation(self, escalation_id: str, reviewer: str) -> bool:
        """Mark an escalation as resolved by a reviewer."""
        record = self._escalations.get(escalation_id)
        if not record:
            return False
        record["status"] = "resolved"
        record["reviewer"] = reviewer
        record["resolved_at"] = datetime.now(timezone.utc).isoformat()
        return True


escalation_agent = EscalationAgent()
