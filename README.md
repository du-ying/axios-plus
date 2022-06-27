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
    this.addInterceptor('request', 'key1', [
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
    ])
    // 添加响应拦截器
    this.addInterceptor('response', 'key2', [
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
    ])
  }
}
```
#### CustomApi.js文件
```javascript
import Http from './Http.js'

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
| urlPrefix    | String | 相对于 `url` 的路径                                                              | -     |
| headers      | Object | 自定义请求头                                                                     | {}    |
| timeout      | Number | 如果请求时间超过 `timeout` 的值，则请求会被中断，`0` 永不超时，单位：毫秒                               | 60000 |
| responseType | String | 浏览器将要响应的数据类型，可选值包括: `arraybuffer` `document` `json` `text` `stream` `blob` | json  |

## AxiosPlus 类方法

| 方法名                                                                                                                        | 说明                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| get(url: String, { params?: Object, headers?: Object, responseType?: String }): Promise                                    | GET请求                                                                                |
| delete(url: String, { params?: Object, headers?: Object, responseType?: String }): Promise                                 | DELETE请求                                                                             |                                 
| post(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any }): Promise                       | POST请求                                                                               |                                   
| put(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any }): Promise                        | PUT请求                                                                                |
| patch(url: String, { params?: Object, headers?: Object, responseType?: String, data?: any }): Promise                      | PATCH请求                                                                              |  
| addInterceptor(type: String, key: String, [onFulfilled?: (value: any) => value, onRejected?: (error: any) => error]): void | 添加拦截器。参数`type`可选值为 `request` `response`，不区分大小写。所有拦截器按照添加顺序正序执行                       |
| removeInterceptor(type: String, key: String): void                                                                         | 移除拦截器。参数`type`可选值为 `request` `response`，不区分大小写                                       |
| validateStatus(status: Number): Boolean                                                                                    | 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。默认状态码为 2xx 时 resolve， 其它为 reject promise |
| paramsSerializer(params: Object): String                                                                                   | 序列化`params`                                                                          |
