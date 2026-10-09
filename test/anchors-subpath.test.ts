import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const builtSubpath = resolve(repositoryRoot, "dist/anchors.js");

const SPECIFIER_PATTERN =
  /(?:^|\n)\s*(?:import|export)\b[^;]*?\bfrom\s+["']([^"']+)["']|\brequire\(\s*["']([^"']+)["']\s*\)|\bimport\(\s*["']([^"']+)["']\s*\)/gu;

/** Every module specifier the built file and its relative imports reach, in discovery order. */
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

      if (specifier.startsWith(".")) {
        queue.push(resolve(dirname(file), specifier));
      }
    }
  }

  return specifiers;
}

describe("the anchors subpath", () => {
  it("builds to a module whose import closure carries no node: specifier and no ts-morph", async () => {
    if (!existsSync(builtSubpath)) {
      execFileSync("npm", ["run", "build"], { cwd: repositoryRoot, encoding: "utf8" });
    }

    const closure = importClosure(builtSubpath);
    expect(closure.filter((specifier) => specifier.startsWith("node:"))).toEqual([]);
    expect(closure.filter((specifier) => /(^|\/)ts-morph(\/|$)/u.test(specifier))).toEqual([]);
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
