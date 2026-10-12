---
id: spec:consumers.impact-graph.symbol-reach
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.impact-graph
  decidedBy:
    target: spec:decisions.planning-truths-placement
    reason: that decision homes a deferral as a blocking open question on its own Spec, as symbol identity is here
---
# Exhaustive symbol reach waits for a language-neutral identity

## Intent
- outcome: Answer find-all-usages and symbol-level impact exhaustively once a symbol identity exists that no single compiler owns.

### Open questions
- [blocking #symbolIdentity] Which language-neutral identity and extraction boundary can support exhaustive symbol reach without freezing a single compiler's representation into the Protocol?
  - decider: owner
  - trigger: a reader needs symbol-level reach that file-level imports and curated anchors cannot give

## Behavior
- rule: Symbol reach is inferred structure, kept apart from the curated graph under `spec:consumers.impact-graph#rule.inferredApart`, and a symbol is never an anchor id or a relation target.
