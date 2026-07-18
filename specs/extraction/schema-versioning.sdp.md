---
id: spec:extraction.schema-versioning
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:extraction.derive-graph
---
# The graph declares its schema version

## Intent
- outcome: Let consumers identify the graph payload contract without premature migration machinery.

## Rule
- Every graph declares its schemaVersion, and MVP consumers require that field to be present and readable.
- Envelope-stable, section-extensible growth is normally additive; SemVer negotiation and a migration command remain deferred until a consumer needs them.
