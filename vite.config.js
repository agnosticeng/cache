import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/cache.ts"),
      name: "Cache",
      fileName: "cache",
      formats: ["es", "cjs", "umd"],
    },
  },
});
