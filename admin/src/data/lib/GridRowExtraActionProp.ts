import { UseFormResponse } from '../../business/helpers/UseForm';
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

  form!: UseFormResponse;

  formKey!: string;

  /**
   * update all data
   */
  updateData!: (value: any, total?: number) => void;

  /**
   * update the row data
   */
  updateRowData!: (value: any) => void;

  public constructor(init?: Partial<GridRowExtraActionProp>) {
    Object.assign(this, init);
  }
}
