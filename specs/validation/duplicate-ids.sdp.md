---
id: spec:validation.duplicate-ids
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  dependsOn: spec:carrier.markdown-parser
---
# Duplicate carrier IDs are excluded loudly

## Intent
- outcome: Prevent ambiguous authored identity from entering the graph.

## Behavior
- rule: If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.
