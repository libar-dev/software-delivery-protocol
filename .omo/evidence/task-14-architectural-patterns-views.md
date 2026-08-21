# Task 14 evidence — close gate (needs-fix)

Plan: `architectural-patterns-views` · Task 14
Branch: `feature/architectural-patterns-views`
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
HEAD: `0a8912bba5b13d97f1eab5e63492e63eaafefbac`
HEAD subject: `test(recipes): ground-truth assertions for architecture recipes 17–19`
Captured: `2026-08-21T03:57:00Z` (inventory) / `2026-08-21T03:58:00Z` (single `npm run check`)
Scope honored: only this evidence file written. No product, tests, plan, Boulder, ledger, commit, or push.

## Inventory (before check)

```text
$ git branch --show-current
feature/architectural-patterns-views

$ git rev-parse HEAD
0a8912bba5b13d97f1eab5e63492e63eaafefbac

$ git status -sb
## feature/architectural-patterns-views
 M .omo/boulder.json
 M .omo/plans/architectural-patterns-views.md
 M .omo/start-work/ledger.jsonl
?? .omo/evidence/architectural-patterns-views/task-1-normal-branch.md
```

Recent product/test landing at HEAD: `0a8912b test(recipes): ground-truth assertions for architecture recipes 17–19`.

## Orchestrator dirt classification

These paths are orchestrator state, not product. They were inventoried and left untouched.

| Path | Git | Class |
| --- | --- | --- |
| `.omo/boulder.json` | tracked modified | Boulder / active work |
| `.omo/plans/architectural-patterns-views.md` | tracked modified | plan checkboxes |
| `.omo/start-work/ledger.jsonl` | tracked modified | ledger |
| `.omo/evidence/architectural-patterns-views/task-1-normal-branch.md` | untracked | task-1 evidence |

`.gitignore` keeps `.omo/*` ignored except `boulder.json`, `drafts/`, `plans/`, and `evidence/`. Prettier ignores `.omo/**`. Preflight would later treat the untracked task-1 evidence as `nonignored runtime garbage` if the pipeline reached `preflight`. That stage was never reached.

Tracked `.cursor/plans/architectural_patterns_arc_7a1015f0.plan.md` is **not** orchestrator dirt: it is committed at HEAD (`bb97d82 finalize architectural patterns plan`), worktree bytes match the index, and it is not in `.prettierignore`.

## `npm run check` — one run, no retry

Command: `npm run check`  
Working directory: repository root  
Exit: **1**  
Failing stage: **`format:check`** (`prettier --check .`)  
Stages that ran: `check:temporal` (exit 0), `lint` (exit 0), `format:check` (exit 1)  
Stages not reached: `build`, `generate:self-hosting`, `generate:example`, `typecheck`, `typecheck:examples`, `test`, `check:self-hosting-gates`, `check:self-hosting`, `check:example`, `preflight`

Exact output:

```text
> @libar-dev/software-delivery-protocol@0.0.0 check
> npm run check:temporal && npm run lint && npm run format:check && npm run build && npm run generate:self-hosting && npm run generate:example && npm run typecheck && npm run typecheck:examples && npm test && npm run check:self-hosting-gates && npm run check:self-hosting && npm run check:example && npm run preflight


> @libar-dev/software-delivery-protocol@0.0.0 check:temporal
> node ./check-temporal.mjs


> @libar-dev/software-delivery-protocol@0.0.0 lint
> eslint .


> @libar-dev/software-delivery-protocol@0.0.0 format:check
> prettier --check .

Checking formatting...
[warn] .cursor/plans/architectural_patterns_arc_7a1015f0.plan.md
[warn] Code style issues found in the above file. Run Prettier with --write to fix.


Command exited with code 1
```

This is not a self-hosting honesty/gaps or verifies-linkage warning. Those expected warnings were not observed because generation/validate never ran.

Cause: committed Prettier-unformatted bytes in `.cursor/plans/architectural_patterns_arc_7a1015f0.plan.md`. `git diff` on that path is empty. Failure is independent of the classified orchestrator dirt. No suppression, no format rewrite, no retry.

## Remeasurement

Not run. Task requires a green gate before fresh `pnpm --silent sdp:q --json` counts and repository validate.

Expected-but-unobserved (would apply only after a green check):

- five self-hosting `honesty/gaps` warnings
- one example `verifies-linkage` warning
- both are warnings, not failures

## Adversarial classes

| Class | Observation |
| --- | --- |
| stale | Gate used live `npm run check` on current HEAD; no cached green claimed |
| dirty | Orchestrator dirt present and classified; **not** the failing stage |
| generated | Generation scripts not reached |
| hung | Check returned in ~17s at `format:check`; no hung process |
| flaky | Single run, no retry |
| misleading | Exit 1 is a format failure, not the expected five+one validation warnings |
| repeated-interruptions | None |

## Cleanup

No check subprocess left running. No temp query bodies. No product/test/plan/Boulder/ledger edits. Evidence path is this file only.

## Blocker for root recovery

Root must land a recovery commit that makes `npm run format:check` pass (format or ignore the tracked `.cursor/plans/` file). After that, re-dispatch task 14. Do not treat orchestrator dirt as the current failure; if the format file is fixed and check proceeds, preflight may still fail on untracked `.omo/evidence/architectural-patterns-views/task-1-normal-branch.md`.
