import {
  constrainedBy,
  decidedBy,
  ref,
  refines,
  spec,
  specId,
} from "@libar-dev/software-delivery-protocol";

export const createOrderSpec = spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "defined",
  intent: {
    actor: "customer",
    outcome: "Turn a valid cart into an order.",
    value: "Customers can complete purchases without the example modeling the rest of checkout.",
  },
  behavior: {
    rules: [ref("spec:orders.order-total-rule"), ref("spec:orders.order-inventory-rule")],
    examples: [
      ref("spec:orders.create-order.valid-cart"),
      ref("spec:orders.create-order.invalid-cart"),
    ],
  },
  relations: [
    refines(specId("spec:orders.order-management")),
    constrainedBy(specId("spec:orders.order-latency-constraint")),
    decidedBy(specId("spec:decisions.order-lifecycle")),
  ],
});
