import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror"; // Import CodeMirror
import { python } from "@codemirror/lang-python"; // Language support for Python
import "./style.css";

export const CodeEditorDisplay = ({ className, onCodeChange }) => {
  const [code, setCode] = useState("# Write your code here...");

  const handleEditorChange = (value) => {
    setCode(value);
    if (onCodeChange) {
      onCodeChange(value); // Pass the updated code to the parent
    }
  };

  return (
    <div className={`code-editor-display ${className}`}>
      <div className="overlap-group">
        <div className="text-wrapper-3">Code Editor</div>
      </div>

      {/* CodeMirror Editor */}
      <div className="editor-container">
        <CodeMirror
          value={code}
          height="400px"
          extensions={[python()]} // Set Python mode
          theme="dark" // Use dark theme
          onChange={handleEditorChange} // Correct event handler
        />
      </div>
    </div>
  );
};
