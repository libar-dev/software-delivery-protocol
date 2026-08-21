# Task 4 - coarse structural coverage

## Scope and boundary

- Base/checkpoint: `3c603e3cba716fb91fed24ec75aeff50ebcc451f` on `work/pr25-structural-coverage`.
- Added only the test-local compiler audit and fixture suite, integrated it into the existing self-hosting accepted-set census, and replaced the six line-number rationales with stable `file#symbol` consumption statements.
- No `src/`, Spec, graph edge, significance, component-membership, `expectedUsesEdges`, package, lockfile, or product-validation change was made. Imports remain evidence checked against the owner-reviewed rows; they do not derive accepted architecture.

## Failing-first proof

Before implementing symbol inspection, `auditStructuralCoverage` returned `ok` as a typed skeleton. The required command was executed:

```text
npx vitest run test/structural-coverage.test.ts test/self-hosting-graph.test.ts
RED_EXIT=1
Test Files  1 failed | 1 passed (2)
Tests       9 failed | 29 passed (38)
```

The failures were behavioral: expected `exported unit missing` or `covering source does not value-consume unit`, received `ok`. The aliased-call and barrel-call controls were already green, proving the fixtures and runner were valid.

## Implementation result

The helper parses exactly one non-empty `#`, resolves the source and named callable value export, follows named-import aliases and barrel re-exports through `ts.TypeChecker`, rejects type-only imports, and requires the imported local symbol to occur as the callee of a `CallExpression`. The self-hosting suite creates one Program from the repository `tsconfig.json` and reuses it for all six coarse rows while retaining the existing sorted mismatch aggregation.

## Verification and manual QA

The exact required commands passed at the final implementation state:

```text
npx vitest run test/structural-coverage.test.ts test/self-hosting-graph.test.ts
Test Files  2 passed (2)
Tests       38 passed (38)
exit 0

npm run typecheck
> tsc --noEmit -p tsconfig.json
exit 0
```

The focused command exercised the six live repository rows plus deterministic temporary projects. A verbose run of `test/structural-coverage.test.ts` passed 11/11 and explicitly exercised missing export, removed import, unused import, aliased runtime call, barrel re-export runtime call, type-only use, and five malformed references.

Additional changed-file checks passed:

```text
eslint <four changed TypeScript files>             exit 0
prettier --check <four changed TypeScript files>   all matched
git diff --check                                   exit 0
```

### Failure QA and exact diagnostics

All failure fixtures executed, not merely inspected:

| Probe | Exact helper result |
| --- | --- |
| missing export | `exported unit missing` |
| removed import | `covering source does not value-consume unit` |
| unused named value import | `covering source does not value-consume unit` |
| type-only import/reference | `covering source does not value-consume unit` |
| malformed `path#symbol` forms | `exported unit missing` |

Two temporary oracle mutations exercised the real sorted aggregate and each exited 1:

```text
structural self-binding coverage failed:
src/cli/validate-watch.ts#missingExport impl:protocol.agent-surface-cli → component:protocol.cli: exported unit missing

structural self-binding coverage failed:
src/import/markdown-fidelity.ts#assertMarkdownEmissionFidelity impl:protocol.agent-surface-cli → component:protocol.cli: covering source does not value-consume unit
```

The oracle was restored byte-for-byte after each probe (`cmp` exit 0).

## LSP

Diagnostics were requested independently for all four changed TypeScript files. Every request returned the same exact infrastructure error:

```text
LSP daemon unreachable: LSP daemon did not become reachable at /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock.
The MCP server is a thin proxy and never runs language servers in-process.
Socket: /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock
Logs: /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.log
The daemon is auto-started on demand and will be retried on the next request.
```

The authoritative `npm run typecheck` and focused suites passed despite daemon unavailability.

## Adversarial map

- `malformed_input` - applicable and executed for no separator, empty path, empty symbol, multiple separators, and empty input; all returned `exported unit missing`.
- `stale_state` - applicable; one Program was built from the current `tsconfig.json`, and all current six rows passed in the same focused run.
- `dirty_worktree` - applicable; the lane began clean at the checkpoint, only the five scoped code/test/evidence paths remain, and dependency/generated setup stayed ignored and was removed.
- `flaky_tests` - applicable; every fixture used a unique `mkdtempSync` root, `afterEach` removed every registered root, and no timer, sleep, polling, shared port, or wall clock was used.
- `misleading_success_output` - applicable; exact-result fixtures and both real aggregate mutation probes failed with exit 1 and the expected reason text before restoration.
- `prompt_injection` - not applicable; no untrusted corpus text or query body was executed.
- `cancel_resume` - not applicable; no command was cancelled or resumed.
- `hung_or_long_commands` - not applicable; all commands completed within their bounded runner timeouts.
- `repeated_interruptions` - not applicable; execution had no external interruption.

## Resource and cleanup receipts

- Registered fixture resource family: `/tmp/sdp-structural-coverage-*`; post-suite `find` result: `none`.
- Registered worktree dependency resource: `node_modules -> ../software-delivery-protocol/node_modules`; removed after verification.
- Registered generated verification resources: `dist/`, `generated/`, and untracked generated test adapters; removed after verification. Tracked generated adapters were restored unchanged after cleanup selection (`git ls-files --deleted` count `0`, no generated-file diff).
- Temporary mutation copies and logs under `/tmp/task4-*` and `/tmp/structural-edges.*` were removed.
- No external repository, remote, PR, plan, Boulder file, ledger, or product source was written.

## Post-write review

- New helper responsibility: compiler-symbol consumption audit. New fixture file responsibility: deterministic helper behavior.
- Inputs are trusted test-program identities; no untyped boundary value escapes into the helper.
- No tagged variant discrimination, `any`, assertion escape hatch, non-null assertion, defensive framework check, one-off production abstraction, parameter bloat, redundant post-action verification, negative name, or logging change was introduced.
- The new files are 108 and 95 pure lines. The two mandated existing oracle/suite files remain above 250 pure lines (482 and 509); splitting them is outside this exact-scope test change and would violate the requested file boundary.
- Every introduced behavior is covered by a fixture that fails if the relevant symbol resolution or value-call rule regresses.
