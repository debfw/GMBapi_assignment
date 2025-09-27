/**
 * Review Header Component
 * Displays customer information, rating, and status
 */

import React from "react";
import { Badge, Image } from "react-bootstrap";
import { Star, Clock, User } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatting";
import type { Review } from "@/services/types";

interface ReviewHeaderProps {
  review: Review;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = React.memo(
  ({ review }) => {
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

    return (
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
            <User size={16} className="text-white" data-testid="user-icon" />
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
              <small className="text-muted">📍 {review.locationName}</small>
            </div>
          )}
        </div>
      </div>
    );
  }
);
