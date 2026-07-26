---
id: spec:validation.readiness-floor
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  dependsOn: spec:model.protocol-domain
  decidedBy:
    - spec:decisions.kind-conditional-floor
    - spec:decisions.carried-evidence
---
# Stated readiness must clear its floor

## Intent
- outcome: Refuse maturity claims that their authored evidence does not support.

## Rule
- A Spec may state a readiness only when every clause in that readiness floor passes.
- The `ready` floor reads the Spec's own edges through three clauses: every authored relation resolves to a known target, every `refines` and `dependsOn` target itself stands at least `defined`, and every anchor bound to the Spec resolves.
- The anchor clause reads the bindings that are present, so a Spec carrying no anchor clears it — the floor never demands a binding an author has not made.
- The floor table in `src/validate/readiness-floor.ts` is the clause set's code-level source of truth and the realizing entrypoint; the clauses of the lower rungs are stated there and are not re-enumerated here.
