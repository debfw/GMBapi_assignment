import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { reviewService } from "@/services/domain/reviewService";
import type {
  ReviewFiltersDomain,
  ReviewReplyDomain,
  ReviewSuggestionDomain,
  BulkReplyRequest,
  BulkReplyProgress,
  FilterState,
} from "@/services/domain/types";
import { PAGINATION } from "@/utils/constants";

export const REVIEW_QUERY_KEYS = {
  reviews: (filters: ReviewFiltersDomain) => ["reviews", filters] as const,
  review: (id: string) => ["review", id] as const,
} as const;

export const useReviewFilters = () => {
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: "",
    selectedStarRating: "",
    replyStatus: "",
  });

  const [filters, setFilters] = useState<ReviewFiltersDomain>({
    page: PAGINATION.DEFAULT_PAGE,
    per_page: PAGINATION.DEFAULT_LIMIT,
    is_deleted: false,
  });

  const handleStarRatingChange = useCallback((value: string) => {
    const rating = value === "" ? "" : parseInt(value);
    setFilterState((prev) => ({ ...prev, selectedStarRating: rating }));

    setFilters((prev) => {
      const newFilters = { ...prev, page: 1 };
      if (rating === "") {
        delete newFilters.star_rating;
      } else {
        newFilters.star_rating = rating;
      }
      return newFilters;
    });
  }, []);

  const handleReplyStatusChange = useCallback((value: string) => {
    setFilterState((prev) => ({ ...prev, replyStatus: value }));

    setFilters((prev) => {
      const newFilters = { ...prev, page: 1 };
      if (value === "replied") {
        newFilters.has_reply = true;
      } else if (value === "unreplied") {
        newFilters.has_reply = false;
      } else {
        delete newFilters.has_reply;
      }
      return newFilters;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterState({
      searchTerm: "",
      selectedStarRating: "",
      replyStatus: "",
    });
    setFilters({
      page: PAGINATION.DEFAULT_PAGE,
      per_page: PAGINATION.DEFAULT_LIMIT,
      is_deleted: false,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    filters,
    filterState,
    setFilters,
    handleStarRatingChange,
    handleReplyStatusChange,
    handleClearFilters,
    handlePageChange,
  };
};

export const useReviewsQuery = (filters: ReviewFiltersDomain) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.reviews(filters),
    queryFn: async () => {
      const result = await reviewService.getReviews(filters);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    placeholderData: () =>
      queryClient.getQueryData(REVIEW_QUERY_KEYS.reviews(filters)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reply: ReviewReplyDomain) =>
      reviewService.replyToReview(reply),
    onSuccess: (result, variables) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.setQueryData(
          REVIEW_QUERY_KEYS.review(variables.reviewId),
          (old: any) => ({
            ...old,
            status: "replied",
          })
        );
      }
    },
  });
};

export const useReviewSuggestion = () => {
  return useMutation({
    mutationFn: (request: ReviewSuggestionDomain) =>
      reviewService.getReviewSuggestion(request),
  });
};

export const useBulkReply = () => {
  const [progress, setProgress] = useState<BulkReplyProgress>({
    completed: 0,
    total: 0,
    currentReview: null,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request: BulkReplyRequest) =>
      reviewService.processBulkReplies(request, setProgress),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        setProgress({ completed: 0, total: 0, currentReview: null });
      }
    },
    onError: () => {
      setProgress({ completed: 0, total: 0, currentReview: null });
    },
  });

  return {
    ...mutation,
    progress,
    resetProgress: () =>
      setProgress({ completed: 0, total: 0, currentReview: null }),
  };
};

export const useApiRateLimit = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [lastError, setLastError] = useState<Date | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (reviewService.isRateLimited(error)) {
      setIsDisabled(true);
      setLastError(new Date());

      setTimeout(() => {
        setIsDisabled(false);
        setLastError(null);
      }, reviewService.getCooldownTime());
    }
  }, []);

  const getRemainingCooldown = useCallback(() => {
    if (!lastError) return 0;
    const elapsed = Date.now() - lastError.getTime();
    return Math.max(0, reviewService.getCooldownTime() - elapsed);
  }, [lastError]);

  return {
    isDisabled,
    lastError,
    handleError,
    getRemainingCooldown,
  };
};
