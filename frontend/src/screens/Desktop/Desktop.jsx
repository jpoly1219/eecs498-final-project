import React from "react";
import { BottomframeDefault } from "../../components/BottomframeDefault";
import { CodeEditorDisplay } from "../../components/CodeEditorDisplay";
import { ProblemDisplay } from "../../components/ProblemDisplay";
import { ProblemsButton } from "../../components/ProblemsButton";
import { SubmitButton } from "../../components/SubmitButton";
import "./style.css";

export const Desktop = () => {
  return (
    <div className="desktop">
      <div className="div-2">
        <div className="overlap">
          <ProblemsButton className="problems-button-instance" />
        </div>

        <SubmitButton className="submit-button-instance" />
        <ProblemDisplay className="problem-display-instance" />
        <CodeEditorDisplay className="code-editor-display-instance" />
        <BottomframeDefault className="bottomframe-default-instance" />
      </div>
    </div>
  );
};
