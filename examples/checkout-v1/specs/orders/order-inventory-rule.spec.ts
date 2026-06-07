import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const orderInventoryRuleSpec = spec({
  id: specId("spec:orders.order-inventory-rule"),
  title: "Order creation requires available inventory",
  kind: "rule",
  altitude: "story",
  readiness: "defined",
  intent: {
    outcome: "Reject carts whose items are not fully available.",
    value: "Order creation does not over-promise unavailable stock.",
  },
  behavior: {
    rules: [
      "Every cart line must have at least the requested quantity available.",
      "Any unavailable line blocks order creation for the whole cart.",
    ],
  },
  relations: [refines(specId("spec:orders.create-order"))],
});
