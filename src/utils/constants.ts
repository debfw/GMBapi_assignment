export const API_ENDPOINTS = {
  BASE_URL: "http://34.34.4.123",
  REVIEWS: "/reviews",
  LOCATIONS: "/locations",
  ACCOUNT_KPIS: "/account/kpis",
} as const;

export const REVIEW_STATUS = {
  NEW: "new",
  REPLIED: "replied",
  HIDDEN: "hidden",
  FLAGGED: "flagged",
} as const;

export const REVIEW_RATINGS = {
  ONE_STAR: 1,
  TWO_STARS: 2,
  THREE_STARS: 3,
  FOUR_STARS: 4,
  FIVE_STARS: 5,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20, // Conservative limit to avoid 429 errors
  MAX_LIMIT: 100,
} as const;

export const REPLY_LIMITS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 1000,
} as const;
