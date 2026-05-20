"""
Escalation Agent — triggers alerts for high-severity attacks.
"""
from utils.logger import setup_logger

logger = setup_logger()

async def escalate(detection: dict, prompt: str):
    if detection.get("confidence", 0) > 0.9 and detection.get("is_attack"):
        logger.warning(f"HIGH SEVERITY attack escalated | prompt_snippet={prompt[:80]}")
        # TODO: send alert via email / Slack / webhook
        return {"escalated": True, "reason": "High confidence attack"}
    return {"escalated": False}
