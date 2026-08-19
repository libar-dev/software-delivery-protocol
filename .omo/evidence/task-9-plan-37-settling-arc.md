# Task 9 — carrier.sdp-import round-trip registrar adoption

## Outcome

**ADOPT** — the single `carrier.sdp-import.round-trip` example now uses its generated registrar. The fixture source is materialized in `createWorld`, `importTypeScriptSpec` is the sole When operation, and the existing authored TypeScript-to-Markdown equality assertion remains in the adapter assertion. No refusal was needed.

## Family ledger

| Family | Example | Disposition | Generated sibling | Evidence |
| --- | --- | --- | --- | --- |
| `carrier.sdp-import` | `round-trip` | **ADOPT** | `test/carrier.sdp-import.round-trip.test.generated.ts` | Focused Vitest: 1/1 passed; zero authored `bindExample(` calls |

## Implementation receipt

- Retained `sdpImportRoundTripTestAnchor` and its `specTest` declaration.
- Replaced the authored `bindExample(...)` table with `registerRoundTrip({...})`.
- `createWorld` reads `test/fixtures/import/round-trip/behavior.sdp.ts.txt` and supplies `behavior.sdp.ts`.
- `invoke` calls `importTypeScriptSpec`; `observe` and `expected` use the generated outcome kind; `assertions` preserves the existing empty-findings, emitted-Markdown, and authored-data round-trip checks.
- The generated sibling was force-added and `git ls-files` confirmed it is tracked.
- `test/self-hosting-oracle/anchors.ts` was read but not edited; no specs, helpers, oracle, or other suites were touched.

## Freshness (`stale_state`)

```text
spec_commit_epoch=1786847368
spec_commit_date=Sun Aug 16 04:29:28 2026 +0200
generated_sibling_epoch=1787158017
generated_sibling_mtime=2026-08-19 18:46:57.381269393 +0200
```

The generated sibling mtime is newer than `git log -1 --format=%cd -- specs/`.

## Anchor-pin record

`test/self-hosting-oracle/anchors.ts` current entry, read without editing:

| Anchor ID | Current `site:` string | Replacement site |
| --- | --- | --- |
| `test:protocol.sdp-import.round-trip` | `bindExample(` | `registerRoundTrip(` |

## Verification transcripts

### Happy path

```text
$ npx vitest run test/self-hosting-sdp-import.test.ts

 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
 Tests  1 passed (1)
 Start at  18:58:54
 Duration  970ms (transform 393ms, setup 0ms, import 785ms, tests 51ms, environment 0ms)
```

Exit: `0`. A separate initial final-path run also passed (`1 passed`).

### Required WRONG-IMPORT PROBE

The generated sibling import was temporarily changed to the nonexistent `.test.generated.broken.js` path. The focused run failed before test collection:

```text
$ npx vitest run test/self-hosting-sdp-import.test.ts
Error: Cannot find module './carrier.sdp-import.round-trip.test.generated.broken.js' imported from /home/darkomijic/dev-libar/software-delivery-protocol/test/self-hosting-sdp-import.test.ts
Test Files  0 passed (1)
WRONG_IMPORT_EXIT=1
```

The import was restored to `carrier.sdp-import.round-trip.test.generated.js`; the final focused run above returned exit `0` and `1 passed (1)`.

### Adoption checks

```text
$ rg -n 'bindExample\\(' test/self-hosting-sdp-import.test.ts
zero bindExample(

$ git ls-files --stage -- test/carrier.sdp-import.round-trip.test.generated.ts
100644 d0a552a953cfa1cd430992f00a80398018cf2558 0 test/carrier.sdp-import.round-trip.test.generated.ts
```

## Adversarial QA

| Class | Result |
| --- | --- |
| `stale_state` | Exercised: exact generated sibling, contract/space, authored suite, and current anchor pin were read before editing; sibling freshness is recorded above. |
| `misleading_success_output` | Exercised: the broken sibling import produced a real Vitest exit 1; restoring it produced the semantic test pass recorded above. |
| `dirty_worktree` | Exercised: scoped status and final scope audit were used; unrelated existing worktree dirt was not edited. |
| `malformed_input` | N/A — no malformed-input fixture or parser behavior was added. |
| `prompt_injection` | N/A — no agent-facing prompt surface was changed. |
| `cancel_resume` | N/A — no resumable operation was changed. |
| `hung_commands` | N/A — no watcher or long-running command was introduced. |
| `flaky_tests` | N/A — no timing, polling, or sleeps were introduced. |
| `repeated_interruptions` | N/A — no interruptible loop was introduced. |

## Cleanup

The wrong generated-sibling import was restored. No scratch files, commits, pushes, forbidden build/generation/self-hosting-check/preflight/full-check commands, or anchor edits were made. No index lock retry was needed. The generated sibling remains force-added as required.

## DoneClaim

```json
{
  "task": "st_01a01af4",
  "changed_files": [
    "test/self-hosting-sdp-import.test.ts",
    "test/carrier.sdp-import.round-trip.test.generated.ts",
    ".omo/evidence/task-9-plan-37-settling-arc.md"
  ],
  "tests": "npx vitest run test/self-hosting-sdp-import.test.ts: 1 passed; zero authored bindExample calls; generated sibling tracked",
  "manual_qa": "Wrong generated-sibling import failed with exit 1, then restoration passed with 1/1 test; freshness and anchor pin recorded",
  "cleanup": "Broken import restored; no commit or push; unrelated worktree dirt preserved",
  "risks": "Workspace LSP diagnostics were unavailable because the daemon could not start; focused Vitest and scope checks passed"
}
```
