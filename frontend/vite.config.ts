import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /auth and /user to your backend to avoid CORS in dev
      '/auth': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/health': 'http://localhost:3000'
    }
  }
});