# F3 real manual QA — PR 25 final head

Task: `st_01a0253b`
Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-final2-f3`
HEAD: `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c` (`chore: remeasure final PR 25 remediation gate`)
State: fresh detached worktree, exact published/remediated head
`origin/main`: `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`
PR: https://github.com/libar-dev/software-delivery-protocol/pull/25

Read-only except this file. No push, live PR edit, plan edit, Boulder edit, runtime-ledger edit, `src/`/`specs/` edit, or full `npm run check` rerun.

## Verdict

`APPROVE`

Every published Try-it command reproduced its committed expected bytes. Recipes 17–19, unknown and structural-anchor planning slices, all four hostile families, graph invariants, and ledger archives matched the remeasured publication. Against `origin/main`, `g.specContext("spec:extraction.delivery-facts")` is `undefined` and the published delivery-facts query fails on `statedReadiness`, not the stale `.found` probe. Required GitHub checks are green at this exact SHA. The type-only/cycle structural-audit seam is test-only and does not change graph values.

## Provision

Worktree already existed at the exact SHA. Tracked status empty. `node_modules` and `dist` were absent.

```
npm ci && npm run build
```

`npm ci` added 201 packages (4 pre-existing audit findings; `import.meta` CJS warning from `tsup`). `dist/cli/sdp.js` built. Published Try-it forms used `pnpm --silent sdp` / `sdp:q` against that binary. `git merge-base --is-ancestor 6a35bd29fe8d4e236d1290529f045fcbc5875e71 HEAD` exit 0.

## Live PR body and checks

`gh pr view 25 --json body --template '{{.body}}'` compared to committed `.omo/evidence/pr-25-review-remediation/pr-body.md`:

| Field | Value |
| --- | --- |
| live `headRefOid` | `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c` |
| live `baseRefOid` | `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d` |
| state | `OPEN` |
| live body bytes | `19229` |
| committed body bytes | `19229` |
| `cmp` | `0` |

Inspected current GitHub check-runs for that SHA (no watch, no rerun):

| name | conclusion | head_sha | url |
| --- | --- | --- | --- |
| check | `success` | `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c` | https://github.com/libar-dev/software-delivery-protocol/actions/runs/32504617480/job/96841877242 |
| check | `success` | `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c` | https://github.com/libar-dev/software-delivery-protocol/actions/runs/32504618807/job/96841874572 |

`gh pr checks 25` reported both `pass`. Combined commit status is empty/`pending` because this repository uses check-runs, not commit statuses.

## Final raw gate receipt

Inspected committed [`full-gate-final.log`](./full-gate-final.log). Did not rerun `npm run check`.

| Field | Value |
| --- | --- |
| bytes | `30002` |
| lines | `465` |
| SHA-256 | `07f43f8d58d59eebc4d2d0048c9e872f80b900b5e2d99f77148b519dcfb00914` |
| final marker | `CHECK_EXIT:0` |

Matches [`final-remediation-close.md`](./final-remediation-close.md) and [`final-verification.md`](./final-verification.md).

## Help and bad verb

```
npm run --silent sdp -- --help
```

| Field | Value |
| --- | --- |
| exit | `0` |
| stdout bytes | `5356` |
| stderr bytes | `0` |

Usage includes `sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--json]`.

```
npm run --silent sdp -- not-a-command
```

| Field | Value |
| --- | --- |
| exit | `1` |
| stdout bytes | `0` |
| stderr bytes | `5388` |
| stderr ends with | `Unknown command: not-a-command` |

Help text was not treated as validation success.

## Validation

Published form:

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

| Field | Value |
| --- | --- |
| exit | `0` |
| stdout bytes | `367` |
| stderr bytes | `1095` |

stdout:

```
164 specs · 1 packs · 177 anchors → 342 nodes · 760 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol-pr25-final2-f3/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol-pr25-final2-f3/generated/contracts (102 modules)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

First and last lines are byte-identical to the published two-line expected fence. Between them the CLI writes `generated/` as the PR body states. stderr names exactly the five honesty/gaps subjects: `spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`.

## Published Try-it commands

All through `pnpm --silent sdp:q '<body>'`. Live stdout compared to the committed PR-body expected fences:

| Command | exit | stdout | stderr | vs `pr-body.md` fence |
| --- | ---: | ---: | ---: | --- |
| readiness of MD-34/MD-35 + two architecture Specs | `0` | `401` | `0` | exact (`cmp` 0) |
| delivery-facts `specContext` | `0` | `107` | `0` | exact (`cmp` 0) |
| `component:` ids | `0` | `415` | `0` | exact (`cmp` 0) |

Machine values:

```
[
  { id: 'spec:decisions.architectural-significance-rides-primitives', stated: 'ready', derived: 'ready' },
  { id: 'spec:decisions.jsdoc-graph-extraction-refused', stated: 'ready', derived: 'ready' },
  { id: 'spec:model.structural-patterns', stated: 'defined', derived: 'ready' },
  { id: 'spec:protocol.structural-self-binding', stated: 'defined', derived: 'ready' }
]
```

```
{ readiness: 'ready', facts: [ 'implemented', 'has-verifier' ], implementations: 1, verifiers: 1 }
```

Thirteen `component:` ids, including `component:protocol.import` and `component:protocol.testing`, in the published order.

## Recipes 17–19

Fence-extracted catalog bodies from `docs/agent-surface/recipes.md` into `pnpm --silent sdp:q '<body>' --json`. All stderr empty.

| Body | exit | stdout bytes | Machine values |
| --- | ---: | ---: | --- |
| 17 | `0` | `32493` | 13 components; member counts sum 76; `unresolvedUses` `[]`; import members 2 fanIn 1 fanOut 2; testing members 1 fanIn 0 fanOut 2 |
| 18 | `0` | `24106` | `total` 35; 35 decision rows |
| 19 default | `0` | `3574` | `id` `spec:consumers.agent-surface`, `found` true |
| 19 unknown `spec:does.not.exist` | `0` | `52` | `{"id":"spec:does.not.exist","found":false}` |
| 19 structural-anchor | `0` | `1240` | `found` true; both dependency arrays non-empty |
| 19 delivery-facts | `0` | `1893` | `found` true; one implementation, one verifier, parent `spec:extraction.derive-graph` |
| 1 (numbers) | `0` | `131` | `total` 0; `excludedReadyExamples` 66; `excludedReadyDecisions` 35; `excludedWithoutVerifier` `[]` |

Structural-anchor recipe 19 dependencies (exact JSON):

```json
{
  "dependsOn": [{"id": "spec:decisions.binding-not-liveness", "statedReadiness": "ready"}],
  "dependedOnBy": [
    {"id": "spec:decisions.architectural-significance-rides-primitives", "statedReadiness": "ready"},
    {"id": "spec:decisions.jsdoc-graph-extraction-refused", "statedReadiness": "ready"}
  ]
}
```

Stdout byte counts for 17 / 18 / 19 default / 19 unknown / 19 structural-anchor match the previous close-evidence table.

## Hostile families

All four lawful Object.prototype path segments (`constructor`, `toString`, `valueOf`, `hasOwnProperty`) through the production `runSdpCli` seam (`dist/cli/sdp.js`) via `npx vitest run test/recipes.test.ts -t "Object.prototype path segments"`:

| Test | Result |
| --- | --- |
| recipe 1 backlog grouping | pass |
| recipe 11 lower-ladder grouping | pass |
| recipe 18 decided-subject grouping | pass |

3 passed, 30 skipped. Each family is an own map key carrying `spec:<family>.<leaf>`. No `.push is not a function`.

## Structural resolver seam vs graph values

`npx vitest run test/structural-coverage.test.ts`: 23/23 passed (11.24s). Covers type-only named/star exports, attempted value use through type-only barrels, candidate-relevant export-star cycles fail-closed, and explicit callable export precedence over an unrelated star cycle.

A first filtered concurrent probe of one parameterized case hit the default 5s timeout under load. That was the filter, not the seam. The whole-file run is the authoritative result.

Graph values after the audit-logic head are the published values. The type-only/cycle fix is test-only and does not change product graph counts:

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

`pnpm --silent sdp:q --json` over the live corpus. 177 extract anchors remain the validate banner; graph `Anchor` nodes stay the derived subset (85). Operational backlog empty.

## `origin/main` stale-signal

`git archive origin/main` (`bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`) extracted to a disposable root. That archive has no `specs/extraction/delivery-facts.sdp.md`. Queries used this worktree's built `dist/cli/sdp.js` with the documented excludes and `--root` on the archive.

| Probe | exit | stdout | stderr | stderr text |
| --- | ---: | ---: | ---: | --- |
| `typeof g.specContext("spec:extraction.delivery-facts")` | `0` | `26` | `0` | `{"type":"undefined"}` |
| published delivery-facts Try-it query | `1` | `0` | `71` | `sdp q: Cannot read properties of undefined (reading 'statedReadiness')` |
| historical `.found` contrast (not published) | `1` | `0` | `61` | `sdp q: Cannot read properties of undefined (reading 'found')` |

Readiness query on `origin/main`:

```
[
  { id: 'spec:decisions.architectural-significance-rides-primitives', stated: undefined, derived: undefined },
  { id: 'spec:decisions.jsdoc-graph-extraction-refused', stated: undefined, derived: undefined },
  { id: 'spec:model.structural-patterns', stated: 'idea', derived: 'idea' },
  { id: 'spec:protocol.structural-self-binding', stated: 'idea', derived: 'scoped' }
]
```

`component:` nodes: `[]`. Three CodeNodes, all skill-test `impl:` ids; `memberOf` 0; `uses` 0.

The published query's first property read is `c.statedReadiness`. The `.found` error is a different historical probe and is not the published failure. Live `pr-body.md` and `final-verification.md` name `statedReadiness` only for that query. `f3-remediation.md` still records the historical `.found` probe as the explanation of the old stale claim.

## Graph / ledger checks

Ledger archives under `.omo/evidence/pr-25-review-remediation/ledger/`:

| Archive | Records | SHA-256 | Source `cmp` |
| --- | ---: | --- | ---: |
| `architecture-and-prior.jsonl` | 135 | `6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719` | `0` vs `5c15962584f5d21f9a2be0cb0f7a325c21a9267f:.omo/start-work/ledger.jsonl` |
| `design-law-transfer-pre-delete.jsonl` | 20 | `df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90` | `0` vs `d8d4e5f50b2802ea9127819c6953578cfe9618f5:.omo/start-work/ledger.jsonl` |
| `design-law-transfer-post-delete.jsonl` | 12 | `5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1` | hash match; 12 JSONL records |

Concatenated count 167. This lane did not read, stage, or rewrite `.omo/start-work/ledger.jsonl`.

## Cleanup

Removed the disposable `origin/main` archive and session capture files under `/tmp/sdp-f3-final2*` after recording. No watcher, port, generated-state writer, live PR write, or runtime-ledger mutation remains. `generated/` is gitignored and was not staged.
