import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { validCartContract } from "../../generated/contracts/orders.create-order.valid-cart.contract.js";
import { createOrderFromCart } from "../../src/orders/create-order.use-case.js";
import type { CartLine, CreatedOrder } from "../../src/orders/create-order.use-case.js";

// The binding anchor and the bound test live side by side (`04` §2): the anchor is what makes
// the valid-cart example an enabled verifier — unchanged by the executable machinery (the
// anchor layer is untouched; everything below is runner-side DX).
export const createOrderValidCartTest = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart verifies the create-order happy path",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

// The executable half binds the GENERATED step contract (derived from the graph — never the
// authored spec module): a spec-side step rename, a missing handler, or a typo'd key is a `tsc`
// error naming the step, and the parameter values flow from the spec into the assertions —
// `total === p.total` asserts the spec's authored 100; editing the spec reddens this test with
// zero test-side edits.
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
