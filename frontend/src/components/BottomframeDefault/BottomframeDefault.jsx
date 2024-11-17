/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { FeedbackButton } from "../FeedbackButton";
import "./style.css";

export const BottomframeDefault = ({ className }) => {
  return (
    <div className={`bottomframe-default ${className}`}>
      <div className="overlap-group-2">
        <FeedbackButton className="feedback-button-instance" text="Feedback" />
        <FeedbackButton className="test-casebutton" text="Test Case" />
      </div>

      <p className="p">“Test Case Text Here “</p>
    </div>
  );
};
