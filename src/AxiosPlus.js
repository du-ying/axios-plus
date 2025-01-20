import axios from 'axios'
import qs from 'qs'

export default class AxiosPlus {
  baseURL = '';

  urlPrefix = '';

  headers = {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    delete: {},
    get: {},
    head: {},
    post: {},
    put: {},
    patch: {},
  };

  timeout = 0;

  responseType = 'json';

  #interceptors = {
    request: new Map(),
    response: new Map()
  };

  addInterceptor(type, key, [onFulfilled, onRejected] = []) {
    this.#interceptors[type.toLowerCase()].set(key, [onFulfilled, onRejected]);
  }

  removeInterceptor(type, key) {
    this.#interceptors[type.toLowerCase()].delete(key);
  }

  validateStatus(status) {
    return status >= 200 && status < 300;
  }

  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'comma' });
  }

  onUploadProgress(progressEvent) {}

  onDownloadProgress(progressEvent) {}

  #init() {
    const instance = axios.create({
      baseURL: this.baseURL,
      headers: this.headers,
      paramsSerializer: this.paramsSerializer,
      timeout: this.timeout,
      responseType: this.responseType,
      validateStatus: this.validateStatus,
      onUploadProgress: progressEvent =>  this.onUploadProgress.apply(this, progressEvent),
      onDownloadProgress: progressEvent =>  this.onDownloadProgress.apply(this, progressEvent),
    });
    const types = ['request', 'response'];
    const self = this;
    types.forEach(type => {
      const fns = [...this.#interceptors[type].values()].reverse();
      fns.forEach(function ([onFulfilled, onRejected]) {
        instance.interceptors[type].use(
          onFulfilled && onFulfilled.bind(self),
          onRejected && onRejected.bind(self)
        );
      });
    })
    return instance
  }

  get(url, { params, headers, responseType, baseURL, timeout, urlPrefix } = {}) {
    return this.#init().get(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      { params, headers, responseType, baseURL, timeout },
    );
  }

  delete(url, { params, headers, responseType, baseURL, timeout, urlPrefix, data } = {}) {
    return this.#init().delete(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      { params, headers, responseType, baseURL, timeout, data },
    );
  }

  post(url, { params, headers, responseType, data, baseURL, timeout, urlPrefix } = {}) {
    return this.#init().post(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      data,
      { params, headers, responseType, baseURL, timeout },
    );
  }

  postForm(url, { params, headers, responseType, data, baseURL, timeout, urlPrefix } = {}) {
    return this.#init().postForm(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      data,
      { params, headers, responseType, baseURL, timeout },
    );
  }

  put(url, { params, headers, responseType, data, baseURL, timeout, urlPrefix } = {}) {
    return this.#init().put(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      data,
      { params, headers, responseType, baseURL, timeout },
    );
  }

  putForm(url, { params, headers, responseType, data, baseURL, timeout, urlPrefix } = {}) {
    return this.#init().putForm(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      data,
      { params, headers, responseType, baseURL, timeout },
    );
  }

  patch(url, { params, headers, responseType, data, baseURL, timeout, urlPrefix } = {}) {
    return this.#init().patch(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      data,
      { params, headers, responseType, baseURL, timeout },
    );
  }

  patchForm(url, { params, headers, responseType, data, baseURL, timeout, urlPrefix } = {}) {
    return this.#init().patchForm(
      (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      data,
      { params, headers, responseType, baseURL, timeout },
    );
  }

  getUri(url, { baseURL, params, urlPrefix } = {}) {
    return this.#init().getUri({
      url: (typeof urlPrefix === 'string' ? urlPrefix : this.urlPrefix) + url,
      baseURL,
      params,
    });
  }
}
