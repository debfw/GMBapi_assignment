/**
 * Refactored Bulk Reply Modal
 * Uses smaller, focused components and the new service layer
 */

import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { Send, X, Users } from "lucide-react";
import { ReviewSelection } from "./ReviewSelection";
import { AISuggestion } from "./AISuggestion";
import { ReplyForm } from "./ReplyForm";
import { useMutation } from "@tanstack/react-query";
import {
  getReviewSuggestionMutationOptions,
  replyToReviewMutationOptions,
} from "@/services/hooks";
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
    const [aiSuggestion, setAiSuggestion] = useState<string>("");
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [hasSuggestion, setHasSuggestion] = useState(false);
    const [showApiWarning, setShowApiWarning] = useState(false);

    const suggestionMutation = useMutation({
      ...getReviewSuggestionMutationOptions(),
      onError: (_error) => {
        console.error(_error);
      },
    });

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

    // Handle form submission
    const handleFormSubmit = useCallback(
      async (data: BulkReplyFormData) => {
        if (selectedReviews.size === 0) return;

        // Process each selected review
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

    // Handle modal close
    const handleClose = useCallback(() => {
      setSelectedReviews(new Set());
      setCharacterCount(0);
      setAiSuggestion("");
      setShowSuggestion(false);
      setHasSuggestion(false);
      setShowApiWarning(false);
      onClose();
    }, [onClose]);

    // Handle AI suggestion
    const handleGetSuggestion = useCallback(async () => {
      if (selectedReviews.size === 0) return;

      const firstReview = reviews.find((r) => selectedReviews.has(r.id));
      if (!firstReview) return;

      try {
        const result = await suggestionMutation.mutateAsync({
          data: { review: firstReview.comment },
        });

        if (
          result?.msg &&
          result.msg.length > 0 &&
          result.msg[0]?.message?.content
        ) {
          const suggestion = result.msg[0].message.content;
          setAiSuggestion(suggestion);
          setShowSuggestion(true);
          setHasSuggestion(true);
        }
      } catch (error) {
        // Failed to get suggestion
      }
    }, [selectedReviews, reviews, suggestionMutation]);

    const handleUseSuggestion = useCallback(() => {
      if (aiSuggestion) {
        setShowSuggestion(false);
        setHasSuggestion(false);
        // The suggestion will be handled by the form component
      }
    }, [aiSuggestion]);

    // Handle review selection
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

    const isOverLimit = characterCount > 1000; // REPLY_LIMITS.MAX_LENGTH
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

          <AISuggestion
            suggestion={aiSuggestion}
            showSuggestion={showSuggestion}
            hasSuggestion={hasSuggestion}
            isLoading={suggestionMutation.isPending}
            selectedCount={selectedReviews.size}
            onGetSuggestion={handleGetSuggestion}
            onUseSuggestion={handleUseSuggestion}
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
