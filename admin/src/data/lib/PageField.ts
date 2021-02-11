import { FunctionComponent } from "react";
import { PageFieldBase } from "./PageFieldBase";
import { PageFieldDepend } from "./Types";

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

  /**
   * Is ReadOnly
   */
  isReadOnly!: boolean;
  isReadOnlyEdit!: boolean;
  isReadOnlyCreate!: boolean;

  depends!: PageFieldDepend[];

  public constructor(init?: Partial<PageField>) {
    super(init);
    Object.assign(this, init);
  }
}
