import type { Review } from "./Review.ts";
import type { ReviewReply } from "./ReviewReply.ts";

export type ReviewReplyResponse = {
  /**
   * @type object
   */
  reply: ReviewReply;
  /**
   * @type object
   */
  review: Review;
};
