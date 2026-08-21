# PR 25 F2 remediation - conservative runtime export certification

## Scope and Oracle ruling

Clean published base: `91992f11acc33867b857971f5e9a429a391926b4` on `work/pr25-f2-failclosed`.

The Oracle ruled that this test-only audit is conservative certification, not a TypeScript linker. A rostered `<path>#<symbol>` exists only when exactly one callable runtime value resolves through direct declarations, non-type named aliases/re-exports, and acyclic non-type export-star paths. Type-only paths contribute no candidate. Missing or malformed input, multiple runtime origins, and any candidate-relevant export-star cycle return the existing closed result `exported unit missing`. An explicit non-type named export has TypeScript precedence and therefore shields its result from unrelated cyclic stars.

After export certification, consumption remains a separate proof: only a non-type named import whose exact local binding is the direct callee of a call expression returns `ok`. Every other covering-source case returns `covering source does not value-consume unit`. The helper derives no graph edge, accepted-set membership, or product fact.

## Rejected approaches retained as history

The failed resolver commits were read as evidence and were not copied or cherry-picked:

- `79d7529` inspected named alias declarations after checker resolution. It rejected `export type { ... }` but could not see `export type *`, because TypeScript exposed the origin declaration directly.
- `e864410` walked stars from a checker-selected symbol identity. It still inherited declaration-order selection and could bless one of two conflicting runtime origins.
- `7f6151c` resolved candidate sets but treated an active recursive visit as an empty result. That cycle-broken empty could be memoized into a partial success and explicitly accepted a cyclic barrel with one reachable origin.

The accepted implementation resolves module/name pairs from syntax, unions symbol identities, and carries a cycle bit through every completed result. It never memoizes an active-path empty as an acyclic answer. Explicit value exports stop star traversal before cycle inspection, preserving named-export precedence. The focused resolver module exists because keeping this logic in `structural-coverage.ts` would exceed the 250-pure-LOC ceiling.

## Failing-first proof from published HEAD

The adversarial tests were added before implementation and run against the original helper:

```text
Test Files  1 failed (1)
Tests       7 failed | 16 passed (23)
```

Exact original behavior:

| Case | Expected | Published-head result |
| --- | --- | --- |
| diagnostics-clean named type-only export | `exported unit missing` | `covering source does not value-consume unit` |
| diagnostics-clean type-only export star | `exported unit missing` | `covering source does not value-consume unit` |
| attempted value call through either type-only form | `exported unit missing` | `ok` |
| two distinct acyclic value origins | `exported unit missing` | `ok` |
| two-node cycle, cycle declaration first | two missing results | two `ok` results |
| two-node cycle, origin declaration first | two missing results | two `ok` results |

This captures both required original red classes: type-only erasure and cycle/declaration-order behavior.

## Green contract matrix

| Boundary | Result |
| --- | --- |
| direct callable declaration | `ok` |
| aliased non-type named export | `ok` |
| named barrel import and call | `ok` |
| nested acyclic value stars | `ok` |
| diamond value stars to one origin | `ok` |
| diagnostics-clean named or star type-only export | `exported unit missing` |
| attempted value use through named or star type-only export | `exported unit missing` |
| two distinct acyclic value candidates | `exported unit missing` |
| candidate-relevant cyclic value stars | `exported unit missing` |
| explicit named value export plus unrelated cyclic stars | `ok` |
| unused named value import after valid export | `covering source does not value-consume unit` |
| type-only covering import after valid export | `covering source does not value-consume unit` |
| malformed or missing unit | `exported unit missing` |

The cycle matrix uses both declaration orders. For each order, all four unit/import SCC-entry pairs (`a/a`, `a/b`, `b/a`, `b/b`) are evaluated in forward and reverse traversal order: 16 cycle audits total, all missing. The ambiguity control remains acyclic, and the explicit-shadow control remains green.

## Verification

Provisioning only the ignored prerequisites:

```text
npm run build
npm run generate:self-hosting
164 specs · 1 pack · 177 anchors -> 342 nodes · 760 edges
validate: 0 errors · 5 informative honesty/gaps warnings
```

Scoped gates:

```text
vitest structural-coverage + self-hosting-graph
2 files passed; 50 tests passed

npm run typecheck
exit 0

eslint three changed TypeScript files
exit 0

prettier --check three changed TypeScript files
all matched
```

The self-hosting accepted-set census runs the real repository Program and keeps all six live coarse rows green:

```text
src/cli/validate-watch.ts#runValidateWatch -> ok
src/import/markdown-fidelity.ts#assertMarkdownEmissionFidelity -> ok
src/import/data-access.ts#importData -> ok
src/import/data-access.ts#importText -> ok
src/import/data-access.ts#importTexts -> ok
src/import/data-access.ts#targetsForRelationType -> ok
```

The live graph context for `spec:protocol.structural-self-binding` remained `defined` stated / `ready` derived, with `has-verifier`, no findings, and no implementation fact. No full `npm run check` was run.

## Cleanup and architectural review

The implementation is test-only and keeps the exact three-value taxonomy. `runtime-export-resolver.ts` owns runtime export candidate resolution; `structural-coverage.ts` owns direct-call consumption certification; `structural-coverage.test.ts` owns deterministic behavioral fixtures. Pure LOC is 159, 99, and 222 respectively; the test is in the warning band and should split before future expansion.

Inputs are trusted TypeScript Programs, no untyped boundary escapes, no assertion or suppression was added, no tagged variant is discriminated non-exhaustively, and no function exceeds three parameters. There is no logging, graph inference, redundant post-action verification, product/runtime edit, plan edit, Boulder edit, or ledger edit. Temporary fixture roots use unique `mkdtempSync` directories and synchronous cleanup; no sleeps, polling, clocks, shared ports, or background processes are involved.

Before commit, the dependency symlink, ignored `dist/`, ignored `generated/`, generated test adapters, and `/tmp/pr25-f2-*` logs are removed. The scoped commit contains only the helper, focused resolver helper, structural test, and this remediation evidence.
