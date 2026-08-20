# briefs-index-into-spec-relations - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** the planning Spec answers its first open question with a ruled map of where every kind of planning truth lives, the standing "do not reopen" list moves out of old plan documents into decision records the graph can check, and the current arc's plan file slims down to the lineage pointer it was meant to be.

**Why this approach:** the existing model already has a lawful home for every truth type, so the session rules placements and applies them instead of inventing new machinery; verified inventory work showed 10 of the 11 standing rows already have homes, so almost nothing new gets created.

**What it will NOT do:** it will not design new graph machinery, promote any Spec's maturity, settle the arc-boundary question, or rewrite any closed plan document.

**Effort:** Medium
**Risk:** Low - prose and decision records only, with a full validation gate and an explicit stop-and-record escape hatch
**Decisions to sanity-check:** the placement map itself (each truth type's ruled home), and that the shipped-projections refusal is the only standing row likely to need a new decision record.

Your next move: execution starts via /start-work in this session or a new one. Full execution detail follows below.

---

> TL;DR (machine): Medium effort, low risk; 7 todos + 4 final verifiers; Spec prose, at most 2 new decision Specs, plan 38 slimmed, gate-after QA.

## Scope
### Must have
- A placement map ruling a home per briefs-index truth type, recorded as behavior rules and
  prose on `spec:consumers.graph-first-planning`; blocking question 1 answered, question 2 left
  open with evidence notes only.
- The live do-not-reopen register (plans/36:201-218) re-homed: rows backed by an existing
  ratified decision Spec get linked, rows without one get a new decision or constraint Spec,
  with `supersedes` named as the reopen path.
- `plans/38-graph-first-planning-arc.md` restructured to the ruled thin-pointer shape.
- The ADR three-part test applied to the placement ruling; a decision Spec authored only if it
  passes.
- Gate-after QA: `npm run check` green, self-hosting oracle pin sync if corpus counts move,
  recipes 9/11 output recorded as advisory evidence.
### Must NOT have (guardrails, anti-slop, scope boundaries)
- No new relation type and no engine surface built in-session; a recommendation is captured as
  a later idea-rung Spec at most.
- No readiness promotion; stated rungs untouched (promotion is a human statement).
- No edits to historical plans 29-37; the register's live copy moves, its history stays.
- No ruling on blocking question 2 (arc boundary); evidence notes only.
- No commit absorbs the unrelated uncommitted AGENTS.md edit (the unslop line).
- No workflow gates, no authored delivery facts, no Pack framing carrying law.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none (Spec prose and plan documents have no TDD surface) + gate-after QA
- Evidence: .omo/evidence/briefs-index-into-spec-relations/task-<N>-*.{md,txt}

## Execution strategy

One design session, scope rung (a). The placement map below is the decided design (evidence:
the draft's Findings and the architect advisory); the executor applies it, never redesigns it.
Every migration todo carries the escape hatch: a concrete, citable contradiction with repo law
stops the migration, is recorded in the todo's evidence file, and counts as a complete outcome.

### The ruled placement map (the design being applied)

| Briefs-index truth type | Ruled home |
| --- | --- |
| Work-item dependency maps | `dependsOn` only for true Spec-truth need-to-hold; independence is absence of the edge; scheduling phrases are never authored. Ruled here, NOT migrated (plans/34 maps stay). |
| Decision gates incl. lawful non-decision | `decision`-kind Spec + `decidedBy`; a lawful non-decision is decision content or a plan record, never a gate. |
| Do-not-reopen rows | `decision`-kind Specs (never `constraint`); reopen path is a later decision that `supersedes`, gated by the ADR three-part test. |
| Re-entry triggers | the deferred Spec's own blocking open questions, plus `dependsOn` when a true precondition exists. |
| Exclusive cross-brief ownership | one Spec identity for the deliverable; consumers `dependsOn` it. |
| Selection-pressure heuristics | advisory behavior rules on `spec:consumers.graph-first-planning` or recipes. |
| Session law (re-measure-first, handoff, numbering, staleness) | split: behavior rules on `spec:consumers.graph-first-planning`, the existing on-ramp handoff rule, and the thin plan file. |
| Arc boundary (question 2) | NOT ruled in this session; evidence notes only. |

### The live register row map (verified by metis against the corpus)

| plans/36 row | Existing home | Action |
| --- | --- | --- |
| 1 default-carrier flip (MD-29) | spec:decisions.carrier-universality | link, no new Spec |
| 2 Gherkin expansion refusals | same record as row 1 (carrier-universality:16) | link, no new Spec |
| 3 implements slot (MD-30) | spec:decisions.structural-anchor-semantics | link, no new Spec |
| 4 frozen registrar interface | spec:extraction.runnable-modules (:11,:19,:25,:31) | link, no new Spec |
| 5 O5 + Scenario Outlines | spec:extraction.runnable-modules (:31) | link, no new Spec |
| 6 shipped projections frozen | candidate UNHOMED; verify against spec:consumers.projections-model | mint `spec:decisions.shipped-projections-frozen` ONLY if verification finds no carrier |
| 7 bySymbol / impact-graph | a HOLD, not a refusal: spec:consumers.impact-graph blocking open question | link, never mint; do NOT answer the identity question |
| 8 .sdp.gherkin suffix (MD-28) | spec:decisions.sdp-gherkin-extension | link, no new Spec |
| 9 query verbs (MD-22) | spec:decisions.agent-front-door | link, no new Spec |
| 10 E2 placement ruling | recorded non-decision (plans/35:22 failed the ADR test) | NO Spec; GFP prose classifies it as lawful non-decision |
| 11 E3 MCP + H deferrals | spec:decisions.mcp-deferred (E3 half); H triggers stay recorded triggers | link E3; H deferrals become GFP prose, no new Specs |

Expected mints: zero or one register decision Spec (row 6), plus at most one placement-ruling
decision Spec (`spec:decisions.planning-truths-placement`) if it passes the ADR test.

### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.

- Wave 1 (parallel): T1 register coverage verification (no edits) · T2 GFP enrichment.
- Wave 2 (parallel): T3 register mint + linkage (blocked by T1) · T4 placement-ruling ADR
  evaluation (blocked by T2) · T5 on-ramp handoff clause (blocked by T2; conditional).
- Wave 3: T6 plan 38 restructure (blocked by T2, T3, T4).
- Wave 4: T7 gate-after QA and oracle sync (blocked by all).

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T1 | - | T3 | T2 |
| T2 | - | T4, T5, T6 | T1 |
| T3 | T1 | T6, T7 | T4, T5 |
| T4 | T2 | T6, T7 | T3, T5 |
| T5 | T2 | T7 | T3, T4 |
| T6 | T2, T3, T4 | T7 | - |
| T7 | T1-T6 | - | - |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Verify the live register's per-row coverage in the graph
  What to do / Must NOT do: Load `.agents/skills/sdp-agent-surface/SKILL.md` first. For each of
  the 11 do-not-reopen rows at plans/36-adoption-tranches-maturation-and-bundle-evidence-briefs.md:201-218,
  verify the ruled home from the plan's register row map using `pnpm --silent sdp:q` with
  `g.specContext('<id>')` on each suspected carrier (rows 1-5, 8, 9, 11) and with
  `g.findByConcept('Design Review')` / `g.specContext('spec:consumers.projections-model')` for
  row 6. Record a per-row verdict table (row | claimed home | confirmed | carrier section that
  holds the refusal) as the evidence file. Also run recipe 9 (promotion preflight body from
  docs/agent-surface/recipes.md:369) on spec:consumers.graph-first-planning and recipe 11 for
  the pre-session baseline, and append both outputs to the evidence file. Edit NOTHING. If a
  claimed home does NOT hold its row's refusal, mark the row UNHOMED (this feeds T3); row 6
  UNHOMED is the expected mint candidate, any other UNHOMED row is a stop-and-record event.
  Parallelization: Wave 1 | Blocked by: - | Blocks: T3
  References: plans/36-...-briefs.md:201-218 (the register); the register row map in this plan;
  docs/agent-surface/recipes.md:80 (recipe 1), :369 (recipe 9), :440 (recipe 11);
  .agents/skills/sdp-agent-surface/SKILL.md (query contract).
  Acceptance criteria (agent-executable): the evidence file exists and contains a verdict for
  all 11 rows plus the recipe 9/11 baseline outputs; every specContext query ran without a
  `found: false` for rows 1-5, 8, 9, 11.
  QA scenarios: happy = all rows verdicted, evidence file written. failure = a row other than
  6 comes back UNHOMED: record it and flag T3 to skip that row's mint (the escape hatch).
  Evidence .omo/evidence/briefs-index-into-spec-relations/task-1-register-coverage.md
  Commit: N (evidence only; evidence commits ride with T7)
  Recommended task executor category: quick - read-only graph queries plus one evidence file.

- [x] 2. Answer blocking question 1 on spec:consumers.graph-first-planning
  What to do / Must NOT do: Load `.agents/skills/sdp-authoring/SKILL.md` first. Enrich
  specs/consumers/graph-first-planning.sdp.md in place: (a) remove the first blocking open
  question (the briefs-index placement question) and record its answer as behavior rules that
  carry the ruled placement map from this plan, one rule per truth type, each naming its
  guardrail (no sequencing authority, no authored delivery facts, decision-kind only for
  refusals, supersedes as the reopen path); (b) add the session-law rules the map assigns to
  this Spec (re-measure-first / never inherit; the thin plan file carries numbering and
  staleness); (c) classify the E2 placement ruling as a lawful non-decision living in the plan
  record; (d) keep the second blocking question (arc boundary) present and marked [blocking],
  adding one evidence note line recording where the register landed as input toward Q2 WITHOUT
  ruling it; (e) preserve the ownership-split rules at lines 22-23 verbatim in meaning. Must
  NOT: change the readiness field (stays `idea`); answer or weaken Q2; name any recipe/plan as
  authorizing, blocking, or sequencing work; add relations other than the existing `refines`.
  Sync the oracle pin for this Spec's sections in test/self-hosting-oracle/consumers.ts (the
  GFP block, currently lines 1030-1058) to the new prose.
  Parallelization: Wave 1 | Blocked by: - | Blocks: T4, T5, T6
  References: specs/consumers/graph-first-planning.sdp.md (the carrier);
  .agents/skills/sdp-authoring/SKILL.md (authoring workflow); the ruled placement map in this
  plan; test/self-hosting-oracle/consumers.ts:1030-1058 (the pin to sync);
  specs/consumers/delivery-session-on-ramp.sdp.md:15-20 (the anti-gate law the rules must not
  violate); docs/agent-surface/recipes.md:369 (recipe 9 for QA).
  Acceptance criteria: `pnpm --silent sdp validate . --exclude explorations --exclude examples
  --exclude test/fixtures/import/parity` exits 0; recipe 9 on spec:consumers.graph-first-planning
  shows statedReadiness "idea", Q1 absent from openQuestions, Q2 present and blocking; the
  oracle file's GFP block matches the new carrier prose (npm test's self-hosting suites pass
  in T7).
  QA scenarios: happy = validate green + recipe 9 shows Q1 answered, Q2 blocking. failure =
  validate finding on the edited carrier or oracle mismatch: fix the carrier/pin, never weaken
  the check. Evidence .omo/evidence/briefs-index-into-spec-relations/task-2-gfp-enrichment.md
  (validate output + recipe 9 output, pasted).
  Commit: Y | docs(specs): answer graph-first-planning's briefs-index placement question
  Recommended task executor category: writing - Spec carrier prose plus its oracle pin.

- [x] 3. Mint decision Specs for register rows confirmed UNHOMED (expected: row 6 only)
  What to do / Must NOT do: Load `.agents/skills/sdp-authoring/SKILL.md` first. Consume T1's
  verdict table. For each row confirmed UNHOMED (expected: only row 6, the shipped-projections
  refusal), mint a `kind: decision` Spec via `pnpm --silent sdp:q`-verified workflow of
  `sdp new spec` (npm run --silent sdp -- new spec ...), id `spec:decisions.shipped-projections-frozen`
  for row 6, recording: the refusal (no re-specifying the shipped Design Review, census,
  Mermaid, or Gherkin projections), the reopen path (a later decision Spec that `supersedes`
  this one and passes the ADR three-part test), and the lineage pointer (plans/36:206, carried
  from plans/34). Complete the decision section to the shape src/validate/readiness-floor.ts:384-391
  requires. Add the new Spec to the Pack manifest in specs/self-hosting.pack.sdp.md. State
  readiness `ready` ONLY with a matching DECISIONS.md row (MD-26, next append-only MD number);
  otherwise leave it at the floor-honest rung. Wire `decidedBy` from any subject Spec the
  refusal binds (verify candidates with g.findByConcept before adding an edge). Must NOT: mint
  Specs for rows T1 confirmed as homed (zero duplicates); mint anything for rows 7 (a hold),
  10 (a lawful non-decision), or 11 (split: link + prose); use kind constraint; add a
  `supersedes` edge from anything but a decision; edit plans/34/35/36/37. Sync all oracle
  surfaces for the added Spec(s): test/self-hosting-graph.test.ts literals (spec count,
  expectedPackMembers, declared-relations roster, readiness histogram) and the family oracle.
  ESCAPE HATCH: if T1 marked an unexpected row UNHOMED, or writing the refusal reveals the row
  is not a true refusal, record the contradiction in the evidence file and skip the mint.
  Parallelization: Wave 2 | Blocked by: T1 | Blocks: T6, T7
  References: the register row map in this plan; plans/36-...-briefs.md:201-218;
  specs/decisions/mcp-deferred.sdp.md (shape model for a deferral decision);
  docs/concept/DECISIONS.md:7 (ADR test), :9-10 (append-only numbering);
  specs/decisions/decision-readiness-posture.sdp.md:16 (MD-26);
  src/validate/readiness-floor.ts:384-391 (decision completeness);
  src/validate/validators.ts:466-479 (supersedes is decision-only);
  specs/self-hosting.pack.sdp.md (manifest); test/self-hosting-graph.test.ts:142-196 (pins).
  Acceptance criteria: validate exits 0; `pnpm --silent sdp:q 'return g.specContext("spec:decisions.shipped-projections-frozen")'`
  returns found: true (if minted) with the decision section complete; the new id appears in the
  Pack manifest; recipe 1 (docs/agent-surface/recipes.md:80) shows no new operational backlog
  rows (decision kind is excluded); the graph-test literals equal the live counts.
  QA scenarios: happy = minted Spec validates, Pack membership resolves, literals match. failure
  = validate finding (e.g. supersedes from a non-decision) or Pack/histogram pin mismatch: fix
  the authoring, never the validator. Evidence
  .omo/evidence/briefs-index-into-spec-relations/task-3-register-mint.md (T1 verdicts consumed,
  mints made or skipped with reason, validate output).
  Commit: Y | docs(specs): re-home the live do-not-reopen register into decision Specs
  Recommended task executor category: writing - decision-Spec authoring plus pin sync.

- [x] 4. Apply the ADR three-part test to the placement ruling itself
  What to do / Must NOT do: Evaluate the placement ruling (the ruled placement map in this
  plan) against the ADR three-part test (docs/concept/DECISIONS.md:7): hard to reverse,
  surprising without context, a real trade-off. The expected answer is yes on all three (it
  retires the briefs-index shape, it is non-obvious why session law splits three ways, and the
  refused alternative is minting new relation types). If it passes: mint
  `spec:decisions.planning-truths-placement` via the authoring skill, recording the ruling, the
  refused alternatives (new relation types such as precedes/inArc/forbids, with the blast-radius
  reason), and the reopen path (superseding decision); wire `decidedBy` from
  spec:consumers.graph-first-planning to it; add it to the Pack manifest; add the DECISIONS.md
  registry row (next append-only MD number) and state readiness per MD-26; sync the oracle
  surfaces exactly as in T3. If it FAILS the test: mint nothing, and record the failure with
  its reasoning in the evidence file (a lawful non-decision, complete outcome). Must NOT: mint
  the Spec when the test fails; reuse an MD number; write plan-status wording into DECISIONS.md
  or CONTEXT.md (check-self-hosting-gates.mjs:277-294 forbids it).
  Parallelization: Wave 2 | Blocked by: T2 | Blocks: T6, T7
  References: docs/concept/DECISIONS.md:7,:9-10; specs/decisions/decision-readiness-posture.sdp.md:16;
  the ruled placement map in this plan; plans/35-agent-surface-adoption-and-self-binding.md:22
  (the shape of a recorded test failure); specs/self-hosting.pack.sdp.md;
  test/self-hosting-graph.test.ts:142-196.
  Acceptance criteria: the evidence file contains the three-part evaluation, one line per
  prong; if passed, validate exits 0 and specContext on the new id returns found: true with
  the decidedBy edge from GFP resolving; if failed, no new files exist and the failure
  reasoning is recorded.
  QA scenarios: happy = test passes, decision Spec minted and wired, validate green. failure =
  test fails: record and mint nothing (this is a PASS outcome for the todo, not a block).
  Evidence .omo/evidence/briefs-index-into-spec-relations/task-4-placement-adr.md
  Commit: Y | docs(specs): record the planning-truths placement ruling
  (skip the commit when the test fails; the evidence rides with T7)
  Recommended task executor category: writing - one ADR evaluation plus at most one decision Spec.

- [x] 5. Enrich the on-ramp handoff rule IF the placement map assigns it (conditional)
  What to do / Must NOT do: The ruled map puts session-law handoff content on the existing
  on-ramp rule, not on GFP (GFP:22 forbids owning per-session routing). Check whether T2's
  session-law rules left any handoff clause unhomed. If yes: add exactly ONE behavior rule to
  specs/consumers/delivery-session-on-ramp.sdp.md extending the existing handoff rule
  (currently :18) with the arc-scale pointer (a handoff names the arc's live register home),
  and sync its oracle block in test/self-hosting-oracle/consumers.ts. If no (the map's session
  law fit entirely on GFP and the thin plan file): skip the edit and record the skip reason.
  Must NOT: make any other on-ramp edit; touch the on-ramp's readiness; contradict GFP:22-23.
  Parallelization: Wave 2 | Blocked by: T2 | Blocks: T7
  References: specs/consumers/delivery-session-on-ramp.sdp.md:15-20;
  specs/consumers/graph-first-planning.sdp.md:22-23; test/self-hosting-oracle/consumers.ts.
  Acceptance criteria: validate exits 0; either the on-ramp carrier gained exactly one behavior
  rule with its oracle pin synced, or the evidence file records the skip reason.
  QA scenarios: happy = one rule added, validate green. failure = the clause would contradict
  the ownership split: record and skip (complete outcome).
  Evidence .omo/evidence/briefs-index-into-spec-relations/task-5-onramp-clause.md
  Commit: Y | docs(specs): point session handoffs at the register's new home
  (skip the commit when skipped; the evidence rides with T7)
  Recommended task executor category: quick - one conditional rule plus its pin.

- [x] 6. Restructure plan 38 to the ruled thin-pointer shape
  What to do / Must NOT do: Rewrite plans/38-graph-first-planning-arc.md body (keep the title
  and the DRAFTED status header's first line) to carry only the four retained truths under the
  new ruling: the authority stance (graph wins on disagreement), the lineage why, the intent
  Spec pointers (now including any decision Specs minted in T3/T4), and the discipline
  restatement. Replace the narrative allusion to "the standing do-not-reopen row" with a
  pointer to the register's new home (the decision Specs and linked carriers named in the plan's
  register row map). State explicitly: the live do-not-reopen law now lives in those Specs;
  plans 36/37 keep their historical text untouched. Must NOT: edit plans/29-37; change the
  DRAFTED status; name plan 38 as authorizing, blocking, or sequencing work; add a briefs
  index's machinery back (no dependency map, gate table, or leave-behind checklist).
  Parallelization: Wave 3 | Blocked by: T2, T3, T4 | Blocks: T7
  References: plans/38-graph-first-planning-arc.md (current shape); plans/36-...-briefs.md:3-8
  (the authority stance being slimmed from); AGENTS.md:19-24 (the status-header contract that
  must stay true: "plan 38 is DRAFTED" and the same three capture Specs).
  Acceptance criteria: the restructured file carries exactly the four retained truths plus the
  register-home pointer; `npm run check:self-hosting-gates` (or the full gate in T7) still passes with AGENTS.md untouched.
  QA scenarios: happy = plan 38 slims to the ruled shape, gates green. failure = the restructure
  needs a truth type the map did not retain: record it as Q2 evidence in the evidence file and
  keep that truth in the plan file (the map's default home for unassigned session law).
  Evidence .omo/evidence/briefs-index-into-spec-relations/task-6-plan38-restructure.md (before/
  after outline, any Q2 evidence recorded).
  Commit: Y | docs(plans): slim plan 38 to the ruled lineage-pointer shape
  Recommended task executor category: writing - one plan document restructure.

- [ ] 7. Gate-after QA: oracle sync verification, green gate, advisory recipes, evidence commit
  What to do / Must NOT do: (a) Verify the full oracle surface matches the live corpus:
  test/self-hosting-graph.test.ts literals (spec/pack/anchor counts, expectedPackMembers,
  declared-relations roster, readiness histogram at :142-196) and every touched family oracle
  block (consumers.ts, decisions.ts if T3/T4 minted). (b) Run `npm run check` to green; the one
  intentional verifies-linkage warning in check:example and the five intentional honesty/gaps
  warnings in check:self-hosting are expected, not regressions. (c) Run and paste into the
  evidence file: recipe 1 (operational backlog; assert no new rows from this session, decision
  kind is excluded), recipe 9 on spec:consumers.graph-first-planning (statedReadiness "idea",
  Q1 absent, Q2 present and blocking), recipe 11 (GFP still on the lower ladder). (d) Agent
  READ: re-read the final GFP carrier and check each behavior rule against the ruled placement
  map (one home per truth type, six relations only, no sequencing authority); record the
  verdict. (e) Commit the evidence directory. Must NOT: weaken or delete any failing check;
  promote any readiness rung; absorb the unrelated uncommitted AGENTS.md unslop hunk into ANY
  commit (verify with `git status --porcelain` and `git diff --cached AGENTS.md` before each
  commit: the unslop line must never appear in a staged diff).
  Parallelization: Wave 4 | Blocked by: T1-T6 | Blocks: -
  References: package.json (the check script); test/self-hosting-graph.test.ts:142-196;
  test/self-hosting-oracle/consumers.ts; docs/agent-surface/recipes.md:80,:369,:440;
  AGENTS.md working discipline (check before green claims).
  Acceptance criteria: `npm run check` exits 0; the three recipe outputs are pasted in the
  evidence file and show the asserted shapes; the READ verdict is recorded; `git log` shows no
  commit containing the AGENTS.md unslop line.
  QA scenarios: happy = gate green, recipes as asserted, READ verdict clean. failure = any red
  step: fix the authoring from the failing check's message, never the check; if the fix
  contradicts this plan, stop and record (escape hatch).
  Evidence .omo/evidence/briefs-index-into-spec-relations/task-7-gate-after-qa.md
  Commit: Y | chore(evidence): record the design session's gate-after QA
  Recommended task executor category: quick - command runs, literal sync checks, evidence commit.

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit: every todo executed or skipped with its recorded reason; every
  escape-hatch invocation has its contradiction recorded; the four retained truths are all plan
  38 carries; no historical plan file was edited (git diff --name-only against plans/29-37 is
  empty).
- [ ] F2. Code quality review: the new and edited carriers read lean, speak ratified vocabulary
  (CONTEXT.md), lead with meaning over MD-n codes, and carry no workflow-gate or authored-fact
  wording; DECISIONS.md rows (if any) are one-line glosses with carrying Spec links.
- [ ] F3. Agent-executed QA evidence review: re-run the T7 commands (npm run check; recipes 1,
  9, 11 bodies from docs/agent-surface/recipes.md) and confirm the evidence files' pasted
  outputs reproduce; confirm the agent READ verdict covers every GFP behavior rule against the
  placement map. (Replaces manual QA: this plan has zero human-intervention surface.)
- [ ] F4. Scope fidelity: only rung-(a) deliverables exist; no new relation type, no engine
  edits (git diff --name-only shows no src/ changes), no readiness-field changes on pre-existing
  Specs, Q2 still blocking on the GFP carrier, no AGENTS.md unslop hunk in any commit.

## Commit strategy

One commit per todo marked Y, in wave order, each after its own validate/gate step is green.
The execution plan's explicit commit strategy authorizes these commits on the current branch
(feature/graph-first-planning-arc). Before EVERY staged commit, verify the unrelated
uncommitted AGENTS.md unslop edit is not in the staged diff; it never rides any commit from
this plan. T3/T4 mint commits carry their Pack, registry, and oracle pin syncs in the same
commit (one coherent corpus change, per the 20754a4 precedent). No push without the user's
explicit request.

## Success criteria

- `spec:consumers.graph-first-planning` answers blocking question 1 as behavior rules; question
  2 remains open and blocking with an evidence note; stated readiness stays `idea`.
- The live do-not-reopen register's 11 rows each have a ruled, verified home; at most two new
  decision Specs exist (row 6 if unhomed; the placement ruling if it passed the ADR test);
  every new Spec is in pack:self-hosting-v1.
- plans/38-graph-first-planning-arc.md carries only the four retained truths plus the register
  home pointer; plans 29-37 are byte-untouched.
- `npm run check` is green with only the pre-existing intentional warnings; oracle literals
  match the live corpus; recipes 1/9/11 outputs are recorded as advisory evidence.
- No commit contains the unrelated AGENTS.md unslop edit; no engine surface changed.
