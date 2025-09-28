import { z } from "zod";

export const reviewSummarySchema = z.object({
  total: z.number().int().describe("Total number of reviews matching filters"),
  averageRating: z
    .number()
    .min(1)
    .max(5)
    .describe("Average rating of filtered reviews"),
  ratingDistribution: z
    .object({
      "1": z.optional(z.number().int()),
      "2": z.optional(z.number().int()),
      "3": z.optional(z.number().int()),
      "4": z.optional(z.number().int()),
      "5": z.optional(z.number().int()),
    })
    .describe("Distribution of ratings (1-5 stars)"),
});
