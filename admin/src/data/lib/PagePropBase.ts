import { PageField } from './PageField';
import { PageConfig } from './PageConfig';

export class PagePropBase {
  key?: any;

  pageConfig!: PageConfig;

  fields?: PageField[];

  tabs?: PageTab[];

  public constructor(init?: Partial<PagePropBase>) {
    Object.assign(this, init);
  }
}

export class PageTab {
  label!: string;

  icon?: string;

  fields!: PageField[];

  public constructor(init?: Partial<PageTab>) {
    Object.assign(this, init);
  }
}
