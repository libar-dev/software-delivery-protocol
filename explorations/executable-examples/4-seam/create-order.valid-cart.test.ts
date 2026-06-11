// The bound test — the AUTHORED executable half. Compare with gen 1's 102-line
// .steps.ts shadow file: no Rule/Scenario nesting (structure lives in the
// contract), no string duplication risk (keys are the contract's literal
// union — autocompleted), no module-level mutable state (fresh world per
// example). The author writes ONLY the leaves.
//
// Beside it, unchanged from today, sits the binding anchor (the only thing the
// graph ever reads — the seam below it is invisible to extraction):
//   export const t = specTest({ id: testAnchorId("test:orders.create-order.valid-cart"),
//                               verifies: ref("spec:orders.create-order.valid-cart") });

import { bindExample } from "./protocol-runner";
import { validCartContract } from "./contracts/orders.create-order.valid-cart.contract";
import { check, createOrderFromCart, type Cart, type Order } from "./fake-shop";

interface World {
  cart: Cart;
  stock: Record<string, number>;
  order?: Order;
}

bindExample(
  validCartContract,
  (): World => ({
    cart: { customerId: "customer-7", lines: [] },
    stock: {},
  }),
  {
    "A customer has a cart with one or more line items.": (w) => {
      w.cart.lines.push(
        { productId: "product-a", quantity: 2, unitPrice: 25 },
        { productId: "product-b", quantity: 1, unitPrice: 50 },
      );
    },
    "Every cart item is in stock.": (w) => {
      w.stock = { "product-a": 5, "product-b": 3 };
    },
    "Each line item has a positive quantity and a unit price.": (w) => {
      check(w.cart.lines.every((l) => l.quantity > 0 && l.unitPrice > 0), "fixture invariant");
    },
    "The customer submits the cart for order creation.": (w) => {
      w.order = createOrderFromCart(w.cart, w.stock);
    },
    "An order is created.": (w) => {
      check(w.order !== undefined && w.order.orderId === "order-customer-7", "order exists with stable id");
    },
    "The order total equals the sum of quantity multiplied by unit price for each line item.": (w) => {
      check(w.order?.total === 2 * 25 + 1 * 50, "cart-math total");
    },
    "The order contains the original cart lines.": (w) => {
      check(JSON.stringify(w.order?.lines) === JSON.stringify(w.cart.lines), "lines preserved");
    },
  },
);
