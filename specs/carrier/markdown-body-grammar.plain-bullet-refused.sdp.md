---
id: spec:carrier.markdown-body-grammar.plain-bullet-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# A plain bullet under an open section is refused

## Intent
- outcome: Execute the keyed-entry rule of open sections on a bullet with no lower-camel key.

```gwt
Given a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "a plain bullet"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "open section keys must be lower-camel ASCII"} at line {line: 14}
```
