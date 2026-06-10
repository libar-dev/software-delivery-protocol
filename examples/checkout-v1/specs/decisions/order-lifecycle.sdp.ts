import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const orderLifecycleDecisionSpec = spec({
  id: specId("spec:decisions.order-lifecycle"),
  title: "Order lifecycle keeps validation before creation",
  kind: "decision",
  altitude: "feature",
  readiness: "defined",
  intent: {
    outcome: "Decide when checkout-v1 may create an order.",
    value: "The authored example has one stable lifecycle rule for success and rejection paths.",
  },
  decision: {
    decision:
      "Create orders only after cart validation confirms non-empty input and sufficient inventory.",
    rationale: [
      "The valid-cart and invalid-cart examples need one consistent gate.",
      "Rejecting before persistence keeps the tracer bullet small and internally consistent.",
    ],
    consequences: ["Rejected carts never create partial orders."],
  },
  relations: [refines(specId("spec:orders.create-order"))],
});
