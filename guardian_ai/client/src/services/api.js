// services/api.js
// All HTTP calls to the GuardianAI FastAPI backend.
// Every protected call attaches the Clerk JWT automatically.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Core fetch wrapper.
 * @param {string} path      - e.g. "/sanitize"
 * @param {object} options   - standard fetch options
 * @param {string|null} token - Clerk JWT (null for public endpoints)
 */
async function request(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorBody.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ── public endpoints ──────────────────────────────────────────────────────────

/** Check if the backend is alive */
export async function healthCheck() {
  return request("/health");
}

// ── protected endpoints (require Clerk token) ─────────────────────────────────

/**
 * Sanitize a prompt.
 * @param {string} prompt
 * @param {string} token   - Clerk JWT from getAuthToken()
 * @param {object} options - { max_new_tokens, temperature, top_p }
 * @returns {{ original_prompt, sanitized_prompt, risk_level, attempts, validation_passed }}
 */
export async function sanitizePrompt(prompt, token, options = {}) {
  return request(
    "/sanitize",
    {
      method: "POST",
      body: JSON.stringify({
        prompt,
        max_new_tokens: options.max_new_tokens ?? 150,
        temperature:    options.temperature    ?? 0.4,
        top_p:          options.top_p          ?? 0.9,
      }),
    },
    token
  );
}

/**
 * Fetch paginated history logs.
 * @param {string} token
 * @param {number} page
 * @param {number} limit
 * @returns {{ logs: [], total: number }}
 */
export async function getHistory(token, page = 1, limit = 20) {
  return request(`/history?page=${page}&limit=${limit}`, {}, token);
}

/**
 * Fetch analytics summary.
 * @param {string} token
 * @returns {{ total_scanned, total_blocked, sanitized, avg_confidence, by_category }}
 */
export async function getAnalytics(token) {
  return request("/analytics", {}, token);
}

/**
 * Fetch dashboard stats.
 * @param {string} token
 * @returns {{ requests_scanned, unsafe_blocked, rules_active, auto_rewrites }}
 */
export async function getDashboardStats(token) {
  return request("/dashboard/stats", {}, token);
}

/**
 * Fetch threat trend data (for the bar chart).
 * @param {string} token
 * @param {number} days  - number of days of data to return
 * @returns {Array<{ date: string, count: number }>}
 */
export async function getThreatTrend(token, days = 10) {
  return request(`/dashboard/trend?days=${days}`, {}, token);
}
