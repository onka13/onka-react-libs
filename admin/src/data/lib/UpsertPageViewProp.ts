import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { PagePropBase } from './PagePropBase';
import { Parameters } from './Types';
import { HandleChangeType } from '../../business/helpers/UseForm';
import { FunctionComponent } from 'react';
import { Subject, BehaviorSubject } from 'rxjs';

export type UpsertPageTemplate = (fieldList: Parameters) => React.ReactNode;

export class UpsertPageViewProp extends PagePropBase {
  pageConfig!: PageConfig;
  fields?: PageField[];
  handleSubmit!: (e: any) => void;
  isEdit?: boolean;
  onChange?: (values: Parameters) => void;
  handleChanges!: (values: HandleChangeType[]) => void;
  formData!: Parameters;
  errors!: Parameters;
  template?: UpsertPageTemplate;
  subject?: Subject<Parameters>;

  public constructor(init?: Partial<UpsertPageViewProp>) {
    super(init);
    Object.assign(this, init);
  }
}
