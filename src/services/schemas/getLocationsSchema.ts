import { errorSchema } from "./errorSchema.ts";
import { locationListResponseSchema } from "./locationListResponseSchema.ts";
import { z } from "zod";

export const getLocationsQueryParamsSchema = z.object({
  page: z.optional(
    z.coerce.number().int().min(1).default(1).describe("Page number"),
  ),
  per_page: z.optional(
    z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Results per page. Default is 10. Maximum is 50"),
  ),
  store_code: z.optional(
    z.string().describe("Filter locations based on store code"),
  ),
  include_fields: z.optional(
    z
      .string()
      .describe("Select the fields to include based on the Location object"),
  ),
});

/**
 * @description Successful response with locations list
 */
export const getLocations200Schema = z.lazy(() => locationListResponseSchema);

/**
 * @description Bad request - invalid input data
 */
export const getLocations400Schema = z.lazy(() => errorSchema);

/**
 * @description Unauthorized - invalid or missing authentication
 */
export const getLocations401Schema = z.lazy(() => errorSchema);

/**
 * @description Internal server error
 */
export const getLocations500Schema = z.lazy(() => errorSchema);

export const getLocationsQueryResponseSchema = z.lazy(
  () => getLocations200Schema,
);
