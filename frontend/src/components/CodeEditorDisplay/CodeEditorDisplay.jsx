import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Decoration, ViewPlugin } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark"; // Optional dark theme
import "./style.css";

export const CodeEditorDisplay = (
  { className, onCodeChange, highlightedLines = [] },
) => {
  const [linesToHighlight, setLinesToHighlight] = useState([]);
  const [totalLines, setTotalLines] = useState(1);

  // Callback for handling code changes
  const handleEditorChange = (value) => {
    onCodeChange?.(value); // Notify parent about code changes
    setTotalLines(value.split("\n").length);
  };

  // Custom extension to add error line highlighting.
  const lineHighlightExtension = ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.decorations = Decoration.set(
          linesToHighlight
            .filter((line) => line <= totalLines)
            .sort()
            .map((line) => {
              console.log(line);
              return Decoration.line({
                attributes: { class: "error-line" },
              }).range(view.state.doc.line(line).from);
            }),
        );
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );

  // Effect to update error lines.
  useEffect(() => {
    setLinesToHighlight(() => [...highlightedLines]);

    const style = document.createElement("style");
    style.innerHTML = `
      .error-line {
        background-color: teal;
        border-left: 4px solid lightgreen;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [highlightedLines]);

  return (
    <div className={`code-editor-display ${className}`}>
      <CodeMirror
        value={`class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Your code here...`}
        height="400px"
        theme={oneDark}
        extensions={[
          python(), // Enable Python syntax
          lineHighlightExtension,
        ]}
        onChange={handleEditorChange} // Handle changes
      />
    </div>
  );
};
