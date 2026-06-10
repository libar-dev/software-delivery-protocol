import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { extract, extractFindingIds, serializeGraph, validateAuthoredModel } from "../src/index.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));

function corpusRoot(name: string): string {
  return fileURLToPath(new URL(`./fixtures/extract/${name}`, import.meta.url));
}

/**
 * On-disk extractor corpora (the extractor reads files, not in-memory objects), should-fail /
 * should-pass style: each pins one extraction finding id. Three names recorded in
 * `test/fixtures/authored-model.fixtures.ts` are activated here.
 */
describe("extraction corpora", () => {
  it("invalid-non-static-id: envelope hard error; the static sibling still extracts (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-id") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("id");
    expect(errors[0]?.file).toBe("non-static-id.sdp.ts");
    expect(result.model.specs.map((entry) => entry.id)).toEqual(["spec:orders.static-sibling"]);
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:orders.static-sibling"]);
  });

  it("invalid-malformed-id: a static id failing the id grammar is an invalid-id hard error", () => {
    const result = extract({ root: corpusRoot("invalid-malformed-id") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.invalidId);
    expect(result.model.specs).toEqual([]);
    expect(result.graph.nodes).toEqual([]);
  });

  it("invalid-non-static-section: that one property drops with a warning; the spec survives", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-section") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("intent.value");

    const [survivingSpec] = result.model.specs;
    expect(survivingSpec?.id).toBe("spec:orders.non-static-section");
    expect(survivingSpec?.intent?.outcome).toBe(
      "Survive extraction with only the non-static property dropped.",
    );
    expect(survivingSpec?.intent?.value).toBeUndefined();

    const node = result.graph.nodes.find((entry) => entry.id === "spec:orders.non-static-section");
    expect(node?.nodeType).toBe("Primitive");
  });

  it("invalid-hand-authored-satisfies-edge: a raw relations[] entry is an envelope error", () => {
    const result = extract({ root: corpusRoot("invalid-hand-authored-satisfies-edge") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("relations[0]");
    expect(result.model.specs).toEqual([]);
    expect(result.graph.nodes).toEqual([]);
    expect(result.graph.edges).toEqual([]);
  });

  it("duplicate-id: both sites reported (L2); neither enters the graph; the model records both", () => {
    const result = extract({ root: corpusRoot("duplicate-id") });
    const errors = result.report.findings.filter(
      (finding) => finding.validatorId === extractFindingIds.duplicateId,
    );

    expect(errors).toHaveLength(2);
    expect(new Set(errors.map((finding) => finding.file)).size).toBe(2);
    expect(errors.every((finding) => finding.subjectId === "spec:orders.duplicate")).toBe(true);
    expect(result.graph.nodes).toEqual([]);
    expect(result.model.specs).toHaveLength(2);
  });

  it("dangling-relation: the edge is emitted, not dropped; the model validator flags it", () => {
    const result = extract({ root: corpusRoot("dangling-relation") });

    expect(result.report.findings).toEqual([]);
    expect(result.graph.edges).toContainEqual({
      from: "spec:orders.dangling-relation",
      type: "refines",
      to: "spec:orders.missing-target",
      claim: "declared",
    });

    const modelFindings = validateAuthoredModel(result.model).findings;
    expect(
      modelFindings.some((finding) => finding.validatorId === "conformance/dangling-references"),
    ).toBe(true);
  });

  it("unrecognized-statement: the stray statement warns and is ignored; the spec extracts", () => {
    const result = extract({ root: corpusRoot("unrecognized-statement") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.unrecognizedStatement);
    expect(result.model.specs.map((entry) => entry.id)).toEqual(["spec:orders.recognized"]);
  });
});

describe("determinism self-check (rebuild twice, byte-compare — distinct from the golden oracle)", () => {
  it("two independent extractions of the example serialize byte-identically", () => {
    const first = serializeGraph(extract({ root: exampleRoot }).graph);
    const second = serializeGraph(extract({ root: exampleRoot }).graph);

    expect(second).toBe(first);
  });
});
