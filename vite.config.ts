// Import Vite configuration function
import { defineConfig, loadEnv } from "vite";
// Import React plugin with SWC for fast compilation
import react from "@vitejs/plugin-react-swc";
// Import path module for resolving file paths
import path from "path";

// Vite configuration for the WENZE TII NDAKU marketplace
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get backend URL from environment variables
  // Priority: VITE_API_URL > VITE_PRODUCTION_BACKEND_URL > fallback
  const getBackendUrl = () => {
    if (env.VITE_API_URL) {
      // Remove /api suffix if present, as we'll add it in the proxy rewrite
      return env.VITE_API_URL.replace(/\/api$/, '');
    }
    if (env.VITE_PRODUCTION_BACKEND_URL) {
      return env.VITE_PRODUCTION_BACKEND_URL.replace(/\/api$/, '');
    }
    // If no env variable is set, throw an error
    throw new Error('VITE_API_URL or VITE_PRODUCTION_BACKEND_URL must be set in .env file for proxy configuration');
  };

  return {
    // Development server configuration
    server: {
      host: "::",        // Listen on all network interfaces (IPv4 and IPv6)
      port: 5173,        // Development server port
      proxy: {
        // Proxy API requests to the backend server
        // Target is read from environment variables
        '/api': {
          target: getBackendUrl(),
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
      // Disable source maps in production to avoid 404 errors
      sourcemap: false,
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
  };
});
