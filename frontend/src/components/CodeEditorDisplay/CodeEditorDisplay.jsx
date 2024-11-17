/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

export const CodeEditorDisplay = ({ className }) => {
  return (
    <div className={`code-editor-display ${className}`}>
      <div className="overlap-group">
        <div className="text-wrapper-3">Code Editor</div>
      </div>

      <div className="text-wrapper-4">“Student Code Here”</div>
    </div>
  );
};
