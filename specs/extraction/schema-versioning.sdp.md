---
id: spec:extraction.schema-versioning
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:extraction.derive-graph
---
# The graph declares its schema version

## Intent
- outcome: Let consumers identify the graph payload contract without premature migration machinery.

## Rule
- [#declaredVersion] Every derived graph carries `schemaVersion`, which identifies its payload contract for consumers.
- Additive payload fields, including optional fields, increment the schema minor version; incompatible shape or meaning changes increment the major version, while patch changes preserve the payload contract.

## Example space
```gwt-vocabulary
Given a graph derived from the authored spec {specId:string}
When the graph payload is serialized
Then the payload declares the schema version {schemaVersion:string}
```
