---
id: spec:decisions.shipped-projections-frozen
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
---
# The shipped projections stay frozen

## Intent
- outcome: Keep the shipped Design Review, census, Mermaid, and Gherkin projections as the ruled read surfaces so re-specifying them never re-enters a plan.

## Decision
- context: The do-not-reopen register carried forward from plans/34 into plans/36 (the shipped-projections row) refused re-specifying the four shipped projections, but that refusal lived only as plan prose the graph could not check.
- decision: The shipped Design Review, census, Mermaid, and Gherkin projections are frozen as ruled. Re-specifying any of them is refused, and the ruling reopens only through a later decision Spec that supersedes this one and passes the ADR three-part test.
- rationale: The four projections are shipped, curated read surfaces over the one graph. Re-specifying them re-litigates settled law and risks a second truth store, while a graph-checkable decision record carries the refusal where agents and validators can read it.
- consequence: Plans and briefs treat the four projections as settled read models. Any proposal to reshape one of them arrives as a superseding decision record, never as a follow-up todo.
