---
id: spec:carrier.markdown-body-grammar.raw-html-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# Raw HTML outside a code span is refused

## Intent
- outcome: Execute the raw-HTML refusal on a line break tag written in a rule.

```gwt
Given a Markdown Spec carrier whose {owner: "Behavior"} section holds {construct: "a line break tag"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "raw HTML is unsupported"} at line {line: 14}
```
