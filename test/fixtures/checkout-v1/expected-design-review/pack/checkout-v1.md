# Checkout v1

`pack:checkout-v1` · Pack (the grouping / review aggregate — states no truth of its own) · authored in [specs/checkout.pack.sdp.md](../../../specs/checkout.pack.sdp.md) `[declared]`

> Let customers create orders from valid carts with honest authored traceability.

**Vocabulary (`modelRefs`):** [`spec:orders.order-model`](../spec/orders.order-model.md) — Order-management domain vocabulary

## Members

One row per member in the manifest's order. The stated next rung is the rung above the stated one, with `holds` when the floor already holds it and its first unmet clause otherwise. A binding or design reference reads present when a resolving anchor exists, and none otherwise.

| Spec | Kind | Altitude | Stated | Floor reached | Stated next rung | Design entries | Declarations | Open questions | Decisions | Design reference | Implementation binding | Verifier binding |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [`spec:orders.order-management`](../spec/orders.order-management.md) (1) Order management | behavior | epic | defined | ready | ready · holds | 0 | 0 | 0 | [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) (defined) | none | none | none |
| [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) (2) Order placement flow | workflow | feature | scoped | scoped | defined · `kind-evidence-complete` | 0 | 0 | 0 | — | none | none | none |
| [`spec:orders.create-order`](../spec/orders.create-order.md) (3) Customer creates an order | behavior | feature | defined | ready | ready · holds | 0 | 0 | 0 | [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) (defined) | none | present | present |
| [`spec:orders.create-order.valid-cart`](../spec/orders.create-order.valid-cart.md) (4) Valid cart creates an order | example | story | ready | ready | — | 0 | 0 | 0 | — | none | none | present |
| [`spec:orders.create-order.invalid-cart`](../spec/orders.create-order.invalid-cart.md) (5) Invalid cart is rejected | example | story | defined | ready | ready · holds | 0 | 0 | 0 | — | none | none | none |
| [`spec:orders.create-order.api-contract`](../spec/orders.create-order.api-contract.md) (6) Create-order API contract | contract | story | idea | idea | scoped · `kind-evidence-present` | 0 | 0 | 1 (1 blocking) | — | none | none | none |
| [`spec:orders.order-total-rule`](../spec/orders.order-total-rule.md) (7) Order total matches cart math | rule | story | defined | ready | ready · holds | 0 | 0 | 0 | — | none | present | none |
| [`spec:orders.order-inventory-rule`](../spec/orders.order-inventory-rule.md) (8) Order creation requires available inventory | rule | story | defined | ready | ready · holds | 0 | 0 | 0 | — | none | none | none |
| [`spec:orders.order-latency-constraint`](../spec/orders.order-latency-constraint.md) (9) Create-order latency stays within checkout budget | constraint | story | defined | ready | ready · holds | 0 | 0 | 0 | — | none | none | none |
| [`spec:orders.order-model`](../spec/orders.order-model.md) (10) Order-management domain vocabulary | model | story | defined | ready | ready · holds | 0 | 0 | 0 | — | none | none | none |
| [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) (11) Order lifecycle keeps validation before creation | decision | feature | defined | ready | ready · holds | 0 | 0 | 0 | — | none | none | none |

## Next rung

The floor clauses that fail at the rung above each member's stated rung, with the targets a failing dependency clause names. This is a report, never a promotion: only an author's edit states a rung.

### [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) Order placement flow

Stated `scoped`; the floor does not hold `defined`:

- `kind-evidence-complete` — The kind's natural evidence is complete (per-kind evidence table).

### [`spec:orders.create-order.api-contract`](../spec/orders.create-order.api-contract.md) Create-order API contract

Stated `idea`; the floor does not hold `scoped`:

- `kind-evidence-present` — The kind's natural evidence is present (per-kind evidence table).

### Waiting for the author's statement

The floor already holds these members at their next rung. That is not approval: the page records no review, and the rung stays unstated until its author states it.

- stated `defined`, next `ready`: [`spec:orders.order-management`](../spec/orders.order-management.md) Order management
- stated `defined`, next `ready`: [`spec:orders.create-order`](../spec/orders.create-order.md) Customer creates an order
- stated `defined`, next `ready`: [`spec:orders.create-order.invalid-cart`](../spec/orders.create-order.invalid-cart.md) Invalid cart is rejected
- stated `defined`, next `ready`: [`spec:orders.order-total-rule`](../spec/orders.order-total-rule.md) Order total matches cart math
- stated `defined`, next `ready`: [`spec:orders.order-inventory-rule`](../spec/orders.order-inventory-rule.md) Order creation requires available inventory
- stated `defined`, next `ready`: [`spec:orders.order-latency-constraint`](../spec/orders.order-latency-constraint.md) Create-order latency stays within checkout budget
- stated `defined`, next `ready`: [`spec:orders.order-model`](../spec/orders.order-model.md) Order-management domain vocabulary
- stated `defined`, next `ready`: [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) Order lifecycle keeps validation before creation

## Boundary

### Rests on

The Specs outside the Pack that a member refines, depends on, is constrained by or is decided by.

None.

### Rested on by

The Specs outside the Pack that relate to a member by an authored relation.

None.

## Open questions

### [`spec:orders.create-order.api-contract`](../spec/orders.create-order.api-contract.md) Create-order API contract

- **blocking** — Does the response carry the inventory-snapshot version the order was validated against? ([specs/orders/create-order-api-contract.sdp.md:17](../../../specs/orders/create-order-api-contract.sdp.md#L17))

## Code

The code units that realize each member, and those that answer to its design without claiming to realize it, each with its role and its component's layer and context. A reference confers no implementation binding.

### [`spec:orders.order-management`](../spec/orders.order-management.md) Order management

No code unit realizes or references this member.

### [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) Order placement flow

No code unit realizes or references this member.

### [`spec:orders.create-order`](../spec/orders.create-order.md) Customer creates an order

#### Implementations

- `api:orders.post` — POST /orders ([src/orders/create-order.route.ts:6](../../../src/orders/create-order.route.ts#L6)) `[anchored]`
- `impl:orders.create-order-use-case` — createOrderFromCart ([src/orders/create-order.use-case.ts:23](../../../src/orders/create-order.use-case.ts#L23)) `[anchored]`

### [`spec:orders.create-order.valid-cart`](../spec/orders.create-order.valid-cart.md) Valid cart creates an order

No code unit realizes or references this member.

### [`spec:orders.create-order.invalid-cart`](../spec/orders.create-order.invalid-cart.md) Invalid cart is rejected

No code unit realizes or references this member.

### [`spec:orders.create-order.api-contract`](../spec/orders.create-order.api-contract.md) Create-order API contract

No code unit realizes or references this member.

### [`spec:orders.order-total-rule`](../spec/orders.order-total-rule.md) Order total matches cart math

#### Implementations

- `impl:orders.order-total` — cart-math order total ([src/orders/create-order.use-case.ts:31](../../../src/orders/create-order.use-case.ts#L31)) `[anchored]`

### [`spec:orders.order-inventory-rule`](../spec/orders.order-inventory-rule.md) Order creation requires available inventory

No code unit realizes or references this member.

### [`spec:orders.order-latency-constraint`](../spec/orders.order-latency-constraint.md) Create-order latency stays within checkout budget

No code unit realizes or references this member.

### [`spec:orders.order-model`](../spec/orders.order-model.md) Order-management domain vocabulary

No code unit realizes or references this member.

### [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) Order lifecycle keeps validation before creation

No code unit realizes or references this member.

## Verifier coverage gaps

Members with no verifier binding — a surfaced absence, informative, never a gate. `ready` members are the priority slice (designed, stated done, unverified):

- [`spec:orders.order-management`](../spec/orders.order-management.md) — Order management (stated `defined`)
- [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) — Order placement flow (stated `scoped`)
- [`spec:orders.create-order.invalid-cart`](../spec/orders.create-order.invalid-cart.md) — Invalid cart is rejected (stated `defined`)
- [`spec:orders.create-order.api-contract`](../spec/orders.create-order.api-contract.md) — Create-order API contract (stated `idea`)
- [`spec:orders.order-total-rule`](../spec/orders.order-total-rule.md) — Order total matches cart math (stated `defined`)
- [`spec:orders.order-inventory-rule`](../spec/orders.order-inventory-rule.md) — Order creation requires available inventory (stated `defined`)
- [`spec:orders.order-latency-constraint`](../spec/orders.order-latency-constraint.md) — Create-order latency stays within checkout budget (stated `defined`)
- [`spec:orders.order-model`](../spec/orders.order-model.md) — Order-management domain vocabulary (stated `defined`)
- [`spec:decisions.order-lifecycle`](../spec/decisions.order-lifecycle.md) — Order lifecycle keeps validation before creation (stated `defined`)

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
