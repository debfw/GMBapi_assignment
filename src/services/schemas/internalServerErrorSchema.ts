import { errorSchema } from "./errorSchema.ts";
import { z } from "zod";

export const internalServerErrorSchema = z.lazy(() => errorSchema);
