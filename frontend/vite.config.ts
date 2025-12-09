import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxy: forward /api -> gateway (http://localhost:8080)
// This keeps browser origin as the frontend dev server while proxying API calls.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // don't rewrite path; gateway expects /api/*
      },
    },
  },
});