import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WindiCSS()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
