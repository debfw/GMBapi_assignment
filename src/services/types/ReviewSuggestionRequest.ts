export type ReviewSuggestionRequest = {
  /**
   * @description The customer review text to generate suggestions for
   * @minLength 1
   * @type string
   */
  review: string;
};
