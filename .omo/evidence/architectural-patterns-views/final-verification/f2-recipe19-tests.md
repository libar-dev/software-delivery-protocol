# F2 Recipe 19 Tests

Verdict: **tests compiled and locked; product remains red on the two confirmed recipe-19 regressions.**

Owned paths only: `test/recipes.test.ts` and this evidence file. Catalog body, product code, and orchestration state were not edited.

## Baseline

Command (once, before any test edit):

```
npx vitest run test/recipes.test.ts
```

Result: 25/25 passed. Duration 2.52s. File `test/recipes.test.ts`, vitest 4.1.10.

Live extraction in that suite is the memoized `extract({ root, exclude: explorations/examples/test/fixtures/import/parity })` already used by the recipe runner. That path was not weakened.

## Test seam

`runRecipe` still drives real `runSdpCli` with the catalog body on argv and `--json`. The live extract remains the default `ExtractionResult`. An optional third argument may return a cloned `ExtractionResult` from the `query.extract` hook; omitting it is the previous live-extract path.

New coverage:

1. Output contract — live recipe 19 must expose `implementations` at the top level and on each component row, never `abstractions`. Ids equal live `g.specContext("spec:consumers.agent-surface").implementations` plus `memberOf`-derived component ownership.
2. Invalid-but-reportable — clone the live result, drop node `component:protocol.reader`, keep its `memberOf` edges, prove `validateGraph` emits `conformance` / `conformance/referential-integrity`, then run catalog recipe 19 through `runSdpCli`. Contract: exit 0, unresolved component row with null `label`/`file`/`line`, retained `impl:protocol.agent-surface`, no component blast-radius entry point.

## Exact red proof

Command (once, after the tests landed; no retries):

```
npx vitest run test/recipes.test.ts
```

Result: 2 failed | 25 passed (27). File `test/recipes.test.ts`. Duration 2.60s.

1. **Key-shape** — `returns planning-slice implementations, never abstractions`

   `AssertionError: expected [ 'id', 'found', …(7) ] to include 'implementations'` at `test/recipes.test.ts` `expect(Object.keys(result)).toContain("implementations")`.

   The catalog body still returns `abstractions`. The live neighborhood test still passes; only the new key contract reddens.

2. **Undefined-component dereference** — `preserves an unresolved component row when memberOf outlives the node`

   `validateGraph` on the clone reported referential integrity (the assertion before `runRecipe` passed). The sink then failed:

   ```
   exitCode: 1
   stderr: sdp q: Cannot read properties of undefined (reading 'label')
   ```

   That is `codeNodesById.get(componentId)` yielding `undefined` and then `component.label`. Not a flake, not an extract error (clone reused the live extract report, which has no hard extract errors).

## Quality gates despite behavioral red

Recorded after the single post-test vitest run. Prettier `--write` was applied to `test/recipes.test.ts` only (format, no assertion change). The suite was not re-run.

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.json` | clean (exit 0) |
| `npx eslint test/recipes.test.ts` | clean (exit 0) |
| `npx prettier --check test/recipes.test.ts` | clean after format |
| `git diff` product/corpus/state | none; only `test/recipes.test.ts` plus this untracked evidence file |

`test/recipes.test.ts` pure LOC is 926 (already far above 250 before this edit). Split was forbidden by ownership. No `SIZE_OK` marker added to an inherited file.

## Nondeterminism audit

- No `sleep`, polling, wall-clock, or order-dependent fixtures.
- Live graph is derived once at import; the dirty case clones nodes/edges without mutating `derived`.
- Failure 2 is a thrown property access, not timing.
- Failure 1 is a stable output key on the live corpus recipe.
- Isolation: override extract is per-call; `SDP_CHANGED_FILES_JSON` restore is unchanged.

## Cleanup

- No stage, commit, push, or stash.
- No recipe-body, product, generated, or `.omo` ledger edits.
- No leftover temp runners or sentinels from these tests.
