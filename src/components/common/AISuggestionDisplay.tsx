import React from "react";
import { Button } from "react-bootstrap";
import { Lightbulb } from "lucide-react";

interface AISuggestionDisplayProps {
  suggestion: string;
  showSuggestion: boolean;
  hasSuggestion: boolean;
  isLoading: boolean;
  onGetSuggestion: () => void;
  onUseSuggestion: () => void;
  disabled?: boolean;
  buttonText?: string;
  className?: string;
}

export const AISuggestionDisplay: React.FC<AISuggestionDisplayProps> = ({
  suggestion,
  showSuggestion,
  hasSuggestion,
  isLoading,
  onGetSuggestion,
  onUseSuggestion,
  disabled = false,
  buttonText,
  className = "",
}) => {
  return (
    <>
      {/* AI Suggestion Button */}
      <Button
        variant="outline-primary"
        size="sm"
        onClick={hasSuggestion ? onUseSuggestion : onGetSuggestion}
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
