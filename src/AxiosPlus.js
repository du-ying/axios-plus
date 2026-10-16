import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosHeaders,
  toFormData,
  formToJSON,
  mergeConfig,
  HttpStatusCode,
} from 'axios';
import qs from 'qs';

export class AxiosPlus {
  baseURL = '';

  urlPrefix = '';

  headers = {};

  timeout = 60000;

  responseType = 'json';

  #interceptors = {
    request: [],
    response: [],
  };

  addRequestInterceptor(fulfilled, rejected) {
    this.#interceptors.request.push({fulfilled, rejected});
  }

  addResponseInterceptor(fulfilled, rejected) {
    this.#interceptors.response.push({fulfilled, rejected});
  }

  validateStatus(status) {
    return status >= 200 && status < 300;
  }

  paramsSerializer(params) {
    return qs.stringify(params, {arrayFormat: 'comma'});
  }

  #init() {
    const instance = axios.create({
      baseURL: this.baseURL,
      headers: this.headers,
      paramsSerializer: this.paramsSerializer,
      timeout: this.timeout,
      responseType: this.responseType,
      validateStatus: this.validateStatus,
    });
    this.#interceptors.request.reverse().forEach(({fulfilled, rejected}) => {
      instance.interceptors.request.use(fulfilled, rejected);
    });
    this.#interceptors.response.forEach(({fulfilled, rejected}) => {
      instance.interceptors.response.use(fulfilled, rejected);
    });
    return instance;
  }

  /**
   * @description 发起 HTTP 请求的主方法
   * @param url {string}
   * @param method {Method} 使用的 HTTP 方法，默认为 GET
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  request(url, method = 'GET', config = {}) {
    return this.#init().request({
      url: this.urlPrefix + url,
      method,
      ...config,
    });
  }

  /**
   * @description 发起 GET 请求
   * @param url {string}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  get(url, config = {}) {
    return this.#init().get(this.urlPrefix + url, config);
  }

  /**
   * @description 发起 DELETE 请求
   * @param url {string}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  delete(url, config = {}) {
    return this.#init().delete(this.urlPrefix + url, config);
  }

  /**
   * @description 发起 HEAD 请求
   * @param url {string}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  head(url, config) {
    return this.#init().head(this.urlPrefix + url, config);
  }

  /**
   * @description 发起 OPTIONS 请求
   * @param url {string}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  options(url, config) {
    return this.#init().options(this.urlPrefix + url, config);
  }

  /**
   * @description 发起 POST 请求
   * @param url {string}
   * @param data {any}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  post(url, data = {}, config = {}) {
    return this.#init().post(this.urlPrefix + url, data, config);
  }

  /**
   * @description 发起 PUT 请求
   * @param url {string}
   * @param data {any}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  put(url, data = {}, config = {}) {
    return this.#init().put(this.urlPrefix + url, data, config);
  }

  /**
   * @description 发起 PATCH 请求
   * @param url {string}
   * @param data {any}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  patch(url, data = {}, config = {}) {
    return this.#init().patch(this.urlPrefix + url, data, config);
  }

  /**
   * @description 发起 QUERY 请求
   * @param url {string}
   * @param data {any}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  query(url, data = {}, config = {}) {
    return this.#init().query(this.urlPrefix + url, data, config);
  }

  /**
   * @description 返回给定配置在不实际发起请求的情况下会发送的 URL
   * @param url {string}
   * @param config {AxiosRequestConfig}
   * @return {string}
   * */
  getUri(url, config = {}) {
    return this.#init().getUri({
      url: this.urlPrefix + url,
      ...config,
    });
  }

  /**
   * @description 等价 post 方法，但会预设 Content-Type 为 multipart/form-data，是上传文件或提交 HTML 表单的推荐方式
   * @param url {string}
   * @param data {any}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  postForm(url, data = {}, config = {}) {
    return this.#init().postForm(this.urlPrefix + url, data, config);
  }

  /**
   * @description 等价 put 方法，但会预设 Content-Type 为 multipart/form-data，是上传文件或提交 HTML 表单的推荐方式
   * @param url {string}
   * @param data {any}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  putForm(url, data = {}, config = {}) {
    return this.#init().putForm(this.urlPrefix + url, data, config);
  }

  /**
   * @description 等价 patch 方法，但会预设 Content-Type 为 multipart/form-data，是上传文件或提交 HTML 表单的推荐方式
   * @param url {string}
   * @param data {any}
   * @param config {AxiosRequestConfig}
   * @return {Promise<AxiosResponse>}
   * */
  patchForm(url, data = {}, config = {}) {
    return this.#init().patchForm(this.urlPrefix + url, data, config);
  }
}

export { AxiosHeaders, toFormData, formToJSON, mergeConfig, HttpStatusCode };