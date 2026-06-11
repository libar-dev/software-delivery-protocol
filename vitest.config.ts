import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const packageAliasTarget = fileURLToPath(new URL("./src/index.ts", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@libar-dev/software-delivery-protocol": packageAliasTarget,
    },
  },
  test: {
    environment: "node",
    globals: true,
    // The example's tests run too: the tracer-bullet verifier anchor must sit beside a real,
    // executing runner test (`04` §2), not stand alone as a binding-only file.
    include: ["test/**/*.test.ts", "examples/**/*.test.ts"],
  },
});
