import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { ReactNode } from 'react';

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

  icon?: JSX.Element;

  fields!: PageField[];

  public constructor(init?: Partial<PageTab>) {
    Object.assign(this, init);
  }
}
