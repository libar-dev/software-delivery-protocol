# F1 plan-compliance audit — PR 25 review remediation (final)

Task: `st_01a02539`
Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-final2-f1`
Shape: Review (plan compliance only)
Plan: `.omo/plans/pr-25-review-remediation.md`

Exact published/remediated head: `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c`
Parent: `6a35bd29fe8d4e236d1290529f045fcbc5875e71`
Base: `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`
Reviewed pre-remediation head: `5584ed91cf2c3efbf31ad83c28054febd0ec62b7`
First published remediation head: `91992f11acc33867b857971f5e9a429a391926b4`

No product, plan, Boulder, ledger, PR, or push edit. This file is the only tracked write.

## Verdict

**APPROVE**

No skipped blocker. No stale claim treated as current. Live remote, live PR body, and required checks equal `2ef4a7a`. Todos 1–7 are evidenced. Todo 8 publication is independently re-measured at this head. First F2/F3 final rejections were real, remediations landed with matching patch IDs, and the Oracle fail-closed contract is the accepted structural audit.

Plan checkboxes for Todo 8 and F1–F4 remain `[ ]` on this head. That is required, not incomplete: those four boxes plus Todo 8 are finalized only in the orchestrator's post-review close commit.

```json
{
  "type": "FinalAudit",
  "audit": "F1",
  "plan": "pr-25-review-remediation",
  "verdict": "APPROVE",
  "head": "2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c",
  "base": "bb97d829eea7b3689d5d8569d307e1bb5e77fd0d",
  "pr": "https://github.com/libar-dev/software-delivery-protocol/pull/25",
  "worktree": "/home/darkomijic/dev-libar/software-delivery-protocol-pr25-final2-f1",
  "planCheckboxesReservedForOrchestratorClose": ["8", "F1", "F2", "F3", "F4"]
}
```

## Method

Graph queried first from the same-SHA integration tree (`2ef4a7a`, built CLI present) because this detached F1 worktree has no `node_modules`/`dist`. Corpus identity is the published head, not the helper tree.

Live transport re-measured with `gh pr view 25`, `gh pr checks 25`, `git ls-remote origin refs/heads/feature/architectural-patterns-views`, and byte comparison of the live body to committed `pr-body.md`.

Lane, F2, and F3 identities re-measured with `git patch-id --stable`, `git show --stat`, ledger SHA-256/`cmp`, and gate-log SHA-256.

First F2 REJECT recovered from the committed review file that existed at `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-final-f2/.omo/evidence/pr-25-review-remediation/f2-code-quality.md` (worktree now removed) and is preserved in session facts `20260821T152954984Z-8ee311e68a14-13de7630`. First F3 REJECT recovered from `f3-remediation.md` plus the orchestrator dispatch that opened `st_01a024f3` after the published Try-it claim named the wrong dereference.

## Current publication identity

| Surface | Value | Match |
| --- | --- | --- |
| Detached F1 HEAD | `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c` | yes |
| `git ls-remote origin feature/architectural-patterns-views` | `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c` | yes |
| `gh pr view 25 --json headRefOid` | `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c` | yes |
| `baseRefOid` | `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d` | yes |
| PR state / title / URL | OPEN / Architectural significance rides existing primitives / PR #25 | yes |
| Live body vs committed `pr-body.md` | 19229 committed bytes, SHA-256 `f713815ede896da7ba9d980a50339bb59ae63db84b73d13b6655870cc6348d87`; live has only GitHub's extra terminal newline | yes |
| Required checks | both named `check`, `SUCCESS`, `head_sha` `2ef4a7a` ([run 32504618807](https://github.com/libar-dev/software-delivery-protocol/actions/runs/32504618807/job/96841874572), [run 32504617480](https://github.com/libar-dev/software-delivery-protocol/actions/runs/32504617480/job/96841877242)) | yes |
| Remote / `gh auth` | `git@github.com:libar-dev/software-delivery-protocol.git`, SSH | yes |

`task-8-publication.md` is the first-publication receipt at `33cc0aa`, not a current-head claim. Current republication is independently re-measured above. Treating that file as the live OID would be stale; it is historical first-wave evidence.

## Graph (recipe-shaped, re-derived)

`sdp:q` at `2ef4a7a`:

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
  "operationalBacklog": [],
  "errorCount": 0
}
```

85 graph `Anchor` nodes plus extract-banner 177 anchors remain the documented split. Warn-level signals: five honesty/gaps warnings on `spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`.

Target contexts:

| Spec | stated | derived | facts |
| --- | --- | --- | --- |
| `spec:decisions.architectural-significance-rides-primitives` | ready | ready | [] |
| `spec:decisions.jsdoc-graph-extraction-refused` | ready | ready | [] |
| `spec:model.structural-patterns` | defined | ready | [] |
| `spec:protocol.structural-self-binding` | defined | ready | `has-verifier` |
| `spec:extraction.delivery-facts` | ready | ready | `implemented`, `has-verifier` |
| `spec:consumers.agent-surface` | ready | ready | `implemented`, `has-verifier` |
| `spec:consumers.delivery-session-on-ramp` | ready | ready | `implemented`, `has-verifier` |
| `spec:decisions.structural-anchor-semantics` | ready | ready | [] |

Recipe 19 edges for structural-anchor-semantics: outgoing `dependsOn` to `spec:decisions.binding-not-liveness`; inbound from MD-34 and MD-35. Both arrays non-empty on the live graph.

## Authoritative full-gate history

Honest accounting, not a reconstructed lost receipt:

1. Initial Todo-7 `npm run check` succeeded. Raw `/tmp` receipt was later deleted and is irrecoverable. Documented in `final-verification.md`. Not used as the durable receipt.
2. Authorized recovery gate at exact clean `34a5440ad24e8a512e7ef2d685df2ba73c81f88d`. Receipt `full-gate.log`: 465 lines, 30,106 bytes, SHA-256 `579854b85b37b14f33404a977952d6e6dfd7aa8ef552abe164e0c3354bcb4a3f`, `CHECK_EXIT:0`. Totals: 63 files, 862 passed / 1 skipped (863); CLI 80/80.
3. Final-integration setup probe at `6a35bd2` before `npm ci`: `eslint: command not found`, `CHECK_EXIT:127`. Environmental, not a code/test gate. SHA-256 of the 17-line payload `160642ddb25b1453ae3b5132f6e1afd6069e550db261bdf1e120fc8557c7ddf8`.
4. One environment-corrected actual final gate at `6a35bd29fe8d4e236d1290529f045fcbc5875e71`. Receipt `full-gate-final.log`: 465 lines, 30,002 bytes, SHA-256 `07f43f8d58d59eebc4d2d0048c9e872f80b900b5e2d99f77148b519dcfb00914`, `CHECK_EXIT:0`. Totals: 63 files, 874 passed / 1 skipped (875); CLI 80/80. The +12 tests are the F2 fail-closed matrix.

Stages in both retained receipts appear once, in order: `check:temporal` → `lint` → `format:check` → `build` → `generate:self-hosting` → `generate:example` → `typecheck` → `typecheck:examples` → `test` → `check:self-hosting-gates` → `check:self-hosting` → `check:example` → `preflight`.

`2ef4a7a` remasured evidence and the publication body after that gate. It did not rerun the full gate; focused postchecks in `final-remediation-close.md` are 50/50 structural, 33/33 recipes, typecheck 0, temporal 0.

## First F2/F3 final rejections

### First F2 REJECT — published head `91992f1`

Durable review file (now-removed worktree `software-delivery-protocol-pr25-final-f2`):

- Verdict: **REJECT**
- Focused gates were green (recipes 33/33, structural+self-hosting 38/38, typecheck 0).
- Blocking defect: `runtimeFunctionExport` called `getAliasedSymbol` before proving the export declaration was value-bearing. A diagnostics-clean `export type { helper }` barrel returned `covering source does not value-consume unit` instead of `exported unit missing`. An adversarial value import through that type-only barrel returned `ok`.
- Live six-row census stayed green because every current roster unit is a direct runtime function export. That did not clear the generic audit defect.
- Reopened Todo 4.

Rejected resolver history (not cherry-picked):

| Commit | Subject | Why rejected |
| --- | --- | --- |
| `79d7529` | reject type-only barrel exports | saw `export type { ... }`, missed `export type *` |
| `e864410` | reject type-only export stars | inherited declaration-order selection; could bless one of two runtime origins |
| `7f6151c` | resolve runtime export candidates | memoized an active-cycle empty as a partial success |

### Oracle fail-closed contract (accepted)

Test-only conservative certification, not a TypeScript linker. Exactly one callable runtime value may resolve through a direct declaration, a non-type named alias/re-export, or an acyclic non-type export-star path. Type-only named and star exports contribute no candidate. Missing/malformed input, multiple runtime origins, and candidate-relevant export-star cycles return `exported unit missing`. An explicit non-type named export keeps TypeScript precedence over unrelated cyclic stars. Consumption is a separate exact-local-binding direct-call proof. The helper derives no graph edge, membership, or product fact.

Failing-first evidence against the published helper: 7 failed / 16 passed.

### Clean-base F2 fix integrated

| Field | Value |
| --- | --- |
| Clean-base commit | `cd7050b32ea518327adcb21a38f2eef318cb8183` on `work/pr25-f2-failclosed` |
| Integrated as | `00c6354048c9ce3ea0473847c75e78bf2bf322be` |
| Parent of integration | `91992f11acc33867b857971f5e9a429a391926b4` |
| Stable patch id | `955f02043c8a4a3923a4c8b542b1786fcd7fbca1` (both sides) |
| Files | `test/helpers/runtime-export-resolver.ts`, `test/helpers/structural-coverage.ts`, `test/structural-coverage.test.ts`, `f2-remediation.md` |

`cd7050b` is not an ancestor of `00c6354`; they are same-patch siblings on different bases. That is the intended cherry-pick.

### First F3 REJECT — published head `91992f1`

Publication claimed the `origin/main` Try-it delivery-facts failure was `Cannot read properties of undefined (reading 'found')`. That error belongs to a historical `.found` probe, not the published query, which reads `c.statedReadiness` first after `specContext` returns `undefined`. Live archive against `bb97d82` produced `sdp q: Cannot read properties of undefined (reading 'statedReadiness')` (exit 1, 71-byte stderr). Orchestrator opened `st_01a024f3`.

### F3 correction integrated

| Field | Value |
| --- | --- |
| Clean-base commit | `2d4ae664fffb1f95428ae4a6d7354522dad7b2b6` on `work/pr25-f3-remediation` |
| Integrated as | `6a35bd29fe8d4e236d1290529f045fcbc5875e71` |
| Parent of integration | `00c6354048c9ce3ea0473847c75e78bf2bf322be` |
| Stable patch id | `6847e838c7f04a9bffa472a4415ca831e987e6ea` (both sides) |
| Files | `f3-remediation.md`, `final-verification.md`, `pr-body.md` |

No code or expected branch-success output changed. Stale `reading 'found'` publication prose is absent from current `pr-body.md`.

## Todo criterion map

### Todo 1 — checkpoint — PASS

| Criterion | Result |
| --- | --- |
| Commit | `3c603e3cba716fb91fed24ec75aeff50ebcc451f` `chore(omo): checkpoint PR 25 remediation plan` |
| Files | Boulder, both drafts, plan, `task-1-baseline.md` only |
| Base/head/remote/SSH | `bb97d82` / `5584ed91` / SSH GitHub recorded and re-checked |
| Failure QA | counterfactual stale head and unrelated staged path refuse |
| `design-law-transfer.md` checksum | `e35e92656ac54b7ddd2ea0f02f9e2a730a8cdfbbdb966845485ad94344a0f26f` preserved |
| Product paths | none |

### Todo 2 — recipe totality — PASS

| Criterion | Result |
| --- | --- |
| Original / integrated | `a6460b6` / `40b9950` |
| Patch id | `279292289cab3a2cbe9b6150d189fe070c702ba0` once |
| Red proof | recipes 1/11/18 `.push is not a function` on `constructor` |
| Implementation | only three `Object.create(null)` accumulators at catalog lines 99, 447, 798 |
| Green | focused recipes 32/32 then 33/33 after Todo 3 |
| Hostile families | `constructor`, `toString`, `valueOf`, `hasOwnProperty` own JSON keys |
| Guardrails | no `__proto__` test, no reader API, no ID sanitization |

### Todo 3 — recipe 19 dependencies — PASS

| Criterion | Result |
| --- | --- |
| Original / integrated | `c92d873` / `3137f12` |
| Patch id | `f2d6afcf3b9742e16b6801de0cd204357628f2c1` once |
| Depends on Todo 2 | parent of original is `a6460b6` |
| Pin | `dependsOn` = binding-not-liveness ready; `dependedOnBy` = MD-34 and MD-35 ready |
| Failure QA | in-memory no-outgoing, no-incoming, reversed-edge probes |
| Catalog/graph edit | none |
| Live re-query | same three edges present now |

### Todo 4 — coarse coverage — PASS

| Criterion | Result |
| --- | --- |
| Original / integrated | `e33fabd` / `cd65717` |
| Patch id | `4c6517f69fd28405c9171053640b7aa0a6b469e4` once |
| Red | 9 failed / 29 passed against skeleton `ok` |
| Failure taxonomy | missing export vs missing consumption distinguished |
| Later F2 | first final F2 rejected the remaining type-only/cycle hole; not skipped |

### Todo 5 — ledger recovery — PASS

| Archive | Records | SHA-256 | Source `cmp` |
| --- | ---: | --- | --- |
| `architecture-and-prior.jsonl` | 135 | `6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719` | 0 vs `5c15962:.omo/start-work/ledger.jsonl` |
| `design-law-transfer-pre-delete.jsonl` | 20 | `df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90` | 0 vs `d8d4e5f:.omo/start-work/ledger.jsonl` |
| `design-law-transfer-post-delete.jsonl` | 12 | `5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1` | 0 vs current ignored primary ledger (12 design-law records, same hash) |

Concatenated count 167. Runtime path still ignored (`.gitignore:25:.omo/*`), untracked. `AGENTS.md` carries the runtime-to-durable checkpoint rule. Failure QA: one-byte-short streams change hash and fail `cmp`. Original/integrated `dcf35aa` / `6b5e614`, patch id `880487100f89495ae50d852baa4588f8fe07b661`.

### Todo 6 — review record + whitespace — PASS

| Criterion | Result |
| --- | --- |
| Original / integrated | `8b96eb8` / `b1ebd8d` |
| Patch id | `1fdcc5a2d721032ea1322601732ffe412c63926a` |
| Baseline | 13 trailing-space findings on `5584ed91` |
| Current blobs | SHA-256 `d66031a7…`, `4f5dbe43…`, `10310ddb…`; scoped `rg ' +$'` empty |
| `git diff --check origin/main...HEAD` | exit 0 |
| Mapping | every failed-review item maps to Todos 2–8 |

### Todo 7 — integrate, gate, remasure — PASS

Cherry-pick order after Todo 1: 2 → 3 → 4 → 5 → 6, each patch id once. Typecheck narrowing stayed in `test/recipes.test.ts`. Recovery and final gates recorded above. Scope `5584ed91...HEAD` is only planned docs/tests/OmO paths; no `src/`, `specs/`, packages, lockfile, generated output, or completed-plan path. Wave-2 `src/` remains the one-file `delivery-facts.ts` delta from `ed77ee7...5584ed91`.

Boulder updates only `works.pr-25-review-remediation`. `current_commit` is the gated code head `6a35bd2` because a close-evidence commit cannot name its own SHA; `2ef4a7a` then remasured on top. `completed_todo` stays `6`. Prior completed works, including `design-law-transfer` at `315a0d8`, are untouched.

### Todo 8 — publish and clean — PASS as executed work, checkbox reserved

First publication: non-forced `5584ed9..33cc0aa`, body edit of existing PR #25, checks green at that OID, first-wave lanes and `/tmp/sdp-review-architectural-patterns-views` removed. Receipt: `task-8-publication.md`.

Republication after F2/F3: live remote/body/checks now equal `2ef4a7a` (table above). No force. Plan box `[ ] 8` remains unmarked.

## Dependency matrix

| Todo | Plan depends on | Observed |
| --- | --- | --- |
| 1 | none | first remediation commit |
| 2 | 1 | based on `3c603e3` |
| 3 | 2 | based on `a6460b6` |
| 4 | 1 | based on `3c603e3` |
| 5 | 1 | based on `3c603e3` |
| 6 | 1 | based on `3c603e3` |
| 7 | 2–6 | all five patch ids present once, then remasurement |
| 8 | 7 | first published after close; republished after F2/F3 gate |
| F1–F4 | 8 | this wave runs at the republished head |

No skipped dependency. F2/F3 remediations reopened only their owning seams (Todo 4 helper; publication prose) and republication evidence.

## File-boundary / Must-NOT audit

`git diff --name-only 5584ed91..2ef4a7a` contains no `src/`, `specs/`, `examples/`, `explorations/`, `package.json`, `package-lock.json`, generated projection, or root `plans/` path. No new dependency. No graph schema, reader API, relation type, validator, Pack, or `uses` change. Runtime ledger remains ignored and untracked. Historical plan/evidence rewritten only for the 13 proven trailing spaces plus the two F3 publication sentences that named the wrong stale-main property.

## Cleanup to date

Gone (first wave and first final review):

- `software-delivery-protocol-pr25-recipe-totality`
- `software-delivery-protocol-pr25-structural-coverage`
- `software-delivery-protocol-pr25-ledger-recovery`
- `software-delivery-protocol-pr25-review-evidence`
- `software-delivery-protocol-pr-25-review-remediation`
- `software-delivery-protocol-pr25-f2-remediation`
- `software-delivery-protocol-pr25-final-f1` … `final-f4`
- `/tmp/sdp-review-architectural-patterns-views`
- `/tmp/sdp-qa-pr25`
- `/tmp/sdp-f3-main-x2y04E`
- `/tmp/sdp-structural-coverage-*`

Still present, all clean, owned by this final wave or retained remediations:

| Path | HEAD | Role |
| --- | --- | --- |
| `software-delivery-protocol-pr25-f2-failclosed` | `cd7050b` | accepted F2 clean-base |
| `software-delivery-protocol-pr25-f3-remediation` | `2d4ae66` | accepted F3 clean-base |
| `software-delivery-protocol-pr25-final-integration` | `2ef4a7a` | integration / republication source |
| `software-delivery-protocol-pr25-final2-f1` … `f4` | `2ef4a7a` detached | this final review wave |
| primary checkout | `5584ed9` `feature/architectural-patterns-views` | user checkout, behind remote by design until the user updates it |

Lane branch refs are preserved. Primary checkout was not rewritten. This F1 task does not remove sibling review or remediation worktrees.

## Plan checkbox state at this head

```
[x] 1–7
[ ] 8
[ ] F1
[ ] F2
[ ] F3
[ ] F4
```

Finalized only in the orchestrator's post-review close commit. This audit does not mark them.

## Findings

None blocking.

1. **non-blocking — historical Todo 8 receipt names `33cc0aa`.** Correct first-publication record. Current head is re-measured live.
2. **non-blocking — Boulder `current_commit` is `6a35bd2`.** Documented close-evidence naming rule; `2ef4a7a` is the remasurement/publication commit on top.
3. **non-blocking — first F2/F3 review files lived in removed `pr25-final-f*` worktrees.** Rejection content is recovered from session facts and the committed remediations; the blockers were not dropped.
4. **non-blocking — LSP daemon still unreachable.** Authoritative substitutes remain typecheck, focused suites, and the two retained full-gate receipts.

## Residual risk

`test/recipes.test.ts` remains far above 250 pure LOC. Recipe family totality is still three catalog-local `Object.create(null)` maps. Neither is a plan violation.

## Cleanup from this audit

Removed `/tmp/pr25-live-body-f1.txt` after the body comparison. No watcher, install, generated-state writer, or extra worktree was created.
