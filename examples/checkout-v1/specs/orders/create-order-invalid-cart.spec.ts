import { refines, spec, specId, verifies } from "@libar-dev/software-delivery-protocol";

const thenKey = "then";

const createOrderInvalidCartBehavior = Object.fromEntries([
  ["examples", ["Out-of-stock or empty carts are rejected before an order is created."]],
  [
    "given",
    [
      "A cart is empty or contains at least one item without available inventory.",
      "The cart is submitted for order creation.",
    ],
  ],
  ["when", ["The create-order use case validates the cart."]],
  [
    thenKey,
    [
      "No order is created.",
      "The caller receives a validation error explaining why the cart is invalid.",
    ],
  ],
]) as Record<string, unknown>;

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
  behavior: createOrderInvalidCartBehavior,
  verification: {
    mode: "executable",
    criteria: [
      "The use case throws when inventory is missing.",
      "The use case throws when the cart is empty.",
    ],
  },
  relations: [
    refines(specId("spec:orders.create-order")),
    verifies(specId("spec:orders.create-order")),
  ],
});
