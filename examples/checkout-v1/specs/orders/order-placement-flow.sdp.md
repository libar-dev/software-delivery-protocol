---
id: spec:orders.order-placement-flow
kind: workflow
altitude: feature
readiness: scoped
relations:
  refines: spec:orders.order-management
  dependsOn: spec:orders.create-order
---
# Order placement flow

## Intent

- outcome: Sequence cart submission through validation to a created order.
- value: The slice states how create-order is reached without modeling the rest of checkout.

## Workflow

- The customer submits a cart from checkout.
- Create-order validates the cart against the inventory snapshot.
- A valid cart becomes an order; an invalid cart returns a validation error.
