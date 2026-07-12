# Table sugar evidence

The table lives inside the `gwt-table` fence, not as a floating Markdown table. The fence is the
one owned-grammar surface on a rented CommonMark page, so the rows cannot drift away from their
template steps. The first `point` column gives every row stable identity and therefore a stable
child id: `spec:orders.create-order.order-total.<point>`.

Expansion is static and happens before the graph. The host remains one `rule` Spec and each row
becomes one `example` child with one bound point, preserving the point-per-example law (MD-17).
The graph never contains a table or a multi-point example. The generated siblings are
regenerable and never hand-edited.

This shape is also the merge argument. A value change is a one-line row diff; concurrent changes
to distinct points normally merge line-by-line. The expanded files never participate in an
authored merge, so the only conflict surface is the table whose rows reviewers already see.

The generated children state `defined`, not `ready`: the table supplies complete structured and
fully bound evidence, but it authors no test anchors. Readiness remains an author statement over
the cumulative floor, never a reward for expansion.
