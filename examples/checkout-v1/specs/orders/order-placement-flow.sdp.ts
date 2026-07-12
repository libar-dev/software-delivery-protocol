import { dependsOn, refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const orderPlacementFlowSpec = spec({
  id: specId("spec:orders.order-placement-flow"),
  title: "Order placement flow",
  kind: "workflow",
  altitude: "feature",
  readiness: "scoped",
  intent: {
    outcome: "Sequence cart submission through validation to a created order.",
    value: "The slice states how create-order is reached without modeling the rest of checkout.",
  },
  // Flows are scoped-rung evidence (MD-12): the sequencing is stated, but the workflow carries no
  // rules or examples yet — so it honestly states scoped, not defined.
  behavior: {
    flows: [
      "The customer submits a cart from checkout.",
      "Create-order validates the cart against the inventory snapshot.",
      "A valid cart becomes an order; an invalid cart returns a validation error.",
    ],
  },
  relations: [
    refines(specId("spec:orders.order-management")),
    dependsOn(specId("spec:orders.create-order")),
  ],
});
