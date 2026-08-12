---
id: spec:carrier.markdown-pack-authoring
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:model.pack-aggregate
  dependsOn:
    - spec:carrier.markdown-parser
    - spec:decisions.carrier-ruling
---
# Packs may gain a Markdown authoring carrier

## Intent
- outcome: Let a Markdown Pack manifest carry the same grouping identity, framing, membership, and model references as the TypeScript form.

### Open questions
- [blocking] What Pack-specific Markdown syntax preserves one canonical surface per Pack without pretending the Spec carrier ruling already chose it?

## Behavior
- rule: A future Markdown Pack carrier must preserve parity with the Pack aggregate and duplicate-ID laws before it can replace the TypeScript default.
