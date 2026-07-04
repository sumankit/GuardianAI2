// services/socket.js
// WebSocket connection for real-time attack alerts from the GuardianAI backend.
// Usage: import { createSocket } from "../services/socket";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/alerts";

/**
 * Creates and manages a WebSocket connection to the GuardianAI alert stream.
 *
 * @param {string}   token       - Clerk JWT for authentication
 * @param {Function} onMessage   - called with parsed alert object on each event
 * @param {Function} onError     - called with error event
 * @param {Function} onClose     - called when connection closes
 * @returns {{ close: Function }} - object with a close() method to disconnect
 *
 * Usage in a component:
 *   const socket = createSocket(token, (alert) => setAlerts(prev => [alert, ...prev]));
 *   return () => socket.close();  // cleanup on unmount
 */
export function createSocket(token, onMessage, onError, onClose) {
  // Pass token as query param (FastAPI reads it server-side)
  const url = `${WS_URL}?token=${token}`;
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("[GuardianAI WS] Connected to alert stream.");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // Expected shape: { id, prompt, risk_level, type, timestamp }
      if (onMessage) onMessage(data);
    } catch {
      console.warn("[GuardianAI WS] Could not parse message:", event.data);
    }
  };

  ws.onerror = (err) => {
    console.error("[GuardianAI WS] Error:", err);
    if (onError) onError(err);
  };

  ws.onclose = (event) => {
    console.log("[GuardianAI WS] Disconnected.", event.code, event.reason);
    if (onClose) onClose(event);
  };

  return {
    close: () => ws.close(),
    send: (data) => ws.send(JSON.stringify(data)),
    get readyState() {
      return ws.readyState;
    },
  };
}

// WebSocket ready state constants for reference
export const WS_STATE = {
  CONNECTING: 0,
  OPEN:       1,
  CLOSING:    2,
  CLOSED:     3,
};
