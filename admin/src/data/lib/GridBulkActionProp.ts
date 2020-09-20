import { PageField } from './PageField';
import { PageConfig } from './PageConfig';

export class GridBulkActionProp {

  /**
   * Configuration data
   */
  pageConfig!: PageConfig;
  
  /**
   * Fields
   */
  fields!: PageField[];

  /**
   * Data
   */
  data!: any;
  
  selections!: any[];

  public constructor(init?: Partial<GridBulkActionProp>) {
    Object.assign(this, init);
  }
}
