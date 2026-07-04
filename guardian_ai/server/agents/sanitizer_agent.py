"""
GuardianAI — Sanitizer Agent (adapter)
Wraps the existing SanitizerExplainerAgent (regex + fuzzy detection + Groq
explanation, in sanitizer_explainer_agent.py) behind the async interface
that app.py expects: initialize(), is_ready, sanitize_and_explain(text, detection).
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from utils.logger import logger
from agents.sanitizer_explainer_agent import SanitizerExplainerAgent, RULE_DESCRIPTIONS


class SanitizerAgent:
    def __init__(self):
        self._engine: Optional[SanitizerExplainerAgent] = None
        self.is_ready: bool = False

    async def initialize(self):
        try:
            self._engine = SanitizerExplainerAgent()
            self.is_ready = True
            logger.info("[SanitizerAgent] Ready ✅")
        except Exception as e:
            logger.error(f"[SanitizerAgent] Failed to initialize: {e}")
            self.is_ready = False

    async def sanitize_and_explain(
        self, text: str, detection: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Runs the sanitize + fuzzy-detect + explain pipeline and returns a
        dict shaped to match what app.py's run_pipeline expects.
        """
        if not self.is_ready or self._engine is None:
            return {
                "sanitized_prompt": text,
                "explanation": "⚠️ Sanitizer agent not ready.",
                "removed_elements": [],
                "preserved_intent": "Unknown — sanitizer unavailable.",
                "policy_rules_triggered": [],
                "user_facing_message": "Your request could not be fully processed. Please try again.",
                "rewrite_confidence": 0.0,
            }

        result = self._engine.process(text)

        rules_triggered: List[str] = result.get("rules_triggered", [])
        removed_elements = [RULE_DESCRIPTIONS.get(r, r) for r in rules_triggered]

        was_modified = result.get("was_modified", False)
        user_facing_message = (
            "Your request contained content that violates safety policy and has been modified."
            if was_modified
            else "Your request is safe and has been processed."
        )
        preserved_intent = (
            "The core intent of your request was preserved where safe to do so."
            if was_modified
            else "Full original intent preserved."
        )

        return {
            "sanitized_prompt": result.get("sanitized_text", text),
            "explanation": result.get("explanation", ""),
            "removed_elements": removed_elements,
            "preserved_intent": preserved_intent,
            "policy_rules_triggered": rules_triggered,
            "user_facing_message": user_facing_message,
            "rewrite_confidence": 1.0 if result.get("groq_called") else 0.85,
            "fuzzy_hits": result.get("fuzzy_hits", {}),
        }


sanitizer_agent = SanitizerAgent()
