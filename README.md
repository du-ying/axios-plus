# axios-plus

## 安装
```
npm install @duying/axios-plus
```

## 示例
#### Http.js文件
```javascript
import AxiosPlus from '@duying/axios-plus'

export default class Http extends AxiosPlus {
  baseURL = 'https://some-domain.com/api'

  urlPrefix = '/a'

  headers = {
    'custom-name': 'hello',
    'custom-age': 18
  }

  constructor () {
    super()
    this.addCustomInterceptors()
  }

  addCustomInterceptors () {
    // 添加请求拦截器
    this.addRequestInterceptor(
      function (config) {
        // 在发送请求之前做些什么
        // this 关键字为 AxiosPlus 实例
        return config
      },
      function (error) {
        // 对请求错误做些什么
        // this 关键字为 AxiosPlus 实例
        return Promise.reject(error)
      }
    )
    // 添加响应拦截器
    this.addResponseInterceptor(
      function (response) {
        // 2xx 范围内的状态码都会触发该函数
        // 对响应数据做点什么
        // this 关键字为 AxiosPlus 实例
        return response
      },
      function (error) {
        // 超出 2xx 范围的状态码都会触发该函数
        // 对响应错误做点什么
        // this 关键字为 AxiosPlus 实例
        return Promise.reject(error)
      }
    )
  }
}
```
#### CustomApi.js文件
```javascript
import Http from './Http.test.js'

export default class CustomApi {
  // 发起 get 请求
  // https://some-domain.com/api/a/getList?keyword=abc
  static getAction () {
    const http = new Http()
    const params = { keyword: 'abc' }
    return http.get('/getList', { params })
  }

  // 发起 post 请求
  // https://some-domain.com/api/a/submitOrder
  static submitAction () {
    const http = new Http()
    const data = { title: '我是标题', content: '我是正文' }
    return http.post('/submitOrder', { data })
  }
}
```

## AxiosPlus 类属性

| 属性名          | 类型     | 说明                                                                         | 默认值   |
|--------------|--------|----------------------------------------------------------------------------|-------|
| baseURL      | String | 相对于 `url` 的路径，完整API地址由 `baseURL`+`urlPrefix`+`url`组成                       | -     |
| urlPrefix    | String | 相对于 `url` 的前缀路径                                                            | -     |
| headers      | Object | 自定义请求头                                                                     | {}    |
| timeout      | Number | 如果请求时间超过 `timeout` 的值，则请求会被中断，`0` 永不超时，单位：毫秒                               | 60000 |
| responseType | String | 浏览器将要响应的数据类型，可选值包括: `arraybuffer` `document` `json` `text` `stream` `blob` | json  |

## AxiosPlus 类方法

| 方法名                                                                                                                                                                                     | 说明                                                                                   |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| get(url: String, { params?: Object, headers?: Object, responseType?: String, timeout?: Number, onUploadProgress?: Function, onDownloadProgress?: Function }): Promise                   | GET请求                                                                                |
| delete(url: String, { params?: Object, headers?: Object, responseType?: String, timeout?: Number }): Promise                                                                            | DELETE请求                                                                             |                                 
| post(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any, timeout?: Number, onUploadProgress?: Function, onDownloadProgress?: Function }): Promise      | POST请求                                                                               |                                   
| postForm(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any, timeout?: Number, onUploadProgress?: Function, onDownloadProgress?: Function }): Promise  | 使用 multipart/form-data 类型发起 POST 请求                                                  |
| put(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any, timeout?: Number, onUploadProgress?: Function, onDownloadProgress?: Function }): Promise       | PUT请求                                                                                |
| putForm(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any, timeout?: Number, onUploadProgress?: Function, onDownloadProgress?: Function }): Promise   | 使用 multipart/form-data 类型发起 PUT 请求                                                   
| patch(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any, timeout?: Number, onUploadProgress?: Function, onDownloadProgress?: Function }): Promise     | PATCH请求                                                                              |  
| patchForm(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any, timeout?: Number, onUploadProgress?: Function, onDownloadProgress?: Function }): Promise | 使用 multipart/form-data 类型发起 PATCH 请求                                                 
| getUri(url: String, { params?: Object }): String                                                                                                                                        
| addRequestInterceptor(fulfilled: (config: any) => config, rejected: (error: any) => Promise.reject(error)): void                                                                                  | 添加请求拦截器，所有拦截器按照添加顺序正序执行                                                              |
| addResponseInterceptor(fulfilled: (config: any) => config, rejected: (error: any) => Promise.reject(error)): void                                                                       | 添加响应拦截器，所有拦截器按照添加顺序正序执行                                                                              
| validateStatus(status: Number): Boolean                                                                                                                                                 | 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。默认状态码为 2xx 时 resolve， 其它为 reject promise |
| paramsSerializer(params: Object): String                                                                                                                                                | 序列化`params`                                                                          |
