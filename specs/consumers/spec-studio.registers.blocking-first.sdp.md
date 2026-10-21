---
id: spec:consumers.spec-studio.registers.blocking-first
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.registers
  verifies:
    target: spec:consumers.spec-studio.registers
    exercises: [registerPages, questionsPage]
---
# The questions page lists the Specs with a blocking question first

## Intent
- outcome: Execute the questions page's order: a Spec with a blocking question comes before one with only non-blocking questions, whatever their id order.
- assumption: The world writes a root with the two Specs, the first holding one blocking open question and the second one non-blocking open question, builds the page set, and reads the order of the Specs on the questions page.

```gwt
Given a Spec {blockingSpec: "spec:probe.zeta"} with a blocking open question and a Spec {otherSpec: "spec:probe.alpha"}, before it in id order, with only a non-blocking one
When the build renders the questions page
Then the page lists {first: "spec:probe.zeta"} first
```
