import { useMutation } from "@tanstack/react-query";
import { getReviewsMutationOptions, getReviews } from "@/services/hooks";
import type { ReviewFilters } from "@/services/types";
import { transformReviewListResponse } from "@/utils/apiTransformers";

export const useReviews = () => {
  const baseMutation = useMutation({
    ...getReviewsMutationOptions(),
    mutationFn: async (variables: { data: ReviewFilters }) => {
      const rawData = await getReviews(variables.data);
      const transformedData = transformReviewListResponse(rawData as any);
      return transformedData;
    },
  });

  return baseMutation;
};
