import { z } from "zod";

export const accountKPIsResponseSchema = z.object({
  success: z.boolean().describe("Whether the request was successful"),
  payload: z.object({
    average_rating: z.nullable(
      z.number().describe("Average rating across all reviews"),
    ),
    number_of_comments: z
      .number()
      .int()
      .min(0)
      .describe("Total number of reviews with comments"),
    reply_percentage: z.nullable(
      z.number().describe("Percentage of reviews that have been replied to"),
    ),
    response_time: z
      .number()
      .int()
      .min(0)
      .describe("Average response time in hours"),
    number_ratings: z.number().int().min(0).describe("Total number of ratings"),
  }),
});
