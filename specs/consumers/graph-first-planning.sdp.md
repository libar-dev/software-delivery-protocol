---
id: spec:consumers.graph-first-planning
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.delivery-session-on-ramp
  decidedBy: spec:decisions.planning-truths-placement
---
# Arc intent is planned from the graph, not a prose briefs index

## Intent

- outcome: Forward arc intent is captured as sub-ready Specs so planning sessions derive the backlog, sequencing, and readiness from the graph, with plans reduced to thin lineage pointers.

### Open questions

- [blocking] How does an arc boundary stay legible in the graph (a Pack, a relation cluster, a naming convention) without minting a workflow gate or an authored delivery fact? Evidence note: the briefs-index register's rows landed in four homes: tradeoff refusals on `decision`-kind Specs, existing behavior guarantees on their carrying Specs, holds as blocking open questions, and a lawful non-decision in the plan record; that split is observed evidence for this question, not a ruling on arc-boundary representation.

## Behavior

- rule: `spec:consumers.delivery-session-on-ramp` owns per-session routing from graph state; this Spec owns only arc-scale commissioning — how the next arc's intent enters the corpus and is read back.
- rule: Planning remains advisory reading of the graph; no recipe, preflight, or plan document authorizes, blocks, or sequences delivery work.
- rule: A work-item dependency is authored only as a `dependsOn` edge between Specs whose truth genuinely needs the other to hold; independence is the absence of the edge, and no scheduling or sequencing phrase is ever authored.
- rule: A decision record is a `decision`-kind Spec joined to its subject by `decidedBy`; a lawful non-decision lives as decision content or a plan record, never as a decision record, and it never mints an authored delivery fact.
- rule: A do-not-reopen row's home follows its shape: a tradeoff refusal lives on a `decision`-kind Spec, never a `constraint`, and reopens only through a later decision that `supersedes` it and passes the ADR three-part test; an existing behavior guarantee stays on its carrying Spec and reopens by revising that Spec; a hold stays a blocking open question on its Spec; a lawful non-decision stays in the plan record and mints no Spec.
- rule: A re-entry trigger is the deferred Spec's own blocking open questions, plus a `dependsOn` edge when a true precondition exists; the plan 35 deferrals name three re-entry triggers for this arc: Spec Studio, the reference projection, and the structural-edge Mermaid; no plan document re-arms deferred work.
- rule: A deliverable with exclusive ownership across consumers has exactly one Spec identity; every consumer `dependsOn` that identity instead of restating the deliverable.
- rule: Selection-pressure heuristics stay advisory, carried as behavior rules here or as recipes; they authorize, block, and sequence nothing.
- rule: Session law re-measures from the graph first; a session never inherits readiness, backlog, or placement state from a prior plan, register, or summary.
- rule: The thin plan file is a lineage pointer that carries plan numbering and staleness; numbering and staleness never become graph structure.
- rule: The E2 placement ruling for `sdp new spec` and `sdp validate --watch` is a lawful non-decision that failed the ADR three-part test; it lives in the plan record and mints no Spec.
