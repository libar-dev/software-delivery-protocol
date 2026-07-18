---
id: spec:orders.order-management
kind: behavior
altitude: epic
readiness: defined
relations:
  decidedBy: spec:decisions.order-lifecycle
---
# Order management

## Intent

- outcome: Coordinate the authored order-management slice for checkout v1.
- value: The pack can express order creation behavior without modeling the full checkout flow.

## Behavior

- rule: Order management keeps order creation, rules, constraints, and decisions traceable in one authored slice.
- rule: Every order-management child spec keeps its targets inside the checkout-v1 example set.
