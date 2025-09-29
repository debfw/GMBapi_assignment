import React, { useState } from "react";
import type { ReviewListResponse } from "@/services/types/ReviewListResponse";
import type { FilterState } from "@/components/pages/ReviewsPage/hooks/useReviewsFilters";
import type { ReviewDomain, PaginationDomain } from "@/services/domain/types";
import { useGetLocationReviews } from "@/services";
import { ReviewsFilters } from "../../ReviewsPage/ui/ReviewsFilters";
import { ReviewList } from "../../ReviewsPage/ui/ReviewList";

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
  const {
    mutate: getLocationReviews,
    isPending: isLoading,
    error,
    data,
  } = useGetLocationReviews();
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
    getLocationReviews({ data: newFilters });
  };

  const handleSearch = () => {
    getLocationReviews({ data: filters });
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    getLocationReviews({ data: newFilters });
  };

  const handleReply = (review: ReviewDomain) => {
    // Handle reply functionality for location reviews
    console.log("Reply to review:", review.id);
  };

  const typedData = data as ReviewListResponse | null;
  const reviewsApi = typedData?.reviews || [];
  const paginationApi = typedData?.pagination;

  const reviews: ReviewDomain[] = reviewsApi.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    customerPhoto: r.customerPhoto,
    comment: r.comment,
    rating: r.rating,
    date: r.date,
    status: r.status as any,
    locationName: r.locationName,
    helpfulVotes: r.helpfulVotes,
    businessReply: r.businessReply
      ? {
          text: r.businessReply.text,
          date: r.businessReply.date,
          isPublic: r.businessReply.isPublic,
        }
      : undefined,
  }));

  const pagination: PaginationDomain | undefined = paginationApi
    ? {
        page: paginationApi.page,
        limit: paginationApi.limit,
        total: paginationApi.total,
        totalPages: paginationApi.totalPages,
        hasNext: paginationApi.hasNext ?? false,
        hasPrev: paginationApi.hasPrev ?? false,
      }
    : undefined;

  const filterState: FilterState = {
    searchTerm: "",
    selectedStarRating: filters.star_rating ?? "",
    replyStatus: "",
  };

  return (
    <div className="location-reviews">
      {showFilters && (
        <div className="mb-4">
          <ReviewsFilters
            filterState={filterState}
            onStarRatingChange={(value: string) =>
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
              getLocationReviews({ data: clearedFilters });
            }}
            onReplyStatusChange={() => {}}
            onBulkReply={() => {}}
            onRefreshReviews={handleSearch}
          />
        </div>
      )}

      <ReviewList
        reviews={reviews}
        pagination={pagination}
        loading={isLoading as boolean}
        error={(error as { message?: string } | undefined)?.message}
        onReply={handleReply}
        onPageChange={handlePageChange}
        filterState={filterState}
      />
    </div>
  );
};
