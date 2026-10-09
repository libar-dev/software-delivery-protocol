---
id: spec:extraction.pack-member-order.manifest-order-kept
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:extraction.pack-member-order
  verifies: spec:extraction.pack-member-order
---
# A manifest's member order survives into the graph and the reader

## Intent
- outcome: Execute the member order rule on a manifest whose authored order is not id order.
- assumption: The world writes one Markdown Pack manifest and three member Specs in one extraction root. Each member is a story-altitude behavior Spec stating `idea` with an Intent outcome and no relations. Lists are written as ids joined by a comma and a space.

```gwt
Given a Markdown Pack manifest whose specs list reads {manifestOrder: "spec:probe.zeta, spec:probe.alpha, spec:probe.mid"}
When the graph is derived and serialized
Then the serialized Pack node lists the members {serializedMembers: "spec:probe.zeta, spec:probe.alpha, spec:probe.mid"}
Then the serialized belongsTo edges run from {edgeSources: "spec:probe.alpha, spec:probe.mid, spec:probe.zeta"}
Then the reader's Pack context lists the members {readerMembers: "spec:probe.zeta, spec:probe.alpha, spec:probe.mid"}
Then the payload declares the schema version {schemaVersion: "0.8.0"}
```
