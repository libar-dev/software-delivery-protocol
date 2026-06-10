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
    ignores: ["dist/**", "generated/**", ".sisyphus/evidence/**", "node_modules/**"],
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
