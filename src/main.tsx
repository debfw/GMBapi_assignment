import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/mobile.css";
import App from "./App.tsx";
import { ModalProvider } from "@/stores/ModalContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/stores/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

if (import.meta.env.DEV) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(" ");
    if (message.includes("Not supported: in app messages")) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  window.addEventListener("error", (event) => {
    if (
      event.message &&
      event.message.includes("Not supported: in app messages")
    ) {
      event.preventDefault();
      return false;
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason &&
      event.reason.toString().includes("Not supported: in app messages")
    ) {
      event.preventDefault();
      return false;
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <App />
      </ModalProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);
