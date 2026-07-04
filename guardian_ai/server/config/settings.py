"""
GuardianAI — Configuration
All settings are loaded from environment variables / .env file.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # ── API ───────────────────────────────────────────────────────
    groq_api_key: str = Field(default="", validation_alias="GROQ_API_KEY")
    groq_model: str = "llama-3.1-8b-instant"

    clerk_secret_key: str = Field(default="", validation_alias="CLERK_SECRET_KEY")

    # ── Server ────────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    environment: str = "development"

    # ── CORS ──────────────────────────────────────────────────────
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    # ── Model paths ───────────────────────────────────────────────
    detector_model_path: str = "models/detector_model"
    embedding_model_name: str = "all-MiniLM-L6-v2"

    # ── Vector DB ─────────────────────────────────────────────────
    vector_db_path: str = "vector_db/faiss_index"
    attacks_json_path: str = "vector_db/attacks.json"

    # ── Risk thresholds ───────────────────────────────────────────
    risk_threshold_high: float = 0.75
    risk_threshold_medium: float = 0.45

    # ── Rate limiting ─────────────────────────────────────────────
    rate_limit_rpm: int = 60

    # ── Logging ───────────────────────────────────────────────────
    log_level: str = "INFO"
    log_file: str = "logs/guardianai.log"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
