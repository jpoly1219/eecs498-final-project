import React, { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { EditorView, Decoration, DecorationSet } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark"; // Optional dark theme
import "./style.css";

export const CodeEditorDisplay = ({ className, onCodeChange, highlightedLines = [] }) => {
  const editorRef = useRef(null); // Reference for the editor instance
  const decorationsRef = useRef(Decoration.none); // Store current decorations

  // Function to create line decorations for highlighted lines
  const createDecorations = (lines, doc) => {
    const decorations = lines.map((line) => {
      const lineHandle = doc.line(line); // Get line object
      return Decoration.line({ class: "highlighted-line" }).range(lineHandle.from);
    });
    return Decoration.set(decorations);
  };

  // Callback for handling code changes
  const handleEditorChange = (value) => {
    onCodeChange?.(value); // Notify parent about code changes
  };

  // Effect to update highlighted lines
  useEffect(() => {
    if (editorRef.current) {
      const view = editorRef.current.view; // Access the underlying CodeMirror instance
      if (view) {
        const newDecorations = createDecorations(
          highlightedLines,
          view.state.doc
        );

        // Apply decorations via transaction
        view.dispatch({
          effects: EditorView.decorations.of(newDecorations),
        });

        decorationsRef.current = newDecorations; // Update stored decorations
      }
    }
  }, [highlightedLines]);

  return (
    <div className={`code-editor-display ${className}`}>
      <CodeMirror
        ref={editorRef} // Attach editor reference
        value="# Write your code here..."
        height="400px"
        theme={oneDark}
        extensions={[
          python(), // Enable Python syntax
          EditorView.decorations.of(() => decorationsRef.current), // Add decorations
        ]}
        onChange={handleEditorChange} // Handle changes
      />
    </div>
  );
};
