// Tiny stand-in for examples/checkout-v1/src — just enough domain for handlers.

export interface CartLine { productId: string; quantity: number; unitPrice: number; }
export interface Cart { customerId: string; lines: CartLine[]; }
export interface Order { orderId: string; customerId: string; total: number; lines: CartLine[]; }

export function createOrderFromCart(cart: Cart, stock: Record<string, number>): Order {
  for (const line of cart.lines) {
    if ((stock[line.productId] ?? 0) < line.quantity) throw new Error(`out of stock: ${line.productId}`);
  }
  return {
    orderId: `order-${cart.customerId}`,
    customerId: cart.customerId,
    total: cart.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0),
    lines: [...cart.lines],
  };
}

export function check(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}
