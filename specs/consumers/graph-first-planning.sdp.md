---
id: spec:consumers.graph-first-planning
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.delivery-session-on-ramp
  decidedBy: spec:decisions.planning-truths-placement
---
# Arc intent is planned from the graph, not a prose briefs index

## Intent

- outcome: Forward arc intent is captured as sub-ready Specs so planning sessions derive the backlog and readiness from the graph, with plans reduced to thin lineage pointers.

## Behavior

- rule: `spec:consumers.delivery-session-on-ramp` owns per-session routing from graph state; this Spec owns only arc-scale commissioning — how the next arc's intent enters the corpus and is read back.
- rule: Planning remains advisory reading of the graph; no recipe, preflight, or plan document authorizes, blocks, or sequences delivery work.
- rule: A work-item dependency is authored only as a `dependsOn` edge between Specs whose truth genuinely needs the other to hold; independence is the absence of the edge, and no scheduling or sequencing phrase is ever authored.
- rule: A decision record is a `decision`-kind Spec joined to its subject by `decidedBy`; a lawful non-decision lives as decision content or a plan record, never as a decision record, and it never mints an authored delivery fact.
- rule: A do-not-reopen row's home follows its shape: a tradeoff refusal lives on a `decision`-kind Spec, never a `constraint`, and reopens only through a later decision that passes the ADR three-part test and either `supersedes` it, replacing it whole, or `refines` it, narrowing it for one part; an existing behavior guarantee stays on its carrying Spec and reopens by revising that Spec; a hold stays a blocking open question on its Spec; a lawful non-decision stays in the plan record and mints no Spec.
- rule: A decision that replaces another whole keeps the older record and its `supersedes` edge only while the older text explains something a reader still needs; otherwise it carries what survives as its own consequences and the older record is deleted, with git as its history.
- rule: An arc is a Pack named for the capability it designs, never for a plan number, listing the arc's Specs in reading order; membership confers no readiness, delivery fact or gate, and the Pack outlives the arc as a review aggregate while the plan file names it as a lineage pointer.
- rule: A re-entry trigger is the deferred Spec's own blocking open questions, plus a `dependsOn` edge when a true precondition exists; the plan 35 deferrals named four re-entry triggers: Spec Studio, the reference projection, the context bundle and the structural-edge Mermaid, and each deferred Spec now carries its trigger as its own blocking question, except the context bundle, whose trigger the first adopter's design passes have met; no plan document re-arms deferred work.
- rule: A deliverable with exclusive ownership across consumers has exactly one Spec identity; every consumer `dependsOn` that identity instead of restating the deliverable.
- rule: Selection-pressure heuristics stay advisory, carried as behavior rules here or as recipes; they authorize, block, and sequence nothing.
- rule: Session law re-measures from the graph first; a session never inherits readiness, backlog, or placement state from a prior plan, register, or summary.
- rule: The thin plan file is a lineage pointer that carries plan numbering and staleness; numbering and staleness never become graph structure.
- rule: The E2 placement ruling for `sdp new spec` and `sdp validate --watch` is a lawful non-decision that failed the ADR three-part test; it lives in the plan record and mints no Spec.
