import { paginationSchema } from "./paginationSchema.ts";
import { reviewSchema } from "./reviewSchema.ts";
import { reviewSummarySchema } from "./reviewSummarySchema.ts";
import { z } from "zod";

export const reviewListResponseSchema = z.object({
  reviews: z.array(z.lazy(() => reviewSchema)),
  pagination: z.lazy(() => paginationSchema),
  summary: z.lazy(() => reviewSummarySchema),
});
