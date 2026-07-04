import { useState, useEffect } from "react";

export function useAnalytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // Replace with real API call when backend is ready
    setLoading(false);
  }, []);

  return { data, loading, error };
}