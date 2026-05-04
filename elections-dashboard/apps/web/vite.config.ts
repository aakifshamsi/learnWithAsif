import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
      '/ws': { target: 'ws://localhost:8787', ws: true },
    },
  },
  resolve: {
    alias: {
      '@elections/shared': new URL('../../packages/shared/src/index.ts', import.meta.url).pathname,
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          plotly: ['plotly.js-dist-min'],
          maps: ['react-simple-maps'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack/react-query'],
        },
      },
    },
  },
});
