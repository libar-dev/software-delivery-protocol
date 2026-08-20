# Todo 3 register mint

## T1 verdicts consumed

`task-1-register-coverage.md` verdict table: rows 1-5, 8, 9, 11 CONFIRMED; row 7 HOLD; row 10
NON-DECISION; row 6 alone UNHOMED (`spec:consumers.projections-model` carries projection law but
no refusal for re-specifying the shipped Design Review, census, Mermaid, or Gherkin projections).
Exactly one mint was therefore lawful: `spec:decisions.shipped-projections-frozen` for row 6. No
Spec was minted for rows 7, 10, or 11, and no duplicate was minted for any confirmed row.

## Baseline (before edits)

- `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
  exited 0: `159 specs · 1 packs · 157 anchors → 317 nodes · 666 edges (0 errors, 0 warnings)`
  plus the five standing honesty/gaps warnings; final line `validate: 0 errors · 5 warnings`.
- Failing-first probe (desired behavior absent):
  `pnpm --silent sdp:q 'const context = g.specContext("spec:decisions.shipped-projections-frozen"); return context === undefined ? { id: "spec:decisions.shipped-projections-frozen", found: false } : { id: context.id, found: true };' --json`
  returned `{"id":"spec:decisions.shipped-projections-frozen","found":false}`.
- Recipe 1 baseline: `total: 0`, `excludedReadyExamples: 66`, `excludedReadyDecisions: 31`,
  `excludedWithoutVerifier: []`.
- `g.findByConcept("Design Review")` (from T1) plus a fresh `g.specContext` probe confirmed all
  four `decidedBy` candidates (`spec:consumers.design-review`, `spec:consumers.census-page`,
  `spec:consumers.mermaid-view`, `spec:consumers.gherkin-view`) resolve before any edge was added.

## Mints made

One, via the lawful scaffolder then hand completion:

```sh
npm run --silent sdp -- new spec specs/decisions/shipped-projections-frozen.sdp.md \
  --id spec:decisions.shipped-projections-frozen --kind decision --altitude feature \
  --title "The shipped projections stay frozen" \
  --outcome "Keep the shipped Design Review, census, Mermaid, and Gherkin projections as the ruled read surfaces so re-specifying them never re-enters a plan."
```

The carrier was then completed by hand: decision kind only; the decision section carries context,
decision (the refusal: no re-specifying the shipped Design Review, census, Mermaid, or Gherkin
projections; reopen only by a later decision Spec that `supersedes` this one and passes the ADR
three-part test), rationale, and consequence, per the shape `src/validate/readiness-floor.ts:384-391`
requires. Lineage is recorded in the context field (the register carried forward from plans/34 into
plans/36, the shipped-projections row). Readiness is stated `ready` with the matching append-only
registry row MD-32 in `docs/concept/DECISIONS.md` (MD-26 posture). `refines:
spec:consumers.projections-model` mirrors the deferral-decision shape model
(`specs/decisions/mcp-deferred.sdp.md`). `decidedBy: spec:decisions.shipped-projections-frozen` was
added to the four verified subject Specs (the only subjects the refusal binds). No `supersedes`
edge was added; nothing supersedes or is superseded. No historical plan (29-37) was edited
(`git diff --name-only -- plans/` is empty).

Pack membership: `spec:decisions.shipped-projections-frozen` appended to the manifest in
`specs/self-hosting.pack.sdp.md`.

Oracle surfaces synced: `test/self-hosting-graph.test.ts` literals (specs 160, expectedSpecs 160,
expectedPackMembers 160, anchors 157 unchanged, nodes 318, edges 672, readiness histogram
`{ defined: 9, idea: 6, ready: 144, scoped: 1 }`); `test/self-hosting-oracle/decisions.ts` gained
the new descriptor; `test/self-hosting-oracle/pack-members.ts` gained the id in manifest order;
`test/self-hosting-oracle/declared-relations.ts` gained the one `refines` and four `decidedBy` rows.

## Verification (automated)

- Post-edit validate (same scoped command as baseline): exit 0,
  `160 specs · 1 packs · 157 anchors → 318 nodes · 672 edges (0 errors, 0 warnings)`, same five
  standing warnings, no new warning for the ready decision (MD-26 exclusion holds).
- `pnpm --silent sdp:q 'return g.specContext("spec:decisions.shipped-projections-frozen")' --json`
  returned `found` with `statedReadiness: "ready"`, `derivedReadiness: "ready"`,
  `packs: ["pack:self-hosting-v1"]`, a complete decision section (context, decision, rationale,
  consequences), `floorFailures: []`, the `refines` edge out, and four resolved `decidedBy` edges
  in. (Full JSON inspected during the session.)
- Recipe 1 post-edit, exact catalog body: `total: 0`, `byFamily: {}`,
  `excludedReadyExamples: 66`, `excludedReadyDecisions: 32` (was 31; the new ready decision is
  counted as excluded, not as backlog), `excludedWithoutVerifier: []`. No new operational backlog
  row.
- `npx vitest run test/self-hosting-graph.test.ts`: 26/26 passed.
- `npm test` (after `npm run --silent generate:self-hosting`, the documented generation step the
  `check` script runs before tests): exit 0; 62 files, 839 passed / 1 skipped, plus the cli suite
  80/80. Note: a standalone `npm test` without the generation step fails in `test/cli.test.ts` on
  the missing `generated/design-review` tree; that is pre-existing harness behavior (the `check`
  script orders generation first), not a regression from this task.

## Manual QA

Live `specContext` JSON (quoted above in summary form) shows found:true, the complete decision
section, Pack membership, and all five relations resolved. Recipe 1 added no operational backlog
row; the only delta is `excludedReadyDecisions` 31 to 32, the intended MD-26 accounting.

## Adversarial probes

- stale_state: every post-edit query ran through `sdp:q`, which derives the graph in process on
  each invocation; the specContext, recipe 1, and assertion probes all read a fresh graph built
  after the edits.
- dirty_worktree: the pre-existing `AGENTS.md` modification and the untracked
  `.omo/drafts/briefs-index-into-spec-relations.md` and `.omo/plans/briefs-index-into-spec-relations.md`
  are untouched; `git status --porcelain` confirms they remain as found. Nothing was staged or
  committed.
- generated_or_cached_artifacts: live post-edit counts (160 specs, 318 nodes, 672 edges, ready
  144) equal the updated oracle literals; the self-hosting graph test comparing derived against
  authored passes 26/26.
- misleading_success_output: verification asserted exact fields and counts (kind, readiness rungs,
  pack list, relation endpoints, decision-section keys, graph totals), not exit codes. One probe
  comparator reported `pass: false` on `decisionFields` purely because the probe sorted the actual
  key list but not the expected list; the actual keys are exactly
  `[consequences, context, decision, rationale]`, the complete required set, confirmed by the full
  specContext JSON.

## Not applicable, with reasons

- malformed input / injection: all inputs were fixed ids and catalog recipe bodies authored in
  session; no external or untrusted input reached any surface.
- cancel/resume, repeated interruption: the task ran to completion in one pass; no resume path
  was exercised.
- timing/flaky: every check is a deterministic graph derivation or a single vitest run; no
  time-based behavior exists on this surface.

## Cleanup

None. No processes left running, no temporary files created; `generated/` outputs are the normal
ignored build products of the documented validate/generate commands.

## Risks

- T6 must point plan 38 at `spec:decisions.shipped-projections-frozen` as the register's row-6
  home; this task deliberately did not edit plan 38.
- The oracle pins now encode 160/318/672 and ready 144; any later Wave-2 mint (T4) must move the
  same literals again in its own change.
