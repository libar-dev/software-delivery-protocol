# Valid cart creates an order

`spec:orders.create-order.valid-cart` · Example / Scenario (`example`) · altitude `story` · authored in [specs/orders/create-order-valid-cart.sdp.ts](../../../specs/orders/create-order-valid-cart.sdp.ts) `[declared]`

**Readiness:** stated `defined` · structural floor reached: `ready`

## Bindings

- Implementation binding: **none**
- Verifier binding: **present**
- Runtime observation: **not tracked**

### Verifiers

- `test:orders.create-order.valid-cart` — valid cart verifies the create-order happy path ([test/orders/create-order.valid-cart.test.ts:10](../../../test/orders/create-order.valid-cart.test.ts)) — the enabled verifying binding (a resolving test anchor) `[anchored]`

## Intent

- **outcome:** Show that a valid cart can become an order.
- **value:** The authored example demonstrates the happy path for create-order.

## Behavior

### Examples

- Example:
  - **given**
    - A customer has a cart with one or more line items.
    - Every cart item is in stock.
    - Each line item has a positive quantity and a unit price.
  - **when**
    - The customer submits the cart for order creation.
  - **then**
    - An order is created.
    - The order total equals the sum of quantity multiplied by unit price for each line item.
    - The order contains the original cart lines.

## Verification intent

- **mode:** `executable`

### Criteria

- The order result contains a stable id.
- The returned total matches the cart math.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- refines → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`
- verifies → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
