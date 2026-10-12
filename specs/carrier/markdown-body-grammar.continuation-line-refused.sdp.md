---
id: spec:carrier.markdown-body-grammar.continuation-line-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies:
    target: spec:carrier.markdown-body-grammar
    exercises: [oneLineEntries]
---
# A bullet wrapped onto a second line is refused

## Intent
- outcome: Execute the one-line entry rule on a bullet whose text continues on an indented line.

```gwt
Given a Markdown Spec carrier whose {owner: "Behavior"} section holds {construct: "a bullet wrapped onto an indented second line"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "nested or unsupported Markdown structure"} at line {line: 15}
Then the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph
```
