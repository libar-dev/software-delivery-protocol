---
id: spec:model.open-question-keys.repeated-key-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.open-question-keys
  verifies: spec:model.open-question-keys
---
# A repeated question key refuses its carrier

## Intent
- outcome: Execute the uniqueness refusal, and show that the address then names a missing Spec.
- assumption: The world is the one of the keyed-question example, with two questions in the first carrier that carry the same key. The first carrier is refused whole, so the graph holds no question key and the address's Spec is absent.

```gwt
Given a Markdown Spec carrier {specId: "spec:probe.subject"} whose open questions read {questions: "- [blocking #aggregateReach] Does the owner widen the aggregate?; - [non-blocking #aggregateReach] Does the aggregate keep its name?"}
Given a second Spec that names {address: "spec:probe.subject#question.aggregateReach"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: false}
Then the extraction findings name {extractMessage: "open question keys must be unique"}
Then the graph holds the question keys {keys: ""}
Then the report holds {mentionErrors: 1} prose-mention errors
```
