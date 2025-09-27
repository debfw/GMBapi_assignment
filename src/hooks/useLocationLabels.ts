import { useGetAccountLocationLabels } from "@/services";

export const useLocationLabels = () => {
  const { data, isLoading, error, refetch } = useGetAccountLocationLabels();

  return {
    labels: data?.payload || [],
    isLoading,
    error,
    refetch,
  };
};
