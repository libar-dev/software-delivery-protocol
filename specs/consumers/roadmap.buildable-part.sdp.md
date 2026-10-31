---
id: spec:consumers.roadmap.buildable-part
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.roadmap
  verifies:
    target: spec:consumers.roadmap
    exercises: [scope, specNeed, entryNeed, workRows]
---
# A ready unbound part needs building

## Intent
- outcome: Execute one roadmap reading over a probe corpus.
- assumption: The world writes a roadmap Pack with one ready behavior root and one behavior descendant, each with an Intent outcome. The root has one rule and a direct implementation binding; both Specs have resolving relations. The root has a binding and its ready descendant has none. The roadmap reads the shipped body over the extracted probe corpus.

```gwt
Given a probe roadmap whose entry holds the work {work: "spec:probe.root, spec:probe.part"}
Given that work {state: "has one part ready and not implemented"}
When the roadmap recipe reads the probe roadmap
Then the entry's need reads {need: "to build"}
```
