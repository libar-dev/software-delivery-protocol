---
# EMITTED by `sdp import` (mock emission) — the Feature header becomes the
# parent behavior spec. Readiness is stated at the lowest honest rung the
# imported evidence supports; the floor evaluator earns anything higher.
id: spec:orders.create-order
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:orders.order-management # placeholder — the importer asks; see IMPORT-REPORT
---

# Create order

As a customer I want my cart to become an order so that I can complete my
purchase.

## Example space

Derived from the Scenario Outline's placeholders; slot types inferred from the
Examples columns (all rows numeric → `number` — flagged as *inferred* in the
import report, confirm or tighten by hand). Steps from plain scenarios are NOT
promoted to vocabulary — inline values there are prose until a human
parameterizes them.

```gwt-vocabulary
Given a cart with {qty:number} units of a {price:number} item
When the customer submits the cart for order creation
Then the order total is {total:number}
```
