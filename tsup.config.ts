import { defineConfig } from "tsup";

import { RECIPES_DIRECTORY, writeBuildArtifacts } from "./src/cli/build-artifacts.js";
import { BUILD_INFO_FILE } from "./src/cli/build-info.js";

// The CLI entry (`src/cli/sdp.ts`) carries its own source shebang; esbuild preserves a leading
// shebang on an entry point, so `dist/cli/sdp.js` stays executable while `dist/index.js` (the
// library entry, no shebang) stays clean. No banner / strip-plugin / post-build normalisation.
//
// After the bundle succeeds, the build step writes each catalog recipe to `dist/recipes/` and the
// build commit to `dist/cli/build-info.json`. The clean keeps both, because the step replaces each
// file in one rename: a test reading them while another build runs never finds them missing.
export default defineConfig([
  {
    entry: [
      "src/index.ts",
      "src/anchors.ts",
      "src/cli/sdp.ts",
      "src/runner/index.ts",
      "src/adapters/vitest.ts",
      "src/testing/index.ts",
    ],
    format: ["esm"],
    dts: true,
    platform: "node",
    target: "es2022",
    clean: [`!${RECIPES_DIRECTORY}/**`, `!cli/${BUILD_INFO_FILE}`],
    splitting: false,
    outDir: "dist",
    onSuccess: () => {
      writeBuildArtifacts({ root: process.cwd(), outDir: "dist" });
      return Promise.resolve();
    },
  },
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    dts: false,
    platform: "node",
    target: "es2022",
    clean: false,
    splitting: false,
    outDir: "dist",
  },
]);
