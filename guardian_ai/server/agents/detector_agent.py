"""
Detector Agent — identifies prompt injection attacks.
Replace the stub logic with your fine-tuned classifier.
"""

async def detect(prompt: str) -> dict:
    # TODO: load model from models/detector_model and run inference
    keywords = ["ignore previous", "jailbreak", "system prompt", "DAN", "bypass"]
    is_attack = any(kw.lower() in prompt.lower() for kw in keywords)
    return {
        "is_attack": is_attack,
        "confidence": 0.95 if is_attack else 0.05,
        "attack_type": "prompt_injection" if is_attack else None,
    }
