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

it("accepts the default vault placement with Windows path separators", () => {
  expect(() => {
    checkVaultDirectory({ root: "C:\\r", exclude: [], checkClean: false });
  }).not.toThrow();
});

it("refuses overlap with build output using Windows path separators and case", () => {
  expect(() => {
    checkVaultDirectory({
      root: "C:\\r",
      vault: "c:\\R\\generated\\SPEC-STUDIO\\vault",
      exclude: [],
      checkClean: false,
    });
  }).toThrow("overlaps generated/spec-studio");
});

it("refuses a source directory as a vault with Windows path separators", () => {
  expect(() => {
    checkVaultDirectory({
      root: "C:\\r",
      vault: "C:\\r\\notes\\vault",
      exclude: [],
      checkClean: false,
    });
  }).toThrow("lies inside the root and would be read as source");
});
