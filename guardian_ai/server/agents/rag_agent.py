"""
GuardianAI — RAG Agent
Retrieves similar known attacks from a FAISS vector index built over
vector_db/attacks.json. Rebuilds the index in memory at startup so it
never depends on a stale/incompatible on-disk faiss_index file.
"""

from __future__ import annotations

import json
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import faiss

faiss.omp_set_num_threads(1)  # avoid native thread-pool clash with PyTorch/transformers
from sentence_transformers import SentenceTransformer

from config.settings import settings
from utils.logger import logger

ATTACKS_PATH = Path(__file__).parent.parent / settings.attacks_json_path


class RAGAgent:
    """Semantic similarity search over known attack patterns."""

    def __init__(self):
        self.model: Optional[SentenceTransformer] = None
        self.index: Optional[faiss.Index] = None
        self.attacks: List[Dict[str, Any]] = []
        self.is_ready: bool = False

    @property
    def attack_count(self) -> int:
        return len(self.attacks)

    async def initialize(self):
        """Load embedding model and build the FAISS index from attacks.json."""
        try:
            logger.info(f"Loading embedding model: {settings.embedding_model_name}")
            self.model = SentenceTransformer(settings.embedding_model_name)

            self.attacks = self._load_attacks()
            self._build_index(self.attacks)

            self.is_ready = True
            logger.info(
                f"RAG agent ready — {self.attack_count} attack patterns indexed."
            )
        except Exception as e:
            logger.error(f"RAG agent failed to initialize: {e}")
            self.is_ready = False

    def _load_attacks(self) -> List[Dict[str, Any]]:
        if ATTACKS_PATH.exists():
            with open(ATTACKS_PATH, "r") as f:
                return json.load(f)
        return []

    def _save_attacks(self):
        ATTACKS_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(ATTACKS_PATH, "w") as f:
            json.dump(self.attacks, f, indent=2)

    def _build_index(self, attacks: List[Dict[str, Any]]):
        if not attacks:
            self.index = None
            return
        texts = [a["text"] for a in attacks]
        embeddings = self.model.encode(
            texts, convert_to_numpy=True, normalize_embeddings=True
        )
        dim = embeddings.shape[1]
        index = faiss.IndexFlatIP(dim)  # cosine similarity via normalized inner product
        index.add(embeddings.astype("float32"))
        self.index = index

    async def query(
        self, text: str, top_k: int = 3
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Return (formatted_context_string, raw_results_list) of the top_k
        most similar known attacks to `text`.
        """
        if not self.is_ready or self.index is None or self.attack_count == 0:
            return "", []

        query_vec = self.model.encode(
            [text], convert_to_numpy=True, normalize_embeddings=True
        )
        k = min(top_k, self.attack_count)
        scores, idxs = self.index.search(query_vec.astype("float32"), k)

        results: List[Dict[str, Any]] = []
        for score, idx in zip(scores[0], idxs[0]):
            if idx == -1:
                continue
            match = dict(self.attacks[idx])
            match["similarity"] = round(float(score), 4)
            results.append(match)

        if not results:
            context = ""
        else:
            lines = ["Similar known attack patterns:"]
            for r in results:
                lines.append(
                    f"- [{r.get('severity', 'unknown')}] ({r.get('type', 'unknown')}) "
                    f'"{r.get("text", "")}" — similarity {r.get("similarity", 0)}'
                )
            context = "\n".join(lines)

        return context, results

    async def add_attack(
        self,
        text: str,
        attack_type: str,
        severity: str,
        tags: Optional[List[str]] = None,
    ) -> Optional[str]:
        """Add a new attack pattern at runtime and rebuild the index."""
        if not self.is_ready or self.model is None:
            return None

        new_id = f"ATK-{uuid.uuid4().hex[:8]}"
        entry = {
            "id": new_id,
            "type": attack_type,
            "text": text,
            "severity": severity,
            "tags": tags or [],
        }
        self.attacks.append(entry)
        self._save_attacks()
        self._build_index(self.attacks)
        return new_id


rag_agent = RAGAgent()
