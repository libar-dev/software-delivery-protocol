---
id: spec:consumers.spec-studio.owner-queue.dependency-first
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.owner-queue
  verifies:
    target: spec:consumers.spec-studio.owner-queue
    exercises: [waitingStatements]
---
# The owner queue lists a waiting statement after the one it rests on

## Intent
- outcome: Execute the queue's order: a waiting statement that rests on another waiting statement comes after it, whatever their id order, and links it.
- assumption: The world writes a root where both Specs state `scoped` while their floors allow a higher rung, and the first declares `dependsOn` on the second; it builds the page set and reads the queue's statement rows in order.

```gwt
Given a Spec {dependent: "spec:probe.alpha"} that waits for a statement its floor allows and rests on a Spec {dependency: "spec:probe.zeta"} that waits for one too
When the build renders the owner queue page
Then the queue lists {first: "spec:probe.zeta"} first
Then the row of the Spec that rests on the other links it: {linked: true}
```
