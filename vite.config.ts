import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',  // <-- PENTING UNTUK GITHUB PAGES ROOT
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'react-select', 'typewriter-effect', 'react-countup'],
          utils: ['xlsx', 'axios', 'lz-string'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux'],
        },
      },
    },
  },
});
