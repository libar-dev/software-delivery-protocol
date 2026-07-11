---
# EMITTED by `sdp import` — the second Rule: block.
id: spec:orders.create-order.invalid-carts-are-rejected
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:orders.create-order
---

# Invalid carts are rejected

A cart that cannot become an order is rejected with a reason the customer
sees.
