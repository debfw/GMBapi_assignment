import React, { useState, useCallback, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { SingleReviewReplyModal } from "./SingleReviewReplyModal";
import { BulkReplyModal } from "./BulkReplyModal";
import { ReviewsHeader, ReviewsFilters } from "@/components/common";
import { ReviewsContent } from "./ReviewsContent";
import { useReviews, useReviewsFilters } from "@/hooks";
import type { Review } from "@/services/types";

export const ReviewsPage: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<{
    id: string;
    text: string;
    customerName: string;
  } | null>(null);

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showBulkReplyModal, setShowBulkReplyModal] = useState(false);
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

  useEffect(() => {
    mutate({ data: filters });
  }, [filters, mutate]);

  const handleReplyClick = useCallback((review: Review) => {
    setSelectedReview({
      id: review.id,
      text: review.comment,
      customerName: review.customerName,
    });
    setShowReplyModal(true);
  }, []);

  const handleCloseReplyModal = useCallback(() => {
    setShowReplyModal(false);
    setSelectedReview(null);
  }, []);

  const handleCloseBulkReplyModal = useCallback(() => {
    setShowBulkReplyModal(false);
  }, []);

  const handleBulkReply = useCallback(() => {
    setShowBulkReplyModal(true);
  }, []);

  const handleRefreshReviews = useCallback(() => {
    mutate({ data: filters });
  }, [mutate, filters]);

  const handleReplySuccess = useCallback(() => {
    mutate({ data: filters });
  }, [mutate, filters]);

  const handleBulkReplySuccess = useCallback(() => {
    mutate({ data: filters });
  }, [mutate, filters]);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ ...filters, page });
    },
    [filters, setFilters]
  );

  const reviews = data?.reviews || [];

  // Filter reviews based on search term
  const filteredReviews = searchTerm.trim()
    ? reviews.filter((review) => {
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
              onBulkReply={handleBulkReply}
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
        show={showReplyModal && selectedReview !== null}
        reviewId={selectedReview?.id || ""}
        reviewText={selectedReview?.text || ""}
        customerName={selectedReview?.customerName || ""}
        onClose={handleCloseReplyModal}
        onSuccess={handleReplySuccess}
      />

      <BulkReplyModal
        show={showBulkReplyModal}
        reviews={reviews}
        onClose={handleCloseBulkReplyModal}
        onSuccess={handleBulkReplySuccess}
      />
    </ResponsiveLayout>
  );
};
