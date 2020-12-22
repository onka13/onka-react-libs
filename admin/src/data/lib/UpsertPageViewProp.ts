import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { PagePropBase } from './PagePropBase';
import { ServiceResult } from '../api/ServiceResult';
import { Parameters } from './Types';
import { HandleChangeType } from '../../business/helpers/UseForm';

export class UpsertPageViewProp extends PagePropBase {
  pageConfig!: PageConfig;
  fields?: PageField[];
  handleSubmit!: (e: any) => void;
  isEdit?: boolean;
  onChange?: (values: Parameters) => void;
  handleChanges!: (values: HandleChangeType[]) => void;
  formData!: Parameters;
  errors!: Parameters;
  
  public constructor(init?: Partial<UpsertPageViewProp>) {
    super(init);
    Object.assign(this, init);
  }
}
