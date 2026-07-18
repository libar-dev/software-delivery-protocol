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
