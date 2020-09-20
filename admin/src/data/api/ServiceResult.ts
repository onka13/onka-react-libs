/**
 * Service result model
 */
export class ServiceResult<T> {
  /**
   * Is success
   */
  success: boolean = false;

  /**
   * Response code
   */
  code: number = 0;

  /**
   * Response message
   */
  message?: string;

  /**
   * Response value
   */
  value?: T;
}

/**
 * Service list result model
 */
export class ServiceListResult<T> extends ServiceResult<T> {
  /**
   * Total item count
   */
  total: number = 0;
}

/**
 * Service http status result
 */
export class ServiceHttpStatusResult<T> extends ServiceListResult<T> {
  /**
   * Response status
   */
  status: number = 0;

  /**
   * Response status text
   */
  statusText?: string;

  public constructor(init?: Partial<ServiceHttpStatusResult<T>>) {
    super();
    Object.assign(this, init);
  }
}
