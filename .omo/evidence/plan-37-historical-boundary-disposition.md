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

## Accepted deviations

These two, and no others.

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

## What this does not authorize

Original commit strategy text is unchanged. Those requirements were not met in history. History was not rewritten. No other exception is authorized. F1 and F4 verdict artifacts are not edited and remain `REJECT`.

## Rationale

The owner accepted the historical split rather than a rewrite. Current bytes are not the defect.

- File ownership otherwise holds. Each authored suite belongs to its named Brief I lane. Brief J product edits stay in Todo 16. Brief K writes only evidence.
- Product scope stays closed. `src/`, `package.json`, recipes, helpers, frozen registrar interface, and the ten first-tranche registrars are clean in the F1/F4 audits.
- Byte gates and current registrar accounting were already reproduced by F1, F2, F3, and Todo 19. F2 verdict `APPROVE`. F3 verdict `APPROVE`.
- The defects are commit placement only.

## Closure conditions

1. F1's original reviewer must re-audit against this owner record and the unchanged F1 artifact.
2. F4's original reviewer must re-audit against this owner record and the unchanged F4 artifact.
3. Todo 20 stays blocked until F1 through F4 all APPROVE.
4. F5 stays unchecked. Status stays EXECUTING.

This checkpoint does not claim the final gate.
