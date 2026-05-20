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
