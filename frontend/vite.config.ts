import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/adzuna': {
        target: 'https://api.adzuna.com/v1/api/jobs',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/adzuna/, ''),
      },
    },
  },
  define: {
    global: 'window',
  },
})
