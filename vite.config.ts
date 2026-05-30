import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://72.233.250.83:80',
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Rewrite the path if your backend doesn't expect the /api prefix
      },
      '/data': {
        target: 'http://72.233.250.83:80',
        changeOrigin: true, // Ensure the request appears to come from the frontend server
      },
    },
  },
});
