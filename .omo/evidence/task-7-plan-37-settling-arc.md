# Task 7 — carrier.markdown-pack-authoring registrar adoption

## Outcome

**ADOPT** — both examples in family `carrier.markdown-pack-authoring` now use their generated registrar siblings. The shared filesystem world materializes each point in `createWorld`; the parity example returns the graph outcome after asserting Markdown/TypeScript equality, and the refusal example returns the recorded validator reason `extract/unrecognized-property` while asserting that no Pack node is emitted. Refusal is therefore a complete executable outcome, not a skipped example.

### Family ledger

| Family | Examples | Disposition | Generated siblings | Evidence |
| --- | --- | --- | --- | --- |
| `carrier.markdown-pack-authoring` | `markdown-ts-parity`; `spec-envelope-refused` | **ADOPT** both; the second example records the refusal reason `extract/unrecognized-property` | `test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts`; `test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts` | Focused Vitest: 2/2 passed; zero authored `bindExample(` calls |

## Implementation receipt

- Retained both `specTest` anchors and their anchor constants.
- Replaced the authored step-binding table with `registerMarkdownTsParity({...})` and `registerSpecEnvelopeRefused({...})`.
- `packWorld(point)` reads `Partial<MarkdownPackAuthoringConditions>`, creates fresh temporary Markdown/TypeScript roots, and writes the parity or refusal manifests before invocation.
- `invokePackExtraction` performs the existing extraction call(s); `observeParity` preserves the graph parity and membership assertions; `observeRefusal` returns and checks the refusal validator ID.
- `paramsForStep` supplies the generated contract payloads; incomplete points return `unspecified` from the expected adapters.
- No helpers, specs, oracle, anchors, recipes, other suites, or generated directories were edited.

## Focused verification

Happy path, final command after formatting:

```text
$ npx vitest run test/self-hosting-pack-markdown.test.ts

 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  18:55:28
   Duration  958ms (transform 384ms, setup 0ms, import 781ms, tests 46ms, environment 0ms)
```

Exit: `0`.

Additional checks:

```text
$ ./node_modules/.bin/eslint test/self-hosting-pack-markdown.test.ts
# clean

$ ./node_modules/.bin/prettier --check test/self-hosting-pack-markdown.test.ts
Checking formatting...
All matched files use Prettier code style!

$ git diff --check -- test/self-hosting-pack-markdown.test.ts
$ git diff --cached --check -- test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts
# clean

$ rg -o 'bindExample\\(' test/self-hosting-pack-markdown.test.ts | wc -l
0
```

The LSP diagnostics request was attempted but the workspace daemon was unreachable; direct ESLint, Prettier, diff checks, and Vitest were clean.

## Required failure probe: wrong import

One generated-sibling import was temporarily changed to the nonexistent `.test.generated.broken.js` path. The focused run failed before registering tests:

```text
Error: Cannot find module './carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.broken.js' imported from /home/darkomijic/dev-libar/software-delivery-protocol/test/self-hosting-pack-markdown.test.ts
❯ test/self-hosting-pack-markdown.test.ts:18:1

WRONG_IMPORT_EXIT=1
```

The import was restored to `carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.js`; the focused run then returned `2 passed (2)` with exit `0` as recorded above.

## Generated sibling receipt

The siblings were force-added as required; `git ls-files` was non-empty:

```text
test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts
test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts
```

Worktree SHA-256:

```text
97cbf859fb8516dd545a2658772c407f8f912b86607b371e2342b44c36b321b0  test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts
52170311ddbe3fe6223879cc2150c77cff8eab3e8906e5acfa220f2a4ccc5e49  test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts
```

Both files are staged as additions, and staged/worktree diff checks are clean. No index-lock retry was needed.

## Freshness

Compared with the current spec commit timestamp:

```text
spec_commit=2026-08-16T04:29:28+02:00
sibling=2026-08-19 18:46:57.380871011 +0200 test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts
sibling=2026-08-19 18:46:57.381027655 +0200 test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts
```

Both sibling mtimes are newer than `git log -1 --format=%cd -- specs/`.

## Anchor-pin record

`test/self-hosting-oracle/anchors.ts` was read and not edited. Current site strings, required replacements, and anchor IDs:

| Anchor ID | Current `site:` in `anchors.ts` | Replacement site after adoption |
| --- | --- | --- |
| `test:protocol.markdown-pack-authoring.markdown-ts-parity` | `bindExample(markdownTsParityContract` | `registerMarkdownTsParity(` |
| `test:protocol.markdown-pack-authoring.spec-envelope-refused` | `bindExample(specEnvelopeRefusedContract` | `registerSpecEnvelopeRefused(` |

## Adversarial QA

| Class | Result |
| --- | --- |
| `stale_state` | Exercised: read both exact generated siblings, contracts/space, authored suite, model filesystem pattern, and current oracle pins before editing. |
| `misleading_success_output` | Exercised: wrong import produced a real Vitest exit 1; restored import produced 2 semantic tests passing, including parity and recorded refusal assertions. |
| `dirty_worktree` | Exercised: unrelated concurrent paths `test/self-hosting-consumers.test.ts` and `.omo/evidence/task-6-plan-37-settling-arc.md` were preserved and not edited. |
| `generated_artifacts` | Exercised: both new siblings were force-added and `git ls-files` confirmed tracking. |
| `flaky_tests` | No timing waits or polling were introduced; the focused run completed deterministically. |
| `malformed_input` | N/A — no parser or malformed-input surface was added. |
| `prompt_injection` | N/A — no agent-facing prompt surface was added. |
| `cancel_resume` | N/A — no cancel/resume behavior exists in this family. |
| `hung_commands` | N/A — no watcher or long-running command was introduced. |
| `repeated_interruptions` | N/A — no interruptible product loop was introduced. |

## Cleanup

Temporary extraction roots are removed by the existing `afterEach` cleanup. The wrong import was restored. No scratch files, commits, pushes, or forbidden commands (`build`, generation, self-hosting checks, preflight, or full check) were run. Only the owned authored suite, its two force-added siblings, and this evidence file were changed by this lane; concurrent unrelated dirt remains untouched.

## DoneClaim

```json
{
  "task": "st_01a01af2",
  "changed_files": [
    "test/self-hosting-pack-markdown.test.ts",
    "test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts",
    "test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts",
    ".omo/evidence/task-7-plan-37-settling-arc.md"
  ],
  "tests": "npx vitest run test/self-hosting-pack-markdown.test.ts: 2 passed; ESLint, Prettier, and diff checks clean",
  "manual_qa": "Wrong generated-sibling import failed with exit 1, then restoration passed with 2/2 tests; anchor pins recorded",
  "cleanup": "Temporary roots cleaned by afterEach; no commit or push; unrelated worktree dirt preserved",
  "risks": "anchors.ts retains the mandated pre-adoption site strings and was not edited; later oracle projection work must apply the recorded pins"
}
```
