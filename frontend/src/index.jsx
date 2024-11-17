import "./globals.css"; // Ensure globals.css is inside the src/ directory
import React from "react";
import ReactDOMClient from "react-dom/client";
import { Desktop } from "./screens/Desktop";

// Match the id from index.html
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found! Check your index.html.");
} else {
  const root = ReactDOMClient.createRoot(rootElement);
  root.render(<Desktop />);
}