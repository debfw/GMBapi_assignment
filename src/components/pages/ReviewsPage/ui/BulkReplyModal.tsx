import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { Send, X, Users } from "lucide-react";
import { ReviewSelection } from "./ReviewSelection";
import { useMutation } from "@tanstack/react-query";
import { replyToReviewMutationOptions } from "@/services/hooks/useReplyToReview";
import { useAISuggestion } from "@/hooks/useAISuggestion";
import { AISuggestionDisplay } from "@/components/common/AISuggestionDisplay";
import type { Review } from "@/services/types";
import { ReplyForm } from "../../../common/ReplyForm";
import { ReplyModalLayout } from "../../../common/ReplyModalLayout";

interface BulkReplyModalProps {
  show: boolean;
  reviews: Review[];
  onClose: () => void;
  onSuccess?: () => void;
}

type BulkReplyFormData = {
  text: string;
  isPublic: boolean;
};

export const BulkReplyModal: React.FC<BulkReplyModalProps> = React.memo(
  ({ show, reviews, onClose, onSuccess }) => {
    const [selectedReviews, setSelectedReviews] = useState<Set<string>>(
      new Set()
    );
    const [characterCount, setCharacterCount] = useState(0);
    const [showApiWarning, setShowApiWarning] = useState(false);

    const {
      aiSuggestion,
      showSuggestion,
      hasSuggestion,
      isLoading: isSuggestionLoading,
      handleGetSuggestion: getSuggestion,
      handleUseSuggestion,
      clearSuggestion,
    } = useAISuggestion();

    const replyMutation = useMutation({
      ...replyToReviewMutationOptions(),
      onError: () => {
        setShowApiWarning(true);
      },
    });

    useEffect(() => {
      if (show) {
        const replyableReviews = reviews.filter((r) => r.status === "new");
        setSelectedReviews(new Set(replyableReviews.map((r) => r.id)));
      }
    }, [show, reviews]);

    const handleFormSubmit = useCallback(
      async (data: BulkReplyFormData) => {
        if (selectedReviews.size === 0) return;
        for (const reviewId of selectedReviews) {
          try {
            await replyMutation.mutateAsync({
              reviewId,
              data: { text: data.text, isPublic: data.isPublic },
            });
          } catch (e) {
            // continue to next
          }
        }
        onSuccess?.();
        handleClose();
      },
      [selectedReviews, replyMutation, onSuccess]
    );

    const handleClose = useCallback(() => {
      setSelectedReviews(new Set());
      setCharacterCount(0);
      clearSuggestion();
      setShowApiWarning(false);
      onClose();
    }, [onClose, clearSuggestion]);

    const handleGetSuggestion = useCallback(() => {
      const firstId = [...selectedReviews][0];
      const firstReview = reviews.find((r) => r.id === firstId);
      if (firstReview) getSuggestion(firstReview.comment);
    }, [selectedReviews, reviews, getSuggestion]);

    const handleSelectAll = useCallback(() => {
      const replyable = reviews.filter((r) => r.status === "new");
      if (selectedReviews.size === replyable.length)
        setSelectedReviews(new Set());
      else setSelectedReviews(new Set(replyable.map((r) => r.id)));
    }, [selectedReviews.size, reviews]);

    const handleSelectReview = useCallback((reviewId: string) => {
      setSelectedReviews((prev) => {
        const next = new Set(prev);
        if (next.has(reviewId)) next.delete(reviewId);
        else next.add(reviewId);
        return next;
      });
    }, []);

    const isOverLimit = characterCount > 1000;
    const isSubmitting = replyMutation.isPending;

    return (
      <ReplyModalLayout
        show={show}
        onClose={handleClose}
        size="xl"
        className="bulk-reply-modal"
        icon={<Users size={20} className="me-3 text-primary" />}
        title={<>Bulk Reply to Reviews</>}
        warningNode={
          showApiWarning ? (
            <div
              className="mb-4 p-3 rounded-3"
              style={{
                backgroundColor: "#fef3cd",
                border: "1px solid #fecaca",
              }}
            >
              <strong>API Under Development:</strong> The reply functionality is
              currently under development and not yet available. Please check
              back later.
            </div>
          ) : undefined
        }
        footerRight={
          <>
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="d-flex align-items-center bulk-reply-cancel-button px-4"
            >
              <X size={16} className="me-2" />
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleFormSubmit({ text: "", isPublic: true })}
              disabled={
                isSubmitting ||
                isOverLimit ||
                characterCount === 0 ||
                selectedReviews.size === 0
              }
              className="d-flex align-items-center bulk-reply-send-button px-4"
            >
              {isSubmitting ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm me-2 bulk-reply-spinner"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} className="me-2" />
                  Send to {selectedReviews.size} Reviews
                </>
              )}
            </Button>
          </>
        }
      >
        <ReviewSelection
          reviews={reviews}
          selectedReviews={selectedReviews}
          onSelectAll={handleSelectAll}
          onSelectReview={handleSelectReview}
        />

        <AISuggestionDisplay
          suggestion={aiSuggestion}
          showSuggestion={showSuggestion}
          hasSuggestion={hasSuggestion}
          isLoading={isSuggestionLoading}
          onGetSuggestion={handleGetSuggestion}
          onUseSuggestion={handleUseSuggestion}
          disabled={selectedReviews.size === 0}
          buttonText={`Get Suggestion for ${selectedReviews.size} Reviews`}
          className="mb-3"
        />

        <ReplyForm
          onSubmit={handleFormSubmit}
          onTextChange={setCharacterCount}
          characterCount={characterCount}
          isSubmitting={isSubmitting}
          selectedCount={selectedReviews.size}
          aiSuggestion={aiSuggestion}
          onUseSuggestion={handleUseSuggestion}
        />
      </ReplyModalLayout>
    );
  }
);

export default BulkReplyModal;
