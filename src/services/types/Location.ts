export const locationIsPublishedEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationIsPublishedEnumKey =
  (typeof locationIsPublishedEnum)[keyof typeof locationIsPublishedEnum];

export const locationIsVerifiedEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationIsVerifiedEnumKey =
  (typeof locationIsVerifiedEnum)[keyof typeof locationIsVerifiedEnum];

export const locationHasAdditionalCategoriesEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasAdditionalCategoriesEnumKey =
  (typeof locationHasAdditionalCategoriesEnum)[keyof typeof locationHasAdditionalCategoriesEnum];

export const locationHasAddressEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasAddressEnumKey =
  (typeof locationHasAddressEnum)[keyof typeof locationHasAddressEnum];

export const locationHasAttributesEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasAttributesEnumKey =
  (typeof locationHasAttributesEnum)[keyof typeof locationHasAttributesEnum];

export const locationHasCategoryEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasCategoryEnumKey =
  (typeof locationHasCategoryEnum)[keyof typeof locationHasCategoryEnum];

export const locationHasCoverImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasCoverImageEnumKey =
  (typeof locationHasCoverImageEnum)[keyof typeof locationHasCoverImageEnum];

export const locationHasDescriptionEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasDescriptionEnumKey =
  (typeof locationHasDescriptionEnum)[keyof typeof locationHasDescriptionEnum];

export const locationHasExteriorImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasExteriorImageEnumKey =
  (typeof locationHasExteriorImageEnum)[keyof typeof locationHasExteriorImageEnum];

export const locationHasHoursEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasHoursEnumKey =
  (typeof locationHasHoursEnum)[keyof typeof locationHasHoursEnum];

export const locationHasInteriorImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasInteriorImageEnumKey =
  (typeof locationHasInteriorImageEnum)[keyof typeof locationHasInteriorImageEnum];

export const locationHasLogoOrProfileImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasLogoOrProfileImageEnumKey =
  (typeof locationHasLogoOrProfileImageEnum)[keyof typeof locationHasLogoOrProfileImageEnum];

export const locationHasPendingEditsEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasPendingEditsEnumKey =
  (typeof locationHasPendingEditsEnum)[keyof typeof locationHasPendingEditsEnum];

export const locationHasPhoneEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasPhoneEnumKey =
  (typeof locationHasPhoneEnum)[keyof typeof locationHasPhoneEnum];

export const locationHasServiceEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasServiceEnumKey =
  (typeof locationHasServiceEnum)[keyof typeof locationHasServiceEnum];

export const locationHasServiceWithDescriptionEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasServiceWithDescriptionEnumKey =
  (typeof locationHasServiceWithDescriptionEnum)[keyof typeof locationHasServiceWithDescriptionEnum];

export const locationHasSpecialHoursEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasSpecialHoursEnumKey =
  (typeof locationHasSpecialHoursEnum)[keyof typeof locationHasSpecialHoursEnum];

export const locationHasUtmParamsEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasUtmParamsEnumKey =
  (typeof locationHasUtmParamsEnum)[keyof typeof locationHasUtmParamsEnum];

export const locationHasWebsiteEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHasWebsiteEnumKey =
  (typeof locationHasWebsiteEnum)[keyof typeof locationHasWebsiteEnum];

export type Location = {
  /**
   * @description Account identifier
   * @type string
   */
  account_id: string;
  /**
   * @description Unique location identifier
   * @type string
   */
  location_id: string;
  /**
   * @description Location name
   * @type string
   */
  name: string;
  /**
   * @description Street address
   * @type string
   */
  address: string;
  /**
   * @description City name
   * @type string
   */
  city: string;
  /**
   * @description State or province
   * @type string
   */
  state: string;
  /**
   * @description Country code
   * @type string
   */
  country_code: string;
  /**
   * @description Postal code
   * @type string | undefined
   */
  postal?: string;
  /**
   * @description Latitude coordinate
   * @type number, float
   */
  latitude: number;
  /**
   * @description Longitude coordinate
   * @type number, float
   */
  longitude: number;
  /**
   * @description Primary phone number
   * @type string
   */
  phone_number: string;
  /**
   * @description Additional phone numbers
   * @type array | undefined
   */
  additional_phone_numbers?: string[];
  /**
   * @description Primary business category
   * @type string
   */
  category: string;
  /**
   * @description Additional business categories
   * @type array | undefined
   */
  additional_categories?: string[];
  /**
   * @description Business description
   * @type string | undefined
   */
  description?: string;
  /**
   * @description Website URL
   * @type string | undefined, uri
   */
  website_uri?: string;
  /**
   * @description Average customer rating
   * @type number, float
   */
  average_rating: number;
  /**
   * @description Number of reviews/comments
   * @type integer | undefined
   */
  number_comments?: number;
  /**
   * @description Percentage of reviews replied to
   * @type number | undefined, float
   */
  reply_percentage?: number;
  /**
   * @description Average response time in hours
   * @type number | undefined, float
   */
  average_response_time?: number;
  /**
   * @description Overall location health score
   * @type number, float
   */
  health: number;
  /**
   * @description Attribute health score
   * @type number | undefined, float
   */
  attribute_health?: number;
  /**
   * @description Business attributes
   * @type array | undefined
   */
  attributes?: string[];
  /**
   * @description Whether location is published
   * @type integer
   */
  is_published: LocationIsPublishedEnumKey;
  /**
   * @description Whether location is verified
   * @type integer
   */
  is_verified: LocationIsVerifiedEnumKey;
  /**
   * @description Google Place ID
   * @type string | undefined
   */
  placeId?: string;
  /**
   * @description Store code
   * @type string | undefined
   */
  store_code?: string;
  /**
   * @description Whether has additional categories
   * @type integer | undefined
   */
  has_additional_categories?: LocationHasAdditionalCategoriesEnumKey;
  /**
   * @description Whether has address
   * @type integer | undefined
   */
  has_address?: LocationHasAddressEnumKey;
  /**
   * @description Whether has attributes
   * @type integer | undefined
   */
  has_attributes?: LocationHasAttributesEnumKey;
  /**
   * @description Whether has category
   * @type integer | undefined
   */
  has_category?: LocationHasCategoryEnumKey;
  /**
   * @description Whether has cover image
   * @type integer | undefined
   */
  has_cover_image?: LocationHasCoverImageEnumKey;
  /**
   * @description Whether has description
   * @type integer | undefined
   */
  has_description?: LocationHasDescriptionEnumKey;
  /**
   * @description Whether has exterior image
   * @type integer | undefined
   */
  has_exterior_image?: LocationHasExteriorImageEnumKey;
  /**
   * @description Whether has hours
   * @type integer | undefined
   */
  has_hours?: LocationHasHoursEnumKey;
  /**
   * @description Whether has interior image
   * @type integer | undefined
   */
  has_interior_image?: LocationHasInteriorImageEnumKey;
  /**
   * @description Whether has logo or profile image
   * @type integer | undefined
   */
  has_logo_or_profile_image?: LocationHasLogoOrProfileImageEnumKey;
  /**
   * @description Whether has pending edits
   * @type integer | undefined
   */
  has_pending_edits?: LocationHasPendingEditsEnumKey;
  /**
   * @description Whether has phone
   * @type integer | undefined
   */
  has_phone?: LocationHasPhoneEnumKey;
  /**
   * @description Whether has service
   * @type integer | undefined
   */
  has_service?: LocationHasServiceEnumKey;
  /**
   * @description Whether has service with description
   * @type integer | undefined
   */
  has_service_with_description?: LocationHasServiceWithDescriptionEnumKey;
  /**
   * @description Whether has special hours
   * @type integer | undefined
   */
  has_special_hours?: LocationHasSpecialHoursEnumKey;
  /**
   * @description Whether has UTM parameters
   * @type integer | undefined
   */
  has_utm_params?: LocationHasUtmParamsEnumKey;
  /**
   * @description Whether has website
   * @type integer | undefined
   */
  has_website?: LocationHasWebsiteEnumKey;
  /**
   * @description Regular business hours
   * @type array | undefined
   */
  regular_hours?: object[];
  /**
   * @description Special business hours
   * @type array | undefined
   */
  special_hours?: object[];
};
