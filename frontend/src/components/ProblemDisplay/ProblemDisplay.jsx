/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

export const ProblemDisplay = ({ className }) => {
  return (
    <div className={`problem-display ${className}`}>
      <div className="rectangle" />

      <div className="problem-text">“Problem Text Goes Here”</div>

      <div className="text-wrapper-2">Problem:</div>

      <div className="problem-name-label">“Problem Name”</div>
    </div>
  );
};
