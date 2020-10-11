import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { PageGridField } from './PageGridFields';

export class GridBulkActionProp {

  /**
   * Configuration data
   */
  pageConfig!: PageConfig;
  
  /**
   * Fields
   */
  gridFields!: PageGridField[];

  /**
   * Data
   */
  data!: any;
  
  selections!: any[];

  public constructor(init?: Partial<GridBulkActionProp>) {
    Object.assign(this, init);
  }
}
