---
id: spec:protocol.significant-units-review
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:protocol.structural-self-binding
    reason: re-measures the accepted set against the significance criterion and the code as it stands
---
# The engine's accepted set covers its significant abstractions and only those

The engine anchors more than two hundred units in fourteen components, and declares far fewer `uses` between them than its imports show. A unit anchored because it exists is noise; a port, a pipeline stage or a shared data shape left bare is a gap a designer stumbles over. The accepted set is the owner-reviewed register of what is significant: every entry earns its place, and every significant abstraction has one.

## Intent

- outcome: Review every engine anchor and every unanchored abstraction against the significance criterion, so the accepted set names the engine's ports, contracts, pipeline stages and shared shapes with their roles and architectural uses, and drops units anchored for coverage.
