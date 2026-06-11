# Create-order API contract

`spec:orders.create-order.api-contract` · Contract (`contract`) · altitude `story` · authored in [specs/orders/create-order-api-contract.sdp.ts](../../../specs/orders/create-order-api-contract.sdp.ts) `[declared]`

**Readiness:** stated `idea` · structural floor reached: `idea`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Pin the request and response shapes of POST /orders.

### Open questions

- Does the response carry the inventory-snapshot version the order was validated against? — **blocking**

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
