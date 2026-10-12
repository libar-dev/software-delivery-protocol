---
id: spec:validation.unbound-example-posture
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:validation.verification-linkage
---
# An unbound example below ready is data, not a warning

## Intent
- problem: A corpus designed before its code exists gets one verifies-linkage warning per example for a state that is honest at the rung the example states, so a real warning hides among them.
- outcome: Keep the unbound state of an example visible as data, and reserve the warning for an example that states `ready`.

## Rule
- An example that declares `verifies` and has no resolving test anchor is named by the verifies-linkage warning only when the example states `ready`.
- Below `ready` the same state is data. The reader reports the example's verifier binding as declared and not enabled, the declared-versus-enabled recipe lists it, and it confers no `has-verifier`.
- A Spec of any other kind that declares `verifies` warns at every rung.
- A `ready` parent other than a `decision` keeps its gap while no resolving verifier verifies it. Once another enabled example or a direct test anchor verifies it, an unbound example below `ready` is data alone, and an unbound `ready` example keeps its own warning.
- The worked example shows its unbound example through its Design Review verifier bindings and the declared-versus-enabled recipe.

## Example space
```gwt-vocabulary
Given the verification posture matrix {matrix:string}
When the reader derives the verification signals
Then the matrix reports {warnings:number} linkage warnings and {gaps:number} parent gaps and {oracleErrors:number} oracle errors
```
