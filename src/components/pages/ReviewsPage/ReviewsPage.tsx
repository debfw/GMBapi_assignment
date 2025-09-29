import React, { useState, useCallback, useEffect } from "react";
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
import { useReviews } from "./hooks/useReviewService";
import type { Review } from "@/services";
// Removed unused API Review type; using domain types throughout

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

  const { mutate, data, error, isPending } = useReviews();

  const toDomainFilters = useCallback(
    (f: any): ReviewFiltersDomain => ({
      page: f.page ?? 1,
      per_page: f.per_page ?? 20,
      is_deleted: f.is_deleted ?? false,
      star_rating: f.star_rating,
      has_reply: f.has_reply,
    }),
    []
  );

  useEffect(() => {
    mutate(toDomainFilters(filters));
  }, [filters, mutate, toDomainFilters]);

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
    mutate(toDomainFilters(filters));
  }, [mutate, filters, toDomainFilters]);

  const handleReplySuccess = useCallback(() => {
    mutate(toDomainFilters(filters));
  }, [mutate, filters, toDomainFilters]);

  const handleBulkReplySuccess = useCallback(() => {
    mutate(toDomainFilters(filters));
  }, [mutate, filters, toDomainFilters]);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ ...filters, page });
    },
    [filters, setFilters]
  );

  const reviews = data?.reviews || [];

  const filteredReviews = searchTerm.trim()
    ? reviews.filter((review: ReviewDomain) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          review.comment?.toLowerCase().includes(searchLower) ||
          review.customerName?.toLowerCase().includes(searchLower) ||
          review.businessReply?.text?.toLowerCase().includes(searchLower)
        );
      })
    : reviews;

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
              <div
                style={{
                  backgroundColor: "#fef3cd",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px",
                  margin: "16px 0",
                  color: "#92400e",
                }}
              >
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
            loading={isPending}
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
