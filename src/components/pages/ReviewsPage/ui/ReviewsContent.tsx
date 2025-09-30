import React, { memo } from "react";
import type { ReviewDomain, PaginationDomain } from "@/services/domain/types";
import type { FilterState } from "@/components/pages/ReviewsPage/hooks/useReviewsFilters";
import { ReviewList } from "./ReviewList";

interface ReviewsContentProps {
  reviews: ReviewDomain[];
  pagination: PaginationDomain;
  loading: boolean;
  error?: string;
  filterState: FilterState;
  onReply: (review: ReviewDomain) => void;
  onPageChange: (page: number) => void;
  isSearching?: boolean;
}

export const ReviewsContent: React.FC<ReviewsContentProps> = memo(
  ({
    reviews,
    pagination,
    loading,
    error,
    filterState,
    onReply,
    onPageChange,
    isSearching = false,
  }) => {
    const renderFilterStatus = () => {
      const hasApiFilters =
        filterState.selectedStarRating !== "" || filterState.replyStatus !== "";

      const fromCount =
        pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
      const toCount = Math.min(
        pagination.page * pagination.limit,
        pagination.total
      );

      if (hasApiFilters) {
        const filterList = [] as string[];
        if (filterState.selectedStarRating !== "")
          filterList.push(`${filterState.selectedStarRating} stars`);
        if (filterState.replyStatus)
          filterList.push(
            filterState.replyStatus === "replied" ? "replied" : "unreplied"
          );

        return (
          <>
            Showing {fromCount}-{toCount} of {pagination.total} reviews
            {filterList.length > 0 && (
              <span className="text-primary">
                {" "}
                (filters: {filterList.join(", ")})
              </span>
            )}
          </>
        );
      } else {
        return (
          <>
            Showing {fromCount}-{toCount} of {pagination.total} reviews
          </>
        );
      }
    };

    return (
      <div className="reviews-section">
        <div className="bg-white rounded-3 border-0 p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-4 reviews-toolbar px-0">
            <div
              className="text-muted small filter-status"
              data-testid="filter-status"
            >
              {renderFilterStatus()}
            </div>
          </div>

          <ReviewList
            reviews={reviews}
            pagination={pagination}
            loading={loading}
            error={error}
            onReply={onReply}
            onPageChange={onPageChange}
            filterState={filterState}
            hidePagination={isSearching}
          />
        </div>
      </div>
    );
  }
);
