# Order placement flow

`spec:orders.order-placement-flow` · Workflow (`workflow`) · altitude `feature` · authored in [specs/orders/order-placement-flow.sdp.md](../../../specs/orders/order-placement-flow.sdp.md) `[declared]`

**Readiness:** stated `scoped` · structural floor reached: `scoped`

## Bindings

- Implementation binding: **none**
- Verifier binding: **none**
- Expected-outcome oracle: **none**
- Runtime observation: **not tracked**

## Intent

- **outcome:** Sequence cart submission through validation to a created order.
- **value:** The slice states how create-order is reached without modeling the rest of checkout.

## Behavior

### Flows

- The customer submits a cart from checkout.
- Create-order validates the cart against the inventory snapshot.
- A valid cart becomes an order; an invalid cart returns a validation error.

## Relations & impact (one hop)

Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.

- Belongs to: [`pack:checkout-v1`](../pack/checkout-v1.md) `[declared]`
- dependsOn → [`spec:orders.create-order`](orders.create-order.md) — Customer creates an order `[declared]`
- refines → [`spec:orders.order-management`](orders.order-management.md) — Order management `[declared]`

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
