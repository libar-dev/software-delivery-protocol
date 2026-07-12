# Valid cart creates an order

`spec:orders.create-order.valid-cart` · Example / Scenario (`example`) · altitude `story` · authored in [specs/orders/create-order-valid-cart.sdp.ts](../../../specs/orders/create-order-valid-cart.sdp.ts) `[declared]`

**Readiness:** stated `ready` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **present**
- Expected-outcome oracle: **none**
- Runtime observation: **not tracked**

### Verifiers

- `test:orders.create-order.valid-cart` — valid cart verifies the create-order happy path ([test/orders/create-order.valid-cart.test.ts:13](../../../test/orders/create-order.valid-cart.test.ts)) — the enabled verifying binding (a resolving test anchor) `[anchored]`

## Intent

- **outcome:** Show that a valid cart can become an order.
- **value:** The authored example demonstrates the happy path for create-order.

## Behavior

### Examples

- Example:
  - **given**
    - a customer has a cart with 2 line items
    - every line item has quantity 1 and unit price 50
    - every cart item is in stock
  - **when**
    - the customer submits the cart for order creation
  - **then**
    - an order is created with total 100
    - the order contains the original cart lines

## Verification intent

- **mode:** `executable`

### Criteria

- The order result contains a stable id.
- The returned total matches the authored total — the spec's value, never the test's.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`
- verifies → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
