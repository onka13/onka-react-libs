import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { PagePropBase } from './PagePropBase';
import { Parameters } from './Types';
import { HandleChangeType, UseFormResponse } from '../../business/helpers/UseForm';
import { FunctionComponent } from 'react';
import { Subject, BehaviorSubject } from 'rxjs';

export type UpsertPageTemplate = (fieldList: Parameters) => React.ReactNode;

export class UpsertPageViewProp extends PagePropBase {
  pageConfig!: PageConfig;
  fields?: PageField[];
  isEdit?: boolean;
  template?: UpsertPageTemplate;
  form!:UseFormResponse;

  public constructor(init?: Partial<UpsertPageViewProp>) {
    super(init);
    Object.assign(this, init);
  }
}
