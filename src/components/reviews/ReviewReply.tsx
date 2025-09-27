import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, Send, X, Lightbulb } from "lucide-react";
import { REPLY_LIMITS } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { getReviewSuggestionMutationOptions } from "@/services/hooks/useGetReviewSuggestion";
import { replyToReviewMutationOptions } from "@/services/hooks/useReplyToReview";

const replySchema = z.object({
  text: z
    .string()
    .min(REPLY_LIMITS.MIN_LENGTH, "Reply cannot be empty")
    .max(
      REPLY_LIMITS.MAX_LENGTH,
      `Reply must be less than ${REPLY_LIMITS.MAX_LENGTH} characters`
    ),
  isPublic: z.boolean().default(true),
});

type ReplyFormData = z.infer<typeof replySchema>;

interface ReviewReplyProps {
  show: boolean;
  reviewId: string;
  reviewText: string;
  customerName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewReply: React.FC<ReviewReplyProps> = ({
  show,
  reviewId,
  reviewText,
  customerName,
  onClose,
  onSuccess,
}) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [hasSuggestion, setHasSuggestion] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(false);

  const suggestionMutation = useMutation({
    ...getReviewSuggestionMutationOptions(),
  });

  const replyMutation = useMutation({
    ...replyToReviewMutationOptions(),
    onSuccess: () => {
      onSuccess?.();
      handleClose();
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
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const watchedText = watch("text", "");

  React.useEffect(() => {
    setCharacterCount(watchedText.length);
  }, [watchedText]);

  const handleFormSubmit = (data: ReplyFormData) => {
    replyMutation.mutate({
      reviewId,
      data: {
        text: data.text,
        isPublic: data.isPublic,
      },
    });
  };

  const handleClose = () => {
    reset();
    setCharacterCount(0);
    setAiSuggestion("");
    setShowSuggestion(false);
    setHasSuggestion(false);
    setShowApiWarning(false);
    onClose();
  };

  const isOverLimit = characterCount > REPLY_LIMITS.MAX_LENGTH;
  const remainingChars = REPLY_LIMITS.MAX_LENGTH - characterCount;

  const handleGetSuggestion = async () => {
    if (!reviewText.trim()) return;

    try {
      const result = await suggestionMutation.mutateAsync({
        data: { review: reviewText },
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
    }
  };

  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      setValue("text", aiSuggestion);
      setShowSuggestion(false);
      setHasSuggestion(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValue("text", value);

    setIsTyping(true);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    setTypingTimeout(timeout);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className="review-reply-modal"
    >
      <Modal.Header closeButton className="border-0 pb-4">
        <Modal.Title className="d-flex align-items-center fw-semibold">
          <MessageCircle size={20} className="me-3 text-primary" />
          Reply to Review
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        <div className="mb-5">
          <h6 className="text-muted mb-3 fw-medium">
            Original Review by {customerName}:
          </h6>
          <div className="p-4 rounded-3 review-reply-original">
            <p className="mb-0 text-dark">{reviewText}</p>
          </div>

          {showSuggestion && aiSuggestion && (
            <div
              className="mt-3 p-3 rounded-3"
              style={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #e9ecef",
              }}
            >
              <h6 className="text-muted mb-2 fw-medium small">
                AI Suggestion:
              </h6>
              <p
                className="mb-0 text-muted"
                style={{ fontStyle: "italic", fontSize: "0.9rem" }}
              >
                {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {showApiWarning && (
          <Alert variant="warning" className="mb-4 review-reply-alert">
            <strong>API Under Development:</strong> The reply functionality is
            currently under development and not yet available. Please check back
            later.
          </Alert>
        )}

        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Label className="fw-medium mb-0">Your Reply</Form.Label>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={
                  hasSuggestion ? handleUseSuggestion : handleGetSuggestion
                }
                disabled={
                  isTyping || !reviewText.trim() || suggestionMutation.isPending
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
            <div className="position-relative">
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Write a professional and helpful reply..."
                {...register("text")}
                onChange={handleTextChange}
                isInvalid={!!errors.text}
                className="review-reply-textarea"
              />
              <div className="position-absolute review-reply-grammar-icon">
                G
              </div>
            </div>
            <Form.Control.Feedback type="invalid" className="mt-2">
              {errors.text?.message}
            </Form.Control.Feedback>
            {suggestionMutation.error && (
              <Alert variant="danger" className="mt-2 small">
                Failed to get suggestion:{" "}
                {suggestionMutation.error instanceof Error
                  ? suggestionMutation.error.message
                  : "Unknown error"}
              </Alert>
            )}
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

          <Form.Group className="mb-5">
            <Form.Check
              type="checkbox"
              label="Make this reply public (visible to customers)"
              {...register("isPublic")}
              className="mb-3"
            />
            <Form.Text className="text-muted small">
              Public replies will be visible to the customer and other potential
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
            className="d-flex align-items-center review-reply-cancel-button px-4"
          >
            <X size={16} className="me-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={
              replyMutation.isPending || isOverLimit || characterCount === 0
            }
            className="d-flex align-items-center review-reply-send-button px-4"
          >
            {replyMutation.isPending ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2 review-reply-spinner"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="me-2" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
