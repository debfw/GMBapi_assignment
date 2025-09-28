import { accountLocationLabelsResponseSchema } from "./accountLocationLabelsResponseSchema.ts";
import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

/**
 * @description Successful response with location labels
 */
export const getAccountLocationLabels200Schema = z.lazy(
  () => accountLocationLabelsResponseSchema,
);

/**
 * @description Bad request - invalid input data
 */
export const getAccountLocationLabels400Schema = z.lazy(() => errorSchema);

/**
 * @description Unauthorized - invalid or missing authentication
 */
export const getAccountLocationLabels401Schema = z.lazy(() => errorSchema);

/**
 * @description Internal server error
 */
export const getAccountLocationLabels500Schema = z.lazy(() => errorSchema);

export const getAccountLocationLabelsQueryResponseSchema = z.lazy(
  () => getAccountLocationLabels200Schema,
);
