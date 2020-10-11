import { ComponentPropBase } from './ComponentPropBase';
import { PageGridField } from './PageGridFields';

/**
 * Data model for grid components
 */
export class GridComponentProp extends ComponentPropBase {
  /**
   * Field
   */
  gridField!: PageGridField;  

  /**
   * Fields
   */
  gridFields!: PageGridField[];  

  public constructor(init?: Partial<GridComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
