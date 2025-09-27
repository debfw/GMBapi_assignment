/**
 * Refactored Reviews Page
 * Uses smaller components and the new service layer
 */

import React, { useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ReviewReply } from "../ReviewReply";
import { BulkReplyModal } from "../BulkReply/BulkReplyModal";
import { ReviewsHeader } from "../ReviewsHeader";
import { ReviewsFilters } from "../ReviewsFilters";
import { ReviewsContent } from "./ReviewsContent";
import { useReviews, useReviewsFilters } from "@/hooks";

export const ReviewsPage: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<{
    id: string;
    text: string;
    customerName: string;
  } | null>(null);

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showBulkReplyModal, setShowBulkReplyModal] = useState(false);

  // Use the original working hooks
  const {
    filters,
    filterState,
    handleStarRatingChange,
    handleClearFilters,
    handleReplyStatusChange,
    setFilters,
  } = useReviewsFilters();

  const reviewsMutation = useReviews();

  // Single effect to handle both initial load and filter changes
  useEffect(() => {
    reviewsMutation.mutate({ data: filters });
  }, [filters.star_rating, filters.has_reply, filters.page, filters.per_page]);

  // Handle review selection for reply
  const handleReplyClick = useCallback(
    (reviewId: string) => {
      const review = reviewsMutation.data?.reviews.find(
        (r) => r.id === reviewId
      );
      if (review) {
        setSelectedReview({
          id: review.id,
          text: review.comment,
          customerName: review.customerName,
        });
        setShowReplyModal(true);
      }
    },
    [reviewsMutation.data]
  );

  // Handle modal close
  const handleCloseReplyModal = useCallback(() => {
    setShowReplyModal(false);
    setSelectedReview(null);
  }, []);

  const handleCloseBulkReplyModal = useCallback(() => {
    setShowBulkReplyModal(false);
  }, []);

  // Handle bulk reply
  const handleBulkReply = useCallback(() => {
    setShowBulkReplyModal(true);
  }, []);

  // Handle refresh
  const handleRefreshReviews = useCallback(() => {
    reviewsMutation.mutate({ data: filters });
  }, [reviewsMutation, filters]);

  // Handle successful reply
  const handleReplySuccess = useCallback(() => {
    reviewsMutation.mutate({ data: filters });
  }, [reviewsMutation, filters]);

  // Handle bulk reply success
  const handleBulkReplySuccess = useCallback(() => {
    reviewsMutation.mutate({ data: filters });
  }, [reviewsMutation, filters]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ ...filters, page });
    },
    [filters, setFilters]
  );

  // Handle export/import (placeholder)
  const handleExportReviews = useCallback(() => {
    // Export functionality not yet available
  }, []);

  const handleImportReviews = useCallback(() => {
    // Import functionality not yet available
  }, []);

  // Get data with defaults
  const reviews = reviewsMutation.data?.reviews || [];
  const pagination = reviewsMutation.data?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  return (
    <div
      style={{ display: "flex", minHeight: "100vh" }}
      data-testid="reviews-page"
    >
      {/* Sidebar */}
      <Sidebar activeSection="reviews" />

      {/* Main Content Area */}
      <div className="page-content-container">
        <div className="main-content-wrapper">
          {/* Header Section */}
          <div className="content-section">
            <ReviewsHeader />
            {reviewsMutation.error && (
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
                🚨 API Error:{" "}
                {(reviewsMutation.error as any)?.message || "An error occurred"}
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
              onExportReviews={handleExportReviews}
              onImportReviews={handleImportReviews}
              onRefreshReviews={handleRefreshReviews}
            />
          </div>

          {/* Reviews Content */}
          <ReviewsContent
            reviews={reviews}
            pagination={pagination}
            loading={reviewsMutation.isPending}
            error={
              reviewsMutation.error && !reviewsMutation.data
                ? (reviewsMutation.error as any)?.message || "An error occurred"
                : undefined
            }
            filterState={filterState}
            onReply={handleReplyClick}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedReview && (
        <ReviewReply
          show={showReplyModal}
          reviewId={selectedReview.id}
          reviewText={selectedReview.text}
          customerName={selectedReview.customerName}
          onClose={handleCloseReplyModal}
          onSuccess={handleReplySuccess}
        />
      )}

      <BulkReplyModal
        show={showBulkReplyModal}
        reviews={reviews}
        onClose={handleCloseBulkReplyModal}
        onSuccess={handleBulkReplySuccess}
      />
    </div>
  );
};
