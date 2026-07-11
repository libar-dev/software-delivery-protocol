---
# EMITTED by `sdp import` — a Gherkin `Rule:` block maps to a `rule`-kind
# spec (a named coordinate on the one primitive; its scenarios refine it).
# The generated ID comes from the rule text — rename freely, IDs are yours.
id: spec:orders.create-order.valid-cart-becomes-an-order
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:orders.create-order
---

# A valid cart becomes an order

A submitted cart whose items are available becomes an order; the order math
must hold.
