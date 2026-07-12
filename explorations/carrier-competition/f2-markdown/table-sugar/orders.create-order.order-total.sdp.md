---
id: spec:orders.create-order.order-total
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:orders.create-order
---
# Order total is the sum of accepted cart lines

## Intent

- outcome: Define representative points for the order-total rule.
- value: Reviewers can compare the quantity and price dimensions without duplicating step text.

## Rule

- The order total equals the sum of quantity times unit price for every accepted cart line.

```gwt-table
Given a customer has a cart with {n} line items
  And every line item has quantity {q} and unit price {price}
  And every cart item is {availability}
When the customer submits the cart for order creation
Then an order is created with total {total}

| point       | n | q | price | availability | total |
| ----------- | - | - | ----- | ------------ | ----- |
| single-unit | 1 | 1 | 50    | "in stock"   | 50    |
| multi-line  | 3 | 2 | 20    | "in stock"   | 120   |
| zero-price  | 2 | 1 | 0     | "in stock"   | 0     |
```
