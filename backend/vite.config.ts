import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  server: {
    proxy: {
      '/ASSET-API': {
        target: 'http://localhost', // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ASSET-API/, '/ASSET-API')
      }
    }
  }
  
});
