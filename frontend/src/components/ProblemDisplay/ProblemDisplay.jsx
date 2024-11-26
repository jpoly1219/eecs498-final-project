import React, { useEffect, useState } from "react";
import "./style.css";

export const ProblemDisplay = ({ className }) => {
  const [problemData, setProblemData] = useState({ title: "", description: "" });

  useEffect(() => {
    // Fetch problem data when the component loads
    const fetchProblem = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/problem/");
        if (response.ok) {
          const data = await response.json();

          // Preprocess the description: remove "**LeetCode Question Body**" and replace \n with newlines
          const formattedDescription = data.description
            .replace("**LeetCode Question Body**", "") // Remove this phrase
            .replace(/\\n/g, "\n"); // Replace all \n with actual newlines

          // Update the state with the formatted description
          setProblemData({ ...data, description: formattedDescription });
        } else {
          console.error("Failed to fetch problem data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching problem data:", error);
      }
    };

    fetchProblem();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className={`problem-display ${className}`}>
      <div className="rectangle" />
      <div className="text-wrapper-2">Problem:</div>
      <div className="problem-name-label">{problemData.title}</div>
      <div className="problem-text-container">
        <p className="problem-text">{problemData.description}</p>
      </div>
    </div>
  );
};
