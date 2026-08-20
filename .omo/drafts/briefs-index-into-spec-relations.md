---
slug: briefs-index-into-spec-relations
status: approved
intent: clear
review_required: true
plan_path: .omo/plans/briefs-index-into-spec-relations.md
plan_sha256: d10b488f5423a9ec857650035628ced7e8ab76496ac81bd97f1f3d843e64b3ad
review_round_id: round-2
review_round_limit: 5
round_status: closed
pending-action: none - plan approved; execution starts via /start-work
review:
  momus:
    status: approved
    workspace_root: /home/darkomijic/dev-libar/software-delivery-protocol
    runtime_home: null
    target: .omo/plans/briefs-index-into-spec-relations.md
    round_id: round-2
    plan_sha256: d10b488f5423a9ec857650035628ced7e8ab76496ac81bd97f1f3d843e64b3ad
    launch_id: null
    session: st_01a01fe6
    result: "OKAY - plan executable; minor stale line numbers noted as non-blocking"
  convergence_ledger:
    round-1:
      session: st_01a01fe4
      verdict: changes_requested
      accepted_blockers:
        - "T6 cited nonexistent scripts/check-self-hosting-gates.mjs; fixed to npm run check:self-hosting-gates (verified: script at repo root, package.json:58)"
      non_blocking_notes: []
    round-2:
      session: st_01a01fe6
      verdict: approved
      accepted_blockers: []
      non_blocking_notes:
        - "minor stale line numbers in references do not prevent execution"
    rounds_used: 2
    final_live_plan_validation: passed (sha256 matches round-2 digest)
approach: <fill: the approach you intend to plan>
---

# Draft: briefs-index-into-spec-relations

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
- C1 placement map | each briefs-index truth type gets a ruled home with guardrail rationale | active | architect advisory + verified explore inventories (this draft, Findings)
- C2 Spec enrichment | spec:consumers.graph-first-planning records the Q1 answer as behavior rules and prose | active | specs/consumers/graph-first-planning.sdp.md
- C3 worked-example migration | the plan-38 arc's live planning truths move to their ruled homes | active, scope fork | plans/38, plans/36:211-212 impact-graph row
- C4 decision evaluation | ADR test applied to the placement ruling; decision Spec only if it passes | active | docs/concept/DECISIONS.md:7
- C5 validation and records | npm run check green, oracle pins synced, plan 38 and AGENTS.md honest | active | package.json check script

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
- readiness promotion | plan leaves stated rungs untouched; floor evidence only | promotion is a human statement (CONTEXT.md) | n/a, repo law
- decision Spec creation | session applies the ADR three-part test; authors a decision Spec only if the ruling passes | DECISIONS.md admission rule | yes, a ruling can be refused with reason recorded
- historical briefs indexes | untouched; migrating the LIVE do-not-reopen register is not rewriting lineage because the historical plan text stays in place | lineage is evidence, not template; the register is live law binding future sessions | yes
- blocking question 2 (arc boundary) | Q1 only; executor records evidence toward Q2 where the do-not-reopen register lands, without ruling on Q2 | user named the first question as this session's subject; the overlap is where the register lands | yes
- new-surface boundary | the session may RECOMMEND a new graph surface and commission it as a later capture, but never builds engine surface in-session (brief-K pattern) | the closed relation set and truth-free Pack may honestly fail a truth; designing a seventh relation in-session is out of bounds | yes
- dirty worktree | uncommitted AGENTS.md edit (unslop line, unrelated) stays out of scope; no commit may absorb it | user flag | n/a
- metis blocker 1 (honest Q1 vs approved migration) | the plan's placement map is the decided design; each migration todo carries an escape hatch: a concrete, citable contradiction with repo law stops migration and is recorded as a complete outcome | repo honesty guardrails + lawful-non-outcome pattern; user's own "may honestly conclude" framing | yes
- metis blocker 2 (live-law copy) | plans 36/37 stay untouched; the restructured plan 38 names the register's new home; the standing reading discipline (highest primary-numbered plan, graph wins) makes the Specs the live law | user's own ruling: moving live law is not rewriting lineage | yes
- metis blocker 3 | oracle sync is mandatory on ANY corpus change: content pins, Pack membership, declared-relations roster, readiness histogram, graph-test literals (test/self-hosting-graph.test.ts:142-196, test/self-hosting-oracle/consumers.ts:1030-1058) | oracle pins content, not just counts | yes
- metis blocker 4 | do-not-reopen refusals mint as kind: decision only; supersedes never on constraints (src/validate/validators.ts:466-479) | validator law | yes

## Findings (cited - path:lines)

Target: `spec:consumers.graph-first-planning` (feature, idea), two blocking open questions at
specs/consumers/graph-first-planning.sdp.md:17-18. First question is this session's subject:
which briefs-index truths move into Spec relations/prose, which stay in the thin plan pointer.

Briefs-index inventory (explore lane, spot-verified): ~30 truth types across plans/29, 32, 34, 36.
Plan 38 (the thin-pointer pilot) keeps only 4: authority stance (38:3-7), lineage why (38:9-14),
intent Spec pointers (38:16-34), discipline restatement (38:36-39).

Truths with no current graph home split in two families:
- Product-adjacent intent: work-item dependency maps / parallelism contracts (34:268-280),
  decision gates incl. lawful non-decision (36:193-199), do-not-reopen rows (36:211-212, from
  34:306-308), re-entry triggers (29:255-258, 35:133-145), exclusive cross-brief ownership
  (29:201-203), selection-pressure heuristics (36:108-110).
- Pure session law: document authority/numbering (36:15-20), consumption protocol
  (36:22-49), leave-behind checklists (36:221-232), snapshot invalidation rules, review
  adjudication provenance (plan 32).

Graph expressiveness (explore lane, verified):
- Authored relations are a closed set of 6 (specs/model/relations.sdp.md): refines, dependsOn,
  constrainedBy, decidedBy, verifies, supersedes. `dependsOn` is Spec-truth dependency, not
  work-item sequencing.
- Pack is a truth-free review aggregate (specs/model/pack-aggregate.sdp.md); membership cannot
  carry arc semantics without changing its law.
- Blocking open questions are floor-visible: `no-blocking-open-questions` gates `defined`
  (specs/validation/readiness-floor.sdp.md; src/validate/readiness-floor.ts:439-493). This is
  the only graph-native "hold" signal; it marks blocked-on-design, not declined-direction.
- Do-not-reopen rows live only as plan Markdown bullets; the impact-graph row is at
  plans/36:211-212, binding rule at 36:42-43 (reopen needs ADR three-part test,
  docs/concept/DECISIONS.md:7).
- Anti-gate law: delivery-session-on-ramp.sdp.md:20 (preflights never authorize/block/scope),
  graph-first-planning.sdp.md:23 (planning advisory, no sequencing authority).

Derived floors already give maturation order for free (plan 38: recipe 11 reads the arc backlog).

Architect advisory (architect lane, read-only): Design A recommended, existing types only.
Placement per truth type: work-item dependencies -> `dependsOn` for true need-to-hold,
independence is absence of the edge, scheduling phrases never authored; decision gates ->
decision-kind Spec + `decidedBy`, lawful non-decision is decision content; do-not-reopen rows ->
decision (or constraint + `constrainedBy`) Specs, reopen path is a superseding ruling; re-entry
triggers -> `dependsOn` preconditions plus the deferred Spec's own open questions; exclusive
ownership -> one Spec identity for the deliverable, others `dependsOn`; selection-pressure
heuristics -> advisory behavior rules on graph-first-planning or recipes; session law -> split
between graph-first-planning behavior rules (re-measure-first), on-ramp handoff rule, and the
thin plan file (numbering, staleness); arc boundary -> Pack per arc, framing carries no law.
New relation type blast radius: extractor, validators, reader, recipes, glossary, envelope.
Guardrail failure modes named per item: workflow gate, authored delivery fact, claim-taxonomy
collapse, Pack stating truth.

## Decisions (with rationale)

- Scope rung (a), user-approved: record the placement ruling in spec:consumers.graph-first-planning
  and apply it to the plan-38 arc as the worked example. Restructure plan 38's four retained
  truths; re-home the live do-not-reopen register into decision/constraint Specs; historical
  plans untouched.
- Test strategy, user-approved: gate-after. npm run check green, oracle pin sync if the corpus
  changes (20754a4 is the precedent), recipes 9/11 as advisory QA evidence. No TDD surface.
- Placement ruling direction (from verified exploration + architect advisory, to be confirmed by
  the session itself): existing types only; no new relation. Work-item dependencies become
  dependsOn or absence-of-edge; decision gates and do-not-reopen rows become decision/constraint
  Specs with decidedBy/constrainedBy and supersedes as the reopen path; re-entry triggers become
  dependsOn plus open questions; selection pressure becomes advisory behavior rules; session law
  splits between graph-first-planning rules, the on-ramp handoff rule, and the thin plan file.

## Scope IN

- Enrich spec:consumers.graph-first-planning: answer blocking question 1 as behavior rules and
  prose, recording the placement map with guardrail rationale.
- Restructure plans/38-graph-first-planning-arc.md to the ruled thin-pointer shape.
- Re-home the live do-not-reopen register (plans/36:201-218, carried from 34:293-309) into
  decision or constraint Specs, with supersedes noted as the reopen path.
- ADR three-part test on the placement ruling; author the decision Spec if it passes.
- Record evidence toward blocking question 2 where the register lands, without ruling on Q2.
- Gate-after QA: npm run check, oracle sync if needed, recipes 9/11 recorded.
- Keep AGENTS.md honest if the arc's status header facts change.

## Scope OUT (Must NOT have)

- No new relation type, no engine surface built in-session; a recommendation may be captured as
  a later idea-rung Spec.
- No readiness promotion; stated rungs untouched.
- No edits to historical plans 29-37 text beyond what lineage honesty requires (they stay as-is).
- No ruling on blocking question 2 (arc boundary); evidence notes only.
- No absorbing the unrelated uncommitted AGENTS.md unslop edit into any commit.
- No workflow gates, authored delivery facts, or Pack framing carrying law.

## Scope IN

## Scope OUT (Must NOT have)

## Open questions

Surviving forks for the user (interview presented; awaiting answers):
1. Deliverable scope, one question three rungs: (a, recommended) record the placement ruling in
   spec:consumers.graph-first-planning and apply it to the plan-38 arc as the worked example:
   restructure plan 38's four retained truths and re-home the live do-not-reopen register,
   historical plans untouched. (b) ruling only: enrich the Spec prose, move no content.
   (c) full application: also migrate the pure session-law truths (document authority,
   consumption protocol, leave-behind checklists), accepting the larger blast radius.
2. Test strategy: (recommended) gate-after: npm run check green plus self-hosting oracle sync
   if the corpus changes (commit 20754a4 is the worked precedent), recipes 9/11 recorded as
   advisory evidence. (Alternative) also require a red-proof on any oracle pin the session
   touches. No TDD surface exists for Spec prose.

## Approval gate
status: awaiting-approval
approach: design session per scope rung (a); see Decisions and Scope IN/OUT above.
next workflow action: write and review .omo/plans/briefs-index-into-spec-relations.md
