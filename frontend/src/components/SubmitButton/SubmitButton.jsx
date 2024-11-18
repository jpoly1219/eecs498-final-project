import React, { useState } from "react";
import "./style.css";

export const SubmitButton = ({ className, onSubmit }) => {
  const [isClicked, setIsClicked] = useState(false); // State to handle the click effect

  const handleClick = async () => {
    setIsClicked(true); // Trigger the click effect
    setTimeout(() => setIsClicked(false), 1000); // Revert to original color after 1 second
    onSubmit(); // Call the provided submit function
  };

  return (
    <button
      className={`submit-button ${className} ${isClicked ? "clicked" : ""}`}
      onClick={handleClick}
    >
      <div className="div">Submit</div>
    </button>
  );
};
