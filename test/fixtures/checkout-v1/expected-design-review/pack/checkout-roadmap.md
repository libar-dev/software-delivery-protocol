# Checkout roadmap

`pack:checkout-roadmap` · Pack (the grouping / review aggregate — states no truth of its own) · authored in [specs/roadmap.pack.sdp.md](../../../specs/roadmap.pack.sdp.md) `[declared]`

> Clarify how a customer reaches order creation, then review the shared order vocabulary. The order is advisory priority; needs come from the graph and confer no permission.

## Members

One row per member in the manifest's order. The stated next rung is the rung above the stated one, with `nothing blocks` when the floor already holds it and its first unmet clause otherwise. A binding or design reference reads present when a resolving anchor exists, and none otherwise.

| Spec | Kind | Altitude | Stated | Floor reached | Stated next rung | Design entries | Declarations | Open questions | Decisions | Design reference | Implementation binding | Verifier binding |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) (1) Order placement flow | workflow | feature | scoped | scoped | defined · `kind-evidence-complete` | 0 | 0 | 0 | — | none | none | none |
| [`spec:orders.order-model`](../spec/orders.order-model.md) (2) Order-management domain vocabulary | model | story | defined | ready | ready · nothing blocks | 0 | 0 | 0 | — | none | none | none |

## Stated next rung

The floor clauses that fail at the rung above each member's stated rung, with the targets a failing dependency clause names. This is a report, never a promotion: only an author's edit states a rung.

### [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) Order placement flow

Stated `scoped`; the floor does not hold `defined`:

- `kind-evidence-complete` — The kind's natural evidence is complete (per-kind evidence table).

### Waiting for the author's statement

The floor already holds these members at their stated next rung. That is not approval: the page records no review, and the rung stays unstated until its author states it.

- stated `defined`, next `ready`: [`spec:orders.order-model`](../spec/orders.order-model.md) Order-management domain vocabulary

## Boundary

### Rests on

The Specs outside the Pack that a member refines, depends on, is constrained by or is decided by.

| Spec | Stated | Implementation binding | Members joined |
|---|---|---|---|
| [`spec:orders.create-order`](../spec/orders.create-order.md) Customer creates an order | defined | present | dependsOn: [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) |
| [`spec:orders.order-management`](../spec/orders.order-management.md) Order management | defined | none | refines: [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md), [`spec:orders.order-model`](../spec/orders.order-model.md) |

### Rested on by

The Specs outside the Pack that refine, depend on, are constrained by or are decided by a member.

None.

### Verified by

The Specs outside the Pack that verify a member.

None.

### Superseded by

The Specs outside the Pack that supersede a member.

None.

## Open questions

No member records an open question.

## Code

The code units that realize each member, and those that answer to its design without claiming to realize it, each with its role and its component's layer and context. A reference confers no implementation binding.

### [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) Order placement flow

No implementation or design-reference binding is recorded for this member.

### [`spec:orders.order-model`](../spec/orders.order-model.md) Order-management domain vocabulary

No implementation or design-reference binding is recorded for this member.

## Verifier coverage gaps

Members other than decisions with no verifier binding — a surfaced absence, informative, never a gate. `ready` members are the priority slice (designed, stated done, unverified):

- [`spec:orders.order-placement-flow`](../spec/orders.order-placement-flow.md) — Order placement flow (stated `scoped`)
- [`spec:orders.order-model`](../spec/orders.order-model.md) — Order-management domain vocabulary (stated `defined`)

## Findings

None — conformance + honesty clean for this page's subject.

---

*Generated from the one graph by `sdp view` — read-only; regenerate to update.*
