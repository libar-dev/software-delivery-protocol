---
id: spec:orders.create-order
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:orders.order-management
  constrainedBy: spec:orders.order-latency-constraint
  decidedBy: spec:decisions.order-lifecycle
---
# Customer creates an order

## Intent

- actor: customer
- outcome: Turn a valid cart into an order.
- value: Customers can complete purchases without the example modeling the rest of checkout.

## Example space

```gwt-vocabulary
Given a customer has a cart with {n:number} line items
  And every line item has quantity {q:number} and unit price {price:number}
  And every cart item is {availability:"in stock"|"out of stock"}
When the customer submits the cart for order creation
Then an order is created with total {total:number}
  And the order contains the original cart lines
  And order creation is rejected because {reason:"empty cart"|"out of stock"}
```
