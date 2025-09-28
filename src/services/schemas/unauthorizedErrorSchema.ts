import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

export const unauthorizedErrorSchema = z.lazy(() => errorSchema);
