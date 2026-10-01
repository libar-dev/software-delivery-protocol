---
id: spec:carrier.markdown-body-grammar.second-primary-owner-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# A second primary owner is refused

## Intent
- outcome: Execute the one-primary-owner rule on a Rule section that follows a Behavior section.

```gwt
Given a Markdown Spec carrier whose {owner: "Rule"} section holds {construct: "a plain bullet after a Behavior section"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "a single-valued Markdown owner is authored more than once"} at line {line: 16}
```
