---
id: spec:consumers.roadmap.missing-evidence
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.roadmap
  verifies:
    target: spec:consumers.roadmap
    exercises: [entryNeed, entryShows, workRows]
---
# A descendant without evidence names its holding clause

## Intent
- outcome: Execute one roadmap reading over a probe corpus.
- assumption: The world writes a roadmap Pack with one ready behavior root and one behavior descendant, each with an Intent outcome. The root has one rule and a direct implementation binding; both Specs have resolving relations. The descendant states scoped, refines the ready root and has no behavior evidence. The roadmap reads the shipped body over the extracted probe corpus.

```gwt
Given a probe roadmap whose entry holds the work {work: "spec:probe.root, spec:probe.part"}
Given that work {state: "has a ready root and one descendant without its kind's evidence"}
When the roadmap recipe reads the probe roadmap
Then the entry names {part: "spec:probe.part"} among the parts with its need, held by {clause: "kind-evidence-present"}
```
