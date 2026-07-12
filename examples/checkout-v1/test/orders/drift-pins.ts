// The DRIFT PINS — the exploration's captured `tsc` transcripts re-landed as compile-time
// regression tests (plan 13 exit criteria). Every case below stages a drift that gen 1 could
// surface only at runtime (or never), suppressed by a @ts-expect-error that names it: if the
// compiler ever STOPS rejecting one of these, the unused directive itself becomes the error
// (TS2578) and the drift alarm's regression is loud. This module is typechecked, never executed
// (it is not a *.test.ts, and nothing imports it).

import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { validCartContract } from "../../generated/contracts/orders.create-order.valid-cart.contract.js";
import type {
  CreateOrderConditions,
  CreateOrderOutcome,
} from "../../generated/contracts/orders.create-order.space.js";

type World = Record<string, never>;
const world = (): World => ({});
const todo = (): void => {};

/* ── Drift 1: a step has NO handler (gen 1: runtime StepAbleUnknowStepError) ─────────────── */

bindExample(
  validCartContract,
  world,
  // @ts-expect-error -- the "every cart item is {availability}" handler is missing; the bindings
  // must cover EVERY step, so tsc names the forgotten one (4-seam drift 1)
  {
    "a customer has a cart with {n} line items": todo,
    "every line item has quantity {q} and unit price {price}": todo,
    "the customer submits the cart for order creation": todo,
    "an order is created with total {total}": todo,
    "the order contains the original cart lines": todo,
  },
);

/* ── Drift 2 + 3: a stale key after a spec-side rename, and a typo'd key ─────────────────── */

bindExample(validCartContract, world, {
  "a customer has a cart with {n} line items": todo,
  // @ts-expect-error -- a stale/typo'd step key is an excess property naming the exact string
  // (4-seam drifts 2 and 3; tsc's own did-you-mean replaces gen 1's custom linter)
  "every cart item is in stok": todo,
  "every line item has quantity {q} and unit price {price}": todo,
  "every cart item is {availability}": todo,
  "the customer submits the cart for order creation": todo,
  "an order is created with total {total}": todo,
  "the order contains the original cart lines": todo,
});

/* ── Drift 4–6: the parameter-level catalog (5-harness) ──────────────────────────────────── */

bindExample(validCartContract, world, {
  "a customer has a cart with {n} line items": (_w, p) => {
    // @ts-expect-error -- the slot is `n`; `qty` does not exist on this step's params
    // (5-harness drift 1: a renamed-slot read fails compile-time)
    void p.qty;
  },
  "every line item has quantity {q} and unit price {price}": (_w, p) => {
    // @ts-expect-error -- the params bag is typed { q; price }, not a number
    // (5-harness drift 3: shape misuse fails compile-time)
    void (p * 2);
  },
  "every cart item is {availability}": (_w, p) => {
    // @ts-expect-error -- "backordered" is outside the closed union "in stock" | "out of stock"
    // (5-harness drift 2: an out-of-union comparison fails compile-time)
    void (p.availability === "backordered");
  },
  "the customer submits the cart for order creation": todo,
  "an order is created with total {total}": todo,
  "the order contains the original cart lines": todo,
});

/* ── Drift 7: the oracle reads a slot the space no longer declares ────────────────────────── */

export function expectedAfterVocabularyDrift(c: CreateOrderConditions): CreateOrderOutcome {
  // @ts-expect-error -- `qty` is not a dimension of the generated Conditions; rename a slot in
  // the spec and the oracle fails to compile (oracle-drift-demo, captured)
  void c.qty;

  return { kind: "unspecified" };
}

/* ── Drift 8: the oracle claims an outcome the specs never stated ─────────────────────────── */

export function overclaimingOracle(c: CreateOrderConditions): CreateOrderOutcome {
  void c;

  // @ts-expect-error -- "the order is backordered" names no Then-vocabulary step, so the Outcome
  // union rejects it: the oracle may never claim more than the specs state (settlement 8)
  return { kind: "the order is backordered" };
}
