import React, { memo } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewContent } from "./ReviewContent";
import { ReviewReplyDisplay } from "./ReviewReplyDisplay";
import type { ReviewDomain } from "@/services/domain/types";

interface ReviewCardProps {
  review: ReviewDomain;
  onReply: (review: ReviewDomain) => void;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = memo(
  ({ review, onReply, className = "" }) => {
    return (
      <Card className={`mb-3 ${className}`}>
        <Card.Body className="review-card-content">
          <Row>
            <Col xs={12} md={2} className="review-card-details-section">
              <ReviewHeader review={review} />
            </Col>
            <Col xs={12} md={6} className="review-card-review-section">
              <ReviewContent review={review} />
            </Col>
            <Col xs={12} md={4} className="review-card-reply-section">
              <ReviewReplyDisplay review={review} onReply={onReply} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
);
