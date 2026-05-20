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
