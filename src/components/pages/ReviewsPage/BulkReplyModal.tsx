import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { Send, X, Users } from "lucide-react";
import { ReviewSelection } from "./ReviewSelection";
import { ReplyForm } from "./ReplyForm";
import { useMutation } from "@tanstack/react-query";
import { replyToReviewMutationOptions } from "@/services/hooks";
import { useAISuggestion } from "@/hooks/useAISuggestion";
import { AISuggestionDisplay } from "@/components/common/AISuggestionDisplay";
import type { Review } from "@/services/types";

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
      onError: (_error) => {
        setShowApiWarning(true);
      },
    });

    useEffect(() => {
      if (show) {
        const replyableReviews = reviews.filter(
          (review) => review.status === "new"
        );
        setSelectedReviews(
          new Set(replyableReviews.map((review) => review.id))
        );
      }
    }, [show, reviews]);

    const handleFormSubmit = useCallback(
      async (data: BulkReplyFormData) => {
        if (selectedReviews.size === 0) return;

        for (const reviewId of selectedReviews) {
          const review = reviews.find((r) => r.id === reviewId);
          if (review) {
            try {
              await replyMutation.mutateAsync({
                reviewId,
                data: {
                  text: data.text,
                  isPublic: data.isPublic,
                },
              });
            } catch (error) {
              console.error(error);
              // Failed to reply to review
              // Continue with next review even if one fails
            }
          }
        }

        // All replies completed
        onSuccess?.();
        handleClose();
      },
      [selectedReviews, reviews, replyMutation, onSuccess]
    );

    const handleClose = useCallback(() => {
      setSelectedReviews(new Set());
      setCharacterCount(0);
      clearSuggestion();
      setShowApiWarning(false);
      onClose();
    }, [onClose, clearSuggestion]);

    const handleGetSuggestion = useCallback(() => {
      if (selectedReviews.size === 0) return;

      const firstReview = reviews.find((r) => selectedReviews.has(r.id));
      if (!firstReview) return;

      getSuggestion(firstReview.comment);
    }, [selectedReviews, reviews, getSuggestion]);

    const handleSelectAll = useCallback(() => {
      const replyableReviews = reviews.filter(
        (review) => review.status === "new"
      );
      if (selectedReviews.size === replyableReviews.length) {
        setSelectedReviews(new Set());
      } else {
        setSelectedReviews(
          new Set(replyableReviews.map((review) => review.id))
        );
      }
    }, [selectedReviews.size, reviews]);

    const handleSelectReview = useCallback((reviewId: string) => {
      setSelectedReviews((prev) => {
        const newSelected = new Set(prev);
        if (newSelected.has(reviewId)) {
          newSelected.delete(reviewId);
        } else {
          newSelected.add(reviewId);
        }
        return newSelected;
      });
    }, []);

    const isOverLimit = characterCount > 1000;
    const isSubmitting = replyMutation.isPending;

    return (
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        centered
        className="bulk-reply-modal"
      >
        <Modal.Header closeButton className="border-0 pb-4">
          <Modal.Title className="d-flex align-items-center fw-semibold">
            <Users size={20} className="me-3 text-primary" />
            Bulk Reply to Reviews
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 pb-4">
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

          {showApiWarning && (
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
          )}

          <ReplyForm
            onSubmit={handleFormSubmit}
            onTextChange={setCharacterCount}
            characterCount={characterCount}
            isSubmitting={isSubmitting}
            selectedCount={selectedReviews.size}
            aiSuggestion={aiSuggestion}
            onUseSuggestion={handleUseSuggestion}
          />
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <div className="d-flex gap-3 w-100 justify-content-end">
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
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
);
