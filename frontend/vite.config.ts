import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hmrs.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/adzuna': {
        target: 'https://api.adzuna.com/v1/api/jobs',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/adzuna/, ''),
      },
    },
  },
})
