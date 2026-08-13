---
id: pack:checkout-v1
specs:
  - spec:orders.order-management
  - spec:orders.order-placement-flow
  - spec:orders.create-order
  - spec:orders.create-order.valid-cart
  - spec:orders.create-order.invalid-cart
  - spec:orders.create-order.api-contract
  - spec:orders.order-total-rule
  - spec:orders.order-inventory-rule
  - spec:orders.order-latency-constraint
  - spec:orders.order-model
  - spec:decisions.order-lifecycle
modelRefs:
  - spec:orders.order-model
---
# Checkout v1

Let customers create orders from valid carts with honest authored traceability.
