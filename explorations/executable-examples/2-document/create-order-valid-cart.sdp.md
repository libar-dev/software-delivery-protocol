---
# The envelope as frontmatter. A generated JSON Schema ($schema, emitted by
# `sdp build` like the ids union — JS-B2.6's pattern) gives any editor
# autocomplete + red squiggles via the stock YAML language server.
id: spec:orders.create-order.valid-cart
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:orders.create-order
  verifies: spec:orders.create-order
---

# Valid cart creates an order

The happy path of create-order: a fully stocked cart becomes an order and the
order math holds. Free prose is first-class here — gen 1's epic-design-context
lived in Gherkin docstrings and got silently truncated by the projection; in a
markdown body it is simply the document.

```gwt
Given a customer has a cart with one or more line items
  And every cart item is in stock
  And each line item has a positive quantity and a unit price
When the customer submits the cart for order creation
Then an order is created
  And the order total equals the sum of quantity times unit price per line
  And the order contains the original cart lines
```

## Verification — executable

- The order result contains a stable id.
- The returned total matches the cart math.
