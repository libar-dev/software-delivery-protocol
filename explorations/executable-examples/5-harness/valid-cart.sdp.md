---
# SKETCH — the example as a BOUND POINT in the parent's space. Binding syntax
# `{slot: value}` is explicit here (no Gherkin-style text matching — matching
# is the rented-grammar trap); the grammar session may choose a prettier form.
id: spec:orders.create-order.valid-cart
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:orders.create-order
  verifies: spec:orders.create-order
---

# Valid cart creates an order

The happy path: a fully stocked cart becomes an order and the order math
holds.

```gwt
Given a customer has a cart with {n: 2} line items
  And every line item has quantity {q: 1} and unit price {price: 50}
  And every cart item is {availability: "in stock"}
When the customer submits the cart for order creation
Then an order is created with total {total: 100}
  And the order contains the original cart lines
```

Every slot is **bound** — an example is a point, by definition. (Proposed
conformance check, structural not content-quality: an `example`-kind spec
with an unbound slot does not meet `defined`.)

Note the Then binds the **outcome** point too: the bound test asserts
`total === 100` with the value flowing from THIS file through the generated
contract — never hardcoded test-side. Editing this 100 reddens the bound test
with zero test edits: the spec drives the test.

## Verification — executable

- The order result contains a stable id.
- The returned total matches the authored total.
