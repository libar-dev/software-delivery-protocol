---
id: spec:carrier.markdown-body-grammar.ordered-list-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies:
    target: spec:carrier.markdown-body-grammar
    exercises: [oneLineEntries]
---
# An ordered list is refused

## Intent
- outcome: Execute the list-entry rule on an ordered list item under a primary owner.

```gwt
Given a Markdown Spec carrier whose {owner: "Contract"} section holds {construct: "an ordered list item"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "nested or unsupported Markdown structure"} at line {line: 14}
Then the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph
```
