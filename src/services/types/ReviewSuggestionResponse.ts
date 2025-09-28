export type ReviewSuggestionResponse = {
  /**
   * @type array
   */
  msg: {
    /**
     * @description Index of the message
     * @type integer
     */
    index: number;
    /**
     * @type object
     */
    message: {
      /**
       * @description Role of the message sender
       * @type string
       */
      role: string;
      /**
       * @description AI-generated reply suggestion for the review
       * @type string
       */
      content: string;
      /**
       * @description Additional annotations
       * @type array | undefined
       */
      annotations?: object[];
      /**
       * @description Refusal reason if any
       * @type string
       */
      refusal?: string | null;
    };
    /**
     * @description Log probabilities
     * @type string
     */
    logprobs: string | null;
    /**
     * @description Reason for finishing the response
     * @type string
     */
    finish_reason: string;
  }[];
};
