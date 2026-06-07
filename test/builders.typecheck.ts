import {
  anchorImplementation,
  implAnchorId,
  pack,
  packId,
  ref,
  spec,
  specId,
  specTest,
  testAnchorId,
  verifies,
} from "../src/index.js";

const authoredSpec = spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
});

const authoredPack = pack({
  id: packId("pack:checkout-v1"),
  title: "Checkout v1",
  specs: [ref("spec:orders.create-order")],
});

const implementationAnchor = anchorImplementation({
  id: implAnchorId("impl:orders.create-order-use-case"),
  label: "CreateOrderUseCase",
  satisfies: ref("spec:orders.create-order"),
});

const testAnchor = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart creates order",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

void [authoredSpec, authoredPack, implementationAnchor, testAnchor];

anchorImplementation({
  id: implAnchorId("impl:orders.create-order-use-case"),
  satisfies: ref("spec:orders.create-order"),
  // @ts-expect-error anchors are identity-only and do not carry readiness
  readiness: "ready",
});

anchorImplementation({
  id: implAnchorId("impl:orders.create-order-use-case"),
  satisfies: ref("spec:orders.create-order"),
  // @ts-expect-error anchors do not accept spec sections such as intent
  intent: { outcome: "turn a valid cart into an order" },
});

anchorImplementation({
  id: implAnchorId("impl:orders.create-order-use-case"),
  satisfies: ref("spec:orders.create-order"),
  // @ts-expect-error anchors do not author delivery facts
  implemented: true,
});

specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  verifies: ref("spec:orders.create-order.valid-cart"),
  // @ts-expect-error test anchors do not accept authored relations
  relations: [verifies(specId("spec:orders.create-order"))],
});

specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  verifies: ref("spec:orders.create-order.valid-cart"),
  // @ts-expect-error test anchors do not accept delivery fact badges
  "has-verifier": true,
});
