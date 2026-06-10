# Checkout v1

`pack:checkout-v1` · Pack (the grouping / review aggregate — states no truth of its own) · authored in [specs/checkout.pack.sdp.ts](../../../specs/checkout.pack.sdp.ts) `[declared]`

> Let customers create orders from valid carts with honest authored traceability.

## Members

| Spec | Kind | Altitude | Stated | Floor reached | Implementation binding | Verifier binding |
|---|---|---|---|---|---|---|
| [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) Order lifecycle keeps validation before creation | decision | feature | defined | ready | none | none |
| [`spec:orders.create-order`](../spec/orders.create-order.md) Customer creates an order | behavior | feature | defined | ready | present | present |
| [`spec:orders.create-order.invalid-cart`](../spec/orders.create-order.invalid-cart.md) Invalid cart is rejected | example | story | defined | ready | none | none |
| [`spec:orders.create-order.valid-cart`](../spec/orders.create-order.valid-cart.md) Valid cart creates an order | example | story | defined | ready | none | present |
| [`spec:orders.order-inventory-rule`](../spec/orders.order-inventory-rule.md) Order creation requires available inventory | rule | story | defined | ready | none | none |
| [`spec:orders.order-latency-constraint`](../spec/orders.order-latency-constraint.md) Create-order latency stays within checkout budget | constraint | story | defined | ready | none | none |
| [`spec:orders.order-management`](../spec/orders.order-management.md) Order management | behavior | epic | defined | ready | none | none |
| [`spec:orders.order-model`](../spec/orders.order-model.md) Order-management domain vocabulary | model | story | defined | ready | none | none |
| [`spec:orders.order-total-rule`](../spec/orders.order-total-rule.md) Order total matches cart math | rule | story | defined | ready | none | none |

**Vocabulary (`modelRefs`):** [`spec:orders.order-model`](../spec/orders.order-model.md) — Order-management domain vocabulary

## Verifier coverage gaps

Members with no verifier binding — a surfaced absence, informative, never a gate. `ready` members are the priority slice (designed, stated done, unverified):

- [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) — Order lifecycle keeps validation before creation (stated `defined`)
- [`spec:orders.create-order.invalid-cart`](../spec/orders.create-order.invalid-cart.md) — Invalid cart is rejected (stated `defined`)
- [`spec:orders.order-inventory-rule`](../spec/orders.order-inventory-rule.md) — Order creation requires available inventory (stated `defined`)
- [`spec:orders.order-latency-constraint`](../spec/orders.order-latency-constraint.md) — Create-order latency stays within checkout budget (stated `defined`)
- [`spec:orders.order-management`](../spec/orders.order-management.md) — Order management (stated `defined`)
- [`spec:orders.order-model`](../spec/orders.order-model.md) — Order-management domain vocabulary (stated `defined`)
- [`spec:orders.order-total-rule`](../spec/orders.order-total-rule.md) — Order total matches cart math (stated `defined`)

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
