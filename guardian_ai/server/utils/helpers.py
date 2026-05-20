from datetime import datetime

def timestamp() -> str:
    return datetime.utcnow().isoformat()

def truncate_log(text: str, limit: int = 120) -> str:
    return text[:limit] + "..." if len(text) > limit else text
