import axios from 'axios'
import qs from 'qs'

export default class AxiosPlus {
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

  get(url, {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress} = {}) {
    return this.#init().get(
      this.urlPrefix + url,
      {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress}
    );
  }

  delete(url, {params, headers, responseType, timeout} = {}) {
    return this.#init().delete(
      this.urlPrefix + url,
      {params, headers, responseType, timeout}
    );
  }

  post(url, {params, headers, responseType, data, timeout, onUploadProgress, onDownloadProgress} = {}) {
    return this.#init().post(
      this.urlPrefix + url,
      data,
      {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress}
    );
  }

  postForm(url, {params, headers, responseType, data, timeout, onUploadProgress, onDownloadProgress} = {}) {
    return this.#init().postForm(
      this.urlPrefix + url,
      data,
      {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress}
    );
  }

  put(url, {params, headers, responseType, data, timeout, onUploadProgress, onDownloadProgress} = {}) {
    return this.#init().put(
      this.urlPrefix + url,
      data,
      {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress}
    );
  }

  putForm(url, {params, headers, responseType, data, timeout, onUploadProgress, onDownloadProgress} = {}) {
    return this.#init().putForm(
      this.urlPrefix + url,
      data,
      {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress}
    );
  }

  patch(url, {params, headers, responseType, data, timeout, onUploadProgress, onDownloadProgress} = {}) {
    return this.#init().patch(
      this.urlPrefix + url,
      data,
      {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress}
    );
  }

  patchForm(url, {params, headers, responseType, data, timeout, onUploadProgress, onDownloadProgress} = {}) {
    return this.#init().patchForm(
      this.urlPrefix + url,
      data,
      {params, headers, responseType, timeout, onUploadProgress, onDownloadProgress}
    );
  }

  getUri(url, {params} = {}) {
    return this.#init().getUri({url: this.urlPrefix + url, params});
  }
}
