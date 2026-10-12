---
id: spec:carrier.markdown-body-grammar.unrecognized-heading-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-body-grammar
  verifies:
    target: spec:carrier.markdown-body-grammar
    exercises: [closedOwners]
---
# An unrecognized heading is refused with a suggestion

## Intent
- outcome: Execute the closed owner set on a misspelled heading and read the nearest known name back.

```gwt
Given a Markdown Spec carrier whose {owner: "Behaviour"} section holds {construct: "a rule bullet"}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId: "extract/unrecognized-heading"} whose message contains {reason: "did you mean"} at line {line: 13}
Then the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph
```
