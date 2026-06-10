import { describe, expect, it } from "vitest";

import { checkoutV1Model } from "../examples/checkout-v1/model.js";
import { validateAuthoredModel } from "../src/index.js";

describe("checkout-v1 tracer bullet", () => {
  it("assembles a valid authored model with zero error findings", () => {
    expect(validateAuthoredModel(checkoutV1Model).findings).toEqual([]);
  });

  it("keeps every authored relation target inside the checkout-v1 example spec set", () => {
    const exampleSpecIds = new Set(checkoutV1Model.specs.map((entry) => entry.id));

    for (const authoredSpec of checkoutV1Model.specs) {
      for (const relation of authoredSpec.relations ?? []) {
        expect(exampleSpecIds.has(relation.target)).toBe(true);
      }
    }

    for (const authoredPack of checkoutV1Model.packs) {
      for (const specTarget of authoredPack.specs) {
        expect(exampleSpecIds.has(specTarget)).toBe(true);
      }

      for (const modelRef of authoredPack.modelRefs ?? []) {
        expect(exampleSpecIds.has(modelRef)).toBe(true);
      }
    }

    for (const anchor of checkoutV1Model.anchors) {
      const target = "satisfies" in anchor ? anchor.satisfies : anchor.verifies;
      expect(exampleSpecIds.has(target)).toBe(true);
    }
  });

  it("includes the pack, implementation anchor, and spec-linked test anchor in the assembled model", () => {
    expect(checkoutV1Model.packs.map((entry) => entry.id)).toEqual(["pack:checkout-v1"]);
    expect(checkoutV1Model.anchors.map((entry) => entry.id)).toEqual([
      "impl:orders.create-order-use-case",
      "test:orders.create-order.valid-cart",
    ]);
  });
});
