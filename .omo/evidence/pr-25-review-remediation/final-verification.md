# PR 25 remediation final verification

Plan: `.omo/plans/pr-25-review-remediation.md` · Todo 7
Integration worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-pr-25-review-remediation`
Branch: `work/pr-25-review-remediation`
Reviewed pre-close integrated head: `b1ebd8d644e87449be9e49f7479da919c2fdbec0`
Parent of that head: `6b5e614df9ce53a496080449576fe18d61d9eb71`
Task id: `st_01a024ae`

No push, PR edit, merge, worktree removal, or runtime-ledger mutation. Todo 7/8/F1–F4 checkboxes were left unmarked.

## Lane patch proof

Cherry-picks are present exactly once. Stable `git patch-id --stable` pairs:

| Lane | Original | Integration | Patch id | Once |
| --- | --- | --- | --- | --- |
| Todo 2 | `a6460b6acd60e24516b68ce5e8e2b6a9dbdf439a` | `40b99501651a5f665a0f91ceb78fbc2c7f14f452` | `279292289cab3a2cbe9b6150d189fe070c702ba0` | yes |
| Todo 3 | `c92d8738b7daa8557618bc578b105c352126386d` | `3137f1219b793d73710b02ed370b016ba5c58503` | `f2d6afcf3b9742e16b6801de0cd204357628f2c1` | yes |
| Todo 4 | `e33fabd783024ecad219d1085c58e115f163cf1a` | `cd65717219e2af3b85b0147fa1c4d0776976e6f7` | `4c6517f69fd28405c9171053640b7aa0a6b469e4` | yes |
| Todo 5 | `dcf35aa51021e72176370f811610d13c73f12c30` | `6b5e614df9ce53a496080449576fe18d61d9eb71` | `880487100f89495ae50d852baa4588f8fe07b661` | yes |
| Todo 6 | `8b96eb83a446a2ccbc2b7f440f46c2a7b97101a3` | `b1ebd8d644e87449be9e49f7479da919c2fdbec0` | `1fdcc5a2d721032ea1322601732ffe412c63926a` | yes |

Linear subjects after Todo 1 `3c603e3cba716fb91fed24ec75aeff50ebcc451f`: prototype-safe recipes → planning-slice dependencies → coarse helper consumption → ledger recovery → review whitespace.

Focused lane evidence remains on the integration tree under `.omo/evidence/pr-25-review-remediation/task-{2-6}-*.md`.

## Deterministic typecheck correction

`npm run typecheck` failed on the integrated helper under `exactOptionalPropertyTypes`: `input.decidedByTarget` stayed `string | undefined` inside the `decidedBy` edge `to` field.

Minimum fix in `test/recipes.test.ts` only: bind `const decidedByTarget = input.decidedByTarget` and use that narrowed local. Prettier then collapsed the already-touched helper array and `assertOwnHostileFamilyIds` signature. No catalog, graph, or `src/` change.

This is a gate-caused correction inside planned test scope. `npx prettier --check test/recipes.test.ts` then exited 0. Focused `npx vitest run test/recipes.test.ts` remained 33/33.

## LSP

Requested diagnostics independently for every remediation-changed TypeScript/Markdown path, including `test/recipes.test.ts`, `test/helpers/structural-coverage.ts`, `test/structural-coverage.test.ts`, `test/self-hosting-graph.test.ts`, `docs/agent-surface/recipes.md`, and `AGENTS.md`. Every request returned the same infrastructure error:

```
LSP daemon unreachable: LSP daemon did not become reachable at /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock.
The MCP server is a thin proxy and never runs language servers in-process.
Socket: /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock
Logs: /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.log
The daemon is auto-started on demand and will be retried on the next request.
```

Authoritative substitutes: `npm run typecheck` exit 0, then the single full gate.

## Focused preflight

No concurrent generated-state writer (`ps` empty for `npm run check`, `projection-suite`, `vitest` watchers).

```
npx vitest run test/recipes.test.ts
Test Files  1 passed (1)
     Tests  33 passed (33)
exit 0

npx vitest run test/structural-coverage.test.ts test/self-hosting-graph.test.ts
Test Files  2 passed (2)
     Tests  38 passed (38)
exit 0

npm run typecheck
exit 0
```

## Single full gate

Recovered from `/tmp/pr25-todo7-check.log` (466 lines, `CHECK_EXIT:0`). The command was run exactly once. It was not rerun after the stream stall.

```
npm run check
```

Stages, in order, all reached:

`check:temporal` → `lint` → `format:check` (`All matched files use Prettier code style!`) → `build` (expected pre-existing `import.meta` CJS warning in `src/extract/protocol-bindings.ts:56`) → `generate:self-hosting` → `generate:example` → `typecheck` → `typecheck:examples` → `test` → `check:self-hosting-gates` → `check:self-hosting` → `check:example` → `preflight`.

Exact test totals from that one run:

```
Test Files  63 passed (63)
     Tests  862 passed | 1 skipped (863)
  Start at  16:23:34
  Duration  34.27s

Test Files  1 passed (1)
     Tests  80 passed (80)
  Start at  16:24:09
  Duration  5.25s
```

Self-hosting banner (repeated): `164 specs · 1 packs · 177 anchors → 342 nodes · 760 edges (0 errors, 0 warnings)` then `validate: 0 errors · 5 warnings`.

Example banner: `11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges` then `validate: 0 errors · 1 warnings` (`conformance/verifies-linkage` on `spec:orders.create-order.invalid-cart`).

Expected honesty/gaps warning subjects:

- `spec:carrier.markdown-authoring`
- `spec:extraction.claim-taxonomy`
- `spec:model.pack-aggregate`
- `spec:model.relations`
- `spec:model.spec-sections`

`preflight` noted the then-dirty plan checkbox file and `test/recipes.test.ts`. Exit of the whole `npm run check` process: **0**.

## Manual QA

All through the real built CLI after the green gate. No dry-run.

### Help

```
npm run --silent sdp -- --help
```

exit 0, stderr empty (0 bytes). Usage includes `sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--json]`.

### Unknown command

```
npm run --silent sdp -- not-a-command
```

exit 1, stdout empty, stderr ends with `Unknown command: not-a-command`.

First `pnpm --silent sdp -- validate …` also printed help (the extra `--` made `validate` unreachable). The documented form was then run:

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

exit 0. stdout:

```
164 specs · 1 packs · 177 anchors → 342 nodes · 760 edges (0 errors, 0 warnings)
Wrote …/generated/graph.json
Wrote …/generated/contracts (102 modules)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

stderr: the five honesty/gaps warnings named above.

### Recipes 17–19

`pnpm --silent sdp:q '<body>' --json` with fence-extracted catalog bodies. All exit 0, stderr empty.

| Body | stdout bytes | Machine values |
| --- | ---: | --- |
| 17 | 32493 | 13 components; member counts sum 76; `unresolvedUses` `[]`; import members 2 fanIn 1 fanOut 2; testing members 1 fanIn 0 fanOut 2 |
| 18 | 24106 | `total` 35; 35 decision rows |
| 19 default | 3574 | `id` `spec:consumers.agent-surface`, `found` true |
| 19 unknown | 52 | `{"id":"spec:does.not.exist","found":false}` |
| 19 structural-anchor | 1240 | `dependsOn` exactly `spec:decisions.binding-not-liveness` ready; `dependedOnBy` MD-34 and MD-35, both ready; both arrays non-empty |
| 1 | 131 | `total` 0; `excludedReadyExamples` 66; `excludedReadyDecisions` 35; `excludedWithoutVerifier` `[]` |

Structural-anchor recipe 19 dependencies:

```json
{
  "dependsOn": [{"id": "spec:decisions.binding-not-liveness", "statedReadiness": "ready"}],
  "dependedOnBy": [
    {"id": "spec:decisions.architectural-significance-rides-primitives", "statedReadiness": "ready"},
    {"id": "spec:decisions.jsdoc-graph-extraction-refused", "statedReadiness": "ready"}
  ]
}
```

### Constructor-family recipe 18

Production `runSdpCli` seam (`dist/cli/sdp.js`) with an in-memory extraction override that adds `spec:constructor.hostile-decided-subject` decidedBy `spec:decisions.agent-front-door`. Shipped catalog body unchanged.

```json
{
  "exitCode": 0,
  "stderr": "",
  "ownConstructor": true,
  "constructorIds": ["spec:constructor.hostile-decided-subject"],
  "decisionFound": true
}
```

Pre-fix exit-1 evidence is preserved in `task-2-recipe-totality.md` (`sdp q: decidedSubjectsByFamily[family].push is not a function`). Shipped files were not reverted to re-prove it.

### Stale / `origin/main` diagnostic

`git archive origin/main` (`bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`) extracted to a disposable root; current `dist/cli/sdp.js` queried that corpus with the documented excludes.

Try-it readiness query:

```
[
  { id: 'spec:decisions.architectural-significance-rides-primitives', stated: undefined, derived: undefined },
  { id: 'spec:decisions.jsdoc-graph-extraction-refused', stated: undefined, derived: undefined },
  { id: 'spec:model.structural-patterns', stated: 'idea', derived: 'idea' },
  { id: 'spec:protocol.structural-self-binding', stated: 'idea', derived: 'scoped' }
]
```

`component:` nodes: `[]` (3 CodeNodes, all skill-test `impl:` ids; 0 `memberOf`/`uses`). `g.specContext("spec:extraction.delivery-facts")` throws `sdp q: Cannot read properties of undefined (reading 'found')` (exit 1). Named mismatch: MD-34/MD-35 are undefined and the accepted component set is absent. That is `main`, not this branch.

## Graph invariants

`pnpm --silent sdp:q --json` over the live integrated corpus:

```json
{
  "specs": 164,
  "packs": 1,
  "anchors": 85,
  "nodes": 342,
  "edges": 760,
  "components": 13,
  "memberOf": 76,
  "uses": 35,
  "decisions": 35,
  "interDecisionDependsOn": 14,
  "supersedes": 0,
  "decidedBy": 46,
  "statedReadiness": {"ready": 148, "defined": 11, "idea": 4, "scoped": 1},
  "errorCount": 0
}
```

177 extract anchors match the validate banner (graph `Anchor` nodes are the subset that remain after derivation). Operational backlog empty. Warning identities are the five honesty/gaps subjects above. No concurrent authorized corpus change.

## Import parity

Already-reviewed method, re-run only as an audit (no inference feature added):

1. Map `src/**/*.ts` to the 13 accepted components by top-level directory (`src/ids.ts` is model).
2. Resolve relative `import`/`export` specifiers, including `.js` → `.ts` (value and type).
3. Record a pair when the importer and importer target live in different components.
4. Exclude the anchor-machinery modules named by `spec:protocol.structural-self-binding`: `src/ids.ts` (stable-id) and the anchor builders `src/model/anchors.ts` plus `src/model/code-anchor.ts`.

Result: 35 observed pairs, 35 `expectedUsesEdges`, extra `[]`, missing `[]`. Six additional `* → model` edges exist only through `code-anchor.ts` and are the machinery-only imports the convention drops.

## Archive integrity

| Archive | Records | SHA-256 | Source cmp |
| --- | ---: | --- | ---: |
| `architecture-and-prior.jsonl` | 135 | `6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719` | 0 vs `5c15962:.omo/start-work/ledger.jsonl` |
| `design-law-transfer-pre-delete.jsonl` | 20 | `df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90` | 0 vs `d8d4e5f:.omo/start-work/ledger.jsonl` |
| `design-law-transfer-post-delete.jsonl` | 12 | `5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1` | 0 vs main-checkout ignored ledger (12 records, same hash) |

Concatenated count 167. JSONL parse: one object per non-empty line.

Integration-worktree runtime ledger is a separate ignored file: 15 records, SHA-256 `468f0ac3fd506543ce52090ea3ba0ab40ce65c10e587cea34f2349c57758ee6d`, plans only `.omo/plans/pr-25-review-remediation.md`. `git check-ignore -v` → `.gitignore:25:.omo/*`. `git ls-files` empty. This lane did not stage, rewrite, or append it.

## Scope

```
git diff --check origin/main...HEAD
exit 0
```

`git diff --name-only 5584ed91cf2c3efbf31ad83c28054febd0ec62b7...HEAD` is only planned docs/tests/OmO paths (`.gitignore`, `AGENTS.md`, `docs/agent-surface/recipes.md`, test helper/oracle/recipe files, remediation drafts/plan/evidence, Boulder, three historical whitespace files). No `src/`, `specs/`, `examples/`, `explorations/`, `package.json`, `package-lock.json`, generated output, or completed-plan path.

Wave-2 `src/` delta `ed77ee7...5584ed91` remains exactly `src/graph/delivery-facts.ts`. Whole-branch `origin/main...HEAD` still has 26 `src/` files; that is Wave 1 plus the one Wave-2 file, not a remediation delta.

## Boulder representation

`.omo/boulder.json` updates only `works.pr-25-review-remediation`. Prior completed works are untouched.

`current_commit` is the verified pre-close integrated head `b1ebd8d644e87449be9e49f7479da919c2fdbec0`. A close commit cannot name its own SHA. Publication (Todo 8) fast-forwards the feature branch to the close commit that records this pointer. `completed_todo` stays `6` because Todo 7's checkbox is reserved for the orchestrator.

## Adversarial map

| Class | Result |
| --- | --- |
| `stale_state` | Live PR head still `5584ed91`; integration HEAD `b1ebd8d`; main stale diagnostic captured; graph re-queried at this head |
| `generated_or_cached_artifacts` | Full gate generated then `--check-clean` certified; no extra generated-state writer |
| `dirty_worktree` | Pre-close dirty set was plan checkboxes 1–6 plus the typecheck helper; runtime ledger ignored |
| `hung_or_long_commands` | One `npm run check`; recovered from the existing log after the stall; no rerun |
| `flaky_tests` | 862/1 and 80/80 from that one run; focused suites deterministic |
| `misleading_success_output` | Exits, bytes, JSON keys, warning identities, and hashes recorded; first validate invocation that printed help was not treated as success |
| `malformed_input` | Unknown verb exit 1 + `Unknown command: not-a-command`; recipe 19 unknown id `{found:false}` |
| `cancel_resume` | Stream stalled after the green gate; this file resumes from that log and unfinished QA only |
| `repeated_interruptions` | No second full gate |
| `prompt_injection` | PR body is repository-authored prose; not executed |

## Cleanup receipts

Task-owned `/tmp/pr25-todo7-qa`, `/tmp/pr25-todo7-main-root`, `/tmp/pr25-todo7-check.log`, and `/tmp/pr25-todo7-live-body.md` were removed after the values above were copied here. Unrelated older snapshots (`/tmp/sdp-qa-pr25`, `/tmp/pr-25-live.md`, `/tmp/pr-25-live2.md`) were left in place. No watcher, port, or generated-state writer remains. Lane worktrees were not removed.

## Residual risk

`test/recipes.test.ts` remains far above 250 pure LOC (1098 after the narrowing). Split is out of scope. Recipe totality is still local `Object.create(null)` in three catalog bodies.
