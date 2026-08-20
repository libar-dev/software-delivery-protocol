# Task 4 analysis: ADR three-part test on the planning-truths placement ruling

Scope: analysis only. This run is preparatory because todo 4 overlaps T3/T5 shared files
(oracle literals, Pack manifest, DECISIONS.md). No product file was edited, staged, or
committed. The skills `sdp-agent-surface` and `sdp-authoring` were loaded before any query or
evaluation.

The ruling under test is the ruled placement map in `.omo/plans/briefs-index-into-spec-relations.md`
(one ruled home per briefs-index truth type), applied to `spec:consumers.graph-first-planning`
by T2 (commit b610f60). The test is the ADR three-part test curated at
`docs/concept/DECISIONS.md:7`: hard to reverse, surprising without context, a real trade-off.

## Prong 1: hard to reverse

Evidence: the map re-homes the live do-not-reopen register (11 rows at
`plans/36-adoption-tranches-maturation-and-bundle-evidence-briefs.md:201-218`) out of plan
documents into decision Specs and GFP behavior rules, retires the briefs-index shape as a
carrier of law, and (via T6) slims `plans/38-graph-first-planning-arc.md` to a lineage
pointer. T2 already committed nine behavior rules onto the GFP carrier carrying this map.
Reversing means un-minting ratified decision Specs, restoring plan files as the live register
home, and re-opening an answered blocking question. T1's verdict table
(`task-1-register-coverage.md`) confirms 10 of 11 rows already have carriers, so the register
re-home is a corpus restructure, not a note.

Verdict: PASS. Once the register's live home is decision Specs, plan documents stop being
law, and walking that back touches the corpus, the arc plan, and the register's consumers.

## Prong 2: surprising without context

Evidence: the map's own rows show the non-obvious splits. Session law splits three ways
("behavior rules on `spec:consumers.graph-first-planning`, the existing on-ramp handoff rule,
and the thin plan file"). Do-not-reopen rows rule as "`decision`-kind Specs (never
`constraint`)". The E2 placement ruling is classified as a lawful non-decision that stays in
the plan record (`plans/35-agent-surface-adoption-and-self-binding.md:22`), not a Spec.
Independence of work items is recorded as absence of an edge, and scheduling phrases are
never authored. None of this follows from the surface question "where does the briefs index
live"; a reader meeting the outcome without the reasoning would ask why session law is not
one home and why refusals are decision-kind.

Verdict: PASS. The three-way session-law split and the decision-kind-only rule for refusals
are non-obvious rulings a future session could not re-derive from the graph alone.

## Prong 3: real trade-off

Evidence: the refused alternative is minting new relation types (`precedes`, `inArc`,
`forbids`). The current authored vocabulary is closed at six relations, verified live in
`specs/model/relations.sdp.md` (`refines`, `dependsOn`, `constrainedBy`, `decidedBy`,
`verifies`, `supersedes`) and in `src/model/relations.ts:10-12`. A repo-wide grep finds no
`precedes`, `inArc`, or `forbids` anywhere in `specs/`, `docs/concept/`, or the model source;
the agent-surface skill states "A relation name outside this list is a bug in whatever prose
named it". The blast radius of adding one relation is engine work: the closed type list in
`src/model/relations.ts`, the envelope parser, extraction edge derivation, validators (the
`supersedes`-is-decision-only rule at `src/validate/validators.ts:466-479` shows each
relation carries kind laws), the declared-relations oracle roster
(`test/self-hosting-oracle/declared-relations.ts`), and the agent-surface vocabulary docs.
The chosen path keeps scheduling and arc semantics as prose-only truth with no sequencing
authority, accepting that these truths are never machine-checkable; the refused path buys
machine-checkable planning relations at the cost of new engine surface, which the plan's
guardrails forbid in-session ("No new relation type and no engine surface built in-session").

Verdict: PASS. Two genuinely costed options were weighed and one was refused for a stated
blast-radius reason.

## Test outcome

All three prongs pass with cited evidence. Outcome: PASS. The authoring continuation is
authorized to mint `spec:decisions.planning-truths-placement`.

## Proposed decision wording (for the continuation, not authored here)

- context: The briefs index carried dependency maps, decision gates, do-not-reopen rows,
  re-entry triggers, ownership, selection heuristics, and session law with no ruled home in
  the graph.
- decision: Each planning-truth type lives in the ruled home from the placement map:
  dependency truth on `dependsOn` edges or their absence, gates and do-not-reopen rows on
  `decision`-kind Specs with `decidedBy` links, re-entry triggers on blocking open questions
  plus true `dependsOn` preconditions, ownership as one Spec identity, heuristics and session
  law split across GFP behavior rules, the on-ramp handoff rule, and the thin plan file. The
  briefs index shape is retired as a carrier of law.
- refused alternatives: new relation types such as `precedes`, `inArc`, or `forbids`, refused
  because the authored relation vocabulary is closed at six and each new type is engine work
  (model, parser, extraction, validators, oracle rosters, surface docs) for planning prose
  that carries no sequencing authority; a constraint-kind home for refusals, refused because
  refusals are decisions; a single session-law home, refused because GFP forbids owning
  per-session routing (GFP ownership-split rules).
- consequence / reopen path: plans stay thin lineage pointers; reopening requires a later
  `decision`-kind Spec that `supersedes` this one and itself passes the ADR three-part test.
- readiness: state `ready` only with the matching DECISIONS.md row, per MD-26
  (`spec:decisions.decision-readiness-posture`): registry-ratified decision records state
  `ready`.

## Next append-only MD number

MD-32. DECISIONS.md's highest live row is MD-31 (adopted registrars are committed); numbering
is append-only and retired numbers (MD-3, MD-6) are never reused
(`docs/concept/DECISIONS.md:9-10`). The registry row is a one-line gloss with the carrying
Spec link, never plan-status wording (`check-self-hosting-gates.mjs:277-294` forbids it).

## Baseline absence and failing-first desired condition

Baseline (run now, before any authoring):

```sh
pnpm --silent sdp:q 'return g.specContext("spec:decisions.planning-truths-placement")'
```

Output: `sdp q: the body returned nothing — `return` is the output contract.`
`specContext` returns `undefined` for an absent id (`src/reader/reader.ts:263` types it
`SpecContext | undefined`); the wrapped probe returned `{ absent: true, raw: null }`. A
control probe on `spec:decisions.mcp-deferred` returned a full context object with keys
`id, title, specKind, ...`, confirming the absence is real and not a query defect.

Failing-first desired condition (currently fails, must pass after the mint):

```sh
pnpm --silent sdp:q 'const c = g.specContext("spec:decisions.planning-truths-placement"); return { found: c != null, id: c?.id ?? null, hasDecision: !!c?.sections?.decision, decidedByFromGFP: <edge probe> }'
```

Desired post-mint result: `found: true`, the decision section present and complete to the
shape `src/validate/readiness-floor.ts:384-391` requires, and the `decidedBy` edge from
`spec:consumers.graph-first-planning` resolving.

## Exact product files the authoring continuation must touch

1. `specs/decisions/planning-truths-placement.sdp.md` (new, minted via `sdp new spec`,
   decision section completed).
2. `specs/consumers/graph-first-planning.sdp.md` (add the `decidedBy` edge to the frontmatter
   relations; no prose or readiness change).
3. `specs/self-hosting.pack.sdp.md` (add the new id to the Pack manifest).
4. `docs/concept/DECISIONS.md` (append the MD-32 row, one-line gloss plus Spec link).
5. `test/self-hosting-graph.test.ts` literals (`:142-196`: spec count 159 to 160, pack
   members, nodes, edges, declared-relations roster, readiness histogram).
6. `test/self-hosting-oracle/decisions.ts` (family oracle descriptor for the new decision
   Spec).
7. `test/self-hosting-oracle/declared-relations.ts` (the new `decidedBy` edge and any
   `refines` the minted carrier declares).

No engine file under `src/` is touched; no new relation type is created.

## Manual QA

Each prong was re-inspected against the actual ruled map in
`.omo/plans/briefs-index-into-spec-relations.md` and the live registry/vocabulary
(`docs/concept/DECISIONS.md`, `specs/model/relations.sdp.md`, `src/model/relations.ts`).
Every prong has cited evidence above; the pass is unambiguous. QA result: PASS.

## Adversarial probes

- stale_state: all graph claims come from fresh `sdp:q` invocations this run; the baseline
  absence probe ran after T2's commit, so the queried graph is current.
- dirty_worktree: the unrelated uncommitted `AGENTS.md` unslop hunk and untracked `.omo/`
  files are present and untouched; this run wrote only this evidence file and staged nothing
  (verified: no product edits made).
- misleading_success_output: the absence verdict rests on the `undefined` return contract of
  `specContext` plus a positive control on a known id, not on the CLI's exit code or its
  "returned nothing" message alone.
- Not applicable: malformed input, prompt injection, cancel/resume, flaky timing, repeated
  interruption. All probes are bounded local queries.

## Cleanup

None. No processes or resources left running.

## Risks for the continuation

- GFP is `idea`-rung; adding `decidedBy` from it is lawful per the plan, but the continuation
  must confirm validators raise no kind law on the edge direction.
- Oracle literal drift: T3 (if it mints row 6) and T4 both move counts; whichever lands
  second must re-measure, not inherit, per the session-law rule.
- MD-32 must not be reused if T3's row-6 mint takes it first; re-read DECISIONS.md at author
  time.

---

# Authoring continuation record (settled tree, post-T3)

T3 landed as commit 057019f. Re-measured live before editing: MD-32 occupied by
shipped-projections, so the row is MD-33; 160 specs, 318 nodes, 672 edges; the target id was
re-confirmed absent (`specContext` returns `undefined`, same probe as the baseline above).

## Edits made

- Minted `specs/decisions/planning-truths-placement.sdp.md` via `sdp new spec`, then completed
  the decision section (context / decision / rationale / consequence) carrying the ruled
  placement map, the refused `precedes`/`inArc`/`forbids` alternatives with the blast-radius
  rationale, the refused `constraint`-kind and single-session-law-home alternatives, and the
  superseding-decision reopen path. Readiness `ready` with the MD-33 row, per MD-26.
- `refines: spec:model.relations`: the first attempt refined GFP, but the `ready` floor clause
  "depends-on-and-refines-targets-are-defined" refuses an `idea`-rung refines target
  (validate error, fixed by re-pointing the parent at the closed relation vocabulary the
  decision applies).
- `specs/consumers/graph-first-planning.sdp.md`: frontmatter gained
  `decidedBy: spec:decisions.planning-truths-placement` beside the existing `refines`; no
  prose, Q2, or readiness change.
- `specs/self-hosting.pack.sdp.md`: new id appended after shipped-projections-frozen.
- `docs/concept/DECISIONS.md`: MD-33 row, one-line gloss with the carrying Spec link.
- Oracle sync from the live corpus: `test/self-hosting-graph.test.ts` (161 specs/pack
  members, 319 nodes, 675 edges, ready histogram 145); `test/self-hosting-oracle/decisions.ts`
  (descriptor pasted from the live `specContext` extraction); `declared-relations.ts` (the
  `decidedBy` and `refines` edges); `pack-members.ts` (the new id).

Not touched: CONTEXT.md, AGENTS.md, plans 29-37, src/, Q2 content, pre-existing readiness.

## Verification

- `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude
  test/fixtures/import/parity`: exit 0, 0 errors, 5 pre-existing intentional warnings,
  161 specs / 319 nodes / 675 edges.
- Live `specContext("spec:decisions.planning-truths-placement")`: `found: true`, kind
  `decision`, readiness `ready`, decision keys `context, decision, rationale, consequences`,
  `decidedBy` from GFP resolving, `refines` to `spec:model.relations` resolving, Pack
  membership edge resolving.
- Recipe 1 (body copied verbatim from `docs/agent-surface/recipes.md:80`): `total: 0`, no new
  backlog rows; the new decision appears only in `excludedReadyDecisions` (33), as MD-26
  intends.
- `npx vitest run test/self-hosting`: 110 tests passed (includes the graph literals, family
  oracle descriptors, and declared-relations roster).
- `npx vitest run test/self-hosting-graph.test.ts test/self-hosting-consumers-oracle.test.ts`:
  27 passed, confirming the GFP carrier (with its new frontmatter edge) still matches the
  consumers oracle.

## Manual QA (live specContext fields and resolved relations)

PASS decided from the asserted JSON above: `found`, `kind`, `readiness`, the four decision
keys, and all three resolving edges. Unambiguous.

## Adversarial probes (continuation)

- stale_state: every count and oracle literal was re-measured from fresh `sdp:q` runs on the
  settled tree, not inherited from T3's evidence.
- dirty_worktree: the AGENTS.md unslop hunk and `.omo/` files remain unstaged; nothing was
  staged or committed in this run.
- generated/cached pins: oracle literals and the decisions.ts descriptor were pasted from
  live extraction output, then verified by running the oracle tests against the derived graph
  (110 passed); no pin certifies itself.
- misleading_success_output: PASS rests on asserted fields and test counts, not exit codes
  alone; the one red gate (below) is reported, not smoothed over.
- Not applicable: malformed input, prompt injection, cancel/resume, flaky timing, repeated
  interruption.

## Pre-existing failure found (not caused by this task)

`node check-self-hosting-gates.mjs` exits 1 on `check-temporal`: the banned temporal token is
in T3's shipped string "plans/34 into plans/36" at
`specs/decisions/shipped-projections-frozen.sdp.md:15` and its mirror at
`test/self-hosting-oracle/decisions.ts:918`. Confirmed pre-existing by stashing this task's
edits and re-running the gate on the bare settled tree (still exit 1). Left untouched; T7 or a
T3 follow-up owns the fix.

## Cleanup

None. No processes left running. Nothing staged or committed; landing is pending independent
verification.
