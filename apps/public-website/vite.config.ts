import { defineConfig } from "vite";
import path from "path";

const sharedPath = path.resolve(__dirname, "../../shared");

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.join(sharedPath, "src"),
    },
  },
  server: {
    fs: {
      allow: [sharedPath],
    },
  },
});
