# Order lifecycle keeps validation before creation

`spec:decisions.order-lifecycle` · Decision Record (`decision`) · altitude `feature` · authored in [specs/decisions/order-lifecycle.sdp.ts](../../../specs/decisions/order-lifecycle.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Decide when checkout-v1 may create an order.
- **value:** The authored example has one stable lifecycle rule for success and rejection paths.

## Decision

**Decision.** Create orders only after cart validation confirms non-empty input and sufficient inventory.

**Rationale.**

- The valid-cart and invalid-cart examples need one consistent gate.
- Rejecting before persistence keeps the tracer bullet small and internally consistent.

**Consequences.**

- Rejected carts never create partial orders.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`
- [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order — decidedBy → this spec `[declared]`
- [`spec:orders.order-management`](orders.order-management.md) — Order management — decidedBy → this spec `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
