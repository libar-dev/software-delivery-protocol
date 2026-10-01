---
id: spec:carrier.markdown-body-grammar.keyed-bullet-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# A keyed bullet under a plain-bullet owner is refused

## Intent
- outcome: Execute the keyed-bullet rule on a Rule entry that opens with one word and a colon.

```gwt
Given a Markdown Spec carrier whose {owner: "Rule"} section holds {construct: "a bullet opening with one word and a colon"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/unrecognized-property"} whose message contains {reason: "is not accepted"}
```
