import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { PagePropBase } from './PagePropBase';
import { Parameters } from './Types';
import { UseFormResponse } from '../../business/helpers/UseForm';

export type UpsertPageTemplate = (fieldList: Parameters) => React.ReactNode;

export class UpsertPageViewProp extends PagePropBase {
  formKey!: string;
  pageConfig!: PageConfig;
  fields?: PageField[];
  isEdit?: boolean;
  template?: UpsertPageTemplate;
  form!:UseFormResponse;
  loading?: Boolean;

  public constructor(init?: Partial<UpsertPageViewProp>) {
    super(init);
    Object.assign(this, init);
  }
}
