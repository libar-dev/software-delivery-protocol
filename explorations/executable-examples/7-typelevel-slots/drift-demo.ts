/**
 * The drift cases — each `bindPoint` call below FAILS `tsc`, and the error quotes the exact
 * authored step string. Captured verbatim in TSC-OUTPUT.txt. Compare `4-seam/drift-demo.test.ts`
 * (the same drift caught at the generated-contract seam): this spike catches it EARLIER — in the
 * editor, before any build runs — while the contracts remain the seam of record.
 */

import { bindPoint, declareExampleSpace } from "./typelevel-slots.js";
import { createOrderSpace } from "./valid-cart.demo.js";

// CASE 1 — unknown slot name: `{m: 2}` binds a slot no vocabulary step declares.
export const unknownSlot = bindPoint(createOrderSpace)({
  given: ["a customer has a cart with {m: 2} line items"],
  when: ["the customer submits the cart for order creation"],
  then: ["the order contains the original cart lines"],
});

// CASE 2a — wrong value type: `{n: "2"}` binds a string into a `{n:number}` dimension.
export const wrongValueType = bindPoint(createOrderSpace)({
  given: ['a customer has a cart with {n: "2"} line items'],
  when: ["the customer submits the cart for order creation"],
  then: ["the order contains the original cart lines"],
});

// CASE 2b — out-of-union literal: "in stok" is not a member of the closed availability union.
export const outOfUnion = bindPoint(createOrderSpace)({
  given: ['every cart item is {availability: "in stok"}'],
  when: ["the customer submits the cart for order creation"],
  then: ["the order contains the original cart lines"],
});

// CASE 3 — parent-side rename: the vocabulary's `{n:number}` becomes `{count:number}` (the
// twin-space pattern, as 4-seam's contracts/*.after-edit.ts) and the child's untouched `{n: 2}`
// step reddens — the spec edit breaks the stale binding as-you-type.
export const createOrderSpaceAfterEdit = declareExampleSpace({
  given: [
    "a customer has a cart with {count:number} line items",
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

export const staleAfterRename = bindPoint(createOrderSpaceAfterEdit)({
  given: ["a customer has a cart with {n: 2} line items"],
  when: ["the customer submits the cart for order creation"],
  then: ["the order contains the original cart lines"],
});

// CASE 4 — unbound slot: `{n}` binds nothing, so the step is no point at all — the concreteness
// law's shape (an example with an unbound slot in a used step does not meet `defined`), visible
// in the editor before the readiness floor ever evaluates it.
export const unboundSlot = bindPoint(createOrderSpace)({
  given: ["a customer has a cart with {n} line items"],
  when: ["the customer submits the cart for order creation"],
  then: ["the order contains the original cart lines"],
});
