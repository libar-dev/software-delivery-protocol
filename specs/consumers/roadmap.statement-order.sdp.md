---
id: spec:consumers.roadmap.statement-order
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.roadmap
  verifies:
    target: spec:consumers.roadmap
    exercises: [waiting, earlier]
---
# Waiting statements keep dependency order against roadmap places

## Intent
- outcome: Execute one roadmap reading over a probe corpus.
- assumption: The world writes two defined behavior Specs with complete evidence and resolving relations. The first roadmap entry depends on the second; both floors reach ready. The roadmap reads the shipped body over the extracted probe corpus.

```gwt
Given a probe roadmap whose entry holds the work {work: "spec:probe.dependent"}
Given that work {state: "has one part below ready whose floor reaches ready"}
Given a probe roadmap whose first entry rests on a Spec of its second entry, both waiting for a statement
When the roadmap recipe reads the probe roadmap
Then the waiting statements list {earlier: "spec:probe.base"} before {later: "spec:probe.dependent"}
```
