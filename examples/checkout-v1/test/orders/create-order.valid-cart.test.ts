import { describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { createOrderFromCart } from "../../src/orders/create-order.use-case.js";

// The binding anchor and the runner test live side by side (`04` §2): the anchor is what makes
// the valid-cart example an enabled verifier; the test below is its executable half, mirroring
// the example's Given/When/Then.
export const createOrderValidCartTest = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart verifies the create-order happy path",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

describe("create-order: valid cart", () => {
  it("creates an order with a stable id, the cart-math total, and the original cart lines", () => {
    const cart = {
      customerId: "customer-7",
      lines: [
        { productId: "product-a", quantity: 2, unitPrice: 25 },
        { productId: "product-b", quantity: 1, unitPrice: 50 },
      ],
    };

    const order = createOrderFromCart(cart, { "product-a": 5, "product-b": 3 });

    expect(order.orderId).toBe("order-customer-7");
    expect(order.customerId).toBe("customer-7");
    expect(order.total).toBe(2 * 25 + 1 * 50);
    expect(order.lines).toEqual(cart.lines);
  });
});
