import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', emptyOutDir: false,
    lib: { entry: 'src/extension/background.ts', formats: ['es'], fileName: () => 'extension/background.js' },
  },
});
