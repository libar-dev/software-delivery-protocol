// The bound test with typed parameters. Two things to notice against the
// 4-seam version:
//
//   1. Fixture values are GONE from the handlers — n, q, price, availability
//      flow in from the contract's authored point. The spec, not the test,
//      picks the point.
//   2. The Then assertion value is the spec's: `total === p.total` — 4-seam
//      hardcoded `2 * 25 + 1 * 50` in the handler. Edit the spec's total and
//      THIS test goes red with zero test-side edits: the spec drives the test.
//
// The specTest anchor sits beside this, unchanged from today (see 4-seam).

import { bindExample } from "./protocol-runner";
import { validCartContract } from "./contracts/orders.create-order.valid-cart.contract";
import { check, createOrderFromCart, type Cart, type Order } from "../4-seam/fake-shop";

interface World {
  cart: Cart;
  stock: Record<string, number>;
  order?: Order;
}

bindExample(
  validCartContract,
  (): World => ({ cart: { customerId: "customer-7", lines: [] }, stock: {} }),
  {
    "a customer has a cart with {n} line items": (w, p) => {
      for (let i = 0; i < p.n; i++) {
        w.cart.lines.push({ productId: `product-${i}`, quantity: 0, unitPrice: 0 });
      }
    },
    "every line item has quantity {q} and unit price {price}": (w, p) => {
      for (const line of w.cart.lines) {
        line.quantity = p.q;
        line.unitPrice = p.price;
      }
    },
    "every cart item is {availability}": (w, p) => {
      w.stock = Object.fromEntries(
        w.cart.lines.map((l) => [l.productId, p.availability === "in stock" ? l.quantity : 0]),
      );
    },
    "the customer submits the cart for order creation": (w) => {
      w.order = createOrderFromCart(w.cart, w.stock);
    },
    "an order is created with total {total}": (w, p) => {
      check(w.order !== undefined && w.order.total === p.total, "authored total holds");
    },
    "the order contains the original cart lines": (w) => {
      check(JSON.stringify(w.order?.lines) === JSON.stringify(w.cart.lines), "lines preserved");
    },
  },
);
