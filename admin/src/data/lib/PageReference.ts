export class PageReference {
  /**
   * Reference route
   */
  route!: string;

  limit?: number = 20;

  sortField?: string;

  sortDirection?: string;

  filterField!: string;
  
  dataField!: string;

  addAllButton?: boolean;

  treeParentFieldId?: string;
  treeParentFieldName?: string;

  displayParentWithNoChild?: boolean;
  parentIsAddable?: boolean;

  public constructor(init?: Partial<PageReference>) {
    Object.assign(this, init);
  }
}