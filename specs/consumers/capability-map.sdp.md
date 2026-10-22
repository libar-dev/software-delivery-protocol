---
id: spec:consumers.capability-map
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:consumers.projections-model
    reason: the capability map is a projection of the refinement graph, never a second grouping
---
# The capability map reads every epic with the features and stories that refine it

A corpus already states its capabilities through refinement: a story refines a feature, a feature refines an epic. No view draws that structure, so a person filtering by altitude sees a flat list and reads the corpus by Pack instead. The capability map draws it as a tree read from `refines`, each Spec with its readiness and delivery facts, and lists every Spec no epic reaches, so the map never hides one.

## Intent

- actor: A person or an agent who wants to see what the corpus can do, capability by capability, before reading any one Pack.
- problem: Refinement is authored on every Spec, yet no view draws it, so the corpus reads as Packs and a flat list, and a reader cannot see which capabilities exist or how far each is designed and built.
- outcome: Draw every epic with the features and stories that refine it, each with its stated readiness, the floor it reaches and its delivery facts, and list the Specs no epic reaches.

### Open questions

- [blocking #multipleParents] Where does the map place a Spec that refines more than one parent?
  - decider: delegated
  - provisional: under every parent, the second and later placements marked as repeats that link to the first
- [blocking #unreached] How does the map show a Spec that no epic reaches through refinement?
  - decider: delegated
  - provisional: in its own section after the epics, grouped by the highest Spec its refinement reaches
