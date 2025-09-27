/**
 * AI Suggestion Component for Bulk Reply Modal
 * Handles AI suggestion display and interaction
 */

import React from "react";
import { Button } from "react-bootstrap";
import { Lightbulb } from "lucide-react";

interface AISuggestionProps {
  suggestion: string;
  showSuggestion: boolean;
  hasSuggestion: boolean;
  isLoading: boolean;
  selectedCount: number;
  onGetSuggestion: () => void;
  onUseSuggestion: () => void;
}

export const AISuggestion: React.FC<AISuggestionProps> = React.memo(({
  suggestion,
  showSuggestion,
  hasSuggestion,
  isLoading,
  selectedCount,
  onGetSuggestion,
  onUseSuggestion,
}) => {
  return (
    <>
      {/* AI Suggestion Display */}
      {showSuggestion && suggestion && (
        <div
          className="mb-4 p-3 rounded-3"
          style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
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

      {/* AI Suggestion Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={hasSuggestion ? onUseSuggestion : onGetSuggestion}
          disabled={selectedCount === 0 || isLoading}
          className="d-flex align-items-center"
        >
          <Lightbulb size={16} className="me-2" />
          {isLoading
            ? "Getting suggestion..."
            : hasSuggestion
              ? "Use the AI reply?"
              : "Get Suggestion"}
        </Button>
      </div>
    </>
  );
});
