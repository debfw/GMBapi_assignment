import { useMutation } from "@tanstack/react-query";
import {
  getReviewsMutationOptions,
  replyToReviewMutationOptions,
  getReviews,
} from "@/services/hooks";
import type { ReviewFilters } from "@/services/types";
import { transformReviewListResponse } from "@/utils/apiTransformers";

// Mock data for development
const mockReviewListResponse = {
  metadata: {
    pages: 1,
    results_per_page: 10,
    current_page: 1,
    results: 2,
  },
  data: [
    {
      account_id: "demo250",
      comment_en: "Excellent service! Highly recommended.",
      comment_native: "Excellent service! Highly recommended.",
      created_date: 1758512460876864,
      has_comment: 1,
      is_deleted: 0,
      location_id: "131",
      profilePhotoUrl:
        "https://ui-avatars.com/api/?name=John Doe&size=128&background=40E0D0",
      rating: 5,
      reply: 0,
      reply_comment: "",
      reply_date: null,
      response_time: null,
      review_name: "833333",
      reviewerName: "John Doe",
      update_date: 1758512460876864,
    },
    {
      account_id: "demo250",
      comment_en: "Good experience overall, but could be better.",
      comment_native: "Good experience overall, but could be better.",
      created_date: 1758505325876864,
      has_comment: 1,
      is_deleted: 0,
      location_id: "48",
      profilePhotoUrl:
        "https://ui-avatars.com/api/?name=Jane Smith&size=128&background=40E0D0",
      rating: 4,
      reply: 1,
      reply_comment: "Thank you for your feedback!",
      reply_date: 1759117260876864,
      response_time: 168,
      review_name: "801372",
      reviewerName: "Jane Smith",
      update_date: 1758505325876864,
    },
  ],
};

export const useReviews = () => {
  const baseMutation = useMutation({
    ...getReviewsMutationOptions(),
    mutationFn: async (variables: { data: ReviewFilters }) => {
      try {
        const rawData = await getReviews(variables.data);
        const transformedData = transformReviewListResponse(rawData as any);
        return transformedData;
      } catch (error) {
        // Use mock data when API fails
        const transformedData = transformReviewListResponse(
          mockReviewListResponse as any
        );
        return transformedData;
      }
    },
  });

  return baseMutation;
};

export const useReviewReply = () => {
  return useMutation({
    ...replyToReviewMutationOptions(),
  });
};
