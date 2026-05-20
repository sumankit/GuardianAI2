import re

def clean_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text

def truncate(text: str, max_tokens: int = 512) -> str:
    words = text.split()
    return " ".join(words[:max_tokens])
