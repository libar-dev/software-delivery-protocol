import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "node:url";

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
    // test/fixtures/extract holds on-disk extractor corpora: they exercise the extractor, not tsc
    // or the lint — one is deliberately type-incorrect (the raw-relations smuggle).
    ignores: [
      "dist/**",
      "generated/**",
      ".sisyphus/evidence/**",
      "node_modules/**",
      "test/fixtures/extract/**",
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
