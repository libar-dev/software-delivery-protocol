---
id: spec:protocol.self-hosting
kind: behavior
altitude: epic
readiness: ready
relations:
  dependsOn:
    - target: spec:carrier.markdown-authoring
      reason: the self-hosted corpus uses the Markdown carrier
    - target: spec:model.core-model
      reason: the self-hosted corpus is authored as Specs on the Protocol's core model
  decidedBy:
    - spec:decisions.concept-docs-dissolve
    - spec:decisions.executable-meta-model
    - spec:decisions.adopt-the-nouns
    - spec:decisions.protocol-naming
    - spec:decisions.plain-language-references
    - spec:decisions.one-validation-path
---
# The Protocol authors and validates itself

The Protocol's own delivery model exercises the same carrier, graph, checks, and projections offered to consumers.

## Intent
- outcome: Show that the Protocol carries its own intended truth through the extraction, validators and projections it offers adopters.

## Behavior
- rule: All authored carriers derive one regenerable graph through one validation path.
- rule: Self-hosting remains deterministic in a clean clone.
