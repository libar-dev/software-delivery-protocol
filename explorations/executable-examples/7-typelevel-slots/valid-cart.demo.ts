/**
 * The happy path — the real worked-example vocabulary and its bound point, checked as-you-type.
 * This file compiles CLEAN; every error in TSC-OUTPUT.txt comes from drift-demo.ts.
 *
 * The strings are the ones `examples/checkout-v1/specs/orders/create-order.sdp.ts` (the parent's
 * example space) and `create-order-valid-cart.sdp.ts` (the child's bound point) author today —
 * copied, never imported: the exhibit shows what the TS DSL itself could check at authoring
 * time, with zero new authoring surface.
 */

import { bindPoint, declareExampleSpace, type SpaceDimensions } from "./typelevel-slots.js";

export const createOrderSpace = declareExampleSpace({
  given: [
    "a customer has a cart with {n:number} line items",
    "every line item has quantity {q:number} and unit price {price:number}",
    'every cart item is {availability:"in stock"|"out of stock"}',
  ],
  when: ["the customer submits the cart for order creation"],
  then: [
    "an order is created with total {total:number}",
    "the order contains the original cart lines",
    'order creation is rejected because {reason:"empty cart"|"out of stock"}',
  ],
});

/**
 * Hover this in an editor: the space's typed dimensions, parsed from the strings above —
 * `{ n: number; q: number; price: number; availability: "in stock" | "out of stock";
 *    total: number; reason: "empty cart" | "out of stock" }`.
 */
export type CreateOrderDimensions = SpaceDimensions<typeof createOrderSpace>;

const dimensionsParse: CreateOrderDimensions = {
  n: 2,
  q: 1,
  price: 50,
  availability: "in stock",
  total: 100,
  reason: "empty cart",
};

void dimensionsParse;

export const validCartPoint = bindPoint(createOrderSpace)({
  given: [
    "a customer has a cart with {n: 2} line items",
    "every line item has quantity {q: 1} and unit price {price: 50}",
    'every cart item is {availability: "in stock"}',
  ],
  when: ["the customer submits the cart for order creation"],
  then: [
    "an order is created with total {total: 100}",
    "the order contains the original cart lines",
  ],
});

/**
 * The law boundary, shown compiling: an UNBOUND slot (`{n}`) is legal authoring — a partial
 * point held below `defined` by the readiness floor (the concreteness law), never rejected at
 * the type surface. Checks police honesty, never workflow; a hard error here would gate
 * authoring the protocol permits. At build time such an example earns no step contract —
 * refusal is the honest behavior — and the floor, not the compiler, owns its readiness verdict.
 */
export const partialPointStillAuthorable = bindPoint(createOrderSpace)({
  given: ["a customer has a cart with {n} line items"],
  when: ["the customer submits the cart for order creation"],
  then: ["the order contains the original cart lines"],
});
