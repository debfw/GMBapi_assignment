import React from "react";
import { Badge, Image } from "react-bootstrap";
import { Star, Clock, User } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatting";
import type { ReviewDomain } from "@/services/domain/types";

interface ReviewHeaderProps {
  review: ReviewDomain;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = React.memo(
  ({ review }) => {
    const [isDesktop, setIsDesktop] = React.useState(false);
    React.useEffect(() => {
      const check = () => setIsDesktop(window.innerWidth >= 992);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);
    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={12}
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
        <Badge
          bg={variants[status as keyof typeof variants] || "secondary"}
          className="badge-sm"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    };

    return (
      <div className="d-flex align-items-start mb-2 review-header flex-row">
        {review.customerPhoto ? (
          <Image
            src={review.customerPhoto}
            alt={review.customerName}
            roundedCircle
            width={28}
            height={28}
            className="me-2 flex-shrink-0"
          />
        ) : (
          <div
            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0 review-card-avatar"
            style={{ width: 28, height: 28 }}
          >
            <User size={12} className="text-white" data-testid="user-icon" />
          </div>
        )}
        <div className="flex-grow-1">
          {isDesktop ? (
            <>
              {/* Row 1: Name (avatar sits at left) */}
              <div className="review-header-first mb-1">
                <div className="review-name mb-0">{review.customerName}</div>
              </div>
              {/* Row 2: Replied badge */}
              <div className="mb-1">{getStatusBadge(review.status)}</div>
              {/* Row 3: Time + Stars */}
              <div className="review-header-second text-muted mb-1">
                <span className="d-inline-flex align-items-center">
                  <Clock size={12} className="me-1" />
                  {formatRelativeTime(review.date)}
                </span>
                <span className="d-inline-flex align-items-center">
                  {renderStars(review.rating)}
                </span>
              </div>
              {/* Row 4: Location */}
              {review.locationName && (
                <div className="text-muted">
                  <small>📍 {review.locationName}</small>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Mobile: Name + Status inline */}
              <div className="review-header-first mb-1">
                <div className="review-name mb-0">{review.customerName}</div>
                {getStatusBadge(review.status)}
              </div>
              {/* Mobile: Time + Stars + Location inline */}
              <div className="review-header-second text-muted">
                <span className="d-inline-flex align-items-center">
                  <Clock size={12} className="me-1" />
                  {formatRelativeTime(review.date)}
                </span>
                <span className="d-inline-flex align-items-center">
                  {renderStars(review.rating)}
                </span>
                {review.locationName && (
                  <span className="d-inline-flex align-items-center">
                    <small className="text-muted">
                      📍 {review.locationName}
                    </small>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);
