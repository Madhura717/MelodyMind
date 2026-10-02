import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr:
        process.env.DISABLE_HMR !== 'true'
          ? {
              // Avoid "Port 24678 already in use" when a prior dev server is running.
              port: Number(process.env.VITE_HMR_PORT || 24679),
              clientPort: Number(process.env.VITE_HMR_PORT || 24679),
            }
          : false,
    },
  };
});
