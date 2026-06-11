# Create-order latency stays within checkout budget

`spec:orders.order-latency-constraint` · Constraint (NFR) (`constraint`) · altitude `story` · authored in [specs/orders/order-latency-constraint.sdp.ts](../../../specs/orders/order-latency-constraint.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Keep create-order fast enough for interactive checkout.
- **value:** Customers are not left waiting after submitting a valid cart.

## Constraints

| Flavor | Statement | Target | Measurable by |
|---|---|---|---|
| performance | Create-order should respond within the checkout latency budget. | latency.p95.lt:250ms | — |

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`
- [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order — constrainedBy → this spec `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
