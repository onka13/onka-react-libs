import { PageField } from './PageField';
import { ComponentPropBase } from './ComponentPropBase';

export class DetailComponentProp extends ComponentPropBase {

  public constructor(init?: Partial<DetailComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
