import { describe, expect, it } from "vitest";

import {
  codeAnchor,
  codeAnchorId,
  constrainedBy,
  decidedBy,
  dependsOn,
  pack,
  packId,
  ref,
  refines,
  spec,
  specId,
  specTest,
  supersedes,
  testAnchorId,
  verifies,
} from "../src/index.js";

describe("builders", () => {
  it("builds plain serializable specs with declared relations", () => {
    const parent = ref("spec:orders.order-management");
    const dependency = ref("spec:payments.authorize-payment");
    const constraint = ref("spec:checkout.performance-budget");
    const decision = ref("spec:decisions.order-lifecycle");
    const verificationTarget = ref("spec:orders.create-order");
    const supersededDecision = ref("spec:decisions.order-lifecycle-v0");

    const createOrder = spec({
      id: specId("spec:orders.create-order"),
      title: "Customer creates an order",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: {
        actor: "customer",
        outcome: "turn a valid cart into an order",
        value: "customers can complete purchases",
      },
      relations: [
        refines(parent),
        dependsOn(dependency),
        constrainedBy(constraint),
        decidedBy(decision),
        verifies(verificationTarget),
        supersedes(supersededDecision),
      ],
    });

    expect(Object.getPrototypeOf(createOrder)).toBe(Object.prototype);
    expect(createOrder.relations).toEqual([
      { type: "refines", target: parent, claim: "declared" },
      { type: "dependsOn", target: dependency, claim: "declared" },
      { type: "constrainedBy", target: constraint, claim: "declared" },
      { type: "decidedBy", target: decision, claim: "declared" },
      { type: "verifies", target: verificationTarget, claim: "declared" },
      { type: "supersedes", target: supersededDecision, claim: "declared" },
    ]);
    expect(JSON.parse(JSON.stringify(createOrder))).toEqual({
      id: "spec:orders.create-order",
      title: "Customer creates an order",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: {
        actor: "customer",
        outcome: "turn a valid cart into an order",
        value: "customers can complete purchases",
      },
      relations: [
        { type: "refines", target: "spec:orders.order-management", claim: "declared" },
        {
          type: "dependsOn",
          target: "spec:payments.authorize-payment",
          claim: "declared",
        },
        {
          type: "constrainedBy",
          target: "spec:checkout.performance-budget",
          claim: "declared",
        },
        {
          type: "decidedBy",
          target: "spec:decisions.order-lifecycle",
          claim: "declared",
        },
        { type: "verifies", target: "spec:orders.create-order", claim: "declared" },
        {
          type: "supersedes",
          target: "spec:decisions.order-lifecycle-v0",
          claim: "declared",
        },
      ],
    });
  });

  it("builds packs as plain manifests with no authored truth fields", () => {
    const source = {
      id: packId("pack:checkout-v1"),
      title: "Checkout v1",
      framing: "let customers complete purchases reliably",
      modelRefs: [ref("spec:checkout.glossary")],
      specs: [ref("spec:orders.create-order"), ref("spec:payments.authorize-payment")],
    };

    const checkout = pack(source);

    expect(Object.getPrototypeOf(checkout)).toBe(Object.prototype);
    expect(checkout).toEqual(source);
    expect(checkout.specs).not.toBe(source.specs);
    expect(checkout.modelRefs).not.toBe(source.modelRefs);
    expect(JSON.parse(JSON.stringify(checkout))).toEqual({
      id: "pack:checkout-v1",
      title: "Checkout v1",
      framing: "let customers complete purchases reliably",
      modelRefs: ["spec:checkout.glossary"],
      specs: ["spec:orders.create-order", "spec:payments.authorize-payment"],
    });
  });

  it("builds identity-only anchors as plain serializable objects", () => {
    const implementationSource = {
      id: codeAnchorId("impl:orders.create-order-use-case"),
      label: "CreateOrderUseCase",
      satisfies: ref("spec:orders.create-order"),
    };

    const implementation = codeAnchor(implementationSource);
    const testBinding = specTest({
      id: testAnchorId("test:orders.create-order.valid-cart"),
      label: "valid cart creates order",
      verifies: ref("spec:orders.create-order.valid-cart"),
    });

    expect(Object.getPrototypeOf(implementation)).toBe(Object.prototype);
    expect(Object.getPrototypeOf(testBinding)).toBe(Object.prototype);
    expect(implementation).toEqual(implementationSource);
    expect(testBinding).toEqual({
      id: "test:orders.create-order.valid-cart",
      label: "valid cart creates order",
      verifies: "spec:orders.create-order.valid-cart",
    });
    expect(JSON.parse(JSON.stringify({ implementation, testBinding }))).toEqual({
      implementation: {
        id: "impl:orders.create-order-use-case",
        label: "CreateOrderUseCase",
        satisfies: "spec:orders.create-order",
      },
      testBinding: {
        id: "test:orders.create-order.valid-cart",
        label: "valid cart creates order",
        verifies: "spec:orders.create-order.valid-cart",
      },
    });
  });
});
