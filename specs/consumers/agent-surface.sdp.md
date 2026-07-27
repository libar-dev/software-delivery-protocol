---
id: spec:consumers.agent-surface
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
  decidedBy: spec:decisions.agent-surface-scripts-graph
---
# Agents script a visible typed graph

## Intent
- outcome: Let an agent obtain and compose graph context without rebuilding joins or navigating a fixed verb wall.

## Behavior
- rule: The agent surface exposes a visible, self-describing typed graph through the CLI; the schema is the contract and agents script the graph directly.
- rule: The reader constructs decoded joins and claim taxonomy once, then returns plain composable data without persisting graph state.
- rule: Entry adapters bridge strings, files, and changesets to curated graph context; file-level blast radius names coverage-unknown files rather than implying exhaustive reach.
- rule: Context efficiency is an empirical result: a measured comparison may show structured graph context uses fewer supplied tokens than a comparable raw-text workflow while preserving the task-relevant result.
- rule: Measured evidence: a multi-probe agent comparison used about one fifth of the tokens of a comparable grep or verb-API workflow while preserving task-relevant conclusions.
- rule: An agent arrives holding a concept string, a file it is editing, or the changeset a diff touches, and not the Spec id it is looking for, so the surface is designed around those entry points rather than around lookup by id.
- rule: The string entry is `findByConcept`, the file entry is `byFile`, and the changeset entry is `blastRadius`, whose answer names every coverage-unknown changed file rather than dropping it into silence.
- rule: The symbol entry is designed for and deferred: `bySymbol` would resolve through the aspirational impact graph, no such substrate exists, and the adapter is absent rather than stubbed so its absence cannot read as a landed capability.
- rule: Past those entry adapters the surface grows by recipe and not by verb: a join is frozen into the reader only when a second machine consumer needs it and hand-rolled attempts get it wrong, and every other question stays a body an agent scripts.
