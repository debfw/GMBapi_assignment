import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useReviews = () => {
  const [isApiDisabled, setIsApiDisabled] = useState(false);
  const [lastApiCall, setLastApiCall] = useState<number>(0);
  const API_COOLDOWN = 1000;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filters: ReviewFiltersDomain) =>
      reviewService.getReviews(filters),
    onError: (error) => {
      if (reviewService.isRateLimited(error)) {
        setIsApiDisabled(true);
        setTimeout(() => {
          setIsApiDisabled(false);
        }, reviewService.getCooldownTime());
      }
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        // Cache the result
        queryClient.setQueryData(
          REVIEW_QUERY_KEYS.reviews(variables),
          result.data
        );
      }
    },
  });

  const fetchReviews = useCallback(
    (filters: ReviewFiltersDomain) => {
      if (isApiDisabled) return;

      const now = Date.now();
      const timeSinceLastCall = now - lastApiCall;

      if (timeSinceLastCall >= API_COOLDOWN || lastApiCall === 0) {
        setLastApiCall(now);
        mutation.mutate(filters);
      }
    },
    [isApiDisabled, lastApiCall, mutation]
  );

  return {
    ...mutation,
    fetchReviews,
    isApiDisabled,
    data: mutation.data?.success ? mutation.data.data : undefined,
    error: mutation.data?.success ? undefined : mutation.data?.error,
  };
};

export const useReviewReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reply: ReviewReplyDomain) =>
      reviewService.replyToReview(reply),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidate and refetch reviews
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        // Update specific review cache
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
        // Invalidate and refetch reviews
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        // Reset progress
        setProgress({ completed: 0, total: 0, currentReview: null });
      }
    },
    onError: () => {
      // Reset progress on error
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
