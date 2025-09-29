import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { formatDate } from "@/utils/formatting";
import { truncateText } from "@/utils/formatting";
import type { Review } from "@/services/types";

interface ReviewContentProps {
  review: Review;
}

export const ReviewContent: React.FC<ReviewContentProps> = React.memo(
  ({ review }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;

    const shouldTruncate = review.comment.length > maxLength;
    const displayText =
      isExpanded || !shouldTruncate
        ? review.comment
        : truncateText(review.comment, maxLength);

    return (
      <div className="mb-2">
        <div className="mb-2">
          <div className="review-card-column-title">
            Review{" "}
            <span
              className="text-muted"
              style={{ fontSize: "0.6rem", textTransform: "capitalize" }}
            >
              ({formatDate(review.date)})
            </span>
          </div>
        </div>
        <div className="mb-2">
          <p className="mb-0">{displayText}</p>
          {shouldTruncate && (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>

        {review.helpfulVotes !== undefined && review.helpfulVotes > 0 && (
          <div className="d-flex align-items-center review-card-bottom-section">
            <small className="text-muted">
              👍 {review.helpfulVotes} helpful
            </small>
          </div>
        )}
      </div>
    );
  }
);
