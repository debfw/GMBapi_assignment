import { z } from "zod";

export const locationSchema = z.object({
  account_id: z.string().describe("Account identifier"),
  location_id: z.string().describe("Unique location identifier"),
  name: z.string().describe("Location name"),
  address: z.string().describe("Street address"),
  city: z.string().describe("City name"),
  state: z.string().describe("State or province"),
  country_code: z.string().describe("Country code"),
  postal: z.optional(z.string().describe("Postal code")),
  latitude: z.number().describe("Latitude coordinate"),
  longitude: z.number().describe("Longitude coordinate"),
  phone_number: z.string().describe("Primary phone number"),
  additional_phone_numbers: z.optional(
    z.array(z.string()).describe("Additional phone numbers"),
  ),
  category: z.string().describe("Primary business category"),
  additional_categories: z.optional(
    z.array(z.string()).describe("Additional business categories"),
  ),
  description: z.optional(z.string().describe("Business description")),
  website_uri: z.optional(z.string().url().describe("Website URL")),
  average_rating: z.number().describe("Average customer rating"),
  number_comments: z.optional(
    z.number().int().describe("Number of reviews/comments"),
  ),
  reply_percentage: z.optional(
    z.number().describe("Percentage of reviews replied to"),
  ),
  average_response_time: z.optional(
    z.number().describe("Average response time in hours"),
  ),
  health: z.number().describe("Overall location health score"),
  attribute_health: z.optional(z.number().describe("Attribute health score")),
  attributes: z.optional(z.array(z.string()).describe("Business attributes")),
  is_published: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether location is published"),
  is_verified: z
    .union([z.literal(0), z.literal(1)])
    .describe("Whether location is verified"),
  placeId: z.optional(z.string().describe("Google Place ID")),
  store_code: z.optional(z.string().describe("Store code")),
  has_additional_categories: z.optional(
    z
      .union([z.literal(0), z.literal(1)])
      .describe("Whether has additional categories"),
  ),
  has_address: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has address"),
  ),
  has_attributes: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has attributes"),
  ),
  has_category: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has category"),
  ),
  has_cover_image: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has cover image"),
  ),
  has_description: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has description"),
  ),
  has_exterior_image: z.optional(
    z
      .union([z.literal(0), z.literal(1)])
      .describe("Whether has exterior image"),
  ),
  has_hours: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has hours"),
  ),
  has_interior_image: z.optional(
    z
      .union([z.literal(0), z.literal(1)])
      .describe("Whether has interior image"),
  ),
  has_logo_or_profile_image: z.optional(
    z
      .union([z.literal(0), z.literal(1)])
      .describe("Whether has logo or profile image"),
  ),
  has_pending_edits: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has pending edits"),
  ),
  has_phone: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has phone"),
  ),
  has_service: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has service"),
  ),
  has_service_with_description: z.optional(
    z
      .union([z.literal(0), z.literal(1)])
      .describe("Whether has service with description"),
  ),
  has_special_hours: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has special hours"),
  ),
  has_utm_params: z.optional(
    z
      .union([z.literal(0), z.literal(1)])
      .describe("Whether has UTM parameters"),
  ),
  has_website: z.optional(
    z.union([z.literal(0), z.literal(1)]).describe("Whether has website"),
  ),
  regular_hours: z.optional(
    z.array(z.object({})).describe("Regular business hours"),
  ),
  special_hours: z.optional(
    z.array(z.object({})).describe("Special business hours"),
  ),
});
