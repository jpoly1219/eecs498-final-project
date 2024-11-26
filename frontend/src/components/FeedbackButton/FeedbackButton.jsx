import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const FeedbackButton = ({ className, text = "Feedback", onClick }) => {
  return (
    <div
      className={`feedback-button ${className}`}
      onClick={onClick} // Handles click event
    >
      <div className="feedback">{text}</div>
    </div>
  );
};

FeedbackButton.propTypes = {
  text: PropTypes.string, // The text displayed on the button
  onClick: PropTypes.func, // The function to handle button clicks
};
