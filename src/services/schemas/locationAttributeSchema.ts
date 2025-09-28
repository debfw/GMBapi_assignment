import { z } from "zod";

export const locationAttributeSchema = z.object({
  name: z.string().describe("Attribute name"),
  values: z.optional(
    z.array(z.boolean()).describe("Boolean values for the attribute"),
  ),
  repeatedEnumValue: z.optional(
    z.object({
      setValues: z.optional(z.array(z.string())),
    }),
  ),
  valueType: z
    .enum(["BOOL", "REPEATED_ENUM"])
    .describe("Type of the attribute value"),
});
