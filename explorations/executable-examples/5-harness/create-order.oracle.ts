// The behavior ORACLE — the authored expected() semantics of the example
// space. Proposed legal status (for the design session to ratify by name):
//
//   - Implementation-side, like step bindings: it lives with tests, bound by
//     an oracle anchor; the graph records that a model EXISTS (the anchor),
//     never what it says. Never extracted, never authoritative (MD-7's
//     posture, one artifact over).
//   - PER PARENT behavior spec, not per example — one model, many examples,
//     which is what makes coverage computable (examples witness the oracle's
//     equivalence classes).
//   - It exists so the harness works at readiness `defined`, BEFORE any
//     implementation or bound test exists — which is why bound step handlers
//     cannot be the primary semantics (they don't exist yet at review time).
//   - TYPED AGAINST THE GENERATED SPACE — so vocabulary drift in the spec
//     breaks the oracle at tsc time (oracle-drift-demo.ts is the proof). The
//     model cannot silently diverge from the spec's dimensions.

import type {
  CreateOrderConditions,
  CreateOrderOutcome,
} from "./contracts/orders.create-order.space";

// The oracle's return type is GENERATED from the parent's Then vocabulary —
// so the oracle cannot invent an outcome the specs never named (tsc rejects
// it), and "unspecified" (contributed by the runner core) is the honest,
// first-class answer for a region the spec set does not state; the harness
// renders it as a coverage gap.
export type Outcome = CreateOrderOutcome;

export function expected(c: CreateOrderConditions): Outcome {
  if (c.n === 0) return { kind: "rejected", reason: "empty cart" };
  if (c.availability === "out of stock") return { kind: "rejected", reason: "out of stock" };
  if (c.q <= 0 || c.price <= 0) return { kind: "unspecified" };
  return { kind: "order-created", total: c.n * c.q * c.price };
}

// The binding anchor (mock — mirrors specTest, one artifact over):
//   export const m = specOracle({
//     id: oracleAnchorId("oracle:orders.create-order"),
//     models: ref("spec:orders.create-order"),
//   });
