# `cases` sugar: one row, one bound point

The table lives inside the grammar's `cases` block, not beside it as a floating document table.
Its template steps and rows therefore form one syntactic unit. The first `point` column gives every
row durable identity and therefore a stable child id:
`spec:orders.create-order.order-total.<point>`.

Expansion is static and happens before graph derivation. The host remains one `rule` Spec; each row
becomes one `example` child with one bound point. This preserves the point-per-example law (MD-17):
the graph never receives a table or a multi-point example. The three files under `expanded/` are
regenerable evidence and are never hand-edited.

This is also the merge argument. A value change is one row diff, and concurrent changes to
different named points merge line-by-line. Generated siblings never participate in the authored
merge. `table-expansion.test.ts` pins the emitted bytes, the N-child graph shape, every stated
readiness floor, and refusals for malformed separators, short rows, and colliding point ids.

The generated children state `defined`, not `ready`: the table provides structured, fully bound
evidence but authors no test anchor. Readiness stays an author statement over the cumulative floor,
never a reward for expansion.

The expander's generated intent sentence derives the example-space label from the host id's final
segment (`orders.create-order.order-total` → `order-total`); it carries no order-total-specific
constant. The illustrative subset still fixes generated children at `example · story · defined`, as
this exhibit's table shape requires.
