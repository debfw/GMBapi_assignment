/**
 * Refactored Review Card Component
 * Uses smaller, focused components for better maintainability
 */

import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewContent } from "./ReviewContent";
import { ReviewReply } from "./ReviewReply";
import type { Review } from "@/services/types";

interface ReviewCardProps {
  review: Review;
  onReply: (reviewId: string) => void;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = React.memo(
  ({ review, onReply, className = "" }) => {
    return (
      <Card className={`mb-3 ${className}`}>
        <Card.Body className="review-card-content">
          <Row>
            <Col xs={2} className="review-card-details-section">
              <ReviewHeader review={review} />
            </Col>
            <Col xs={6} className="review-card-review-section">
              <ReviewContent review={review} />
            </Col>
            <Col xs={4} className="review-card-reply-section">
              <ReviewReply review={review} onReply={onReply} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
);
