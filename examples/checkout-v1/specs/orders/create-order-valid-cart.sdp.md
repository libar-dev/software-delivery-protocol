---
id: spec:orders.create-order.valid-cart
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:orders.create-order
  verifies: spec:orders.create-order
---
# Valid cart creates an order

## Intent

- outcome: Show that a valid cart can become an order.
- value: The authored example demonstrates the happy path for create-order.

```gwt
Given a customer has a cart with {n: 2} line items
And every line item has quantity {q: 1} and unit price {price: 50}
And every cart item is {availability: "in stock"}
When the customer submits the cart for order creation
Then an order is created with total {total: 100}
And the order contains the original cart lines
```

## Verification — executable

- The order result contains a stable id.
- The returned total matches the authored total — the spec's value, never the test's.
