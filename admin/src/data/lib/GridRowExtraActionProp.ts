import { PageField } from './PageField';
import { PageConfig } from './PageConfig';

export class GridRowExtraActionProp {

  key:any;

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
  
  /**
   * Row Data
   */
  rowData!: any;

  public constructor(init?: Partial<GridRowExtraActionProp>) {
    Object.assign(this, init);
  }
}
