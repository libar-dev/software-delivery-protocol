---
id: spec:carrier.markdown-body-grammar.integer-term-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies:
    target: spec:carrier.markdown-body-grammar
    exercises: [modelEntries]
---
# An integer-like Model term is refused

## Intent
- outcome: Execute the integer-like term refusal on a Model term written as a bare digit, and keep the healthy sibling carrier as the only Spec in the graph.

```gwt
Given a Markdown Spec carrier whose {owner: "Model"} section holds {construct: "an integer-like term"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "model terms must not be integer-like"} at line {line: 14}
Then the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph
```
