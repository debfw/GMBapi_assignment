export const locationAttributeValueTypeEnum = {
  BOOL: "BOOL",
  REPEATED_ENUM: "REPEATED_ENUM",
} as const;

export type LocationAttributeValueTypeEnumKey =
  (typeof locationAttributeValueTypeEnum)[keyof typeof locationAttributeValueTypeEnum];

export type LocationAttribute = {
  /**
   * @description Attribute name
   * @type string
   */
  name: string;
  /**
   * @description Boolean values for the attribute
   * @type array | undefined
   */
  values?: boolean[];
  /**
   * @type object | undefined
   */
  repeatedEnumValue?: {
    /**
     * @type array | undefined
     */
    setValues?: string[];
  };
  /**
   * @description Type of the attribute value
   * @type string
   */
  valueType: LocationAttributeValueTypeEnumKey;
};
