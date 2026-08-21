# task-9 design-law-transfer evidence

Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-9`
Branch: `design-law-transfer/todo-9`
Task id: `st_01a023e1`
Parent session: `01a023a8-efe9-7fad-8e3c-a5e07a2fb2a4`
Scope: full gate, live re-measure, PR-body artifact for orchestrator application. No base-branch push. No `gh pr edit`.

## Landing-rule deviation (recorded)

Plan todo 9 names `git push origin feature/architectural-patterns-views` and `gh pr edit 25`.
Orchestrator landing rules reserve base-branch push and external PR edit. This lane:

- DID NOT push, force-push, or `gh pr edit`
- DID inspect `git remote -v`, `gh auth status`, and `gh pr view 25 --json body,headRefName,state`
- DID write the exact updated full PR body to `.omo/evidence/pr-25-design-law-transfer-body.md`

Intended orchestrator commands (not executed here):

```
git push origin feature/architectural-patterns-views
gh pr edit 25 --body-file .omo/evidence/pr-25-design-law-transfer-body.md
```

Prepared body path: `.omo/evidence/pr-25-design-law-transfer-body.md`
Prepared body sha256: `082ec7f4fbe73a4e668c92bd59face71987c74432b7b3089e97dd1bd27772805`
Bytes: `9795`

Transport (read-only verify):

- `origin` fetch/push: `git@github.com:libar-dev/software-delivery-protocol.git` (SSH)
- `gh auth status`: logged in as `darko-mijic`; Git operations protocol `ssh`; scopes `gist`, `read:org`, `repo`
- PR #25: `state=OPEN`, `headRefName=feature/architectural-patterns-views`; body inspected only (8330 chars at view time)

## Worktree-local CLI

`node_modules/` and `dist/` were absent at checkout. `npm ci` (201 packages) then `npm run build` produced a real local binary:

```
realpath dist/cli/sdp.js
/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-9/dist/cli/sdp.js
```

`find dist -type l` empty. All `sdp` / `sdp:q` measurements used this binary. Not a symlink into another worktree.

## Gate

`npm run check` was required more than once because the first attempts failed for traced reasons (not retries of a silent flake). The passing invocation:

```
cd /home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-9 && npm run check
CHECK_EXIT=0
```

Prior attempts (same worktree, recorded):

1. Exit 1 at `check:temporal` — tracked `.omo/start-work/ledger.jsonl` (Wave 2 omo close) carries an ISO timestamp. `.omo/start-work/` is not in the temporal exemption list (drafts/plans/evidence only). File removed from the index (`git rm`) so the sweep can pass. Not suppressed.
2. Exit 1 at `eslint` — todo 4 census used `Array<{...}>` and interpolated `memberships.length` into a template. Fixed in `test/self-hosting-graph.test.ts`.
3. Exit 2 at `tsc` — `acceptedIds.has(edge.from)` failed because the Set was inferred as a union of impl literals. Annotated `Set<string>`.
4. Exit 0 — full gate.

Passing-gate warning identities (not exit alone):

Self-hosting generate/validate: `0 errors · 5 warnings`, exactly the pinned `honesty/gaps` subjects:

- `spec:carrier.markdown-authoring`
- `spec:extraction.claim-taxonomy`
- `spec:model.pack-aggregate`
- `spec:model.relations`
- `spec:model.spec-sections`

Example generate/validate: `0 errors · 1 warnings` — intentional `conformance/verifies-linkage` on `spec:orders.create-order.invalid-cart`.

No sixth honesty warning. Tracer carries a verifier. Decision Spec is kind-exempt.

Confirmatory `npm test` after the green gate (counts, not a second check):

```
Test Files  62 passed (62)
Tests  847 passed | 1 skipped (848)
```

plus the follow-on suite `Test Files 1 passed (1) / Tests 80 passed (80)` from the same `npm test` script. `TEST_EXIT=0`.

`preflight` on the passing check inspected `test/self-hosting-graph.test.ts` and the ledger deletion and exited 0.

## Re-derived literals (live `sdp:q` after the green gate)

Every number below is re-derived from the worktree-local CLI. Not transcribed from plan arithmetic. Generated `graph.json` after `generate:self-hosting` matches these counts (`342` nodes, `760` edges, `164` Primitive, `1` Pack, `92` CodeNode, `85` Anchor, `76` memberOf, `35` uses, `46` decidedBy, `13` components).

| Literal | Live value |
| --- | --- |
| specs | `164` |
| packs | `1` |
| anchors (CodeNode + Anchor) | `177` (`CodeNode` 92 · `Anchor` 85) |
| nodes | `342` |
| edges | `760` |
| readiness | `{ ready: 148, defined: 11, idea: 4, scoped: 1 }` |
| components | `13` |
| memberOf | `76` |
| uses | `35` |
| decidedBy | `46` |
| satisfies | `92` |
| belongsTo | `164` |
| decision Specs | `35` |
| inter-decision dependsOn | `14` |
| supersedes | `0` |

`spec:extraction.delivery-facts`: stated `ready`, derived `ready`, facts `["implemented","has-verifier"]`, one implementation `impl:protocol.delivery-facts`, one verifier `test:protocol.delivery-facts`.
`spec:extraction.derive-graph` still has both delivery facts.
`spec:decisions.jsdoc-graph-extraction-refused`: stated `ready`; relations `refines spec:model.anchors`, `dependsOn` MD-14 and MD-30, `belongsTo pack:self-hosting-v1`.
`spec:model.structural-patterns` and `spec:protocol.structural-self-binding` remain stated `defined` (derived `ready`). Self-binding carries `["has-verifier"]`.

## Recipe 1 — operational backlog (catalog body, live)

```
total: 0
byFamily: {}
excludedReadyExamples: 66
excludedReadyDecisions: 35
excludedWithoutVerifier: []
```

Empty operational backlog. No new ready-unimplemented implementation work from this slice. The tracer is implemented. The refusal decision is kind-excluded.

## Recipe 17 — exact surviving fill rows (catalog body, live)

Four survivors only. Dropped example-runner to `spec:decisions.binding-not-liveness` is absent. `unresolvedUses: []`. `components: 13`.

| Subject | Decision | Component rows |
| --- | --- | --- |
| `spec:extraction.derive-graph` | `spec:decisions.one-validation-path` | `component:protocol.extract` |
| `spec:validation.authored-honesty` | `spec:decisions.binding-not-liveness` | `component:protocol.validate` |
| `spec:consumers.reader` | `spec:decisions.agent-surface-scripts-graph` | `component:protocol.reader` |
| `spec:extraction.executable-contracts` | `spec:decisions.point-per-example` | `component:protocol.codegen`, `component:protocol.graph` |

`derive-graph` no longer appears on `component:protocol.graph` for this fill: `impl:protocol.delivery-facts` now satisfies the tracer, not the parent. Recorded as live join, not a missing edge.

MD-35 does not surface on a component `shapingDecisions` row. It is a decision Spec (recipe 18), not a realized carrier subject of the architecture-map join.

## Recipe 19 — `spec:extraction.delivery-facts` (catalog body, live)

`found: true`

- parents: `spec:extraction.derive-graph`; children: none
- implementations: `impl:protocol.delivery-facts` (`src/graph/delivery-facts.ts:44`, claim `anchored`)
- verifiers: `test:protocol.delivery-facts` (`test/extract.test.ts:815`, via `test-anchor`, enabled)
- components: `component:protocol.graph` (not direct; implementations `impl:protocol.delivery-facts`)
- shapingDecisions: `spec:decisions.binding-not-liveness` (subject: the tracer); `spec:decisions.one-validation-path` (subject: parent `derive-graph`)
- entryPoints: spec carrier, implementation, component file, verifier file

Generated design-review page exists after gate regeneration:

```
generated/design-review/spec/extraction.delivery-facts.md
```

(`generated/` is gitignored; existence checked on disk, not staged.)

## Six non-blocking questions (live)

Each of the six carriers has exactly one `blocking: false` question. Readiness unchanged: five `ready`, `spec:consumers.projections-model` `defined`. No claim that projections-model became ready.

## Adversarial probes

| Class | Probe | Result |
| --- | --- | --- |
| stale_state | Worktree-local `dist` realpath; live `sdp:q` after gate regenerate; compare `generated/graph.json` | PASS — realpath is this worktree; generated counts equal live query |
| generated/cached artifacts | Design-review page and graph.json vs live graph | PASS — page exists; graph totals match live `sdp:q` |
| dirty_worktree | Gate started on a clean lane; final commit is evidence + required gate repairs | PASS with recorded extras — see below |
| hung/long_commands | `npm run check` bounded; no sleep/poll | PASS — passing check completed in one invocation after the traced fixes; no waits |
| misleading_success_output | Warning identities and suite counts, not exit alone | PASS — five named honesty/gaps, one named verifies-linkage; confirmatory 62 files / 847 passed / 1 skipped plus 80/80 |
| parser | No parser change in this todo | N/A |
| external_text | No foreign corpus ingest | N/A |
| resumable_flow | No resumable session | N/A |
| timing/interrupt | No clocks or watches | N/A |

Dirty-worktree extras (required for CHECK_EXIT=0, not leftover junk):

- delete tracked `.omo/start-work/ledger.jsonl` (temporal token in a non-exempt path)
- lint/type fixes in `test/self-hosting-graph.test.ts` (todo 4 census left the gate red)

Final intended commit also includes the two evidence artifacts. `generated/` and `node_modules/` / `dist/` remain gitignored.

## Cleanup receipt

- Worktree-local `npm ci` / `npm run build` / gate writes left gitignored `node_modules/`, `dist/`, `generated/`.
- `/tmp/sdp-recipe-*.js` and `/tmp/sdp-r*.json` used for recipe bodies; not in the repo.
- No `git push`. No `gh pr edit`. Main checkout was not edited as a product branch.
- `git diff --check` expected clean on owned files.

## Risks

- Orchestrator must apply the prepared PR body and push `feature/architectural-patterns-views`. Until then PR #25 still shows the pre-slice description and `git log origin/feature/architectural-patterns-views..HEAD` is not this lane's job.
- Recipe 17's derive-graph fill now lands only on `component:protocol.extract`. A reader comparing to todo-5 evidence (extract + graph) will see the graph row drop because the delivery-facts retarget removed that parent `satisfies` from the graph component.
- Index `assume-unchanged` bits on this worktree hide ordinary diffs until `git update-index --no-assume-unchanged`.
- Future omo start-work ledgers must not be committed: `check:temporal` will fail them.
