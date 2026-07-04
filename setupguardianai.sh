#!/bin/bash

# ============================================================
#  guardian_ai — Full Project Scaffold Script
#  Run this from the directory where you want the project:
#    bash setup_guardian_ai.sh
# ============================================================

set -e  # Exit on any error

ROOT="guardian_ai"

echo "🛡️  Creating guardian_ai project structure..."

# ────────────────────────────────────────────────
# ROOT
# ────────────────────────────────────────────────
mkdir -p "$ROOT"

# ────────────────────────────────────────────────
# CLIENT — React + Vite Frontend
# ────────────────────────────────────────────────
mkdir -p "$ROOT/client/public"
mkdir -p "$ROOT/client/src/assets"
mkdir -p "$ROOT/client/src/components"
mkdir -p "$ROOT/client/src/pages"
mkdir -p "$ROOT/client/src/services"
mkdir -p "$ROOT/client/src/context"
mkdir -p "$ROOT/client/src/hooks"
mkdir -p "$ROOT/client/src/layouts"
mkdir -p "$ROOT/client/src/styles"

# ── Components ──
cat > "$ROOT/client/src/components/Navbar.jsx" << 'EOF'
import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>🛡️ GuardianAI</h1>
    </nav>
  );
};

export default Navbar;
EOF

cat > "$ROOT/client/src/components/PromptInput.jsx" << 'EOF'
import React, { useState } from "react";

const PromptInput = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value);
  };

  return (
    <div className="prompt-input">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter prompt to analyse..."
        rows={5}
      />
      <button onClick={handleSubmit}>Analyse</button>
    </div>
  );
};

export default PromptInput;
EOF

cat > "$ROOT/client/src/components/ResultCard.jsx" << 'EOF'
import React from "react";

const ResultCard = ({ result }) => {
  if (!result) return null;
  return (
    <div className="result-card">
      <h3>Analysis Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default ResultCard;
EOF

cat > "$ROOT/client/src/components/AttackAlert.jsx" << 'EOF'
import React from "react";

const AttackAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="attack-alert">
      ⚠️ <strong>Attack Detected:</strong> {message}
    </div>
  );
};

export default AttackAlert;
EOF

cat > "$ROOT/client/src/components/Loader.jsx" << 'EOF'
import React from "react";

const Loader = () => <div className="loader">Analysing...</div>;

export default Loader;
EOF

cat > "$ROOT/client/src/components/Sidebar.jsx" << 'EOF'
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="sidebar">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/history">History</Link></li>
      <li><Link to="/analytics">Analytics</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </aside>
);

export default Sidebar;
EOF

# ── Pages ──
for page in Home Dashboard History Analytics About; do
cat > "$ROOT/client/src/pages/${page}.jsx" << EOF
import React from "react";

const ${page} = () => {
  return (
    <div className="page">
      <h2>${page}</h2>
      {/* TODO: implement ${page} page */}
    </div>
  );
};

export default ${page};
EOF
done

# ── Services ──
cat > "$ROOT/client/src/services/api.js" << 'EOF'
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

export const analysePrompt = (prompt) =>
  api.post("/analyse", { prompt });

export const getHistory = () =>
  api.get("/history");

export const getAnalytics = () =>
  api.get("/analytics");

export default api;
EOF

cat > "$ROOT/client/src/services/socket.js" << 'EOF'
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default socket;
EOF

# ── Context ──
cat > "$ROOT/client/src/context/AuthContext.jsx" << 'EOF'
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
EOF

# ── Hooks ──
cat > "$ROOT/client/src/hooks/useAnalysis.js" << 'EOF'
import { useState } from "react";
import { analysePrompt } from "../services/api";

const useAnalysis = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyse = async (prompt) => {
    setLoading(true);
    setError(null);
    try {
      const res = await analysePrompt(prompt);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, analyse };
};

export default useAnalysis;
EOF

# ── Layouts ──
cat > "$ROOT/client/src/layouts/MainLayout.jsx" << 'EOF'
import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => (
  <div className="layout">
    <Navbar />
    <div className="layout-body">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  </div>
);

export default MainLayout;
EOF

# ── Styles ──
cat > "$ROOT/client/src/styles/globals.css" << 'EOF'
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Segoe UI", sans-serif;
  background: #0f1117;
  color: #e2e8f0;
}

.layout { display: flex; flex-direction: column; min-height: 100vh; }
.layout-body { display: flex; flex: 1; }

.navbar {
  background: #1a1d2e;
  padding: 1rem 2rem;
  border-bottom: 1px solid #2d3748;
}

.sidebar {
  width: 220px;
  background: #141722;
  padding: 2rem 1rem;
  border-right: 1px solid #2d3748;
}

.sidebar ul { list-style: none; }
.sidebar li { margin-bottom: 1rem; }
.sidebar a { color: #a0aec0; text-decoration: none; }
.sidebar a:hover { color: #63b3ed; }

.main-content { flex: 1; padding: 2rem; }

.attack-alert {
  background: #742a2a;
  border: 1px solid #fc8181;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.loader { color: #63b3ed; font-style: italic; }

.result-card {
  background: #1a1d2e;
  border: 1px solid #2d3748;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}
EOF

# ── App entry files ──
cat > "$ROOT/client/src/App.jsx" << 'EOF'
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import "./styles/globals.css";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
EOF

cat > "$ROOT/client/src/main.jsx" << 'EOF'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat > "$ROOT/client/src/routes.jsx" << 'EOF'
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import About from "./pages/About";

const AppRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </MainLayout>
);

export default AppRoutes;
EOF

# ── package.json ──
cat > "$ROOT/client/package.json" << 'EOF'
{
  "name": "guardian-ai-client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "socket.io-client": "^4.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.0",
    "vite": "^4.4.0"
  }
}
EOF

# ── vite.config.js ──
cat > "$ROOT/client/vite.config.js" << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
EOF

# ── index.html (Vite entry point) ──
cat > "$ROOT/client/public/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GuardianAI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF


# ────────────────────────────────────────────────
# SERVER — FastAPI Backend
# ────────────────────────────────────────────────
mkdir -p "$ROOT/server/agents"
mkdir -p "$ROOT/server/models/detector_model"
mkdir -p "$ROOT/server/models/embedding_model"
mkdir -p "$ROOT/server/vector_db"
mkdir -p "$ROOT/server/datasets"
mkdir -p "$ROOT/server/logs"
mkdir -p "$ROOT/server/utils"
mkdir -p "$ROOT/server/config"

# ── app.py ──
cat > "$ROOT/server/app.py" << 'EOF'
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
EOF

# ── requirements.txt ──
cat > "$ROOT/server/requirements.txt" << 'EOF'
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.4.0
python-dotenv>=1.0.0
httpx>=0.25.0
faiss-cpu>=1.7.4
sentence-transformers>=2.2.2
transformers>=4.35.0
torch>=2.1.0
pandas>=2.1.0
numpy>=1.26.0
python-socketio>=5.10.0
aiofiles>=23.2.0
EOF

# ── Agents ──
cat > "$ROOT/server/agents/detector_agent.py" << 'EOF'
"""
Detector Agent — identifies prompt injection attacks.
Replace the stub logic with your fine-tuned classifier.
"""

async def detect(prompt: str) -> dict:
    # TODO: load model from models/detector_model and run inference
    keywords = ["ignore previous", "jailbreak", "system prompt", "DAN", "bypass"]
    is_attack = any(kw.lower() in prompt.lower() for kw in keywords)
    return {
        "is_attack": is_attack,
        "confidence": 0.95 if is_attack else 0.05,
        "attack_type": "prompt_injection" if is_attack else None,
    }
EOF

cat > "$ROOT/server/agents/rag_agent.py" << 'EOF'
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
EOF

cat > "$ROOT/server/agents/sanitizer_agent.py" << 'EOF'
"""
Sanitizer Agent — cleans / neutralises a detected malicious prompt.
"""

BLOCKLIST = ["ignore previous instructions", "jailbreak", "DAN mode"]

async def sanitize(prompt: str) -> str:
    cleaned = prompt
    for phrase in BLOCKLIST:
        cleaned = cleaned.replace(phrase, "[REDACTED]")
    return cleaned
EOF

cat > "$ROOT/server/agents/explainer_agent.py" << 'EOF'
"""
Explainer Agent — generates a human-readable explanation of the detection.
"""

async def explain(detection: dict) -> str:
    if not detection.get("is_attack"):
        return "No attack detected. The prompt appears safe."
    attack_type = detection.get("attack_type", "unknown")
    confidence = detection.get("confidence", 0)
    return (
        f"Prompt injection attack detected ({attack_type}) "
        f"with {confidence * 100:.1f}% confidence. "
        "The prompt has been sanitised."
    )
EOF

cat > "$ROOT/server/agents/escalation_agent.py" << 'EOF'
"""
Escalation Agent — triggers alerts for high-severity attacks.
"""
from utils.logger import setup_logger

logger = setup_logger()

async def escalate(detection: dict, prompt: str):
    if detection.get("confidence", 0) > 0.9 and detection.get("is_attack"):
        logger.warning(f"HIGH SEVERITY attack escalated | prompt_snippet={prompt[:80]}")
        # TODO: send alert via email / Slack / webhook
        return {"escalated": True, "reason": "High confidence attack"}
    return {"escalated": False}
EOF

# ── Utils ──
cat > "$ROOT/server/utils/preprocessing.py" << 'EOF'
import re

def clean_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text

def truncate(text: str, max_tokens: int = 512) -> str:
    words = text.split()
    return " ".join(words[:max_tokens])
EOF

cat > "$ROOT/server/utils/prompts.py" << 'EOF'
SYSTEM_PROMPT = """
You are GuardianAI, a security-focused assistant specialising in
detecting and explaining prompt injection attacks.
Always respond in structured JSON unless instructed otherwise.
"""

DETECTION_PROMPT_TEMPLATE = """
Analyse the following user prompt for prompt injection indicators.
Prompt: {prompt}
Respond with JSON: {{"is_attack": bool, "attack_type": str|null, "confidence": float}}
"""
EOF

cat > "$ROOT/server/utils/helpers.py" << 'EOF'
from datetime import datetime

def timestamp() -> str:
    return datetime.utcnow().isoformat()

def truncate_log(text: str, limit: int = 120) -> str:
    return text[:limit] + "..." if len(text) > limit else text
EOF

cat > "$ROOT/server/utils/logger.py" << 'EOF'
import logging
from pathlib import Path

LOG_PATH = Path(__file__).parent.parent / "logs" / "attacks.log"

def setup_logger(name: str = "guardian_ai") -> logging.Logger:
    LOG_PATH.parent.mkdir(exist_ok=True)
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        fh = logging.FileHandler(LOG_PATH)
        ch = logging.StreamHandler()
        fmt = logging.Formatter("%(asctime)s | %(levelname)s | %(message)s")
        fh.setFormatter(fmt)
        ch.setFormatter(fmt)
        logger.addHandler(fh)
        logger.addHandler(ch)
    return logger
EOF

# ── Config ──
cat > "$ROOT/server/config/settings.py" << 'EOF'
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
EOF

# ── Placeholder data files ──
echo "[]" > "$ROOT/server/vector_db/attacks.json"
touch "$ROOT/server/vector_db/faiss_index"
touch "$ROOT/server/datasets/multilingual_dataset.csv"
touch "$ROOT/server/logs/attacks.log"
touch "$ROOT/server/models/detector_model/.gitkeep"
touch "$ROOT/server/models/embedding_model/.gitkeep"

# ── .env example ──
cat > "$ROOT/server/.env.example" << 'EOF'
DEBUG=false
API_HOST=0.0.0.0
API_PORT=8000
EOF

# ────────────────────────────────────────────────
# README
# ────────────────────────────────────────────────
cat > "$ROOT/README.md" << 'EOF'
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
EOF

# ── Root .gitignore ──
cat > "$ROOT/.gitignore" << 'EOF'
# Python
__pycache__/
*.pyc
*.pyo
.env
venv/
.venv/
*.egg-info/
dist/
build/

# Node
node_modules/
dist/
.vite/

# Models (too large for git — use Git LFS or HuggingFace Hub)
server/models/detector_model/*
server/models/embedding_model/*
!server/models/detector_model/.gitkeep
!server/models/embedding_model/.gitkeep

# Logs
server/logs/*.log

# OS
.DS_Store
Thumbs.db
EOF

echo ""
echo "✅  guardian_ai scaffold complete!"
echo ""
echo "Next steps:"
echo "  1. cd guardian_ai/server && pip install -r requirements.txt"
echo "  2. uvicorn app:app --reload"
echo "  3. cd ../client && npm install && npm run dev"
echo ""
echo "Happy building! 🚀"
