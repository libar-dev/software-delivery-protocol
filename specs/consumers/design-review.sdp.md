---
id: spec:consumers.design-review
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
---
# Design Review renders graph context without becoming a gate

## Intent
- outcome: Give a human a regenerable, contextual view for deciding how to state readiness without recording approval as graph truth.

## Behavior
- rule: Design Review renders a Spec or Pack in context with relations, bindings, delivery badges, design questions, and findings from the graph.
- rule: The review is a pure projection that resolves through ordinary source edits, git, and conformance checks; it stores no findings and writes no canonical source.
- rule: A human may use the review context when stating readiness, while validators check only the structural readiness floor and never record or require review approval.
- rule: The MVP view is deterministic generated Markdown with an index and pages for Specs and Packs; richer visual representations remain outside this behavior.
