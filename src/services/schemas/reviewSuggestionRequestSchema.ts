import { z } from "zod";

export const reviewSuggestionRequestSchema = z.object({
  review: z
    .string()
    .min(1)
    .describe("The customer review text to generate suggestions for"),
});
