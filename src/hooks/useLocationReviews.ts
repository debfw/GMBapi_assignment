import { useGetLocationReviews } from "@/services";
import type { LocationReviewFilters } from "@/services";

export const useLocationReviews = () => {
  const mutation = useGetLocationReviews();

  const getLocationReviews = (filters: LocationReviewFilters) => {
    // The mutation object should have a mutate method
    if ("mutate" in mutation && typeof mutation.mutate === "function") {
      return mutation.mutate({ data: filters });
    }
    return Promise.reject(new Error("Mutation not properly initialized"));
  };

  return {
    getLocationReviews,
    isLoading: "isPending" in mutation ? mutation.isPending : false,
    error: "error" in mutation ? mutation.error : null,
    data: "data" in mutation ? mutation.data : null,
    reset: "reset" in mutation ? mutation.reset : () => {},
  };
};
