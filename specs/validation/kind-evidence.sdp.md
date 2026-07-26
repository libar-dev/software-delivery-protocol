---
id: spec:validation.kind-evidence
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:validation.readiness-floor
  decidedBy: spec:decisions.kind-conditional-floor
---
# Each kind carries its own evidence

## Intent
- outcome: State what a Spec of each kind must show before its readiness floor accepts the evidence clauses.

## Rule
- Each kind names its natural evidence: the `scoped` rung requires that evidence present, and the `defined` rung requires it complete wherever the kind defines a stronger form. This table is the whole kind-aware story — there is no second overlay mechanism.
- `behavior`, `workflow`, and `contract` share one row. Evidence is present with rules, examples, flows, or constraints — inline, or promoted onto a refining child or a `constrainedBy` constraint. Evidence is complete with rules and/or examples, inline or promoted; constraints alone no longer suffice.
- A `rule` converges across the two rungs: its statement is its evidence, because a rule's content is its statement.
- An `example` shows evidence present with an examples entry, prose acceptable. It shows evidence complete with at least one structured given/when/then entry whose every used step is fully bound and belongs compatibly to any example space its parent owns — the concreteness law.
- A `constraint` shows evidence present with a non-empty constraints section, and complete when every entry carries a machine-readable target.
- A `model` converges on non-empty terms: a vocabulary either has terms or it does not.
- A `decision` shows evidence present once its decision section is there — context and alternatives may precede the choice — and complete once the chosen option is written.
- The `contract` row stands on the behavior row as a named deferral: when a dedicated contract section lands, the typing law pulls it in and this row repoints to it.
- Promoted evidence carries an honesty bound. A promoted child counts only when it is a `rule` or `example` Spec that itself clears its own kind's present cell, and a `constrainedBy` edge counts only when it resolves to a `constraint` Spec carrying its constraints — promotion moves content out, so an empty stub child is not a promotion and confers nothing.
- The rows are monotonic, promotion-neutral, and converge honestly where a kind has no stronger form; those three bounds belong to the decision this Spec is shaped by and to the carried-evidence decision, and are not restated as law here.
- The evidence table in `src/validate/readiness-floor.ts` is the row set's code-level source of truth and the realizing entrypoint; the rows stated here and that table are one law read twice, so any disagreement between them is drift to resolve on one side.

## Example space
```gwt-vocabulary
Given the graph holds a {kind:"behavior"|"constraint"} spec {specId:string} stating readiness {readiness:"scoped"|"defined"}
Given its only evidence is {evidence:"a constraints entry carrying a target"|"a constraints entry with no target"|"an empty promoted rule child"}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the finding names the unmet floor clause {clauseId:string}
Then the report holds {errorCount:number} errors
```
