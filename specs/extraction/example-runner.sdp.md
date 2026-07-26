---
id: spec:extraction.example-runner
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.executable-contracts
---
# A bound example runs its contract steps against a fresh world

## Intent
- problem: A bound test must execute a Spec's own steps without the executing core learning any test framework.
- outcome: Run a generated contract's steps in authored order and make a red step name itself in the Spec's own words.
- value: A failing example reads as the Spec that failed rather than as an anonymous assertion.

## Behavior
- rule: The core plans every contract step in authored order and runs it against the world the caller hands in; creating a fresh world per example is the adapter's lifecycle, never the core's.
- rule: Duplicate step text within one example binds one handler, and every occurrence runs that one handler with its own authored params.
- rule: A red step names itself before the assertion detail: the failure message leads with the step's natural reading — the Spec's own words with bound values inlined — and the original error is preserved, carried as `cause` when it cannot be re-messaged, and wrapped when the thrown value is not an error.
- rule: A missing or stale step handler is a compile-time refusal rather than a silent skip: the bindings type covers every step and only the steps, so spec-side drift fails the typecheck instead of the run.
- rule: The core contributes `unspecified`, the one outcome no Spec ever states, so an uncovered region of an example space has an honest answer rather than a manufactured one.
- rule: The realizing entrypoints are `planExample` and `runExamplePlan` in `src/runner/index.ts`.

## Example space
```gwt-vocabulary
Given a contract whose given step repeats {occurrences:number} times before one when step and one then step
Given the handler bound to the {failingPhase:"given"|"when"|"then"} step throws {thrown:string}
When the bound plan runs against a fresh world
Then the world records the handler trace {trace:string}
Then the run {outcome:"completes"|"fails"}
Then the failure names the step in the Spec's own words as {failureLabel:string}
Then the failure preserves the original detail {detail:string}
```
