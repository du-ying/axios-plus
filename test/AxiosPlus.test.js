import { describe, it, expect, vi, beforeEach } from 'vitest';
import AxiosPlus from '../src/AxiosPlus.js';

// 用 vi.hoisted 提前构造可控的 axios 实例，避免 vi.mock 提升导致的 TDZ 问题
const { mockInstance } = vi.hoisted(() => {
  const instance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
    postForm: vi.fn(),
    put: vi.fn(),
    putForm: vi.fn(),
    patch: vi.fn(),
    patchForm: vi.fn(),
    getUri: vi.fn(),
  };
  return { mockInstance: instance };
});

// AxiosPlus 用 `import axios from 'axios'`，这里只 mock default 导出
vi.mock('axios', () => ({
  default: { create: vi.fn(() => mockInstance) },
}));

describe('AxiosPlus', () => {
  let client;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new AxiosPlus();
    client.baseURL = 'https://api.example.com';
    client.urlPrefix = '/v1';
  });

  it('构造后可设置基础配置字段', () => {
    expect(client.baseURL).toBe('https://api.example.com');
    expect(client.urlPrefix).toBe('/v1');
    expect(client.timeout).toBe(60000);
    expect(client.responseType).toBe('json');
  });

  it('validateStatus: 2xx 通过，其余不通过', () => {
    expect(client.validateStatus(200)).toBe(true);
    expect(client.validateStatus(299)).toBe(true);
    expect(client.validateStatus(300)).toBe(false);
    expect(client.validateStatus(404)).toBe(false);
  });

  it('paramsSerializer: 使用 qs 的 comma 数组格式', () => {
    const out = client.paramsSerializer({ tags: ['a', 'b'] });
    // qs 会把逗号编码成 %2C，解码后即 tags=a,b（comma 格式，而非 tags[]=a&tags[]=b）
    expect(decodeURIComponent(out)).toBe('tags=a,b');
  });

  it('get: 把 urlPrefix 拼到 url 前并透传配置', () => {
    client.get('/users', { params: { id: 1 }, timeout: 1000 });
    expect(mockInstance.get).toHaveBeenCalledWith('/v1/users', {
      params: { id: 1 },
      headers: undefined,
      responseType: undefined,
      timeout: 1000,
      onUploadProgress: undefined,
      onDownloadProgress: undefined,
    });
  });

  it('post: data 作为第二参数传入', () => {
    const body = { name: 'x' };
    client.post('/users', { data: body });
    expect(mockInstance.post).toHaveBeenCalledWith('/v1/users', body, expect.any(Object));
  });

  it('postForm/put/patch 均委托到底层实例', () => {
    client.postForm('/a', { data: { f: 1 } });
    client.put('/b', { data: { f: 2 } });
    client.patch('/c', { data: { f: 3 } });
    expect(mockInstance.postForm).toHaveBeenCalledWith('/v1/a', { f: 1 }, expect.any(Object));
    expect(mockInstance.put).toHaveBeenCalledWith('/v1/b', { f: 2 }, expect.any(Object));
    expect(mockInstance.patch).toHaveBeenCalledWith('/v1/c', { f: 3 }, expect.any(Object));
  });

  it('请求拦截器按入栈逆序注册，响应拦截器按正序注册', () => {
    const reqA = { fulfilled: vi.fn(), rejected: vi.fn() };
    const reqB = { fulfilled: vi.fn(), rejected: vi.fn() };
    const resA = { fulfilled: vi.fn(), rejected: vi.fn() };
    const resB = { fulfilled: vi.fn(), rejected: vi.fn() };

    client.addRequestInterceptor(reqA.fulfilled, reqA.rejected);
    client.addRequestInterceptor(reqB.fulfilled, reqB.rejected);
    client.addResponseInterceptor(resA.fulfilled, resA.rejected);
    client.addResponseInterceptor(resB.fulfilled, resB.rejected);

    // 触发 #init（任一请求方法都会触发）
    client.get('/x');

    const reqCalls = mockInstance.interceptors.request.use.mock.calls;
    expect(reqCalls[0][0]).toBe(reqB.fulfilled); // 逆序：后加的先注册
    expect(reqCalls[1][0]).toBe(reqA.fulfilled);

    const resCalls = mockInstance.interceptors.response.use.mock.calls;
    expect(resCalls[0][0]).toBe(resA.fulfilled); // 正序
    expect(resCalls[1][0]).toBe(resB.fulfilled);
  });

  it('getUri: 透传 url 与 params（带 urlPrefix）', () => {
    client.getUri('/p', { params: { a: 1 } });
    expect(mockInstance.getUri).toHaveBeenCalledWith({ url: '/v1/p', params: { a: 1 } });
  });

  it('每次请求都委托到底层实例的对应方法（经 axios.create 建立）', () => {
    client.get('/x');
    expect(mockInstance.get).toHaveBeenCalled();
  });
});
