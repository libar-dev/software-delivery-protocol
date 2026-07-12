# Invalid cart is rejected

`spec:orders.create-order.invalid-cart` · Example / Scenario (`example`) · altitude `story` · authored in [specs/orders/create-order-invalid-cart.sdp.ts](../../../specs/orders/create-order-invalid-cart.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Expected-outcome oracle: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Show that an invalid cart does not become an order.
- **value:** The authored example captures the rejection path without adding invalid fixtures to the model.

## Behavior

### Examples

- Example:
  - **given**
    - a customer has a cart with 0 line items
  - **when**
    - the customer submits the cart for order creation
  - **then**
    - order creation is rejected because empty cart

## Verification intent

- **mode:** `executable`

### Criteria

- The use case throws when the cart is empty.
- The thrown error names the rejection reason.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`
- verifies → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`

## Findings

| Severity | Check | Message | Where |
|---|---|---|---|
| warning | `conformance/verifies-linkage` | Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier. | `specs/orders/create-order-invalid-cart.sdp.ts` |

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
