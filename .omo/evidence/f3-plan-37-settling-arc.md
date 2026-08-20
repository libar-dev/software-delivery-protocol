# F3 real manual QA, plan 37 settling arc

Operator run. Shipped CLI, `sdp q`, and the contract-dependent wrapper. No source review as the verdict. No generation, build, canonical validate, preflight, `check:self-hosting`, or `npm run check`. Scratch under `/tmp` was removed. No live process left.

Date: 2026-08-20T10:30:42+02:00 through 10:32:03+02:00
Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol`
HEAD: `a4a1468`
Documented entry: `pnpm --silent sdp` / `pnpm --silent sdp:q` (both `node ./dist/cli/sdp.js`)

**Verdict: APPROVE**

Todo 20 stays unchecked. Plan 37 stays EXECUTING. This file does not claim the full gate is green.

## 1. CLI help

`WORKING: F3 - CLI help` before this command.

```
CMD: pnpm --silent sdp --help
exit=0
```

Stdout names the verbs an operator actually types: `build`, `validate`, `view`, `census`, `mermaid`, `gherkin`, `import`, `new spec`, `q`. Help also lists `*.sdp.ts`, `*.sdp.md`, and `*.sdp.gherkin`. `q` is described as derive-in-process, write-nothing, body or stdin, refuse rather than wait when neither is supplied. Bounded, exit 0, no hang.

## 2. Happy graph read

`WORKING: F3 - happy graph read`

Catalog recipes 1, 2, and 8 were extracted from `docs/agent-surface/recipes.md` and piped to `pnpm --silent sdp:q --json`. A second body asked the graph for the eight Brief-J Specs, their stated/derived readiness, delivery facts, binding counts, and warning subjects.

All four invocations exited 0 in about 3s. Stderr empty. Output, not just the exit code:

Recipe 2, the live drift set, exactly three DEFINED alarms:

```json
{
  "total": 3,
  "alarms": [
    {
      "id": "spec:consumers.projections-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 2
    },
    {
      "id": "spec:extraction.regenerability",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 1
    },
    {
      "id": "spec:model.core-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 3
    }
  ]
}
```

The eight-Spec body returned `readyCount: 5`, `definedCount: 3`. Every row carries `deliveryFacts: ["implemented"]`. The five READY Specs are `spec:carrier.markdown-authoring` (1 implementation, 0 verifiers), `spec:extraction.claim-taxonomy` (2 / 0), `spec:model.pack-aggregate` (1 / 0), `spec:model.relations` (1 / 0), `spec:model.spec-sections` (2 / 0). Those five are absent from recipe 2. The three DEFINED rows match recipe 2 binding counts. Derived readiness is `ready` on all eight. That is the current close set, not the commission-time eight.

## 3. Bad input

`WORKING: F3 - bad input`

Unknown verb:

```
CMD: timeout 15 pnpm --silent sdp definitely-not-a-verb
exit=1
stderr ends with: Unknown command: definitely-not-a-verb
```

It reprints usage, then the unknown-command line. Non-zero, bounded, no partial success, finished well under 15s.

Invalid `q` body, same `sdp:q` wrapper so the corpus exclusions still apply:

```
CMD: printf 'return {{{\n' | timeout 30 pnpm --silent sdp:q
exit=1
stderr: sdp q: Unexpected token '{'
stdout: empty
```

Graph derivation did not leak a result. The diagnostic is one line. No hang.

## 4. Registrar happy path

`WORKING: F3 - registrar happy path`

Real wrapper, one adopted suite (`carrier.markdown-parser` lives in this file):

```
CMD: npm test -- test/self-hosting-carrier.test.ts
```

`npm test` is `node ./vitest-test.mjs`. Exit 0.

```
RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  10:32:02
   Duration  1.06s (transform 465ms, setup 0ms, import 877ms, tests 41ms, environment 0ms)
```

`tests 41ms` is execution, not a collect-and-skip. 3/3 passed on a single run. No retry.

## 5. Registrar failure path

`WORKING: F3 - registrar failure path`

Empty directory outside the repo, so `generated/contracts` cannot resolve relative to cwd:

```
CMD: cd /tmp/f3-missing-fgHAIx && node $REPO/vitest-test.mjs test/self-hosting-carrier.test.ts
exit=1
stderr:
Generated contracts required by the selected test suite are missing.
Run `npm run build && npm run generate:self-hosting` first.
```

Exact recovery command. Non-zero. Vitest never started. The empty directory was removed.

## 6. Refusal behavior

`WORKING: F3 - refusal behavior`

Live incomplete-point probe against the shipped `dist/testing` surface for REFUSE row `spec:consumers.binding-language-views.bound-spec-page`. Point is the generated sibling's `{ specId, bindings }`. Required Conditions are `specId, bindings, packId`. Dummy `expected()` flipped a flag if the oracle ran.

```
CMD: node /tmp/f3-plan37-O5jAyN/refusal-probe.mjs
exit=0
{
  "missingConditions": ["packId"],
  "expectedCalled": false,
  "invoked": false,
  "compared": false,
  "threw": "scenario spec:consumers.binding-language-views.bound-spec-page: oracle comparison refused for incomplete point; missing Conditions: \"packId\""
}
```

Refusal happens before the oracle. The missing Condition is exactly `packId`. Invoke and observe did not run either.

## 7. Current visible close state

Reader-only. `sdp q` writes nothing. Recipe 1 / 2 / 8 plus the eight-Spec body.

| Fact | Observed |
| --- | --- |
| Specs | `specCount: 156` |
| Errors | `errorCount: 0` / recipe 8 `errors: 0` |
| Honesty warnings | 5, all `honesty/gaps` |
| Warning subjects | markdown-authoring, claim-taxonomy, pack-aggregate, relations, spec-sections |
| Recipe 1 backlog | `total: 0`, `byFamily: {}`, exclusions 66 / 31, `excludedWithoutVerifier: []` |
| Recipe 2 alarms | `total: 3`, the three DEFINED rows above |
| Bundle Specs | `bundleSpecIds: []` |
| Plan 38 file | none under `plans/` |

Recipe 8 messages say those five READY Specs have no resolving verifier and that ready never requires delivery facts. Informative, not a gate.

No bundle plan is visible. K stood down. Nothing in the graph or `plans/` commissions a later bundle number.

## 8. No status flip, no Todo-20 green claim

After the exercises:

- `plans/37` header still `🔄 EXECUTING`
- `AGENTS.md` still `plan 37 is EXECUTING`
- Todo 20 still `- [ ] 20. Final gate: check ×2, statuses, AGENTS`
- F3 checkbox still `- [ ] F3. Real manual QA`
- `generated/` porcelain empty

I did not flip status, check a box, or run the consecutive full gate. This QA does not claim Todo 20 green.

Opening porcelain already had unrelated `.omo` dirt (Boulder, a plan-37 operational file, parity drafts). Concurrent F1 later added `.omo/evidence/f1-plan-37-settling-arc.md`. None of that is this run. This run's only write is this file.

## Cleanup

Removed `/tmp/f3-plan37-O5jAyN` and `/tmp/f3-missing-fgHAIx`. No leftover `sdp` or vitest process.
