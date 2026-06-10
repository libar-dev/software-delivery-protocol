import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const orderTotalRuleSpec = spec({
  id: specId("spec:orders.order-total-rule"),
  title: "Order total matches cart math",
  kind: "rule",
  altitude: "story",
  readiness: "defined",
  intent: {
    outcome: "Keep the order total equal to the sum of cart line subtotals.",
    value: "Customers and downstream systems see one deterministic order total.",
  },
  behavior: {
    rules: [
      "Each line subtotal is quantity multiplied by unit price.",
      "The order total is the sum of all line subtotals.",
    ],
  },
  relations: [refines(specId("spec:orders.create-order"))],
});
