---
id: spec:consumers.roadmap.outside-parent
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.roadmap
  verifies:
    target: spec:consumers.roadmap
    exercises: [scope, restsOn, workRows]
---
# A descendant names its outside parent

## Intent
- outcome: Execute one roadmap reading over a probe corpus.
- assumption: The world writes a roadmap Pack with one ready behavior root and one behavior descendant, each with an Intent outcome. The root has one rule and a direct implementation binding; both Specs have resolving relations. The defined descendant refines both the ready root and an outside scoped Spec. The roadmap reads the shipped body over the extracted probe corpus.

```gwt
Given a probe roadmap whose entry holds the work {work: "spec:probe.root, spec:probe.part"}
Given that work {state: "has one descendant that also refines a Spec outside the roadmap"}
When the roadmap recipe reads the probe roadmap
Then the entry rests on {target: "spec:probe.outside"} through {origin: "spec:probe.part"}
```
