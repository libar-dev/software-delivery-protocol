import { expect, it, vi } from "vitest";

vi.mock("node:path", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:path")>();
  return { ...actual, ...actual.win32 };
});
vi.mock("../src/cli/build-command.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/cli/build-command.js")>();
  return { ...actual, buildOwnedRegistrarPaths: () => [] };
});

import { checkVaultDirectory } from "../src/cli/vault-command.js";

it("accepts a separate vault with Windows path separators", () => {
  expect(() => {
    checkVaultDirectory({
      root: "C:\\r",
      vault: "C:\\elsewhere\\vault",
      exclude: [],
      checkClean: false,
    });
  }).not.toThrow();
});
