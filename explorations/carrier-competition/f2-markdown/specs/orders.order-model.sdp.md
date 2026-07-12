---
id: spec:orders.order-model
kind: model
altitude: story
readiness: defined
relations:
  refines: spec:orders.order-management
---
# Order-management domain vocabulary

## Intent

- outcome: Define the core terms used by the checkout-v1 order-management slice.
- value: Specs, code, and tests use the same vocabulary for carts, orders, and inventory.

## Model

- **cart** — A customer-selected set of line items that has not yet become an order.
- **cartLine** — A requested product, quantity, and unit price inside a cart.
- **inventorySnapshot** — The available quantity for each product at validation time.
- **order** — The persisted result of accepting a valid cart.
- **orderTotal** — The sum of all accepted cart line subtotals.
