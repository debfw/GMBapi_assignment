import { useGetAccountLocationProfile } from "@/services/hooks";

export const useLocationProfile = (locationId: string) => {
  return useGetAccountLocationProfile(locationId, {
    query: {
      enabled: !!locationId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  });
};

export const useLocationProfileData = (locationId: string) => {
  const query = useLocationProfile(locationId);

  return {
    profile: query.data?.payload,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
