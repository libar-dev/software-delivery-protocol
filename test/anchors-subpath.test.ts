import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const builtSubpath = resolve(repositoryRoot, "dist/anchors.js");

/**
 * Every runtime import form, read from the syntax tree rather than the text: a side-effect
 * `import "x"`, `import ... from "x"`, `export ... from "x"`, `export * from "x"`, `import("x")`
 * with or without import attributes, and `require("x")`, in source order. A type-only import or
 * export is erased by the build and is no runtime dependency. A call spelled inside a string, a
 * template, or a comment is text, not a call, so it is never read as one.
 */
function moduleSpecifiers(file: string, text: string): readonly string[] {
  const specifiers: string[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node)) {
      if (
        node.importClause?.phaseModifier !== ts.SyntaxKind.TypeKeyword &&
        ts.isStringLiteralLike(node.moduleSpecifier)
      ) {
        specifiers.push(node.moduleSpecifier.text);
      }
    } else if (ts.isExportDeclaration(node)) {
      if (
        !node.isTypeOnly &&
        node.moduleSpecifier !== undefined &&
        ts.isStringLiteralLike(node.moduleSpecifier)
      ) {
        specifiers.push(node.moduleSpecifier.text);
      }
    } else if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const [argument] = node.arguments;

      if (
        argument !== undefined &&
        ts.isStringLiteralLike(argument) &&
        (callee.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(callee) && callee.text === "require"))
      ) {
        specifiers.push(argument.text);
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true));

  return specifiers;
}

/** A relative specifier stays inside the package; every other specifier is a dependency. */
function isRelative(specifier: string): boolean {
  return specifier.startsWith(".");
}

/** Every module specifier the entry file and its relative imports reach, in discovery order. */
function importClosure(entry: string): readonly string[] {
  const specifiers: string[] = [];
  const visited = new Set<string>();
  const queue = [entry];

  for (let file = queue.shift(); file !== undefined; file = queue.shift()) {
    if (visited.has(file)) {
      continue;
    }

    visited.add(file);

    for (const specifier of moduleSpecifiers(file, readFileSync(file, "utf8"))) {
      specifiers.push(specifier);

      if (isRelative(specifier)) {
        queue.push(resolve(dirname(file), specifier));
      }
    }
  }

  return specifiers;
}

describe("the anchors subpath", () => {
  it("builds to a module whose import closure is relative only: no node: specifier, no ts-morph, no dependency", async () => {
    if (!existsSync(builtSubpath)) {
      execFileSync("npm", ["run", "build"], { cwd: repositoryRoot, encoding: "utf8" });
    }

    const closure = importClosure(builtSubpath);
    expect(closure.filter((specifier) => !isRelative(specifier))).toEqual([]);
    expect(readFileSync(builtSubpath, "utf8")).not.toMatch(/\bts-morph\b|["']node:/u);

    const subpath = (await import(pathToFileURL(builtSubpath).href)) as Record<string, unknown>;
    expect(Object.keys(subpath).sort()).toEqual([
      "CODE_ANCHOR_LAYERS",
      "CODE_ANCHOR_NAMESPACES",
      "anchorId",
      "codeAnchor",
      "codeAnchorId",
      "componentAnchorId",
      "oracleAnchorId",
      "packId",
      "ref",
      "specId",
      "specOracle",
      "specTest",
      "testAnchorId",
    ]);
  });

  it("is published as an ESM subpath with its own types", () => {
    const manifest = JSON.parse(readFileSync(resolve(repositoryRoot, "package.json"), "utf8")) as {
      readonly exports: Record<string, Record<string, string>>;
    };

    expect(manifest.exports["./anchors"]).toEqual({
      types: "./dist/anchors.d.ts",
      import: "./dist/anchors.js",
    });
  });
});

describe("the import scanner behind the subpath check", () => {
  // Given: a tree whose entry carries a direct side-effect import and a named external import,
  // and whose relative chain reaches a side-effect import two files deep, with the dynamic and
  // CommonJS forms on the way. When: the closure is scanned. Then: every form is listed in
  // discovery order, and the relative-only predicate rejects each external specifier.
  it("lists side-effect, transitive, and named external imports that the relative-only predicate rejects", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-anchors-closure-"));

    try {
      writeFileSync(
        join(root, "entry.js"),
        [
          'import "reflect-metadata";',
          'import { pad } from "left-pad";',
          'import "./middle.js";',
          'export const label = "import from nowhere";',
          "export const here = import.meta.url;",
          "export const entry = pad;",
          "",
        ].join("\n"),
        "utf8",
      );
      writeFileSync(
        join(root, "middle.js"),
        ['export * from "./leaf.js";', 'export const lazy = () => import("./lazy.js");', ""].join(
          "\n",
        ),
        "utf8",
      );
      writeFileSync(
        join(root, "leaf.js"),
        ['import "core-js/stable";', "export const leaf = 1;", ""].join("\n"),
        "utf8",
      );
      writeFileSync(join(root, "lazy.js"), 'module.exports = require("node:crypto");\n', "utf8");

      const closure = importClosure(join(root, "entry.js"));

      expect(closure).toEqual([
        "reflect-metadata",
        "left-pad",
        "./middle.js",
        "./leaf.js",
        "./lazy.js",
        "core-js/stable",
        "node:crypto",
      ]);
      expect(closure.filter((specifier) => !isRelative(specifier))).toEqual([
        "reflect-metadata",
        "left-pad",
        "core-js/stable",
        "node:crypto",
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  // Given: the forms a token scan misses (a space before the parenthesis, a comment between the
  // keyword and the specifier, import attributes) beside text that spells a call without making
  // one (a string, a template, a comment, `import.meta`). When: the closure is scanned. Then: the
  // four calls are listed in source order, nothing else is, and the predicate rejects each.
  it("reads a spaced, commented, or attributed form, and never a call spelled in a string", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-anchors-forms-"));

    try {
      writeFileSync(
        join(root, "entry.js"),
        [
          'export const spaced = () => import ("spaced-dynamic");',
          'const required = require ("spaced-require");',
          'import/* between the keyword and the specifier */"commented-side-effect";',
          'export const attributed = () => import("attributed-json", { with: { type: "json" } });',
          "export const quoted = 'require(\"quoted-text\")';",
          'export const templated = `import("templated-text")`;',
          '// import "commented-out";',
          "export const here = import.meta.url;",
          "export const entry = required;",
          "",
        ].join("\n"),
        "utf8",
      );

      const closure = importClosure(join(root, "entry.js"));

      expect(closure).toEqual([
        "spaced-dynamic",
        "spaced-require",
        "commented-side-effect",
        "attributed-json",
      ]);
      expect(closure.filter((specifier) => !isRelative(specifier))).toEqual(closure);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
