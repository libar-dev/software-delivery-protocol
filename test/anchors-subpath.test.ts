import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const builtSubpath = resolve(repositoryRoot, "dist/anchors.js");

/**
 * Every runtime import form: a side-effect `import "x"`, `import ... from "x"`,
 * `export ... from "x"`, `export * from "x"`, `import("x")`, and `require("x")`. A declaration is
 * read from a statement start (file start, line start, or after `;`), so a quoted word is never
 * taken for one; its specifier is the first string after `from`, or the string straight after
 * `import` when the form has no `from`.
 */
const SPECIFIER_PATTERN =
  /(?:^|[\n;])\s*(?:import|export)\b\s*(?:[^;"']*?\bfrom\s*)?["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)|\brequire\(\s*["']([^"']+)["']\s*\)/gu;

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
    const text = readFileSync(file, "utf8");

    for (const match of text.matchAll(SPECIFIER_PATTERN)) {
      const specifier = match[1] ?? match[2] ?? match[3];

      if (specifier === undefined) {
        continue;
      }

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
});
