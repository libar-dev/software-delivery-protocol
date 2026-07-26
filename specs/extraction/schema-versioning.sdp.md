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
- Every graph declares its schemaVersion, and MVP consumers require that field to be present and readable.
- Envelope-stable, section-extensible growth is normally additive; SemVer negotiation and a migration command remain deferred until a consumer needs them.
- The declaring entrypoint is `schemaVersion` in `src/graph/schema.ts`, carried onto every derived payload by `deriveGraph`.

## Example space
```gwt-vocabulary
Given a graph derived from the authored spec {specId:string}
When the graph payload is serialized
Then the payload declares the schema version {schemaVersion:string}
```
