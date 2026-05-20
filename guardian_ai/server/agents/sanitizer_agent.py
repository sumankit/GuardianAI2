"""
Sanitizer Agent — cleans / neutralises a detected malicious prompt.
"""

BLOCKLIST = ["ignore previous instructions", "jailbreak", "DAN mode"]

async def sanitize(prompt: str) -> str:
    cleaned = prompt
    for phrase in BLOCKLIST:
        cleaned = cleaned.replace(phrase, "[REDACTED]")
    return cleaned
