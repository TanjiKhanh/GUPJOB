import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        // 👇 SỬA LẠI: Backend đang chạy ngon ở 3001
        target: 'http://127.0.0.1:3001', 
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://127.0.0.1:3001', // Sửa thành 3001
        changeOrigin: true,
        secure: false,
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/roadmaps': {
        target: 'http://127.0.0.1:3001', // Sửa thành 3001
        changeOrigin: true,
        secure: false,
      },
    },
  },
});