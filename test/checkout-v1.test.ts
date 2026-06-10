import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { createOrderUseCaseAnchor } from "../examples/checkout-v1/src/orders/create-order.use-case.js";
import { createOrderValidCartTest } from "../examples/checkout-v1/test/orders/create-order.valid-cart.test.js";
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

  it("extracts the pack and honestly shows zero delivery facts at Slice 1", () => {
    expect(extraction.model.packs.map((entry) => entry.id)).toEqual(["pack:checkout-v1"]);
    expect(extraction.model.anchors).toEqual([]);

    for (const node of extraction.graph.nodes) {
      if (node.nodeType === "Primitive") {
        expect(node.deliveryFacts ?? []).toEqual([]);
      }
    }

    expect(extraction.graph.edges.every((edge) => edge.claim === "declared")).toBe(true);
  });

  it("keeps the two authored anchors typechecked in place until Slice 2 extracts them", () => {
    const exampleSpecIds = new Set(extraction.model.specs.map((entry) => entry.id));

    expect(createOrderUseCaseAnchor.id).toBe("impl:orders.create-order-use-case");
    expect(createOrderValidCartTest.id).toBe("test:orders.create-order.valid-cart");
    expect(exampleSpecIds.has(createOrderUseCaseAnchor.satisfies)).toBe(true);
    expect(exampleSpecIds.has(createOrderValidCartTest.verifies)).toBe(true);
  });
});
