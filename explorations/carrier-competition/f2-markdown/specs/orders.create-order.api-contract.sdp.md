---
id: spec:orders.create-order.api-contract
kind: contract
altitude: story
readiness: idea
relations:
  refines: spec:orders.create-order
---
# Create-order API contract

This contract parks honestly at `idea`: the blocking open question prevents it from clearing the
`defined` floor, and no contract evidence has been authored yet.

## Intent

- outcome: Pin the request and response shapes of POST /orders.

### Open questions

- [blocking] Does the response carry the inventory-snapshot version the order was validated against?
