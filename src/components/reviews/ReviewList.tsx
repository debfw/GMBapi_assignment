import React from "react";
import { Container, Alert, Row, Col } from "react-bootstrap";
import { ReviewCard } from "./ReviewCard/ReviewCard";
import { ReviewPagination } from "./ReviewPagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useStableCallback } from "@/utils/memoization";
import type { Review, Pagination as PaginationType } from "@/services/types";
import type { FilterState } from "@/hooks/useReviewsFilters";

interface ReviewListProps {
  reviews: Review[];
  pagination?: PaginationType;
  loading?: boolean;
  error?: string;
  onReply: (reviewId: string) => void;
  onPageChange?: (page: number) => void;
  className?: string;
  filterState?: FilterState;
}

export const ReviewList: React.FC<ReviewListProps> = React.memo(
  ({
    reviews,
    pagination,
    loading = false,
    error,
    onReply,
    onPageChange,
    className = "",
    filterState,
  }) => {
    // Memoize the reply handler to prevent unnecessary re-renders
    const handleReply = useStableCallback(onReply);
    if (loading) {
      return (
        <Container className={`py-5 ${className}`}>
          <LoadingSpinner size="lg" text="Loading reviews..." />
        </Container>
      );
    }

    if (error && reviews.length === 0) {
      return (
        <Container className={`py-5 ${className}`}>
          <Alert variant="danger">
            <Alert.Heading>Error loading reviews</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
      );
    }

    if (!reviews || reviews.length === 0) {
      const getSpecificMessage = () => {
        if (filterState?.replyStatus === "unreplied") {
          return "No unreplied reviews found. All reviews may have been replied to, or there might be an issue with the filter.";
        } else if (filterState?.replyStatus === "replied") {
          return "No replied reviews found. Try checking if there are any reviews with business replies.";
        } else if (filterState?.selectedStarRating) {
          return `No ${filterState.selectedStarRating}-star reviews found. Try adjusting the star rating filter.`;
        }
        return "Try adjusting your filters or check back later for new reviews.";
      };

      return (
        <Container className={`py-5 ${className}`}>
          <Alert variant="info" className="text-center">
            <Alert.Heading>No reviews found</Alert.Heading>
            <p>{getSpecificMessage()}</p>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-3">
                <small className="text-muted">
                  Debug: Current filters - Reply Status:{" "}
                  {filterState?.replyStatus || "none"}, Star Rating:{" "}
                  {filterState?.selectedStarRating || "none"}
                </small>
              </div>
            )}
          </Alert>
        </Container>
      );
    }

    return (
      <Container className={className}>
        <Row>
          <Col>
            <div className="mb-4" data-testid="reviews-list">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReply={handleReply}
                  className="mb-3"
                />
              ))}
            </div>

            {pagination && onPageChange && (
              <ReviewPagination
                pagination={pagination}
                onPageChange={onPageChange}
                className="mt-4"
              />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
);
