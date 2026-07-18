import { describe, expect, it } from "vitest";

import { reifyTypeScriptCarrier } from "../src/extract/carrier.js";
import { emitMarkdownSpec } from "../src/import/emit-markdown.js";
import { importFindingIds, importTypeScriptSpec } from "../src/import/import.js";

function specSource(id: string, title: string): string {
  return `import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const authoredSpec = spec({
  id: specId("${id}"),
  title: "${title}",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
});
`;
}

function packSource(): string {
  return `import { pack, packId, ref } from "@libar-dev/software-delivery-protocol";

export const authoredPack = pack({
  id: packId("pack:import-test"),
  title: "Import test pack",
  framing: "A Pack remains TypeScript-authored.",
  specs: [ref("spec:import.healthy")],
  modelRefs: [],
});
`;
}

describe("importTypeScriptSpec", () => {
  it("emits one sibling Markdown document for a healthy TypeScript Spec", () => {
    // Given
    const relativePath = "specs/import.healthy.sdp.ts";
    const source = specSource("spec:import.healthy", "Import a healthy Spec");
    const reification = reifyTypeScriptCarrier(source, relativePath);
    const spec = reification.specs[0];

    // When
    const result = importTypeScriptSpec(source, relativePath);

    // Then
    expect(spec).toBeDefined();
    if (spec !== undefined) {
      expect(result).toEqual({
        emitted: {
          path: "specs/import.healthy.sdp.md",
          content: emitMarkdownSpec(spec),
        },
        findings: [],
      });
    }
  });

  it("refuses a TypeScript carrier with reification errors and names its file", () => {
    // Given
    const relativePath = "specs/refused.sdp.ts";
    const source = "export const = ;";

    // When
    const result = importTypeScriptSpec(source, relativePath);

    // Then
    expect(result).not.toHaveProperty("emitted");
    const refusal = result.findings.find(
      (finding) => finding.validatorId === importFindingIds.refusal,
    );

    expect(refusal).toBeDefined();
    if (refusal !== undefined) {
      expect(refusal.severity).toBe("info");
      expect(refusal.message).toContain(relativePath);
    }
  });

  it("returns reifier findings unchanged when a carrier is refused", () => {
    // Given
    const relativePath = "specs/pass-through.sdp.ts";
    const source = "export const = ;";
    const reification = reifyTypeScriptCarrier(source, relativePath);
    const reifierFinding = reification.findings[0];

    // When
    const result = importTypeScriptSpec(source, relativePath);

    // Then
    expect(reifierFinding).toBeDefined();
    if (reifierFinding !== undefined) {
      const importedFinding = result.findings.find(
        (finding) => finding.validatorId === reifierFinding.validatorId,
      );

      expect(importedFinding).toEqual(reifierFinding);
      expect(importedFinding).toMatchObject({
        validatorId: reifierFinding.validatorId,
        file: reifierFinding.file,
        line: reifierFinding.line,
      });
    }
  });

  it("reports a Pack-only module as unsupported without emitting Markdown", () => {
    // Given
    const relativePath = "specs/import-test.pack.sdp.ts";

    // When
    const result = importTypeScriptSpec(packSource(), relativePath);

    // Then
    expect(result).not.toHaveProperty("emitted");
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        validatorId: importFindingIds.packUnsupported,
        severity: "info",
      }),
    );
  });

  it("reports an empty module without emitting Markdown", () => {
    // Given
    const relativePath = "specs/empty.sdp.ts";

    // When
    const result = importTypeScriptSpec("", relativePath);

    // Then
    expect(result).not.toHaveProperty("emitted");
    const emptyFinding = result.findings.find(
      (finding) => finding.validatorId === importFindingIds.empty,
    );

    expect(emptyFinding).toBeDefined();
    if (emptyFinding !== undefined) {
      expect(emptyFinding.severity).toBe("info");
      expect(emptyFinding.message).toContain(relativePath);
    }
  });

  it("emits a Spec but reports the Pack portion of a mixed module", () => {
    // Given
    const relativePath = "specs/mixed.sdp.ts";
    const source = `${specSource("spec:import.mixed", "Import a mixed module")}\n${packSource()}`;

    // When
    const result = importTypeScriptSpec(source, relativePath);

    // Then
    expect(result.emitted).toEqual(
      expect.objectContaining({ path: "specs/mixed.sdp.md" }),
    );
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        validatorId: importFindingIds.packUnsupported,
        severity: "info",
      }),
    );
  });

  it("refuses a module that reifies more than one Spec", () => {
    // Given
    const relativePath = "specs/multiple.sdp.ts";
    const source = `${specSource("spec:import.first", "First imported Spec")}\n${specSource("spec:import.second", "Second imported Spec")}`;

    // When
    const result = importTypeScriptSpec(source, relativePath);

    // Then
    expect(result).not.toHaveProperty("emitted");
    const unsupportedConstruct = result.findings.find(
      (finding) => finding.validatorId === importFindingIds.unsupportedConstruct,
    );

    expect(unsupportedConstruct).toBeDefined();
    if (unsupportedConstruct !== undefined) {
      expect(unsupportedConstruct.severity).toBe("info");
      expect(unsupportedConstruct.message).toContain(relativePath);
    }
  });
});
