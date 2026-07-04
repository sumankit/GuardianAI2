// hooks/useAnalytics.js
import { useState, useEffect } from "react";
import { getAnalytics } from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export function useAnalytics() {
  const { getAuthToken, isSignedIn } = useAuthContext();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        const token = await getAuthToken();
        setData(await getAnalytics(token));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  return { data, loading, error };
}
