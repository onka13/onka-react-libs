import { PageField } from './PageField';

/**
 * Page configuration model
 */
export class PageConfig {
  /**
   * Menu name
   */
  menu!: string;

  /**
   * Menu order
   */
  menuOrder!: number;

  /**
   * Route
   */
  route!: string;

  /**
   * Module key
   */
  moduleKey!: string;

  /**
   * Page key
   */
  pageKey!: string;

  /**
   * Hide menu
   */
  hideMenu!: boolean;

  /**
   * Is detail enabled
   */
  get!: boolean;

  /**
   * Is edit enabled
   */
  edit!: boolean;

  /**
   * Is create enabled
   */
  new!: boolean;

  /**
   * Is delete enabled
   */
  delete!: boolean;

  /**
   * Is export enabled
   */
  export!: boolean;

  /**
   * Primary keys
   */
  primaryKeys!: string[];

  /**
   * Field list
   */
  fields!: PageField[];

  public constructor(init?: Partial<PageConfig>) {
    Object.assign(this, init);
  }
}