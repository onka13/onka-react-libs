import { FunctionComponent } from 'react';
import { PageFieldBase } from './PageFieldBase';

/**
 * Field model
 */
export class PageGridField extends PageFieldBase {
  /**
   * Is sortable
   */
  isSortable!: boolean;

  /**
   * Grid component
   */
  gridComponent!: FunctionComponent<any>;

  /**
   * Field data type
   */
  dataType!: 'string' | 'number' | undefined;

  public constructor(init?: Partial<PageGridField>) {
    super(init);
    Object.assign(this, init);
  }
}
