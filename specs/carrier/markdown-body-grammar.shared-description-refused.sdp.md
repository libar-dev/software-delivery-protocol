---
id: spec:carrier.markdown-body-grammar.shared-description-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# A second description across Behavior and Example space is refused

## Intent
- outcome: Execute the shared-owner rule when both the primary behavior heading and Example space carry leading prose.

```gwt
Given a Markdown Spec carrier whose {owner: "Example space"} section holds {construct: "a description when Behavior already has one"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "behavior description has more than one owner"} at line {line: 19}
```
