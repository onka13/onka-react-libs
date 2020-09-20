import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { PagePropBase } from './PagePropBase';
import { ServiceResult } from '../api/ServiceResult';
import { Parameters } from './Types';

export class UpsertPageProp extends PagePropBase {
  pageConfig!: PageConfig;
  fields?: PageField[];
  initialValues?: any;
  loadData?: () => Promise<ServiceResult<any>>;
  onSubmit?: (data: Parameters) => void;
  isEdit?: boolean;
  columnCount?: number;
  
  public constructor(init?: Partial<UpsertPageProp>) {
    super(init);
    Object.assign(this, init);
  }
}
