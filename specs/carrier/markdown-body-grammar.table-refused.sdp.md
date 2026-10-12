---
id: spec:carrier.markdown-body-grammar.table-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies:
    target: spec:carrier.markdown-body-grammar
    exercises: [blockShapes]
---
# A table under a section is refused

## Intent
- outcome: Execute the block-structure refusal on a table row under an open section.

```gwt
Given a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "a table row"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "nested or unsupported Markdown structure"} at line {line: 14}
Then the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph
```
