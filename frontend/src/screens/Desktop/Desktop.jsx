import React, { useState } from "react";
import { BottomframeDefault } from "../../components/BottomframeDefault";
import { CodeEditorDisplay } from "../../components/CodeEditorDisplay";
import { ProblemDisplay } from "../../components/ProblemDisplay";
import { ProblemsButton } from "../../components/ProblemsButton";
import { SubmitButton } from "../../components/SubmitButton";
import "./style.css";

export const Desktop = () => {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [testCaseResults, setTestCaseResults] = useState("");
  const [highlightedLines, setHighlightedLines] = useState([]);

  const onCodeChange = (newCode) => {
    setCode(newCode);
    console.log(code)
  };

  const handleSubmit = async () => {
    const placeholderUrl = "http://127.0.0.1:8000/submissions/";

    // console.log("payload:", JSON.stringify({ problem: 1, code }))

    try {
      const response = await fetch(placeholderUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: 1, code }),
      });

      if (response.ok) {
        const data = await response.json();

        const testCaseFormatted = data.feedback
          .map(
            (item) =>
              `Test Case - Input: ${item.input}, Output: ${item.output || item.error
              }, Expected: ${item.expected}, Result: ${item.result}`
          )
          .join("\n");

        const feedbackFormatted = data.feedback
          .map(
            (item) =>
              `Input: ${item.input}, Output: ${item.output || item.error
              }, Expected: ${item.expected}, Result: ${item.result
              }, Feedback: ${item.ai_feedback}`
          )
          .join("\n");

        const errorLines = data.feedback
          .flatMap((item) => item.ai_error_lines)
          .filter((line) => Number.isInteger(line) && line > 0);

        setFeedback(feedbackFormatted);
        setTestCaseResults(testCaseFormatted);
        setHighlightedLines(errorLines);
      } else {
        console.error("Failed to submit code:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  return (
    <div className="desktop">
      <div className="div-2">
        <div className="overlap">
          <ProblemsButton className="problems-button-instance" />
        </div>
        <SubmitButton className="submit-button-instance" onSubmit={handleSubmit} />
        <ProblemDisplay className="problem-display-instance" />
        <CodeEditorDisplay
          className="code-editor-display-instance"
          onCodeChange={onCodeChange}
          highlightedLines={highlightedLines}
        />
        <BottomframeDefault
          className="bottomframe-default-instance"
          testCaseText={testCaseResults}
          feedbackText={feedback}
        />
      </div>
    </div>
  );
};
