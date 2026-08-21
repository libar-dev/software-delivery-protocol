# Task 2 decision-carrier slice

Subtask: author `specs/decisions/architectural-significance-rides-primitives.sdp.md`
from the plan's supplied Decision Spec text. Branch:
`feature/architectural-patterns-views`.

Did not edit tests, DECISIONS.md, the Pack manifest, other decision Specs, shared
rosters, plan, Boulder, or ledger. Did not recreate the oracle-first red proof.
Did not commit or push.

## Recipe 1 / recipe 2 (verbatim catalog bodies via `pnpm --silent sdp:q`)

Recipe 1 (build backlog) **before** the carrier:

```
{
  total: 0,
  byFamily: {},
  excludedReadyExamples: 66,
  excludedReadyDecisions: 33,
  excludedWithoutVerifier: []
}
```

Recipe 2 (drift alarm) before the carrier:

```
{
  total: 3,
  alarms: [
    { id: 'spec:consumers.projections-model', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 2 },
    { id: 'spec:extraction.regenerability', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 1 },
    { id: 'spec:model.core-model', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 3 }
  ]
}
```

Target-id probe before the carrier (`g.specs().filter` on this id): `{ "targetCount": 0, ... }`.

Nearby Specs resolved: `spec:model.anchors`, `spec:decisions.structural-anchor-semantics`,
`spec:decisions.binding-not-liveness` all `ready`; `spec:model.structural-patterns` still `idea`.

Recipe 1 **after** the carrier (live re-derivation):

```
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 34,
  "excludedWithoutVerifier": []
}
```

`excludedReadyDecisions` 33 → 34 is the new ready decision entering the graph.

## Automated verification

Commands:

```bash
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
npx prettier --check specs/decisions/architectural-significance-rides-primitives.sdp.md
git diff --check -- specs/decisions/architectural-significance-rides-primitives.sdp.md
```

Results:

- validate exit 0:

```
162 specs · 1 packs · 157 anchors → 320 nodes · 679 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

  Spec count 162 is the new carrier (corpus was 161). The five `honesty/gaps` warnings are the standing expected set; none name this decision.

- prettier: `Checking formatting...` / `All matched files use Prettier code style!` (exit 0)
- `git diff --check`: empty stdout (exit 0)

## Manual QA (live `sdp:q --json`)

Exact channel: `pnpm --silent sdp:q '<body>' --json`

Body: select only `spec:decisions.architectural-significance-rides-primitives` from `g.specs()`; return `count`, `id`, `statedReadiness`, live `relations` (`type`/`other`/`claim`/`resolved`), and `relationCount`.

Exact JSON (first run and identical stale_state re-run):

```
{
  "count": 1,
  "id": "spec:decisions.architectural-significance-rides-primitives",
  "statedReadiness": "ready",
  "relations": [
    {
      "type": "dependsOn",
      "other": "spec:decisions.binding-not-liveness",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "dependsOn",
      "other": "spec:decisions.structural-anchor-semantics",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.anchors",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationCount": 3
}
```

**PASS.** One Spec, stated readiness `ready`, exactly three relations (one `refines` plus two `dependsOn`), all `declared` and `resolved`.

## File scope

This slice created:

- `specs/decisions/architectural-significance-rides-primitives.sdp.md` (`git hash-object` `8556489d025e449b482420fa23cd179a8d4e2079`)
- `.omo/evidence/architectural-patterns-views/task-2-carrier.md` (this file)

Envelope: id `spec:decisions.architectural-significance-rides-primitives`, kind `decision`, altitude `feature`, readiness `ready`, `refines: spec:model.anchors`, `dependsOn` the two plan ids. Title, Intent outcome, and Decision items copied from the plan. No `supersedes`, no authored `belongsTo`, no extra prose.

## Adversarial (UltraQA)

- **stale_state**: PASS. Graph is derived in-process each `sdp:q`. Target count was 0 before the carrier; the same body then returned count 1 twice with identical JSON. Recipe 1 `excludedReadyDecisions` moved 33 → 34 after the carrier landed.
- **dirty_worktree**: PASS. Start-of-slice tracked dirt (hashes unchanged through this slice):
  - `.omo/boulder.json` `eb914a5f65ec3e1f134618694dd6281bcf14ccea`
  - `.omo/plans/architectural-patterns-views.md` `ec6cf54bf090d22021144931050dad8da13fa1db`
  - `.omo/start-work/ledger.jsonl` `0f8ab56ccae1b0be7c9578bbf5cce362ee453b1d`
  - `test/self-hosting-oracle/decisions.ts` `6dbdfde616acd28e32f8d5dff946808c13cdc843`
  - `test/self-hosting-oracle/pack-members.ts` `447f8ed57e3a0e512ef378994dff5072e79195d6`
  Concurrent sibling slices (not this worker) also left `docs/concept/DECISIONS.md` and `specs/self-hosting.pack.sdp.md` dirty plus evidence `task-2-pack.md` / `task-2-registry.md`; those paths were not edited here. This worker's only new paths are the two scoped files above.
- **generated_or_cached_artifacts**: PASS. Manual QA used live `pnpm --silent sdp:q` (writes nothing). Validate's documented sink wrote gitignored `generated/graph.json` and `generated/contracts`; those paths are `.gitignore:17` and were not read as the graph source.
- **misleading_success_output**: PASS. PASS is the JSON fields (`count === 1`, `statedReadiness === "ready"`, `relationCount === 3` with one `refines` and two `dependsOn`), not validate/sdp:q exit codes alone.
- **flaky_tests**: N/A — no tests run in this slice (oracle-first red proof is upstream `task-2-oracle-red.md`; tests were not edited).
- **race_condition**: N/A — no concurrent writers on the two scoped files; no shared mutable runtime.
- **time_dependent**: N/A — no clocks, sleeps, or wall-clock assertions.
- **environment_dependent**: N/A — local extractor over this checkout only.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: N/A — no temp files or background processes started by this slice.
- **wrong_file / scope_creep**: N/A — product edit limited to the one new carrier; evidence is this file.
- **silent_catch**: N/A — no error-handling code added.
- **malformed_input**: N/A — carrier text copied from the plan; no parser input synthesized.
- **prompt_injection**: N/A — no untrusted document treated as instructions beyond the assigned plan text.
- **cancel_resume**: N/A — one uninterrupted insertion.
- **hung_commands**: N/A — validate, prettier, git diff --check, and sdp:q returned with exit 0.
- **repeated_interruptions**: N/A — no interrupted commands.

## Cleanup receipt

- Background jobs: none (`jobs` empty; no leftover `sdp`/`vitest`/`prettier` processes).
- Temp files created by this subtask: none.
- Generated artifacts: only validate's gitignored sink (`generated/graph.json`, `generated/contracts`); no extra temp/generated files left behind.
- No commit, no push.

## Completion condition

- Exact carrier exists at `specs/decisions/architectural-significance-rides-primitives.sdp.md`: yes.
- validate exit 0: yes.
- Live query returns one Spec, readiness `ready`, exactly three relations: yes.
- Evidence file exists: yes.
- No out-of-scope edit by this worker: yes.
