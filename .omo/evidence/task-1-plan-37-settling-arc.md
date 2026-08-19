# Task 1 — plan 37 commissioning evidence

## Failure-first discovery probe

The mandated pre-edit command was run before the pin edit while plan 37 did not yet exist under `plans/`:

```text
$ npx vitest run test/check-self-hosting-gates.test.ts

 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  17:53:10
   Duration  446ms (transform 29ms, setup 0ms, tests 267ms, environment 0ms)

EXIT_CODE=0
```

This was unexpectedly green because the current primary plan was still plan 36; the discovery assertion agreed with that stale pre-commission state. To demonstrate the pin guard's failure behavior without fabricating a red first run, the pin was temporarily changed back to plan 36 after plan 37 was present:

```text
$ npx vitest run test/check-self-hosting-gates.test.ts

 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 ❯ test/check-self-hosting-gates.test.ts (6 tests | 1 failed) 282ms
     × discovers plan 36 as the current primary plan 11ms

 FAIL  test/check-self-hosting-gates.test.ts > the self-hosting records gate > discovers plan 36 as the current primary plan
AssertionError: expected { …(2) } to match object { number: 36, …(1) }

- Expected
+ Received

  {
-   "name": "36-adoption-tranches-maturation-and-bundle-evidence-briefs.md",
-   "number": 36,
+   "name": "37-adoption-tranches-drift-maturation-and-bundle-measurement.md",
+   "number": 37,
  }

 ❯ test/check-self-hosting-gates.test.ts:80:25

 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)

EXIT_CODE=1
```

The plan-37 pin was restored immediately afterward.

## Re-measurement at commission

Commands were run as specified by plans/36 §1.

```text
$ npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
validate: 0 errors · 0 warnings (conformance + honesty over the one graph)
```

```text
$ npm run --silent sdp:q -- '<recipe 1 body>' --json
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 31,
  "excludedWithoutVerifier": []
}
```

```text
$ npm run --silent sdp:q -- '<recipe 2 body>' --json
{
  "total": 8,
  "alarms": [
    { "id": "spec:carrier.markdown-authoring", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 1 },
    { "id": "spec:consumers.projections-model", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 2 },
    { "id": "spec:extraction.claim-taxonomy", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 2 },
    { "id": "spec:extraction.regenerability", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 1 },
    { "id": "spec:model.core-model", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 3 },
    { "id": "spec:model.pack-aggregate", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 1 },
    { "id": "spec:model.relations", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 1 },
    { "id": "spec:model.spec-sections", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 2 }
  ]
}
```

```text
$ npm run --silent sdp:q -- '<recipe 8 body>' --json
{
  "errors": 0,
  "warnings": 0,
  "byValidator": {},
  "signals": []
}
```

```text
$ rg -o 'bindExample\(' test/self-hosting-*.test.ts --count-matches
test/self-hosting-validators.test.ts:16
test/self-hosting-sdp-import.test.ts:1
test/self-hosting-pack-markdown.test.ts:2
test/self-hosting-carrier.test.ts:1
test/self-hosting-projections.test.ts:11
test/self-hosting-carrier-gherkin.test.ts:13
test/self-hosting-extraction.test.ts:9
test/self-hosting-consumers.test.ts:5
```

The census sums to 58 across eight suites.

## Final verification

```text
$ npx vitest run test/check-self-hosting-gates.test.ts

 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  17:55:45
   Duration  469ms (transform 26ms, setup 0ms, tests 289ms, environment 0ms)

EXIT_CODE=0
```

```text
$ node check-self-hosting-gates.mjs .
{
  "surfaces": {
    "plan": "plans/17-self-hosting-v1.md",
    "plan16": "plans/16-carrier-ruling.md",
    "agents": "AGENTS.md",
    "decisions": "docs/concept/DECISIONS.md",
    "glossary": "CONTEXT.md",
    "phase2Plan": "plans/18-self-hosting-phase-2.md",
    "currentPlan": "plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md",
    "package": "package.json"
  },
  "currentRecord": {
    "status": "EXECUTING",
    "gateLegs": [
      "check:temporal", "lint", "format:check", "build", "generate:self-hosting",
      "generate:example", "typecheck", "typecheck:examples", "test",
      "check:self-hosting-gates", "check:self-hosting", "check:example", "preflight"
    ]
  },
  "temporal": { "ran": false, "reason": "non-default rootDir" },
  "docket": { "total": 25, "nonPending": 25, "pending": [] },
  "adrDispositions": {
    "the strict consumer-exclusion contract (MD-20)": "diary entry entered — three-part test passes",
    "the envelope-grammar ownership posture (MD-21)": "diary entry entered — three-part test passes"
  },
  "phase2Ledger": "G1-G8 scaffold checked"
}

EXIT_CODE=0
```

The command's stderr was empty. Its report also contained the accepted historical gate ledgers and all 25 docket dispositions (25 non-pending).

## Adversarial probes

- `stale_state`: probed by the temporary old pin; it failed with received plan 37, proving discovery is guarded.
- `misleading_success_output`: N/A; exit codes and real command output are recorded above, including the initial unexpected green result.
- `malformed input`: N/A; no malformed-input surface was changed.
- `prompt injection`: N/A; no prompt/content ingestion path was involved.
- `cancel/resume`: N/A; no resumable operation was exercised.
- `dirty worktree`: N/A; no dirty-state behavior was under test.
- `hung commands`: N/A; all commands completed within their bounded execution.
- `flaky tests`: N/A; the focused test passed in the final run.
- `repeated interruptions`: N/A; no interruption occurred.

## Cleanup receipts

None expected — no QA assets were created. The temporary stale-pin edit was restored; no commit, add, push, or forbidden full-suite command was run.
