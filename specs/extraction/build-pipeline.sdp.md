---
id: spec:extraction.build-pipeline
kind: workflow
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  dependsOn: spec:extraction.derive-graph
---
# The build pipeline has one ordered flow

## Intent
- outcome: Turn authored carriers into validated derived artifacts.

### Open questions
- [non-blocking] Does the derive-in-process freshness law stated in src/cli/q-command.ts commentary promote here or to a story-altitude child under comment promotion?

## Workflow
- Discover carriers.
- Reify carriers.
- Derive the graph.
- Validate the graph.
- Emit derived artifacts.
- rule: Every command uses the same extracted graph and validation seam.

## Example space
```gwt-vocabulary
Given an extraction root containing the isolated spec {specId:string}
When one query invocation reads the reader, raw graph, and validation report
Then the query exits {exitCode:number}
Then both graph entrances return the spec {returnedSpecId:string}
Then the validation report names the same subject {findingSubjectId:string}
```
