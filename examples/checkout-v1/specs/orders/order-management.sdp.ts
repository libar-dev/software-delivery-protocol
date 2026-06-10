import { decidedBy, spec, specId } from "@libar-dev/software-delivery-protocol";

export const orderManagementSpec = spec({
  id: specId("spec:orders.order-management"),
  title: "Order management",
  kind: "behavior",
  altitude: "epic",
  readiness: "defined",
  intent: {
    outcome: "Coordinate the authored order-management slice for checkout v1.",
    value: "The pack can express order creation behavior without modeling the full checkout flow.",
  },
  behavior: {
    rules: [
      "Order management keeps order creation, rules, constraints, and decisions traceable in one authored slice.",
      "Every order-management child spec keeps its targets inside the checkout-v1 example set.",
    ],
  },
  relations: [decidedBy(specId("spec:decisions.order-lifecycle"))],
});
