---
id: spec:orders.order-total-rule
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:orders.create-order
---
# Order total matches cart math

## Intent

- outcome: Keep the order total equal to the sum of cart line subtotals.
- value: Customers and downstream systems see one deterministic order total.

## Rule

- Each line subtotal is quantity multiplied by unit price.
- The order total is the sum of all line subtotals.
