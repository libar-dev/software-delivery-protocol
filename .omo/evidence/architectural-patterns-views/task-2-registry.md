# Task 2 registry row (MD-34)

Subtask: append the plan-supplied MD-34 row to `docs/concept/DECISIONS.md`.
Branch: `feature/architectural-patterns-views`.
No Spec, Pack, test, plan, Boulder, ledger, or other product file edited in this slice.

## Recipe 1 / recipe 2 (verbatim catalog bodies via `pnpm --silent sdp:q`)

Recipe 1 (build backlog):

```
{
  total: 0,
  byFamily: {},
  excludedReadyExamples: 66,
  excludedReadyDecisions: 33,
  excludedWithoutVerifier: []
}
```

Recipe 2 (drift alarm):

```
{
  total: 3,
  alarms: [
    { id: 'spec:consumers.projections-model', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 2 },
    { id: 'spec:extraction.regenerability', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 1 },
    { id: 'spec:model.core-model', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 3 }
  ]
}
```

## Automated verification

Commands:

```bash
npx prettier --check docs/concept/DECISIONS.md
git diff --check -- docs/concept/DECISIONS.md
```

Results:

- `npx prettier --check docs/concept/DECISIONS.md` — exit 0; `Checking formatting...` / `All matched files use Prettier code style!`
- `git diff --check -- docs/concept/DECISIONS.md` — exit 0; empty stdout (no whitespace errors)

## Manual QA (read tool)

`read` on `docs/concept/DECISIONS.md` around MD-33/MD-34 (lines 44–46). Visual assertions:

- exactly one MD-34 row
- name-first wording: `architectural significance rides existing primitives`
- curation: `durable`
- carrying pointer: `[Spec](../../specs/decisions/architectural-significance-rides-primitives.sdp.md)` (`spec:decisions.architectural-significance-rides-primitives`)
- order preserved: MD-33 immediately followed by MD-34, then the blank line before `### Current executable decision-spec pointers`
- no other registry rows altered

Observed MD-34 row verbatim:

```
| MD-34 | architectural significance rides existing primitives | durable | Patterns are decision/model-kind Specs linked by the existing relations, code linkage rides the satisfies → decidedBy join, and grouping is derived — no pattern vocabulary is admitted. | [Spec](../../specs/decisions/architectural-significance-rides-primitives.sdp.md) (`spec:decisions.architectural-significance-rides-primitives`) |
```

## Adversarial (UltraQA)

- **dirty_worktree**: PASS. `git diff -- docs/concept/DECISIONS.md` is a single added line after MD-33 (the MD-34 row). This slice did not modify any other tracked path. Sibling dirty paths (`.omo/boulder.json`, `.omo/plans/architectural-patterns-views.md`, `.omo/start-work/ledger.jsonl`, `specs/self-hosting.pack.sdp.md`, `test/self-hosting-oracle/decisions.ts`, `test/self-hosting-oracle/pack-members.ts`) and prior evidence under `.omo/evidence/architectural-patterns-views/` were already present from other task-2 / session work and were not edited here.
- **stale_state**: PASS. Before insertion: `git show HEAD:docs/concept/DECISIONS.md | grep -c MD-34` = `0`; working-tree count was also `0`. After insertion: exactly one MD-34 match, at line 45 of `docs/concept/DECISIONS.md`.
- **misleading_success_output**: PASS. Format/diff-check exits are 0, and the row contents were asserted independently: git diff `+` line and the read-tool observation both match the plan-supplied MD-34 text (name, durable, gloss, Spec link/id), not format-clean only.
- **generated_or_cached_artifacts**: N/A — registry Markdown only; no generate/build/cache read or write.
- **malformed_input**: N/A — the row was copied from the plan; no parser input was synthesized.
- **prompt_injection**: N/A — no untrusted document was treated as instructions beyond the assigned plan row.
- **cancel_resume**: N/A — one uninterrupted insertion; no cancel/resume.
- **hung_commands**: N/A — prettier and git diff --check returned immediately with exit 0.
- **flaky_tests**: N/A — no tests in this slice (pure registry prose; corpus red proof is upstream `task-2-oracle-red.md`).
- **repeated_interruptions**: N/A — no interrupted commands.

## Cleanup receipt

- Background jobs: none.
- Temp files created by this subtask: none.
- Generated artifacts created by this subtask: none.
- No commit, no push.

## Completion condition

- Exact single MD-34 row appended after MD-33 in established order: yes.
- `npx prettier --check docs/concept/DECISIONS.md` exit 0: yes.
- `git diff --check -- docs/concept/DECISIONS.md` exit 0: yes.
- Manual read recorded the observed row verbatim: yes.
- Evidence file exists: yes.
- No other file edited by this slice: yes.
