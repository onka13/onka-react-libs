import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { PagePropBase } from './PagePropBase';
import { ServiceResult } from '../api/ServiceResult';
import { Parameters } from './Types';

export class UpsertPageViewProp extends PagePropBase {
  pageConfig!: PageConfig;
  fields?: PageField[];
  initialValues?: any;
  onSubmit!: (data: Parameters) => void;
  isEdit?: boolean;
  onChange?: (values: Parameters) => void;
  
  public constructor(init?: Partial<UpsertPageViewProp>) {
    super(init);
    Object.assign(this, init);
  }
}
