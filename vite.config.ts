import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/todos-daily/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TODOS daily',
        short_name: 'TODOS',
        description: 'To-do list for daily use',
        display: 'standalone',
        icons: [
          {
            src: 'todos-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'todos-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
    }),
  ],
  css: {
    postcss: './postcss.config.mjs',
  },
});
