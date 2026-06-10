import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { extract, extractFindingIds, serializeGraph, validateAuthoredModel } from "../src/index.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));
const goldenPath = fileURLToPath(
  new URL("./fixtures/checkout-v1/expected-graph.json", import.meta.url),
);

// The extractor is now the sole producer of the example's model (one validation path, MD-14):
// the import-evaluation path through a hand-assembled model.ts is retired.
const extraction = extract({ root: exampleRoot });

describe("checkout-v1 tracer bullet (extractor-fed)", () => {
  it("extracts the example with zero findings and feeds the floor checks cleanly", () => {
    expect(extraction.report.findings).toEqual([]);
    expect(validateAuthoredModel(extraction.model).findings).toEqual([]);
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

  it("keeps every authored relation target inside the checkout-v1 example spec set", () => {
    const exampleSpecIds = new Set(extraction.model.specs.map((entry) => entry.id));

    for (const authoredSpec of extraction.model.specs) {
      for (const relation of authoredSpec.relations ?? []) {
        expect(exampleSpecIds.has(relation.target)).toBe(true);
      }
    }

    for (const authoredPack of extraction.model.packs) {
      for (const specTarget of authoredPack.specs) {
        expect(exampleSpecIds.has(specTarget)).toBe(true);
      }

      for (const modelRef of authoredPack.modelRefs ?? []) {
        expect(exampleSpecIds.has(modelRef)).toBe(true);
      }
    }
  });

  it("extracts the pack and the three anchors (the anchored layer, Slice 2)", () => {
    expect(extraction.model.packs.map((entry) => entry.id)).toEqual(["pack:checkout-v1"]);
    expect(extraction.model.anchors.map((entry) => entry.id).sort()).toEqual([
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
