---
id: spec:consumers.graph-first-planning
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.delivery-session-on-ramp
---
# Arc intent is planned from the graph, not a prose briefs index

## Intent

- outcome: Forward arc intent is captured as sub-ready Specs so planning sessions derive the backlog, sequencing, and readiness from the graph, with plans reduced to thin lineage pointers.

### Open questions

- [blocking] Which truths a prose briefs index carries today — dependency maps between work items, decision gates, do-not-reopen rows — belong in Spec relations and prose, and which remain in a thin plan lineage pointer?
- [blocking] How does an arc boundary stay legible in the graph (a Pack, a relation cluster, a naming convention) without minting a workflow gate or an authored delivery fact?

## Behavior

- rule: `spec:consumers.delivery-session-on-ramp` owns per-session routing from graph state; this Spec owns only arc-scale commissioning — how the next arc's intent enters the corpus and is read back.
- rule: Planning remains advisory reading of the graph; no recipe, preflight, or plan document authorizes, blocks, or sequences delivery work.
