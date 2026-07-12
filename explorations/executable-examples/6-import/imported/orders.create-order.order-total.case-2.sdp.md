---
# EMITTED by `sdp import` — Examples row 2: | 3 | 20 | 60 |.
id: spec:orders.create-order.order-total.case-2
kind: example
altitude: story
readiness: scoped
relations:
  refines: spec:orders.create-order.valid-cart-becomes-an-order
---

# Order total reflects quantity and unit price — case 2

```gwt
Given a signed-in customer
  And a cart with {qty: 3} units of a {price: 20} item
When the customer submits the cart for order creation
Then the order total is {total: 60}
```
