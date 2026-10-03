---
id: spec:carrier.markdown-body-grammar.integer-term-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# An integer-like Model term is refused

## Intent
- outcome: Execute the integer-like term refusal on a Model term written as a bare digit, and keep the healthy sibling carrier as the only Spec in the graph.
- assumption: The world writes two Markdown carriers in one extraction root, the refused carrier and a healthy sibling. The sibling is a story-altitude behavior Spec stating `idea`, with no relations and an Intent outcome.

```gwt
Given a Markdown Spec carrier whose {owner: "Model"} section holds {construct: "an integer-like term"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "model terms must not be integer-like"} at line {line: 14}
```
