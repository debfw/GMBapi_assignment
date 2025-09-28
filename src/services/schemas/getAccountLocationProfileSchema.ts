import { accountLocationProfileResponseSchema } from "./accountLocationProfileResponseSchema.ts";
import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

export const getAccountLocationProfilePathParamsSchema = z.object({
  location_id: z.string().describe("Location Id"),
});

/**
 * @description Successful response with location profile
 */
export const getAccountLocationProfile200Schema = z.lazy(
  () => accountLocationProfileResponseSchema,
);

/**
 * @description Bad request - invalid input data
 */
export const getAccountLocationProfile400Schema = z.lazy(() => errorSchema);

/**
 * @description Unauthorized - invalid or missing authentication
 */
export const getAccountLocationProfile401Schema = z.lazy(() => errorSchema);

/**
 * @description Not found - requested resource does not exist
 */
export const getAccountLocationProfile404Schema = z.lazy(() => errorSchema);

/**
 * @description Internal server error
 */
export const getAccountLocationProfile500Schema = z.lazy(() => errorSchema);

export const getAccountLocationProfileQueryResponseSchema = z.lazy(
  () => getAccountLocationProfile200Schema,
);
