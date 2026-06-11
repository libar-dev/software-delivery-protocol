# Customer creates an order

`spec:orders.create-order` · Use Case / Behavior (`behavior`) · altitude `feature` · authored in [specs/orders/create-order.sdp.ts](../../../specs/orders/create-order.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **present**
- Verifier binding: **present**
- Runtime observation: **not tracked**

### Implementations

- `api:orders.post` — POST /orders ([src/orders/create-order.route.ts:6](../../../src/orders/create-order.route.ts)) `[anchored]`
- `impl:orders.create-order-use-case` — createOrderFromCart ([src/orders/create-order.use-case.ts:23](../../../src/orders/create-order.use-case.ts)) `[anchored]`

### Verifiers

- `spec:orders.create-order.invalid-cart` — Invalid cart is rejected ([specs/orders/create-order-invalid-cart.sdp.ts](../../../specs/orders/create-order-invalid-cart.sdp.ts)) — **not enabled** (no test anchor binds this example — it confers no verifier binding) `[declared]`
- `spec:orders.create-order.valid-cart` — Valid cart creates an order ([specs/orders/create-order-valid-cart.sdp.ts](../../../specs/orders/create-order-valid-cart.sdp.ts)) — **enabled** (a resolving test anchor binds this example) `[declared]`

## Intent

- **actor:** customer
- **outcome:** Turn a valid cart into an order.
- **value:** Customers can complete purchases without the example modeling the rest of checkout.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- constrainedBy → [`spec:orders.order-latency-constraint`](orders.order-latency-constraint.md) — Create-order latency stays within checkout budget `[declared]`
- decidedBy → [`spec:decisions.order-lifecycle`](decisions.order-lifecycle.md) — Order lifecycle keeps validation before creation `[declared]`
- refines → [`spec:orders.order-management`](orders.order-management.md) — Order management `[declared]`
- [`spec:decisions.order-lifecycle`](decisions.order-lifecycle.md) — Order lifecycle keeps validation before creation — refines → this spec `[declared]`
- [`spec:orders.create-order.invalid-cart`](orders.create-order.invalid-cart.md) — Invalid cart is rejected — refines → this spec `[declared]`
- [`spec:orders.create-order.valid-cart`](orders.create-order.valid-cart.md) — Valid cart creates an order — refines → this spec `[declared]`
- [`spec:orders.order-inventory-rule`](orders.order-inventory-rule.md) — Order creation requires available inventory — refines → this spec `[declared]`
- [`spec:orders.order-latency-constraint`](orders.order-latency-constraint.md) — Create-order latency stays within checkout budget — refines → this spec `[declared]`
- [`spec:orders.order-total-rule`](orders.order-total-rule.md) — Order total matches cart math — refines → this spec `[declared]`

## Findings

| Severity | Check | Message | Where |
|---|---|---|---|
| warning | `conformance/verifies-linkage` | Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier. | `specs/orders/create-order-invalid-cart.sdp.ts` |

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
