import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 只跑 test/ 下的用例，避免误扫到 examples/ 里的草稿测试
    include: ['test/**/*.test.js'],
    environment: 'node',
  },
});
