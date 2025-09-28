import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().int().min(1).describe("Current page number"),
  limit: z.number().int().min(1).describe("Number of items per page"),
  total: z.number().int().min(0).describe("Total number of items"),
  totalPages: z.number().int().min(0).describe("Total number of pages"),
  hasNext: z.optional(z.boolean().describe("Whether there is a next page")),
  hasPrev: z.optional(z.boolean().describe("Whether there is a previous page")),
});
