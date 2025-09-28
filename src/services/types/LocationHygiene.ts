export const locationHygieneIsVerifiedEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneIsVerifiedEnumKey =
  (typeof locationHygieneIsVerifiedEnum)[keyof typeof locationHygieneIsVerifiedEnum];

export const locationHygieneIsPublishedEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneIsPublishedEnumKey =
  (typeof locationHygieneIsPublishedEnum)[keyof typeof locationHygieneIsPublishedEnum];

export const locationHygieneHasPhoneEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasPhoneEnumKey =
  (typeof locationHygieneHasPhoneEnum)[keyof typeof locationHygieneHasPhoneEnum];

export const locationHygieneHasWebsiteEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasWebsiteEnumKey =
  (typeof locationHygieneHasWebsiteEnum)[keyof typeof locationHygieneHasWebsiteEnum];

export const locationHygieneHasAddressEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasAddressEnumKey =
  (typeof locationHygieneHasAddressEnum)[keyof typeof locationHygieneHasAddressEnum];

export const locationHygieneHasHoursEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasHoursEnumKey =
  (typeof locationHygieneHasHoursEnum)[keyof typeof locationHygieneHasHoursEnum];

export const locationHygieneHasSpecialHoursEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasSpecialHoursEnumKey =
  (typeof locationHygieneHasSpecialHoursEnum)[keyof typeof locationHygieneHasSpecialHoursEnum];

export const locationHygieneHasCategoryEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasCategoryEnumKey =
  (typeof locationHygieneHasCategoryEnum)[keyof typeof locationHygieneHasCategoryEnum];

export const locationHygieneHasAdditionalCategoriesEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasAdditionalCategoriesEnumKey =
  (typeof locationHygieneHasAdditionalCategoriesEnum)[keyof typeof locationHygieneHasAdditionalCategoriesEnum];

export const locationHygieneHasAttributesEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasAttributesEnumKey =
  (typeof locationHygieneHasAttributesEnum)[keyof typeof locationHygieneHasAttributesEnum];

export const locationHygieneHasDescriptionEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasDescriptionEnumKey =
  (typeof locationHygieneHasDescriptionEnum)[keyof typeof locationHygieneHasDescriptionEnum];

export const locationHygieneHasCoverImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasCoverImageEnumKey =
  (typeof locationHygieneHasCoverImageEnum)[keyof typeof locationHygieneHasCoverImageEnum];

export const locationHygieneHasLogoOrProfileImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasLogoOrProfileImageEnumKey =
  (typeof locationHygieneHasLogoOrProfileImageEnum)[keyof typeof locationHygieneHasLogoOrProfileImageEnum];

export const locationHygieneHasInteriorImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasInteriorImageEnumKey =
  (typeof locationHygieneHasInteriorImageEnum)[keyof typeof locationHygieneHasInteriorImageEnum];

export const locationHygieneHasExteriorImageEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasExteriorImageEnumKey =
  (typeof locationHygieneHasExteriorImageEnum)[keyof typeof locationHygieneHasExteriorImageEnum];

export const locationHygieneHasServiceWithDescriptionEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasServiceWithDescriptionEnumKey =
  (typeof locationHygieneHasServiceWithDescriptionEnum)[keyof typeof locationHygieneHasServiceWithDescriptionEnum];

export const locationHygieneHasServiceEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasServiceEnumKey =
  (typeof locationHygieneHasServiceEnum)[keyof typeof locationHygieneHasServiceEnum];

export const locationHygieneHasUtmParamsEnum = {
  "0": 0,
  "1": 1,
} as const;

export type LocationHygieneHasUtmParamsEnumKey =
  (typeof locationHygieneHasUtmParamsEnum)[keyof typeof locationHygieneHasUtmParamsEnum];

export type LocationHygiene = {
  /**
   * @description Location identifier
   * @type string
   */
  location_id: string;
  /**
   * @description Whether location is verified
   * @type integer
   */
  is_verified: LocationHygieneIsVerifiedEnumKey;
  /**
   * @description Whether location is published
   * @type integer
   */
  is_published: LocationHygieneIsPublishedEnumKey;
  /**
   * @description Whether has phone
   * @type integer
   */
  has_phone: LocationHygieneHasPhoneEnumKey;
  /**
   * @description Whether has website
   * @type integer
   */
  has_website: LocationHygieneHasWebsiteEnumKey;
  /**
   * @description Whether has address
   * @type integer
   */
  has_address: LocationHygieneHasAddressEnumKey;
  /**
   * @description Whether has hours
   * @type integer
   */
  has_hours: LocationHygieneHasHoursEnumKey;
  /**
   * @description Whether has special hours
   * @type integer
   */
  has_special_hours: LocationHygieneHasSpecialHoursEnumKey;
  /**
   * @description Whether has category
   * @type integer
   */
  has_category: LocationHygieneHasCategoryEnumKey;
  /**
   * @description Whether has additional categories
   * @type integer
   */
  has_additional_categories: LocationHygieneHasAdditionalCategoriesEnumKey;
  /**
   * @description Whether has attributes
   * @type integer
   */
  has_attributes: LocationHygieneHasAttributesEnumKey;
  /**
   * @description Whether has description
   * @type integer
   */
  has_description: LocationHygieneHasDescriptionEnumKey;
  /**
   * @description Whether has cover image
   * @type integer
   */
  has_cover_image: LocationHygieneHasCoverImageEnumKey;
  /**
   * @description Whether has logo or profile image
   * @type integer
   */
  has_logo_or_profile_image: LocationHygieneHasLogoOrProfileImageEnumKey;
  /**
   * @description Whether has interior image
   * @type integer
   */
  has_interior_image: LocationHygieneHasInteriorImageEnumKey;
  /**
   * @description Whether has exterior image
   * @type integer
   */
  has_exterior_image: LocationHygieneHasExteriorImageEnumKey;
  /**
   * @description Whether has service with description
   * @type integer
   */
  has_service_with_description: LocationHygieneHasServiceWithDescriptionEnumKey;
  /**
   * @description Whether has service
   * @type integer
   */
  has_service: LocationHygieneHasServiceEnumKey;
  /**
   * @description Whether has UTM parameters
   * @type integer
   */
  has_utm_params: LocationHygieneHasUtmParamsEnumKey;
  /**
   * @description Overall location health score
   * @type number, float
   */
  health: number;
};
