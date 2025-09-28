import React, { useState } from "react";
import { useLocationReviews } from "@/hooks";
import { ReviewList, ReviewsFilters } from "@/components/common";
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

  const handleFilterChange = (
    key: string,
    value: string | number | boolean | undefined
  ) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    getLocationReviews(newFilters);
  };

  const handleSearch = () => {
    getLocationReviews(filters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    getLocationReviews(newFilters);
  };

  const handleReply = (reviewId: string) => {
    // Handle reply functionality for location reviews
    console.log("Reply to review:", reviewId);
  };

  const typedData = data as ReviewListResponse | null;
  const reviews = typedData?.reviews || [];
  const pagination = typedData?.pagination;

  // Convert location filters to the format expected by ReviewsFilters
  const filterState = {
    star_rating: filters.star_rating?.toString() || "",
    has_reply: "", // Location reviews don't have reply status filter
    page: filters.page,
    per_page: filters.per_page,
  };

  return (
    <div className="location-reviews">
      {showFilters && (
        <div className="mb-4">
          <ReviewsFilters
            filterState={filterState}
            onStarRatingChange={(value) =>
              handleFilterChange(
                "star_rating",
                value ? parseInt(value) : undefined
              )
            }
            onClearFilters={() => {
              const clearedFilters = {
                location_id: locationId,
                store_code: storeCode,
                page: 1,
                per_page: 10,
                star_rating: undefined,
                has_comment: undefined,
              };
              setFilters(clearedFilters);
              getLocationReviews(clearedFilters);
            }}
            onReplyStatusChange={() => {}} // Not applicable for location reviews
            onBulkReply={() => {}} // Not applicable for location reviews
            onExportReviews={() => {}} // Not applicable for location reviews
            onImportReviews={() => {}} // Not applicable for location reviews
            onRefreshReviews={handleSearch}
          />
        </div>
      )}

      <ReviewList
        reviews={reviews}
        pagination={pagination}
        loading={isLoading as boolean}
        error={error?.message}
        onReply={handleReply}
        onPageChange={handlePageChange}
        filterState={filterState}
      />
    </div>
  );
};
