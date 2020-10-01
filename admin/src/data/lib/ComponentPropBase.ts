import { PageField } from './PageField';
import { PageConfig } from './PageConfig';

export class ComponentPropBase {

  key:any;

  /**
   * Configuration data
   */
  pageConfig!: PageConfig;

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

  readonly?: boolean;

  className?: string;

  public constructor(init?: Partial<ComponentPropBase>) {
    Object.assign(this, init);
  }
}
