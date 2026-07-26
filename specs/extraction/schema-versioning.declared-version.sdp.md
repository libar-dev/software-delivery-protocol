---
id: spec:extraction.schema-versioning.declared-version
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.schema-versioning
  verifies: spec:extraction.schema-versioning
---
# A derived payload carries a schema version its consumer can read

## Intent
- outcome: Execute the declared-version rule over a serialized graph payload.

```gwt
Given a graph derived from the authored spec {specId: "spec:probe.schema-versioning"}
When the graph payload is serialized
Then the payload declares the schema version {schemaVersion: "0.4.0"}
```
