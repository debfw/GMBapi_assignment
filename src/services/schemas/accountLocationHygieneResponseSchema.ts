import { locationHygieneSchema } from "./locationHygieneSchema.ts";
import { z } from "zod";

export const accountLocationHygieneResponseSchema = z.object({
  success: z.boolean().describe("Whether the request was successful"),
  payload: z.lazy(() => locationHygieneSchema),
});
