import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "node:url";

import { rootContractDependentSuite } from "./contract-dependent-suites.mjs";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));
const typedTsFiles = ["src/**/*.ts", "test/**/*.ts", "tsup.config.ts", "vitest.config.ts"];
const exampleTsFiles = ["examples/**/*.ts"];
const typeCheckedConfigs = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({
  ...config,
  files: typedTsFiles,
}));

export default tseslint.config(
  {
    // explorations/ holds verbatim exhibits, several broken by design — excluded explicitly,
    // never merely by falling outside the files globs.
    ignores: [
      "dist/**",
      "**/generated/**",
      ".sisyphus/evidence/**",
      "node_modules/**",
      "explorations/**",
      "test/fixtures/import/parity/**",
    ],
  },
  js.configs.recommended,
  ...typeCheckedConfigs,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
  {
    files: exampleTsFiles,
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
  {
    // The root generated contracts are intentionally absent until the later generate:self-hosting
    // gate leg. Typecheck runs after that generation and checks these tests' contract types; lint
    // keeps all other rules enabled without making the required lint-before-generation order depend
    // on ignored derived output. The file list is derived from the shared
    // `contract-dependent-suites.mjs` root row — the same rows `vitest-test.mjs` reads, so the two
    // surfaces can no longer drift apart. Every suite that imports `generated/contracts/` belongs
    // in that row, and a suite that derives its graph in memory (the corpus oracle, the contracts
    // self-check) must not, so lint keeps full strength where nothing is missing in a clean room.
    // Only the root tree's suites appear here: the example tree lints under `exampleTsFiles`,
    // outside the typed-lint globs these exemptions relax.
    files: [...rootContractDependentSuite.testPaths],
    rules: {
      // Generated contracts are absent until `generate:self-hosting` (after lint). These
      // type-aware rules mis-fire when import resolution degrades to `any` / error types;
      // typecheck later re-enforces the real shapes against the generated output.
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },
  {
    files: typedTsFiles,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
      globals: globals.node,
    },
  },
);
