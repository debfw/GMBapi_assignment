/**
 * Reviews Content Component
 * Handles the main content area of the reviews page
 */

import React from "react";
import { ReviewList } from "../ReviewList";
import { COLORS } from "@/styles/design-system";
import type { Review, Pagination as PaginationType } from "@/services/types";
import type { FilterState } from "@/hooks/useReviewsFilters";

interface ReviewsContentProps {
  reviews: Review[];
  pagination: PaginationType;
  loading: boolean;
  error?: string;
  filterState: FilterState;
  onReply: (reviewId: string) => void;
  onPageChange: (page: number) => void;
}

export const ReviewsContent: React.FC<ReviewsContentProps> = React.memo(
  ({
    reviews,
    pagination,
    loading,
    error,
    filterState,
    onReply,
    onPageChange,
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
        const filterList = [];
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
        <div
          className="rounded-3 shadow-sm border-0 p-4"
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            border: `1px solid ${COLORS.borderLight}`,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="text-muted small" data-testid="filter-status">
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
          />
        </div>
      </div>
    );
  }
);
