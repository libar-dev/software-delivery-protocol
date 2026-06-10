import {
  codeAnchor,
  codeAnchorId,
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

const implementationAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
  label: "CreateOrderUseCase",
  satisfies: ref("spec:orders.create-order"),
});

const testAnchor = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart creates order",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

void [authoredSpec, authoredPack, implementationAnchor, testAnchor];

codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
  satisfies: ref("spec:orders.create-order"),
  // @ts-expect-error anchors are identity-only and do not carry readiness
  readiness: "ready",
});

codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
  satisfies: ref("spec:orders.create-order"),
  // @ts-expect-error anchors do not accept spec sections such as intent
  intent: { outcome: "turn a valid cart into an order" },
});

codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
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

// The Spec envelope rejects hand-authored delivery facts at the top level: delivery facts are
// derived-only (base §4b). Caveat: the guarantee is "rejected for inline object literals" — it relies
// on TypeScript's excess-property checking, which only fires on literals passed directly. Sound in
// practice because P5 mandates static inline literals, but it is not a structural guarantee.
spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
  // @ts-expect-error specs never author the derived `implemented` delivery fact at the envelope
  implemented: true,
});

spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
  // @ts-expect-error specs never author the derived `has-verifier` delivery fact at the envelope
  "has-verifier": true,
});

// invalid-hand-authored-delivery-fact-in-section, the compile-time twin (MD-11): the in-section
// bypass is closed for inline literals by the typed floor-bearing sections — a closed
// BehaviorSection has no index signature, so a smuggled delivery fact no longer typechecks. The
// same excess-property caveat as the envelope defenses above applies: this fires only on fresh
// literals. A section assembled through an intermediate variable slips past tsc and is caught at
// runtime by `honesty/authoring-shape` (MD-16; the runtime twin lives in the fixture suite);
// structurally, non-static section authoring is rejected by static reification (P5) and the
// `sdp/spec-static` lint when the extractor lands (Slice 1).
spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
  // @ts-expect-error sections are closed-typed (MD-11) — no hand-authored delivery fact inside a section
  behavior: { "has-verifier": true },
});

// The same closure holds for the other floor-bearing sections (MD-11's criterion, not a list).
spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
  // @ts-expect-error the decision section carries no status field (MD-11 — rejected vocabulary)
  decision: { decision: "Validate before creating.", status: "accepted" },
});

// The Pack stays truthless (base §2 boundary): it states no system truth, so it rejects
// truth-bearing fields — intent, readiness, and constraints all belong on a Spec, never a Pack.
pack({
  id: packId("pack:checkout-v1"),
  title: "Checkout v1",
  specs: [ref("spec:orders.create-order")],
  // @ts-expect-error packs carry no intent section — intent is system truth, authored on a Spec
  intent: { outcome: "turn a valid cart into an order" },
});

pack({
  id: packId("pack:checkout-v1"),
  title: "Checkout v1",
  specs: [ref("spec:orders.create-order")],
  // @ts-expect-error packs state no readiness — readiness is a Spec descriptor
  readiness: "ready",
});

pack({
  id: packId("pack:checkout-v1"),
  title: "Checkout v1",
  specs: [ref("spec:orders.create-order")],
  // @ts-expect-error packs carry no constraints section — constraints are authored on a Spec
  constraints: [{ statement: "p95 < 200ms" }],
});
