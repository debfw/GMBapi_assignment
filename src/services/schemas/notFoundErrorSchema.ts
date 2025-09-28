import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

export const notFoundErrorSchema = z.lazy(() => errorSchema);
