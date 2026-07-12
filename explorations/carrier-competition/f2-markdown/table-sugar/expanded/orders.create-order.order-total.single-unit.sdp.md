---
id: spec:orders.create-order.order-total.single-unit
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:orders.create-order.order-total
---
# Order total is the sum of accepted cart lines: single-unit

## Intent

- outcome: Show the single-unit point in the order-total example space.
- value: The table expands to one bound point per example.

```gwt
Given a customer has a cart with {n: 1} line items
  And every line item has quantity {q: 1} and unit price {price: 50}
  And every cart item is {availability: "in stock"}
When the customer submits the cart for order creation
Then an order is created with total {total: 50}
```
