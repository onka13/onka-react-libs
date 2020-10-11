import { FunctionComponent } from 'react';
import { PageFieldBase } from './PageFieldBase';

/**
 * Filter Field model
 */
export class PageFilterField extends PageFieldBase {
  /**
   * filter name
   */
  filterName!: string;

  /**
   * Filter component
   */
  filterComponent!: FunctionComponent<any>;

  public constructor(init?: Partial<PageFilterField>) {
    super(init);
    Object.assign(this, init);
  }
}
