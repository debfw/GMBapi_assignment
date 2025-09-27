import { useGetAccountLocationHygiene } from "@/services";

export const useLocationHygiene = (locationId: string) => {
  const { data, isLoading, error, refetch } =
    useGetAccountLocationHygiene(locationId);

  return {
    hygiene: data?.payload,
    isLoading,
    error,
    refetch,
  };
};
