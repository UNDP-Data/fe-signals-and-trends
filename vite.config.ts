import react from '@vitejs/plugin-react';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    build: {
      outDir: 'build',
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
    server: {
      port: Number.parseInt(env.VITE_PORT || '5173', 10),
      cors: {
        origin: '*',
        methods: ['GET'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      },
      hmr: {
        overlay: false
      },
      logger: {
        hasWarned: false,
        hasErrorLogged: false,
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
    },
  };
});
