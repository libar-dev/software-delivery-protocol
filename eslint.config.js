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
    // The root generated contract is intentionally absent until the later generate:self-hosting
    // gate leg. Typecheck runs after that generation and checks this test's contract types; lint
    // keeps all other rules enabled without making the required lint-before-generation order depend
    // on ignored derived output.
    files: ["test/self-hosting-duplicate-ids.test.ts", "test/self-hosting-sdp-import.test.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
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
