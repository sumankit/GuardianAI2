"""
Explainer Agent — generates a human-readable explanation of the detection.
"""

async def explain(detection: dict) -> str:
    if not detection.get("is_attack"):
        return "No attack detected. The prompt appears safe."
    attack_type = detection.get("attack_type", "unknown")
    confidence = detection.get("confidence", 0)
    return (
        f"Prompt injection attack detected ({attack_type}) "
        f"with {confidence * 100:.1f}% confidence. "
        "The prompt has been sanitised."
    )
