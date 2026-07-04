// hooks/useSanitize.js
// Manages state for a single sanitize API call.

import { useState, useCallback } from "react";
import { sanitizePrompt } from "../services/api";
import { useAuthContext } from "../context/AuthContext";

/**
 * useSanitize()
 *
 * Returns:
 *   sanitize(prompt)  — async function, triggers the API call
 *   result            — { original_prompt, sanitized_prompt, risk_level, attempts, validation_passed } | null
 *   loading           — boolean
 *   error             — string | null
 *   reset             — clears result and error
 */
export function useSanitize() {
  const { getAuthToken } = useAuthContext();
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const sanitize = useCallback(async (prompt, options = {}) => {
    if (!prompt?.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getAuthToken();
      const data  = await sanitizePrompt(prompt, token, options);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { sanitize, result, loading, error, reset };
}
