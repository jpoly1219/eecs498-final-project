import React from "react";
import "./style.css";

export const SubmitButton = ({ className, onSubmit }) => {
  return (
    <button className={`submit-button ${className}`} onClick={onSubmit}>
      <div className="div">Submit</div>
    </button>
  );
};
