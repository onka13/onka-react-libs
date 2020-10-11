import { PageReference } from "./PageReference";

/**
 * Field base model
 */
export class PageFieldBase {
  /**
   * Field name
   */
  name!: string;

  /**
   * Label
   */
  label!: string;

  /**
   * Enum name
   */
  enumName!: string;

  /**
   * Enum object
   */
  enum!: { [x: string]: any };

  /**
   * Reference
   */
  reference!: PageReference;

  prefix?: string;

  public constructor(init?: Partial<PageFieldBase>) {
    Object.assign(this, init);
  }
}
