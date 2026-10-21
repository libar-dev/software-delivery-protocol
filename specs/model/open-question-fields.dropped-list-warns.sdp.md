---
id: spec:model.open-question-fields.dropped-list-warns
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.open-question-fields
  verifies: { target: spec:model.open-question-fields, exercises: [droppedListWarning] }
---
# A TypeScript question list that cannot be read drops whole with a warning

## Intent
- outcome: Execute the lossy drop on a blocking question whose text is not static, so the question leaves the graph with only a warning.

```gwt
Given a TypeScript Spec carrier whose blocking open question meets {construct: "a non-static question text"}
When the extractor reifies the carrier
Then the extractor reports {findingId: "extract/non-static-section"} at severity {severity: "warning"}
Then the Spec stays in the graph with {questionCount: 0} open questions
```
