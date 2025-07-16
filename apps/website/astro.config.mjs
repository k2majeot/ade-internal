import { defineConfig } from "astro/config";
import path from "path";

const sharedPath = path.resolve(
  new URL("../../shared", import.meta.url).pathname,
);
const astroPath = path.resolve("../../node_modules/astro");

export default defineConfig({
  vite: {
    server: {
      fs: {
        allow: [path.resolve("./"), sharedPath, astroPath],
      },
    },
  },
});
