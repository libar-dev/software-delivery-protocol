# Pre-merge expansion of PR #3 — completing the competition spec before the carrier PRs cut

## Context

PR #3 (`feature/anchors` → `main`) carries the MVP, the executable-spec exploration, and the
plan-13 machinery; plan 14 (DRAFTED) is the standing operational plan for the four-carrier
competition. An external review of the exploration's coverage found the format space genuinely
well covered — **the four competitors stand as-is; no fifth PR is warranted** — but identified a
small set of gaps worth patching *before* merge, so the four carrier PRs bind against a settled,
complete competition spec instead of one that shifts under them:

- Two scorecard axes missing from FINDINGS §4 / plan 14 §2: **diff/merge ergonomics** (PR review
  is the org's daily surface) and **agent read-back token cost** (agents load specs into context
  constantly, not just emit them). Both likely favor F2 — which is exactly why they must be *on*
  the recorded scorecard, not implicit.
- The **minimum-ceremony `idea` spec** judged explicitly (the highest-volume authoring event —
  settlement 9's draft-example affordance emits these), the **CLI-feedback exhibit** extended
  from C2-only to all four carriers, and the **effort asymmetry** (F2/C2 full bar;
  Gherkin/typed-markup timeboxed, CLOSED.md as primary deliverable) made explicit.
- The **kind-partitioned dual carrier** (markdown for prose-natured kinds, TS DSL canonical
  forever for `contract`/`model`, per-ID canonical-surface config per `04` §1) named as a
  *candidate ruling* in the §4 docket — today it appears only as a C2 *cost*, and an unnamed
  outcome can't be fairly ruled.
- The dominated/law-excluded directions (pure-data carriers, colocated specs, alternative
  dialects, notebooks, projection editing) **dismissed by name** in the record, so the ruling
  session dismisses them explicitly rather than by omission.
- One orthogonal DX spike: **type-level template-literal parsing of the slot notation** in the
  TS DSL — worthwhile regardless of which carrier wins, and a hedge for the dual-carrier outcome.
- Plan 14 §1's branch layout repaired to **branch from `main` post-merge** (drift repair — the
  merge-first sequencing already agreed makes the `feature/anchors` layout and its auto-retarget
  reliance obsolete; exhibits then bind against fixed machinery and each carrier PR diffs clean).

The working tree is clean; the review-session hardening landed as `143739f`. Everything below is
additive to `feature/anchors` before merge. User ratified all three work packages.

## Work items

### 1. Plan-14 amendments (`plans/14-carrier-competition.md`) — doc-only

- **§1 branch layout:** replace the four `git worktree add … feature/anchors` commands with
  `… main` and rewrite the lead sentence: branch from `main` *after PR #3 merges* (the exhibits
  need plan 13's machinery, which merge delivers); drop the auto-retarget clause. Add the
  sequencing line: update PR body → merge PR #3 → cut the four worktrees.
- **§1 suggested order → explicit effort asymmetry:** F2 and C2 get the full exhibit bar;
  Gherkin-fork and typed-markup are **timeboxed to one short session each** whose *primary*
  deliverable is the honest CLOSED.md, the exhibit attempted only if the session finds a genuine
  escape from the standing reduction/settlement early.
- **§2 exhibit bar, deliverable 4 (SCORECARD.md):** extend the axis list with
  **diff/merge ergonomics** (how a step rename / frontmatter change reads in a diff; how
  concurrent sibling-example edits merge) · **agent read-back token cost** (the ~⅕-tokens
  playground finding cuts both ways) · **minimum-ceremony `idea` spec** (the arc's `01-idea`
  snapshot judged on "how little ceremony does the minimum honest spec require?").
- **§2 new cross-carrier deliverable (or fold into the bar's #4):** the **CLI-feedback sketch**
  for every carrier, not just C2 — what a typo'd envelope reports verbatim under the one-line
  diagnostic law (mock transcript in the `1-grammar/DIAGNOSTICS.txt` style; committed verbatim
  per the house rules).
- **§3 postures:** restate Gherkin/typed-markup postures to match the timebox ruling above.
- **§4 docket:** under the dual-source / TS-DSL-long-term-role item, name the
  **kind-partitioned dual carrier** as a first-class candidate ruling (winner-carrier for the
  six prose-natured kinds; TS DSL canonical for `contract`/`model`; lawful via the designed-in
  per-ID canonical-surface config, `docs/concept/04` §1) — exhibit-bar deliverable 2 generates
  exactly the evidence it needs. Add one docket line: the dismissed directions (FINDINGS
  addendum, item 2 below) are **dismissed by name** at the ruling.

None of this passes the ADR three-part test — it is competition-spec completion + drift repair;
paper trail is git + this plan. No DECISIONS.md entry.

### 2. FINDINGS amendments (`explorations/executable-examples/FINDINGS.md`)

- **§4 table:** add the two new axis rows (**diff/merge ergonomics** · **read-back token cost**),
  scored for the four existing columns, under a dated one-line note that the rows were added at
  the pre-competition review (the record stays honest about when it learned what). Plan 14 §2
  says "self-scored row against the FINDINGS §4 axes," so the axes must live here — plan and
  record stay consistent.
- **New addendum section — "Directions dismissed by name":** one sentence each, with the
  dominating evidence or excluding law:
  - *Pure-data carriers* (YAML/JSON/TOML/CUE whole-spec files): kills prose — the gen-1
    truncated-docstrings lesson; the envelope already lives in frontmatter. CUE noted as the only
    interesting member (schema+data unification) but a foreign toolchain with near-zero agent
    training distribution.
  - *Colocated specs* (doctest-style, beside implementation): violates the intent/implementation
    split (JS-B1.4); collapses the anchor design.
  - *Alternative document dialects* (AsciiDoc, org-mode, Djot, Typst): each loses markdown's
    decisive property — the deepest agent training distribution — while adding ownership or
    rendering cost; the F2 argument transfers wholesale.
  - *Notebook formats* (.ipynb, MyST): JSON carrier is diff- and agent-hostile; "executable
    cells" is already answered better by the A2 seam (execution lives runner-side, below the
    anchor).
  - *Projection/structured editing* (spec stored as graph, edited via views): contradicts
    git-is-the-event-log and text-first authoring; it is the aspirational Studio, not a carrier.
- **§5:** one clause added to "The TS DSL's long-term role" naming the kind-partitioned
  affirmative candidate (cross-reference the plan-14 §4 docket entry).

House rules bind: ratified vocabulary end-to-end, no gen-1 product name (say "the gen-1
evidence" / "prior art," as FINDINGS already does).

### 3. The template-literal spike (`explorations/executable-examples/7-typelevel-slots/`)

New micro-exhibit, same shape as `4-seam/`: exhibit files + own `tsconfig.json` + committed
`TSC-OUTPUT.txt` + a short README.

- **What it shows:** TypeScript template-literal types parsing the ratified slot notation *at
  the type level* — `"Given a cart with {n:number} line items"` yields `{ n: number }` as-you-type
  — so a mini declare-space/bind-point surface (mirroring the real DSL's shape, not importing
  `src/`) gives editor-time vocabulary checking with zero codegen and zero new authoring surface.
- **Drift cases captured verbatim in `TSC-OUTPUT.txt`:** unknown slot name in a child's bound
  point · wrong value type (`{n: "2"}`) · parent-side slot rename reddening the child binding.
- **README states the law boundary explicitly:** editor-time DX only — the graph's truth still
  comes from extraction (the typing law / one-validation-path, MD-14, is *not* touched: nothing
  here is evaluated into the graph). Orthogonal to the carrier ruling; it hedges the
  kind-partitioned outcome where engineers keep living in the TS DSL for structure-heavy kinds.
- `explorations/` is exempt from every toolchain gate, so no allowlist changes; the spike's own
  tsconfig is the proof harness, exactly like `4-seam` and `5-harness`.

### 4. PR #3 body update (`gh pr edit 3`)

One short paragraph appended to Part 3 (or the exploration section): the pre-merge expansion —
the two scorecard axes, the minimum-ceremony and CLI-feedback additions to the bar, the
dismissed-by-name record, the named dual-carrier candidate, the branch-from-`main` repair, and
the `7-typelevel-slots` spike — so the PR description stays the accurate record of the branch.

### 5. Recorded sequencing (stated in plan 14, executed after this lands)

commit the above → update PR body → **merge PR #3** → cut the four carrier worktrees from
`main` per the repaired §1.

## Critical files

- `plans/14-carrier-competition.md` — amendments in item 1
- `explorations/executable-examples/FINDINGS.md` — §4 rows, dismissed-by-name addendum, §5 clause
- `explorations/executable-examples/7-typelevel-slots/` — new: `README.md`, exhibit `.ts` files,
  `tsconfig.json`, `TSC-OUTPUT.txt`
- PR #3 body via `gh pr edit`

Reusable prior art in-repo: `4-seam/` and `5-harness/` (the exhibit + captured-transcript
pattern, incl. `tsconfig.json` shape and `TSC-OUTPUT.txt` convention); `1-grammar/DIAGNOSTICS.txt`
(the mock-CLI-transcript style the cross-carrier CLI-feedback deliverable generalizes);
`src/notation/` (the slot grammar the type-level parser must mirror — read, never import).

## Verification

- `npm run check` stays green (items 1–2 are docs; item 3 is toolchain-exempt).
- `npx tsc -p explorations/executable-examples/7-typelevel-slots` — the happy-path exhibit
  compiles clean; each drift case re-run (via the `after-edit` twin-file pattern from `4-seam`,
  or `@ts-expect-error`-free demo files) reproduces the captured `TSC-OUTPUT.txt` verbatim.
- Grep the amended docs for house-rule violations: no gen-1 product name, no unratified terms
  outside the flagged set, plan 14's §2 axis list and FINDINGS §4 rows byte-consistent.
- `gh pr view 3` renders the updated body; plan 14 §1's worktree commands reference `main`.
