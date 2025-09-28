import type { ReviewReply } from "./ReviewReply.ts";

export const reviewStatusEnum = {
  new: "new",
  replied: "replied",
  hidden: "hidden",
  flagged: "flagged",
} as const;

export type ReviewStatusEnumKey =
  (typeof reviewStatusEnum)[keyof typeof reviewStatusEnum];

export type Review = {
  /**
   * @description Unique identifier for the review
   * @type string
   */
  id: string;
  /**
   * @description Name of the customer who left the review
   * @type string
   */
  customerName: string;
  /**
   * @description URL to customer\'s profile photo
   * @type string | undefined, uri
   */
  customerPhoto?: string;
  /**
   * @description Star rating (1-5)
   * @minLength 1
   * @maxLength 5
   * @type integer
   */
  rating: number;
  /**
   * @description Review text content
   * @type string
   */
  comment: string;
  /**
   * @description Date when the review was posted
   * @type string, date-time
   */
  date: string;
  /**
   * @description ID of the location this review is for
   * @type string
   */
  locationId: string;
  /**
   * @description Name of the location
   * @type string | undefined
   */
  locationName?: string;
  /**
   * @description Current status of the review
   * @type string
   */
  status: ReviewStatusEnumKey;
  /**
   * @type object | undefined
   */
  businessReply?: ReviewReply;
  /**
   * @description Number of helpful votes
   * @minLength 0
   * @type integer | undefined
   */
  helpfulVotes?: number;
  /**
   * @description URLs to photos attached to the review
   * @type array | undefined
   */
  photos?: string[];
};
