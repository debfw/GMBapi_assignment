import { accountKPIsResponseSchema } from "./accountKPIsResponseSchema.ts";
import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

/**
 * @description Successful response with account KPIs
 */
export const getAccountKPIs200Schema = z.lazy(() => accountKPIsResponseSchema);

/**
 * @description Bad request - invalid input data
 */
export const getAccountKPIs400Schema = z.lazy(() => errorSchema);

/**
 * @description Unauthorized - invalid or missing authentication
 */
export const getAccountKPIs401Schema = z.lazy(() => errorSchema);

/**
 * @description Internal server error
 */
export const getAccountKPIs500Schema = z.lazy(() => errorSchema);

export const getAccountKPIsQueryResponseSchema = z.lazy(
  () => getAccountKPIs200Schema,
);
