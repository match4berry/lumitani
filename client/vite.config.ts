import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ['elcyone.my.id', 'www.elcyone.my.id', 'localhost'],
    hmr: {
      host: 'elcyone.my.id',
      protocol: 'wss',
      port: 443,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
