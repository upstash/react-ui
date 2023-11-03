import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  splitting: true,
  sourcemap: false,
  clean: true,
  dts: true,
  minify: true,
  minifyWhitespace: true,
});
