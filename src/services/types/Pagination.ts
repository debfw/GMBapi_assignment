export type Pagination = {
  /**
   * @description Current page number
   * @minLength 1
   * @type integer
   */
  page: number;
  /**
   * @description Number of items per page
   * @minLength 1
   * @type integer
   */
  limit: number;
  /**
   * @description Total number of items
   * @minLength 0
   * @type integer
   */
  total: number;
  /**
   * @description Total number of pages
   * @minLength 0
   * @type integer
   */
  totalPages: number;
  /**
   * @description Whether there is a next page
   * @type boolean | undefined
   */
  hasNext?: boolean;
  /**
   * @description Whether there is a previous page
   * @type boolean | undefined
   */
  hasPrev?: boolean;
};
