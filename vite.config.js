import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ["es2020"],
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@ui": path.resolve(__dirname, "./src/ui"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
