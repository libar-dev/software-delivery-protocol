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

## Workflow
- Discover carriers.
- Reify carriers.
- Derive the graph.
- Validate the graph.
- Emit derived artifacts.
- rule: Every command uses the same extracted graph and validation seam.
