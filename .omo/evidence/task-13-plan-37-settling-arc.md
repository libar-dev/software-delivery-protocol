# Task 13 — I-4 extraction: adopt-or-refuse 9 sites / 5 families

Status: complete for the lane-safe path. Serialized byte-gates (`npm run check:self-hosting`, `npm run preflight`, `generate:*`, `npm run check`) were **not** run — this wave forbids them.

Task: `st_01a01b22` · lane `w2-t13` · file owner `test/self-hosting-extraction.test.ts`

## Final disposition (unambiguous)

**5 ADOPT / 4 REFUSE** across five families.

Adopted: `same-invocation`, `segment-boundary`, `refused-path`, `declared-version`, `red-step-naming`.

Refused: `concreteness-refusal`, `multi-entry-example`, `case-colliding-path`, `step-order`.

Refusal is complete: each refused example keeps `bindExample`, its generated sibling stays untracked, and its `anchors.ts` pin stays `bindExample`.

## Outcome summary

| Family | Sites | Disposition |
| --- | --- | --- |
| `extraction.build-pipeline` | same-invocation | **ADOPT** |
| `extraction.excludes` | segment-boundary, refused-path | **ADOPT** both |
| `extraction.schema-versioning` | declared-version | **ADOPT** |
| `extraction.executable-contracts` | concreteness-refusal, multi-entry-example, case-colliding-path | **REFUSE** all 3 |
| `extraction.example-runner` | step-order, red-step-naming | **SPLIT: REFUSE 1 / ADOPT 1** |

Accounting: **5 adopted + 4 refused = 9 examples**.

## Per-example product-call table

Judge each example by the product calls its own Thens require. Unused shared-binding work is not a refuse reason. Cleanup registries are not shared worlds: `createWorld` mints a fresh temp root or in-memory state per example.

| Example | Thens that must be satisfied | Product calls required by those Thens | Disposition |
| --- | --- | --- | --- |
| `same-invocation` | query exits `{exitCode}`; both graph entrances return `{returnedSpecId}`; validation report names `{findingSubjectId}` | one `runSdpCli(["q", …])` — the combined query API returns reader, graph, and findings | **ADOPT** |
| `segment-boundary` | discovery `{outcome}`; surviving spec carrier + anchor candidate | one `discoverFiles` | **ADOPT** |
| `refused-path` | discovery `{outcome}`; refusal diagnostic + offending path | one `discoverFiles` (throws) | **ADOPT** |
| `declared-version` | payload declares `{schemaVersion}` | Given materializes `deriveGraph`; When is one `serializeGraph`; observe reads the payload | **ADOPT** |
| `concreteness-refusal` | generated tree `{fileCount}`; step contract `{emitted}` | one `generateContracts` would suffice, but the generated registrar refuses the authored partial point before any adapter runs | **REFUSE** — incomplete-point proof below |
| `multi-entry-example` | step contract `{emitted}`; findings name `{findingId}` | one `generateContracts` would suffice; registrar refuses the authored partial point | **REFUSE** — incomplete-point proof below |
| `case-colliding-path` | generated tree `{fileCount}`; findings name `{findingId}` | one `generateContracts` would suffice; registrar refuses the authored partial point | **REFUSE** — incomplete-point proof below |
| `step-order` | handler trace `{trace}`; run `{outcome}` | one `planExample` + `runExamplePlan` pair on a hand-built cart contract would suffice; registrar refuses the authored partial point | **REFUSE** — incomplete-point proof below |
| `red-step-naming` | run `{outcome}`; failure names `{failureLabel}`; original detail `{detail}` | one `planExample` + `runExamplePlan` pair on a hand-built cart contract; observe/assertions are pure reads of the thrown Error | **ADOPT** |

## Per-family ledger

### 1. `extraction.build-pipeline` — ADOPT

Evidence: `createSameInvocationWorld(point)` writes the isolated probe spec into a fresh temp root. When is one `runSdpCli` query with `--json`. That combined API already exposes reader ids, primitive-node ids, and finding subjects. Comparator-owned Outcome is `the query exits {exitCode}` from the actual `exitCode`. The two remaining Thens are different-kind joins in `assertions` via `paramsForStep`. No product call after invoke.

Sibling: `test/extraction.build-pipeline.same-invocation.test.generated.ts` (`registerSameInvocation`).

### 2. `extraction.excludes` — ADOPT

Evidence: `createExcludeWorld(point)` mints a fresh temp tree and writes both discovery surfaces. When is one `discoverFiles`. Comparator-owned Outcome is `the discovery attempt {outcome}` from whether discovery stored files or a refusal. Segment-boundary surviving-path Then and refused-path diagnostic Then live in `assertions`. Shared factory is not a shared world.

Siblings: `test/extraction.excludes.segment-boundary.test.generated.ts` (`registerSegmentBoundary`), `test/extraction.excludes.refused-path.test.generated.ts` (`registerRefusedPath`).

### 3. `extraction.schema-versioning` — ADOPT

Evidence: Given is "a graph derived from the authored spec", so `createWorld` materializes `deriveGraph`. When is one `serializeGraph`. Observe returns the actual `schemaVersion` string from the payload, never the expected argument. Single Then — no assertions callback.

Sibling: `test/extraction.schema-versioning.declared-version.test.generated.ts` (`registerDeclaredVersion`).

### 4. `extraction.executable-contracts` — REFUSE all 3

`generateContracts` is the family's When. Each example's Thens are reads of the one `GeneratedContracts` value (`files.size`, `files.has(path)`, named warning findings). There is no genuine second engine call. The family is refused because the already-generated siblings hardcode every space dimension as `requiredConditions`, and each authored point is partial.

Generated registration shape (all three siblings):

```ts
["dimension", "exampleId", "binding", "entryCount", "twinId"]
```

Authored points vs missing dimensions:

| Example | Generated point | Missing Conditions |
| --- | --- | --- |
| concreteness-refusal | `{ dimension: "n", exampleId: "spec:probe.create-order.unbound", binding: "leaves unbound" }` | `"entryCount"`, `"twinId"` |
| multi-entry-example | `{ dimension: "n", exampleId: "spec:probe.create-order.multi", binding: "binds", entryCount: 2 }` | `"twinId"` |
| case-colliding-path | `{ dimension: "n", exampleId: "spec:probe.create-order.same-case", binding: "binds", twinId: "spec:probe.create-order.same-Case" }` | `"entryCount"` |

Exact registrar errors (temporary probe registered the three siblings with dummy adapters, then deleted):

```text
scenario spec:extraction.executable-contracts.concreteness-refusal: oracle comparison refused for incomplete point; missing Conditions: "entryCount", "twinId"
scenario spec:extraction.executable-contracts.multi-entry-example: oracle comparison refused for incomplete point; missing Conditions: "twinId"
scenario spec:extraction.executable-contracts.case-colliding-path: oracle comparison refused for incomplete point; missing Conditions: "entryCount"
```

`src/testing/index.ts:38` computes `missingConditions` from that hardcoded list before `createWorld` runs; `compareContractOutcome` refuses before `observe`/`assertions`. Same registrar-contract refusal as task-8 consumers. Filling unused slots in `createWorld` cannot help: the check is on the generated `point` object, not the world. Inventing `entryCount`/`twinId` values the Spec does not bind would be contortion.

Original `bindExample(..., contractsWorld, contractsBindings)` remains for all three. Siblings stay untracked.

### 5. `extraction.example-runner` — SPLIT

The family tests the runner stack through a hand-built cart contract. A registrar (itself runner-shaped) can host that honestly: the outer registrar executes the extraction example; `invoke` plans and runs a *different* inner contract (`spec:probe.cart`). That is not circularity and not a hidden second execution of the outer example.

`red-step-naming` binds every required condition (`occurrences`, `failingPhase`, `thrown`) and is adopted: When is the realizing pair `planExample` + `runExamplePlan` named by `spec:extraction.example-runner`; observe returns the actual run outcome; failure-label and original-error-identity Thens are pure reads in `assertions`.

`step-order` would use the same invoke/observe shape, but its generated sibling requires `["occurrences", "failingPhase", "thrown"]` while the authored point is only `{ occurrences: 2 }`. Exact error:

```text
scenario spec:extraction.example-runner.step-order: oracle comparison refused for incomplete point; missing Conditions: "failingPhase", "thrown"
```

`step-order` stays on `bindExample(stepOrderContract, runnerWorld, runnerBindings)`. Sibling untracked.

Adopted sibling: `test/extraction.example-runner.red-step-naming.test.generated.ts` (`registerRedStepNaming`).

## Anchor-pin flip table

Do **not** edit `test/self-hosting-oracle/anchors.ts` in this lane. Recorded for the wave-boundary writer. Refused pins stay `bindExample`.

| Anchor id | Current `site:` | Replacement `site:` |
| --- | --- | --- |
| `test:protocol.build-pipeline.same-invocation` | `bindExample(sameInvocationContract` | `registerSameInvocation(` |
| `test:protocol.excludes.segment-boundary` | `bindExample(segmentBoundaryContract` | `registerSegmentBoundary(` |
| `test:protocol.excludes.refused-path` | `bindExample(refusedPathContract` | `registerRefusedPath(` |
| `test:protocol.schema-versioning.declared-version` | `bindExample(declaredVersionContract` | `registerDeclaredVersion(` |
| `test:protocol.example-runner.red-step-naming` | `bindExample(redStepNamingContract` | `registerRedStepNaming(` |

Refused pins unchanged:

- `test:protocol.executable-contracts.concreteness-refusal` → `bindExample(concretenessRefusalContract`
- `test:protocol.executable-contracts.multi-entry-example` → `bindExample(multiEntryExampleContract`
- `test:protocol.executable-contracts.case-colliding-path` → `bindExample(caseCollidingPathContract`
- `test:protocol.example-runner.step-order` → `bindExample(stepOrderContract`

## Freshness (`stale_state`)

```text
specs_commit_epoch=1786847368
specs_commit=2026-08-16 04:29:28 +0200 a35b31d42b8640dfdf779972e5f1e40bd8a4706c
adopted sibling epoch=1787161507
adopted sibling mtime=2026-08-19 19:45:07 +0200
freshness delta=+314139 seconds
```

All five adopted siblings share that newer timestamp. The four refused siblings were inspected at the same fresh timestamp; refusal is the generated completeness contract, not stale-byte avoidance. No generation command was run.

## Tracking receipt

Force-add used lock retry around exactly the five adopted paths:

```text
for i in 1 2 3 4 5; do
  git add -f "${files[@]}" && break
  sleep 1
done
```

```text
tracked adopted siblings: 5
tracked refused siblings: 0
```

Index blob equals worktree blob for each adopted sibling:

```text
7003df86048916514bc1155cc023520ac35e89ac  extraction.build-pipeline.same-invocation
d9b31f10998063446733a681dd345790899d6034  extraction.excludes.segment-boundary
460d5446be4ab5ee1b5c88d927982a9c1669baba  extraction.excludes.refused-path
593a6f72821eb6b7f33d3afdc6058848ff85abf6  extraction.schema-versioning.declared-version
5c1a1dcdd9c96b6ab8cab9638cbf9e37b25ffe47  extraction.example-runner.red-step-naming
```

## Verification transcripts

### Happy path

```text
$ npx vitest run test/self-hosting-extraction.test.ts

 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  20:14:49
   Duration  1.20s (transform 570ms, setup 0ms, import 1.02s, tests 39ms, environment 0ms)
```

Exit: `0`. 9 tests = 5 adopted + 4 refused still executing via `bindExample`.

Site accounting after restore-green:

```text
registerSameInvocation(...)
registerSegmentBoundary(...)
registerRefusedPath(...)
registerDeclaredVersion(...)
bindExample(concretenessRefusalContract, contractsWorld, contractsBindings)
bindExample(multiEntryExampleContract, contractsWorld, contractsBindings)
bindExample(caseCollidingPathContract, contractsWorld, contractsBindings)
bindExample(stepOrderContract, runnerWorld, runnerBindings)
registerRedStepNaming(...)

register count: 5
bindExample count: 4
```

Static checks:

```text
$ ./node_modules/.bin/eslint test/self-hosting-extraction.test.ts
# exit 0
$ ./node_modules/.bin/prettier --check test/self-hosting-extraction.test.ts
Checking formatting...
All matched files use Prettier code style!
$ git diff --check -- test/self-hosting-extraction.test.ts
# exit 0
```

LSP diagnostics were requested; the workspace daemon socket was unreachable. ESLint, Prettier, diff check, and focused Vitest are the executed validators.

### Wrong-import probe (adoption)

Temporarily rewrote the `registerSameInvocation` import to `.test.generated.broken.js`:

```text
$ npx vitest run test/self-hosting-extraction.test.ts
 FAIL  test/self-hosting-extraction.test.ts [ test/self-hosting-extraction.test.ts ]
Error: Cannot find module './extraction.build-pipeline.same-invocation.test.generated.broken.js' imported from /home/darkomijic/dev-libar/software-delivery-protocol/test/self-hosting-extraction.test.ts
 ❯ test/self-hosting-extraction.test.ts:47:1
Test Files  1 failed (1)
      Tests  no tests
```

Exit: `1`. Import restored; focused run returned `9 passed (9)` exit `0` as pasted above.

### Refusal probe

A temporary `test/.tmp-extraction-refusal-probe.test.ts` registered the four refused siblings with dummy adapters. Vitest collected the four generated examples and all four failed with the incomplete-point messages quoted in the family rows. The probe file was deleted immediately; it is not part of the suite.

## Five-adapter friction (verbatim; freeze not reopened)

1. **One-kind comparator vs multi-Then kinds.** Adopted multi-Then examples put only the first Then through `expected`/`observe`. Extra Then params live in `assertions` via `paramsForStep`.
2. **`observe` returns actual product values.** Exit code, discovery outcome, schemaVersion, and run outcome come from stored product results, never from expected arguments.
3. **Combined API is one invocation.** `runSdpCli q --json` already returns reader, graph, and findings. `planExample` + `runExamplePlan` is the realizing pair named by the runner Spec, not two independent engine calls.
4. **Incomplete generated `requiredConditions` is a registrar-contract refuse.** Same as task-8. The adapter surface can express the product call; the generated sibling will not compare a partial authored point.
5. **Runner-on-runner is not circular when the inner contract is a probe.** `red-step-naming` plans `spec:probe.cart`, not the outer example. `step-order` would be the same if its point were complete.
6. **No second `generateContracts`.** The executable-contracts refuse is not the named second-call strain; it is the completeness check. Filling unused family dimensions would be contortion.
7. **Cleanup registries are not worlds.** `temporaryRoots` only lets `afterEach` remove freshly minted roots.

## Adversarial notes

| Class | Disposition |
| --- | --- |
| `stale_state` | Exercised. Adopted sibling mtimes 19:45:07 are 314139s newer than the latest specs commit. Refusal is not based on stale siblings. |
| `misleading_success_output` | Exercised. Focused run executed 9 tests. Wrong-import probe reddened collection. Temporary registrar probe produced the four quoted incomplete-point failures. |
| `dirty_worktree` | Exercised. Concurrent Wave-2 dirt (`self-hosting-projections.test.ts`, projection siblings, J packets, plan file) is visible and was not edited. Owned delta is the extraction suite, five staged siblings, and this evidence file. |
| malformed input | N/A — no parser surface changed. |
| prompt injection | N/A — no prompt or recipe surface changed. |
| cancel/resume | N/A — no resumable operation changed. |
| hung commands | N/A — focused Vitest completed in 1.20s. |
| flaky tests | N/A — no sleeps, polling, or event timing introduced. |
| repeated interruptions | N/A — no interruptible loop introduced. |

## Cleanup

- Wrong-import path restored.
- Temporary refusal probe files deleted.
- Five adopted siblings force-added; four refused siblings left untracked.
- No edits to `src/runner`, `src/testing`, codegen, helpers, specs, `anchors.ts`, or other suites.
- No serialized build/generate/check/preflight.
- No commit or push.

## DoneClaim

```json
{
  "task": "st_01a01b22",
  "changed_files": [
    "test/self-hosting-extraction.test.ts",
    "test/extraction.build-pipeline.same-invocation.test.generated.ts",
    "test/extraction.excludes.segment-boundary.test.generated.ts",
    "test/extraction.excludes.refused-path.test.generated.ts",
    "test/extraction.schema-versioning.declared-version.test.generated.ts",
    "test/extraction.example-runner.red-step-naming.test.generated.ts",
    ".omo/evidence/task-13-plan-37-settling-arc.md"
  ],
  "tests": [
    "npx vitest run test/self-hosting-extraction.test.ts → 9 passed",
    "wrong-import probe RED (missing .generated.broken.js), then restored green",
    "temporary registrar probe: 4 incomplete-point failures for the refused siblings"
  ],
  "manual_qa": [
    "freshness: 5 adopted sibling mtimes 2026-08-19 19:45:07 > specs commit 2026-08-16 04:29:28 (delta +314139s)",
    "git ls-files non-empty for all 5 adopted siblings; index blobs match worktree",
    "5 register* + 4 bindExample remain in the suite",
    "5 adopted pin flips recorded; 4 refused pins stay bindExample"
  ],
  "cleanup": [
    "wrong-import restored; refusal probe files deleted",
    "5 siblings force-added; 4 refused siblings untracked",
    "no serialized gates run",
    "no commit/push",
    "runner/testing/codegen/helpers/specs/anchors untouched"
  ],
  "risks": [
    "anchors.ts site: strings still pin bindExample( for the 5 adopted examples until the wave-boundary writer flips them",
    "executable-contracts and step-order stay refused until generated requiredConditions are scoped to each authored point",
    "check:self-hosting and preflight still owed at the serialized wave gate"
  ]
}
```
