import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/addtocart': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/signup': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/cart': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/product_details': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
