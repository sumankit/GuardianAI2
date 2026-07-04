// hooks/useAlerts.js
// Subscribes to the GuardianAI WebSocket alert stream.

import { useState, useEffect, useRef } from "react";
import { createSocket } from "../services/socket";
import { useAuthContext } from "../context/AuthContext";

/**
 * useAlerts(maxAlerts?)
 *
 * Returns:
 *   alerts      — array of alert objects, newest first (capped at maxAlerts)
 *   connected   — boolean
 *   clearAlerts — empties the alerts list
 */
export function useAlerts(maxAlerts = 50) {
  const { getAuthToken, isSignedIn } = useAuthContext();
  const [alerts,    setAlerts]    = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;

    (async () => {
      const token = await getAuthToken();
      if (cancelled || !token) return;

      socketRef.current = createSocket(
        token,
        (alert) => {
          setAlerts((prev) => {
            const updated = [alert, ...prev];
            return updated.slice(0, maxAlerts);
          });
        },
        () => setConnected(false),
        () => setConnected(false)
      );

      setConnected(true);
    })();

    return () => {
      cancelled = true;
      socketRef.current?.close();
      setConnected(false);
    };
  }, [isSignedIn, maxAlerts]);

  const clearAlerts = () => setAlerts([]);

  return { alerts, connected, clearAlerts };
}
