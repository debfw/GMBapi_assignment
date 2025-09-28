import { accountLocationProfileDataSchema } from "./accountLocationProfileDataSchema.ts";
import { locationAttributesSchema } from "./locationAttributesSchema.ts";
import { locationHygieneSchema } from "./locationHygieneSchema.ts";
import { z } from "zod";

export const accountLocationProfileResponseSchema = z.object({
  success: z.boolean().describe("Whether the request was successful"),
  payload: z.object({
    data: z.lazy(() => accountLocationProfileDataSchema),
    attributes: z.lazy(() => locationAttributesSchema),
    hygiene: z.lazy(() => locationHygieneSchema),
  }),
});
