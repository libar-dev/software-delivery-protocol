import { expect } from "vitest";

import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { validCartContract } from "./after-edit/orders.create-order.valid-cart.contract.js";
import { createOrderFromCart } from "../../../../examples/checkout-v1/src/orders/create-order.use-case.js";
import type {
  CartLine,
  CreatedOrder,
} from "../../../../examples/checkout-v1/src/orders/create-order.use-case.js";

// Honest red demo: the value flows document → spike extraction → generated contract → assertion,
// with zero test edits. The document is a copy because the TypeScript DSL remains the sole
// canonical surface during the competition; the same seam reddens, now fed from Markdown.
interface World {
  lines: CartLine[];
  stock: Record<string, number>;
  order?: CreatedOrder;
}

bindExample(validCartContract, (): World => ({ lines: [], stock: {} }), {
  "a customer has a cart with {n} line items": (world, params) => {
    for (let index = 0; index < params.n; index += 1) {
      world.lines.push({ productId: `product-${String(index)}`, quantity: 0, unitPrice: 0 });
    }
  },
  "every line item has quantity {q} and unit price {price}": (world, params) => {
    world.lines = world.lines.map((line) => ({
      ...line,
      quantity: params.q,
      unitPrice: params.price,
    }));
  },
  "every cart item is {availability}": (world, params) => {
    world.stock = Object.fromEntries(
      world.lines.map((line) => [
        line.productId,
        params.availability === "in stock" ? line.quantity : 0,
      ]),
    );
  },
  "the customer submits the cart for order creation": (world) => {
    world.order = createOrderFromCart(
      { customerId: "customer-7", lines: world.lines },
      world.stock,
    );
  },
  "an order is created with total {total}": (world, params) => {
    expect(world.order?.orderId).toBe("order-customer-7");
    expect(world.order?.total).toBe(params.total);
  },
  "the order contains the original cart lines": (world) => {
    expect(world.order?.lines).toEqual(world.lines);
  },
});
