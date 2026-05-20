from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.detector_agent import detect
from agents.sanitizer_agent import sanitize
from agents.explainer_agent import explain
from utils.logger import setup_logger

app = FastAPI(title="GuardianAI API", version="1.0.0")
logger = setup_logger()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/analyse")
async def analyse_prompt(payload: dict):
    prompt = payload.get("prompt", "")
    detection = await detect(prompt)
    sanitized = await sanitize(prompt)
    explanation = await explain(detection)
    logger.info(f"Analysed prompt | attack={detection.get('is_attack')}")
    return {
        "original": prompt,
        "detection": detection,
        "sanitized": sanitized,
        "explanation": explanation,
    }

@app.get("/history")
async def get_history():
    # TODO: load from DB / logs
    return {"history": []}

@app.get("/analytics")
async def get_analytics():
    # TODO: aggregate from logs
    return {"analytics": {}}
