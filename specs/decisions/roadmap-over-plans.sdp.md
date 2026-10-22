---
id: spec:decisions.roadmap-over-plans
kind: decision
altitude: feature
readiness: defined
relations:
  refines:
    target: spec:decisions.planning-truths-placement
    reason: narrows what a plan file may still carry once a roadmap holds priority
  dependsOn:
    target: spec:decisions.roadmap-priority
    reason: plan files give up forward planning only once a roadmap holds priority in the graph
---
# Plan files stop carrying forward planning once the roadmap does

Each arc's intent already lives in its capture Specs and its Pack, its rulings in their carrying Specs, its open items in keyed questions, and its story in its pull request description. A plan file still carries the status line the handbook copies and agents read first, the arc's lanes and waves, copies of its ruling tables, and its acceptance as measured. Once a roadmap holds priority in the graph, the forward role has a graph home; what remains of a plan is history, or a second copy of what the pull request description already holds.

## Intent

- outcome: Decide whether the Protocol retires its numbered plan files as the carrier of forward planning, reading its next work from the roadmap instead, and what replaces the gate that requires a current plan.

## Decision

- context: Plan files grew as the Protocol's working record: every arc adds one, the handbook keeps a status line for each, and the self-hosting gate requires the highest-numbered plan to carry a status header the handbook names. Since the graph-first planning arc, a plan is a thin pointer to its Pack and capture Specs, and the pull request description standard already asks each description for the arc's story, its rulings as tables, its acceptance as measured and a forward section. The owner asked whether plans can be replaced by Specs: no prose in the plan, but designed, grouped and prioritized roadmaps and sets of features or epics.
- decision: The Protocol reads its forward planning from its roadmap and stops adding plan files. `plans/` stands as frozen history, closed by the plan of the arc that builds the roadmap. An agent opening the next work runs the roadmap recipe over the roadmap Pack the handbook names and follows each entry to its Packs and carrying Specs. An arc's execution record, its branch and base, its working rules, its lanes, the rulings with who made them, its acceptance as measured, its deferrals and its refusals, lives in its pull request description, opened as a draft at the arc's first authorized push. Before that push it lives in one record file under `reviews/` named for the arc's Pack, which also keeps the work done and outstanding and the commands that re-measure it, so a session can recover the arc from the branch alone; at the first authorized push the record moves into the draft pull request and the file keeps only its link. Neither the file nor this decision authorizes a push. Evidence no test or recipe carries sits under `reviews/` beside the description that cites it. The handbook names the roadmap Pack and the roadmap recipe where it named the current plan, and the self-hosting gate checks that instead of a current plan.
- rationale: Hard to reverse: the handbook, the skills, the description standard and a gate all point agents at the newest plan, and every session's first read changes. Surprising without context: a reader finds a numbered folder that stopped. A real trade-off: one forward-planning carrier, in the graph, with no plan status to keep in step with the handbook, against an arc's working record moving from a numbered plan to a short-lived record file and then to its draft pull request; the arc's Pack, that record and git take the plan's role.
- alternative: Keep plan files for forward planning beside the roadmap: priority would live in two places, and the plan's copy would drift.
- alternative: Keep a thin plan file per arc for its execution record alone, with no status gate: the pull request description already carries the same record by the description standard, so the file would be a second copy that the next session must reconcile.
- alternative: Record an arc's execution in the graph, as an arc Spec or Pack fields: who ruled what and when is history that git and the description keep, and that a review happened is never a graph fact.
- alternative: Keep each arc's whole execution record in a committed file under `reviews/` for its life: once the draft pull request exists the file would duplicate the description, so the file holds the record only until the first authorized push and then only the link.
- consequence: The handbook drops its stack of plan statuses for a short pointer to the roadmap and its recipe. The self-hosting gate's current-record check refuses a numbered plan past the last frozen one, a handbook that does not name the roadmap Pack and recipe, and a roadmap Pack manifest that is missing or does not state priority order; its frozen historical checks, its green-gate legs and its ban on plan status in the registry and the glossary stay.
- consequence: The graph-first planning Spec's plan-file rule narrows to a plan document a corpus chooses to keep, which points to its Packs and carrying Specs and confers nothing; an adopter keeps whatever planning documents it wants, and a roadmap is open to it as to the Protocol.
- consequence: The description standard renders its forward section with the roadmap memo; the pull request that completes an entry's selected work removes it from the roadmap in the same change, and entries join or move only on the owner's word.
- consequence: The commit strategy that authorizes commits on an arc's branch comes from the owner's instruction for the arc, recorded in the arc's record, its record file before the first push and its draft pull request after, where it came from the plan file; uncommitted state that has no clean boundary is accounted for in the same record.
- consequence: The plan files stay as they are. A heavy cleanup of superseded material and review reports remains a later arc.
