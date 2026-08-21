# Task 3 evidence — promote delivery-fact conferral law

Task: `st_01a023b7` · Plan: `design-law-transfer` todo 3 · Branch: `design-law-transfer/todo-3` · Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-3`

## Scope

Owned, and only these product paths:

- `specs/extraction/delivery-facts.sdp.md` (new carrier, plan text, no examples)
- `specs/self-hosting.pack.sdp.md` (extraction-block membership)
- `src/graph/delivery-facts.ts` (`impl:protocol.delivery-facts` retarget + pointer-only header JSDoc)
- `test/extract.test.ts` (`test:protocol.delivery-facts` + one commentary retarget)
- `test/reader.test.ts` (two commentary retargets)
- `test/design-review.test.ts` (one commentary retarget)
- `test/self-hosting-oracle/extraction.ts` (exact per-Spec descriptor)

Not touched: shared `declared-relations.ts`, `pack-members.ts`, `anchors.ts` roster, frozen totals; no other `satisfies` edges; no engine behavior beyond the binding target and comments.

## Baseline (before edits)

Validate: `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` → exit 0.

```
162 specs · 1 packs · 175 anchors → 338 nodes · 747 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings
```

New-Spec query (todo 3 body):

```
sdp q: Cannot read properties of undefined (reading 'statedReadiness')
NEW_SPEC_EXIT=1
```

Parent facts query: `['implemented', 'has-verifier']` · exit 0.

Parent context: readiness `ready`, facts both, **5 implementations** (including `impl:protocol.delivery-facts`), 1 verifier.

Absence of `spec:extraction.delivery-facts` is the recorded baseline.

## Fail-first (carrier + pack only, before bindings)

New-Spec query: `{ readiness: 'ready', facts: [], implementations: 0, verifiers: 0 }` · exit 0.

Floor/context: `statedReadiness: 'ready'`, `derivedReadiness: 'ready'`, `floorFailures: []`, empty implementations and verifiers. Structural floor clears; delivery facts and the ready-with-no-verifier honesty gap do not.

Validate: 163 specs · 175 anchors · exit 0 · **6 warnings** (the new `honesty/gaps` on `spec:extraction.delivery-facts` plus the five pre-existing gaps).

## Final (after bindings)

Validate: exit 0.

```
163 specs · 1 packs · 176 anchors → 340 nodes · 751 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings
```

The sixth warning is gone; the five pre-existing honesty/gaps remain.

### Manual QA — exact new-Spec query

Command: `pnpm --silent sdp:q 'const c = g.specContext("spec:extraction.delivery-facts"); return { readiness: c.statedReadiness, facts: c.deliveryFacts, implementations: c.implementations.length, verifiers: c.verifiers.length }'`

Result: exit 0.

```
{
  readiness: 'ready',
  facts: [ 'implemented', 'has-verifier' ],
  implementations: 1,
  verifiers: 1
}
```

PASS: ready + facts `["implemented","has-verifier"]` + 1 implementation + 1 verifier.

### Parent facts

Command: `pnpm --silent sdp:q 'return g.specContext("spec:extraction.derive-graph").deliveryFacts'`

Result: `[ 'implemented', 'has-verifier' ]` · exit 0.

Parent implementations dropped from 5 to 4 (`impl:protocol.delivery-facts` left the parent); the remaining four plus `test:protocol.extract` keep both facts.

Stale-state re-run of the new-Spec query after the first PASS returned the identical JSON (exit 0).

### Focused tests

`npx vitest run test/extract.test.ts test/reader.test.ts test/design-review.test.ts` → exit 0 · **3 files, 119 passed**.

### Self-hosting graph

`npx vitest run test/self-hosting-graph.test.ts` → exit 1 · **7 failed | 19 passed**.

The extraction-family descriptor case is among the 19 passed. Failures are only the planned shared-roster mismatches reserved for todo 8:

| Failure | Delta | Owner |
| --- | --- | --- |
| holds the frozen corpus totals | specs 162→163, anchors 175→176 | todo 8 frozen totals |
| rosters exactly the authored Spec, Pack, and anchor node ids | +`test:protocol.delivery-facts` (and the new Spec id) | todo 8 anchors / identities |
| derives exactly the authored declared relations | +`refines` derive-graph, +`decidedBy` binding-not-liveness | todo 8 declared-relations |
| holds the frozen stated-readiness distribution | ready 146→147 | todo 8 frozen totals |
| derives the Pack membership edges from the manifest | +`spec:extraction.delivery-facts` | todo 8 pack-members |
| derives one binding edge per authored anchor | retarget `impl:protocol.delivery-facts` → delivery-facts; +`test:protocol.delivery-facts` verifies | todo 8 anchors |
| projects every anchor and code node at the line its declaration occupies | +`test:protocol.delivery-facts` at `test/extract.test.ts:815` | todo 8 anchors |

## Dirty-worktree probe

`git status --short` (pre-evidence):

```
 M specs/self-hosting.pack.sdp.md
 M src/graph/delivery-facts.ts
 M test/design-review.test.ts
 M test/extract.test.ts
 M test/reader.test.ts
 M test/self-hosting-oracle/extraction.ts
?? specs/extraction/delivery-facts.sdp.md
```

`git diff --check` → exit 0.

`git diff HEAD -- src/` → only `src/graph/delivery-facts.ts` (8 insertions, 37 deletions: pointer JSDoc, retargeted `satisfies`, preserved first-carrier comment, ladder-order note).

`npx prettier --check` on every owned product file → exit 0.

## Adversarial (UltraQA)

| Class | Verdict | Evidence |
| --- | --- | --- |
| `stale_state` | probed | Live in-process `sdp:q` derives the graph each call. Baseline showed the new Spec absent; fail-first and final queries were re-derived from the current tree; the final new-Spec body was re-run and matched. `generated/graph.json` was never the authority. |
| `dirty_worktree` | probed | `git status --short` and `git diff --check` (exit 0). `git diff HEAD -- src/` is only `src/graph/delivery-facts.ts`. No shared-roster files edited. |
| `misleading_success_output` | probed | Exact exit codes recorded: baseline new-Spec exit 1; fail-first facts `[]` / 0 / 0; final new-Spec exit 0 with ready + both facts + 1 + 1; parent facts exit 0 both times; validate exit 0; focused vitest exit 0 (119/119); self-hosting exit 1 with 7 classified roster failures. |
| `flaky_tests` | N/A | No new timing, sleeps, or nondeterministic behavior. Binding only; conferral tests already existed. |
| `race_condition` | N/A | No concurrent writers in this worktree. |
| `time_dependent` | N/A | No clocks or sleeps. |
| `environment_dependent` | N/A | Local extractor over this checkout. |
| `network` | N/A | No network calls. |
| `generated_or_cached_artifacts` | N/A | Validate/build wrote gitignored `generated/` and `dist/`; claims used live `sdp:q`. |
| `incomplete_cleanup` | N/A | See cleanup receipt. No temp product files. |
| `wrong_file` / `scope_creep` | N/A | Owned paths only; other `satisfies` edges untouched. |
| `silent_catch` | N/A | No error-handling code added. |
| `oracle_weakened` | N/A | New descriptor transcribes the Spec; shared rosters left red on purpose. |
| `malformed_input` | N/A | No new parser or CLI surface. |

## Cleanup receipt

- Background jobs: none.
- Temp/scratch files: none.
- Local install/build artifacts (`node_modules/`, `dist/`, `generated/`) are gitignored and were not staged.
- No edits outside this worktree. Main worktree untouched.
- No force-push, no hook skip.

## Risks

- Shared-oracle sync remains todo 8: the seven self-hosting failures above are expected until that pass.
- Parent `spec:extraction.derive-graph` now has four implementations instead of five; both delivery facts remain. A later retarget of another `derive-graph` binding would be out of scope and could drop a parent fact.
- Header JSDoc no longer restates the ten conferral rules (MD-10 exclusive promotion). Readers of `src/graph/delivery-facts.ts` must follow the pointer to the Spec.

## Completion

- Carrier from plan text, no examples: yes.
- Pack extraction-block membership: yes.
- Only `impl:protocol.delivery-facts` retargeted: yes.
- Header JSDoc pointer-only; function/consumer/first-carrier/ladder commentary kept: yes.
- `test:protocol.delivery-facts` bound via `specTest`: yes.
- Named commentary pointers retargeted only: yes.
- Per-Spec oracle descriptor: yes.
- Shared rosters/frozen totals untouched: yes.
- Manual QA PASS: yes.
- Parent retains both facts: yes.
- Evidence file: this path.
