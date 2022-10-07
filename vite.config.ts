import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
      $pages: path.resolve("./src/pages"),
      $components: path.resolve("./src/components"),
      $types: path.resolve("./src/lib/types"),
      $store: path.resolve("./src/store"),
    },
  },
  plugins: [svelte()],
});
