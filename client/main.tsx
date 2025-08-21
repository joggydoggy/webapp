import "./global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Ensure we only create root once
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

// Check if root already exists to prevent double creation
let root: ReturnType<typeof createRoot>;

if (container.hasAttribute('data-root-created')) {
  // If we're in development and hot reloading, just render
  root = (container as any).__reactRoot;
} else {
  // Create root and mark container
  root = createRoot(container);
  (container as any).__reactRoot = root;
  container.setAttribute('data-root-created', 'true');
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
