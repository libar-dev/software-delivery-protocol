// DELIBERATELY BROKEN — stages the three gen-1 failure modes that surfaced at
// RUNTIME (StepAbleUnknowStepError) or needed a custom linter, and shows each
// becoming a compile-time error that NAMES the step string. Run:
//   npx tsc -p explorations/executable-examples/4-seam
// All errors land in this file; the real test beside it stays clean.

import { bindExample } from "./protocol-runner";
import { validCartContract } from "./contracts/orders.create-order.valid-cart.contract";
import { validCartContract as afterSpecEdit } from "./contracts/orders.create-order.valid-cart.contract.after-edit";

type W = Record<string, never>;
const world = (): W => ({});
const todo = () => {};

// ── Drift 1: a step has NO handler (gen 1: runtime StepAbleUnknowStepError) ──
bindExample(validCartContract, world, {
  "A customer has a cart with one or more line items.": todo,
  // "Every cart item is in stock."  ← forgotten
  "Each line item has a positive quantity and a unit price.": todo,
  "The customer submits the cart for order creation.": todo,
  "An order is created.": todo,
  "The order total equals the sum of quantity multiplied by unit price for each line item.": todo,
  "The order contains the original cart lines.": todo,
});

// ── Drift 2: the SPEC was edited; this binding still uses the old wording ──
// (gen 1: silently unbound until the runner exploded; the drift alarm now fires
//  at the cheapest possible moment, naming the stale string.)
bindExample(afterSpecEdit, world, {
  "A customer has a cart with one or more line items.": todo,
  "Every cart item is in stock.": todo, // ← stale: spec now says "available in stock"
  "Each line item has a positive quantity and a unit price.": todo,
  "The customer submits the cart for order creation.": todo,
  "An order is created.": todo,
  "The order total equals the sum of quantity multiplied by unit price for each line item.": todo,
  "The order contains the original cart lines.": todo,
});

// ── Drift 3: a typo in a step key (gen 1: lint-steps territory) ──
// tsc's own did-you-mean does the spell-check — no custom linter.
bindExample(validCartContract, world, {
  "A customer has a cart with one or more line items.": todo,
  "Every cart item is in stok.": todo, // ← typo
  "Each line item has a positive quantity and a unit price.": todo,
  "The customer submits the cart for order creation.": todo,
  "An order is created.": todo,
  "The order total equals the sum of quantity multiplied by unit price for each line item.": todo,
  "The order contains the original cart lines.": todo,
});
