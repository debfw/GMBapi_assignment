import type { Pagination } from "./Pagination.ts";
import type { Review } from "./Review.ts";
import type { ReviewSummary } from "./ReviewSummary.ts";

export type ReviewListResponse = {
  /**
   * @type array
   */
  reviews: Review[];
  /**
   * @type object
   */
  pagination: Pagination;
  /**
   * @type object
   */
  summary: ReviewSummary;
};
