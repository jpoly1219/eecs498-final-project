import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const TestCaseButton = ({ className, text = "Test Case", onClick }) => {
  return (
    <div
      className={`test-case-button ${className}`}
      onClick={onClick} // Handles click event
    >
      <div className="button-text">{text}</div>
    </div>
  );
};

TestCaseButton.propTypes = {
  text: PropTypes.string, // The text displayed on the button
  onClick: PropTypes.func, // The function to handle button clicks
};
