# Order total matches cart math

`spec:orders.order-total-rule` · Business Rule (`rule`) · altitude `story` · authored in [specs/orders/order-total-rule.sdp.ts](../../../specs/orders/order-total-rule.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Keep the order total equal to the sum of cart line subtotals.
- **value:** Customers and downstream systems see one deterministic order total.

## Behavior

### Rules

- Each line subtotal is quantity multiplied by unit price.
- The order total is the sum of all line subtotals.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
