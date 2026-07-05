/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'CajuEat',
        short_name: 'CajuEat',
        description: 'CajuEat no muestra listas. Ayuda a decidir.',
        theme_color: '#EF5A22',
        background_color: '#FCFBF8',
        display: 'standalone',
        start_url: '/',
        // TODO: replace with real maskable/any icon set (192/512 png)
        // generated from the Wordmark/BrainMark once the brand assets exist.
        icons: [],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
