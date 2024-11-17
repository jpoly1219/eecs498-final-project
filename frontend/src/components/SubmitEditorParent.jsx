import React, { useState } from "react";
import { CodeEditorDisplay } from "./CodeEditorDisplay";
import { SubmitButton } from "./SubmitButton";
import "./style.css";

export const CodeEditorWithSubmit = () => {
  const [code, setCode] = useState(""); // State to hold the editor's code

  // Define the onCodeChange function
  const onCodeChange = (newCode) => {
    setCode(newCode); // Update the code state with the new value
  };

  // Function to handle submission
  const handleSubmit = async () => {
    const placeholderUrl = "https://placeholder.url/api/submit"; // Placeholder API URL
    try {
      const response = await fetch(placeholderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }), // Send the current code as the request body
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
    <div className="code-editor-with-submit">
      {/* Pass the onCodeChange function as a prop */}
      <CodeEditorDisplay
        className="editor"
        onCodeChange={onCodeChange}
      />
    </div>
  );
};
