import { refines, spec, specId, verifies } from "@libar-dev/software-delivery-protocol";

export const createOrderValidCartSpec = spec({
  id: specId("spec:orders.create-order.valid-cart"),
  title: "Valid cart creates an order",
  kind: "example",
  altitude: "story",
  // States ready and earns it: structured GWT evidence, resolving relations, and the test anchor
  // (test/orders/create-order.valid-cart.test.ts) binding it as the enabled verifier.
  readiness: "ready",
  intent: {
    outcome: "Show that a valid cart can become an order.",
    value: "The authored example demonstrates the happy path for create-order.",
  },
  // A bound point in the parent's example space (the concreteness law): every slot in a used
  // step binds a value — `{n: 2}`, never `{n}` — and the authored values flow through the
  // generated step contract into the bound test, so editing the 100 below reddens the test with
  // zero test-side edits.
  behavior: {
    examples: [
      {
        given: [
          "a customer has a cart with {n: 2} line items",
          "every line item has quantity {q: 1} and unit price {price: 50}",
          'every cart item is {availability: "in stock"}',
        ],
        when: ["the customer submits the cart for order creation"],
        then: [
          "an order is created with total {total: 100}",
          "the order contains the original cart lines",
        ],
      },
    ],
  },
  verification: {
    mode: "executable",
    criteria: [
      "The order result contains a stable id.",
      "The returned total matches the authored total — the spec's value, never the test's.",
    ],
  },
  relations: [
    refines(specId("spec:orders.create-order")),
    verifies(specId("spec:orders.create-order")),
  ],
});
