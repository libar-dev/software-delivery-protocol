import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Plugin } from "esbuild";
import { defineConfig } from "tsup";

const cliShebangStripper = {
  name: "strip-cli-shebang",
  setup(build: Parameters<Plugin["setup"]>[0]) {
    build.onResolve({ filter: /[\\/]src[\\/]cli[\\/]sdp\.ts$/ }, (args) => ({
      path: args.path,
      namespace: "cli-shebang",
    }));

    build.onLoad({ filter: /.*/, namespace: "cli-shebang" }, async (args) => {
      const contents = await readFile(args.path, "utf8");

      return {
        contents: contents.replace(/^#!.*(?:\r?\n)?/, ""),
        loader: "ts",
      };
    });
  },
};

const cliOutputPath = fileURLToPath(new URL("./dist/cli/sdp.js", import.meta.url));

async function normalizeCliOutputShebang() {
  const contents = await readFile(cliOutputPath, "utf8");
  const duplicateShebang = "#!/usr/bin/env node\n#!/usr/bin/env node\n";
  const normalized = contents.startsWith(duplicateShebang)
    ? contents.slice("#!/usr/bin/env node\n".length)
    : contents;

  if (normalized !== contents) {
    await writeFile(cliOutputPath, normalized, "utf8");
  }
}

export default defineConfig({
  entry: ["src/index.ts", "src/cli/sdp.ts"],
  format: ["esm"],
  dts: true,
  platform: "node",
  target: "es2022",
  clean: true,
  splitting: false,
  outDir: "dist",
  esbuildOptions(options) {
    options.plugins = [...(options.plugins ?? []), cliShebangStripper];
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
  onSuccess: normalizeCliOutputShebang,
});
