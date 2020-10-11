export class PageReference {
  /**
   * Reference route
   */
  route!: string;

  pageSize?: number = 10;

  sortField?: string;

  sortDirection?: string;

  filterField!: string;
  
  dataField!: string;

  public constructor(init?: Partial<PageReference>) {
    Object.assign(this, init);
  }
}