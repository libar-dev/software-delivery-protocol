# Task 11 implementation — recipes.test.ts ground truth for 17–19

Work: `architectural-patterns-views` · plan todo 11.
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
Branch: `feature/architectural-patterns-views`
HEAD: `119577e2db60e678a951d0150463f3b184de7949`
Captured: `2026-08-21T03:41:59Z`
Scope of this slice: `test/recipes.test.ts` + this evidence file. No production, docs, oracle, or state edits. No commit, no push.

`CONTEXT.md` (ratified glossary) was read before naming terms. Queries speak `Spec`, `Pack`, `claim`, delivery facts, stated vs derived readiness, blast radius. Recipe 17/18/19 bodies were executed as operator-authored JavaScript against the derived graph (`g` / `graph`); they were not treated as corpus law.

## Catalog / product files not touched

Recipes 17–19 already live in `docs/agent-surface/recipes.md` (todo 10). Shared oracles already synced (todo 15). This slice only locks them.

`git hash-object test/recipes.test.ts` after edit: `12263db14ae9cbbb9302d6d810576f1d2e30d78b`.

`git diff --stat -- test/recipes.test.ts`: `110 ++++++++++++++++++++++++++++++++++++++++++++++++++-` (109 insertions, 1 deletion).

## Baseline (one run, before edit)

Command:

```bash
npx vitest run test/recipes.test.ts
```

Result:

```
 Test Files  1 passed (1)
      Tests  22 passed (22)
  Duration  2.58s
```

22/22 required and observed. On-ramp count-word already green from todos 12–13; structural oracles green from todo 15. Sessions ordinal loop still `[12, 13, 14, 15, 16]`. Phrase pins still stopped at the structural/projection slice.

## Test change

`test/recipes.test.ts` only.

### On-ramp sync (no hardcoded count word)

Count word remains derived from heading count (`countWords[recipes.length]`). No `"sixteen"` / `"nineteen"` literal added.

- Phrase pins now include `architecture map`, `decision map`, `planning slice`.
- Sessions ordinal loop is `[12, 13, 14, 15, 16, 17, 18, 19]`.

### Three `it` blocks (live graph, no implementation constants)

Exact assertions:

**Recipe 17** — `returns the architecture map of every live component with recomputed fan-in and fan-out`

- `result.components` ids sorted equal the live graph's `component:` CodeNode ids (`structuralGroundTruth().components`).
- those ids contain `component:protocol.import` and `component:protocol.testing`.
- each row `fanOut` / `fanIn` equals the unique owner-mapped `uses` neighbor counts recomputed from `graph.edges` (`memberOf` owner, then `uses` attributed to owner components). Not a hardcoded component count.

**Recipe 18** — `returns the decision map ranked by live inbound fan-in`

- `result.total` equals the live graph's `Primitive` ∧ `specKind === "decision"` count.
- `ranking.length` equals that same live count.
- ranking `fanIn` values are descending.
- top-ranked `fanIn` equals the live inbound inter-decision `dependsOn` + `supersedes` count for that id. No hardcoded `=== 4`.

**Recipe 19** — `returns a planning-slice neighborhood and an exact absent shape`

- default id `spec:consumers.agent-surface` returns `found: true` and `id` equal to that default.
- `refinementNeighborhood` equals live `refines` parents (`from === id`) and children (`to === id`).
- unknown-id substitution (`spec:consumers.nonexistent`) returns `{ id: "spec:consumers.nonexistent", found: false }`.
- `blastRadiusLimit` prose is not pinned.

## Automated gate (one run after edit)

Command:

```bash
npx vitest run test/recipes.test.ts
```

Result (single run, no retry):

```
 Test Files  1 passed (1)
      Tests  25 passed (25)
  Duration  2.57s
```

25 = previous 22 + 3 new ground-truth blocks. Pairing, body rules, front-door execution of all 19 bodies, and recipes 1–16 ground truth still green.

### tsc / prettier / eslint / diff

| Command | Exit |
|---|---|
| `npx tsc --noEmit -p tsconfig.json` | 0 |
| `npx prettier --check test/recipes.test.ts` | 0 (`All matched files use Prettier code style!`) |
| `npx eslint test/recipes.test.ts` | 0 |
| `git diff --check -- test/recipes.test.ts` | 0 |

Pure LOC of `test/recipes.test.ts` after edit: 819 (pre-existing oversized corpus file; this slice added 109 lines and did not split — plan scope is this file only).

## Manual QA channel

Catalog bodies for 17, 18, 19 extracted with the same heading/` ```js `/` ``` ` pairing as `parseRecipes` in `test/recipes.test.ts`, then executed:

```bash
pnpm --silent sdp:q '<catalog body>' --json
```

Unknown-id: recipe 19 body with `spec:consumers.agent-surface` replaced by `spec:consumers.nonexistent`.

| Body | exit | stderr | JSON | Observed |
|---|---|---|---|---|
| 17 Architecture map | 0 | empty | `{ components }` | length **13** nonempty; `component:protocol.import` and `component:protocol.testing` present |
| 18 Decision map | 0 | empty | `{ total, ranking, decisions }` | `total` **34** nonzero; ranking length 34; top `{ id: spec:decisions.binding-not-liveness, fanIn: 4 }` measured live, not pinned |
| 19 Planning slice | 0 | empty | object | `id: spec:consumers.agent-surface`, `found: true`; neighborhood parents `[spec:consumers.projections-model]`, 6 children |
| 19 unknown-id | 0 | empty | object | `{ id: "spec:consumers.nonexistent", found: false }` |

## Adversarial probes

- **stale_state**: PASS. Assertions recompute from the in-process derivation (`extract` / `graph.edges`), not from `generated/graph.json` or a cached count. Working-tree test file `git hash-object` `12263db1…`; HEAD still lacks this test until a later commit.
- **dirty_worktree**: PASS for this slice's product files. Owned: `test/recipes.test.ts` (modified) and this evidence file (new). Sibling dirty/untracked paths from parallel todos were not edited here: `.omo/boulder.json`, `.omo/plans/architectural-patterns-views.md`, `.omo/start-work/ledger.jsonl`, `.omo/evidence/architectural-patterns-views/task-1-normal-branch.md`.
- **generated-or-cached**: PASS. `sdp q` is a write-nothing sink. `generated/graph.json` mtime stayed `2026-08-21 05:09` (before this slice). Queries used built `dist/cli`. Catalog bodies were read from authored Markdown, not generated output.
- **flaky_tests**: N/A — suite executed **once** after edit; 25/25. No retry. No `sleep` / polling. Unknown-id substitution is deterministic string replace.
- **misleading_success_output**: PASS (probe). Vitest "25 passed" includes the three new ground-truth blocks, not merely "every body runs". Manual `sdp:q` independently showed nonempty components (13), nonzero decision total (34), `found: true`, and unknown-id `found: false`. Top `fanIn: 4` is a live observation in this evidence, not a test pin.

## Cleanup

This slice created no `/tmp` files (inline `node --input-type=module` heredoc). Pre-existing `/tmp/sdp-recipe-{8,9,11}.js` from 2026-08-20 were left untouched. No catalog/test/state leftover. No commit, no push.

## Completion gates for this implementation slice

- Sessions loop `[12..19]` and architecture/decision/planning phrase pins: **yes**.
- Three live-derived `it` blocks; no hardcoded count word or `fanIn === 4`: **yes**.
- Recipe suite after edit: **25/25 in one run**.
- tsc / prettier / eslint / diff-check: **exit 0**.
- Manual `sdp:q` 17 nonempty, 18 total nonzero, 19 found true, unknown-id `{id, found:false}`: **yes**.
- Evidence + scoped product diff only: **yes** (`test/recipes.test.ts` + this file).
