// BROKEN BY DESIGN — the ORACLE-side drift proof. The parent spec renamed the
// slot {q} → {qty}; the regenerated space contract (after-edit) changed
// Conditions; the oracle still reads `c.q`. Expected tsc error, captured in
// TSC-OUTPUT.txt: the oracle is typed against the generated space, so the
// third-executable-statement worry (spec prose / test / model) has a
// mechanical answer at the vocabulary level — the oracle CANNOT silently
// drift from the spec's dimensions. (Its OUTCOME semantics stay
// human-reviewed, by law: no check judges content faithfulness.)

import type { CreateOrderConditions } from "./contracts/orders.create-order.space.after-edit";
import type { Outcome } from "./create-order.oracle";

export function expectedAfterSpecEdit(c: CreateOrderConditions): Outcome {
  if (c.n === 0) return { kind: "rejected", reason: "empty cart" };
  if (c.availability === "out of stock") return { kind: "rejected", reason: "out of stock" };
  if (c.q <= 0 || c.price <= 0) return { kind: "unspecified" };
  return { kind: "order-created", total: c.n * c.q * c.price };
}
