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

This Pack groups the contracts used to iterate on a design through the graph, in review order. Its members cover concise recipe answers; rule keys, question fields and relation reasons; comparison between design passes; context bundles, perspectives and change proposals. The final members cover when implemented design detail may leave a Spec and how file-level imports inform anchor curation, drawing on lessons from the Protocol's predecessor, `@libar-dev/architect`.
