import { z } from "zod";

export const locationHygieneSchema = z.object({
  location_id: z.string().describe("Location identifier"),
  is_verified: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether location is verified"),
  is_published: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether location is published"),
  has_phone: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has phone"),
  has_website: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has website"),
  has_address: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has address"),
  has_hours: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has hours"),
  has_special_hours: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has special hours"),
  has_category: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has category"),
  has_additional_categories: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has additional categories"),
  has_attributes: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has attributes"),
  has_description: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has description"),
  has_cover_image: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has cover image"),
  has_logo_or_profile_image: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has logo or profile image"),
  has_interior_image: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has interior image"),
  has_exterior_image: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has exterior image"),
  has_service_with_description: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has service with description"),
  has_service: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has service"),
  has_utm_params: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether has UTM parameters"),
  health: z.number().describe("Overall location health score"),
});
