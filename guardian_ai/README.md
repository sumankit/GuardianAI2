# 🛡️ GuardianAI — Prompt Injection Detection System

A full-stack AI security platform that detects, sanitises, and explains prompt injection attacks in real time.

---

## Project Structure

```
guardian_ai/
├── client/     # React + Vite frontend
└── server/     # FastAPI backend with AI agents
```

---

## Quick Start

### Backend
```bash
cd server
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Frontend
```bash
cd client
npm install
npm run dev          # Runs on http://localhost:3000
```

---

## Agents

| Agent | Role |
|---|---|
| `detector_agent` | Classifies prompts as attack / benign |
| `rag_agent` | Retrieves similar known attacks via FAISS |
| `sanitizer_agent` | Redacts malicious content |
| `explainer_agent` | Generates human-readable explanations |
| `escalation_agent` | Alerts on high-severity detections |

---

## Tech Stack
- **Frontend**: React 18, Vite, React Router, Axios, Socket.IO
- **Backend**: FastAPI, Uvicorn, FAISS, Sentence Transformers, HuggingFace Transformers
- **Logging**: Python logging → `logs/attacks.log`
