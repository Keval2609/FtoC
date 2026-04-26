import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isDemoMode = mode === 'demo';
  const isProductionMode = mode === 'production';

  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: isDemoMode ? 'dist-demo' : isProductionMode ? 'dist-prod' : 'dist',
    },
    define: {
      // Inject environment identifier at build-time
      'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(
        isDemoMode ? 'demo' : isProductionMode ? 'production' : undefined
      ),
    },
  };
});
