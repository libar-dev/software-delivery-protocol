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
    include: ["test/**/*.test.ts"],
  },
});
