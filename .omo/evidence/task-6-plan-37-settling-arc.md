# Task 6 — Gherkin authoring generated-registrar adoption

Task: `st_01a01af1`

## Corrected disposition

The adversarial review was correct: the first full-family refusal treated unused work in one shared binding as if every example required it. That was the shared-When fallacy. The correction judges each example by the product calls its own Thens require.

**Family outcome: split — 11 ADOPT, 2 REFUSE.**

- **ADOPT 11:** each adopted point materializes a fresh corpus in `createWorld(point)`, invokes exactly one `extract({ root })`, observes the extraction-finding count, and performs the remaining extraction-report/graph joins read-only in `assertions` using `paramsForStep`.
- **REFUSE `unbound-ready-refused`:** its authored validation finding genuinely requires `extract` followed by `validateGraph`.
- **REFUSE `contract-parity`:** its parity Thens rematerialize corpora and perform four additional `extract` calls plus two `serializeGraph` and two `generateContracts` calls.

`temporaryRoots` is correctly treated as a cleanup registry, not a shared world. `createExtractionWorld` mints a fresh `GherkinWorld` and root for every adopted example, matching the task-8 filesystem precedent. The registry only lets existing `afterEach` remove those roots.

## Adapter implementation

The adopted path is:

```ts
function createExtractionWorld(point: Partial<GherkinAuthoringConditions>): GherkinWorld {
  const state = world();
  if (point.probe !== undefined) {
    state.root = materialize(point.probe);
  }
  return state;
}

function invokeExtraction(state: GherkinWorld): void {
  if (state.root === "") {
    return;
  }

  const result = extract({ root: state.root });
  state.graph = result.graph;
  state.extractionReport = result.report;
}
```

The comparator-owned Outcome is `extraction reports {findingCount} findings`. Every other Then is a different Outcome kind and therefore lives in read-only `assertions`, with its authored parameters obtained from the generated contract through `paramsForStep`. No assertion makes a product call.

The old `bindings` object remains only as the execution path for the two refused `bindExample` sites. Its extraction-plus-validation When no longer determines the adopted examples' execution.

## Per-example Then and product-call accounting

| Example | Thens that must be satisfied | Product calls required by those Thens | Disposition |
| --- | --- | --- | --- |
| `authored-fact-refused` | extraction finding count; first extraction finding id/line; graph omits authored-fact lookalike | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.authored-fact-refused.test.generated.ts` |
| `contract-parity` | extraction finding count; serialized graph parity; generated-contract parity | Base `extract` + `validateGraph`; parity Thens additionally materialize two pairs, `extract` x4, `serializeGraph` x2, `generateContracts` x2 | **REFUSE** — exact shape failure below |
| `duplicate-surface-refused` | extraction finding count; duplicate-id finding; omitted duplicate Spec; no edge naming it; healthy sibling retained | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.duplicate-surface-refused.test.generated.ts` |
| `example-space-extraction` | extraction finding count; Spec count; parent example-space step; pseudo-scenario omitted | `extract` once; then graph reads | **ADOPT** — `test/carrier.gherkin-authoring.example-space-extraction.test.generated.ts` |
| `malformed-relation-refused` | extraction finding count; first finding id/line; malformed Spec omitted | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.malformed-relation-refused.test.generated.ts` |
| `missing-id-refused` | extraction finding count; first finding id/line; unidentified Spec omitted | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.missing-id-refused.test.generated.ts` |
| `parent-child-extraction` | extraction finding count; Spec count; parent and child kinds; declared `refines` and `verifies` relations | `extract` once; then graph and edge reads | **ADOPT** — `test/carrier.gherkin-authoring.parent-child-extraction.test.generated.ts` |
| `unbound-ready-refused` | validation finding count; `honesty/readiness-floor` finding; retained example Spec | `extract` once to obtain the graph, then `validateGraph` to produce the required finding; graph read | **REFUSE** — exact shape failure below |
| `unknown-tag-refused` | extraction finding count; first finding id/line; unknown-tag Spec omitted | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.unknown-tag-refused.test.generated.ts` |
| `unsupported-construct-refused` | extraction finding count; first finding id/line; Scenario Outline Spec omitted | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.unsupported-construct-refused.test.generated.ts` |
| `description-location-refused` | extraction finding count; first finding id/physical line; invalid Spec omitted | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.description-location-refused.test.generated.ts` |
| `step-less-scenario-refused` | extraction finding count; first finding id/Scenario line; step-less Spec omitted | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.step-less-scenario-refused.test.generated.ts` |
| `multi-finding-bounded` | extraction finding count; first finding id/line; bounded Spec count; invalid parent omitted; no edge names invalid child; healthy sibling retained | `extract` once; then extraction-report and graph reads | **ADOPT** — `test/carrier.gherkin-authoring.multi-finding-bounded.test.generated.ts` |

Accounting: **11 adopted + 2 refused = 13 examples**.

## Honest refusal proofs and freeze friction

### `unbound-ready-refused`

The generated sibling accepts exactly the frozen adapter:

```ts
export function registerUnboundReadyRefused<World>(
  adapters: RunnableExampleAdapters<World, GherkinAuthoringConditions, GherkinAuthoringOutcome>,
): void
```

The relevant frozen callback is:

```ts
readonly invoke: (world: W, point: Partial<C>) => void | Promise<void>;
```

Its generated When calls `invokeRunnableExample` once, but its Then explicitly requires `validation reports {findingCount} findings` and `the report contains finding {findingId}` with `findingId: "honesty/readiness-floor"`. The suite can produce that validation finding only as:

```ts
const result = extract({ root: state.root });
state.validationReport = validateGraph(result.graph);
```

Unlike the 11 adopted examples, the second product call is required by this example's Thens. Hiding both calls in one `invoke` is the plan-35 contortion, so the original `bindExample(unboundReadyRefusedContract, world, bindings)` remains.

### `contract-parity`

The same generated adapter has one observed Outcome:

```ts
readonly observe: (world: W) => O;
readonly assertions?: (world: W, observed: O) => void | Promise<void>;
```

The current parity Then behavior is not a read-only join over the first invocation. The graph-parity Then materializes two roots, calls `extract` twice, then calls `serializeGraph` twice. The contracts-parity Then materializes another two roots, calls `extract` twice, then calls `generateContracts` twice. Moving these calls to `observe` or `assertions` would use the optional assertion callback as a second execution phase rather than a read-only join. The original `bindExample(contractParityContract, world, bindings)` remains.

### Freeze-friction record

1. Different-kind Thens still require one chosen comparator Outcome; the 11 adopted examples use extraction count as that Outcome and move only read-only joins to `assertions`.
2. The generated interface has no multi-operation execution model. This is harmless for extract-only examples but an honest refusal for validation and parity examples whose Thens require later product calls.
3. Cleanup registries are not worlds. `temporaryRoots` contains paths for `afterEach`; mutable graph/report state is fresh inside every `GherkinWorld`.
4. No interface, helper, fixture, generated contract, Spec, oracle, or anchor descriptor was edited to make the split fit.

## Family ledger row

| Family | Outcome | Evidence | Newly tracked generated siblings |
| --- | --- | --- | --- |
| `carrier.gherkin-authoring` | **SPLIT: ADOPT 11 / REFUSE 2** | Eleven examples require one `extract` and read-only report/graph joins. `unbound-ready-refused` requires `validateGraph`; `contract-parity` requires rematerialization and additional extract/serialization/codegen calls. | `authored-fact-refused`, `description-location-refused`, `duplicate-surface-refused`, `example-space-extraction`, `malformed-relation-refused`, `missing-id-refused`, `multi-finding-bounded`, `parent-child-extraction`, `step-less-scenario-refused`, `unknown-tag-refused`, `unsupported-construct-refused` siblings under `test/carrier.gherkin-authoring.*.test.generated.ts` |

The refused siblings `test/carrier.gherkin-authoring.contract-parity.test.generated.ts` and `test/carrier.gherkin-authoring.unbound-ready-refused.test.generated.ts` remain untracked.

## Anchor-pin flip table

`test/self-hosting-oracle/anchors.ts` was read only. These exact current `site:` strings and replacements are recorded for the anchor owner; this task did not edit the oracle.

| Anchor entry id | Exact current `site:` | Replacement in suite |
| --- | --- | --- |
| `test:protocol.gherkin-authoring.authored-fact-refused` | `bindExample(authoredFactRefusedContract` | `registerAuthoredFactRefused(` |
| `test:protocol.gherkin-authoring.duplicate-surface-refused` | `bindExample(duplicateSurfaceRefusedContract` | `registerDuplicateSurfaceRefused(` |
| `test:protocol.gherkin-authoring.example-space-extraction` | `bindExample(exampleSpaceExtractionContract` | `registerExampleSpaceExtraction(` |
| `test:protocol.gherkin-authoring.malformed-relation-refused` | `bindExample(malformedRelationRefusedContract` | `registerMalformedRelationRefused(` |
| `test:protocol.gherkin-authoring.missing-id-refused` | `bindExample(missingIdRefusedContract` | `registerMissingIdRefused(` |
| `test:protocol.gherkin-authoring.parent-child-extraction` | `bindExample(parentChildExtractionContract` | `registerParentChildExtraction(` |
| `test:protocol.gherkin-authoring.unknown-tag-refused` | `bindExample(unknownTagRefusedContract` | `registerUnknownTagRefused(` |
| `test:protocol.gherkin-authoring.unsupported-construct-refused` | `bindExample(unsupportedConstructRefusedContract` | `registerUnsupportedConstructRefused(` |
| `test:protocol.gherkin-authoring.description-location-refused` | `bindExample(descriptionLocationRefusedContract` | `registerDescriptionLocationRefused(` |
| `test:protocol.gherkin-authoring.step-less-scenario-refused` | `bindExample(stepLessScenarioRefusedContract` | `registerStepLessScenarioRefused(` |
| `test:protocol.gherkin-authoring.multi-finding-bounded` | `bindExample(multiFindingBoundedContract` | `registerMultiFindingBounded(` |

The two refused anchor sites remain unchanged:

- `test:protocol.gherkin-authoring.contract-parity` → `bindExample(contractParityContract`
- `test:protocol.gherkin-authoring.unbound-ready-refused` → `bindExample(unboundReadyRefusedContract`

## Freshness (`stale_state`)

```text
latest specs commit epoch: 1786847368
latest specs commit date:  Sun Aug 16 04:29:28 2026 +0200
adopted sibling epoch:     1787158017
adopted sibling timestamp: 2026-08-19 18:46:57 +0200
freshness delta:           +310649 seconds
```

All 11 adopted siblings have that newer timestamp. The two refused siblings were also inspected at the same fresh timestamp, so refusal is semantic rather than stale-byte avoidance.

No generation command was run; the task explicitly supplied freshly regenerated siblings and forbade serialized generation/build/check commands.

## Tracking receipt

The force-add used the required lock retry around exactly the 11 adopted paths:

```text
for i in 1 2 3 4 5; do
  git add -f "${files[@]}" && break
  sleep 1
done
```

Receipt:

```text
tracked adopted siblings: 11
tracked refused siblings: 0
```

Each adopted sibling's staged index blob equals its worktree blob:

```text
99d5486a885806cbf8fa96a290a73a5ebcb69afc  authored-fact-refused
596cb7ad7acd7fde6ba5091065e5d9e6df74e8c5  description-location-refused
d5b2f01ab28154d0d5d34f7afb617ad9660cd158  duplicate-surface-refused
7dd1f93cbd254ef44e8b6a3f84f03cd498dca992  example-space-extraction
c2b88b8f58e152ced81678158e3d56e87323696b  malformed-relation-refused
15472d74b2b9977a608149abc8e05b951006c5a5  missing-id-refused
a4e83d80ad77a2f0943f4da63239a421b891b4a3  multi-finding-bounded
f779b175ad76b5a0a62640ca17279b7a93573682  parent-child-extraction
7092f7276e6c0b5172df530d9d1ce51cc8252467  step-less-scenario-refused
767882ddb263eb8cf947b5bce7da26f3813ecb7c  unknown-tag-refused
2cf0c2795b587f62b567bfa29e9ec161d2b93c0d  unsupported-construct-refused
```

## Verification transcript

Focused suite after rewrite and again after force-add:

```text
$ npx vitest run test/self-hosting-carrier-gherkin.test.ts
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol
 Test Files  1 passed (1)
      Tests  13 passed (13)
 Duration  1.04s (transform 437ms, setup 0ms, import 843ms, tests 56ms, environment 0ms)
```

Site accounting:

```text
registerAuthoredFactRefused(...)
bindExample(contractParityContract, world, bindings)
registerDuplicateSurfaceRefused(...)
registerExampleSpaceExtraction(...)
registerMalformedRelationRefused(...)
registerMissingIdRefused(...)
registerParentChildExtraction(...)
bindExample(unboundReadyRefusedContract, world, bindings)
registerUnknownTagRefused(...)
registerUnsupportedConstructRefused(...)
registerDescriptionLocationRefused(...)
registerStepLessScenarioRefused(...)
registerMultiFindingBounded(...)

register count: 11
bindExample count: 2
```

Static checks:

```text
$ npx eslint test/self-hosting-carrier-gherkin.test.ts
# exit 0
$ npx prettier --check test/self-hosting-carrier-gherkin.test.ts
Checking formatting...
All matched files use Prettier code style!
$ git diff --check -- test/self-hosting-carrier-gherkin.test.ts
# exit 0
$ git diff --cached --check -- test/carrier.gherkin-authoring.*.test.generated.ts
# exit 0
```

LSP diagnostics were requested repeatedly before and after execution, but the workspace LSP daemon socket remained unavailable. This is not presented as a clean LSP result; ESLint, Prettier, diff checks, and focused Vitest are the executed validators.

## Adversarial notes

| Class | Result |
| --- | --- |
| `stale_state` | Exercised. Every adopted sibling is 310649 seconds newer than the latest specs commit. |
| `misleading_success_output` | Exercised. The real focused run executed 13 tests; source accounting independently proves 11 registrar activations and the exact two refusals. |
| `dirty_worktree` | Exercised. At correction start, owned status contained only this evidence file from the rejected attempt. Concurrent lanes later added validator/pack/import/J evidence and plan changes; they are listed by `git status` but were neither edited nor restored here. Final owned status is the suite, 11 staged siblings, and this evidence file. |
| malformed input | N/A — existing malformed corpora are read-only fixtures; no parser surface changed. |
| prompt injection | N/A — no prompt or recipe surface changed. |
| cancel/resume | N/A — no resumable operation changed. |
| hung commands | N/A — focused Vitest completed in 1.04 seconds. |
| flaky tests | N/A — no sleeps, polling, or event timing was introduced. |
| repeated interruptions | N/A — no interruptible loop was introduced. |

## Cleanup and scope audit

- No scratch file, extra worktree, tampered sibling, or retained corpus was created.
- Existing `afterEach` removed every materialized corpus after each test.
- No build, generation, `check:self-hosting`, preflight, full check, commit, or push was run.
- No Spec, oracle, anchor descriptor, helper, fixture, frozen interface, other suite, or `generated/` file was edited.
- The two refused generated siblings remain ignored and untracked.
- Owned files are exactly the authored suite, 11 adopted generated siblings, and this evidence file.

## DoneClaim

```json
{
  "task": "st_01a01af1 / plan-37 todo 6",
  "changed_files": [
    "test/self-hosting-carrier-gherkin.test.ts",
    "test/carrier.gherkin-authoring.authored-fact-refused.test.generated.ts",
    "test/carrier.gherkin-authoring.description-location-refused.test.generated.ts",
    "test/carrier.gherkin-authoring.duplicate-surface-refused.test.generated.ts",
    "test/carrier.gherkin-authoring.example-space-extraction.test.generated.ts",
    "test/carrier.gherkin-authoring.malformed-relation-refused.test.generated.ts",
    "test/carrier.gherkin-authoring.missing-id-refused.test.generated.ts",
    "test/carrier.gherkin-authoring.multi-finding-bounded.test.generated.ts",
    "test/carrier.gherkin-authoring.parent-child-extraction.test.generated.ts",
    "test/carrier.gherkin-authoring.step-less-scenario-refused.test.generated.ts",
    "test/carrier.gherkin-authoring.unknown-tag-refused.test.generated.ts",
    "test/carrier.gherkin-authoring.unsupported-construct-refused.test.generated.ts",
    ".omo/evidence/task-6-plan-37-settling-arc.md"
  ],
  "tests": [
    {
      "command": "npx vitest run test/self-hosting-carrier-gherkin.test.ts",
      "result": "pass: 1 file, 13 tests"
    },
    {
      "command": "npx eslint test/self-hosting-carrier-gherkin.test.ts",
      "result": "pass"
    },
    {
      "command": "npx prettier --check test/self-hosting-carrier-gherkin.test.ts",
      "result": "pass"
    },
    {
      "command": "git diff --check plus staged sibling byte checks",
      "result": "pass; all 11 index blobs equal worktree blobs"
    }
  ],
  "manual_qa": {
    "family_disposition": "11 ADOPT / 2 REFUSE",
    "adopted_product_shape": "one extract invocation plus read-only extraction-report/graph assertions",
    "refusals": [
      "contract-parity: additional extraction, serialization, and contract-generation calls",
      "unbound-ready-refused: extract plus required validateGraph call"
    ],
    "site_accounting": "11 register calls, 2 bindExample calls",
    "freshness": "all siblings inspected are 310649 seconds newer than latest specs commit"
  },
  "cleanup": [
    "no scratch retained",
    "two refused siblings remain untracked",
    "no serialized command, commit, or push"
  ],
  "risks": [
    "Anchor-pin replacements are recorded but intentionally not applied to the frozen oracle in this lane.",
    "The frozen comparator owns one Outcome kind; additional adopted Thens remain paramsForStep-backed assertions."
  ]
}
```
