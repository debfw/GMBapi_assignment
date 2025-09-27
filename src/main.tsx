import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Suppress Iterable-related errors from browser extensions
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(" ");
  if (
    message.includes("iterable") ||
    message.includes("Iterable") ||
    message.includes("Not supported: in app messages")
  ) {
    // Suppress Iterable-related errors
    return;
  }
  originalConsoleError.apply(console, args);
};

// Global error handler to catch Iterable-related errors
window.addEventListener("error", (event) => {
  if (
    event.message &&
    (event.message.includes("iterable") ||
      event.message.includes("Iterable") ||
      event.message.includes("Not supported: in app messages"))
  ) {
    event.preventDefault();
    return false;
  }
});

// Global unhandled promise rejection handler
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    (event.reason.toString().includes("iterable") ||
      event.reason.toString().includes("Iterable") ||
      event.reason.toString().includes("Not supported: in app messages"))
  ) {
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
