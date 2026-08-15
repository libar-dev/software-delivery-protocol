import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import type {
  CreateOrderConditions,
  CreateOrderOutcome,
} from "../../generated/contracts/orders.create-order.space.js";
import { createOrderFromCart } from "../../src/orders/create-order.use-case.js";
import type { CartLine, CreatedOrder } from "../../src/orders/create-order.use-case.js";
import { expected } from "./create-order.oracle.js";
import { registerValidCart } from "./orders.create-order.valid-cart.test.generated.js";
export const createOrderValidCartTest = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart verifies the create-order happy path",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

interface World {
  lines: CartLine[];
  stock: Record<string, number>;
  order?: CreatedOrder;
}

export function createWorld(point: Partial<CreateOrderConditions>): World {
  const { n, q, price, availability } = point;
  if (n === undefined || q === undefined || price === undefined || availability === undefined) {
    throw new Error("valid-cart requires its complete generated Conditions point");
  }

  const lines = Array.from({ length: n }, (_, index) => ({
    productId: `product-${String(index)}`,
    quantity: q,
    unitPrice: price,
  }));
  const stock = Object.fromEntries(
    lines.map((line) => [line.productId, availability === "in stock" ? line.quantity : 0]),
  );
  return { lines, stock };
}

export function invoke(world: World): void {
  world.order = createOrderFromCart({ customerId: "customer-7", lines: world.lines }, world.stock);
}

export function observe(world: World): CreateOrderOutcome {
  if (world.order === undefined) {
    throw new Error("create-order produced no observable order");
  }
  return { kind: "an order is created with total {total}", total: world.order.total };
}

export function assertions(world: World): void {
  expect(world.order?.orderId).toBe("order-customer-7");
  expect(world.order?.lines).toEqual(world.lines);
}

registerValidCart({ createWorld, invoke, observe, expected, assertions });
