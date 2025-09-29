import { useGetLocations } from "@/services/hooks";
import type { GetLocationsQueryParams } from "@/services/types";

export const useLocations = (params?: GetLocationsQueryParams) => {
  return useGetLocations(params, {
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  });
};

export const useLocationsData = (params?: GetLocationsQueryParams) => {
  const query = useLocations(params);

  return {
    locations: query.data?.payload?.data || [],
    metadata: query.data?.payload?.metadata,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
