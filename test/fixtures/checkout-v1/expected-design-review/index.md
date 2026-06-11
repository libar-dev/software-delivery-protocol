# Design Review

The one generated read-only view — a pure projection of the one graph (`graph.json`, schema `0.3.0`): 13 nodes · 25 edges.

## Specs

| Spec | Kind | Altitude | Stated | Floor reached | Implementation binding | Verifier binding |
|---|---|---|---|---|---|---|
| [`spec:decisions.order-lifecycle`](spec/decisions.order-lifecycle.md) Order lifecycle keeps validation before creation | decision | feature | defined | ready | none | none |
| [`spec:orders.create-order`](spec/orders.create-order.md) Customer creates an order | behavior | feature | defined | ready | present | present |
| [`spec:orders.create-order.invalid-cart`](spec/orders.create-order.invalid-cart.md) Invalid cart is rejected | example | story | defined | ready | none | none |
| [`spec:orders.create-order.valid-cart`](spec/orders.create-order.valid-cart.md) Valid cart creates an order | example | story | defined | ready | none | present |
| [`spec:orders.order-inventory-rule`](spec/orders.order-inventory-rule.md) Order creation requires available inventory | rule | story | defined | ready | none | none |
| [`spec:orders.order-latency-constraint`](spec/orders.order-latency-constraint.md) Create-order latency stays within checkout budget | constraint | story | defined | ready | none | none |
| [`spec:orders.order-management`](spec/orders.order-management.md) Order management | behavior | epic | defined | ready | none | none |
| [`spec:orders.order-model`](spec/orders.order-model.md) Order-management domain vocabulary | model | story | defined | ready | none | none |
| [`spec:orders.order-total-rule`](spec/orders.order-total-rule.md) Order total matches cart math | rule | story | defined | ready | none | none |

## Packs

- [`pack:checkout-v1`](pack/checkout-v1.md) Checkout v1 — Let customers create orders from valid carts with honest authored traceability.

## Findings

| Severity | Check | Message | Where |
|---|---|---|---|
| warning | `conformance/verifies-linkage` | Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier. | `specs/orders/create-order-invalid-cart.sdp.ts` |

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
