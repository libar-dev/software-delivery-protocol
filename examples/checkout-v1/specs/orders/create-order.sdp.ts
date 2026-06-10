import {
  constrainedBy,
  decidedBy,
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
  // No behavior section: the rules and examples are promoted children — their refines/verifies
  // relations are the linkage of record (MD-10), and promoted evidence clears the floor.
  relations: [
    refines(specId("spec:orders.order-management")),
    constrainedBy(specId("spec:orders.order-latency-constraint")),
    decidedBy(specId("spec:decisions.order-lifecycle")),
  ],
});
