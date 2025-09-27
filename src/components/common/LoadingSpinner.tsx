import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingSpinnerProps {
  size?: "sm" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "sm",
  className = "",
  text = "Loading...",
}) => {
  return (
    <div
      className={`d-flex align-items-center justify-content-center ${className}`}
    >
      <Spinner
        animation="border"
        size={size === "lg" ? undefined : size}
        className={`me-2 ${size === "lg" ? "loading-spinner-lg" : ""}`}
      />
      <span className="text-muted">{text}</span>
    </div>
  );
};
