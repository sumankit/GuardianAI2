import React from "react";

const AttackAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="attack-alert">
      ⚠️ <strong>Attack Detected:</strong> {message}
    </div>
  );
};

export default AttackAlert;
