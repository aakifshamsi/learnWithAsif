import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use relative base so the same build works on both GitHub Pages (/learnWithAsif/)
// and Cloudflare Pages (root /). Anchor-only navigation, no BrowserRouter routes.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
