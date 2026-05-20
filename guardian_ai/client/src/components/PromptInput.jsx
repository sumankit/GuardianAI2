import React, { useState } from "react";

const PromptInput = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value);
  };

  return (
    <div className="prompt-input">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter prompt to analyse..."
        rows={5}
      />
      <button onClick={handleSubmit}>Analyse</button>
    </div>
  );
};

export default PromptInput;
