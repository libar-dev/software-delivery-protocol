# Task 10 implementation — Append recipes 17–19

Work: `architectural-patterns-views` · plan todo 10.
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
Branch: `feature/architectural-patterns-views`
HEAD: `723bf95c9975303cef5896c8b97f454e1786a3aa`
Scope of this slice: `docs/agent-surface/recipes.md` + this evidence file. No edits to `test/recipes.test.ts`, skills, README, AGENTS, Boulder, plan checkboxes, or ledger. No commit, no push.

`CONTEXT.md` (ratified glossary) was read before naming terms. Queries speak `Spec`, `Pack`, `claim`, delivery facts, stated vs derived readiness, blast radius. Recipe 17/18/19 bodies were executed as operator-authored JavaScript against the derived graph (`g` / `graph`); they were not treated as corpus law.

## Catalog change

`docs/agent-surface/recipes.md` `git hash-object` `44e96c0caab898ba169d21778f09e46c4128a958` (was `ed65f297dce271251066f0d9e80d204c02968103`).

`git diff --stat -- docs/agent-surface/recipes.md`: `333 +++++++++++++++++++++++++++++++++++++++++-` (332 insertions, 1 deletion).

### Intro parameterized list

Line 35:

`**Some recipes open with a parameter.** Recipes 3, 6, 9, 14, and 19 take their subject on the opening`

Recipes 1–16 bodies are byte-identical to HEAD except that one intro substitution.

### Recipe heading ordinals (contiguous 1–19)

Observed from `docs/agent-surface/recipes.md` (`grep -nE '^## [0-9]+\. '`):

1. The build backlog
2. The drift alarm
3. What does this Spec guarantee, and who verifies it
4. What breaks if I change these files
5. The Pack review backbone
6. Where is this concept
7. Readiness divergence
8. Orphans and gaps
9. Promotion preflight
10. Declared versus enabled verifiers
11. The lower ladder
12. Component membership
13. Uses fan-in and fan-out
14. Structural neighborhood
15. Census structural coverage
16. Projection coverage upper bound
17. Architecture map (line 647)
18. Decision map (line 749)
19. Planning slice (line 832)

Count: **19** numbered `## N. …` headings.

### Bodies

Plan-supplied fenced bodies (heading line stripped) copied verbatim into ` ```js ` fences. Byte-equal to the plan extracts:

| Recipe | body bytes | `return ` | `import`/`export` | single quotes |
|---|---|---|---|---|
| 17 | 2861 | present | absent | 0 |
| 18 | 2476 | present | absent | 0 |
| 19 | 4024 | present | absent | 0 |

Recipe 19 opens `const id =`, so it is parameterized with 3, 6, 9, and 14.

### Rendered Markdown shape (heading / need / code / prose)

Region read from the authored file (not `generated/`):

- **17** (647–747): `## 17. Architecture map` → italic *When you need this* → ` ```js ` … `return { components };` → trailing prose on `memberOf` / `uses` / `satisfies` / `decidedBy` fan counts.
- **18** (749–830): `## 18. Decision map` → italic need → fence ending `return { total: decisions.length, ranking, decisions };` → trailing prose on inter-decision ranking and absence of an edge.
- **19** (832–976): `## 19. Planning slice` → italic need → parameter paragraph (`const id`) → fence ending `blastRadiusLimit` → trailing prose that `implemented` is a binding, not liveness.

## Automated gate

Command (one run, as required):

```bash
npx vitest run test/recipes.test.ts
```

Result:

```
Test Files  1 failed (1)
     Tests  1 failed | 21 passed (22)
  Duration  3.10s
```

Passed: pairing (ordinals `[1..19]`), distinct invocation forms, every body has `return` / no import-export / no `'`, **all 19 bodies execute through `runSdpCli` with non-null return**, recipes 1–16 ground truth unchanged.

Failed (1): `keeps on-ramp recipe mentions synchronized with the catalog` — skill still says `catalog contains sixteen ready-made bodies` / `Recipes 1-16`; AGENTS still says `sixteen runnable \`sdp q\` bodies`. Count word is derived from heading count (`nineteen`). Skills and AGENTS are owned by plan todos 12 and 13; this slice did not edit them. Sessions ordinal loop remains `[12,13,14,15,16]` (task 11). Phrase pins still stop at the structural/projection slice (task 11).

Plan todo 10 acceptance (generic body rules + contiguous 1–19 headings) holds. Full-file green waits on the on-ramp count-word edits.

`npx prettier --check docs/agent-surface/recipes.md` exit 0 (`docs/**` is prettierignored; no rewrite).

## Manual QA channel

Catalog bodies for 17, 18, 19 extracted with the same heading/` ```js `/` ``` ` pairing as `parseRecipes` in `test/recipes.test.ts`, then executed:

```bash
pnpm --silent sdp:q '<catalog body>' --json
```

| Body | exit | stderr | JSON | Non-null shape |
|---|---|---|---|---|
| 17 Architecture map | 0 | empty | parsed object | `{ components }` length **11**; ids include `component:protocol.adapters` …; **PASS** nonempty |
| 18 Decision map | 0 | empty | parsed object | `{ total: 34, ranking, decisions }`; `decisions.length === 34`; **PASS** total nonzero |
| 19 Planning slice | 0 | empty | parsed object | `id: spec:consumers.agent-surface`, `found: true`; **PASS** |

## Adversarial probes

- **stale_state**: N/A as a false-green. Working-tree headings 1–19; `HEAD` still 16 until a later commit. Catalog observation is the working file, `git hash-object` `44e96c0…`, not an editor buffer.
- **dirty_worktree**: PASS for this slice's product files. Owned: `docs/agent-surface/recipes.md` (modified) and this evidence file (new). Sibling dirty/untracked paths from parallel todos were not edited here: `.omo/boulder.json`, `.omo/plans/architectural-patterns-views.md`, `.omo/start-work/ledger.jsonl`, `specs/model/structural-patterns.sdp.md`, `src/extract/discover.ts`, `src/extract/protocol-bindings.ts`, `test/self-hosting-oracle/model.ts`, plus other `task-*-*.md` evidence.
- **generated-or-cached**: N/A for catalog proof — headings and fences were read from authored Markdown. `sdp q` is a write-nothing sink. `generated/graph.json` is gitignored; mtime moved during the vitest/`sdp:q` window (`2026-08-21 03:45`) and was not used as catalog evidence. Queries used built `dist/cli`.
- **flaky_tests**: N/A — suite executed **once**; the on-ramp failure is deterministic count-word drift, not intermittent. No retry.
- **misleading_success_output**: PASS (probe). Vitest "21 passed" includes pairing, body rules, and 19 front-door executions. It does **not** mean skills/AGENTS already say nineteen. Manual `sdp:q` exit 0 is catalog-body execution, independently confirmed by heading counts 17–19 = 1 each.

## Cleanup

Removed `/tmp/sdp-task10-recipe-{17,18,19}.js` and `/tmp/sdp-task10-manual-qa/` after capturing the summaries above. No catalog/test/state leftover from extraction. No commit, no push.

## Completion gates for this implementation slice

- Exact docs change (intro list + recipes 17–19, recipes 1–16 bodies untouched): **yes**.
- Recipe suite: **21/22** — generic rules and all 19 executions green; on-ramp count-word red until todos 12–13.
- Three catalog bodies execute with non-null JSON (17 nonempty, 18 total nonzero, 19 found true): **yes**.
- Evidence + scoped product diff only: **yes** (`docs/agent-surface/recipes.md` + this file).
