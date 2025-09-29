import React from "react";
import { Button } from "react-bootstrap";
import { MessageCircle } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatting";
import type { ReviewDomain } from "@/services/domain/types";

interface ReviewReplyProps {
  review: ReviewDomain;
  onReply: (review: ReviewDomain) => void;
}

export const ReviewReplyDisplay: React.FC<ReviewReplyProps> = React.memo(
  ({ review, onReply }) => {
    return (
      <>
        {review.businessReply ? (
          <>
            <div className="mb-2">
              <div className="review-card-column-title">
                Reply{" "}
                <span
                  className="text-muted"
                  style={{
                    fontSize: "0.6rem",
                    textTransform: "capitalize",
                  }}
                >
                  ({formatRelativeTime(review.businessReply.date)})
                </span>
              </div>
            </div>
            <div className="bg-light p-3 rounded">
              <p className="mb-0 small">{review.businessReply.text}</p>
            </div>
          </>
        ) : (
          <>
            <div className="review-card-column-title">Reply</div>
            {review.status === "new" && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onReply(review)}
                className="d-flex align-items-center"
              >
                <MessageCircle size={16} className="me-1" />
                Reply
              </Button>
            )}
          </>
        )}
      </>
    );
  }
);
