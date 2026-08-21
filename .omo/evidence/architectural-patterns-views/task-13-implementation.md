# Task 13 implementation — Recipe counts and key-decision list

Work: `architectural-patterns-views` · plan todo 13.
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
Branch: `feature/architectural-patterns-views`
HEAD: `42db8f0bef9d2c555a217f3c0eb1885151786204`
Captured: `2026-08-21T02:32:34Z`
Scope of this slice: `AGENTS.md`, `README.md`, and this evidence file. No other product file, no commit, no push.

Task-10 catalog proof (red on-ramp count-sync) is the baseline this slice closes for AGENTS: `.omo/evidence/architectural-patterns-views/task-10-implementation.md` (`keeps on-ramp recipe mentions synchronized with the catalog` failed while headings were already 1–19). Skills count-word is todo 12; this slice does not own skills.

`CONTEXT.md` was read before naming terms. Decision names are taken from `docs/concept/DECISIONS.md` and the plan's eight-item list; no extra MD-n.

## Product hashes

| path | `git hash-object` |
|---|---|
| `AGENTS.md` | `fa645a7515e8cab60415d95ac9f321f432195a70` |
| `README.md` | `c13c596e61338b1d2083d0a247284dc008bfe342` |

`git diff --stat -- AGENTS.md README.md`: `AGENTS.md | 6 ++++--`, `README.md | 4 ++--` (2 files, 6 insertions, 4 deletions).

## Count substitutions (planned locations)

- `AGENTS.md:79` (Where-to-look table): `sixteen runnable \`sdp q\` bodies` → `nineteen runnable \`sdp q\` bodies`
- `AGENTS.md:127` (Query-the-graph-first): `sixteen runnable recipe bodies` → `nineteen runnable recipe bodies`
- `README.md:31`: `sixteen graph-first recipes` → `nineteen graph-first recipes`
- `README.md:147`: `the sixteen recipe bodies` → `the nineteen recipe bodies`

`grep -n nineteen AGENTS.md README.md`:

```
AGENTS.md:79:... plus the nineteen runnable `sdp q` bodies ...
AGENTS.md:127:nineteen runnable recipe bodies live in `docs/agent-surface/recipes.md` ...
README.md:31:[nineteen graph-first recipes](docs/agent-surface/recipes.md) ...
README.md:147:... the nineteen recipe bodies at `docs/agent-surface/recipes.md`.
```

`grep sixteen AGENTS.md README.md`: no matches.

## Key-decision list

Inserted after the Where-to-look table (after the `reviews/` row, before the concept-docs blockquote). Table rows and columns unchanged.

Exact sentence:

`Key decisions (names first): the executable meta-model (MD-1); one primitive named coordinates (MD-4); the carrier ruling (MD-18); the agent front door (MD-22); structural anchors confer nothing (MD-30); the shipped projections stay frozen (MD-32); planning truths live in ruled graph homes (MD-33); architectural significance rides existing primitives (MD-34).`

Split on `; ` (strip a leading `and ` if present): **8** items, names first, no extra decisions.

## Automated gate

```bash
npx vitest run test/skills.test.ts
```

```
Test Files  1 passed (1)
     Tests  9 passed (9)
  Duration  750ms
```

Includes `keeps recipe-count prose synchronized with the executable catalog` (count word derived from catalog headings = `nineteen`). Task-10's red AGENTS pin is green for this slice.

Recipe suite `test/recipes.test.ts` was not run here. Task-10 already executed all 19 catalog bodies; remaining on-ramp residuals belong to todos 11/12/15 (sessions ordinals 17–19, architecture phrase pins, oracle lockstep), not this file set.

```bash
npx prettier --check README.md
git diff --check -- AGENTS.md README.md
```

Both exit 0. `AGENTS.md` is prettierignored; no rewrite.

## Manual QA

Read working `AGENTS.md` and `README.md` (not `generated/`, not HEAD blobs):

- Stale `sixteen`: **0** in both files.
- `nineteen`: **2** in AGENTS, **2** in README, at the four planned sites.
- Key-decision list: **8** items, exact plan names, after the DECISIONS.md table pointer, table not restructured.

## Adversarial probes

- **stale_state**: PASS. Counts taken from working files after the four substitutions. Catalog heading count remains 19 (task-10). `HEAD` still has `sixteen` until a later commit; observation is the working tree, hashes above, not an editor buffer.
- **dirty_worktree**: PASS for this slice's product files. Owned: `M AGENTS.md`, `M README.md`, and this evidence file (new). Sibling dirty/untracked paths from parallel todos were not edited here. No commit.
- **generated-or-cached**: N/A. Prose edits only. No `sdp q` invocation, no use of `generated/`.
- **flaky_tests**: N/A. `test/skills.test.ts` executed once, 9/9 pass. No retry.
- **misleading_success_output**: PASS (probe). Skills suite green means AGENTS contains `nineteen runnable \`sdp q\` bodies` and the agent-surface skill (todo 12 working tree) contains `catalog contains nineteen ready-made bodies`. It does not mean sessions phrase pins or self-hosting oracles are closed.

## Cleanup

No temp files created. No leftover overlay copies. No commit, no push.

## Completion gates for this implementation slice

- Four planned count substitutions sixteen → nineteen: **yes**.
- Lean eight-item named key-decision list near DECISIONS.md pointer: **yes**.
- No stale `sixteen` in AGENTS.md or README.md: **yes**.
- `npx vitest run test/skills.test.ts` green: **yes**.
- Evidence + scoped product diff only: **yes**.
