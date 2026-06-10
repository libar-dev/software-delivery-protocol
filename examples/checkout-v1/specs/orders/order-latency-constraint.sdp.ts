import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const orderLatencyConstraintSpec = spec({
  id: specId("spec:orders.order-latency-constraint"),
  title: "Create-order latency stays within checkout budget",
  kind: "constraint",
  altitude: "story",
  readiness: "defined",
  intent: {
    outcome: "Keep create-order fast enough for interactive checkout.",
    value: "Customers are not left waiting after submitting a valid cart.",
  },
  constraints: [
    {
      flavor: "performance",
      statement: "Create-order should respond within the checkout latency budget.",
      target: "latency.p95.lt:250ms",
    },
  ],
  relations: [refines(specId("spec:orders.create-order"))],
});
