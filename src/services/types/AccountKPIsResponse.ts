export type AccountKPIsResponse = {
  /**
   * @description Whether the request was successful
   * @type boolean
   */
  success: boolean;
  /**
   * @type object
   */
  payload: {
    /**
     * @description Average rating across all reviews
     * @type number, float
     */
    average_rating: number | null;
    /**
     * @description Total number of reviews with comments
     * @minLength 0
     * @type integer
     */
    number_of_comments: number;
    /**
     * @description Percentage of reviews that have been replied to
     * @type number, float
     */
    reply_percentage: number | null;
    /**
     * @description Average response time in hours
     * @minLength 0
     * @type integer
     */
    response_time: number;
    /**
     * @description Total number of ratings
     * @minLength 0
     * @type integer
     */
    number_ratings: number;
  };
};
