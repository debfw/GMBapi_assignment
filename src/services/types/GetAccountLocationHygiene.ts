import type { AccountLocationHygieneResponse } from "./AccountLocationHygieneResponse.ts";
import type { Error } from "./Error.ts";

export type GetAccountLocationHygienePathParams = {
  /**
   * @description Location Id
   * @type string
   */
  location_id: string;
};

/**
 * @description Successful response with location hygiene
 */
export type GetAccountLocationHygiene200 = AccountLocationHygieneResponse;

/**
 * @description Bad request - invalid input data
 */
export type GetAccountLocationHygiene400 = Error;

/**
 * @description Unauthorized - invalid or missing authentication
 */
export type GetAccountLocationHygiene401 = Error;

/**
 * @description Not found - requested resource does not exist
 */
export type GetAccountLocationHygiene404 = Error;

/**
 * @description Internal server error
 */
export type GetAccountLocationHygiene500 = Error;

export type GetAccountLocationHygieneQueryResponse =
  GetAccountLocationHygiene200;

export type GetAccountLocationHygieneQuery = {
  Response: GetAccountLocationHygiene200;
  PathParams: GetAccountLocationHygienePathParams;
  Errors:
    | GetAccountLocationHygiene400
    | GetAccountLocationHygiene401
    | GetAccountLocationHygiene404
    | GetAccountLocationHygiene500;
};
