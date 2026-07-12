/**
 * The drift cases — each `bindPoint` call below FAILS `tsc`, and the error quotes the exact
 * authored step string. Captured verbatim in TSC-OUTPUT.txt. Compare `4-seam/drift-demo.test.ts`
 * (the same drift caught at the generated-contract seam): this spike catches it EARLIER — in the
 * editor, before any build runs — while the contracts remain the seam of record.
 *
 * Honest framing: every case here is legal transitional authoring (a child authored ahead of
 * its parent's vocabulary, a rename mid-flight across files) that the SHIPPED pipeline answers
 * loudly but never gates — gating stays `validateGraph`'s alone — and the posture splits by
 * whether the STEP resolves, not by which slot is wrong (verified at source):
 * - CASES 1 and 3 (a step skeleton the parent space never/no-longer declares): the child's
 *   step contract is WITHHELD (`contracts/unmatched-vocabulary-step`), while the parent's
 *   space contract still emits with the foreign binding dropped from the point
 *   (`contracts/undeclared-slot`).
 * - CASES 2a and 2b (the step resolves; the VALUE is off its declared type): nothing is
 *   withheld — the space contract drops the binding from the point and the step contract
 *   widens that param to its scalar kind (`contracts/off-dimension-value`), so the generated
 *   artifacts always compile.
 * The spike surfaces the same drift as-you-type — earlier and louder than the codegen — but a
 * hard `tsc` error is STRICTER than every one of those postures; the promotion caveat is in
 * the README. What is deliberately absent: the unbound-slot form (`{n}`), which compiles here
 * (see valid-cart.demo.ts) — legal authoring below `defined` for which the codegen emits no
 * step contract and no warning (refusal by design; the readiness floor owns the honesty via
 * the concreteness law).
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
