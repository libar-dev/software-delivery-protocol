---
id: pack:design-management-v1
specs:
  - spec:decisions.pack-design-page
  - spec:consumers.pack-design
  - spec:consumers.design-review.pack-design-page
  - spec:extraction.entry-locations
  - spec:consumers.agent-surface.recipe-parameters
  - spec:consumers.agent-surface.design-recipes
  - spec:consumers.agent-surface.example-space-coverage
  - spec:consumers.engine-provenance
  - spec:consumers.validate-watch
  - spec:model.design-maturity
  - spec:model.planned-architecture
  - spec:model.open-question-fields
  - spec:model.rule-keys
  - spec:model.relation-reasons
  - spec:consumers.review-perspectives
  - spec:consumers.context-bundle
  - spec:consumers.design-diff
  - spec:consumers.intent-composition.proposal
  - spec:consumers.reference-projection
  - spec:consumers.structural-mermaid
  - spec:validation.superseded-decision-signal
  - spec:validation.architecture-constraints
  - spec:validation.corpus-rules
  - spec:observation.run-evidence
modelRefs:
  - spec:model.design-maturity
---
# Design management

The design-management arc, in review order: the Pack page and the reader assembly it renders; entry locations, recipe parameters and shipped recipe files; the recipes used in design work; the engine build identity and the authoring watch loop. The remaining Specs capture promises of the original design across the model, consumers, validation and observation. Pack design shows each member's stated next rung, design columns and code bindings.
