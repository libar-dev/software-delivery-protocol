---
id: spec:carrier.markdown-body-grammar.h3-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies:
    target: spec:carrier.markdown-body-grammar
    exercises: [singleH3]
---
# An H3 under Design is refused

## Intent
- outcome: Execute the single-H3 rule on a third-level heading under an open section.

```gwt
Given a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "an H3 heading"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "open sections do not accept an H3 or fence"} at line {line: 14}
Then the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph
```
