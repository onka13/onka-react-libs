import { Subject } from 'rxjs';
import { RequestHelper } from '../helpers/RequestHelper';
import { ConfigService } from './ConfigService';
import { StaticService } from './StaticService';
import { ServiceHttpStatusResult, ServiceListResult } from '../../data/api/ServiceResult';
import { AxiosResponse, Method, AxiosRequestConfig } from 'axios';
import { ApiError } from '../../data/models/ApiError';
import { Parameters } from '../../data/lib/Types';

/**
 * Bridge for request and response
 */
export class BaseBusinessLogicService {
  /**
   * Emit for all api response
   */
  public apiResponse = new Subject<ServiceHttpStatusResult<any>>();
  
  private constructor() {
    this.processResponse = this.processResponse.bind(this);
  }

  private static _instance: BaseBusinessLogicService;
  static instance(): BaseBusinessLogicService {
    if (!this._instance) {
      this._instance = new BaseBusinessLogicService();
    }
    return this._instance;
  }

  getHeaders(headers?: Parameters) {
    if (!headers) headers = {};
    if (StaticService.instance().getToken()) headers[StaticService.TOKEN_NAME] = StaticService.instance().getToken();
    return headers;
  }

  /**
   * Prepare data and parameters then make a request and validate the response
   * @param method method
   * @param endpoint endpoint
   * @param body body
   * @param parameters extra parameters
   * @param headers extra header
   */
  request<T>(
    method: Method,
    endpoint: string,
    body?: any,
    parameters?: Parameters,
    headers?: Parameters,
    options?: AxiosRequestConfig
  ): Promise<ServiceHttpStatusResult<T>> {
    headers = this.getHeaders(headers);

    return RequestHelper.instance(ConfigService.instance().getApiUrl())
      .request<ServiceListResult<T>>(method, endpoint, body, parameters, headers, options)
      .then(this.processResponse)
      .catch(this.processError);
  }

  /**
   * Check response of the api
   * @param response http response object
   */
  processResponse<T>(response: AxiosResponse<ServiceListResult<T>>): Promise<ServiceHttpStatusResult<T>> {
    var result = new ServiceHttpStatusResult<T>({
      status: response.status,
      statusText: response.statusText,
      success: response.data?.success,
      code: response.data?.code,
      message: response.data?.message,
      value: response.data?.value,
      total: response.data?.total,
    });

    this.apiResponse.next(result);

    if (result.status < 200 || result.status >= 300 || !result.success) {
      return Promise.reject(result);
    }

    return Promise.resolve(result);
  }

  processError(reason: any): ServiceHttpStatusResult<any> {
    console.log(reason);

    if (reason instanceof ServiceHttpStatusResult) {
      throw new ApiError(reason);
    }

    var result = new ServiceHttpStatusResult<any>({
      status: 0,
      statusText: reason,
      success: reason.response?.data?.success || false,
      code: reason.response?.data?.code,
      message: reason.response?.data?.message,
      value: reason.response?.data?.value,
      total: reason.response?.data?.total,
    });

    if (reason.response) {
      var json = reason.toJSON();
      console.log('error detail json', json);
      console.log('error detail response', reason.response);
      result.status = reason.response.status;
      result.statusText = reason.response.statusText || reason.response.data;
      result.message = json.message;
    } else if (reason instanceof Error) {
      let error = reason as Error;
      result.message = error.message;
      result.statusText = error.stack;
    }

    if (result.status < 200 || result.status >= 300) {
      throw new ApiError(result);
    }

    return result;
  }
}
