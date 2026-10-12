---
id: spec:extraction.build-pipeline.same-invocation
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.build-pipeline
  verifies:
    target: spec:extraction.build-pipeline
    exercises: [oneSeam]
---
# One query invocation shares its extracted graph and validation result

## Intent
- outcome: Prove the query body receives a reader, raw graph, and validation report produced from the same invocation's extracted graph.

```gwt
Given an extraction root containing the isolated spec {specId: "spec:probe.same-invocation"}
When one query invocation reads the reader, raw graph, and validation report
Then the query exits {exitCode: 0}
Then the reader and the raw graph both return the spec {returnedSpecId: "spec:probe.same-invocation"}
Then the validation report names the same subject {findingSubjectId: "spec:probe.same-invocation"}
```
