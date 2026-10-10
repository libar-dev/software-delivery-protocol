---
id: spec:model.open-question-keys.renamed-key-breaks
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.open-question-keys
  verifies: spec:model.open-question-keys
---
# A renamed question key fails the mention that addresses it

## Intent
- outcome: Execute the missing-entry error on an address whose question key the target no longer carries.
- assumption: The world is the one of the keyed-question example, with the key renamed in the first carrier and the address in the second left as it was.

```gwt
Given a Markdown Spec carrier {specId: "spec:probe.subject"} whose open questions read {questions: "- [blocking #aggregateScope] Does the owner widen the aggregate?"}
Given a second Spec that names {address: "spec:probe.subject#question.aggregateReach"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: true}
Then the extraction findings name {extractMessage: ""}
Then the graph holds the question keys {keys: "aggregateScope"}
Then the report holds {mentionErrors: 1} prose-mention errors
```
