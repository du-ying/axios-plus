import AxiosPlus from "../src/AxiosPlus";
import {expect, test} from "vitest";

class TestEngine extends AxiosPlus {
  baseURL = 'http://127.0.0.1:4523/m1/3894832-3529145-default';
  urlPrefix = '/kjb/en';
  headers = {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    get: {
      'sort-field': 'crtDateTime',
      direction: 'desc',
    },
  };
}

class TestService {
  static fun1() {
    const http = new TestEngine();
    return http.getUri('/oper/info');
  }

  static fun2() {
    const http = new TestEngine();
    const urlPrefix = '';
    return http.getUri('/oper/info', { urlPrefix });
  }

  static fun3() {
    const http = new TestEngine();
    const urlPrefix = '';
    const baseURL = 'https://www.baidu.com';
    return http.getUri('/oper/info', { urlPrefix, baseURL });
  }

  static fun4() {
    const http = new TestEngine();
    const urlPrefix = '';
    const baseURL = 'https://www.baidu.com';
    const params = { name: 'jim', age: 18, interest: ['ball', 'swim'] };
    return http.getUri('/oper/info', { urlPrefix, baseURL, params });
  }

  static fun5() {
    const http = new TestEngine();
    const headers = { 'Accept': '*/*' };
    return http.get('/oper/info', { headers });
  }

  static fun6() {
    const http = new TestEngine();
    return http.post('/oper/save');
  }
}

test('getUri', function () {
  expect(TestService.fun1()).toBe('http://127.0.0.1:4523/m1/3894832-3529145-default/kjb/en/oper/info');
  expect(TestService.fun2()).toBe('http://127.0.0.1:4523/m1/3894832-3529145-default/oper/info');
  expect(TestService.fun3()).toBe('https://www.baidu.com/oper/info');
  expect(TestService.fun4()).toBe(`https://www.baidu.com/oper/info?name=jim&age=18&interest=${encodeURIComponent(['ball', 'swim'].join())}`);
});

test('header头设置', async function () {
  const res1 = await TestService.fun5();
  console.log(res1.config.headers);
  const res2 = await TestService.fun6();
  console.log(res2.config.headers);
})