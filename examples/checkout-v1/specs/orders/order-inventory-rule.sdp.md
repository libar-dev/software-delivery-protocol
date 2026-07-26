---
id: spec:orders.order-inventory-rule
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:orders.create-order
---
# Order creation requires available inventory

## Intent

- outcome: Reject carts whose items are not fully available.
- value: Order creation does not over-promise unavailable stock.

## Rule

- Every cart line must have at least the requested quantity available.
- Any unavailable line blocks order creation for the whole cart.
