import axios, { Method, AxiosRequestConfig, AxiosPromise } from "axios";
import { Parameters } from "../../data/lib/Types";

/**
 * default http parameters
 */
const httpOptions = {
  timeout: 60000,
  uploadTimeout: 300000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
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
  request<T>(method: Method, endpoint: string, data?: any, parameters?: Parameters, headers?: Parameters, options?: AxiosRequestConfig) : AxiosPromise<T> {
    if (!options) options = {};
    if (!options.params) options.params = {};
    if (!options.headers) options.headers = {};

    if (parameters) {
      for (const key in parameters) {
        options.params[key] = parameters[key];
      }
    }
    if (headers) {
      for (const key in headers) {
        options.headers[key] = headers[key];
      }
    }
    options = {
      ...{
        method: method,
        url: endpoint,
        baseURL: this.URL,
        data: data,
        timeout: httpOptions.timeout,
      },
      ...options,
    };
    console.log("REQUEST", method, endpoint);
    console.log("REQUEST OPTIONS", options);
    return axios(options);
  }
}
