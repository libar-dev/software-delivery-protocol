---
id: spec:carrier.markdown-body-grammar.foreign-fence-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies: spec:carrier.markdown-body-grammar
---
# A fence other than gwt is refused

## Intent
- outcome: Execute the closed fence set on a language-tagged code fence under an open section.

```gwt
Given a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "a ts fence"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "fences must be exact gwt or gwt-vocabulary fences"} at line {line: 14}
```
