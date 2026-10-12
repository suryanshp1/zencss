import { defineConfig } from "vite";
import zen from "@suryanshp1/zencss/vite";
export default defineConfig({
  plugins: [zen({ configFile: "./theme.css" })],
  esbuild: { jsx: "automatic" },
});
