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
  const {
    filters,
    filterState,
    debouncedSearchTerm,
    handleSearchChange,
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
    const query = debouncedSearchTerm?.toLowerCase().trim();
    if (!query) return reviews;
    return reviews.filter((review) => {
      const haystacks = [
        review.comment || "",
        review.customerName || "",
        review.locationName || "",
      ];
      return haystacks.some((text) => text.toLowerCase().includes(query));
    });
  }, [reviews, debouncedSearchTerm]);

  const pagination = data?.pagination || {
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
              searchTerm={filterState.searchTerm}
              onSearchChange={handleSearchChange}
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
            isSearching={Boolean(filterState.searchTerm?.trim())}
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
