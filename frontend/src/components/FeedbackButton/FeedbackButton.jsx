/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const FeedbackButton = ({ className, text = "Feedback" }) => {
  return (
    <div className={`feedback-button ${className}`}>
      <div className="feedback">{text}</div>
    </div>
  );
};

FeedbackButton.propTypes = {
  text: PropTypes.string,
};
