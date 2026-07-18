---
id: spec:extraction.build-pipeline
kind: workflow
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  dependsOn: spec:extraction.derive-graph
---
# The build pipeline has one ordered flow

## Intent
- outcome: Turn authored carriers into validated derived artifacts.

## Behavior
- flow: Discover carriers.
- flow: Reify carriers.
- flow: Derive the graph.
- flow: Validate the graph.
- flow: Emit derived artifacts.
- rule: Every command uses the same extracted graph and validation seam.
