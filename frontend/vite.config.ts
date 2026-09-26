import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/firebase/") || id.includes("/@firebase/")) return "firebase";
          if (id.includes("/@reduxjs/") || id.includes("/react-redux/")) return "state";
          if (id.includes("/gsap/") || id.includes("/@gsap/")) return "motion";
          if (id.includes("/@radix-ui/")) return "ui";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/") ||
            id.includes("/react-is/") ||
            id.includes("/use-sync-external-store/")
          )
            return "react";
          return "vendor";
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
    watch: {
      // Avoid Linux inotify exhaustion on workspaces with many active tools.
      usePolling: true,
      interval: 300,
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
