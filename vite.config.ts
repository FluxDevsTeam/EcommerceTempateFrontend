import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    cors: {
      origin: ['https://accounts.google.com', 'https://api.kidsdesigncompany.com'],
      credentials: true
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    },
    proxy: {
      '/auth': {
        target: 'https://api.kidsdesigncompany.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})