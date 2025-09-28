import { reviewReplySchema } from "./reviewReplySchema.ts";
import { reviewSchema } from "./reviewSchema.ts";
import { z } from "zod";

export const reviewReplyResponseSchema = z.object({
  reply: z.lazy(() => reviewReplySchema),
  review: z.lazy(() => reviewSchema),
});
