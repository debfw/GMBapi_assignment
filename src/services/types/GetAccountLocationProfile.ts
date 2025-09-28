import type { AccountLocationProfileResponse } from "./AccountLocationProfileResponse.ts";
import type { Error } from "./Error.ts";

export type GetAccountLocationProfilePathParams = {
  /**
   * @description Location Id
   * @type string
   */
  location_id: string;
};

/**
 * @description Successful response with location profile
 */
export type GetAccountLocationProfile200 = AccountLocationProfileResponse;

/**
 * @description Bad request - invalid input data
 */
export type GetAccountLocationProfile400 = Error;

/**
 * @description Unauthorized - invalid or missing authentication
 */
export type GetAccountLocationProfile401 = Error;

/**
 * @description Not found - requested resource does not exist
 */
export type GetAccountLocationProfile404 = Error;

/**
 * @description Internal server error
 */
export type GetAccountLocationProfile500 = Error;

export type GetAccountLocationProfileQueryResponse =
  GetAccountLocationProfile200;

export type GetAccountLocationProfileQuery = {
  Response: GetAccountLocationProfile200;
  PathParams: GetAccountLocationProfilePathParams;
  Errors:
    | GetAccountLocationProfile400
    | GetAccountLocationProfile401
    | GetAccountLocationProfile404
    | GetAccountLocationProfile500;
};
