import React, { useState, useEffect, useMemo } from "react";
import { Modal, Form, Button, Alert, Card, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, X, Lightbulb, Users, CheckCircle } from "lucide-react";
import { REPLY_LIMITS } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { getReviewSuggestionMutationOptions } from "@/services/hooks/useGetReviewSuggestion";
import { replyToReviewMutationOptions } from "@/services/hooks/useReplyToReview";
import { formatRelativeTime } from "@/utils/formatting";
import type { Review } from "@/services/types";

const bulkReplySchema = z.object({
  text: z
    .string()
    .min(REPLY_LIMITS.MIN_LENGTH, "Reply cannot be empty")
    .max(
      REPLY_LIMITS.MAX_LENGTH,
      `Reply must be less than ${REPLY_LIMITS.MAX_LENGTH} characters`
    ),
  isPublic: z.boolean().default(true),
});

type BulkReplyFormData = z.infer<typeof bulkReplySchema>;

interface BulkReplyModalProps {
  show: boolean;
  reviews: Review[];
  onClose: () => void;
  onSuccess?: () => void;
}

export const BulkReplyModal: React.FC<BulkReplyModalProps> = ({
  show,
  reviews,
  onClose,
  onSuccess,
}) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(
    new Set()
  );
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [hasSuggestion, setHasSuggestion] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(false);
  const [bulkReplyProgress, setBulkReplyProgress] = useState<{
    completed: number;
    total: number;
    currentReview: string | null;
  }>({ completed: 0, total: 0, currentReview: null });

  // Filter reviews that can be replied to (status: "new")
  const replyableReviews = useMemo(
    () => reviews.filter((review) => review.status === "new"),
    [reviews]
  );

  const suggestionMutation = useMutation({
    ...getReviewSuggestionMutationOptions(),
    onError: (_error) => {
      console.error(_error);
    },
  });

  const replyMutation = useMutation({
    ...replyToReviewMutationOptions(),
    onSuccess: () => {
      setBulkReplyProgress((prev) => ({
        ...prev,
        completed: prev.completed + 1,
        currentReview: null,
      }));
    },
    onError: (_error) => {
      setShowApiWarning(true);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<BulkReplyFormData>({
    resolver: zodResolver(bulkReplySchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const watchedText = watch("text", "");

  React.useEffect(() => {
    setCharacterCount(watchedText.length);
  }, [watchedText]);

  // Select all replyable reviews by default
  useEffect(() => {
    if (show && replyableReviews.length > 0) {
      setSelectedReviews(new Set(replyableReviews.map((review) => review.id)));
    }
  }, [show, replyableReviews]);

  const handleFormSubmit = async (data: BulkReplyFormData) => {
    if (selectedReviews.size === 0) {
      return;
    }

    setBulkReplyProgress({
      completed: 0,
      total: selectedReviews.size,
      currentReview: null,
    });

    // Process each selected review
    for (const reviewId of selectedReviews) {
      const review = reviews.find((r) => r.id === reviewId);
      if (review) {
        setBulkReplyProgress((prev) => ({
          ...prev,
          currentReview: review.customerName,
        }));

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
  };

  const handleClose = () => {
    reset();
    setCharacterCount(0);
    setSelectedReviews(new Set());
    setAiSuggestion("");
    setShowSuggestion(false);
    setHasSuggestion(false);
    setShowApiWarning(false);
    setBulkReplyProgress({ completed: 0, total: 0, currentReview: null });
    onClose();
  };

  const handleGetSuggestion = async () => {
    if (selectedReviews.size === 0) return;

    // Use the first selected review for suggestion
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
  };

  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      setValue("text", aiSuggestion);
      setShowSuggestion(false);
      setHasSuggestion(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedReviews.size === replyableReviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(replyableReviews.map((review) => review.id)));
    }
  };

  const handleSelectReview = (reviewId: string) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedReviews(newSelected);
  };

  const isOverLimit = characterCount > REPLY_LIMITS.MAX_LENGTH;
  const remainingChars = REPLY_LIMITS.MAX_LENGTH - characterCount;

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
        {/* Review Selection Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-muted mb-0 fw-medium">
              Select Reviews to Reply ({selectedReviews.size} of{" "}
              {replyableReviews.length} selected)
            </h6>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleSelectAll}
              className="d-flex align-items-center"
            >
              <CheckCircle size={16} className="me-2" />
              {selectedReviews.size === replyableReviews.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          <div
            className="row g-2"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {replyableReviews.map((review) => (
              <div key={review.id} className="col-12">
                <Card
                  className={`cursor-pointer ${selectedReviews.has(review.id) ? "border-primary bg-light" : ""}`}
                  onClick={() => handleSelectReview(review.id)}
                >
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedReviews.has(review.id)}
                          onChange={() => handleSelectReview(review.id)}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-bold">{review.customerName}</div>
                            <div className="text-muted small">
                              {formatRelativeTime(review.date)} •{" "}
                              {review.rating} ⭐
                            </div>
                          </div>
                          <Badge bg="secondary" className="ms-2">
                            {review.status}
                          </Badge>
                        </div>
                        <div className="mt-1">
                          <small className="text-muted">
                            {review.comment.length > 100
                              ? `${review.comment.substring(0, 100)}...`
                              : review.comment}
                          </small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion Display */}
        {showSuggestion && aiSuggestion && (
          <div
            className="mb-4 p-3 rounded-3"
            style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
          >
            <h6 className="text-muted mb-2 fw-medium small">AI Suggestion:</h6>
            <p
              className="mb-0 text-muted"
              style={{ fontStyle: "italic", fontSize: "0.9rem" }}
            >
              {aiSuggestion}
            </p>
          </div>
        )}

        {showApiWarning && (
          <Alert variant="warning" className="mb-4">
            <strong>API Under Development:</strong> The reply functionality is
            currently under development and not yet available. Please check back
            later.
          </Alert>
        )}

        {/* Bulk Reply Progress */}
        {bulkReplyProgress.total > 0 && (
          <Alert variant="info" className="mb-4">
            <strong>Processing Replies:</strong> {bulkReplyProgress.completed}{" "}
            of {bulkReplyProgress.total} completed
            {bulkReplyProgress.currentReview && (
              <div className="mt-1 small">
                Currently replying to: {bulkReplyProgress.currentReview}
              </div>
            )}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Reply Text Section */}
          <Form.Group className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Label className="fw-medium mb-0">Reply Text</Form.Label>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={
                  hasSuggestion ? handleUseSuggestion : handleGetSuggestion
                }
                disabled={
                  selectedReviews.size === 0 || suggestionMutation.isPending
                }
                className="d-flex align-items-center"
              >
                <Lightbulb size={16} className="me-2" />
                {suggestionMutation.isPending
                  ? "Getting suggestion..."
                  : hasSuggestion
                    ? "Use the AI reply?"
                    : "Get Suggestion"}
              </Button>
            </div>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write a professional and helpful reply..."
              {...register("text")}
              isInvalid={!!errors.text}
              className="bulk-reply-textarea"
            />
            <Form.Control.Feedback type="invalid" className="mt-2">
              {errors.text?.message}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-between mt-3">
              <Form.Text
                className={isOverLimit ? "text-danger" : "text-muted small"}
              >
                {characterCount} / {REPLY_LIMITS.MAX_LENGTH} characters
                {isOverLimit && " (over limit)"}
              </Form.Text>
              {remainingChars < 50 && remainingChars > 0 && (
                <Form.Text className="text-warning small">
                  {remainingChars} characters remaining
                </Form.Text>
              )}
            </div>
          </Form.Group>

          {/* Public Reply Section */}
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label="Make these replies public (visible to customers)"
              {...register("isPublic")}
              className="mb-3"
            />
            <Form.Text className="text-muted small">
              Public replies will be visible to customers and other potential
              customers.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 px-4 pb-4">
        <div className="d-flex gap-3 w-100 justify-content-end">
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={replyMutation.isPending}
            className="d-flex align-items-center bulk-reply-cancel-button px-4"
          >
            <X size={16} className="me-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={
              replyMutation.isPending ||
              isOverLimit ||
              characterCount === 0 ||
              selectedReviews.size === 0
            }
            className="d-flex align-items-center bulk-reply-send-button px-4"
          >
            {replyMutation.isPending ? (
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
};
