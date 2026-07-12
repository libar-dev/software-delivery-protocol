---
# SKETCH — the parent behavior spec gains an EXAMPLE SPACE: the parameterized
# step vocabulary its example children bind points in. The slot syntax is the
# grammar session's to design; the STRUCTURE (space on the parent, points on
# the children) is what this exhibit argues.
id: spec:orders.create-order
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:orders.order-management
---

# Create order

A customer turns a cart into an order. The order math must hold and stock
must be honored.

## Example space

Each parameter slot declares a name and a type; closed unions spell out the
values a reviewer can read. The children instantiate these — an example is a
point in this space.

```gwt-vocabulary
Given a customer has a cart with {n:number} line items
Given every line item has quantity {q:number} and unit price {price:number}
Given every cart item is {availability:"in stock"|"out of stock"}
When the customer submits the cart for order creation
Then an order is created with total {total:number}
Then the cart is rejected because {reason:"empty cart"|"out of stock"}
Then the order contains the original cart lines
```

From this section `sdp build` derives, per parent: the **space contract**
(`contracts/orders.create-order.space.ts` — typed dimensions + every child's
bound point) and each child's **step contract**. The harness renders its dials
from the dimensions; the oracle types itself against the Conditions; nothing
about the dials is authored twice.
