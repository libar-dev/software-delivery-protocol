---
id: spec:consumers.graph-first-planning
kind: behavior
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:consumers.authoring-on-ramp
    reason: the planning rules specialize graph-first authoring for capturing and reading the next body of work
  dependsOn:
    - target: spec:consumers.delivery-session-on-ramp
      reason: how a session's requested task meets graph evidence stays with the delivery-session on-ramp
    - target: spec:model.open-question-fields
      reason: the placement rule uses the question's explicit re-entry trigger field
  decidedBy:
    target: spec:decisions.planning-truths-placement
    reason: each planning truth lives in the home this ruling sets
---
# The next body of work is planned from the graph, not from a prose index

## Intent

- outcome: Capture the intent of the next body of work as Specs below `ready`, so planning sessions derive backlog and readiness from the graph and plan files point to their carrying Specs.

## Behavior

- rule: [#ownership] `spec:consumers.delivery-session-on-ramp` owns how a session's requested task meets current graph evidence; this Spec owns how the next body of work's intent enters the corpus and is read back.
- rule: [#advisory] Planning remains advisory reading of the graph: heuristics for choosing work live as behavior rules here or as recipes, and no recipe, heuristic, preflight or plan document authorizes, blocks or sequences delivery work.
- rule: [#placement] Each planning truth lives in the home `spec:decisions.planning-truths-placement` rules for it; a deferred Spec carries its re-entry trigger in the `trigger:` field of its blocking open question, plus `dependsOn` when another Spec must hold first, as `spec:model.open-question-fields` states.
- rule: [#capabilityPack] A body of work is grouped in a Pack named for the capability it designs, never for a plan number, listing its Specs in reading order; membership confers no readiness, delivery fact or gate, and the Pack remains a review aggregate after the work ends.
- rule: [#remeasure] Session law re-measures from the graph first; a session never inherits readiness, backlog, or placement state from a prior plan, register, or summary.
- rule: [#planDocuments] A corpus that keeps plan documents lets each point to its Packs and carrying Specs for intended truth and derived state; a plan document confers nothing, and plan numbering, recorded work order and staleness never become graph structure or workflow authority. Advisory priority over the next work lives in a roadmap Pack.
