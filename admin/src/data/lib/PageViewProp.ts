import { PagePropBase } from './PagePropBase';

export class PageViewProp extends PagePropBase {
  data?: any;

  public constructor(init?: Partial<PageViewProp>) {
    super(init);
    Object.assign(this, init);
  }
}
