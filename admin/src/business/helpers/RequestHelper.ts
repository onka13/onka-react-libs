import axios, { Method, AxiosRequestConfig, AxiosPromise, AxiosInstance } from 'axios';
import { Parameters } from '../../data/lib/Types';

/**
 * default http parameters
 */
const httpOptions = {
  timeout: 60000,
  uploadTimeout: 300000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const defaultRequestOptions: AxiosRequestConfig = {
  withCredentials: true,
};

/**
 * A httpClient helper
 */
export class RequestHelper {
  /**
   * Base Url
   */
  URL: string;
  private constructor(url: string) {
    this.URL = url;
  }

  static instance(url: string): RequestHelper {
    return new RequestHelper(url);
  }

  /**
   * make a request to url
   * @param method method type
   * @param endpoint endpoint address
   * @param data is the data to be sent as the request body
   * @param parameters are the URL parameters to be sent with the request
   * @param headers headers
   */
  request<T>(method: Method, endpoint: string, data?: any, parameters?: Parameters, headers?: Parameters, options?: AxiosRequestConfig): AxiosPromise<T> {
    if (!options) options = {};
    if (!options.params) options.params = {};
    if (!options.headers) options.headers = {};

    if (parameters) {
      for (const key in parameters) {
        options.params[key] = parameters[key];
      }
    }
    if (!headers) {
      headers = {};
    }
    var timeout = httpOptions.timeout;
    if (data && data.isFileUpload) {
      // var formData = new FormData();
      // for (const key in data) {
      //   formData.append(key, data[key]);
      // }
      // data = formData;
      data = this._convertModelToFormData(data, '');
      headers['Content-Type'] = 'multipart/form-data';
      timeout = 0;
    }
    options = {
      ...{
        method: method,
        url: endpoint,
        baseURL: this.URL,
        data: data,
        timeout: timeout,
      },
      ...defaultRequestOptions,
      ...options,
    };
    console.log('REQUEST', method, endpoint);
    console.log('REQUEST OPTIONS', options);
    var axiosInstance = axios.create({
      headers,
    });
    return axiosInstance.request(options);
  }

  _getFormDataKey(key0: any, key1: any): string {
    return !key0 ? key1 : `${key0}[${key1}]`;
  }
  _convertModelToFormData(model: any, key: string, frmData?: FormData): FormData {
    let formData = frmData || new FormData();

    if (!model) return formData;

    if (model instanceof Date) {
      formData.append(key, model.toISOString());
    } else if (model instanceof Array) {
      model.forEach((element: any, i: number) => {
        this._convertModelToFormData(element, this._getFormDataKey(key, i), formData);
      });
    } else if (typeof model === 'object' && !(model instanceof File)) {
      for (let propertyName in model) {
        if (!model.hasOwnProperty(propertyName) || !model[propertyName]) continue;
        this._convertModelToFormData(model[propertyName], this._getFormDataKey(key, propertyName), formData);
      }
    } else {
      formData.append(key, model);
    }

    return formData;
  }
}
