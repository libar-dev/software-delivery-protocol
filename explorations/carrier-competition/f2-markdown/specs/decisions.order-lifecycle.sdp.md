---
id: spec:decisions.order-lifecycle
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:orders.create-order
---
# Order lifecycle keeps validation before creation

## Context

The valid-cart and invalid-cart paths need one stable lifecycle choice. Persistence before
validation would allow partial orders and enlarge the tracer bullet.

## Intent

- outcome: Decide when checkout-v1 may create an order.
- value: The authored example has one stable lifecycle rule for success and rejection paths.

## Decision

- decision: Create orders only after cart validation confirms non-empty input and sufficient inventory.
- rationale: The valid-cart and invalid-cart examples need one consistent gate.
- rationale: Rejecting before persistence keeps the tracer bullet small and internally consistent.
- consequences: Rejected carts never create partial orders.
