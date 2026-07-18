---
id: spec:orders.order-latency-constraint
kind: constraint
altitude: story
readiness: defined
relations:
  refines: spec:orders.create-order
---
# Create-order latency stays within checkout budget

## Intent

- outcome: Keep create-order fast enough for interactive checkout.
- value: Customers are not left waiting after submitting a valid cart.

## Constraints

- statement: Create-order should respond within the checkout latency budget.
- flavor: performance
- target: latency.p95.lt:250ms
