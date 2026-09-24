import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  base: '/todos-daily/',
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TODOS daily',
        short_name: 'TODOS',
        description: 'Приватный офлайн-список задач для ежедневного использования.',
        display: 'fullscreen',
        theme_color: '#f8fafc',
        background_color: '#f8fafc',
        lang: 'ru',
        start_url: '/todos-daily/',
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
