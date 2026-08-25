import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', emptyOutDir: false,
    lib: { entry: 'src/extension/content.ts', name: 'WordJournalCapture', formats: ['iife'], fileName: () => 'extension/content.js' },
  },
});
