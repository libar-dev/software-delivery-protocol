# Task 40 - Whole-Phase Acceptance Evidence

Source checkbox: **40. Docket reconciliation + whole-phase anti-drift audit**.

This assembly maps each authoritative acceptance criterion in
[`plans/18-self-hosting-phase-2-brief.md`](../../../plans/18-self-hosting-phase-2-brief.md) to
the owning todo evidence. It is a close-audit record, not a G8 stamp.

## Acceptance Coverage

| Criterion | Owning todos | Evidence and result |
| --- | --- | --- |
| 1. Flip is total and recorded | 13, 22-24 | [Task 23 acceptance evidence](task-23-self-hosting-phase-2.acceptance.md) records no product `.sdp.ts` carrier under blessed roots, lawful Pack and fixture exceptions, clean-clone success, and active-rule checks. [Task 22 audit output](task-22-self-hosting-phase-2.flip.log) records the carrier and truth scripts green. |
| 2. Round-trip fidelity is proven | 8, 11, 13, 17 | [Task 13 round-trip](task-13-self-hosting-phase-2.roundtrip.md) records all 11 checkout IDs passing authored and graph equality under the declared delta catalog. [Task 23 acceptance evidence](task-23-self-hosting-phase-2.acceptance.md) records clean-clone and installed-tarball proof. |
| 3. Hardening non-claim is resolved | 18-21 | [Task 19 parity matrix](task-19-self-hosting-phase-2.matrix.md) records six same-class findings and four named non-claims. [Task 20 claim](task-20-self-hosting-phase-2.claim.md) records the bounded parser claim and its pinned spec surface. |
| 4. Fold is complete by disposition | 29-34, 38 | [plan fold ledger](../../plans/self-hosting-phase-2.md) contains one terminal disposition for registry, D-table, and measured-evidence entries. [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) lists the uniform decision namespace and complete corpus mapping. |
| 5. Corpus waves land honest | 25-28, 35-39 | [G7 coverage and floor audit](task-39-self-hosting-phase-2.g7.md) records 58 members, zero orphan or unresolved double claim, and a 7 ready / 51 defined floor-honest table. [filler rejection](task-35-self-hosting-phase-2.filler.log) records the explicit no-filler decision. |
| 6. Watch items are terminal | 16, 38, 40 | [Task 16 watch record](task-16-self-hosting-phase-2.watch-items.md) records the initial five unfired states. [reconciled docket](task-40-self-hosting-phase-2.docket.md#watch-items) records each terminal phase disposition and reason. |
| 7. Docket ledger continues | 1, 10, 12, 15, 18, 33, 40 | [reconciled docket](task-40-self-hosting-phase-2.docket.md) carries every plan-17, review-06, and phase-2 row to one terminal disposition, including the two exact permanent deferrals. |
| 8. `sdp import` is documented public surface | 7, 11, 22-23 | [Task 23 acceptance evidence](task-23-self-hosting-phase-2.acceptance.md) records the glossary wording, CLI help contract, dry-run result, and installed tarball. [Task 11 installed-package smoke](task-11-self-hosting-phase-2.smoke.log) records the package-level consumer proof. |

## Anti-Drift Verdict

The intended-truth and realization sweep is **PASS** for the phase-2 close audit.

- The G7 audit confirms all 58 corpus Specs are floor-honest: 7 are `ready`, 51 are `defined`, and no corpus Spec is `idea` or `scoped`. See [the G7 floor-honest table](task-39-self-hosting-phase-2.g7.md#floor-honest-readiness-audit).
- No filler Spec remains. The explicit rejection of a duplicate oracle-linkage carrier is recorded in [the filler review](task-35-self-hosting-phase-2.filler.log); the G7 coverage audit reports no orphan or unresolved double claim.
- All five watch items are terminal for this phase. Each is unfired with its reason retained in [the reconciled docket](task-40-self-hosting-phase-2.docket.md#watch-items).
- The graph generation result is 58 Specs, 1 Pack, 36 anchors, 95 nodes, and 180 edges with zero errors and zero warnings. The current gate result appears below.

## Current Green Gate

`npm run generate:self-hosting` exited 0 before this audit record was written and reported:

```text
58 specs · 1 packs · 36 anchors → 95 nodes · 180 edges (0 errors, 0 warnings)
validate: 0 errors · 0 warnings (conformance + honesty over the one graph)
```

After the audit records and plan update, `npm run check` exited 0. It regenerated the required
58-Spec self-hosting graph with 0 errors and 0 warnings, passed 31 test files / 427 tests plus the
54-test CLI suite, and passed both `--check-clean` legs. The checkout example retained its known
non-failing unbound-invalid-cart `verifies` warning; it is outside the self-hosting corpus and did
not affect the zero-exit result. Preflight also reported pre-existing unrelated worktree changes
and `generated/.DS_Store`; it exited 0.
