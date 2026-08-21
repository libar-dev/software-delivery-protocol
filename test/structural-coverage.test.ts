import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import ts from "typescript";
import { afterEach, describe, expect, it } from "vitest";

import { auditStructuralCoverage } from "./helpers/structural-coverage.js";

const temporaryRoots = new Set<string>();

interface RuntimePathCase {
  readonly caseName: string;
  readonly auditedModule: string;
  readonly importedModule: string;
  readonly exportName: string;
  readonly extraFiles: Readonly<Record<string, string>>;
}

const runtimePathCases: readonly RuntimePathCase[] = [
  {
    caseName: "a direct declaration",
    auditedModule: "unit.ts",
    importedModule: "unit.ts",
    exportName: "helper",
    extraFiles: {},
  },
  {
    caseName: "an aliased named export",
    auditedModule: "barrel.ts",
    importedModule: "barrel.ts",
    exportName: "invoke",
    extraFiles: { "barrel.ts": 'export { helper as invoke } from "./unit.js";\n' },
  },
  {
    caseName: "nested acyclic value stars",
    auditedModule: "outer.ts",
    importedModule: "outer.ts",
    exportName: "helper",
    extraFiles: {
      "middle.ts": 'export * from "./unit.js";\n',
      "outer.ts": 'export * from "./middle.js";\n',
    },
  },
  {
    caseName: "a diamond to one origin",
    auditedModule: "barrel.ts",
    importedModule: "barrel.ts",
    exportName: "helper",
    extraFiles: {
      "left.ts": 'export * from "./unit.js";\n',
      "right.ts": 'export * from "./unit.js";\n',
      "barrel.ts": 'export * from "./left.js";\nexport * from "./right.js";\n',
    },
  },
];

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

  it.each([
    ["named", 'export type { helper } from "./origin.js";\n'],
    ["star", 'export type * from "./origin.js";\n'],
  ])("rejects diagnostics-clean %s type-only exports", (_form, barrel) => {
    // Given: a barrel and covering source use the callable declaration only as a type.
    const program = fixtureProgram({
      "origin.ts": "export function helper(): void {}\n",
      "barrel.ts": barrel,
      "cover.ts": 'import type { helper } from "./barrel.js";\ntype Helper = typeof helper;\n',
    });

    // When: the erased barrel export is audited.
    const result = auditStructuralCoverage(program, "barrel.ts#helper", "cover.ts");

    // Then: a clean type-space path cannot certify a runtime export.
    expect(ts.getPreEmitDiagnostics(program)).toEqual([]);
    expect(result).toBe("exported unit missing");
  });

  it.each([
    ["named", 'export type { helper } from "./origin.js";\n'],
    ["star", 'export type * from "./origin.js";\n'],
  ])("rejects attempted value use through %s type-only exports", (_form, barrel) => {
    // Given: a covering source attempts to call an export erased by its barrel.
    const program = fixtureProgram({
      "origin.ts": "export function helper(): void {}\n",
      "barrel.ts": barrel,
      "cover.ts": 'import { helper } from "./barrel.js";\nhelper();\n',
    });

    // When: coverage is audited independently of compiler diagnostics.
    const result = auditStructuralCoverage(program, "barrel.ts#helper", "cover.ts");

    // Then: attempted value use cannot turn an erased export into runtime evidence.
    expect(result).toBe("exported unit missing");
  });

  it.each(runtimePathCases)(
    "accepts $caseName",
    ({ auditedModule, importedModule, exportName, extraFiles }) => {
      // Given: exactly one callable origin reaches the audited and imported module.
      const program = fixtureProgram({
        "unit.ts": "export function helper(): void {}\n",
        ...extraFiles,
        "cover.ts": `import { ${exportName} } from "./${importedModule.slice(0, -3)}.js";\n${exportName}();\n`,
      });

      // When: the runtime path and direct call are audited.
      const result = auditStructuralCoverage(program, `${auditedModule}#${exportName}`, "cover.ts");

      // Then: the singleton callable origin is certified.
      expect(result).toBe("ok");
    },
  );

  it("rejects two distinct acyclic value candidates", () => {
    // Given: two value stars contribute different callable origins under one name.
    const program = fixtureProgram({
      "left.ts": "export function helper(): void {}\n",
      "right.ts": "export function helper(): void {}\n",
      "barrel.ts": 'export * from "./left.js";\nexport * from "./right.js";\n',
      "cover.ts": 'import { helper } from "./barrel.js";\nhelper();\n',
    });

    // When: the conflicting runtime export is audited.
    const result = auditStructuralCoverage(program, "barrel.ts#helper", "cover.ts");

    // Then: ambiguity fails closed despite the attempted call.
    expect(result).toBe("exported unit missing");
  });

  it.each([
    ["cycle first", 'export * from "./b.js";\nexport * from "./origin.js";\n'],
    ["origin first", 'export * from "./origin.js";\nexport * from "./b.js";\n'],
  ])("rejects every cyclic-star entry and traversal order with %s", (_order, aSource) => {
    // Given: both SCC entries can reach one callable origin through a value-star cycle.
    const program = fixtureProgram({
      "origin.ts": "export function helper(): void {}\n",
      "a.ts": aSource,
      "b.ts": 'export * from "./a.js";\n',
      "cover-a.ts": 'import { helper } from "./a.js";\nhelper();\n',
      "cover-b.ts": 'import { helper } from "./b.js";\nhelper();\n',
    });

    // When: every unit/import entry pair is traversed in both orders.
    const paths = [
      ["a.ts#helper", "cover-a.ts"],
      ["a.ts#helper", "cover-b.ts"],
      ["b.ts#helper", "cover-a.ts"],
      ["b.ts#helper", "cover-b.ts"],
    ] as const;
    const forward = paths.map(([unit, covering]) =>
      auditStructuralCoverage(program, unit, covering),
    );
    const reverse = [...paths]
      .reverse()
      .map(([unit, covering]) => auditStructuralCoverage(program, unit, covering));

    // Then: every candidate-relevant cycle fails closed without order dependence.
    expect(forward).toEqual(Array.from({ length: 4 }, () => "exported unit missing"));
    expect(reverse).toEqual(Array.from({ length: 4 }, () => "exported unit missing"));
  });

  it("accepts an explicit named export that shadows unrelated cyclic stars", () => {
    // Given: an explicit callable export has precedence over a separate star cycle.
    const program = fixtureProgram({
      "origin.ts": "export function helper(): void {}\n",
      "a.ts": 'export { helper } from "./origin.js";\nexport * from "./b.js";\n',
      "b.ts": 'export * from "./a.js";\n',
      "cover.ts": 'import { helper } from "./a.js";\nhelper();\n',
    });

    // When: the explicitly exported helper is audited.
    const result = auditStructuralCoverage(program, "a.ts#helper", "cover.ts");

    // Then: unrelated cyclic stars do not defeat TypeScript named-export precedence.
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
