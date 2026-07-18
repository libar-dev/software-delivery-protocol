# Task 13 checkout-v1 round-trip evidence

- Final commit: 566321f
- Graph-level: PASS
- Delta catalog applied: carrier file suffix only; physical envelope and TS comments are absent from graph content; delivery facts and schema version compare exactly.
- Baseline/current summary: 11 Specs, 1 Pack, 5 anchors, 17 nodes, 32 edges.

| Spec | Emitted bytes | Reified authored data |
|---|---:|---:|
| `spec:decisions.order-lifecycle` | PASS | PASS |
| `spec:orders.create-order.api-contract` | PASS | PASS |
| `spec:orders.create-order.invalid-cart` | PASS | PASS |
| `spec:orders.create-order.valid-cart` | PASS | PASS |
| `spec:orders.create-order` | PASS | PASS |
| `spec:orders.order-inventory-rule` | PASS | PASS |
| `spec:orders.order-latency-constraint` | PASS | PASS |
| `spec:orders.order-management` | PASS | PASS |
| `spec:orders.order-model` | PASS | PASS |
| `spec:orders.order-placement-flow` | PASS | PASS |
| `spec:orders.order-total-rule` | PASS | PASS |

Result: 11/11 authored-level pairs and the graph-level baseline comparison pass with zero prose normalization.
