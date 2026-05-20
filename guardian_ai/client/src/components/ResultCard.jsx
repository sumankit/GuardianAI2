import React from "react";

const ResultCard = ({ result }) => {
  if (!result) return null;
  return (
    <div className="result-card">
      <h3>Analysis Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default ResultCard;
