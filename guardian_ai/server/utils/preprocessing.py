"""
GuardianAI — Preprocessing
Cleans and normalizes incoming prompts before they enter the agent pipeline.
"""

import re
import unicodedata


# ── Unicode normalization ──────────────────────────────────────────────────

def normalize_unicode(text: str) -> str:
    """
    Normalize unicode to NFKC — catches lookalike characters
    (e.g. 'ｉｇｎｏｒｅ' → 'ignore') used to evade simple blocklists.
    """
    return unicodedata.normalize("NFKC", text)


# ── Invisible / control character removal ─────────────────────────────────

def remove_invisible_chars(text: str) -> str:
    """Remove zero-width spaces, soft hyphens, and other invisible Unicode."""
    invisible = [
        "\u200b",  # zero-width space
        "\u200c",  # zero-width non-joiner
        "\u200d",  # zero-width joiner
        "\u00ad",  # soft hyphen
        "\ufeff",  # BOM / zero-width no-break space
        "\u2060",  # word joiner
    ]
    for char in invisible:
        text = text.replace(char, "")
    return text


# ── Whitespace normalization ───────────────────────────────────────────────

def normalize_whitespace(text: str) -> str:
    """Collapse all whitespace (including tabs/newlines) to single spaces."""
    return re.sub(r"[\s\t\r\n]+", " ", text).strip()


# ── Case normalization for pattern matching ───────────────────────────────

def to_lowercase_copy(text: str) -> str:
    """Return lowercase copy for pattern matching (original is preserved)."""
    return text.lower()


# ── Leetspeak / obfuscation normalization ────────────────────────────────

LEET_MAP = {
    "0": "o", "1": "i", "3": "e", "4": "a",
    "5": "s", "6": "g", "7": "t", "8": "b",
    "@": "a", "$": "s", "!": "i",
}


def normalize_leet(text: str) -> str:
    """Replace common leet-speak characters with their ASCII equivalents."""
    return "".join(LEET_MAP.get(c, c) for c in text.lower())


# ── URL / code stripping ──────────────────────────────────────────────────

def strip_urls(text: str) -> str:
    """Replace URLs with a placeholder — preserves sentence structure."""
    return re.sub(
        r"https?://[^\s]+|www\.[^\s]+",
        "[URL]",
        text,
    )


def strip_code_blocks(text: str) -> str:
    """Remove markdown code fences (content kept for analysis)."""
    text = re.sub(r"```[a-zA-Z]*\n?", "", text)
    text = re.sub(r"`[^`]+`", lambda m: m.group(0).replace("`", ""), text)
    return text.strip()


# ── Main pipeline ─────────────────────────────────────────────────────────

def preprocess(prompt: str) -> tuple[str, str]:
    """
    Full preprocessing pipeline.

    Returns:
        cleaned   — cleaned version (used for matching / embedding)
        display   — lightly cleaned version safe to show in UI
    """
    # Display version: minimal cleanup only
    display = normalize_unicode(prompt)
    display = remove_invisible_chars(display)
    display = normalize_whitespace(display)

    # Matching version: aggressive normalization
    cleaned = display.lower()
    cleaned = normalize_leet(cleaned)
    cleaned = strip_urls(cleaned)
    cleaned = strip_code_blocks(cleaned)
    cleaned = normalize_whitespace(cleaned)

    return cleaned, display


# ── Chunk splitting for long prompts ─────────────────────────────────────

def split_into_chunks(text: str, max_chars: int = 512) -> list[str]:
    """Split long text into overlapping chunks for embedding."""
    words = text.split()
    chunks = []
    current = []
    current_len = 0

    for word in words:
        current.append(word)
        current_len += len(word) + 1
        if current_len >= max_chars:
            chunks.append(" ".join(current))
            # 20% overlap
            overlap = len(current) // 5
            current = current[-overlap:]
            current_len = sum(len(w) + 1 for w in current)

    if current:
        chunks.append(" ".join(current))

    return chunks or [text]
