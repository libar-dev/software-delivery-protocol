---
id: spec:model.open-question-keys.keyed-question-resolves
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.open-question-keys
  verifies: spec:model.open-question-keys
---
# A keyed question is reified and its address resolves

## Intent
- outcome: Execute the key grammar and the question address on one keyed question beside an unkeyed one.
- assumption: The world writes two Markdown carriers in one extraction root. The first is a story-altitude rule Spec stating `scoped` with an Intent outcome, one rule, and one declared `refines` on the second; its Open questions hold the entries written in `questions`, one line each, where the slot joins them with a semicolon and a space. The second states `idea`, names the address in its narrative, and declares `dependsOn` on the first. No finding is named as an empty string, and keys are joined by a comma and a space.

```gwt
Given a Markdown Spec carrier {specId: "spec:probe.subject"} whose open questions read {questions: "- [blocking #aggregateReach] Does the owner widen the aggregate?; - [non-blocking] Is the name final?"}
Given a second Spec that names {address: "spec:probe.subject#question.aggregateReach"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: true}
Then the extraction findings name {extractMessage: ""}
Then the graph holds the question keys {keys: "aggregateReach"}
Then the report holds {mentionErrors: 0} prose-mention errors
```
