import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const packageAliasTarget = fileURLToPath(new URL("./src/index.ts", import.meta.url));
const runnerAliasTarget = fileURLToPath(new URL("./src/runner/index.ts", import.meta.url));
const vitestAdapterAliasTarget = fileURLToPath(
  new URL("./src/adapters/vitest.ts", import.meta.url),
);

export default defineConfig({
  resolve: {
    // Array form: subpath entries must match before the bare specifier (a prefix alias would
    // otherwise rewrite ".../runner" into a path inside index.ts).
    alias: [
      { find: "@libar-dev/software-delivery-protocol/runner", replacement: runnerAliasTarget },
      {
        find: "@libar-dev/software-delivery-protocol/vitest",
        replacement: vitestAdapterAliasTarget,
      },
      { find: "@libar-dev/software-delivery-protocol", replacement: packageAliasTarget },
    ],
  },
  test: {
    environment: "node",
    globals: true,
    // The example's tests run too: the tracer-bullet verifier anchor must sit beside a real,
    // executing runner test (`04` §2), not stand alone as a binding-only file.
    include: ["test/**/*.test.ts", "examples/**/*.test.ts"],
  },
});
