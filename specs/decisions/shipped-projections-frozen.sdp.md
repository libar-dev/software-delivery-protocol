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
- context: An earlier projection-settling record refused re-specifying the four shipped projections, and the adoption register carried that refusal as a standing do-not-reopen row, but the refusal lived only as plan prose the graph could not check.
- decision: Re-specifying the shipped Design Review, census, Mermaid, or Gherkin projection is refused. These four projections are the ruled read surfaces over the one graph, and the ruling reopens only through a later decision Spec that supersedes this one and passes the ADR three-part test.
- rationale: The four projections are shipped, curated read surfaces over the one graph. Re-specifying them re-litigates settled law and risks a second truth store, while a graph-checkable decision record carries the refusal where agents and validators can read it.
- consequence: Plans treat the four projections as settled read models. Any proposal to reshape one of them arrives as a superseding decision record, never as a follow-up work item.
