# F2 Recipe 19 Fix

Verdict: **product green.** Catalog recipe 19 now emits `implementations` only and keeps unresolved component rows.

Owned paths only: `docs/agent-surface/recipes.md` and this evidence file. Tests, corpus, graph schema, reader, CLI, recipes 17/18, and orchestration state were not edited.

## Red-to-green lineage

Parent regression lock: **st_01a022aa** (evidence `f2-recipe19-tests.md`).

That task compiled two failing-first tests against the live catalog body and recorded 2 failed | 25 passed (27):

1. `returns planning-slice implementations, never abstractions` — `Object.keys(result)` lacked `implementations` because the body returned `abstractions`.
2. `preserves an unresolved component row when memberOf outlives the node` — `sdp q` exited 1 with `Cannot read properties of undefined (reading 'label')` after `codeNodesById.get(componentId)` returned `undefined`.

This task patched the catalog body only. Tests were not changed; their expectations stayed the contract.

## Exact diff (`docs/agent-surface/recipes.md`)

```
@@ -882,7 +882,7 @@ for (const binding of implementations) {
   if (componentIds.has(binding.codeId)) {
     const bound = componentsById.get(binding.codeId) ?? {
       direct: false,
-      abstractions: new Set(),
+      implementations: new Set(),
     };
     bound.direct = true;
     componentsById.set(binding.codeId, bound);
@@ -894,9 +894,9 @@ for (const binding of implementations) {
   )) {
     const bound = componentsById.get(edge.to) ?? {
       direct: false,
-      abstractions: new Set(),
+      implementations: new Set(),
     };
-    bound.abstractions.add(binding.codeId);
+    bound.implementations.add(binding.codeId);
     componentsById.set(edge.to, bound);
   }
 }
@@ -907,11 +907,11 @@ const components = [...componentsById]
     const component = codeNodesById.get(componentId);
     return {
       id: componentId,
-      label: component.label ?? null,
-      file: component.file ?? null,
-      line: component.line ?? null,
+      label: component?.label ?? null,
+      file: component?.file ?? null,
+      line: component?.line ?? null,
       directlySatisfies: bound.direct,
-      abstractions: [...bound.abstractions].sort(),
+      implementations: [...bound.implementations].sort(),
     };
   });
 const entryPoints = [];
@@ -950,8 +950,7 @@ return {
       id: decisionId,
       subjects: [...new Set(subjects)].sort(),
     })),
-  abstractions: implementations
-    .filter((binding) => !componentIds.has(binding.codeId))
+  implementations: implementations
     .map((binding) => ({
       id: binding.codeId,
       claim: binding.claim,
```

No dual-emission: the catalog file now contains zero `abstractions` tokens. Top-level `implementations` is the SpecContext binding list (ids preserved; the previous component-id filter is gone so the key matches `g.specContext(...).implementations`). Component rows still collect `memberOf` children into `implementations`. Unresolved component metadata is `component?.label ?? null` / `component?.file ?? null` / `component?.line ?? null`; `addEntryPoint` still skips a non-string `file`, so a dangling component contributes no blast-radius entry.

## Tests (once, after the patch, no retry)

```
npx vitest run test/recipes.test.ts
```

Result: Test Files 1 passed (1). Tests **27 passed (27)**. vitest 4.1.10. Duration 2.74s.

Both st_01a022aa regressions are green from the catalog-body fix alone.

## Focused checks (once)

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.json` | exit 0 |
| `npx prettier --check docs/agent-surface/recipes.md` | All matched files use Prettier code style; exit 0 |
| `npx eslint docs/agent-surface/recipes.md` | warning: file ignored (no matching config); 0 errors; exit 0 |
| `git diff -- docs/agent-surface/recipes.md` | recipe-19 body only (shown above) |

Invalid-but-reportable graph behavior is covered by the live CLI regression in `test/recipes.test.ts` (`preserves an unresolved component row when memberOf outlives the node`): `validateGraph` still reports `conformance` / `conformance/referential-integrity`, `runSdpCli` exits 0, unresolved `component:protocol.reader` has null `label`/`file`/`line`, `impl:protocol.agent-surface` is retained, no component blast-radius entry for the missing node.

## Live QA

Catalog body extracted from `docs/agent-surface/recipes.md` heading 19 (same fenced ` ```js ` parse as the suite). No leftover extract files.

Known (`const id = "spec:consumers.agent-surface"`):

```
pnpm --silent sdp:q '<recipe-19-body>' --json
```

exit 0. Keys: `id`, `found`, `refinementNeighborhood`, `constrainingDecisions`, `implementations`, `components`, `verifiers`, `blastRadiusEntryPoints`, `blastRadiusLimit`. Raw JSON contains no `abstractions` substring.

- `found: true`, `id: spec:consumers.agent-surface`
- top-level `implementations` ids: `impl:protocol.agent-surface`, `impl:protocol.agent-surface-cli`
- component rows use `implementations` only: `component:protocol.cli` → `impl:protocol.agent-surface-cli`; `component:protocol.reader` → `impl:protocol.agent-surface`
- labels/files/lines are resolved strings on the live graph (nullable path unexercised here; CLI regression covers it)

Unknown (only the opening id substituted to `spec:does-not-exist.unknown`):

```
pnpm --silent sdp:q '<recipe-19-unknown-body>' --json
```

exit 0. Output `{ "id": "spec:does-not-exist.unknown", "found": false }`. No `abstractions` key.

## Cleanup

- No stage, commit, push, or stash.
- No test/corpus/state edits.
- No sleeps. `/tmp/r19-known.json` and `/tmp/r19-unknown.json` were removed immediately after inspect; no temp runners remain.
- Pre-existing dirty tree outside owned paths left untouched.
