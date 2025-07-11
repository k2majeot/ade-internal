import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["internal.adexperiences.com"],
    proxy: {
      "/api": "http://localhost:3000",
    },
    fs: {
      allow: ["..", "/home/ubuntu/my-app/shared"],
    },
  },
  optimizeDeps: {
    exclude: ["class-variance-authority"],
  },
});
