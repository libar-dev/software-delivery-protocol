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
- context: The refusal to re-specify the shipped Design Review, census, Mermaid and Gherkin projections lived only in plan prose and was absent from the graph.
- decision: Re-specifying the shipped Design Review, census, Mermaid, or Gherkin projection is refused. These four projections are the ruled read surfaces over the one graph. A later decision Spec that supersedes this one replaces the ruling whole; a decision Spec that refines this one narrows it for one projection or one rendering and leaves the rest frozen. Either passes the ADR three-part test.
- rationale: The four projections are shipped, curated read surfaces over the one graph. Re-specifying them re-litigates settled law and risks a second truth store, while a graph-checkable decision record carries the refusal where agents and validators can read it.
- consequence: Plans treat the four projections as settled read models. Any proposal to reshape one of them arrives as a decision record that refines this one for that projection, or supersedes it whole, never as a follow-up work item.
