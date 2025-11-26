import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import config from './env.json';

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  build: {
   outDir: 'dist',
   sourcemap: config.NODE_ENV === 'development' 
  },
  server: {
    port: config.PORT || 3000,
    host: 'localhost',
    https: {
      cert: 'ssl/server.crt',
      key: 'ssl/server.key'
    }
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
      ]
      }
  }
})
