import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { ReviewFilters as ReviewFiltersType } from "@/services/types";
import { PAGINATION } from "@/utils/constants";

export interface FilterState {
  searchTerm: string;
  selectedStarRating: number | "";
  replyStatus: string;
}

export interface UseReviewsFiltersReturn {
  filters: ReviewFiltersType;
  filterState: FilterState;
  debouncedSearchTerm: string;
  handleSearchChange: (value: string) => void;
  handleStarRatingChange: (value: string) => void;
  handleClearFilters: () => void;
  setFilters: (filters: ReviewFiltersType) => void;
  handleReplyStatusChange: (value: string) => void;
}

const initialFilterState: FilterState = {
  searchTerm: "",
  selectedStarRating: "",
  replyStatus: "",
};

const initialFilters: ReviewFiltersType = {
  page: PAGINATION.DEFAULT_PAGE,
  per_page: PAGINATION.DEFAULT_LIMIT, // Back to default to avoid quota issues
  is_deleted: false,
};

export const useReviewsFilters = (): UseReviewsFiltersReturn => {
  const [filters, setFilters] = useState<ReviewFiltersType>(initialFilters);
  const [filterState, setFilterState] =
    useState<FilterState>(initialFilterState);

  const debouncedSearchTerm = useDebounce(filterState.searchTerm, 300);

  useEffect(() => {}, [debouncedSearchTerm]);

  const handleSearchChange = useCallback((value: string) => {
    setFilterState((prev) => ({ ...prev, searchTerm: value }));
  }, []);

  const handleStarRatingChange = useCallback(
    (value: string) => {
      const rating = value === "" ? "" : parseInt(value);
      setFilterState((prev) => ({ ...prev, selectedStarRating: rating }));

      const newFilters = { ...filters, page: 1 };

      if (rating === "") {
        delete newFilters.star_rating;
      } else {
        newFilters.star_rating = rating;
      }

      setFilters(newFilters);
    },
    [filters]
  );

  const handleClearFilters = useCallback(() => {
    setFilterState(initialFilterState);
    setFilters(initialFilters);
  }, []);

  const handleReplyStatusChange = useCallback(
    (value: string) => {
      setFilterState((prev) => ({ ...prev, replyStatus: value }));

      const newFilters = { ...filters, page: 1 };

      if (value === "replied") {
        newFilters.has_reply = true;
      } else if (value === "unreplied") {
        newFilters.has_reply = false;
      } else {
        delete newFilters.has_reply;
      }

      setFilters(newFilters);
    },
    [filters]
  );

  return {
    filters,
    filterState,
    debouncedSearchTerm,
    handleSearchChange,
    handleStarRatingChange,
    handleClearFilters,
    setFilters,
    handleReplyStatusChange,
  };
};
