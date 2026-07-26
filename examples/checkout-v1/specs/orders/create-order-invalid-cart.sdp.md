---
id: spec:orders.create-order.invalid-cart
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:orders.create-order
  verifies: spec:orders.create-order
---
# Invalid cart is rejected

## Intent

- outcome: Show that an invalid cart does not become an order.
- value: The authored example captures the rejection path without adding invalid fixtures to the model.

```gwt
Given a customer has a cart with {n: 0} line items
When the customer submits the cart for order creation
Then order creation is rejected because {reason: "empty cart"}
```

## Verification — executable

- The use case throws when the cart is empty.
- The thrown error names the rejection reason.
