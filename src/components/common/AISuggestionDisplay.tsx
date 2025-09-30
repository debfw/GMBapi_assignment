import React from "react";
import { Button } from "react-bootstrap";
import { Lightbulb } from "lucide-react";
import { useAISuggestion } from "@/hooks";
import type { UseFormSetValue } from "react-hook-form";

interface AISuggestionDisplayProps {
  disabled?: boolean;
  buttonText?: string;
  className?: string;
  prompt?: string;
  onUseSuggestion: UseFormSetValue<{
    text: string;
    isPublic: boolean;
  }>;
  aiSuggestionConfig?: {
    onSuggestionApplied?: (suggestion: string) => void;
  };
}

export const AISuggestionDisplay: React.FC<AISuggestionDisplayProps> = ({
  disabled = false,
  buttonText,
  className = "",
  prompt,
  onUseSuggestion,
}) => {
  const {
    aiSuggestion: suggestion,
    showSuggestion,
    hasSuggestion,
    isLoading,
    handleGetSuggestion: onGetSuggestion,
    handleUseSuggestion,
  } = useAISuggestion();

  return (
    <>
      {/* AI Suggestion Button */}
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => {
          hasSuggestion
            ? (() => {
                onUseSuggestion("text", suggestion);
                handleUseSuggestion();
              })()
            : (() => {
                onGetSuggestion(prompt || "");
              })();
        }}
        disabled={disabled || isLoading}
        className={`d-flex align-items-center ${className}`}
      >
        <Lightbulb size={16} className="me-2" />
        {isLoading
          ? "Getting suggestion..."
          : hasSuggestion
            ? buttonText || "Use the AI reply?"
            : "Get Suggestion"}
      </Button>

      {/* AI Suggestion Display */}
      {showSuggestion && suggestion && (
        <div
          className="mt-3 p-3 rounded-3"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
          }}
        >
          <h6 className="text-muted mb-2 fw-medium small">AI Suggestion:</h6>
          <p
            className="mb-0 text-muted"
            style={{ fontStyle: "italic", fontSize: "0.9rem" }}
          >
            {suggestion}
          </p>
        </div>
      )}
    </>
  );
};
