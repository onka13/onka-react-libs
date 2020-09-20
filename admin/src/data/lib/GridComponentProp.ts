import { PageField } from './PageField';
import { PageConfig } from './PageConfig';
import { ComponentPropBase } from './ComponentPropBase';

/**
 * Data model for grid components
 */
export class GridComponentProp extends ComponentPropBase {

  public constructor(init?: Partial<GridComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
