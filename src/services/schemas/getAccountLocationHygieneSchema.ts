import { accountLocationHygieneResponseSchema } from "./accountLocationHygieneResponseSchema.ts";
import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

export const getAccountLocationHygienePathParamsSchema = z.object({
  location_id: z.string().describe("Location Id"),
});

/**
 * @description Successful response with location hygiene
 */
export const getAccountLocationHygiene200Schema = z.lazy(
  () => accountLocationHygieneResponseSchema,
);

/**
 * @description Bad request - invalid input data
 */
export const getAccountLocationHygiene400Schema = z.lazy(() => errorSchema);

/**
 * @description Unauthorized - invalid or missing authentication
 */
export const getAccountLocationHygiene401Schema = z.lazy(() => errorSchema);

/**
 * @description Not found - requested resource does not exist
 */
export const getAccountLocationHygiene404Schema = z.lazy(() => errorSchema);

/**
 * @description Internal server error
 */
export const getAccountLocationHygiene500Schema = z.lazy(() => errorSchema);

export const getAccountLocationHygieneQueryResponseSchema = z.lazy(
  () => getAccountLocationHygiene200Schema,
);
