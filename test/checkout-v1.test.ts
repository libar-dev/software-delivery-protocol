import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  authoredEdgeTypes,
  extract,
  extractFindingIds,
  graphValidatorIds,
  serializeGraph,
  validateGraph,
} from "../src/index.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));
const goldenPath = fileURLToPath(
  new URL("./fixtures/checkout-v1/expected-graph.json", import.meta.url),
);

// The extractor is the sole producer of the example's graph, and the conformance + honesty
// checks consume that graph (one validation path, MD-14).
const extraction = extract({ root: exampleRoot });

describe("checkout-v1 tracer bullet (extractor-fed)", () => {
  it("extracts the example with zero findings", () => {
    expect(extraction.report.findings).toEqual([]);
    expect(extraction.counts).toEqual({ specs: 9, packs: 1, anchors: 3 });
  });

  it("validates with zero errors and exactly the one surfaced absence: the unenabled invalid-cart verifier", () => {
    const validation = validateGraph(extraction.graph).findings;

    expect(validation.filter((finding) => finding.severity === "error")).toEqual([]);
    // The standing warning is deliberate: the invalid-cart example declares verifies without a
    // test binding (the Slice-2 honesty showcase), and surfacing it is the check's job —
    // informative, never a gate.
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.verifiesLinkage);
    expect(validation[0]?.severity).toBe("warning");
    expect(validation[0]?.subjectId).toBe("spec:orders.create-order.invalid-cart");
  });

  it("drops no sections: the example survives static extraction whole", () => {
    const droppedSections = extraction.report.findings.filter(
      (finding) => finding.validatorId === extractFindingIds.nonStaticSection,
    );

    expect(droppedSections).toEqual([]);
  });

  it("golden correctness oracle: the extractor produces the right graph, byte-for-byte", () => {
    const expected = readFileSync(goldenPath, "utf8");

    expect(
      serializeGraph(extraction.graph),
      "Golden graph mismatch. Review the diff against test/fixtures/checkout-v1/expected-graph.json; if the change is intended, regenerate the golden and commit the reviewed diff — the diff is the review.",
    ).toBe(expected);
  });

  it("keeps every authored reference target inside the checkout-v1 example graph", () => {
    const nodeIds = new Set(extraction.graph.nodes.map((node) => node.id));
    const relationTypes = new Set<string>(authoredEdgeTypes);

    for (const edge of extraction.graph.edges) {
      if (relationTypes.has(edge.type) || edge.type === "belongsTo" || edge.type === "satisfies") {
        expect(nodeIds.has(edge.from)).toBe(true);
        expect(nodeIds.has(edge.to)).toBe(true);
      }
    }

    for (const node of extraction.graph.nodes) {
      if (node.nodeType === "Pack") {
        for (const modelRef of node.modelRefs ?? []) {
          expect(nodeIds.has(modelRef)).toBe(true);
        }
      }
    }
  });

  it("extracts the pack and the three anchors (the anchored layer)", () => {
    expect(
      extraction.graph.nodes.filter((node) => node.nodeType === "Pack").map((n) => n.id),
    ).toEqual(["pack:checkout-v1"]);
    expect(
      extraction.graph.nodes
        .filter((node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode")
        .map((node) => node.id)
        .sort(),
    ).toEqual([
      "api:orders.post",
      "impl:orders.create-order-use-case",
      "test:orders.create-order.valid-cart",
    ]);

    const anchoredEdges = extraction.graph.edges.filter((edge) => edge.claim === "anchored");
    expect(anchoredEdges).toEqual(
      expect.arrayContaining([
        {
          from: "impl:orders.create-order-use-case",
          type: "satisfies",
          to: "spec:orders.create-order",
          claim: "anchored",
        },
        {
          from: "api:orders.post",
          type: "satisfies",
          to: "spec:orders.create-order",
          claim: "anchored",
        },
        {
          from: "test:orders.create-order.valid-cart",
          type: "verifies",
          to: "spec:orders.create-order.valid-cart",
          claim: "anchored",
        },
      ]),
    );
    expect(anchoredEdges).toHaveLength(3);
  });

  it("derives the delivery facts honestly: bound specs only, never the unenabled verifier", () => {
    const factsById = new Map(
      extraction.graph.nodes
        .filter((node) => node.nodeType === "Primitive")
        .map((node) => [node.id, node.deliveryFacts ?? []]),
    );

    // Two satisfies bindings + the enabled valid-cart example verifying it (`02` §2).
    expect(factsById.get("spec:orders.create-order")).toEqual(["implemented", "has-verifier"]);
    // The test anchor verifies the example directly — the example earns its own has-verifier.
    expect(factsById.get("spec:orders.create-order.valid-cart")).toEqual(["has-verifier"]);
    // The invalid-cart example declares verifies but has no test anchor: not an enabled
    // verifier — it confers nothing and carries nothing (binding, never liveness — MD-7).
    expect(factsById.get("spec:orders.create-order.invalid-cart")).toEqual([]);

    for (const [id, facts] of factsById) {
      if (id !== "spec:orders.create-order" && id !== "spec:orders.create-order.valid-cart") {
        expect(facts).toEqual([]);
      }
    }
  });
});
