import React, { useCallback, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { MessageCircle, Send, X } from "lucide-react";
import { REPLY_LIMITS } from "@/utils/constants";
import { ReplyModalLayout } from "@/components/common/ReplyModalLayout";
import { ReplyForm } from "@/components/common/ReplyForm";

interface ReviewReplyProps {
  show: boolean;
  reviewText: string;
  customerName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SingleReviewReplyModal: React.FC<ReviewReplyProps> = ({
  show,
  reviewText,
  customerName,
  onClose,
}) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [showApiWarning, setShowApiWarning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFormSubmit = useCallback(
    async (data: { text: string; isPublic: boolean }) => {
      // Do not call API for now; show the text immediately as a success preview
      setShowApiWarning(false);
      setSuccessMessage(`Preview only: "${data.text}"`);
      return;
    },
    []
  );

  const handleClose = () => {
    setCharacterCount(0);
    setShowApiWarning(false);
    setSuccessMessage(null);
    onClose();
  };

  const isOverLimit = characterCount > REPLY_LIMITS.MAX_LENGTH;
  const [submitForm, setSubmitForm] = useState<(() => void) | null>(null);

  return (
    <ReplyModalLayout
      show={show}
      onClose={handleClose}
      size="lg"
      className="review-reply-modal"
      icon={<MessageCircle size={20} className="me-3 text-primary" />}
      title={<>Reply to Review</>}
      warningNode={
        showApiWarning ? (
          <Alert variant="warning" className="mb-4 review-reply-alert">
            <strong>API Under Development:</strong> Replies are not sent yet.
            Showing your text below.
          </Alert>
        ) : successMessage ? (
          <Alert variant="success" className="mb-4 review-reply-alert">
            {successMessage}
          </Alert>
        ) : undefined
      }
      aiSuggestionConfig={{}}
      footerRight={
        <>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={false}
            className="d-flex align-items-center review-reply-cancel-button px-4"
          >
            <X size={16} className="me-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => submitForm && submitForm()}
            disabled={isOverLimit || characterCount === 0}
            className="d-flex align-items-center review-reply-send-button px-4"
          >
            {false ? (
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
        </>
      }
    >
      <div className="mb-3">
        <h6 className="text-muted mb-3 fw-medium">
          Original Review by {customerName}:
        </h6>
        <div className="p-4 rounded-3 review-reply-original">
          <p className="mb-0 text-dark">{reviewText}</p>
        </div>
      </div>

      <ReplyForm
        onSubmit={handleFormSubmit}
        onTextChange={setCharacterCount}
        characterCount={characterCount}
        isSubmitting={false}
        selectedCount={1}
        getSuggestionPrompt={() => reviewText}
        registerSubmit={useCallback(
          (fn: () => void) => setSubmitForm(() => fn),
          []
        )}
      />
    </ReplyModalLayout>
  );
};
