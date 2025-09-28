import { errorSchema } from "./errorSchema.ts";
import { reviewSuggestionRequestSchema } from "./reviewSuggestionRequestSchema.ts";
import { reviewSuggestionResponseSchema } from "./reviewSuggestionResponseSchema.ts";
import { z } from "zod";

/**
 * @description Successful response with suggestion
 */
export const getReviewSuggestion200Schema = z.lazy(
  () => reviewSuggestionResponseSchema,
);

/**
 * @description Bad request - invalid input data
 */
export const getReviewSuggestion400Schema = z.lazy(() => errorSchema);

/**
 * @description Unauthorized - invalid or missing authentication
 */
export const getReviewSuggestion401Schema = z.lazy(() => errorSchema);

/**
 * @description Internal server error
 */
export const getReviewSuggestion500Schema = z.lazy(() => errorSchema);

export const getReviewSuggestionMutationRequestSchema = z.lazy(
  () => reviewSuggestionRequestSchema,
);

export const getReviewSuggestionMutationResponseSchema = z.lazy(
  () => getReviewSuggestion200Schema,
);
