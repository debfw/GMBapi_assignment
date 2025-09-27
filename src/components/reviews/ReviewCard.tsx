import React, { useState } from "react";
import { Card, Badge, Button, Row, Col, Image } from "react-bootstrap";
import { Star, MessageCircle, Clock, User } from "lucide-react";
import {
  formatDate,
  formatRelativeTime,
  truncateText,
} from "@/utils/formatting";
import type { Review } from "@/services/types";

interface ReviewCardProps {
  review: Review;
  onReply: (reviewId: string) => void;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = React.memo(
  ({ review, onReply, className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;
    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          data-testid={`star-${index}`}
          className={
            index < rating ? "text-warning fill-current" : "text-muted"
          }
        />
      ));
    };

    const getStatusBadge = (status: string) => {
      const variants = {
        new: "primary",
        replied: "success",
        hidden: "secondary",
        flagged: "danger",
      } as const;

      return (
        <Badge bg={variants[status as keyof typeof variants] || "secondary"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    };

    const shouldTruncate = review.comment.length > maxLength;
    const displayText =
      isExpanded || !shouldTruncate
        ? review.comment
        : truncateText(review.comment, maxLength);

    return (
      <Card className={`mb-3 ${className}`}>
        <Card.Body className="review-card-content">
          <Row>
            <Col xs={2} className="review-card-details-section">
              <div className="d-flex align-items-start mb-2">
                {review.customerPhoto ? (
                  <Image
                    src={review.customerPhoto}
                    alt={review.customerName}
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2"
                  />
                ) : (
                  <div
                    className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2 review-card-avatar"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <User
                      size={16}
                      className="text-white"
                      data-testid="user-icon"
                    />
                  </div>
                )}
                <div className="flex-grow-1">
                  <div className="fw-bold review-card-name-section mb-1">
                    {review.customerName}
                  </div>
                  <div className="mb-1">{getStatusBadge(review.status)}</div>
                  <div className="d-flex align-items-center text-muted small mb-2">
                    <Clock size={12} className="me-1" />
                    {formatRelativeTime(review.date)}
                  </div>

                  {/* Stars */}
                  <div className="review-card-rating-section">
                    <div className="d-flex align-items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {/* Location */}
                  {review.locationName && (
                    <div className="review-card-location-section">
                      <small className="text-muted">
                        📍 {review.locationName}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col xs={6} className="review-card-review-section">
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
            </Col>

            <Col xs={4} className="review-card-reply-section">
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
                      onClick={() => onReply(review.id)}
                      className="d-flex align-items-center"
                    >
                      <MessageCircle size={16} className="me-1" />
                      Reply
                    </Button>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
);
