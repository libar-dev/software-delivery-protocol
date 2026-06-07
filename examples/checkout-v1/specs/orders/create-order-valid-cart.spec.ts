import { refines, spec, specId, verifies } from "@libar-dev/software-delivery-protocol";

export const createOrderValidCartSpec = spec({
  id: specId("spec:orders.create-order.valid-cart"),
  title: "Valid cart creates an order",
  kind: "example",
  altitude: "story",
  readiness: "defined",
  intent: {
    outcome: "Show that a valid cart can become an order.",
    value: "The authored example demonstrates the happy path for create-order.",
  },
  behavior: {
    examples: ["Valid cart becomes an order with the computed total."],
    given: [
      "A customer has a cart with one or more line items.",
      "Every cart item is in stock.",
      "Each line item has a positive quantity and a unit price.",
    ],
    when: ["The customer submits the cart for order creation."],
    then: [
      "An order is created.",
      "The order total equals the sum of quantity multiplied by unit price for each line item.",
      "The order contains the original cart lines.",
    ],
  },
  verification: {
    mode: "executable",
    criteria: [
      "The order result contains a stable id.",
      "The returned total matches the cart math.",
    ],
  },
  relations: [
    refines(specId("spec:orders.create-order")),
    verifies(specId("spec:orders.create-order")),
  ],
});
