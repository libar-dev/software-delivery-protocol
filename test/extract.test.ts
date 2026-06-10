import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { extract, extractFindingIds, serializeGraph, validateAuthoredModel } from "../src/index.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));

const materializedRoots: string[] = [];

function corpusRoot(name: string): string {
  const root = materializeExtractCorpus(name);
  materializedRoots.push(root);
  return root;
}

afterAll(() => {
  for (const root of materializedRoots) {
    removeMaterializedCorpus(root);
  }
});

/**
 * On-disk extractor corpora (the extractor reads files, not in-memory objects), should-fail /
 * should-pass style: each pins one extraction finding id. Three names recorded in
 * `test/fixtures/authored-model.fixtures.ts` are activated here. The corpora are committed as
 * `*.sdp.ts.txt` and materialized into temp directories — see `helpers/extract-corpus.ts`.
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

  it("invalid-reserved-property: a hand-authored delivery fact at the top level is an envelope hard error; the sibling survives (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-reserved-property") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.reservedProperty);
    expect(errors[0]?.path).toBe("deliveryFacts");
    expect(errors[0]?.subjectId).toBe("spec:orders.reserved-property");
    expect(result.model.specs.map((entry) => entry.id)).toEqual([
      "spec:orders.reserved-static-sibling",
    ]);
    expect(result.graph.nodes.map((node) => node.id)).toEqual([
      "spec:orders.reserved-static-sibling",
    ]);
  });

  it("unrecognized-property: a typoed section name drops with a warning; the spec survives without it", () => {
    const result = extract({ root: corpusRoot("unrecognized-property") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.unrecognizedProperty);
    expect(warnings[0]?.path).toBe("behaviour");

    const [survivingSpec] = result.model.specs;
    expect(survivingSpec?.id).toBe("spec:orders.typoed-section");
    expect((survivingSpec as unknown as Record<string, unknown>).behaviour).toBeUndefined();

    const node = result.graph.nodes.find((entry) => entry.id === "spec:orders.typoed-section");
    expect(node?.nodeType).toBe("Primitive");
  });

  it("id-shaped-string-content: a raw id-shaped string in section content is prose — kept, edge-free, finding-free", () => {
    const result = extract({ root: corpusRoot("id-shaped-string-content") });

    // The MD-10 guard covers the typed affordance only (`ref(…)` is rejected, below); prose that
    // happens to look like an id is content by definition — the documented boundary, pinned.
    expect(result.report.findings).toEqual([]);

    const [survivingSpec] = result.model.specs;
    expect(survivingSpec?.id).toBe("spec:orders.id-shaped-string");
    expect(survivingSpec?.behavior?.examples).toEqual(["spec:orders.promoted-child"]);
    expect(result.graph.edges).toEqual([]);
  });

  it("ref-in-section-content: an id builder in section content drops the owning property (MD-10)", () => {
    const result = extract({ root: corpusRoot("ref-in-section-content") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("behavior.examples");
    expect(warnings[0]?.message).toContain("relations carry linkage");

    const [survivingSpec] = result.model.specs;
    expect(survivingSpec?.id).toBe("spec:orders.ref-in-section");
    expect(survivingSpec?.behavior?.rules).toEqual([
      "A real rule survives beside the dropped property.",
    ]);
    expect(survivingSpec?.behavior?.examples).toBeUndefined();
    // Nothing was smuggled: the graph carries no edge and no content naming the ref target.
    expect(result.graph.edges).toEqual([]);
    expect(JSON.stringify(result.graph.nodes)).not.toContain("spec:orders.promoted-child");
  });
});

/**
 * The anchored-layer corpora (Slice 2): anchor constants in `*.ts` source files, committed
 * defused as `*.ts.txt`. Each pins one outcome, should-fail / should-pass style (`05` §5).
 */
describe("anchor extraction corpora", () => {
  it("anchored-binding: the full ladder — anchored edges and delivery facts per `02` §2", () => {
    const result = extract({ root: corpusRoot("anchored-binding") });

    expect(result.report.findings).toEqual([]);
    expect(result.model.anchors).toHaveLength(2);

    const anchoredEdges = result.graph.edges.filter((edge) => edge.claim === "anchored");
    expect(anchoredEdges).toEqual(
      expect.arrayContaining([
        {
          from: "impl:orders.anchored-parent-use-case",
          type: "satisfies",
          to: "spec:orders.anchored-parent",
          claim: "anchored",
        },
        {
          from: "test:orders.anchored-parent.example",
          type: "verifies",
          to: "spec:orders.anchored-parent.example",
          claim: "anchored",
        },
      ]),
    );
    expect(anchoredEdges).toHaveLength(2);

    const factsById = new Map(
      result.graph.nodes
        .filter((node) => node.nodeType === "Primitive")
        .map((node) => [node.id, node.deliveryFacts ?? []]),
    );
    // The parent: implemented from the resolving satisfies binding, has-verifier from the
    // enabled example; the example: has-verifier from the test anchored directly to it.
    expect(factsById.get("spec:orders.anchored-parent")).toEqual(["implemented", "has-verifier"]);
    expect(factsById.get("spec:orders.anchored-parent.example")).toEqual(["has-verifier"]);

    const codeNode = result.graph.nodes.find(
      (node) => node.id === "impl:orders.anchored-parent-use-case",
    );
    const testNode = result.graph.nodes.find(
      (node) => node.id === "test:orders.anchored-parent.example",
    );
    expect(codeNode?.nodeType).toBe("CodeNode");
    expect(testNode?.nodeType).toBe("Anchor");
  });

  it("unenabled-verifier: a declared verifies without a test binding confers nothing (MD-7)", () => {
    const result = extract({ root: corpusRoot("unenabled-verifier") });

    expect(result.report.findings).toEqual([]);

    for (const node of result.graph.nodes) {
      if (node.nodeType === "Primitive") {
        expect(node.deliveryFacts ?? []).toEqual([]);
      }
    }
  });

  it("invalid-non-static-anchor: envelope hard error; the static sibling still extracts (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-anchor") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("satisfies");
    expect(result.model.anchors.map((entry) => entry.id)).toEqual([
      "impl:orders.static-sibling-binding",
    ]);
  });

  it("invalid-anchor-namespace: a code anchor with a test: id is an invalid-id hard error", () => {
    const result = extract({ root: corpusRoot("invalid-anchor-namespace") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.invalidId);
    expect(result.model.anchors).toEqual([]);
  });

  it("duplicate-anchor-id: both sites reported (L2); neither enters the graph; the model records both", () => {
    const result = extract({ root: corpusRoot("duplicate-anchor-id") });
    const errors = result.report.findings.filter(
      (finding) => finding.validatorId === extractFindingIds.duplicateId,
    );

    expect(errors).toHaveLength(2);
    expect(new Set(errors.map((finding) => finding.file)).size).toBe(2);
    expect(errors.every((finding) => finding.subjectId === "impl:orders.duplicate-binding")).toBe(
      true,
    );
    expect(result.graph.nodes).toEqual([]);
    expect(result.model.anchors).toHaveLength(2);
  });

  it("dangling-anchor: the edge is emitted, no fact is conferred, and the model validator flags it", () => {
    const result = extract({ root: corpusRoot("dangling-anchor") });

    expect(result.report.findings).toEqual([]);
    expect(result.graph.edges).toContainEqual({
      from: "impl:orders.dangling-binding",
      type: "satisfies",
      to: "spec:orders.missing-implementation-target",
      claim: "anchored",
    });
    expect(
      result.graph.nodes.some(
        (node) => node.nodeType === "Primitive" && (node.deliveryFacts ?? []).length > 0,
      ),
    ).toBe(false);

    const modelFindings = validateAuthoredModel(result.model).findings;
    expect(
      modelFindings.some((finding) => finding.validatorId === "conformance/dangling-references"),
    ).toBe(true);
  });

  it("misplaced-anchor: authoring calls outside their surface warn and are not extracted", () => {
    const result = extract({ root: corpusRoot("misplaced-anchor") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(2);
    expect(
      warnings.every((finding) => finding.validatorId === extractFindingIds.misplacedAuthoring),
    ).toBe(true);
    expect(result.model.anchors).toEqual([]);
    expect(result.model.specs).toEqual([]);
  });

  it("non-static-anchor-label: the label drops with a warning; the binding survives whole", () => {
    const result = extract({ root: corpusRoot("non-static-anchor-label") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("label");

    const [anchor] = result.model.anchors;
    expect(anchor?.id).toBe("impl:orders.non-static-label");
    expect(anchor?.label).toBeUndefined();
    expect(result.graph.edges).toContainEqual({
      from: "impl:orders.non-static-label",
      type: "satisfies",
      to: "spec:orders.labelled-target",
      claim: "anchored",
    });
  });
});

describe("determinism self-check (rebuild twice, byte-compare — distinct from the golden oracle)", () => {
  it("two independent extractions of the example serialize byte-identically", () => {
    const first = serializeGraph(extract({ root: exampleRoot }).graph);
    const second = serializeGraph(extract({ root: exampleRoot }).graph);

    expect(second).toBe(first);
  });
});
