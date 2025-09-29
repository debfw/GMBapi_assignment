import { getReviews, replyToReview, getReviewSuggestion } from "../hooks";
import type {
  ReviewFilters,
  ReviewReplyRequest,
  ReviewSuggestionRequest,
} from "../types";
import type {
  ReviewDomain,
  ReviewFiltersDomain,
  ReviewReplyDomain,
  ReviewSuggestionDomain,
  ReviewListResponseDomain,
  ServiceResult,
  BulkReplyRequest,
  BulkReplyProgress,
  ApiError,
} from "./types";
import { transformReviewListResponse } from "@/utils/apiTransformers";

const transformReview = (apiReview: any): ReviewDomain => ({
  id: apiReview.id,
  customerName: apiReview.customerName,
  customerPhoto: apiReview.customerPhoto,
  comment: apiReview.comment,
  rating: apiReview.rating,
  date: apiReview.date,
  status: apiReview.status,
  locationName: apiReview.locationName,
  helpfulVotes: apiReview.helpfulVotes,
  businessReply: apiReview.businessReply
    ? {
        text: apiReview.businessReply.text,
        date: apiReview.businessReply.date,
        isPublic: apiReview.businessReply.isPublic,
      }
    : undefined,
});

const transformFilters = (
  domainFilters: ReviewFiltersDomain
): ReviewFilters => {
  const apiFilters: ReviewFilters = {
    page: domainFilters.page,
    per_page: domainFilters.per_page,
    is_deleted: domainFilters.is_deleted ?? false,
  };

  if (domainFilters.star_rating !== undefined) {
    apiFilters.star_rating = domainFilters.star_rating;
  }

  if (domainFilters.has_reply !== undefined) {
    apiFilters.has_reply = domainFilters.has_reply;
  }

  return apiFilters;
};

const transformReply = (
  domainReply: ReviewReplyDomain
): ReviewReplyRequest => ({
  text: domainReply.text,
  isPublic: domainReply.isPublic,
});

const transformSuggestionRequest = (
  domainRequest: ReviewSuggestionDomain
): ReviewSuggestionRequest => ({
  review: domainRequest.reviewComment,
});

const createApiError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "status" in error) {
    return {
      message: (error as any).message || "An error occurred",
      status: (error as any).status,
      code: (error as any).code,
    };
  }

  return {
    message:
      error instanceof Error ? error.message : "An unknown error occurred",
    status: 500,
  };
};

export class ReviewService {
  async getReviews(
    filters: ReviewFiltersDomain
  ): Promise<ServiceResult<ReviewListResponseDomain>> {
    try {
      const apiFilters = transformFilters(filters);
      const rawData = await getReviews(apiFilters);
      const transformedData = transformReviewListResponse(rawData as any);

      return {
        success: true,
        data: {
          reviews: transformedData.reviews.map(transformReview),
          pagination: transformedData.pagination,
          summary: transformedData.summary,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(error),
      };
    }
  }

  async replyToReview(reply: ReviewReplyDomain): Promise<ServiceResult<void>> {
    try {
      const apiReply = transformReply(reply);
      await replyToReview(reply.reviewId, apiReply);

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: createApiError(error),
      };
    }
  }

  async getReviewSuggestion(
    request: ReviewSuggestionDomain
  ): Promise<ServiceResult<string>> {
    try {
      const apiRequest = transformSuggestionRequest(request);
      const result = await getReviewSuggestion(apiRequest);

      if (
        result?.msg &&
        result.msg.length > 0 &&
        result.msg[0]?.message?.content
      ) {
        return {
          success: true,
          data: result.msg[0].message.content,
        };
      }

      return {
        success: false,
        error: {
          message: "No suggestion available",
          status: 404,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(error),
      };
    }
  }

  async processBulkReplies(
    request: BulkReplyRequest,
    onProgress?: (progress: BulkReplyProgress) => void
  ): Promise<ServiceResult<void>> {
    const progress: BulkReplyProgress = {
      completed: 0,
      total: request.reviewIds.length,
      currentReview: null,
    };

    try {
      const concurrency = 3;
      const queue = [...request.reviewIds];
      const runNext = async (): Promise<void> => {
        const reviewId = queue.shift();
        if (!reviewId) return;
        progress.currentReview = reviewId;
        onProgress?.(progress);
        const replyResult = await this.replyToReview({
          reviewId,
          text: request.text,
          isPublic: request.isPublic,
        });
        if (!replyResult.success) {
          if (this.isRateLimited(replyResult.error)) {
            await new Promise((r) => setTimeout(r, this.getCooldownTime()));
          }
        }
        progress.completed++;
        onProgress?.(progress);
        return runNext();
      };

      await Promise.all(
        Array.from({ length: Math.min(concurrency, queue.length) }, runNext)
      );

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: createApiError(error),
      };
    }
  }

  isRateLimited(error: unknown): boolean {
    if (error && typeof error === "object" && "status" in error) {
      return (error as any).status === 429;
    }
    return false;
  }

  getCooldownTime(): number {
    return 30000; // 30 seconds
  }
}

export const reviewService = new ReviewService();
