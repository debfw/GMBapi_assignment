import type { LocationHygiene } from "./LocationHygiene.ts";

export type AccountLocationHygieneResponse = {
  /**
   * @description Whether the request was successful
   * @type boolean
   */
  success: boolean;
  /**
   * @type object
   */
  payload: LocationHygiene;
};
