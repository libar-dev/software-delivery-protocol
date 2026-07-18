# Task 40 - Reconciled Phase-2 Docket

Source checkbox: **40. Docket reconciliation + whole-phase anti-drift audit**.

Every carried plan-17 row, review-06 intake row, and phase-2-added docket row has one terminal
disposition below. `deferred` is terminal for this phase when its reason is stated. The two
permanent deferrals preserve their plan-17 reasons verbatim.

## Plan-17 Carry-Forward

| Docket item | Origin | Terminal disposition | Evidence |
| --- | --- | --- | --- |
| YAML 1.2 scalar spellings | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| YAML parser line-number mismatch | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| Frontmatter `...` document end | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| Non-mapping-root accumulated findings | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| Depth and node cap finding flood | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| GWT fence placement in Intent | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| Heading trailing whitespace and trailing `#` titles | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| Duplicate `When` reporting and dead `mapOwner` branch | plan-17 §6 | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log) |
| Windows absolute excludes and `--exclude --foo` diagnostics | plan-17 §6 | done s1 | [Task 10 RED record](task-10-self-hosting-phase-2.red.log), [current green gate](task-40-self-hosting-phase-2.acceptance.md#current-green-gate) |
| Path-prefix matcher coverage | plan-17 §6 | done s1 | [Task 10 RED record](task-10-self-hosting-phase-2.red.log), [current green gate](task-40-self-hosting-phase-2.acceptance.md#current-green-gate) |
| Library-seam exclusion wording | plan-17 §6 | done s1 | [Task 10 RED record](task-10-self-hosting-phase-2.red.log), [current green gate](task-40-self-hosting-phase-2.acceptance.md#current-green-gate) |
| Indirect assembly of the `then` graph key | plan-17 §6 | dropped already fixed by phase-1 remediation | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Design Review dynamic-key ordering | plan-17 §6 | done s2 | [Task 15 Vitest](task-15-self-hosting-phase-2.vitest.log) |
| Design Review escaping outside prose slots | plan-17 §6 | done s2 | [Task 15 Vitest](task-15-self-hosting-phase-2.vitest.log) |
| GWT, examples, flows, and example-space permutation coverage | plan-17 §6 | dropped already fixed by phase-1 remediation | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Model term named `description` | plan-17 §6 | dropped already fixed by phase-1 remediation | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Row-3 enrichment delta | plan-17 §6 | dropped it remains the sanctioned `scoped` to `defined` maturity record | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Bound example reports only a count | plan-17 §6 | dropped already fixed by phase-1 remediation | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Fixture-to-live byte identity for rows 1, 2, 4, and 5 | plan-17 §6 | dropped already fixed by phase-1 remediation | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| No-reparse spy coverage | plan-17 §6 | deferred Named-import interception remains weaker than an injected read seam. | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Carrier-truth comment narrowing | plan-17 §6 and review-06 records cluster | done s6 | [plan todo 33](../../plans/self-hosting-phase-2.md), [current green gate](task-40-self-hosting-phase-2.acceptance.md#current-green-gate) |
| Temporal token assembly | plan-17 §6 | deferred The comment can be narrowed later; token assembly remains the sanctioned temporal-guard pattern. | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Stale provenance wording | plan-17 §6 and review-06 records cluster | done s6 | [plan todo 33](../../plans/self-hosting-phase-2.md), [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) |
| Plan-16 per-item REPAIRED/SUPERSEDED evidence dispositions | plan-17 §6 and review-06 records cluster | done s6 | [plan fold ledger](../../plans/self-hosting-phase-2.md), [plan todo 33](../../plans/self-hosting-phase-2.md) |
| Twelfth preflight leg | plan-17 §6 | dropped the recorded chain delta is benign and adds no phase-2 work | [plan-17 record](../../../plans/17-self-hosting-v1.md) |
| Decision-spec namespace divergence | plan-17 §6 | done s6 | [G7 coverage audit](task-39-self-hosting-phase-2.g7.md), [plan fold ledger](../../plans/self-hosting-phase-2.md) |

## Review-06 Cluster Coverage

| Cluster | Terminal disposition | Evidence |
| --- | --- | --- |
| Grammar hardening | done s3 | [Task 18 Vitest](task-18-self-hosting-phase-2.vitest.log), [Task 19 parity matrix](task-19-self-hosting-phase-2.matrix.md) |
| Exclude and CLI diagnostics | done s1 | [Task 10 RED record](task-10-self-hosting-phase-2.red.log), [current green gate](task-40-self-hosting-phase-2.acceptance.md#current-green-gate) |
| Design Review ordering and escaping | done s2 | [Task 15 Vitest](task-15-self-hosting-phase-2.vitest.log) |
| Records debt | done s6 | [plan fold ledger](../../plans/self-hosting-phase-2.md), [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) |

## Phase-2 Additions

| Docket item | Terminal disposition | Evidence |
| --- | --- | --- |
| `sdp import` public-package proof | done s1 | [Task 11 installed-package smoke](task-11-self-hosting-phase-2.smoke.log) |
| Checkout migration and pre-declared round-trip delta catalog | done s2 | [Task 13 round-trip](task-13-self-hosting-phase-2.roundtrip.md), [Task 17 catalog](task-17-self-hosting-phase-2.catalog.log) |
| Parser hardening claim and named non-claims | done s3 | [Task 20 claim](task-20-self-hosting-phase-2.claim.md) |
| Canonical-default carrier flip | done s4 | [Task 23 acceptance evidence](task-23-self-hosting-phase-2.acceptance.md), [Task 22 audit output](task-22-self-hosting-phase-2.flip.log) |
| Decision-fold registry and measured-evidence dispositions | done s6 | [G7 coverage audit](task-39-self-hosting-phase-2.g7.md), [plan fold ledger](../../plans/self-hosting-phase-2.md) |
| Corpus coverage, floor honesty, and no-filler review | done s7 | [G7 coverage and floor audit](task-39-self-hosting-phase-2.g7.md), [filler rejection](task-35-self-hosting-phase-2.filler.log) |

## Watch Items

| Watch item | Terminal disposition | Evidence |
| --- | --- | --- |
| Table sugar | done s7, unfired because waves 2-4 used existing sibling Specs and ruled body forms | [Task 16 watch record](task-16-self-hosting-phase-2.watch-items.md), [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) |
| Single-literal vocabulary form | done s7, unfired because no carrier needed a form beyond the ruled literal syntax | [Task 16 watch record](task-16-self-hosting-phase-2.watch-items.md), [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) |
| Multi-entry constraint form | done s7, unfired because no wave required multiple constraint entries | [Task 16 watch record](task-16-self-hosting-phase-2.watch-items.md), [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) |
| Array-section prose sub-owner | done s7, unfired because prose stayed under existing typed section owners | [Task 16 watch record](task-16-self-hosting-phase-2.watch-items.md), [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) |
| Markdown Pack syntax | done s7, unfired because the Pack remains a TypeScript manifest and no caller required Markdown authoring | [Task 16 watch record](task-16-self-hosting-phase-2.watch-items.md), [G7 coverage audit](task-39-self-hosting-phase-2.g7.md) |

Result: every listed docket entry is terminal for phase 2. Two items remain intentionally deferred,
with their carried-forward reasons stated above. No item was silently dropped.
