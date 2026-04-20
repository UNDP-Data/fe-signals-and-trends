import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '/tmp/ftss-fe-vitest-cache',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'],
    testTimeout: 10000, 
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage',
    },
  },
});
