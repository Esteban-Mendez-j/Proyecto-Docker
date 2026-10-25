import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('/node_modules/')) {
            if (
              normalizedId.includes('/node_modules/react/') ||
              normalizedId.includes('/node_modules/react-dom/') ||
              normalizedId.includes('/node_modules/react-router/') ||
              normalizedId.includes('/node_modules/react-router-dom/')
            ) {
              return 'vendor-react-core';
            }
            if (
              normalizedId.includes('/node_modules/@tremor/') ||
              normalizedId.includes('/node_modules/@remixicon/')
            ) {
              return 'vendor-charts';
            }
            if (normalizedId.includes('/node_modules/@stomp/')) {
              return 'vendor-stomp';
            }
            if (normalizedId.includes('/node_modules/sweetalert2/')) {
              return 'vendor-alerts';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
