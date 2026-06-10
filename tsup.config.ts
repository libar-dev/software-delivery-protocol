import { defineConfig } from "tsup";

// The CLI entry (`src/cli/sdp.ts`) carries its own source shebang; esbuild preserves a leading
// shebang on an entry point, so `dist/cli/sdp.js` stays executable while `dist/index.js` (the
// library entry, no shebang) stays clean. No banner / strip-plugin / post-build normalisation.
export default defineConfig({
  entry: ["src/index.ts", "src/cli/sdp.ts"],
  format: ["esm"],
  dts: true,
  platform: "node",
  target: "es2022",
  clean: true,
  splitting: false,
  outDir: "dist",
});
