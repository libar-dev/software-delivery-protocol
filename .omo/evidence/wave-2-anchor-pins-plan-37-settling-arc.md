# Wave 2 anchor pins — plan 37 settling arc

## Scope

Applied the adopted projection and extraction site pins to
`test/self-hosting-oracle/anchors.ts`. Exactly 15 `site:` values changed: 10
projection pins and 5 extraction pins. IDs, labels, types, targets, files,
constants, row order, and row count were preserved; no unrelated rows changed.

## Uniqueness preflight

Expected adopted rows: 15
Source anchor entries: 157
Owned-entry old-site matches: all 15 = 1
Zero-match rows: 0
Duplicate-match rows: 0

Preflight status: PASS

## Adopted pin flips

| # | Anchor id | Old site | New site |
| ---: | --- | --- | --- |
| 1 | `test:protocol.build-pipeline.same-invocation` | `bindExample(sameInvocationContract` | `registerSameInvocation(` |
| 2 | `test:protocol.excludes.segment-boundary` | `bindExample(segmentBoundaryContract` | `registerSegmentBoundary(` |
| 3 | `test:protocol.excludes.refused-path` | `bindExample(refusedPathContract` | `registerRefusedPath(` |
| 4 | `test:protocol.schema-versioning.declared-version` | `bindExample(declaredVersionContract` | `registerDeclaredVersion(` |
| 5 | `test:protocol.example-runner.red-step-naming` | `bindExample(redStepNamingContract` | `registerRedStepNaming(` |
| 6 | `test:protocol.derived-readiness-banner.dishonest-divergence` | `bindExample(dishonestDivergenceContract` | `registerDishonestDivergence(` |
| 7 | `test:protocol.derived-readiness-banner.honest-headroom` | `bindExample(honestHeadroomContract` | `registerHonestHeadroom(` |
| 8 | `test:protocol.binding-language-views.pack-member-table` | `bindExample(packMemberTableContract` | `registerPackMemberTable(` |
| 9 | `test:protocol.wholesale-view-rewrite.stale-page-removed` | `bindExample(stalePageRemovedContract` | `registerStalePageRemoved(` |
| 10 | `test:protocol.wholesale-view-rewrite.late-stale-page` | `bindExample(lateStalePageContract` | `registerLateStalePage(` |
| 11 | `test:protocol.wholesale-view-rewrite.failed-run-view-removed` | `bindExample(failedRunViewRemovedContract` | `registerFailedRunViewRemoved(` |
| 12 | `test:protocol.wholesale-view-rewrite.build-invalidates-view` | `bindExample(buildInvalidatesViewContract` | `registerBuildInvalidatesView(` |
| 13 | `test:protocol.diagnostic-rendering.composed-location` | `bindExample(composedLocationContract` | `registerComposedLocation(` |
| 14 | `test:protocol.diagnostic-rendering.table-cell-location` | `bindExample(tableCellLocationContract` | `registerTableCellLocation(` |
| 15 | `test:protocol.design-review.pure-projection` | `bindExample(pureProjectionContract` | `registerPureProjection(` |

## Refused-pin retention

These five refused pins remain verbatim:

| Anchor id | Retained site |
| --- | --- |
| `test:protocol.binding-language-views.bound-spec-page` | `bindExample(boundSpecPageContract` |
| `test:protocol.executable-contracts.concreteness-refusal` | `bindExample(concretenessRefusalContract` |
| `test:protocol.executable-contracts.multi-entry-example` | `bindExample(multiEntryExampleContract` |
| `test:protocol.executable-contracts.case-colliding-path` | `bindExample(caseCollidingPathContract` |
| `test:protocol.example-runner.step-order` | `bindExample(stepOrderContract` |

Retention check: PASS (5 retained pins).

## Diff audit

```text
removed site lines: 15
added site lines: 15
non-site field changes: 0
anchor rows changed: 15
anchor entries: 157
site accounting: 15 adopted new, 0 adopted old remaining, 5 refused retained
```

## Verification

```text
$ npx vitest run test/self-hosting-graph.test.ts
Test Files  1 passed (1)
Tests       26 passed (26)
EXIT=0

$ npx vitest run test/self-hosting-projections.test.ts test/self-hosting-extraction.test.ts
Test Files  2 passed (2)
Tests       20 passed (20)
EXIT=0
```

No build, generation, check, preflight gate, or git operation was run.
