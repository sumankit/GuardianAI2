// hooks/useHistory.js
import { useState, useEffect, useCallback } from "react";
import { getHistory } from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export function useHistory(limitPerPage = 20) {
  const { getAuthToken, isSignedIn } = useAuthContext();
  const [logs,    setLogs]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchPage = useCallback(async (p) => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const data  = await getHistory(token, p, limitPerPage);
      setLogs(data.logs ?? data);
      setTotal(data.total ?? data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, limitPerPage]);

  useEffect(() => {
    if (isSignedIn) fetchPage(page);
  }, [isSignedIn, page]);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return { logs, total, page, loading, error, nextPage, prevPage };
}
