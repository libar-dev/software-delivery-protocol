---
id: spec:consumers.graph-first-planning
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines:
    target: spec:consumers.authoring-on-ramp
    reason: the planning rules specialize graph-first authoring for capturing and reading the next body of work
  dependsOn:
    - target: spec:consumers.delivery-session-on-ramp
      reason: per-session routing remains owned by the delivery-session on-ramp
    - target: spec:model.open-question-fields
      reason: the placement rule uses the question's explicit re-entry trigger field
  decidedBy: spec:decisions.planning-truths-placement
---
# The next body of work is planned from the graph, not from a prose index

## Intent

- outcome: Capture the intent of the next body of work as Specs below `ready`, so planning sessions derive backlog and readiness from the graph and plan files point to their carrying Specs.

## Behavior

- rule: `spec:consumers.delivery-session-on-ramp` owns per-session routing from graph state; this Spec owns how the next body of work's intent enters the corpus and is read back.
- rule: Planning remains advisory reading of the graph; no recipe, preflight, or plan document authorizes, blocks, or sequences delivery work.
- rule: Each planning truth lives in the home `spec:decisions.planning-truths-placement` rules for it; a deferred Spec carries its re-entry trigger in the `trigger:` field of its blocking open question, plus `dependsOn` when another Spec must hold first, as `spec:model.open-question-fields` states.
- rule: A body of work is grouped in a Pack named for the capability it designs, never for a plan number, listing its Specs in reading order; membership confers no readiness, delivery fact or gate, and the Pack remains a review aggregate after the work ends.
- rule: Heuristics for choosing work remain advisory behavior rules here or recipes; they authorize, block and sequence nothing.
- rule: Session law re-measures from the graph first; a session never inherits readiness, backlog, or placement state from a prior plan, register, or summary.
- rule: A plan file points to the Pack and carrying Specs for intended truth and derived state; it may keep an advisory execution and recovery record, while plan numbering, recorded work order and staleness never become graph structure or workflow authority.
