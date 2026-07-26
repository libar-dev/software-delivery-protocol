---
id: spec:extraction.example-runner.red-step-naming
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.example-runner
  verifies: spec:extraction.example-runner
---
# A red step names itself before the assertion detail

## Intent
- outcome: Execute the failure law where a bound handler throws inside the when step.

```gwt
Given a contract whose given step repeats {occurrences: 2} times before one when step and one then step
Given the handler bound to the {failingPhase: "when"} step throws {thrown: "boom"}
When the bound plan runs against a fresh world
Then the run {outcome: "fails"}
Then the failure names the step in the Spec's own words as {failureLabel: "at step: When the cart is submitted"}
Then the failure preserves the original detail {detail: "boom"}
```
