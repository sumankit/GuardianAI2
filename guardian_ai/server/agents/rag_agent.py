"""
RAG Agent — retrieves similar known attacks from the vector DB.
"""
import json
from pathlib import Path

ATTACKS_PATH = Path(__file__).parent.parent / "vector_db" / "attacks.json"

async def retrieve_similar(prompt: str, top_k: int = 3) -> list:
    # TODO: use FAISS index for real similarity search
    if ATTACKS_PATH.exists():
        with open(ATTACKS_PATH) as f:
            attacks = json.load(f)
        return attacks[:top_k]
    return []
