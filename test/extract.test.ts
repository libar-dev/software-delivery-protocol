import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import {
  extract,
  extractFindingIds,
  graphValidatorIds,
  serializeGraph,
  validateGraph,
} from "../src/index.js";
import type { GraphSchema, PrimitiveNode } from "../src/index.js";
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

function primitiveNode(graph: GraphSchema, id: string): PrimitiveNode | undefined {
  const node = graph.nodes.find((entry) => entry.id === id);

  return node?.nodeType === "Primitive" ? node : undefined;
}

/**
 * On-disk extractor corpora (the extractor reads files, not in-memory objects), should-fail /
 * should-pass style: each pins one extraction finding id. The corpora are committed as
 * `*.sdp.ts.txt` / `*.ts.txt` and materialized into temp directories — see
 * `helpers/extract-corpus.ts`.
 */
describe("extraction corpora", () => {
  it("invalid-non-static-id: envelope hard error; the static sibling still extracts (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-id") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("id");
    expect(errors[0]?.file).toBe("non-static-id.sdp.ts");
    expect(result.counts.specs).toBe(1);
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:orders.static-sibling"]);
  });

  it("invalid-malformed-id: a static id failing the id grammar is an invalid-id hard error", () => {
    const result = extract({ root: corpusRoot("invalid-malformed-id") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.invalidId);
    expect(result.counts.specs).toBe(0);
    expect(result.graph.nodes).toEqual([]);
  });

  it("invalid-non-static-section: that one property drops with a warning; the spec survives", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-section") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("intent.value");

    const node = primitiveNode(result.graph, "spec:orders.non-static-section");
    expect(node?.sections?.intent?.outcome).toBe(
      "Survive extraction with only the non-static property dropped.",
    );
    expect(node?.sections?.intent?.value).toBeUndefined();
  });

  it("invalid-hand-authored-satisfies-edge: a raw relations[] entry is an envelope error", () => {
    const result = extract({ root: corpusRoot("invalid-hand-authored-satisfies-edge") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("relations[0]");
    expect(result.counts.specs).toBe(0);
    expect(result.graph.nodes).toEqual([]);
    expect(result.graph.edges).toEqual([]);
  });

  it("duplicate-id: both sites reported (L2); neither enters the graph; the counts record both", () => {
    const result = extract({ root: corpusRoot("duplicate-id") });
    const errors = result.report.findings.filter(
      (finding) => finding.validatorId === extractFindingIds.duplicateId,
    );

    expect(errors).toHaveLength(2);
    expect(new Set(errors.map((finding) => finding.file)).size).toBe(2);
    expect(errors.every((finding) => finding.subjectId === "spec:orders.duplicate")).toBe(true);
    expect(result.graph.nodes).toEqual([]);
    expect(result.counts.specs).toBe(2);
  });

  it("dangling-relation: the edge is emitted, not dropped; referential integrity flags it", () => {
    const result = extract({ root: corpusRoot("dangling-relation") });

    expect(result.report.findings).toEqual([]);
    expect(result.graph.edges).toContainEqual({
      from: "spec:orders.dangling-relation",
      type: "refines",
      to: "spec:orders.missing-target",
      claim: "declared",
    });

    const validation = validateGraph(result.graph).findings;
    expect(
      validation.some((finding) => finding.validatorId === graphValidatorIds.referentialIntegrity),
    ).toBe(true);
  });

  it("unrecognized-statement: the stray statement warns and is ignored; the spec extracts", () => {
    const result = extract({ root: corpusRoot("unrecognized-statement") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.unrecognizedStatement);
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:orders.recognized"]);
  });

  it("invalid-reserved-property: a hand-authored delivery fact at the top level is an envelope hard error; the sibling survives (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-reserved-property") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.reservedProperty);
    expect(errors[0]?.path).toBe("deliveryFacts");
    expect(errors[0]?.subjectId).toBe("spec:orders.reserved-property");
    expect(result.counts.specs).toBe(1);
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

    const node = primitiveNode(result.graph, "spec:orders.typoed-section");
    expect(node).toBeDefined();
    expect(JSON.stringify(node)).not.toContain("behaviour");
  });

  it("id-shaped-string-content: a raw id-shaped string in section content is prose — kept, edge-free, finding-free", () => {
    const result = extract({ root: corpusRoot("id-shaped-string-content") });

    // The MD-10 guard covers the typed affordance only (`ref(…)` is rejected, below); prose that
    // happens to look like an id is content by definition — the documented boundary, pinned.
    expect(result.report.findings).toEqual([]);

    const node = primitiveNode(result.graph, "spec:orders.id-shaped-string");
    expect(node?.sections?.behavior?.examples).toEqual(["spec:orders.promoted-child"]);
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

    const node = primitiveNode(result.graph, "spec:orders.ref-in-section");
    expect(node?.sections?.behavior?.rules).toEqual([
      "A real rule survives beside the dropped property.",
    ]);
    expect(node?.sections?.behavior?.examples).toBeUndefined();
    // Nothing was smuggled: the graph carries no edge and no content naming the ref target.
    expect(result.graph.edges).toEqual([]);
    expect(JSON.stringify(result.graph.nodes)).not.toContain("spec:orders.promoted-child");
  });
});

/**
 * The anchored-layer corpora: anchor constants in `*.ts` source files, committed defused as
 * `*.ts.txt`. Each pins one outcome, should-fail / should-pass style (`05` §5).
 */
describe("anchor extraction corpora", () => {
  it("anchored-binding: the full ladder — anchored edges and delivery facts per `02` §2", () => {
    const result = extract({ root: corpusRoot("anchored-binding") });

    expect(result.report.findings).toEqual([]);
    expect(result.counts.anchors).toBe(2);

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

    // The enabled trace is also conformance-clean: no verifies-linkage surfacing.
    expect(validateGraph(result.graph).findings).toEqual([]);
  });

  it("unenabled-verifier: a declared verifies without a test binding confers nothing (MD-7) and is surfaced", () => {
    const result = extract({ root: corpusRoot("unenabled-verifier") });

    expect(result.report.findings).toEqual([]);

    for (const node of result.graph.nodes) {
      if (node.nodeType === "Primitive") {
        expect(node.deliveryFacts ?? []).toEqual([]);
      }
    }

    // The verifies-linkage check names the incomplete spec↔test trace — informative, never a gate.
    const validation = validateGraph(result.graph).findings;
    expect(validation.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.verifiesLinkage);
    expect(validation[0]?.subjectId).toBe("spec:orders.unverified-parent.example");
  });

  it("invalid-non-static-anchor: envelope hard error; the static sibling still extracts (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-anchor") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("satisfies");
    expect(result.counts.anchors).toBe(1);
    expect(
      result.graph.nodes.some((node) => node.id === "impl:orders.static-sibling-binding"),
    ).toBe(true);
  });

  it("invalid-anchor-namespace: a code anchor with a test: id is an invalid-id hard error", () => {
    const result = extract({ root: corpusRoot("invalid-anchor-namespace") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.invalidId);
    expect(result.counts.anchors).toBe(0);
  });

  it("duplicate-anchor-id: both sites reported (L2); neither enters the graph; the counts record both", () => {
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
    expect(result.counts.anchors).toBe(2);
  });

  it("dangling-anchor: the edge is emitted, no fact is conferred, and referential integrity flags it", () => {
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

    const validation = validateGraph(result.graph).findings;
    expect(
      validation.some((finding) => finding.validatorId === graphValidatorIds.referentialIntegrity),
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
    expect(result.counts.anchors).toBe(0);
    expect(result.counts.specs).toBe(0);
  });

  it("non-static-anchor-label: the label drops with a warning; the binding survives whole", () => {
    const result = extract({ root: corpusRoot("non-static-anchor-label") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("label");

    const node = result.graph.nodes.find((entry) => entry.id === "impl:orders.non-static-label");
    expect(node?.nodeType).toBe("CodeNode");
    expect(node?.nodeType === "CodeNode" ? node.label : "node missing").toBeUndefined();
    expect(result.graph.edges).toContainEqual({
      from: "impl:orders.non-static-label",
      type: "satisfies",
      to: "spec:orders.labelled-target",
      claim: "anchored",
    });
  });
});

/**
 * The graph-validator corpora: extraction is clean (the repo's authoring shape is fine), and the
 * conformance + honesty checks over the derived graph carry the verdict — exactly the
 * `sdp validate` = `sdp build` + checks split (one validation path, MD-14).
 */
describe("graph-validator corpora", () => {
  it("invalid-ready-with-unresolved-dependency: the conformance error and the floor failure both fire — two families, two statements", () => {
    const result = extract({ root: corpusRoot("invalid-ready-with-unresolved-dependency") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    const errors = validation.filter((finding) => finding.severity === "error");

    expect(errors.map((finding) => [finding.validatorId, finding.relatedId])).toEqual([
      [graphValidatorIds.referentialIntegrity, "spec:payments.authorize-payment"],
      [graphValidatorIds.readinessFloor, "all-relations-resolve"],
    ]);
    // The target-rung clause evaluates resolving targets only — no third failure.
    expect(
      validation.some(
        (finding) => finding.relatedId === "depends-on-and-refines-targets-are-defined",
      ),
    ).toBe(false);
  });

  it("invalid-ready-with-target-below-defined: every reference resolves; the one error is the floor clause", () => {
    const result = extract({ root: corpusRoot("invalid-ready-with-target-below-defined") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    const errors = validation.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(graphValidatorIds.readinessFloor);
    expect(errors[0]?.subjectId).toBe("spec:orders.create-order");
    expect(errors[0]?.relatedId).toBe("depends-on-and-refines-targets-are-defined");
  });

  it("invalid-hand-authored-delivery-fact-in-section: the smuggled key fails over the graph end-to-end (MD-16)", () => {
    const result = extract({ root: corpusRoot("invalid-hand-authored-delivery-fact-in-section") });

    // Extraction reifies section interiors as content — the honesty check is the graph's.
    expect(result.report.findings).toEqual([]);

    const errors = validateGraph(result.graph).findings.filter(
      (finding) => finding.severity === "error",
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(graphValidatorIds.authoringShape);
    expect(errors[0]?.relatedId).toBe("has-verifier");
    expect(errors[0]?.path).toBe("behavior.has-verifier");
  });

  it("invalid-duplicate-pack-member: a duplicated manifest entry is a pack-coherence error", () => {
    const result = extract({ root: corpusRoot("invalid-duplicate-pack-member") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.packCoherence);
    expect(validation[0]?.severity).toBe("error");
    expect(validation[0]?.subjectId).toBe("pack:checkout-v1");
    expect(validation[0]?.relatedId).toBe("spec:orders.create-order");
  });

  it("invalid-non-model-modelref: a resolving but wrong-kind modelRef is a pack-coherence error", () => {
    const result = extract({ root: corpusRoot("invalid-non-model-modelref") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.packCoherence);
    expect(validation[0]?.severity).toBe("error");
    expect(validation[0]?.path).toBe("modelRefs[0]");
  });

  it("non-example-verifier: a declared verifies from a non-example kind is surfaced, never gated", () => {
    const result = extract({ root: corpusRoot("non-example-verifier") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.verifiesLinkage);
    expect(validation[0]?.severity).toBe("warning");
    expect(validation[0]?.subjectId).toBe("spec:orders.reconciliation-workflow");
  });

  it("orphan-spec: no relations and nothing pointing at it — a warning, never a gate", () => {
    const result = extract({ root: corpusRoot("orphan-spec") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.orphans);
    expect(validation[0]?.severity).toBe("warning");
    expect(validation[0]?.subjectId).toBe("spec:orders.stranded");
  });

  it("ready-without-verifier: the cleared floor plus the surfaced gap — informative only", () => {
    const result = extract({ root: corpusRoot("ready-without-verifier") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.gaps);
    expect(validation[0]?.severity).toBe("warning");
    expect(validation[0]?.subjectId).toBe("spec:orders.order-total-rule");
  });
});

describe("determinism self-check (rebuild twice, byte-compare — distinct from the golden oracle)", () => {
  it("two independent extractions of the example serialize byte-identically", () => {
    const first = serializeGraph(extract({ root: exampleRoot }).graph);
    const second = serializeGraph(extract({ root: exampleRoot }).graph);

    expect(second).toBe(first);
  });
});
