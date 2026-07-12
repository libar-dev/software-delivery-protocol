---
id: spec:orders.create-order.valid-cart
kind: example
altitude: story
readiness: scoped
relations:
  refines: spec:orders.create-order
  verifies: spec:orders.create-order
---
# Valid cart creates an order

## Intent

- outcome: Show that a valid cart can become an order.
- value: The authored example demonstrates the happy path for create-order.

```gwt
A fully stocked cart becomes an order and the order math holds.
```
