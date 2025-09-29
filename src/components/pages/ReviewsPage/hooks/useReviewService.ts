import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getReviews as getReviewsClient } from "@/services/hooks/useGetReviews";
import { replyToReview as replyToReviewClient } from "@/services/hooks/useReplyToReview";
import { transformReviewListResponse } from "@/utils/apiTransformers";
import type { ReviewListResponseDomain } from "@/services/domain/types";
import type {
  ReviewFiltersDomain,
  ReviewReplyDomain,
  FilterState,
} from "@/services/domain/types";

export const REVIEW_QUERY_KEYS = {
  reviews: (filters: ReviewFiltersDomain) => ["reviews", filters] as const,
  review: (id: string) => ["review", id] as const,
} as const;

export const useReviewsQuery = (filters: ReviewFiltersDomain) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.reviews(filters),
    queryFn: async () => {
      const apiFilters = {
        page: filters.page,
        per_page: filters.per_page,
        is_deleted: filters.is_deleted ?? false,
        ...(filters.star_rating !== undefined
          ? { star_rating: filters.star_rating }
          : {}),
        ...(filters.has_reply !== undefined
          ? { has_reply: filters.has_reply }
          : {}),
      } as const;

      const raw = await getReviewsClient(apiFilters);
      const transformed = transformReviewListResponse(raw as unknown);

      const data: ReviewListResponseDomain = {
        reviews: transformed.reviews.map((r: any) => ({
          id: r.id,
          customerName: r.customerName,
          customerPhoto: r.customerPhoto,
          comment: r.comment,
          rating: r.rating,
          date: r.date,
          status: r.status,
          locationName: r.locationName,
          helpfulVotes: r.helpfulVotes,
          businessReply: r.businessReply
            ? {
                text: r.businessReply.text,
                date: r.businessReply.date,
                isPublic: r.businessReply.isPublic,
              }
            : undefined,
        })),
        pagination: transformed.pagination,
        summary: transformed.summary,
      };

      return data;
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
    mutationFn: async (reply: ReviewReplyDomain) => {
      await replyToReviewClient(reply.reviewId, {
        text: reply.text,
        isPublic: reply.isPublic,
      });
      return { success: true as const };
    },
    onSuccess: (result, variables) => {
      if ((result as any).success) {
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
