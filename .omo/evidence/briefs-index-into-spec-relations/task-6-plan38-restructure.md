# Task 6: plan 38 restructure to the ruled thin-pointer shape

> Revision 2 (verifier fix): independent verifier st_01a02029 returned needs-fix on one false
> H-trigger pointer. The original register bullet in plan 38 claimed the three named H deferral
> triggers are recorded on `spec:consumers.graph-first-planning`; that overstatement is
> WITHDRAWN. The verified split from T1 is now stated: `spec:decisions.mcp-deferred` carries
> E3; the named H triggers (Spec Studio, reference projection, structural-edge Mermaid) remain
> historical evidence in the plan 35 record and are explicitly not live do-not-reopen law; GFP
> carries only the generic re-entry-trigger placement rule. Because the bullet now marks the H
> triggers as historical rather than live, the register section's claim that live refusal law
> lives in graph carriers remains true. Only `plans/38-graph-first-planning-arc.md` and this
> evidence file were edited in the fix; plan 35 and all other files untouched. All checks
> re-run and green (see Revision-2 results below).

Scope: rewrite of `plans/38-graph-first-planning-arc.md` body only, plus this evidence file.
Nothing staged or committed. Skills loaded before editing: `sdp-agent-surface` (query contract),
`unslop` (prose rules). `sdp-authoring` was not needed: no Spec citation beyond ids already
verified by T1-T4 evidence was required, and no `.sdp.md` file was edited.

## Baseline (pre-edit) outline

Captured verbatim in `task-6-baseline.txt`:

```
1:# Plan 38 — the graph-first planning arc (pilot)
3:> **Status:** 🧭 DRAFTED — a thin lineage pointer, deliberately not a briefs index. This arc
9:## Why this arc
16:## The arc's intent lives here (re-measure with recipe 11, never inherit)
39:## Discipline (unchanged)
```

## Failing-first proof (real surface, pre-edit)

The pre-edit body carried narrative and briefs-index machinery beyond the four retained truths.
Each pattern below was asserted PRESENT before the edit (see `task-6-baseline.txt`) and ABSENT
after it:

| Pattern | Pre-edit location | Why it is not a retained truth |
| --- | --- | --- |
| `re-measure with recipe 11` | heading line 16 | recipe citation is graph-reading session law, not a plan truth |
| `the standing` (do-not-reopen allusion) | line 33 | narrative allusion to the register instead of a home pointer |
| `PRs #22` | line 14 | merge-history narrative, not lineage why |
| `derived floor` | line 30 | authored readiness/sequencing state, which only the graph may carry |
| `recorded blocker is narrow` | line 36 | per-Spec drift narrative, lives on the Spec not the plan |
| `recipe 11 is current` | line 28 | staleness machinery, not a retained truth |

## What the rewrite did

Kept byte-identical: the title line and the DRAFTED status header's first line (verified by
`diff` of lines 1 and 3 against `git show HEAD:`, result IDENTICAL). The full status header
block, which already carries the graph-wins stance, is unchanged. The body now carries exactly
the four retained truths plus the register-home pointer:

1. Authority stance (graph wins on disagreement): `## Authority`.
2. Lineage why: `## Why this arc`.
3. Intent Spec pointers: `## The arc's intent lives in the graph`, including the landed
   `spec:decisions.planning-truths-placement` (T4) and `spec:decisions.shipped-projections-frozen`
   (T3).
4. Discipline restatement: `## Discipline (unchanged)`.
5. Register-home pointer: `## The do-not-reopen register lives in the graph`, naming every
   linked carrier/decision Spec from the plan row map and stating plans 36/37 keep their
   historical text untouched.

No Q2 evidence and no escape-hatch retention was needed: every required truth fit the ruled
homes. Plan 38 names nothing as authorizing, blocking, or sequencing work; the discipline
section is a restatement of standing practice, not a gate.

## Automated checks (exact commands and results)

- `diff <(git show HEAD:plans/38-... | sed -n '1p;3p') <(sed -n '1p;3p' plans/38-...)`:
  IDENTICAL (title and status first line preserved).
- Outline assertion (`grep -n '^#\|^> \*\*Status'`): exactly five body sections, the four
  retained truths plus the register pointer; no gate table, dependency map, leave-behind
  checklist, or briefs index.
- Forbidden-pattern assertions: all nine patterns above plus `Gate`, `leave-behind`,
  `depends on plan` ABSENT. Required-pointer assertions: all eleven (both minted decision
  Specs, all linked carriers, the 36/37-untouched sentence, `the graph wins`) PRESENT.
- `git diff --check -- plans/38-graph-first-planning-arc.md`: CLEAN.
- `npm run check:self-hosting-gates`: exit 0. The known T3 temporal-token failure did NOT
  appear in this run (no fail/error/finding lines; only the DRAFTED status echo for plan 38
  and the AGENTS.md path echo). Nothing T3-related was touched; the independent verifier can
  rerun after the sibling worker lands.
- Em-dash audit of the new body (lines 9+): none; the only em dashes are in the preserved
  title and status header, which the task requires byte-identical.

## Manual QA: retained-truth map (read of the final rendered Markdown)

| Retained element | Exact location |
| --- | --- |
| 1. Authority stance (graph wins) | `## Authority`, sole paragraph; restated by the status header line 3-7 |
| 2. Lineage why | `## Why this arc`, sole paragraph |
| 3. Intent Spec pointers | `## The arc's intent lives in the graph`, both bullet lists and the closing line |
| 4. Discipline restatement | `## Discipline (unchanged)`, sole paragraph |
| 5. Register-home pointer | `## The do-not-reopen register lives in the graph`, nine bullets plus the reopen-path/36-37 paragraph |

PASS: no other machinery remains. Every section maps to exactly one retained truth or the
register pointer; no dependency map, gate table, leave-behind checklist, or briefs index exists.

## Adversarial probes

- stale_state: the register pointer uses the landed T3/T4 ids
  (`spec:decisions.shipped-projections-frozen`, `spec:decisions.planning-truths-placement`),
  verified present on disk (`specs/decisions/*.sdp.md`) and in the T3/T4 evidence before
  writing; the assertions ran against the current plan body, not a cached outline.
- dirty_worktree: `git status --porcelain` after the edit shows my changes are exactly
  `plans/38-graph-first-planning-arc.md` and this evidence directory. The pre-existing
  modifications (`AGENTS.md` unslop hunk, `.omo/boulder.json`, `.omo/start-work/ledger.jsonl`,
  and the sibling's `specs/decisions/shipped-projections-frozen.sdp.md` /
  `test/self-hosting-oracle/decisions.ts`) are byte-untouched by this task; they appear in the
  initial status captured before any edit. `git diff --name-only -- plans/29* plans/3[0-7]*`
  is empty: plans 29-37 untouched.
- misleading_success_output: verification asserted the exact outline, the preserved header
  bytes, forbidden-pattern absence, and required-pointer presence; the gate's exit 0 is
  corroborated by the absence of any fail/finding line, not taken alone.
- repeated_interruptions: not applicable; the task ran in one uninterrupted pass.

## Not applicable, with reasons

- malformed input / parser: prose-only edit of one Markdown file; no parser surface.
- injection: no untrusted input reached any surface; all Spec ids came from the execution
  plan's own row map.
- timing/flaky: all checks are deterministic greps, diffs, and one gate run; no time-based
  behavior.

## Cleanup

None. No processes left running, no temporary files inside the repo (`/tmp/t6-gates.txt` is
outside the tree).

## Risks

- T7's full `npm run check` and oracle sync verification still run after this; if the sibling
  T3 temporal-token fix changes corpus counts, T7 owns the pin sync.
- The evidence commits ride with T7 per the execution plan; this file is untracked until then.

landing_pending: true

## Revision-2 check results (after the verifier fix)

- `diff <(git show HEAD:plans/38-... | sed -n '1p;3p') <(sed -n '1p;3p' plans/38-...)`:
  IDENTICAL (title and status first line still preserved).
- Outline: unchanged five-section shape (Authority / Why / intent pointers / register pointer /
  Discipline).
- Old overstatement wording (`the three H deferral` recorded-on-GFP claim): ABSENT. Corrected
  phrases PRESENT: `remain historical evidence in the plan 35 record`, `not live`,
  `generic re-entry-trigger placement`.
- Forbidden-pattern assertions: all nine still ABSENT. Required-pointer assertions: all eleven
  still PRESENT.
- `git diff --check -- plans/38-graph-first-planning-arc.md`: CLEAN.
- `npm run check:self-hosting-gates`: exit 0, zero fail/error/finding lines in output.
- Em-dash audit of body (lines 9+): none.
- `git status --porcelain`: my changes remain exactly plan 38 plus this evidence directory;
  the pre-existing AGENTS.md, .omo state, and sibling modifications are untouched; plans 29-37
  diff is empty.
- Manual QA re-read of the final rendered Markdown: the retained-truth map above still holds;
  the register-pointer section now maps rows to carriers with the corrected H-trigger
  classification, and no section carries anything beyond the four retained truths plus the
  register pointer. PASS.

## Revision 3 (F2 fix): three corrections to the plan 38 body

> F2 review rejected the revision-2 body on three findings. Failing-first proof is that
> rejection: the pre-fix body carried the universal-supersession reopen claim, the
> sequencing phrase `expected to be worked this arc`, and the pointer that named the three
> H triggers as only historical in plan 35 with GFP carrying only the generic re-entry rule.
> Each is asserted ABSENT post-fix below. Skills loaded before editing: `unslop`
> (`~/.agents/skills/unslop`) and the graph skill `sdp-agent-surface` (query contract,
> recipes 1/9/11 stance). Only `plans/38-graph-first-planning-arc.md` body text and this
> evidence file were edited. Nothing staged or committed. Carriers under sibling edit
> (`specs/decisions/planning-truths-placement.sdp.md`,
> `specs/decisions/shipped-projections-frozen.sdp.md`,
> `test/self-hosting-oracle/decisions.ts`) were not touched.

### The three corrections

1. Universal-supersession claim replaced by the lawful split. Old: `Reopening any row is a
   later decision Spec that supersedes the carrier and passes the ADR three-part test.` New:
   reopening follows the home's kind: `supersedes` only for decision-kind homes (ADR
   three-part test), behavior carriers change through ordinary Spec revision, holds stay
   blocking until the open question is answered, lawful non-decisions remain plan evidence.
2. Sequencing/authorization phrasing removed. `Already in the graph and expected to be worked
   this arc:` became `Already in the graph:`, and the closing line now states these graph
   facts are advisory selection pressure, not authorization and not a sequence.
3. H-trigger pointer corrected. The three named H deferral triggers (Spec Studio, reference
   projection, structural-edge Mermaid) are now pointed at
   `spec:consumers.graph-first-planning`'s re-entry prose instead of being called only
   historical in plan 35; plan 35 remains untouched historical evidence.

Preserved: the title and DRAFTED status header byte-identical, the four retained truths plus
the register pointer, both new decision ids (`planning-truths-placement`,
`shipped-projections-frozen`), the plans-36/37-untouched sentence, and no machinery added.

### Revision-3 check results (current tree)

- `diff <(git show HEAD:plans/38-... | sed -n '1p;3p') <(sed -n '1p;3p' plans/38-...)`:
  IDENTICAL (title and status first line byte-preserved).
- Outline: unchanged five-section shape (Authority / Why / intent pointers / register pointer
  / Discipline).
- Forbidden/stale phrasing ABSENT: `Reopening any row`, `supersedes\` the carrier`,
  `expected to be worked`, `remain historical evidence in the plan 35 record`,
  `only the generic re-entry-trigger`, plus the nine revision-1 patterns and `Gate`,
  `leave-behind`, `depends on plan`.
- Required pointers PRESENT: both minted decision Specs, all linked carriers, GFP
  `re-entry prose`, `advisory selection pressure`, `lawful non-decision`, the 36/37-untouched
  sentence (verified across the line wrap via `tr`), `the graph wins`.
- `git diff --check -- plans/38-graph-first-planning-arc.md`: CLEAN.
- `npm run check:self-hosting-gates`: exit 0 on the current tree, zero fail/error/finding
  lines (full output `/tmp/f2-gates.txt`, outside the repo).
- Em-dash audit of body (lines 9+): none; em dashes only in the preserved title and status
  header.
- Manual section mapping re-read of the final rendered Markdown: Authority maps to truth 1,
  Why to truth 2, intent pointers to truth 3, Discipline to truth 4, register section to the
  pointer; nothing else present. PASS.

### Adversarial probes (revision 3)

- stale_state: assertions ran against the file as edited on the current tree, not a cached
  outline; the sibling's carrier edits landed mid-session and the register bullet text was
  written to name GFP's re-entry prose without asserting carrier internals.
- dirty_worktree: `git status --porcelain` post-edit shows my changes as exactly plan 38 and
  this evidence file; pre-existing sibling modifications (`AGENTS.md`, both decision Specs,
  `test/self-hosting-oracle/decisions.ts`) untouched; `git diff --name-only` over plans 29-37
  is empty.
- misleading_success_output: the gate's exit 0 is corroborated by the explicit grep for
  fail/error/finding lines returning nothing, not taken alone.

Cleanup: none. No processes left running, no temporary files inside the repo.

landing_pending: true
