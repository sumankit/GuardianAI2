// hooks/useDashboard.js
import { useState, useEffect } from "react";
import { getDashboardStats, getThreatTrend } from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export function useDashboard() {
  const { getAuthToken, isSignedIn } = useAuthContext();
  const [stats,   setStats]   = useState(null);
  const [trend,   setTrend]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      try {
        const token = await getAuthToken();
        const [statsData, trendData] = await Promise.all([
          getDashboardStats(token),
          getThreatTrend(token, 10),
        ]);
        setStats(statsData);
        setTrend(trendData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  return { stats, trend, loading, error };
}
