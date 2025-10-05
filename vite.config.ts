// Import Vite configuration function
import { defineConfig } from "vite";
// Import React plugin with SWC for fast compilation
import react from "@vitejs/plugin-react-swc";
// Import path module for resolving file paths
import path from "path";

// Vite configuration for the WENZE TII NDAKU marketplace
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Development server configuration
  server: {
    host: "::",        // Listen on all network interfaces (IPv4 and IPv6)
    port: 5173,        // Development server port
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'https://wenzetiindaku-backend.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  // Vite plugins
  plugins: [
    react(),           // React plugin with SWC for fast compilation and hot reload
  ],
  // Module resolution configuration
  resolve: {
    alias: {
      // Set up path alias for cleaner imports (e.g., @/components instead of ../../components)
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build configuration
  build: {
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
}));
