import React, { useState, useCallback, useMemo } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { SingleReviewReplyModal } from "./ui/SingleReviewReplyModal";
import { BulkReplyModal } from "./ui/BulkReplyModal";
import { ReviewsContent } from "./ui/ReviewsContent";
import type { ReviewDomain } from "@/services/domain/types";
import type { ReviewFiltersDomain } from "@/services/domain/types";
import { useModalContext } from "@/stores/ModalContext";
import { ReviewsHeader } from "./ui/ReviewsHeader";
import { ReviewsFilters } from "./ui/ReviewsFilters";
import { useReviewsFilters } from "./hooks/useReviewsFilters";
import { useReviewsQuery } from "./hooks/useReviewService";
import { useDebounce } from "@/hooks";

export const ReviewsPage: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<{
    id: string;
    text: string;
    customerName: string;
  } | null>(null);

  const {
    isReplyOpen,
    isBulkOpen,
    openReply,
    closeReply,
    openBulk,
    closeBulk,
  } = useModalContext();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    filters,
    filterState,
    handleStarRatingChange,
    handleClearFilters,
    handleReplyStatusChange,
    setFilters,
  } = useReviewsFilters();

  const domainFilters: ReviewFiltersDomain = useMemo(() => {
    return {
      page: filters.page ?? 1,
      per_page: filters.per_page ?? 20,
      is_deleted: filters.is_deleted ?? false,
      ...(filters.star_rating !== undefined
        ? { star_rating: filters.star_rating }
        : {}),
      ...(filters.has_reply !== undefined
        ? { has_reply: filters.has_reply }
        : {}),
    };
  }, [filters]);

  const debouncedFilters = useDebounce<ReviewFiltersDomain>(domainFilters, 300);
  const { data, error, isLoading, refetch } = useReviewsQuery(debouncedFilters);

  const handleReplyClick = useCallback((review: ReviewDomain) => {
    setSelectedReview({
      id: review.id,
      text: review.comment,
      customerName: review.customerName,
    });
    openReply();
  }, []);

  const handleCloseReplyModal = useCallback(() => {
    closeReply();
    setSelectedReview(null);
  }, [closeReply]);

  const handleRefreshReviews = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleReplySuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleBulkReplySuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ ...filters, page });
    },
    [filters, setFilters]
  );

  const reviews = data?.reviews || [];

  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reviews;
    return reviews.filter((review: ReviewDomain) => {
      return (
        review.comment?.toLowerCase().includes(term) ||
        review.customerName?.toLowerCase().includes(term) ||
        review.businessReply?.text?.toLowerCase().includes(term)
      );
    });
  }, [reviews, searchTerm]);

  // Use original pagination when not searching, otherwise create custom pagination for filtered results
  const pagination = searchTerm.trim()
    ? {
        page: 1,
        limit: filteredReviews.length,
        total: filteredReviews.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }
    : data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };

  return (
    <ResponsiveLayout activeSection="reviews">
      <div className="page-content-container" data-testid="reviews-page">
        <div className="main-content-wrapper">
          {/* Header Section */}
          <div className="content-section">
            <ReviewsHeader />
            {error && (
              <div className="alert alert-warning mt-3" role="alert">
                🚨 API Error: {(error as any)?.message || "An error occurred"}
              </div>
            )}
          </div>

          {/* Filter Section */}
          <div className="filters-section">
            <ReviewsFilters
              filterState={filterState}
              onStarRatingChange={handleStarRatingChange}
              onClearFilters={handleClearFilters}
              onReplyStatusChange={handleReplyStatusChange}
              onBulkReply={openBulk}
              onRefreshReviews={handleRefreshReviews}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Reviews Content */}
          <ReviewsContent
            reviews={filteredReviews}
            pagination={pagination}
            loading={isLoading}
            error={
              error && !data
                ? (error as any)?.message || "An error occurred"
                : undefined
            }
            filterState={filterState}
            onReply={handleReplyClick}
            onPageChange={handlePageChange}
            isSearching={!!searchTerm.trim()}
          />
        </div>
      </div>

      {/* Modals */}
      <SingleReviewReplyModal
        show={isReplyOpen && selectedReview !== null}
        reviewText={selectedReview?.text || ""}
        customerName={selectedReview?.customerName || ""}
        onClose={handleCloseReplyModal}
        onSuccess={handleReplySuccess}
      />

      <BulkReplyModal
        show={isBulkOpen}
        reviews={reviews}
        onClose={closeBulk}
        onSuccess={handleBulkReplySuccess}
      />
    </ResponsiveLayout>
  );
};
