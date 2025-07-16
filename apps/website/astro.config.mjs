import { defineConfig } from "astro/config";
import path from "path";

const sharedPath = path.resolve(
  new URL("../../shared", import.meta.url).pathname,
);

export default defineConfig({
  trailingSlash: "never",
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(new URL("./src", import.meta.url).pathname),
        "@shared": path.join(sharedPath, "src"),
      },
    },
    server: {
      fs: {
        allow: [sharedPath],
      },
    },
  },
});
