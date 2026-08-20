# Todo 16 evidence: plan 37 settling arc

## Result

RESUMED under the owner-approved narrow amendment recorded in `.omo/plans/plan-37-settling-arc.md` and `.omo/evidence/task-16-scope-adjudication-plan-37-settling-arc.md`. The exact readiness histogram and five full warning objects were updated, all 26 focused graph tests pass, canonical validation is green with five informative warnings, and recipe 2 has exactly the three retained DEFINED alarms. The authorized atomic commit is recorded by its exact staged manifest below.

## Blocked epoch retained

The first execution stopped before commit because the focused graph test exposed two stale exact expectations while the original scope forbade test edits. The original RED result was `24 passed | 2 failed | 26 total`: five `honesty/gaps` warnings were compared with `expectedWarnings = []`, and the live histogram was `{ defined: 9, idea: 3, ready: 143, scoped: 1 }` against `{ defined: 14, idea: 3, ready: 138, scoped: 1 }`. No readiness or packet work was reverted. The amendment now permits only those two exact expected-output updates and retains all structural pins and assertion precision.

## Baseline RED

Command, run before any carrier or oracle edit:

```sh
pnpm --silent sdp:q 'const rungs = ["idea", "scoped", "defined", "ready"]; const alarms = g.specs().filter((spec) => spec.deliveryFacts.includes("implemented") && spec.statedReadiness !== "ready").map((spec) => { const context = g.specContext(spec.id); const unmet = context === undefined ? [] : context.floorFailures; return { id: spec.id, statedReadiness: spec.statedReadiness, floorReached: spec.derivedReadiness ?? "none", firstUnmetClause: unmet.length === 0 ? null : unmet[0].clauseId, implementationBindings: context === undefined ? 0 : context.implementations.length }; }).sort((left, right) => rungs.indexOf(left.statedReadiness) - rungs.indexOf(right.statedReadiness)); return { total: alarms.length, alarms };' --json
```

Exact result summary:

```json
{
  "total": 8,
  "ids": [
    "spec:carrier.markdown-authoring",
    "spec:consumers.projections-model",
    "spec:extraction.claim-taxonomy",
    "spec:extraction.regenerability",
    "spec:model.core-model",
    "spec:model.pack-aggregate",
    "spec:model.relations",
    "spec:model.spec-sections"
  ]
}
```

Each alarm had `statedReadiness: "defined"`, `floorReached: "ready"`, `firstUnmetClause: null`, and its observed implementation binding count was 1, 2, 2, 1, 3, 1, 1, and 2 respectively in the output order above.

## Owner disposition applied

The ratification bundle records the repository owner's statement `Ratify proposed set` on 2026-08-20:

- READY: `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`, `spec:extraction.claim-taxonomy`, `spec:carrier.markdown-authoring`.
- DEFINED and untouched carriers: `spec:model.core-model`, `spec:extraction.regenerability`, `spec:consumers.projections-model`.
- Defined blocking reasons retained exactly: `Blocking enrichment-lifecycle question remains open.`, `Quoted thresholds lack their measurement artifact.`, and `Impact-graph and measurement work remain unlanded; plan 35 explicitly retained defined.`

The five READY carrier frontmatter values and matching rows in `test/self-hosting-oracle/model.ts`, `test/self-hosting-oracle/extraction.ts`, and `test/self-hosting-oracle/carrier.ts` were changed one rung. The eight packet files received additive owner-ratification sections; prior pending fields and both evidence readings remain visible. `test/self-hosting-oracle/consumers.ts` was not changed.

## Stale-state probe before regeneration

Fresh graph query immediately after the authored/oracle edits, before regeneration, returned:

```json
{
  "total": 3,
  "ids": [
    "spec:consumers.projections-model",
    "spec:extraction.regenerability",
    "spec:model.core-model"
  ]
}
```

## Serialized regeneration

Only one whole-tree/generated command was run, serially:

```sh
npm run generate:self-hosting
```

Result summary: `156 specs · 1 packs · 157 anchors -> 314 nodes · 660 edges (0 errors, 0 warnings)` for each published root. It wrote graph, contracts, Design Review, census, Mermaid, and Gherkin projections. Validation emitted five expected informative `honesty/gaps` warnings for the five READY Specs with no resolving verifier. Generated outputs are ignored; `git status --short -- generated` was empty after regeneration.

## Required checks

- `npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`: exit 0. Output: `156 specs · 1 packs · 157 anchors -> 314 nodes · 660 edges (0 errors, 0 warnings)` and `validate: 0 errors · 5 warnings`.
- `pnpm --silent sdp:q '<recipe 2 body>' --json` after regeneration: exit 0, exactly the three alarms above. The five READY IDs are absent.
- `npx vitest run test/self-hosting-graph.test.ts`: exit 1. 24 tests passed and 2 failed:
  - `derives a graph the conformance and honesty checks leave without a finding`: received five expected `honesty/gaps` warnings for the newly READY Specs, while `test/self-hosting-oracle/index.ts` still supplies `expectedWarnings = []`.
  - `holds the frozen stated-readiness distribution`: received `{ defined: 9, idea: 3, ready: 143, scoped: 1 }`, while the test pin remains `{ defined: 14, idea: 3, ready: 138, scoped: 1 }`.
- The frozen structural pins themselves remain unchanged: `156 / 1 / 157` and `314 / 660`.
- `npx tsc --noEmit`: exit 0.
- `npx biome check test/self-hosting-oracle/model.ts test/self-hosting-oracle/extraction.ts test/self-hosting-oracle/carrier.ts`: attempted, but `npx` resolved and attempted to install unrelated `biome@0.3.3`; no repository Biome binary is linked. No source change resulted.
- `git diff --check` over owned carriers, oracle modules, packet files, and ratification bundle: exit 0.

## Adversarial probes

- `stale_state`: applicable; fresh queries were run before and after regeneration. Both showed the same exact three post-edit alarms.
- `dirty_worktree`: applicable; no staging or destructive Git command was used. Existing unrelated `.omo` dirt remains untouched.
- `misleading_success_output`: caught; validate exit 0 was not treated as sufficient because the required graph test failed.
- `generated_cached_artifacts`: applicable; regeneration used the repository script, and no generated files are tracked or dirty.
- `malformed_input`: not applicable; no malformed input trigger occurred.
- `prompt_injection`: not applicable; no corpus content was executed as a query body.
- `cancel_resume`: not applicable; no cancellation occurred.
- `hung_or_long_commands`: not applicable; all commands completed within their bounded invocations.
- `flaky_tests`: not applicable; the focused failure is deterministic and assertion-specific.
- `repeated_interruptions`: not applicable; no interruption occurred.

## Changed-file attribution

Product/readiness delta, exactly eight files:

```text
specs/carrier/markdown-authoring.sdp.md
specs/extraction/claim-taxonomy.sdp.md
specs/model/pack-aggregate.sdp.md
specs/model/relations.sdp.md
specs/model/spec-sections.sdp.md
test/self-hosting-oracle/carrier.ts
test/self-hosting-oracle/extraction.ts
test/self-hosting-oracle/model.ts
```

Packet/evidence changes are the eight packet files, the already owner-updated ratification bundle, and this evidence file. No test file, validator, floor, recipe, package file, plan file, `AGENTS.md`, parity artifact, Boulder file, ledger, or ultrawork notepad was staged or edited by this task. The pre-existing `.omo/boulder.json` modification and unrelated untracked `.omo` files remain present.

## Cleanup

No scratch directory or temporary process remains. Generated outputs are ignored and clean. The first blocked epoch performed no staging. The resumed epoch stages only the manifest below; Boulder, ledger, ultrawork notepad, parity plan/evidence, and unrelated dirt remain unstaged.

## Approved amendment and GREEN completion

The amendment permits exactly:

- `test/self-hosting-graph.test.ts`: one literal change, `{ defined: 14, idea: 3, ready: 138, scoped: 1 }` to `{ defined: 9, idea: 3, ready: 143, scoped: 1 }`.
- `test/self-hosting-oracle/index.ts`: the existing comment/value replaced by five complete finding objects, ordered exactly as emitted: `honesty/gaps`, `honesty`, `warning`, with subjects `spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`, `spec:model.relations`, and `spec:model.spec-sections`.

The structural pins were audited byte-identically: `156/1/157`, `314/660`, and the source lines at 142-147 were unchanged. No other test or oracle file changed.

Fresh required results:

```text
npx vitest run test/self-hosting-graph.test.ts
Test Files  1 passed (1)
Tests       26 passed (26)
exit 0

npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
156 specs · 1 packs · 157 anchors -> 314 nodes · 660 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
exit 0
```

The five validation warnings are the exact full objects in the oracle expectation. The live recipe-2 query returned:

```json
{
  "total": 3,
  "alarms": [
    {"id":"spec:consumers.projections-model","statedReadiness":"defined","floorReached":"ready","firstUnmetClause":null,"implementationBindings":2},
    {"id":"spec:extraction.regenerability","statedReadiness":"defined","floorReached":"ready","firstUnmetClause":null,"implementationBindings":1},
    {"id":"spec:model.core-model","statedReadiness":"defined","floorReached":"ready","firstUnmetClause":null,"implementationBindings":3}
  ]
}
```

The five READY IDs are absent. `npx tsc --noEmit` exited 0. `npm run format:check` exited 0 with `All matched files use Prettier code style!`. `git diff --check` exited 0. The repository LSP daemon was unavailable; the compiler and repository formatter supplied the applicable checks.

## Authorized commit manifest

The exact Todo-16-owned paths to stage and commit are:

```text
.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md
.omo/evidence/plan-37-j-packets/carrier/markdown-authoring.md
.omo/evidence/plan-37-j-packets/consumers/projections-model.md
.omo/evidence/plan-37-j-packets/extraction/claim-taxonomy.md
.omo/evidence/plan-37-j-packets/extraction/regenerability.md
.omo/evidence/plan-37-j-packets/model/core-model.md
.omo/evidence/plan-37-j-packets/model/pack-aggregate.md
.omo/evidence/plan-37-j-packets/model/relations.md
.omo/evidence/plan-37-j-packets/model/spec-sections.md
.omo/evidence/task-16-plan-37-settling-arc.md
.omo/evidence/task-16-scope-adjudication-plan-37-settling-arc.md
.omo/plans/plan-37-settling-arc.md
specs/carrier/markdown-authoring.sdp.md
specs/extraction/claim-taxonomy.sdp.md
specs/model/pack-aggregate.sdp.md
specs/model/relations.sdp.md
specs/model/spec-sections.sdp.md
test/self-hosting-graph.test.ts
test/self-hosting-oracle/carrier.ts
test/self-hosting-oracle/extraction.ts
test/self-hosting-oracle/index.ts
test/self-hosting-oracle/model.ts
```

The commit subject is exactly `docs(specs): state ready on owner-ratified drift-alarm Specs (brief J)`. No generated output is tracked or staged. The commit SHA is reported by the executor after this manifest is committed.
