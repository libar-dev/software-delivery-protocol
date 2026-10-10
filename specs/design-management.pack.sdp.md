---
id: pack:design-management-v1
specs:
  - spec:decisions.pack-design-page
  - spec:consumers.pack-design
  - spec:consumers.design-review.pack-design-page
  - spec:extraction.entry-locations
  - spec:consumers.agent-surface.recipe-parameters
  - spec:consumers.agent-surface.design-recipes
  - spec:consumers.engine-provenance
  - spec:model.design-maturity
modelRefs:
  - spec:model.design-maturity
---
# Design management

The arc of plan 41, in the order a reviewer reads it: what lets a person working in the repository design a capability ahead of its code and iterate on it. First the Pack page that shows where a Pack's design stands, and the reader assembly it renders; then the graph's record of where each entry is written, the recipe parameters and files, and the recipes design work reads; then the engine's provenance. The captured Specs that follow hold what the original design (`docs/lineage/v0-design/`) promised and the Protocol has not built, each at the rung its structure clears, with the question that holds it there.
