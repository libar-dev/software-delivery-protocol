---
# EMITTED by `sdp import` — a Scenario Outline maps to the parent's example
# space (see the behavior spec) and ONE example per Examples row, each a
# bound point. Row 1: | 1 | 50 | 50 |. Generated names are placeholders —
# the report suggests renaming to what the point MEANS (e.g. single-unit-cart).
id: spec:orders.create-order.order-total.case-1
kind: example
altitude: story
readiness: scoped
relations:
  refines: spec:orders.create-order.valid-cart-becomes-an-order
---

# Order total reflects quantity and unit price — case 1

```gwt
Given a signed-in customer
  And a cart with {qty: 1} units of a {price: 50} item
When the customer submits the cart for order creation
Then the order total is {total: 50}
```
