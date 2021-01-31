import { PageField } from './PageField';
import { PageConfig } from './PageConfig';

export class ComponentPropBase {

  key:any;

  /**
   * Configuration data
   */
  pageConfig!: PageConfig;

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

  path!: string;

  public constructor(init?: Partial<ComponentPropBase>) {
    Object.assign(this, init);
  }
}
