import { describe, expect, it } from "vitest";

import {
  anchorImplementation,
  dependsOn,
  implAnchorId,
  pack,
  packId,
  ref,
  spec,
  specId,
  specTest,
  testAnchorId,
  validateAuthoredModel,
  validateDanglingReferences,
  validateDuplicateIds,
  validateReadinessFloors,
} from "../src/index.js";

import type { AuthoredModel, Spec } from "../src/index.js";

function createBehaviorSpec(
  id: ReturnType<typeof specId>,
  readiness: Spec["readiness"],
  overrides: Partial<Spec> = {},
): Spec {
  return spec({
    id,
    title: `Title for ${id}`,
    kind: "behavior",
    altitude: "feature",
    readiness,
    ...overrides,
  });
}

describe("validators", () => {
  it("reports duplicate authored ids with the exact duplicated id", () => {
    const duplicateId = specId("spec:orders.create-order");
    const report = validateDuplicateIds({
      specs: [
        spec({
          id: duplicateId,
          title: "Create order",
          kind: "behavior",
          altitude: "feature",
          readiness: "idea",
        }),
        spec({
          id: duplicateId,
          title: "Create order duplicate",
          kind: "behavior",
          altitude: "feature",
          readiness: "idea",
        }),
      ],
      packs: [],
      anchors: [],
    });

    expect(report.validatorId).toBe("conformance/duplicate-ids");
    expect(report.family).toBe("conformance");
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0]).toMatchObject({
      validatorId: "conformance/duplicate-ids",
      family: "conformance",
      severity: "error",
      subjectId: duplicateId,
      message: 'Duplicate authored id "spec:orders.create-order".',
    });
  });

  it("reports dangling authored references across relations, packs, and anchors", () => {
    const existingSpecId = specId("spec:orders.order-management");
    const relationTarget = specId("spec:orders.missing-target");
    const packSpecTarget = specId("spec:orders.missing-pack-member");
    const packModelTarget = specId("spec:checkout.missing-glossary");
    const anchorTarget = specId("spec:orders.missing-anchor-target");
    const testTarget = specId("spec:orders.missing-test-target");

    const report = validateDanglingReferences({
      specs: [
        createBehaviorSpec(specId("spec:orders.create-order"), "scoped", {
          intent: { outcome: "turn a cart into an order" },
          behavior: { examples: ["valid cart"] },
          relations: [dependsOn(relationTarget)],
        }),
        createBehaviorSpec(existingSpecId, "idea", {
          intent: { outcome: "define order management" },
        }),
      ],
      packs: [
        pack({
          id: packId("pack:checkout-v1"),
          title: "Checkout v1",
          specs: [ref(existingSpecId), packSpecTarget],
          modelRefs: [packModelTarget],
        }),
      ],
      anchors: [
        anchorImplementation({
          id: implAnchorId("impl:orders.create-order-use-case"),
          satisfies: anchorTarget,
        }),
        specTest({
          id: testAnchorId("test:orders.create-order.valid-cart"),
          verifies: testTarget,
        }),
      ],
    });

    expect(report.validatorId).toBe("conformance/dangling-references");
    expect(report.family).toBe("conformance");
    expect(report.findings).toEqual([
      {
        validatorId: "conformance/dangling-references",
        family: "conformance",
        severity: "error",
        subjectId: "spec:orders.create-order",
        relatedId: "spec:orders.missing-target",
        path: "relations[0].target",
        message:
          'Authored reference from "spec:orders.create-order" points to missing target "spec:orders.missing-target" at "relations[0].target".',
      },
      {
        validatorId: "conformance/dangling-references",
        family: "conformance",
        severity: "error",
        subjectId: "pack:checkout-v1",
        relatedId: "spec:orders.missing-pack-member",
        path: "specs[1]",
        message:
          'Authored reference from "pack:checkout-v1" points to missing target "spec:orders.missing-pack-member" at "specs[1]".',
      },
      {
        validatorId: "conformance/dangling-references",
        family: "conformance",
        severity: "error",
        subjectId: "pack:checkout-v1",
        relatedId: "spec:checkout.missing-glossary",
        path: "modelRefs[0]",
        message:
          'Authored reference from "pack:checkout-v1" points to missing target "spec:checkout.missing-glossary" at "modelRefs[0]".',
      },
      {
        validatorId: "conformance/dangling-references",
        family: "conformance",
        severity: "error",
        subjectId: "impl:orders.create-order-use-case",
        relatedId: "spec:orders.missing-anchor-target",
        path: "satisfies",
        message:
          'Authored reference from "impl:orders.create-order-use-case" points to missing target "spec:orders.missing-anchor-target" at "satisfies".',
      },
      {
        validatorId: "conformance/dangling-references",
        family: "conformance",
        severity: "error",
        subjectId: "test:orders.create-order.valid-cart",
        relatedId: "spec:orders.missing-test-target",
        path: "verifies",
        message:
          'Authored reference from "test:orders.create-order.valid-cart" points to missing target "spec:orders.missing-test-target" at "verifies".',
      },
    ]);
  });

  it("reports a single-spec ready floor failure with the spec id and stated readiness", () => {
    const report = validateReadinessFloors({
      specs: [
        createBehaviorSpec(specId("spec:orders.create-order"), "ready", {
          intent: { outcome: "turn a valid cart into an order" },
          relations: [dependsOn(ref("spec:orders.order-management"))],
          // An inline constraint clears the scoped evidence rung, but a defined behavior spec needs
          // rules and/or examples — constraints alone no longer suffice (MD-12).
          constraints: [{ statement: "order creation stays fast", target: "p95 < 200ms" }],
        }),
      ],
      packs: [],
      anchors: [],
    });

    expect(report.validatorId).toBe("honesty/readiness-floor");
    expect(report.family).toBe("honesty");
    expect(report.findings).toEqual([
      {
        validatorId: "honesty/readiness-floor",
        family: "honesty",
        severity: "error",
        subjectId: "spec:orders.create-order",
        relatedId: "kind-evidence-complete",
        path: "readiness",
        message:
          'Spec "spec:orders.create-order" states readiness "ready" but does not satisfy floor clause "kind-evidence-complete": The kind\'s natural evidence is complete (per-kind evidence table).',
      },
    ]);
  });

  it("skips graph-shaped ready clauses pre-graph (target readiness and anchor resolution wait for the extractor)", () => {
    const report = validateReadinessFloors({
      specs: [
        createBehaviorSpec(specId("spec:orders.create-order"), "ready", {
          intent: { outcome: "turn a valid cart into an order" },
          behavior: { rules: ["persist the order"] },
          relations: [dependsOn(ref("spec:orders.undefined-dependency"))],
        }),
      ],
      packs: [],
      anchors: [
        anchorImplementation({
          id: implAnchorId("impl:orders.undefined-anchor"),
          satisfies: ref("spec:orders.undefined-anchor-target"),
        }),
      ],
    });

    expect(report.findings).toEqual([]);
  });

  it("returns a valid empty authored-model report without throwing", () => {
    const report = validateAuthoredModel({
      specs: [],
      packs: [],
      anchors: [],
    });

    expect(report.validatorId).toBe("authored-model");
    // The aggregate spans both check families, so it carries no single family of its own (F3).
    expect(report.family).toBeUndefined();
    expect(report.findings).toEqual([]);
  });

  it("composes the authored-layer validators for a valid non-empty model", () => {
    const orderManagement = createBehaviorSpec(specId("spec:orders.order-management"), "idea", {
      intent: { outcome: "define order management" },
    });
    const createOrder = createBehaviorSpec(specId("spec:orders.create-order"), "ready", {
      intent: { outcome: "turn a valid cart into an order" },
      behavior: { rules: ["persist the order"] },
      relations: [dependsOn(orderManagement.id)],
    });

    const model: AuthoredModel = {
      specs: [orderManagement, createOrder],
      packs: [
        pack({
          id: packId("pack:checkout-v1"),
          title: "Checkout v1",
          specs: [orderManagement.id, createOrder.id],
          modelRefs: [orderManagement.id],
        }),
      ],
      anchors: [
        anchorImplementation({
          id: implAnchorId("impl:orders.create-order-use-case"),
          satisfies: createOrder.id,
        }),
        specTest({
          id: testAnchorId("test:orders.create-order.valid-cart"),
          verifies: createOrder.id,
        }),
      ],
    };

    expect(validateAuthoredModel(model).findings).toEqual([]);
  });
});
