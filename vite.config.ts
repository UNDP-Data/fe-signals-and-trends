/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ command, mode }) => {
  const externalEnvs = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), eslint()],
    define: {
      'process.env': externalEnvs,
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
      proxy: {
        '/api': {
          target: 'https://api.pexels.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      cors: {
        origin: '*',
        methods: ['GET'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      },
    },
  };
});
