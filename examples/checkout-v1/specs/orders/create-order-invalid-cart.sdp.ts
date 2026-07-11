import { refines, spec, specId, verifies } from "@libar-dev/software-delivery-protocol";

export const createOrderInvalidCartSpec = spec({
  id: specId("spec:orders.create-order.invalid-cart"),
  title: "Invalid cart is rejected",
  kind: "example",
  altitude: "story",
  readiness: "defined",
  intent: {
    outcome: "Show that an invalid cart does not become an order.",
    value:
      "The authored example captures the rejection path without adding invalid fixtures to the model.",
  },
  // A PARTIAL bound point — the honest form: the example uses only the {n} step, binds n = 0,
  // and constrains nothing else (an unused step binds nothing and fails nothing).
  behavior: {
    examples: [
      {
        given: ["a customer has a cart with {n: 0} line items"],
        when: ["the customer submits the cart for order creation"],
        then: ['order creation is rejected because {reason: "empty cart"}'],
      },
    ],
  },
  verification: {
    mode: "executable",
    criteria: [
      "The use case throws when the cart is empty.",
      "The thrown error names the rejection reason.",
    ],
  },
  relations: [
    refines(specId("spec:orders.create-order")),
    verifies(specId("spec:orders.create-order")),
  ],
});
