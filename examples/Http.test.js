import AxiosPlus from '../src/AxiosPlus';

class HttpEngine extends AxiosPlus{
  constructor() {
    super();
    this.addRequestInterceptor(
      function(config) {
        console.log('自定义请求拦截器 - 1', JSON.stringify(config));
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );
    this.addRequestInterceptor(function(config) {
      console.log('自定义请求拦截器 - 2', JSON.stringify(config));
      return config;
    });
    this.addResponseInterceptor(function(response) {
      console.log('自定义响应拦截器 - 1', JSON.stringify(response.data));
      return response;
    });
    this.addResponseInterceptor(function(response) {
      console.log('自定义响应拦截器 - 2', JSON.stringify(response.data));
      return response;
    }, function(error) {
      return Promise.reject(error);
    });
  }

  baseURL = 'http://127.0.0.1:4523/m1/4786615-4440647-default';
}

class HttpService {
  static getHttpEngine() {
    const http = new HttpEngine();
    http.urlPrefix = '/preTask';
    return http;
  }

  static getHttpEngine2() {
    const http = new HttpEngine();
    http.urlPrefix = '/checkTask';
    return http;
  }

  static getRequest1() {
    return this.getHttpEngine()
      .get('/preTaskInfo', {
        timeout: 300,
      });
  }

  static getRequest2() {
    return this.getHttpEngine()
      .get('/preTaskInfo', {
        params: {taskId: '1', projectId: 2},
      });
  }

  static getRequest3() {
    return this.getHttpEngine()
      .getUri('/preTaskInfo')
  }

  static getRequest4() {
    return this.getHttpEngine()
      .getUri('/preTaskInfo', {
        params: {taskId: '1', projectId: 2, times: [3, 4], keyword: '融创'},
      });
  }

  static getRequest5() {
    return this.getHttpEngine2()
      .get('/findNextItem', {
        responseType: 'text',
      });
  }
}


test('sdf', async () => {
  // try {
  //   const res = await HttpService.getRequest2();
  //   const {status, statusText, data, headers, config} = res;
  //   console.log('status = ', status);
  //   console.log('data = ', data);
  //   // console.log('config = ', config);
  // } catch (e) {
  //   console.error(e.message);
  // }

  // console.log(HttpService.getRequest4())

  try {
    const res = await HttpService.getRequest5();
    const {status, statusText, data, headers, config} = res;
    console.log('data = ', data, typeof data);
  } catch (e) {
    console.error(e.message);
  }
})