# Order-management domain vocabulary

`spec:orders.order-model` · Domain Model (`model`) · altitude `story` · authored in [specs/orders/order-model.sdp.ts](../../../specs/orders/order-model.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Define the core terms used by the checkout-v1 order-management slice.
- **value:** Specs, code, and tests use the same vocabulary for carts, orders, and inventory.

## Domain vocabulary

| Term | Definition |
|---|---|
| cart | A customer-selected set of line items that has not yet become an order. |
| cartLine | A requested product, quantity, and unit price inside a cart. |
| inventorySnapshot | The available quantity for each product at validation time. |
| order | The persisted result of accepting a valid cart. |
| orderTotal | The sum of all accepted cart line subtotals. |

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.order-management`](orders.order-management.md) — Order management `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
