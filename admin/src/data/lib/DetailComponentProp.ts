import { PageField } from './PageField';
import { ComponentPropBase } from './ComponentPropBase';

export class DetailComponentProp extends ComponentPropBase {

  /**
   * Field
   */
  field!: PageField;

  /**
   * Fields
   */
  fields!: PageField[];  

    /**
   * Data
   */
  data!: any;
  
  /**
   * Row Data
   */
  rowData!: any;

  isLink!: boolean;

  public constructor(init?: Partial<DetailComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
