---
id: spec:observation.runtime-overlay
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:protocol.self-hosting
  dependsOn: spec:model.core-model
---
# Runtime observations can close the liveness loop

## Intent
- outcome: Associate runtime evidence with measurable Spec targets without turning operational payloads into authored model truth.

### Open questions
- [blocking] Which external observation identity and freshness boundary is small enough for the graph while still supporting an honest `observed` delivery fact?
