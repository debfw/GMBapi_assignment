import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

export const badRequestErrorSchema = z.lazy(() => errorSchema);
