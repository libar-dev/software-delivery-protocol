// BROKEN BY DESIGN — the parameter-level drift catalog, staged the way the
// 4-seam demo staged step-text drift. Every failure here was invisible to
// gen 1 until runtime (or forever). Expected tsc errors, captured in
// TSC-OUTPUT.txt:
//
//   (1) a handler reads a slot the step does not carry (`p.qty` vs `q`)
//   (2) a handler compares a closed-union slot to a value outside the union
//       ("backordered" is not in {availability}'s vocabulary)
//   (3) a handler does arithmetic with the whole params bag instead of a slot
//       (shape misuse — the bag is typed, not `any`)

import { bindExample } from "./protocol-runner";
import { validCartContract } from "./contracts/orders.create-order.valid-cart.contract";
import type { Cart, Order } from "../4-seam/fake-shop";

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
      // (1) the slot is `n`; `qty` does not exist on this step's params
      for (let i = 0; i < p.qty; i++) {
        w.cart.lines.push({ productId: `product-${i}`, quantity: 0, unitPrice: 0 });
      }
    },
    "every line item has quantity {q} and unit price {price}": (w, p) => {
      // (3) `p` is the typed bag { q; price }, not a number
      const lineValue = p * 2;
      void lineValue;
      for (const line of w.cart.lines) {
        line.quantity = p.q;
        line.unitPrice = p.price;
      }
    },
    "every cart item is {availability}": (w, p) => {
      // (2) the union is "in stock" | "out of stock" — no overlap with this
      if (p.availability === "backordered") {
        w.stock = {};
      }
    },
    "the customer submits the cart for order creation": () => {},
    "an order is created with total {total}": () => {},
    "the order contains the original cart lines": () => {},
  },
);
