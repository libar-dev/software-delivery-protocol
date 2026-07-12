---
# EMITTED by `sdp import` — a plain Scenario maps to an `example`-kind spec.
# The Background's Given is hoisted into the example (Cucumber semantics made
# explicit — flagged in the report). Inline values ("2 line items") stay
# concrete prose: no slots are invented where the source proved none.
id: spec:orders.create-order.valid-cart-creates-an-order
kind: example
altitude: story
readiness: scoped
relations:
  refines: spec:orders.create-order.valid-cart-becomes-an-order
---

# Valid cart creates an order

```gwt
Given a signed-in customer
  And a cart with 2 line items
  And every cart item is in stock
When the customer submits the cart for order creation
Then an order is created
  And the order total equals the cart total
```
