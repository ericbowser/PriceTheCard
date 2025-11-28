import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

// Read env.json
const env = JSON.parse(readFileSync('./env.json', 'utf-8'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: env.NODE_ENV === 'development' 
  },
  server: {
    port: env.PORT || 3000,
    host: 'localhost'
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
      ]
    }
  }
})
