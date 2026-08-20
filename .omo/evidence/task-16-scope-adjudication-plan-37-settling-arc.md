# Plan 37 Todo 16 scope adjudication

Date: 2026-08-20
Baseline: `7b99baa` with the executor's uncommitted Todo 16 work preserved.

## Verdict

`PLAN_AMENDMENT_REQUIRED`

The five owner-ratified readiness statements are lawful. The two stale expected values are not
lawfully editable under the current plan. Plan 37 explicitly freezes the corpus count pins and says
J lanes never touch test suites. Ratification settles which Specs may state `ready`; it does not
silently repeal those file boundaries.

This is a plan defect, not a defect in the five promotions. Reverting the promotions would contradict
the owner checkpoint and Brief J's success criterion. Updating the two exact expectations is the
right technical change, but the owner must first grant a narrow exception.

## Binding scope and the contradiction

- `.omo/plans/plan-37-settling-arc.md:27` requires prepared readiness changes and matching oracle
  descriptor updates. Lines 51-52 place application after the owner checkpoint.
- Lines 33-36 forbid validator/floor/check changes, freeze "the corpus count pins" in
  `test/self-hosting-graph.test.ts`, and say J lanes never touch test suites.
- Todo 16 at line 216 permits only ratified carrier flips and matching family descriptors. It again
  forbids moving the graph-test corpus count pins. Its parenthetical protects node and edge counts,
  but it does not narrow the earlier whole-arc freeze to structural counts only.
- Line 219 says the Todo diff is exactly the ratified carriers and their oracle modules. Line 220
  tells the executor to stop if the focused graph test is red.
- The success criterion at line 269 requires every `ready` statement to be owner-ratified. The
  ratification bundle records the five READY decisions at
  `.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md:31-34,37` and the owner's statement at line
  246.

The test itself calls the readiness literal frozen at
`test/self-hosting-graph.test.ts:188-197`. It is a corpus count pin even though it is not a structural
node/edge pin. The matching-oracle language does cover the family rows already changed in
`carrier.ts`, `extraction.ts`, and `model.ts`; it does not override the explicit freeze on line 197
or authorize `test/self-hosting-oracle/index.ts`.

## Reproduction and derived truth

Fresh focused run:

```text
npx vitest run test/self-hosting-graph.test.ts
Test Files  1 failed (1)
Tests       2 failed | 24 passed (26)
```

The failures are exact and deterministic:

1. `test/self-hosting-graph.test.ts:127-135` receives five findings while
   `test/self-hosting-oracle/index.ts:55` expects `[]`.
2. `test/self-hosting-graph.test.ts:188-197` receives
   `{ defined: 9, idea: 3, ready: 143, scoped: 1 }` while the literal still says
   `{ defined: 14, idea: 3, ready: 138, scoped: 1 }`.

A fresh `pnpm --silent sdp:q` query over `graph.nodes` and `report.findings` returned:

```json
{
  "counts": {
    "specs": 156,
    "packs": 1,
    "anchors": 157,
    "nodes": 314,
    "edges": 660
  },
  "histogram": {
    "ready": 143,
    "defined": 9,
    "idea": 3,
    "scoped": 1
  },
  "warningSubjects": [
    "spec:carrier.markdown-authoring",
    "spec:extraction.claim-taxonomy",
    "spec:model.pack-aggregate",
    "spec:model.relations",
    "spec:model.spec-sections"
  ]
}
```

The structural literals at `test/self-hosting-graph.test.ts:142-147` remain exactly
`156/1/157 -> 314/660`. The histogram is a derived census: lines 188-197 reduce the current
Primitive nodes by authored `node.readiness`. Five `defined -> ready` edits necessarily subtract
five from `defined` and add five to `ready` without changing graph structure.

The same live query returned, for each of the five Specs, stated and derived readiness `ready`,
`deliveryFacts: ["implemented"]`, no verifier bindings, and no floor failures. Recipe 2 returned only
the three intentionally retained DEFINED Specs:

```json
{
  "total": 3,
  "ids": [
    "spec:consumers.projections-model",
    "spec:extraction.regenerability",
    "spec:model.core-model"
  ]
}
```

## Why the five warnings are expected

The authored law says ready Specs without a resolving verifier are warnings, not errors at
`specs/validation/warn-level-signals.sdp.md:13-19`. The implementation at
`src/validate/validators.ts:1183-1210` emits `honesty/gaps` for every ready, non-decision Primitive
without recomputed `has-verifier`. The focused unit contract at `test/validators.test.ts:518-535`
proves that no verifier emits one warning, a resolving verifier removes it, and an authored
`has-verifier` cannot suppress it.

`npm run --silent sdp -- validate ...` reported `0 errors · 5 warnings` and named exactly the five
subjects above. Exit 0 is correct because gaps are informative. It is not evidence that the frozen
self-hosting oracle is current.

## History

- Commit `6556fde` (`spec: promote Gherkin carrier family to ready`) promoted eleven Specs and, in
  the same commit, changed the exact readiness histogram in `test/self-hosting-graph.test.ts` from
  `{ defined: 25, idea: 3, ready: 116, scoped: 1 }` to
  `{ defined: 14, idea: 3, ready: 127, scoped: 1 }`. The family oracle rows changed with it.
- Commit `421233d` (`fix: close plan 31 review findings`), the latest pre-Plan-37 histogram update,
  changed the histogram from `18/3/133/1` to `14/3/138/1` while separately updating structural
  totals. This shows the repository normally maintains the readiness census when authored
  readiness changes.
- Commit `8e961a5` introduced the split oracle and the exact `expectedWarnings` assertion. `git log
  -SexpectedWarnings` shows no later edit to `test/self-hosting-oracle/index.ts`; the self-hosting
  corpus stayed warning-free after that split. There is no later precedent for adding expected gap
  warnings, but current validator law and the live graph make these five warnings non-optional.

History proves the two proposed changes are ordinary expected-output maintenance. It does not grant
permission against Plan 37's explicit freeze.

## Truthful maintenance versus test weakening

After a narrow owner amendment, the smallest truthful update is:

1. Change only `test/self-hosting-graph.test.ts:197` to the exact current histogram
   `{ defined: 9, idea: 3, ready: 143, scoped: 1 }`.
2. Rewrite the now-false comment and `expectedWarnings` value at
   `test/self-hosting-oracle/index.ts:52-55` as an exact five-object array containing
   `validatorId`, `family`, `severity`, and `subjectId` for the five findings in the order shown by
   the focused failure.

Those edits preserve the checks:

- The histogram remains an exact literal. Any future unapproved net readiness change fails it.
- Per-family descriptor equality at `test/self-hosting-graph.test.ts:162-169` still catches a
  per-Spec readiness change, including a balanced swap that leaves the histogram unchanged.
- The warning expectation remains exact. An added, removed, reordered, renamed, or severity-changed
  finding fails the assertion.
- Structural pins at lines 142-147 remain untouched.

Weakening would mean filtering out `honesty/gaps`, asserting only warning count, using partial
containment, deriving the expected array from the report, deleting either assertion, or adding
verifier bindings solely to silence honest warnings. None is allowed. The proposed two-value update
does not weaken validator behavior or test precision.

## Smallest lawful next action

The plan owner should amend only `.omo/plans/plan-37-settling-arc.md:34,36,216,219-220` to grant Todo
16 a one-time exception for `test/self-hosting-graph.test.ts:197` and
`test/self-hosting-oracle/index.ts:52-55`, while explicitly retaining the structural pins at
`test/self-hosting-graph.test.ts:142-147` and every validator/floor/check implementation freeze.

After that amendment is approved, executor `st_01a01dd3` should apply only the two exact
expected-output edits above, run the focused graph test once, then continue Todo 16's existing
checks. Until the amendment exists, it must preserve the current five promotions and make no test
or oracle-index edit.

## Adversarial probes

- `stale_state`: passed. The graph query derives from the current worktree and reproduced the same
  counts, five warnings, and three recipe-2 rows as the focused test/evidence.
- `dirty_worktree`: contained. Baseline dirt was inventoried before review. No existing change was
  staged, reverted, cleaned, or edited.
- `misleading_success_output`: caught. Validation exits 0 with five warnings; the required focused
  test still exits 1, so no green claim is made.
- `test_weakening`: passed by analysis. Exact literals and full finding objects preserve future
  drift detection; broad filters, count-only assertions, and deletion are expressly rejected.
- `generated_cached_artifacts`: contained. `sdp q` re-derived live state. The validation command
  rewrote the existing ignored `generated/` projections to the same current model; `git status
  --short -- generated` stayed empty and no generated file is tracked.
- `malformed_input`: not applicable. This review introduced no parser or input boundary.
- `prompt_injection`: not applicable. Every query body was locally authored; no corpus prose was
  executed.
- `cancel_resume`: not applicable. No reviewed product path is cancellable or resumable.
- `hung_or_long_commands`: not applicable. All review commands completed within their bounds.
- `flaky_tests`: rejected. The focused failure is synchronous and assertion-specific, with no wait,
  retry, clock, or random input.
- `repeated_interruptions`: not applicable. No review command was interrupted or retried.

## Cleanup and scope state

No process or scratch resource created by this adjudication remains. The ignored generated outputs
remain the repository's normal projections. The only file authored by this adjudication is this
evidence artifact.
