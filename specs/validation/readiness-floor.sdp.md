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
- Floors are cumulative: a stated rung is checked against its own clauses and every lower rung's, so a Spec that clears a higher rung has cleared each one beneath it.
- The `idea` floor reads the envelope through five clauses: the Spec carries a stable id, a human-readable title, a stated kind, and a stated altitude, and it either states its intended outcome or declares a parent relation through `refines`.
- The `scoped` floor adds three clauses: the intended outcome is stated, at least one authored relation is declared, and the kind's natural evidence is present.
- The `defined` floor adds two clauses: the kind's natural evidence is complete, and no open question the Spec records is flagged as blocking.
- The `ready` floor reads the Spec's own edges through three clauses: every authored relation resolves to a known target, every `refines` and `dependsOn` target itself stands at least `defined`, and every anchor bound to the Spec resolves.
- Readiness is independent across a refinement relation: a child may be authored at a higher readiness than its parent. Only the child's own cumulative floor applies, including the `ready` target bound above when the child states `ready`.
- The anchor clause reads the bindings that are present, so a Spec carrying no anchor clears it — the floor never demands a binding an author has not made.
- Only relations the Spec itself declares count toward the relation clauses; membership of a Pack is derived from the manifest and never stands in for an authored relation.
- Every clause stated here is kind-blind. The two evidence clauses are the one kind-conditional place in the floor, and what counts as a kind's natural evidence is stated in full by the refining Spec that carries the per-kind evidence table.
- One clause table serves both readings: it checks the readiness an author states, and it yields derived readiness — the highest rung whose cumulative clauses all pass — which is read beside the stated rung and never overwrites it.
- The floor is the mechanism while the specific clause thresholds are one chosen representation, so a team-overridable floor configuration is a designed-for deferral rather than a landed capability: no validator reads a per-team floor setting, and the shipped clause table is the only floor any Spec is checked against.
- The floor table in `src/validate/readiness-floor.ts` is the clause set's code-level source of truth and the realizing entrypoint. The clauses stated here and the rows of that table are one law read twice, so any disagreement between them is drift to resolve on one side, never a second floor.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} stating readiness {readiness:"scoped"|"defined"}
Given the spec {defect:"declares no relation"|"records a blocking open question"}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the finding names the unmet floor clause {clauseId:string}
Then the report holds {errorCount:number} errors
```
