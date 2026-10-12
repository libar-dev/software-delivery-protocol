---
id: pack:design-iteration-v1
specs:
  - spec:consumers.agent-surface.answer-shapes
  - spec:model.rule-keys
  - spec:model.open-question-fields
  - spec:model.relation-reasons
  - spec:consumers.design-diff
  - spec:consumers.context-bundle
  - spec:consumers.review-perspectives
  - spec:consumers.intent-composition.proposal
  - spec:model.enrichment-lifecycle
  - spec:consumers.impact-graph.curation-assist
  - spec:consumers.impact-graph
---
# Design iteration

The arc that lets a design be iterated pass after pass on a graph an agent reads in one call, in the order a reviewer reads it. First the recipe answers a usability trial of the agent surface asked for. Then the authoring grammar that gives rules, question fields and relation reasons a place in the graph, which the iteration loop reads: what changed since the last pass, the brief for the next one, a perspective to read it from, and a proposal to hand back. Then when design detail may leave an implemented Spec, and the file-level imports that show where curation is missing, the two structural lessons a review of gen 1 brought.
