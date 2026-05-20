from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "GuardianAI"
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    model_path: str = "models/detector_model"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    faiss_index_path: str = "vector_db/faiss_index"
    attacks_json_path: str = "vector_db/attacks.json"
    log_path: str = "logs/attacks.log"

    class Config:
        env_file = ".env"

settings = Settings()
