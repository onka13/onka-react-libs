import { PageConfig } from './PageConfig';
import { PageGridField } from './PageGridFields';

export class GridRowExtraActionProp {

  key:any;

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
  
  /**
   * Row Data
   */
  rowData!: any;

  public constructor(init?: Partial<GridRowExtraActionProp>) {
    Object.assign(this, init);
  }
}
