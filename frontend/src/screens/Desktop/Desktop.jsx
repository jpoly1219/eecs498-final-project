import React, { useState } from "react";
import { BottomframeDefault } from "../../components/BottomframeDefault";
import { CodeEditorDisplay } from "../../components/CodeEditorDisplay";
import { ProblemDisplay } from "../../components/ProblemDisplay";
import { ProblemsButton } from "../../components/ProblemsButton";
import { SubmitButton } from "../../components/SubmitButton";
import "./style.css";

export const Desktop = () => {
  const [code, setCode] = useState(""); // State to hold the code from the editor

  // Callback to update the code state when it changes in the editor
  const onCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Callback to handle the submit action
  const handleSubmit = async () => {
    const placeholderUrl = "http://127.0.0.1:8000/submissions/"; // Replace with your API URL
    try {
      const response = await fetch(placeholderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "problem": 1,
          "code": code
        }), // Send the current code as the request body
      });

      if (response.ok) {
        console.log("Code submitted successfully:", await response.json());
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

        {/* Pass the handleSubmit callback to the SubmitButton */}
        <SubmitButton className="submit-button-instance" onSubmit={handleSubmit} />

        <ProblemDisplay className="problem-display-instance" />

        {/* Pass the onCodeChange callback to the CodeEditorDisplay */}
        <CodeEditorDisplay className="code-editor-display-instance" onCodeChange={onCodeChange} />

        <BottomframeDefault className="bottomframe-default-instance" />
      </div>
    </div>
  );
};
