import { FunctionComponent } from "react";
import { PageFieldBase } from "./PageFieldBase";

/**
 * Field model
 */
export class PageField extends PageFieldBase {
  /**
   * Update component
   */
  editComponent!: FunctionComponent<any>;

  /**
   * Create component
   */
  createComponent!: FunctionComponent<any>;

  /**
   * Detail component
   */
  detailComponent!: FunctionComponent<any>;

  /**
   * Filter Component
   */
  filterComponent!: FunctionComponent<any>;

  /**
   * Display in detail page
   */
  displayInDetail!: boolean;

  /**
   * Display in update page
   */
  displayInEdit!: boolean;

  /**
   * Display in create page
   */
  displayInCreate!: boolean;

  /**
   * Validators
   */
  validators!: any[];

  /**
   * Is Required
   */
  isRequired!: boolean;

  /**
   * Grid size
   */
  fieldSize!: number;

  public constructor(init?: Partial<PageField>) {
    super(init);
    Object.assign(this, init);
  }
}
