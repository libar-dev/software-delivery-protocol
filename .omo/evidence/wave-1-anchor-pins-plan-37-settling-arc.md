# Wave 1 anchor pins — plan 37 settling arc

## Scope

Applied the four adopted-site evidence tables to `test/self-hosting-oracle/anchors.ts`.
The integration contains exactly 30 `site:` value flips: validators 16, Gherkin 11,
Markdown pack 2, and SDP import 1. No other anchor fields or rows were changed.

## Failure-QA preflight

The four evidence tables produced the following expected old-site match report before
editing. Each old site matched exactly once in its owned anchor entry; there were no
zero-match or duplicate matches. The source contained 157 anchor entries.

| # | Anchor id | Old site | Owned-entry matches |
| ---: | --- | --- | ---: |
| 1 | `test:protocol.readiness-floor.unrelated-scoped-spec` | `bindExample(unrelatedScopedSpecContract` | 1 |
| 2 | `test:protocol.readiness-floor.blocking-open-question` | `bindExample(blockingOpenQuestionContract` | 1 |
| 3 | `test:protocol.warn-level-signals.orphan-signal` | `bindExample(orphanSignalContract` | 1 |
| 4 | `test:protocol.warn-level-signals.ready-gap-signal` | `bindExample(readyGapSignalContract` | 1 |
| 5 | `test:protocol.referential-integrity.dangling-target` | `bindExample(danglingTargetContract` | 1 |
| 6 | `test:protocol.referential-integrity.did-you-mean` | `bindExample(didYouMeanContract` | 1 |
| 7 | `test:protocol.authored-honesty.section-authored-fact` | `bindExample(sectionAuthoredFactContract` | 1 |
| 8 | `test:protocol.authored-honesty.unearned-stated-fact` | `bindExample(unearnedStatedFactContract` | 1 |
| 9 | `test:protocol.claim-separation.collapsed-edge-claim` | `bindExample(collapsedEdgeClaimContract` | 1 |
| 10 | `test:protocol.claim-separation.unratified-descriptor` | `bindExample(unratifiedDescriptorContract` | 1 |
| 11 | `test:protocol.verification-linkage.unbound-example` | `bindExample(unboundExampleContract` | 1 |
| 12 | `test:protocol.verification-linkage.unresolved-oracle` | `bindExample(unresolvedOracleContract` | 1 |
| 13 | `test:protocol.oracle-target-eligibility.rule-space-accepted` | `bindExample(ruleSpaceAcceptedContract` | 1 |
| 14 | `test:protocol.oracle-target-eligibility.missing-space-refused` | `bindExample(missingSpaceRefusedContract` | 1 |
| 15 | `test:protocol.pack-coherence.incoherent-aggregate` | `bindExample(incoherentAggregateContract` | 1 |
| 16 | `test:protocol.two-check-families.split-report` | `bindExample(splitReportContract` | 1 |
| 17 | `test:protocol.gherkin-authoring.authored-fact-refused` | `bindExample(authoredFactRefusedContract` | 1 |
| 18 | `test:protocol.gherkin-authoring.duplicate-surface-refused` | `bindExample(duplicateSurfaceRefusedContract` | 1 |
| 19 | `test:protocol.gherkin-authoring.example-space-extraction` | `bindExample(exampleSpaceExtractionContract` | 1 |
| 20 | `test:protocol.gherkin-authoring.malformed-relation-refused` | `bindExample(malformedRelationRefusedContract` | 1 |
| 21 | `test:protocol.gherkin-authoring.missing-id-refused` | `bindExample(missingIdRefusedContract` | 1 |
| 22 | `test:protocol.gherkin-authoring.parent-child-extraction` | `bindExample(parentChildExtractionContract` | 1 |
| 23 | `test:protocol.gherkin-authoring.unknown-tag-refused` | `bindExample(unknownTagRefusedContract` | 1 |
| 24 | `test:protocol.gherkin-authoring.unsupported-construct-refused` | `bindExample(unsupportedConstructRefusedContract` | 1 |
| 25 | `test:protocol.gherkin-authoring.description-location-refused` | `bindExample(descriptionLocationRefusedContract` | 1 |
| 26 | `test:protocol.gherkin-authoring.step-less-scenario-refused` | `bindExample(stepLessScenarioRefusedContract` | 1 |
| 27 | `test:protocol.gherkin-authoring.multi-finding-bounded` | `bindExample(multiFindingBoundedContract` | 1 |
| 28 | `test:protocol.markdown-pack-authoring.markdown-ts-parity` | `bindExample(markdownTsParityContract` | 1 |
| 29 | `test:protocol.markdown-pack-authoring.spec-envelope-refused` | `bindExample(specEnvelopeRefusedContract` | 1 |
| 30 | `test:protocol.sdp-import.round-trip` | `bindExample(` | 1 (scoped to this anchor id) |

Preflight output:

```text
PREFLIGHT expected rows: 30
PREFLIGHT expectedAnchors id count: 157
... all 30 rows: owned_entry_matches=1 ...
PREFLIGHT status: PASS
```

## Adopted pin flips

| # | Anchor id | Old site | New site |
| ---: | --- | --- | --- |
| 1 | `test:protocol.readiness-floor.unrelated-scoped-spec` | `bindExample(unrelatedScopedSpecContract` | `registerUnrelatedScopedSpec(` |
| 2 | `test:protocol.readiness-floor.blocking-open-question` | `bindExample(blockingOpenQuestionContract` | `registerBlockingOpenQuestion(` |
| 3 | `test:protocol.warn-level-signals.orphan-signal` | `bindExample(orphanSignalContract` | `registerOrphanSignal(` |
| 4 | `test:protocol.warn-level-signals.ready-gap-signal` | `bindExample(readyGapSignalContract` | `registerReadyGapSignal(` |
| 5 | `test:protocol.referential-integrity.dangling-target` | `bindExample(danglingTargetContract` | `registerDanglingTarget(` |
| 6 | `test:protocol.referential-integrity.did-you-mean` | `bindExample(didYouMeanContract` | `registerDidYouMean(` |
| 7 | `test:protocol.authored-honesty.section-authored-fact` | `bindExample(sectionAuthoredFactContract` | `registerSectionAuthoredFact(` |
| 8 | `test:protocol.authored-honesty.unearned-stated-fact` | `bindExample(unearnedStatedFactContract` | `registerUnearnedStatedFact(` |
| 9 | `test:protocol.claim-separation.collapsed-edge-claim` | `bindExample(collapsedEdgeClaimContract` | `registerCollapsedEdgeClaim(` |
| 10 | `test:protocol.claim-separation.unratified-descriptor` | `bindExample(unratifiedDescriptorContract` | `registerUnratifiedDescriptor(` |
| 11 | `test:protocol.verification-linkage.unbound-example` | `bindExample(unboundExampleContract` | `registerUnboundExample(` |
| 12 | `test:protocol.verification-linkage.unresolved-oracle` | `bindExample(unresolvedOracleContract` | `registerUnresolvedOracle(` |
| 13 | `test:protocol.oracle-target-eligibility.rule-space-accepted` | `bindExample(ruleSpaceAcceptedContract` | `registerRuleSpaceAccepted(` |
| 14 | `test:protocol.oracle-target-eligibility.missing-space-refused` | `bindExample(missingSpaceRefusedContract` | `registerMissingSpaceRefused(` |
| 15 | `test:protocol.pack-coherence.incoherent-aggregate` | `bindExample(incoherentAggregateContract` | `registerIncoherentAggregate(` |
| 16 | `test:protocol.two-check-families.split-report` | `bindExample(splitReportContract` | `registerSplitReport(` |
| 17 | `test:protocol.gherkin-authoring.authored-fact-refused` | `bindExample(authoredFactRefusedContract` | `registerAuthoredFactRefused(` |
| 18 | `test:protocol.gherkin-authoring.duplicate-surface-refused` | `bindExample(duplicateSurfaceRefusedContract` | `registerDuplicateSurfaceRefused(` |
| 19 | `test:protocol.gherkin-authoring.example-space-extraction` | `bindExample(exampleSpaceExtractionContract` | `registerExampleSpaceExtraction(` |
| 20 | `test:protocol.gherkin-authoring.malformed-relation-refused` | `bindExample(malformedRelationRefusedContract` | `registerMalformedRelationRefused(` |
| 21 | `test:protocol.gherkin-authoring.missing-id-refused` | `bindExample(missingIdRefusedContract` | `registerMissingIdRefused(` |
| 22 | `test:protocol.gherkin-authoring.parent-child-extraction` | `bindExample(parentChildExtractionContract` | `registerParentChildExtraction(` |
| 23 | `test:protocol.gherkin-authoring.unknown-tag-refused` | `bindExample(unknownTagRefusedContract` | `registerUnknownTagRefused(` |
| 24 | `test:protocol.gherkin-authoring.unsupported-construct-refused` | `bindExample(unsupportedConstructRefusedContract` | `registerUnsupportedConstructRefused(` |
| 25 | `test:protocol.gherkin-authoring.description-location-refused` | `bindExample(descriptionLocationRefusedContract` | `registerDescriptionLocationRefused(` |
| 26 | `test:protocol.gherkin-authoring.step-less-scenario-refused` | `bindExample(stepLessScenarioRefusedContract` | `registerStepLessScenarioRefused(` |
| 27 | `test:protocol.gherkin-authoring.multi-finding-bounded` | `bindExample(multiFindingBoundedContract` | `registerMultiFindingBounded(` |
| 28 | `test:protocol.markdown-pack-authoring.markdown-ts-parity` | `bindExample(markdownTsParityContract` | `registerMarkdownTsParity(` |
| 29 | `test:protocol.markdown-pack-authoring.spec-envelope-refused` | `bindExample(specEnvelopeRefusedContract` | `registerSpecEnvelopeRefused(` |
| 30 | `test:protocol.sdp-import.round-trip` | `bindExample(` | `registerRoundTrip(` |

## Refused-pin retention

The following refused pins were not edited and remain verbatim `bindExample` values:

| Anchor id | Retained site | Check |
| --- | --- | --- |
| `test:protocol.gherkin-authoring.contract-parity` | `bindExample(contractParityContract` | PASS |
| `test:protocol.gherkin-authoring.unbound-ready-refused` | `bindExample(unboundReadyRefusedContract` | PASS |
| `test:protocol.agent-surface.scripted-context-body` | `bindExample(scriptedContextBodyContract` | PASS |
| `test:protocol.agent-surface.demand-map-entries` | `bindExample(demandMapEntriesContract` | PASS |
| `test:protocol.reader.concept-entry` | `bindExample(conceptEntryContract` | PASS |
| `test:protocol.reader.file-entry` | `bindExample(fileEntryContract` | PASS |
| `test:protocol.reader.changeset-entry` | `bindExample(changesetEntryContract` | PASS |

## Diff-count proof

Command:

```text
git diff -- test/self-hosting-oracle/anchors.ts
```

Output summary:

```text
removed site lines: 30
added site lines: 30
non-site field changes: 0
anchor rows changed: 30
```

The diff contains only paired `site:` string replacements. The source pin remains:

```text
expectedAnchors source length: 157
```

## Lane-safe verification

Graph invariant and anchor count:

```text
$ npx vitest run test/self-hosting-graph.test.ts
Test Files  1 passed (1)
Tests       26 passed (26)
Duration    3.10s
EXIT=0
```

Focused adopted/refused suites, one command:

```text
$ npx vitest run test/self-hosting-validators.test.ts test/self-hosting-carrier-gherkin.test.ts test/self-hosting-pack-markdown.test.ts test/self-hosting-consumers.test.ts test/self-hosting-sdp-import.test.ts
Test Files  5 passed (5)
Tests       40 passed (40)
Duration    1.61s
EXIT=0
```

The forbidden serialized commands (`build`, generation, `check:self-hosting`, preflight,
and full `check`) were not run. No commit, add, push, or other product-file edit was made.
