---
id: spec:consumers.reader.concept-entry
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.reader
  verifies: spec:consumers.reader
---
# A concept recorded only inside a Spec's sections is still reached, and the field is named

## Intent
- outcome: Execute the string entry against the case a title-and-id lookup would miss, and read back the field the match was recorded in.

```gwt
Given a reader built over the graph a real extraction derives from the probe root
Given the concept {concept: "backorder"} appears in the corpus only inside the recorded context of {conceptSpecId: "spec:orders.order-management"}
When the reader answers the {entry: "concept"} entry
Then the reader names {matchedId: "spec:orders.order-management"} as a match on the field {matchedField: "sections.behavior"}
Then the reader names {matchCount: 1} matches in all
```
