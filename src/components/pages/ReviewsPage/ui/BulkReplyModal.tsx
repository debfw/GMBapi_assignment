import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { Send, X, Users } from "lucide-react";
import { ReviewSelection } from "./ReviewSelection";
import type { Review } from "@/services/types";
import { ReplyForm } from "@/components/common/ReplyForm";
import { ReplyModalLayout } from "@/components/common/ReplyModalLayout";

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
  ({ show, reviews, onClose }) => {
    const [selectedReviews, setSelectedReviews] = useState<Set<string>>(
      new Set()
    );
    const [characterCount, setCharacterCount] = useState(0);
    const [showApiWarning, setShowApiWarning] = useState(false);

    useEffect(() => {
      if (show) {
        const replyableReviews = reviews.filter((r) => r.status === "new");
        setSelectedReviews(new Set(replyableReviews.map((r) => r.id)));
      }
    }, [show, reviews]);

    const handleFormSubmit = useCallback(
      async (_data: BulkReplyFormData) => {
        if (selectedReviews.size === 0) return;
        // Do not call API for now; show a summary immediately
        setShowApiWarning(true);
        return;
      },
      [selectedReviews]
    );

    const handleClose = useCallback(() => {
      setSelectedReviews(new Set());
      setCharacterCount(0);
      setShowApiWarning(false);
      onClose();
    }, [onClose]);

    const isOverLimit = characterCount > 1000;
    const isSubmitting = false;

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
              <strong>Preview only:</strong> Replies are not sent yet. Your text
              will be applied to <strong>{selectedReviews.size}</strong>{" "}
              selected reviews.
            </div>
          ) : undefined
        }
        aiSuggestionConfig={{
          onSuggestionApplied: () => {},
        }}
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
          onSelectAll={() => {
            const replyable = reviews.filter((r) => r.status === "new");
            if (selectedReviews.size === replyable.length)
              setSelectedReviews(new Set());
            else setSelectedReviews(new Set(replyable.map((r) => r.id)));
          }}
          onSelectReview={(reviewId: string) => {
            setSelectedReviews((prev) => {
              const next = new Set(prev);
              if (next.has(reviewId)) next.delete(reviewId);
              else next.add(reviewId);
              return next;
            });
          }}
        />

        <ReplyForm
          onSubmit={handleFormSubmit}
          onTextChange={setCharacterCount}
          characterCount={characterCount}
          isSubmitting={isSubmitting}
          selectedCount={selectedReviews.size}
          getSuggestionPrompt={() => {
            const firstId = [...selectedReviews][0];
            const firstReview = reviews.find((r) => r.id === firstId);
            return firstReview?.comment || "";
          }}
        />
      </ReplyModalLayout>
    );
  }
);

export default BulkReplyModal;
