import { PageField } from './PageField';
import { PageConfig } from './PageConfig';

export class ComponentPropBase {

  key:any;

  /**
   * Configuration data
   */
  pageConfig!: PageConfig;

  readonly?: boolean;

  className?: string;

  path!: string;

  formKey!: string;

  public constructor(init?: Partial<ComponentPropBase>) {
    Object.assign(this, init);
  }
}
