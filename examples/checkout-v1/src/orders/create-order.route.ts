import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

import { createOrderFromCart } from "./create-order.use-case.js";
import type { CartInput, CreatedOrder, InventorySnapshot } from "./create-order.use-case.js";

export const createOrderRouteAnchor = codeAnchor({
  id: codeAnchorId("api:orders.post"),
  label: "POST /orders",
  satisfies: ref("spec:orders.create-order"),
});

export interface CreateOrderRequest {
  readonly cart: CartInput;
  readonly inventory: InventorySnapshot;
}

export type CreateOrderResponse =
  | { readonly status: 201; readonly order: CreatedOrder }
  | { readonly status: 422; readonly error: string };

/** A deliberately thin handler: validation and creation live in the use case it delegates to. */
export function postOrders(request: CreateOrderRequest): CreateOrderResponse {
  try {
    return { status: 201, order: createOrderFromCart(request.cart, request.inventory) };
  } catch (error) {
    return { status: 422, error: error instanceof Error ? error.message : "Invalid cart." };
  }
}
