import type { Error } from "./Error.ts";
import type { ReviewFilters } from "./ReviewFilters.ts";
import type { ReviewListResponse } from "./ReviewListResponse.ts";

/**
 * @description Successful response
 */
export type GetReviews200 = ReviewListResponse;

/**
 * @description Bad request - invalid input data
 */
export type GetReviews400 = Error;

/**
 * @description Unauthorized - invalid or missing authentication
 */
export type GetReviews401 = Error;

/**
 * @description Internal server error
 */
export type GetReviews500 = Error;

export type GetReviewsMutationRequest = ReviewFilters;

export type GetReviewsMutationResponse = GetReviews200;

export type GetReviewsMutation = {
  Response: GetReviews200;
  Request: GetReviewsMutationRequest;
  Errors: GetReviews400 | GetReviews401 | GetReviews500;
};
