---
id: spec:extraction.example-runner.step-order
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.example-runner
  verifies: spec:extraction.example-runner
---
# A repeated step runs its one handler at each occurrence, in contract order

## Intent
- outcome: Execute the contract-order and one-handler-per-step laws over a repeating given step.

```gwt
Given a contract whose given step repeats {occurrences: 2} times before one when step and one then step
When the bound plan runs against a fresh world
Then the world records the handler trace {trace: "given 2 | given 2 | when | then"}
Then the run {outcome: "completes"}
```
