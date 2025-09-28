import type { AccountLocationProfileData } from "./AccountLocationProfileData.ts";
import type { LocationAttributes } from "./LocationAttributes.ts";
import type { LocationHygiene } from "./LocationHygiene.ts";

export type AccountLocationProfileResponse = {
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
     * @type object
     */
    data: AccountLocationProfileData;
    /**
     * @type object
     */
    attributes: LocationAttributes;
    /**
     * @type object
     */
    hygiene: LocationHygiene;
  };
};
