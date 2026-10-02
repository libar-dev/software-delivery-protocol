---
id: spec:validation.unbound-example-posture
kind: rule
altitude: story
readiness: defined
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
- A Spec of any other kind that declares `verifies` keeps its warning at every rung, and the oracle-linkage check is unchanged.
- The gap signal still names a `ready` Spec with no enabled verifier, except kind `decision`. A ready parent of any other kind keeps its gap while no enabled verifier verifies it. Once another enabled example or a direct test anchor verifies the parent, an unbound example below `ready` is visible as data alone. An unbound `ready` example keeps its own verifies-linkage warning even when the parent has another verifier.
- The worked example teaches the incomplete trace through the verifier bindings its Design Review page renders and through the declared-versus-enabled recipe, not through a warning. Its walkthrough and example check move with this rule.
- This rule revises the sentence of `spec:validation.verification-linkage` that names every non-resolving trace loudly. The realizing entrypoint stays `checkVerifiesLinkage` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given the verification posture matrix {matrix:string}
When the reader derives the verification signals
Then the matrix reports {warnings:number} linkage warnings and {gaps:number} parent gaps and {oracleErrors:number} oracle errors
```
