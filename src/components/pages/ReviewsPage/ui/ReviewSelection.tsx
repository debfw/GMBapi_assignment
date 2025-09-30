import React, { useMemo, memo } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { CheckCircle } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatting";
import type { ReviewDomain } from "@/services/domain/types";

interface ReviewSelectionProps {
  reviews: ReviewDomain[];
  selectedReviews: Set<string>;
  onSelectAll: () => void;
  onSelectReview: (reviewId: string) => void;
}

export const ReviewSelection: React.FC<ReviewSelectionProps> = memo(
  ({ reviews, selectedReviews, onSelectAll, onSelectReview }) => {
    // Filter reviews that can be replied to (status: "new")
    const replyableReviews = useMemo(
      () => reviews.filter((review) => review.status === "new"),
      [reviews]
    );

    const isAllSelected = selectedReviews.size === replyableReviews.length;

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-muted mb-0 fw-medium">
            Select Reviews to Reply ({selectedReviews.size} of{" "}
            {replyableReviews.length} selected)
          </h6>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={onSelectAll}
            className="d-flex align-items-center bulk-select-toggle-btn"
          >
            <CheckCircle size={16} className="me-2" />
            {isAllSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <div
          className="row g-2"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {replyableReviews.map((review) => (
            <div key={review.id} className="col-12">
              <Card
                className={`cursor-pointer ${
                  selectedReviews.has(review.id)
                    ? "border-primary bg-light"
                    : ""
                }`}
                onClick={() => onSelectReview(review.id)}
              >
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedReviews.has(review.id)}
                        onChange={() => onSelectReview(review.id)}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{review.customerName}</div>
                          <div className="text-muted small">
                            {formatRelativeTime(review.date)} • {review.rating}{" "}
                            ⭐
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
    );
  }
);
