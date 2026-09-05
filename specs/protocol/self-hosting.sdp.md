---
id: spec:protocol.self-hosting
kind: behavior
altitude: epic
readiness: defined
relations:
  dependsOn:
    - spec:carrier.markdown-authoring
    - spec:model.protocol-domain
  decidedBy:
    - spec:decisions.concept-docs-dissolve
    - spec:decisions.executable-meta-model
    - spec:decisions.adopt-the-nouns
    - spec:decisions.protocol-naming
    - spec:decisions.plain-language-references
---
# The Protocol authors and validates itself

The Protocol's own delivery model exercises the same carrier, graph, checks, and projections offered to consumers.

## Intent
- outcome: Prove the Protocol can carry its own intended truth honestly.

## Behavior
- rule: All authored carriers derive one regenerable graph through one validation path.
- rule: Self-hosting remains deterministic in a clean clone.
