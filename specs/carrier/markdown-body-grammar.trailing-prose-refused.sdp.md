---
id: spec:carrier.markdown-body-grammar.trailing-prose-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies:
    target: spec:carrier.markdown-body-grammar
    exercises: [sectionProse]
---
# Prose after structured content is refused

## Intent
- outcome: Execute the prose-ownership rule on a paragraph that follows a section's first list entry.

```gwt
Given a Markdown Spec carrier whose {owner: "Behavior"} section holds {construct: "a paragraph after the first bullet"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/unowned-prose"} whose message contains {reason: "prose after structured content has no owner"} at line {line: 16}
Then the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph
```
