---
id: spec:decisions.order-lifecycle
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:orders.create-order
---
# Order lifecycle keeps validation before creation

## Intent

- outcome: Decide when checkout-v1 may create an order.
- value: The authored example has one stable lifecycle rule for success and rejection paths.

## Decision

- decision: Create orders only after cart validation confirms non-empty input and sufficient inventory.
- rationale: The valid-cart and invalid-cart examples need one consistent gate.
- rationale: Rejecting before persistence keeps the tracer bullet small and internally consistent.
- consequence: Rejected carts never create partial orders.
