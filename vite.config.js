import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://45.149.206.133:6047',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/odata': {
        target: 'http://45.149.206.133:6048',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/odata/, '')
      }
    }
  }
})
