import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/evora': {
        target: 'http://72.233.250.83:80',
        changeOrigin: true,
      },
      '/tcs': {
        target: 'http://72.233.250.83:80',
        changeOrigin: true,
      },
      '/focuser': {
        target: 'http://72.233.250.83:80',
        changeOrigin: true,
      },
      '/data': {
        target: 'http://72.233.250.83:80',
        changeOrigin: true,
      },
    },
  },
});
