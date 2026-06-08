import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "src/cli.ts",
    index: "src/index.ts",
  },
  format: ["esm"],
  target: "node22",
  platform: "node",
  clean: true,
  dts: false,
  sourcemap: false,
});
