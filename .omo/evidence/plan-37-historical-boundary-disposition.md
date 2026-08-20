# Plan 37 historical commit-boundary disposition

Date: 2026-08-20
Plan: `.omo/plans/plan-37-settling-arc.md`
Public stamp: `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md`
Status: EXECUTING. This record does not flip Todo 20, F1, F4, or F5.

## Owner statement

Raw user text:

```
pprove historical boundary deviations
```

Normalized accepted choice:

```
Approve historical boundary deviations
```

The leading `A` is missing in the raw text. Keep both spellings. Later readers shouldn't have to guess whether the typo was cleaned up.

This unambiguously selects the previously surfaced choice `Approve historical boundary deviations`.

## Second owner statement

Exact later statement:

```
Approve remaining historical deviations
```

That statement follows the exhaustive census `.omo/evidence/f4-boundary-census-plan-37-settling-arc.md`. Range was commission parent `a8d5898f549778d5841653dc81730a0c5810e446` through committed HEAD `28ec9d133999faf6c0aa52679c8aedff0a10c409`.

## Accepted deviations

First owner bound, 2026-08-20, closed B1 and B2 only. The controlling sentence then was "These two, and no others."

### F1-COMMIT-BOUNDARY / F4-B1

Todo 2 generated sibling path: `test/carrier.markdown-parser.bounded-parity.test.generated.ts`

That file was added in commission commit `1dae853a6f51bdcb8c4bde16d84dafda611e0fca`, subject `chore(plans): commission plan 37 (stamp, plan-36 line, AGENTS, discovery pin)`.

Todo 2 authored activation and evidence landed in `e0810715e743862c79556241811c2b61f41dea55`, subject `test(carrier): adopt markdown-parser bounded-parity onto generated registrar (MD-31 tranche 2 tracer)`. Manifest of that commit is only `.omo/evidence/task-2-plan-37-settling-arc.md` and `test/self-hosting-carrier.test.ts`.

Violated clauses, still present in the operational plan:

- Todo 1 Must NOT: do not touch any spec, suite, oracle, or recipes.md
- Commit strategy: one commit per I-lane todo, suite + force-added siblings land together
- Todo 2 `Commit: Y` boundary

Source findings:

- `.omo/evidence/f1-plan-37-settling-arc.md`, Blocking finding table, F1 verdict `REJECT`
- `.omo/evidence/f4-plan-37-settling-arc.md`, Reject findings row F4-B1, F4 verdict `REJECT`

### F4-B2

Shared `test/self-hosting-oracle/anchors.ts` pin batches landed as standalone commits instead of riding the adoption commits.

| Batch | Commit | Subject |
| --- | --- | --- |
| Tracer pin | `4a451e2529033cbb0e8afb181613e4039a3faa46` | `test(oracle): flip bounded-parity anchor site pin to registerBoundedParity( (R9 convention)` |
| Wave 1, 30 sites | `0b098a3186a58fa776c4f93fc46e74e2609666c5` | `test(oracle): align Wave 1 anchor sites with adopted registrar activations` |
| Wave 2, 15 sites | `07098f34a6ace41c9b64fa305f69dd602b539608` | `test(oracle): align Wave 2 anchor sites with adopted registrar activations` |

W1-B and W2-B still say `Commit: N (lands with Wave-1/Wave-2 adoption commits)`. The tracer pin is a continuation of Todo 2.

Source finding: `.omo/evidence/f4-plan-37-settling-arc.md`, Reject findings row F4-B2.

### F4-B3-K-CLOSE-RIDE

Todo 4 `Commit: N` target is exact: committed at close with the K record.

Commit `c265f2d70c1a31ccd5976240e96ed8354a7bec13` introduced ten Todo-4 paths:

- `.omo/evidence/plan-37-k-measurement/census.mjs`
- `.omo/evidence/plan-37-k-measurement/definition.md`
- `.omo/evidence/plan-37-k-measurement/qa-nonexistent.stderr`
- `.omo/evidence/plan-37-k-measurement/qa-nonexistent.stdout`
- `.omo/evidence/plan-37-k-measurement/qa-truncated.jsonl`
- `.omo/evidence/plan-37-k-measurement/qa-truncated.stderr`
- `.omo/evidence/plan-37-k-measurement/qa-truncated.stdout`
- `.omo/evidence/plan-37-k-measurement/validation-plan35-session-01a0054c.txt`
- `.omo/evidence/plan-37-k-measurement/validation-plan35-session-01a005f2.txt`
- `.omo/evidence/task-4-plan-37-settling-arc.md`

Core corrections landed in `9218be999f1a1fcaad5a92019fe2b3d0836e6b1a` and `dfb899be41687a7b2aa6ff15b181c6754320f793`, changing `census.mjs` and `definition.md`. Close `8e6a86bf946dd28958a01d5034ce849d97d88731` contains none of those ten paths.

Violated clause, still present in the operational plan, is Todo 4 Commit: N. Measurement tooling is `.omo` workspace state, committed at close with the K record.

Source finding: `.omo/evidence/f4-boundary-census-plan-37-settling-arc.md`, unaccepted-deviation register `F4-B3-K-CLOSE-RIDE`.

### F4-B4-TODO8-Y

Todo 8 is `Commit: Y`. Strategy requires one commit per Brief I lane. The evidence-only `Commit: N` list is 3, 4, 10, 11, 14, 15, 17. It excludes 8.

Complete five-REFUSE evidence `.omo/evidence/task-8-plan-37-settling-arc.md` landed in mixed Wave-1 checkpoint `065a18f6120a266df0fab20927421d9967a2c7a6`. No Todo-8 lane commit exists. `test/self-hosting-consumers.test.ts` has no arc commit because all five sites were refused.

Violated clauses, still present in the operational plan:

- Todo 8 `Commit: Y`
- Commit strategy: one commit per I-lane todo
- Evidence-only ride list excludes 8

Source finding: `.omo/evidence/f4-boundary-census-plan-37-settling-arc.md`, unaccepted-deviation register `F4-B4-TODO8-Y`.

## Completeness

Census arithmetic from `.omo/evidence/f4-boundary-census-plan-37-settling-arc.md`:

- 26 ancestry commits classified. 16 compliant ordinary + 5 accepted B1/B2 commits + 4 unaccepted placements + 1 merge = 26.
- 134 first-parent paths. 115 compliant + 7 B1/B2 paths + 11 B3/B4 paths + 1 Boulder path = 134.
- Eleven B3/B4 paths are the ten Todo-4 files plus Todo-8 evidence.

No fifth unaccepted row remains. This four-row set is complete.

## What this does not authorize

Original commit strategy text is unchanged. Those requirements were not met in history. History was not rewritten. No other exception is authorized. F1 and F4 artifacts are not edited here. Both reviews are reopened pending same-reviewer re-audit of this complete four-row record.

## Rationale

The owner accepted the historical splits rather than a rewrite. Current bytes are not the defect.

- File ownership otherwise holds. Each authored suite belongs to its named Brief I lane. Brief J product edits stay in Todo 16. Brief K writes only evidence.
- Product scope stays closed. `src/`, `package.json`, recipes, helpers, frozen registrar interface, and the ten first-tranche registrars are clean in the F1/F4 audits.
- Byte gates and current registrar accounting were already reproduced by F1, F2, F3, and Todo 19. F2 verdict `APPROVE`. F3 verdict `APPROVE`.
- The defects are commit placement only.

## Closure conditions

1. F1's original reviewer must re-audit against this complete four-row record. The F1 artifact is not edited here.
2. F4's original reviewer must re-audit against this complete four-row record and `.omo/evidence/f4-boundary-census-plan-37-settling-arc.md`. The F4 artifact is not edited here.
3. Todo 20 stays blocked until F1 through F4 all APPROVE.
4. F5 stays unchecked. Status stays EXECUTING.

This checkpoint does not claim the final gate.
