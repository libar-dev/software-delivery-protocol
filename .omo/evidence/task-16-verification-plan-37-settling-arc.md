# Todo 16 adversarial verification: plan 37 settling arc

## Verdict

```json
{
  "AdversarialVerify": {
    "taskId": "st_01a01de7",
    "commit": "7f768d1679d3c78e57aef86638609b372f8dc5a0",
    "verdict": "confirmed",
    "reason": "Every Plan-37 Todo 16 acceptance criterion is met on the already captured evidence. Auxiliary nonzero commands were verifier-authored mistakes or ordering probes and leave no criterion unmet."
  }
}
```

## Re-review (first epoch)

This epoch does not rerun the gate. It maps each Plan-37 Todo 16 acceptance criterion and each
adversarial requirement onto the evidence already recorded below. The only new observation is a
read-only `git status --short`: the worktree still has the same unrelated `.omo/boulder.json`
change and five parity-plan untracked files, plus this artifact. No product or source file changed
since the prior verification.

### Plan-37 Todo 16 acceptance criteria

| Criterion | Evidence already captured | Status |
| --- | --- | --- |
| Apply only the five owner-ratified one-rung carrier edits: pack-aggregate, relations, spec-sections, claim-taxonomy, markdown-authoring | Carrier diffs are one `readiness: defined` to `readiness: ready` line each; live graph states those five as `ready` | met |
| Matching family oracle descriptors for those five only | `model.ts` three rows, `extraction.ts` one row, `carrier.ts` one row; `consumers.ts` untouched | met |
| Leave DEFINED carriers untouched: core-model, regenerability, projections-model | Parent and commit descriptors remain `defined`; live graph states those three as `defined` with derived `ready` | met |
| Record the owner decision on all eight packets | Each packet gained only a `## 6. Owner ratification` record with disposition, date `2026-08-20`, bundle reference, and matching reason or blocking reason | met |
| Owner-amended test delta is only the exact histogram in `test/self-hosting-graph.test.ts` | One-line change `{ defined: 14, idea: 3, ready: 138, scoped: 1 }` to `{ defined: 9, idea: 3, ready: 143, scoped: 1 }` | met |
| Owner-amended warning oracle is five full exact objects plus comment in `test/self-hosting-oracle/index.ts` | Ordered `honesty/gaps` objects for the five READY Specs; assertion remains `toEqual(expectedWarnings)` | met |
| Structural pins at `test/self-hosting-graph.test.ts:142-147` byte-identical | Parent-to-commit `cmp` of that block; still `156/1/157 -> 314/660` | met |
| No filter, count-only assertion, derived expected value, suppression, or weakened matcher | Exact `toEqual` histogram, exact `toEqual(expectedWarnings)`, exact family descriptor `toEqual` | met |
| No unauthorized carrier, oracle, test, check, validator, or floor edit | Exact 22-path manifest; no `src/`, validator, floor, check, recipe, helper, package, or generated path | met |
| Canonical validate exits 0 with `156/1/157 -> 314/660` and exactly five `honesty/gaps` warnings for the five READY Specs | `npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` | met |
| Live recipe 2 returns exactly three alarms with ids `spec:consumers.projections-model`, `spec:extraction.regenerability`, `spec:model.core-model` | Canonical `pnpm --silent sdp:q` body | met |
| Focused graph suite 26/26 | `npx vitest run test/self-hosting-graph.test.ts` once, all passed | met |
| Commit subject and footer exact | `docs(specs): state ready on owner-ratified drift-alarm Specs (brief J)` and `Plan: .omo/plans/plan-37-settling-arc.md` | met |
| Typecheck, format, scoped diff-check | `npx tsc --noEmit`, `npm run format:check`, parent-to-commit `git diff --check` all exit 0 | met |
| Generated outputs clean; no leftover QA process | Final generated roots present; `git status --short -- generated` empty; process scan empty | met |
| Dirty-worktree isolation: unrelated `.omo` dirt not absorbed | Commit manifest excludes boulder and parity-plan files; this epoch's status still shows them unstaged | met |

No row is unmet. The verdict is therefore `confirmed`.

### Adversarial requirements

| Probe | Mapping | Status |
| --- | --- | --- |
| `stale_state` | Fresh generation and live queries, not the commit message or executor evidence, produced the counts, warnings, histogram, and recipe membership | met |
| `dirty_worktree` | Commit manifest compared with status; unrelated `.omo` dirt remained outside the commit and outside product paths | met |
| `misleading_success_output` | Validate exit 0 was not treated as enough; warning subjects, recipe membership, and exact assertions were checked independently | met |
| `test_weakening` | Exact objects, exact histogram, exact family descriptors, and exact structural pins remain; future unapproved warning or readiness drift still fails | met |
| `generated_cached_artifacts` | Lawful regeneration derived the projections; generated status stayed clean | met |
| `malformed_input` | Observed only as a verifier-authored `g.spec` probe; it failed closed and is not a Todo 16 criterion | note |
| `prompt_injection` | Not applicable; query bodies were locally authored | n/a |
| `cancel_resume` | Not applicable; no command was cancelled or resumed | n/a |
| `hung_or_long_commands` | Not applicable; every command completed inside its bound | n/a |
| `flaky_tests` | Not applicable; the focused suite passed once with no retry or wait | n/a |
| `repeated_interruptions` | Not applicable; no command was interrupted | n/a |

### Nonblocking verifier mistakes

The four nonzero auxiliary commands from the first verification epoch remain disclosed below. None
of them is a Plan-37 Todo 16 acceptance criterion, and none leaves a criterion unmet:

- unsupported `g.spec` was verifier malformed input, later corrected by `g.specs().find`
- `check:self-hosting` before generation was an ordering probe, later green after serialized generation
- invalid `awk` quoting was a verifier shell error, later corrected by a read-only extraction
- looking up `apply_patch` as a shell executable was a tool-selection mistake, not a product failure

## Material read

I read the current Todo 16 and owner amendment, full ratification bundle, executor evidence,
scope-adjudication evidence, all eight packet owner records, and the complete parent-to-commit diff
and manifest from `7b99baab4c7d722c9472d7e59e37b656772a625c` to
`7f768d1679d3c78e57aef86638609b372f8dc5a0`.

## Owner decisions and applied readiness

The bundle, packets, live graph, carrier diff, and family descriptors agree:

| Spec | Decision | Commit result |
| --- | --- | --- |
| `spec:model.pack-aggregate` | `READY` | carrier and model descriptor moved one rung to `ready` |
| `spec:model.relations` | `READY` | carrier and model descriptor moved one rung to `ready` |
| `spec:model.spec-sections` | `READY` | carrier and model descriptor moved one rung to `ready` |
| `spec:extraction.claim-taxonomy` | `READY` | carrier and extraction descriptor moved one rung to `ready` |
| `spec:carrier.markdown-authoring` | `READY` | carrier and carrier descriptor moved one rung to `ready` |
| `spec:model.core-model` | `DEFINED` | carrier and descriptor remain `defined` |
| `spec:extraction.regenerability` | `DEFINED` | carrier and descriptor remain `defined` |
| `spec:consumers.projections-model` | `DEFINED` | carrier and descriptor remain `defined` |

The live graph reports derived readiness `ready` for all eight, while stated readiness follows the
five READY and three DEFINED decisions exactly. Its histogram is
`{ready: 143, defined: 9, idea: 3, scoped: 1}`.

Each packet adds only its owner record with the selected disposition, repeated decision, date
`2026-08-20`, ratification-bundle reference and owner statement, and matching reason or blocking
reason. The bundle records all eight decisions and the owner statement `Ratify proposed set`.

## Commit and scope audit

Commit metadata is exact:

```text
docs(specs): state ready on owner-ratified drift-alarm Specs (brief J)

Plan: .omo/plans/plan-37-settling-arc.md
```

An exact comparison confirmed this 22-path manifest:

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

No `src/`, validator, readiness-floor, check, recipe, helper, package, generated, other carrier,
or other test/oracle path is in the commit. `test/self-hosting-oracle/consumers.ts` is untouched.

## Owner-amended test audit

- `test/self-hosting-graph.test.ts` changes only the exact histogram from
  `{ defined: 14, idea: 3, ready: 138, scoped: 1 }` to
  `{ defined: 9, idea: 3, ready: 143, scoped: 1 }`.
- The structural block at lines 142-147 is byte-identical between parent and commit and still pins
  `156/1/157 -> 314/660`.
- `test/self-hosting-oracle/index.ts` changes only the stale comment and `expectedWarnings` value.
  The replacement is an exact ordered array of five full objects with `validatorId`, `family`,
  `severity`, and `subjectId`.
- The warning assertion remains `toEqual(expectedWarnings)`. The histogram and per-family
  descriptor assertions also remain exact `toEqual` comparisons.
- There is no filter, count-only assertion, partial matcher, suppression, derived expected value,
  or structural-pin change.

These assertions still fail on added, removed, reordered, renamed, or severity-changed warnings,
unapproved readiness changes, balanced readiness swaps, and carrier/oracle disagreements.

## Fresh required verification

| Command | Result |
| --- | --- |
| `npx vitest run test/self-hosting-graph.test.ts` | exit 0, 26/26 passed in one run |
| canonical Todo 16 `sdp validate` | exit 0, `156/1/157 -> 314/660`, 0 errors and 5 warnings |
| canonical live recipe 2 | exit 0, exactly 3 alarms |
| `npx tsc --noEmit` | exit 0 |
| `npm run format:check` | exit 0 |
| scoped parent-to-commit `git diff --check` | exit 0 |

The validation warnings are exactly `honesty/gaps`, family `honesty`, severity `warning`, for:

```text
spec:carrier.markdown-authoring
spec:extraction.claim-taxonomy
spec:model.pack-aggregate
spec:model.relations
spec:model.spec-sections
```

Recipe 2 returned exactly the three retained DEFINED IDs and expected fields:

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

## Nonzero auxiliary commands (disclosed notes, not criteria)

These auxiliary verifier invocations exited nonzero in the first epoch. They stay on the record as
verifier-authored mistakes or ordering probes. They leave no Todo 16 acceptance criterion unmet:

1. A live query used unsupported `g.spec(id)` and exited 1 with
   `sdp q: g.spec is not a function`. The documented `g.specs().find(...)` query then returned all
   eight exact owner states. This was verifier malformed input, not corpus-derived code.
2. `npm run check:self-hosting`, invoked immediately after canonical validate, exited 1 with
   `projection-suite: design-review has no published tree to certify`. A fresh serialized
   `npm run generate:self-hosting && npm run check:self-hosting` later exited 0 and certified all
   four roots. No product file was edited.
3. An auxiliary retained-descriptor extraction had invalid `awk` quoting and exited 1. The corrected
   read-only extraction showed all three retained descriptors as `defined` in parent and commit.
4. The requested `apply_patch` executable was absent from PATH and the filesystem lookup found no
   executable. Its direct invocation exited 127 before writing anything. This artifact was then
   applied as a patch through a local `apply_patch` shell function backed by `git apply`; no direct
   file-write command was used.

All prescribed acceptance commands passed. Re-review treats these auxiliary failures as notes, not
as a reason to withhold `confirmed`.

## Adversarial probes

- `stale_state`: fresh generation and live queries agree on counts, warnings, histogram, and recipe
  membership.
- `dirty_worktree`: baseline and final status retain the same unrelated `.omo/boulder.json` change
  and five parity-plan untracked files. None entered the Todo 16 commit. This verifier adds only
  this artifact.
- `misleading_success_output`: validation exit 0 was not enough. Full warning identities, recipe
  membership, assertions, and the focused suite were checked independently.
- `test_weakening`: exact warning objects, histogram, family descriptors, and structural pins remain
  active. No filter, partial matcher, count-only assertion, or suppression was added.
- `generated_cached_artifacts`: fresh generation derived all roots. Final `check:self-hosting` exited
  0 and `git status --short -- generated` is empty.
- `malformed_input`: observed in the unsupported `g.spec` query. It failed closed without state
  change.
- `prompt_injection`: not applicable. All query bodies were locally authored.
- `cancel_resume`: not applicable. No command was cancelled or resumed.
- `hung_or_long_commands`: no hang; every command had a bounded timeout.
- `flaky_tests`: no retry, wait, or timing dependence; the focused suite passed once, 26/26.
- `repeated_interruptions`: not applicable. No command was interrupted.

## Cleanup

The final generated roots are `census`, `contracts`, `design-review`, `gherkin`, `graph.json`,
`mermaid`, and `registrars.json`. No tracked generated output is dirty. The process scan found no
Vitest, projection-suite, self-hosting check, SDP CLI, TypeScript, or Prettier process. No scratch
file or directory was created. The only verifier-authored file is this artifact.

