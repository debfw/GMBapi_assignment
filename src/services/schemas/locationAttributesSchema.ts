import { z } from "zod";

export const locationAttributesSchema = z.object({
  missing_attributes: z
    .array(z.string())
    .describe("List of missing attributes"),
  available_attributes: z
    .array(z.string())
    .describe("List of available attributes"),
});
