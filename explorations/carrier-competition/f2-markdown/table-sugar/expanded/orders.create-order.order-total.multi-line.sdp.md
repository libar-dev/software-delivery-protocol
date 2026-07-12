---
id: spec:orders.create-order.order-total.multi-line
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:orders.create-order.order-total
---
# Order total is the sum of accepted cart lines: multi-line

## Intent

- outcome: Show the multi-line point in the order-total example space.
- value: The table expands to one bound point per example.

```gwt
Given a customer has a cart with {n: 3} line items
  And every line item has quantity {q: 2} and unit price {price: 20}
  And every cart item is {availability: "in stock"}
When the customer submits the cart for order creation
Then an order is created with total {total: 120}
```
