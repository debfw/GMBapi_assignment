import React, { useState } from "react";
import { useLocationReviews } from "@/hooks";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Star, MessageSquare, Calendar, User } from "lucide-react";
import type { ReviewListResponse } from "@/services/types/ReviewListResponse";

interface LocationReviewsProps {
  locationId?: string;
  storeCode?: string;
  showFilters?: boolean;
}

export const LocationReviews: React.FC<LocationReviewsProps> = ({
  locationId,
  storeCode,
  showFilters = true,
}) => {
  const { getLocationReviews, isLoading, error, data } = useLocationReviews();
  const [filters, setFilters] = useState({
    location_id: locationId,
    store_code: storeCode,
    page: 1,
    per_page: 10,
    star_rating: undefined as number | undefined,
    has_comment: undefined as boolean | undefined,
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    getLocationReviews(newFilters);
  };

  const handleSearch = () => {
    getLocationReviews(filters);
  };

  const typedData = data as ReviewListResponse | null;
  const reviews = typedData?.reviews || [];
  const pagination = typedData?.pagination;

  return (
    <div className="location-reviews">
      {showFilters && (
        <div className="reviews-filters mb-4 p-3 bg-light rounded">
          <h6 className="mb-3">Filter Reviews</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">Star Rating</label>
              <select
                className="form-select form-select-sm"
                value={filters.star_rating || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "star_rating",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Has Comment</label>
              <select
                className="form-select form-select-sm"
                value={
                  filters.has_comment === undefined
                    ? ""
                    : filters.has_comment.toString()
                }
                onChange={(e) =>
                  handleFilterChange(
                    "has_comment",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
              >
                <option value="">All</option>
                <option value="true">With Comments</option>
                <option value="false">Without Comments</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Per Page</label>
              <select
                className="form-select form-select-sm"
                value={filters.per_page}
                onChange={(e) =>
                  handleFilterChange("per_page", parseInt(e.target.value))
                }
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-primary btn-sm w-100"
                onClick={handleSearch}
                disabled={isLoading as boolean}
              >
                {isLoading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      )}

      {(isLoading as boolean) && <LoadingSpinner />}

      {(error as any) && (
        <div className="alert alert-danger">
          Failed to load reviews: {(error as any)?.message || 'Unknown error'}
        </div>
      )}

      {reviews.length === 0 && !(isLoading as boolean) && (
        <div className="text-center text-muted py-4">
          <MessageSquare size={48} className="mb-3 opacity-50" />
          <p>No reviews found for this location.</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="reviews-list">
          {reviews.map((review: any) => (
            <div key={review.id} className="review-item border-bottom py-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <User size={16} className="me-2 text-muted" />
                  <span className="fw-semibold">{review.customerName}</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex me-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < review.rating
                            ? "text-warning fill-current"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <small className="text-muted">
                    <Calendar size={12} className="me-1" />
                    {new Date(review.date).toLocaleDateString()}
                  </small>
                </div>
              </div>

              {review.comment && (
                <p className="mb-2 text-muted">{review.comment}</p>
              )}

              {review.businessReply && (
                <div className="business-reply bg-light p-2 rounded">
                  <small className="text-muted d-block mb-1">
                    Business Reply:
                  </small>
                  <p className="mb-0 small">{review.businessReply.text}</p>
                </div>
              )}
            </div>
          ))}

          {pagination && (
            <div className="pagination-info mt-3 text-center">
              <small className="text-muted">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} reviews
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
