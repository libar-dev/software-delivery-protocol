---
id: spec:validation.readiness-floor
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  dependsOn:
    target: spec:model.core-model
    reason: the floor reads the Protocol descriptor model
  decidedBy:
    - spec:decisions.kind-conditional-floor
    - spec:decisions.carried-evidence
---
# Stated readiness must clear its floor

## Intent
- outcome: Refuse a stated readiness that its authored evidence does not support.

## Rule
- A Spec may state a readiness only when every clause in that readiness floor passes.
- Floors are cumulative: a stated rung is checked against its own clauses and every lower rung's, so a Spec that clears a higher rung has cleared each one beneath it.
- [#ideaFloor] The `idea` floor has five clauses: the Spec carries a stable id, a human-readable title, a stated kind and a stated altitude, and it either states its intended outcome or declares a parent relation through `refines`.
- [#scopedFloor] The `scoped` floor adds three clauses: the intended outcome is stated, at least one authored relation is declared, and the kind's natural evidence is present.
- [#definedFloor] The `defined` floor adds two clauses: the kind's natural evidence is complete, and no open question the Spec records is flagged as blocking.
- [#readyFloor] The `ready` floor reads the Spec's own edges through three clauses: every authored relation resolves to a known target, every resolving `refines`, `dependsOn`, `constrainedBy`, and `decidedBy` target itself states at least `defined`, and every anchor bound to the Spec resolves.
- A child's readiness statement is its own and may be higher than its parent's. Below `ready`, the child's floor does not read the parent's rung; at `ready`, its typed-dependency clause requires a resolving `refines` parent to state at least `defined`.
- The anchor clause reads the bindings that are present, so a Spec carrying no anchor clears it — the floor never demands a binding an author has not made.
- Only relations the Spec itself declares count toward the relation clauses; membership of a Pack is derived from the manifest and never stands in for an authored relation.
- Every clause except the two evidence clauses is kind-blind; what counts as a kind's natural evidence is stated in full by `spec:validation.kind-evidence`.
- One clause table checks the stated rung and yields derived readiness, the highest rung whose cumulative clauses all pass, which is read beside the stated rung and never overwrites it. Asked about a named rung, the evaluator yields that rung's unmet clauses; the reader uses it for the stated next rung and the floor's next rung.
- Given a Primitive node and a valid graph index over plain value data, evidence predicates tolerate section containers of the wrong shape and treat missing expected containers as absent evidence. An unratified kind derives no rung; an evaluation with an unratified kind or rung returns no failures, and descriptor conformance reports the invalid descriptor.
- The shipped clause table is the only floor any Spec is checked against; no validator reads a per-team floor setting.
- [#floorTable] The floor table in `src/validate/readiness-floor.ts` is the clause set's code-level source of truth and the realizing entrypoint. The clauses stated here and the rows of that table are one law read twice, so any disagreement between them is drift to resolve on one side, never a second floor.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} stating readiness {readiness:"scoped"|"defined"}
Given the spec {defect:"declares no relation"|"records a blocking open question"}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the finding names the unmet floor clause {clauseId:string}
Then the report holds {errorCount:number} errors
```
