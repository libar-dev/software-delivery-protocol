# Order creation requires available inventory

`spec:orders.order-inventory-rule` · Business Rule (`rule`) · altitude `story` · authored in [specs/orders/order-inventory-rule.sdp.ts](../../../specs/orders/order-inventory-rule.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Reject carts whose items are not fully available.
- **value:** Order creation does not over-promise unavailable stock.

## Behavior

### Rules

- Every cart line must have at least the requested quantity available.
- Any unavailable line blocks order creation for the whole cart.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
