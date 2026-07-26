import { describe, expect, it } from "vitest";

import * as protocol from "../src/index.js";
import { emitMarkdownSpec } from "../src/import/emit-markdown.js";
import { importFindingIds, importTypeScriptSpec } from "../src/import/import.js";
import { MarkdownEmissionError } from "../src/import/markdown-fidelity.js";
import type { ReifiedSpec } from "../src/extract/reify.js";

function specSource(body: string, title = 'title: "Review-08 import",'): string {
  return `import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const reviewed = spec({
  id: specId("spec:import.review-08"),
  ${title}
  kind: "example",
  altitude: "story",
  readiness: "idea",
  ${body}
});
`;
}

function packSource(): string {
  return `import { pack, packId, ref } from "@libar-dev/software-delivery-protocol";
export const reviewedPack = pack({
  id: packId("pack:import-review-08"),
  specs: [ref("spec:import.review-08")],
  modelRefs: [],
});
`;
}

describe("review-08 pure import regressions", () => {
  it("refuses a title-less Spec with a precise authored path", () => {
    const result = importTypeScriptSpec(specSource("", ""), "title-less.sdp.ts");
    const finding = result.findings.find(
      (entry) => entry.validatorId === importFindingIds.unsupportedConstruct,
    );

    expect(result.emitted).toBeUndefined();
    expect(finding?.message).toContain("first divergent path: title");
    expect(finding?.message).not.toContain("# undefined");
  });

  it.each([
    [
      "intent",
      `behavior: { examples: [{ given: ["a cart"], when: ["submit"], then: ["an order"] }] },`,
    ],
    ["design", "design: {},"],
    [
      "relations",
      `relations: [
        refines("spec:import.parent"),
        refines("spec:import.parent"),
      ],`,
    ],
  ])("names the first divergent %s path", (path, body) => {
    const result = importTypeScriptSpec(specSource(body), `${path}.sdp.ts`);
    const finding = result.findings.find(
      (entry) => entry.validatorId === importFindingIds.unsupportedConstruct,
    );

    expect(result.emitted).toBeUndefined();
    expect(finding?.message).toContain(`first divergent path: ${path}`);
  });

  it("refuses a mixed Spec and Pack carrier with an actionable error", () => {
    const result = importTypeScriptSpec(`${specSource("")}\n${packSource()}`, "mixed.sdp.ts");
    const finding = result.findings.find(
      (entry) => entry.validatorId === importFindingIds.packUnsupported,
    );

    expect(result.emitted).toBeUndefined();
    expect(finding).toMatchObject({ severity: "error" });
    expect(finding).not.toHaveProperty("line");
    expect(finding?.message).toContain("move the Spec to its own TypeScript carrier");
    expect(finding?.message).not.toContain("mixed.sdp.ts");
  });

  it("retains the Pack finding beside a multi-Spec refusal", () => {
    const secondSpec = specSource("")
      .replaceAll("reviewed", "second")
      .replaceAll("spec:import.review-08", "spec:import.review-08-second");
    const result = importTypeScriptSpec(
      `${specSource("")}\n${secondSpec}\n${packSource()}`,
      "multiple-with-pack.sdp.ts",
    );

    expect(result.findings.map((finding) => finding.validatorId)).toEqual([
      importFindingIds.packUnsupported,
      importFindingIds.unsupportedConstruct,
    ]);
    expect(result.findings.every((finding) => finding.severity === "error")).toBe(true);
  });

  it("exports the typed emission error beside the public emitter", () => {
    expect("MarkdownEmissionError" in protocol).toBe(true);
    const lossy: ReifiedSpec = {
      data: {
        id: "spec:import.lossy",
        title: "Lossy",
        kind: "behavior",
        altitude: "story",
        readiness: "idea",
        relations: [],
        design: {},
      },
      id: "spec:import.lossy",
      file: "lossy.sdp.ts",
      line: 1,
    };

    expect(() => emitMarkdownSpec(lossy)).toThrow(MarkdownEmissionError);
  });
});
