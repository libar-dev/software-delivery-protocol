---
id: spec:carrier.markdown-body-grammar.repeated-field-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# A repeated single-valued field is refused

## Intent
- outcome: Execute the at-most-once rule on a second statement under Constraints.

```gwt
Given a Markdown Spec carrier whose {owner: "Constraints"} section holds {construct: "a second statement field"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "is authored more than once"} at line {line: 15}
```
