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
- outcome: Turn authored carriers into one graph and the artifacts derived from it, with every command that checks reading that same graph.

## Workflow
- The build discovers carriers, reifies them, derives the graph, stops on any extraction error, and emits the graph, the executable contracts and the registrars without running the graph checks.
- Validation runs the build, then checks the graph that build derived and reports every finding, exiting nonzero on an error.
- Each projection verb runs validation, then renders its root from that same graph and publishes it whatever the findings, keeping validation's exit code.
- A query discovers, reifies and derives in process, stops on any extraction error, checks the graph, and hands the body the reader, the raw graph and the report from that one derivation, writing nothing.
- rule: [#oneSeam] Every command that checks the graph checks the graph its own run derived, through the one validation seam; `sdp build` stops at extraction checks.
- rule: [#emitOnClean] `sdp build` publishes derived outputs only after extraction reports no error. A warning does not fail the build; a contract-generation warning may withhold the contract or registrar it names under the executable-contracts law.
- rule: [#stagedPublication] Before replacing current outputs, `sdp build` stages the graph, the owed contracts, the registrar manifest, each registrar sibling whose bytes differ from the file on disk, and the imports when `--imports` is supplied, in temporary locations; a sibling whose bytes are unchanged is left untouched, with no temporary write and no rename. It then publishes the staged set and removes registrar siblings no longer owed.
- rule: [#failedPublication] On failure, `sdp build` removes its graph, contracts, manifest, temporary outputs and the confined registrar siblings known from the previous and new manifests. It removes imports only when that invocation requested them. A failed removal names the surviving path and says it must not be read as current; an untrusted registrar path is outside generated ownership.

## Example space
```gwt-vocabulary
Given an extraction root containing the isolated spec {specId:string}
When one query invocation reads the reader, raw graph, and validation report
Then the query exits {exitCode:number}
Then the reader and the raw graph both return the spec {returnedSpecId:string}
Then the validation report names the same subject {findingSubjectId:string}
```
