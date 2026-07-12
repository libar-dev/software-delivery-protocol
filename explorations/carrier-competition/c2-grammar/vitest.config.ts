import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const packageAliasTarget = fileURLToPath(new URL("../../../src/index.ts", import.meta.url));
const runnerAliasTarget = fileURLToPath(
  new URL("../../../src/runner/index.ts", import.meta.url),
);
const vitestAdapterAliasTarget = fileURLToPath(
  new URL("../../../src/adapters/vitest.ts", import.meta.url),
);

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  resolve: {
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
    include:
      process.env.SDP_C2_RED === "1"
        ? ["executable/drift-demo.red.test.ts"]
        : ["executable/create-order.valid-cart.test.ts", "spike/**/*.test.ts"],
  },
});
