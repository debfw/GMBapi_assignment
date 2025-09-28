import type { Error } from "./Error.ts";
import type { LocationReviewFilters } from "./LocationReviewFilters.ts";
import type { ReviewListResponse } from "./ReviewListResponse.ts";

/**
 * @description Successful response
 */
export type GetLocationReviews200 = ReviewListResponse;

/**
 * @description Bad request - invalid input data
 */
export type GetLocationReviews400 = Error;

/**
 * @description Unauthorized - invalid or missing authentication
 */
export type GetLocationReviews401 = Error;

/**
 * @description Internal server error
 */
export type GetLocationReviews500 = Error;

export type GetLocationReviewsMutationRequest = LocationReviewFilters;

export type GetLocationReviewsMutationResponse = GetLocationReviews200;

export type GetLocationReviewsMutation = {
  Response: GetLocationReviews200;
  Request: GetLocationReviewsMutationRequest;
  Errors: GetLocationReviews400 | GetLocationReviews401 | GetLocationReviews500;
};
