import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { Project } from "ts-morph";
import { describe, expect, it } from "vitest";

import { reifyAnchorSourceFile } from "../src/extract/anchors.js";
import {
  extract,
  extractFindingIds,
  reifyMarkdownCarrier,
  reifyTypeScriptCarrier,
} from "../src/index.js";
import type { Finding } from "../src/validate/contracts.js";

const fixtureRoot = new URL("./fixtures/import/parity/", import.meta.url);

type FindingId = (typeof extractFindingIds)[keyof typeof extractFindingIds];
type MarkdownFindingId =
  | FindingId
  | "extract/invalid-frontmatter"
  | "extract/invalid-markdown-structure";
type TypeScriptReifier = "carrier" | "anchor";
type MatrixOutcome = "same-class" | "named-non-claim";

interface MatrixCell {
  readonly id: string;
  readonly typeScriptFinding: FindingId;
  readonly markdownFinding: MarkdownFindingId;
  readonly typeScriptReifier: TypeScriptReifier;
  readonly outcome: MatrixOutcome;
  readonly rationale?: string;
}

const matrix = [
  {
    id: "parse-error",
    typeScriptFinding: extractFindingIds.parseError,
    markdownFinding: "extract/invalid-frontmatter",
    typeScriptReifier: "carrier",
    outcome: "named-non-claim",
    rationale: "YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.",
  },
  {
    id: "non-static-envelope",
    typeScriptFinding: extractFindingIds.nonStaticEnvelope,
    markdownFinding: extractFindingIds.nonStaticEnvelope,
    typeScriptReifier: "carrier",
    outcome: "same-class",
  },
  {
    id: "invalid-id",
    typeScriptFinding: extractFindingIds.invalidId,
    markdownFinding: extractFindingIds.invalidId,
    typeScriptReifier: "carrier",
    outcome: "same-class",
  },
  {
    id: "duplicate-id",
    typeScriptFinding: extractFindingIds.duplicateId,
    markdownFinding: extractFindingIds.duplicateId,
    typeScriptReifier: "carrier",
    outcome: "same-class",
  },
  {
    id: "reserved-property",
    typeScriptFinding: extractFindingIds.reservedProperty,
    markdownFinding: extractFindingIds.reservedProperty,
    typeScriptReifier: "carrier",
    outcome: "same-class",
  },
  {
    id: "non-static-section",
    typeScriptFinding: extractFindingIds.nonStaticSection,
    markdownFinding: "extract/invalid-markdown-structure",
    typeScriptReifier: "carrier",
    outcome: "named-non-claim",
    rationale:
      "TS degrades optional section properties while Markdown deliberately refuses malformed documents whole.",
  },
  {
    id: "unowned-prose",
    typeScriptFinding: extractFindingIds.unownedProse,
    markdownFinding: extractFindingIds.unownedProse,
    typeScriptReifier: "carrier",
    outcome: "same-class",
  },
  {
    id: "unrecognized-statement",
    typeScriptFinding: extractFindingIds.unrecognizedStatement,
    markdownFinding: "extract/invalid-markdown-structure",
    typeScriptReifier: "carrier",
    outcome: "named-non-claim",
    rationale: "Markdown owns prose and structures, not TypeScript statement recognition.",
  },
  {
    id: "unrecognized-property",
    typeScriptFinding: extractFindingIds.unrecognizedProperty,
    markdownFinding: extractFindingIds.unrecognizedProperty,
    typeScriptReifier: "carrier",
    outcome: "same-class",
  },
  {
    id: "misplaced-authoring",
    typeScriptFinding: extractFindingIds.misplacedAuthoring,
    markdownFinding: "extract/invalid-markdown-structure",
    typeScriptReifier: "anchor",
    outcome: "named-non-claim",
    rationale:
      "Markdown has no executable authoring-call surface; equivalent placement is document structure.",
  },
] as const satisfies readonly MatrixCell[];

function findingIds(findings: readonly Finding[]): readonly string[] {
  return findings.map((finding) => finding.validatorId);
}

function reifyTypeScriptProbe(
  sourceText: string,
  relativePath: string,
  reifier: TypeScriptReifier,
): { readonly findings: readonly Finding[] } {
  switch (reifier) {
    case "carrier":
      return reifyTypeScriptCarrier(sourceText, relativePath);
    case "anchor": {
      const project = new Project({
        useInMemoryFileSystem: true,
        compilerOptions: { noLib: true },
      });
      return reifyAnchorSourceFile(
        project.createSourceFile(relativePath, sourceText),
        relativePath,
      );
    }
  }
}

function readProbePair(id: string): { readonly typeScript: string; readonly markdown: string } {
  return {
    typeScript: readFileSync(new URL(`${id}.sdp.ts`, fixtureRoot), "utf8"),
    markdown: readFileSync(new URL(`${id}.sdp.md`, fixtureRoot), "utf8"),
  };
}

function duplicateFindingIds(pair: {
  readonly typeScript: string;
  readonly markdown: string;
}): readonly string[] {
  const root = mkdtempSync(join(tmpdir(), "sdp-refusal-parity-"));
  try {
    writeFileSync(join(root, "duplicate-id.sdp.ts"), pair.typeScript, "utf8");
    writeFileSync(join(root, "duplicate-id.sdp.md"), pair.markdown, "utf8");
    return findingIds(extract({ root }).report.findings);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("the bounded TypeScript and Markdown refusal-parity matrix", () => {
  it.each(matrix)("records %s", (cell) => {
    // Given
    const pair = readProbePair(cell.id);
    const typeScript = reifyTypeScriptProbe(
      pair.typeScript,
      `${cell.id}.sdp.ts`,
      cell.typeScriptReifier,
    );
    const markdown = reifyMarkdownCarrier(pair.markdown, `${cell.id}.sdp.md`);

    // When
    const typeScriptIds = findingIds(typeScript.findings);
    const markdownIds = findingIds(markdown.findings);

    // Then
    if (cell.id === "duplicate-id") {
      expect(typeScriptIds).toEqual([]);
      expect(markdownIds).toEqual([]);
      expect(duplicateFindingIds(pair)).toEqual([
        extractFindingIds.duplicateId,
        extractFindingIds.duplicateId,
      ]);
      return;
    }

    expect(typeScriptIds).toContain(cell.typeScriptFinding);
    expect(markdownIds).toContain(cell.markdownFinding);
    if (cell.outcome === "same-class") {
      expect(cell.markdownFinding).toBe(cell.typeScriptFinding);
      return;
    }

    expect(cell.markdownFinding).not.toBe(cell.typeScriptFinding);
    expect(cell.rationale).toBeDefined();
  });
});
