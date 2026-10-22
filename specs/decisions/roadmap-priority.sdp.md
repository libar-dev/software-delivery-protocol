---
id: spec:decisions.roadmap-priority
kind: decision
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:decisions.planning-truths-placement
    reason: narrows the refusal of recorded work order for one case, the advisory priority of a roadmap
---
# A roadmap states advisory priority in the graph

## Intent

- outcome: Decide whether and how the graph may hold an advisory priority over upcoming work, a roadmap, without dates, without a new relation, and without gating or sequencing any work.

### Open questions

- [blocking #priorityHome] Where does a roadmap's priority live: in the authored order of a Pack marked as a roadmap, in a Pack the corpus names by convention, or outside the graph as corpus data a recipe reads?
  - decider: owner
  - provisional: in the authored member order of a Pack whose manifest marks its order as priority
