---
# EMITTED by `sdp import` — plain Scenario under the second Rule.
id: spec:orders.create-order.empty-cart-is-rejected
kind: example
altitude: story
readiness: scoped
relations:
  refines: spec:orders.create-order.invalid-carts-are-rejected
---

# Empty cart is rejected

```gwt
Given a signed-in customer
  And an empty cart
When the customer submits the cart for order creation
Then no order is created
  And the customer sees "empty cart"
```
