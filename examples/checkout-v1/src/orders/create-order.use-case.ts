import { anchorImplementation, implAnchorId, ref } from "@libar-dev/software-delivery-protocol";

export interface CartLine {
  readonly productId: string;
  readonly quantity: number;
  readonly unitPrice: number;
}

export interface CartInput {
  readonly customerId: string;
  readonly lines: readonly CartLine[];
}

export type InventorySnapshot = Readonly<Record<string, number>>;

export interface CreatedOrder {
  readonly orderId: string;
  readonly customerId: string;
  readonly total: number;
  readonly lines: readonly CartLine[];
}

export const createOrderUseCaseAnchor = anchorImplementation({
  id: implAnchorId("impl:orders.create-order-use-case"),
  label: "createOrderFromCart",
  satisfies: ref("spec:orders.create-order"),
});

export function createOrderFromCart(cart: CartInput, inventory: InventorySnapshot): CreatedOrder {
  if (cart.lines.length === 0) {
    throw new Error("Cart must contain at least one line.");
  }

  for (const line of cart.lines) {
    const availableQuantity = inventory[line.productId] ?? 0;

    if (line.quantity <= 0) {
      throw new Error(`Cart line ${line.productId} must request a positive quantity.`);
    }

    if (availableQuantity < line.quantity) {
      throw new Error(`Inventory is unavailable for product ${line.productId}.`);
    }
  }

  const total = cart.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

  return {
    orderId: `order-${cart.customerId}`,
    customerId: cart.customerId,
    total,
    lines: cart.lines,
  };
}
