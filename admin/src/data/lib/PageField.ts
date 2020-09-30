import { FunctionComponent } from "react";

export class Reference {
  /**
   * Reference route
   */
  route!: string;

  pageSize?: number = 10;

  sortField?: string;

  sortDirection?: string;

  filterField!: string;
  
  dataField!: string;

  public constructor(init?: Partial<Reference>) {
    Object.assign(this, init);
  }
}

/**
 * Field model
 */
export class PageField {
  /**
   * Field name
   */
  name!: string;

  /**
   * Label
   */
  label!: string;

  /**
   * Enum name
   */
  enumName!: string;

  /**
   * Enum object
   */
  enum!: { [x: string]: any };

  /**
   * filter name
   */
  filterName!: string;

  /**
   * Reference
   */
  reference!: Reference;

  /**
   * Grid component
   */
  gridComponent!: FunctionComponent<any>;

  /**
   * Filter component
   */
  filterComponent!: FunctionComponent<any>;

  /**
   * Update component
   */
  editComponent!: FunctionComponent<any>;

  /**
   * Create component
   */
  createComponent!: FunctionComponent<any>;

  /**
   * Detail component
   */
  detailComponent!: FunctionComponent<any>;

  /**
   * Display in filters
   */
  inFilter!: boolean;

  /**
   * Display in search results
   */
  inGrid!: boolean;

  /**
   * Is sortable
   */
  isSortable!: boolean;

  /**
   * Display in detail page
   */
  inDetail!: boolean;

  /**
   * Display in update page
   */
  isEditable!: boolean;

  /**
   * Display in create page
   */
  isCreatable!: boolean;

  /**
   * Validators
   */
  validators!: any[];

  /**
   * Is Required
   */
  isRequired!: boolean;

  /**
   * Format in grid list
   */
  format!: (row: any, value: any) => string;

  /**
   * Field data type
   */
  dataType!: 'string' | 'number' | undefined;

  prefix?: string;

  public constructor(init?: Partial<PageField>) {
    Object.assign(this, init);
  }
}
