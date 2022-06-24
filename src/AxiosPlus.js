import axios from 'axios'
import qs from 'qs'

export default class AxiosPlus {
  baseURL = ''

  urlPrefix = ''

  headers = {}

  timeout = 60000

  responseType = 'json'

  #interceptors = {
    request: new Map(),
    response: new Map()
  }

  addInterceptor (type, key, [onFulfilled, onRejected] = []) {
    this.#interceptors[type.toLowerCase()].set(key, [onFulfilled, onRejected])
  }

  removeInterceptor (type, key) {
    this.#interceptors[type.toLowerCase()].delete(key)
  }

  validateStatus (status) {
    return status >= 200 && status < 300
  }

  paramsSerializer (params) {
    return qs.stringify(params, { arrayFormat: 'comma' })
  }

  #init () {
    const instance = axios.create({
      baseURL: this.baseURL,
      headers: this.headers,
      paramsSerializer: this.paramsSerializer,
      timeout: this.timeout,
      responseType: this.responseType,
      validateStatus: this.validateStatus
    })
    const types = ['request', 'response']
    const self = this
    types.forEach(type => {
      const fns = [...this.#interceptors[type].values()].reverse()
      fns.forEach(function ([onFulfilled, onRejected]) {
        instance.interceptors[type].use(
          onFulfilled && onFulfilled.bind(self),
          onRejected && onRejected.bind(self)
        )
      })
    })
    return instance
  }

  get (url, { params, headers, responseType } = {}) {
    return this.#init().get(this.urlPrefix + url, { params, headers, responseType })
  }

  delete (url, { params, headers, responseType } = {}) {
    return this.#init().delete(this.urlPrefix + url, { params, headers, responseType })
  }

  post (url, { params, headers, responseType, data } = {}) {
    return this.#init().post(this.urlPrefix + url, data, { params, headers, responseType })
  }

  put (url, { params, headers, responseType, data } = {}) {
    return this.#init().put(this.urlPrefix + url, data, { params, headers, responseType })
  }

  patch (url, { params, headers, responseType, data } = {}) {
    return this.#init().patch(this.urlPrefix + url, data, { params, headers, responseType })
  }
}
