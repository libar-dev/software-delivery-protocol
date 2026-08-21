import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import ts from "typescript";
import { afterEach, describe, expect, it } from "vitest";

import { auditStructuralCoverage } from "./helpers/structural-coverage.js";

const temporaryRoots = new Set<string>();

afterEach(() => {
  for (const root of temporaryRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  temporaryRoots.clear();
});

function fixtureProgram(files: Readonly<Record<string, string>>): ts.Program {
  const root = mkdtempSync(join(tmpdir(), "sdp-structural-coverage-"));
  temporaryRoots.add(root);

  const rootNames = Object.entries(files).map(([relativePath, source]) => {
    const path = join(root, relativePath);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, source, "utf8");
    return path;
  });
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    noEmit: true,
  } satisfies ts.CompilerOptions;
  const host = ts.createCompilerHost(options);
  host.getCurrentDirectory = () => root;

  return ts.createProgram({ rootNames, options, host });
}

describe("coarse structural coverage", () => {
  it("reports a missing runtime export when the named unit is absent", () => {
    // Given: a source module that does not export the rostered function.
    const program = fixtureProgram({
      "unit.ts": "export function other(): void {}\n",
      "cover.ts": 'import { other } from "./unit.js";\nother();\n',
    });

    // When: the named helper is audited against its covering source.
    const result = auditStructuralCoverage(program, "unit.ts#helper", "cover.ts");

    // Then: referential failure is distinguished from consumption failure.
    expect(result).toBe("exported unit missing");
  });

  it("reports missing consumption when the covering source removes the import", () => {
    // Given: an exported helper and a covering source with no import.
    const program = fixtureProgram({
      "unit.ts": "export function helper(): void {}\n",
      "cover.ts": "export const covered = true;\n",
    });

    // When: helper consumption is audited.
    const result = auditStructuralCoverage(program, "unit.ts#helper", "cover.ts");

    // Then: the absent value import is reported exactly.
    expect(result).toBe("covering source does not value-consume unit");
  });

  it("reports missing consumption when a named value import is unused", () => {
    // Given: the covering source imports the helper but never calls it.
    const program = fixtureProgram({
      "unit.ts": "export function helper(): void {}\n",
      "cover.ts": 'import { helper } from "./unit.js";\nexport const covered = true;\n',
    });

    // When: helper consumption is audited.
    const result = auditStructuralCoverage(program, "unit.ts#helper", "cover.ts");

    // Then: an unused import does not count as consumption.
    expect(result).toBe("covering source does not value-consume unit");
  });

  it("accepts an aliased named import used as a runtime call", () => {
    // Given: the covering source aliases and calls the helper.
    const program = fixtureProgram({
      "unit.ts": "export function helper(): void {}\n",
      "cover.ts": 'import { helper as invoke } from "./unit.js";\ninvoke();\n',
    });

    // When: helper consumption is audited.
    const result = auditStructuralCoverage(program, "unit.ts#helper", "cover.ts");

    // Then: checker-resolved aliases count as runtime consumption.
    expect(result).toBe("ok");
  });

  it("accepts a runtime call imported through a barrel re-export", () => {
    // Given: a barrel re-exports the helper and the covering source calls its import.
    const program = fixtureProgram({
      "unit.ts": "export function helper(): void {}\n",
      "barrel.ts": 'export { helper } from "./unit.js";\n',
      "cover.ts": 'import { helper } from "./barrel.js";\nhelper();\n',
    });

    // When: helper consumption is audited.
    const result = auditStructuralCoverage(program, "unit.ts#helper", "cover.ts");

    // Then: the re-export resolves to the rostered runtime symbol.
    expect(result).toBe("ok");
  });

  it("rejects a type-only import and type-only reference", () => {
    // Given: the helper appears only in erased type syntax.
    const program = fixtureProgram({
      "unit.ts": "export function helper(): void {}\n",
      "cover.ts": 'import type { helper } from "./unit.js";\ntype Helper = typeof helper;\n',
    });

    // When: helper consumption is audited.
    const result = auditStructuralCoverage(program, "unit.ts#helper", "cover.ts");

    // Then: type-only use is not runtime consumption.
    expect(result).toBe("covering source does not value-consume unit");
  });

  it.each(["unit.ts", "#helper", "unit.ts#", "unit.ts#helper#extra", ""])(
    "reports malformed unit reference %j as a missing export",
    (unit) => {
      // Given: a valid project and a malformed path#symbol reference.
      const program = fixtureProgram({
        "unit.ts": "export function helper(): void {}\n",
        "cover.ts": 'import { helper } from "./unit.js";\nhelper();\n',
      });

      // When: the malformed reference is audited.
      const result = auditStructuralCoverage(program, unit, "cover.ts");

      // Then: the closed result contract reports the unresolved export.
      expect(result).toBe("exported unit missing");
    },
  );
});
