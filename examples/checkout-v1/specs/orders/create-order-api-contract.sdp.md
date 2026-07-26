---
id: spec:orders.create-order.api-contract
kind: contract
altitude: story
readiness: idea
relations:
  refines: spec:orders.create-order
---
# Create-order API contract

## Intent

- outcome: Pin the request and response shapes of POST /orders.

### Open questions

- [blocking] Does the response carry the inventory-snapshot version the order was validated against?
