import React, { useState } from "react";
import { FeedbackButton } from "../FeedbackButton/FeedbackButton";
import { TestCaseButton } from "../TestCaseButton/TestCaseButton";

import "./style.css";

export const BottomframeDefault = (
  { className, testCaseText, feedbackText },
) => {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false); // State to toggle content

  const getDisplayedText = () => {
    console.log(testCaseText);
    if (isFeedbackVisible) {
      return feedbackText && feedbackText.trim() !== ""
        ? feedbackText
        : "No Feedback Yet"; //feedbackText || "No Feedback Yet"; // Default message if no feedback
    }
    return testCaseText && testCaseText.trim() !== ""
      ? testCaseText
      : "No Test Results Yet"; //testCaseText || "No Test Results Yet"; // Default message if no test case results
  };

  return (
    <div className={`bottomframe-default ${className}`}>
      <div className="overlap-group-2">
        {/* Test Case Button */}
        <TestCaseButton
          className={`test-case-button ${!isFeedbackVisible ? "active" : ""}`}
          text="Test Case"
          onClick={() => setIsFeedbackVisible(false)} // Switch to test case content
        />

        {/* Feedback Button */}
        <FeedbackButton
          className={`feedback-button ${isFeedbackVisible ? "active" : ""}`}
          text="Feedback"
          onClick={() => setIsFeedbackVisible(true)} // Switch to feedback content
        />
      </div>

      {/* Scrollable Content Section */}
      <div className="bottomframe-content">
        <p style={{ whiteSpace: "pre-wrap" }}>{getDisplayedText()}</p>{" "}
        {/* Display appropriate content */}
      </div>
    </div>
  );
};
