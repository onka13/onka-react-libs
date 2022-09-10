import { BaseBusinessLogicService } from "./BaseBusinessLogic";
import { ApiSearchRequest } from "../../data/api/ApiRequest";
import { ServiceListResult, ServiceResult } from "../../data/api/ServiceResult";
import { Method } from "axios";
import { Parameters } from '../../data/lib/Types';

/**
 * Api Business Logic
 */
export class ApiBusinessLogic {
  private business!: BaseBusinessLogicService;

  constructor() {
    this.business = BaseBusinessLogicService.instance();
  }

  /**
   * Search data
   * @param route route
   * @param request post data
   */
  search(route: string, request: ApiSearchRequest): Promise<ServiceListResult<any>> {
    return this.business.request<ServiceListResult<any>>("POST", `${route}/all`, request);
  }

  /**
   * Get detail of the entity
   * @param route route
   * @param id id of item
   */
  get(route: any, id: any): Promise<ServiceResult<any>> {
    return this.business.request<ServiceResult<any>>("GET", `${route}/get/${id}`);
  }

  /**
   * Gets key-value list
   * @param route route
   * @param id id of item
   */
  gets(route: any, ids: any[]): Promise<ServiceResult<any>> {
    return this.business.request<ServiceResult<any>>("POST", `${route}/gets`, ids);
  }

  /**
   * Create new entity
   * @param route route
   * @param data entity data
   */
  new(route: any, data: any): Promise<ServiceResult<any>> {
    return this.business.request<ServiceResult<any>>("POST", `${route}/new`, data);
  }

  /**
   * Update entity
   * @param route route
   * @param data entity data
   */
  update(route: any, data: any): Promise<ServiceResult<any>> {
    return this.business.request<ServiceResult<any>>("POST", `${route}/update`, data);
  }
  
  /**
   * Update entity
   * @param route route
   * @param data entity data
   */
  updateOnly(route: any, data: any): Promise<ServiceResult<any>> {
    return this.business.request<ServiceResult<any>>("POST", `${route}/updateOnly`, data);
  }

  /**
   * Update or Create entity
   * @param isEdit true if it's update
   * @param route route
   * @param data entity data
   */
  upsert(isEdit: boolean, route: any, data: any): Promise<ServiceResult<any>> {
    return isEdit ? this.update(route, data) : this.new(route, data);
  }

  /**
   * delete entity
   * @param route route
   * @param id entity id
   */
  delete(route: any, id: any): Promise<ServiceResult<any>> {
    return this.business.request<ServiceResult<any>>("DELETE", `${route}/delete/${id}`);
  }

  request(method: Method, route: string, data: any,  parameters?: Parameters, headers?: Parameters): Promise<ServiceResult<any>> {
    return this.business.request<ServiceResult<any>>(method, route, data, parameters, headers);
  }
}
