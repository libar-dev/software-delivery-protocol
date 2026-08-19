# Task 5 — I-1 validators: adopt-or-refuse 16 sites / 9 families

Status: complete for the lane-safe path after three AdversarialVerify NEEDS-FIX rounds. Serialized byte-gates (`npm run check:self-hosting`, `npm run preflight`, `generate:*`, `npm run check`) were **not** run — this wave forbids them.

Task: `st_01a01af0` · lane `w1-t5` · file owner `test/self-hosting-validators.test.ts`

## Final disposition (unambiguous)

**16 ADOPT / 0 REFUSE** across all nine families. Zero `bindExample(` remain in `test/self-hosting-validators.test.ts`. All 16 new siblings are tracked. The three already-adopted kind-evidence registrars were not rewritten.

Correction history (not current disposition): first write-up adopted verification-linkage via `computeDeliveryFacts` in assertions (dishonest second product call) and refused oracle-target because `createReader` internally calls `validateGraph` (overstated). Second write-up adopted oracle-target correctly and refused verification-linkage, claiming `ValidationReport` does not retain derived facts (true of `validateGraph` alone, false once `createReader` is the one product call — same mapping as oracle-target). Both earlier refusals are withdrawn. Third round: `observeVerificationLinkage` echoed the expected severity argument instead of `finding.severity`, which would mask a product severity regression; observe now returns the actual finding severity.

## Outcome summary

| Family | Sites | Disposition |
| --- | --- | --- |
| readiness-floor | unrelated-scoped-spec, blocking-open-question | **ADOPT** |
| warn-level-signals | orphan-signal, ready-gap-signal | **ADOPT** |
| referential-integrity | dangling-target, did-you-mean | **ADOPT** |
| authored-honesty | section-authored-fact, unearned-stated-fact | **ADOPT** |
| claim-separation | collapsed-edge-claim, unratified-descriptor | **ADOPT** |
| verification-linkage | unbound-example, unresolved-oracle | **ADOPT** |
| oracle-target-eligibility | rule-space-accepted, missing-space-refused | **ADOPT** |
| pack-coherence | incoherent-aggregate | **ADOPT** |
| two-check-families | split-report | **ADOPT** |

## Per-family ledger

### 1. readiness-floor — ADOPT

Evidence: shared `createReadinessFloorWorld(point)` mints a fresh `validatorWorld()` from `specId`/`readiness`/`defect`; When is one `validateGraph`; oracle Then is named finding `honesty/readiness-floor` / `error`; clause-id + error-count + subject/path joins live in `assertions` via `paramsForStep`. Same shape as the in-file kind-evidence registrars.

Siblings: `test/validation.readiness-floor.unrelated-scoped-spec.test.generated.ts` (`registerUnrelatedScopedSpec`), `test/validation.readiness-floor.blocking-open-question.test.generated.ts` (`registerBlockingOpenQuestion`).

### 2. warn-level-signals — ADOPT

Evidence: `createWarnLevelWorld(point)` assembles the probe + optional decidedBy; observe maps the sole warning class; error-count 0 and subject join ride `assertions`.

Siblings: `test/validation.warn-level-signals.orphan-signal.test.generated.ts` (`registerOrphanSignal`), `test/validation.warn-level-signals.ready-gap-signal.test.generated.ts` (`registerReadyGapSignal`).

### 3. referential-integrity — ADOPT

Evidence: `createReferentialIntegrityWorld(point)` places the present spec + dangling `dependsOn`; oracle Then is named finding `conformance/referential-integrity` / `error`; did-you-mean text (`Did you mean "${subjectId}"?` vs absent) + subject join live in `assertions` via `paramsForStep(..., "{suggested}")`.

Siblings: `test/validation.referential-integrity.dangling-target.test.generated.ts` (`registerDanglingTarget`), `test/validation.referential-integrity.did-you-mean.test.generated.ts` (`registerDidYouMean`).

### 4. authored-honesty — ADOPT

Evidence: `createAuthoredHonestyWorld(point)` smuggles the delivery fact at the point's site; oracle Then is the named honesty finding; relatedId + phrase + subject join live in `assertions`.

Siblings: `test/validation.authored-honesty.section-authored-fact.test.generated.ts` (`registerSectionAuthoredFact`), `test/validation.authored-honesty.unearned-stated-fact.test.generated.ts` (`registerUnearnedStatedFact`).

### 5. claim-separation — ADOPT

Evidence: `createClaimSeparationWorld(point)` places the off-contract edge claim or descriptor value; oracle Then is `conformance/claim-separation` / `error`; phrase + floor-count Thens live in `assertions`.

Siblings: `test/validation.claim-separation.collapsed-edge-claim.test.generated.ts` (`registerCollapsedEdgeClaim`), `test/validation.claim-separation.unratified-descriptor.test.generated.ts` (`registerUnratifiedDescriptor`).

### 6. verification-linkage — ADOPT

One product call: `invokeSpecContext` stores `createReader(graph).specContext(parentId)`. `createReader` internally computes delivery facts and runs one `validateGraph`.

- `observe`: named linkage finding from `context.findings` (parent is `relatedId`; `specContext` findings include subjectId **or** relatedId). Returns `{ findingId: finding.validatorId, severity: finding.severity }` — the product value, not the expected-function argument. Unbound-example looks up `conformance/verifies-linkage`; unresolved-oracle looks up `conformance/oracle-linkage`.
- `expected`: contract severity for a complete point (`warning` / `error`); `unspecified` otherwise. Comparator still quotes the Spec Then against this expected payload.
- `assertions`: pure read — `context.deliveryFacts.includes("has-verifier")` vs `paramsForStep(..., "{conferred}")`. No product call after invoke. No reimplementation.

Siblings: `test/validation.verification-linkage.unbound-example.test.generated.ts` (`registerUnboundExample`), `test/validation.verification-linkage.unresolved-oracle.test.generated.ts` (`registerUnresolvedOracle`).

### 7. oracle-target-eligibility — ADOPT

Same one-call SpecContext mapping as family 6 (`invokeSpecContext`).

- `observe`: `findingCount` = context findings filtered to `conformance/oracle-linkage`; `oraclePresent` = `context.oracle !== undefined`.
- `expected`: accepted `{findingCount: 0, oraclePresent: true}`; missing-space `{findingCount: 1, oraclePresent: false}`.
- `assertions`: pure join — every `conformance/oracle-linkage` finding names the target through `relatedId`.

Siblings: `test/validation.oracle-target-eligibility.rule-space-accepted.test.generated.ts` (`registerRuleSpaceAccepted`), `test/validation.oracle-target-eligibility.missing-space-refused.test.generated.ts` (`registerMissingSpaceRefused`).

### 8. pack-coherence — ADOPT

Evidence: `createPackCoherenceWorld(point)` materializes the repeated belongsTo edges + modelRef; oracle Then is named `conformance/pack-coherence` / `error`; finding-count 2 rides `assertions`.

Sibling: `test/validation.pack-coherence.incoherent-aggregate.test.generated.ts` (`registerIncoherentAggregate`).

### 9. two-check-families — ADOPT

Evidence: `createTwoCheckWorld(point)` places a ready spec depending on an absent target; oracle Then is the no-params kind `the aggregate report states no family of its own`; conformance-id/severity and honesty-id/severity Thens + the two-family set join live in `assertions` via `paramsForStep`.

Sibling: `test/validation.two-check-families.split-report.test.generated.ts` (`registerSplitReport`).

## Anchor-pin flip table

Do **not** edit `test/self-hosting-oracle/anchors.ts` in this lane. Wave-boundary writer applies these 16 flips. No refused pins remain.

| Anchor id | Current `site:` | Replacement `site:` |
| --- | --- | --- |
| `test:protocol.readiness-floor.unrelated-scoped-spec` | `bindExample(unrelatedScopedSpecContract` | `registerUnrelatedScopedSpec(` |
| `test:protocol.readiness-floor.blocking-open-question` | `bindExample(blockingOpenQuestionContract` | `registerBlockingOpenQuestion(` |
| `test:protocol.warn-level-signals.orphan-signal` | `bindExample(orphanSignalContract` | `registerOrphanSignal(` |
| `test:protocol.warn-level-signals.ready-gap-signal` | `bindExample(readyGapSignalContract` | `registerReadyGapSignal(` |
| `test:protocol.referential-integrity.dangling-target` | `bindExample(danglingTargetContract` | `registerDanglingTarget(` |
| `test:protocol.referential-integrity.did-you-mean` | `bindExample(didYouMeanContract` | `registerDidYouMean(` |
| `test:protocol.authored-honesty.section-authored-fact` | `bindExample(sectionAuthoredFactContract` | `registerSectionAuthoredFact(` |
| `test:protocol.authored-honesty.unearned-stated-fact` | `bindExample(unearnedStatedFactContract` | `registerUnearnedStatedFact(` |
| `test:protocol.claim-separation.collapsed-edge-claim` | `bindExample(collapsedEdgeClaimContract` | `registerCollapsedEdgeClaim(` |
| `test:protocol.claim-separation.unratified-descriptor` | `bindExample(unratifiedDescriptorContract` | `registerUnratifiedDescriptor(` |
| `test:protocol.verification-linkage.unbound-example` | `bindExample(unboundExampleContract` | `registerUnboundExample(` |
| `test:protocol.verification-linkage.unresolved-oracle` | `bindExample(unresolvedOracleContract` | `registerUnresolvedOracle(` |
| `test:protocol.oracle-target-eligibility.rule-space-accepted` | `bindExample(ruleSpaceAcceptedContract` | `registerRuleSpaceAccepted(` |
| `test:protocol.oracle-target-eligibility.missing-space-refused` | `bindExample(missingSpaceRefusedContract` | `registerMissingSpaceRefused(` |
| `test:protocol.pack-coherence.incoherent-aggregate` | `bindExample(incoherentAggregateContract` | `registerIncoherentAggregate(` |
| `test:protocol.two-check-families.split-report` | `bindExample(splitReportContract` | `registerSplitReport(` |

Kind-evidence sites already pin `registerConstraintsAlone(` / `registerUntargetedConstraint(` / `registerEmptyPromotedChild(` and were left alone.

## Freshness (stale_state probe)

Last `specs/` commit: `Sun Aug 16 04:29:28 2026 +0200` `a35b31d42b8640dfdf779972e5f1e40bd8a4706c`.

Newest spec file mtimes (worktree):

```text
2026-08-15 22:31:42 specs/extraction/claim-taxonomy.sdp.md
2026-08-19 16:44:59 specs/consumers/authoring-on-ramp.sdp.md
2026-08-19 16:44:59 specs/model/anchors.sdp.md
```

All 16 adopted sibling mtimes are `2026-08-19 18:46:57 +0200`, newer than every spec touch. No adopted sibling is stale.

`git ls-files` is non-empty for all 16 adopted siblings (count = 16).

## Five-adapter friction (verbatim; freeze not reopened)

Shape follows `.omo/evidence/task-11-plan-35-agent-surface-arc.md` §"Five-adapter friction".

1. **One-kind comparator vs multi-Then kinds (same as kind-evidence).** `compareContractOutcome` matches only the Then whose skeleton equals `expected.kind` and no-ops the others (`src/testing/index.ts`). Multi-Then families put only the first Then through `expected`/`observe`. Extra Then params live in `assertions` via `paramsForStep`.

2. **`observe` must choose a finding class.** Named-finding families pick the named validator from the report or from `SpecContext.findings`. That preserves the first Then under the comparator. Verification-linkage must also return `finding.severity` (not the expected argument) or a product severity change would stay green.

3. **Join-heavy extras cannot ride the first Then.** Outcome unions are discriminated. Local `assertions` carry clause/count/did-you-mean/phrase/floorCount/conferred plus subject joins that were never Outcome fields.

4. **Shared helpers are not a shared world.** `validatorWorld()` is a factory. `registerRunnableExample` still calls `createWorld(point)` once per example.

5. **No second product call.** Families 1–5, 8–9: When is one `validateGraph`. Families 6–7: When is one `createReader` (which itself performs the one `validateGraph` + fact derivation). Extra Thens read `world.report` or the stored `SpecContext`.

6. **`createReader` is a When, not a second call.** Pairing it with a prior `validateGraph` would be two calls; this adoption does not. `computeDeliveryFacts` is no longer called from the suite.

7. **Expected finding ids / oracle-target counts are authored literals.** Same checkout pattern as kind-evidence. The comparator still quotes the Spec.

8. **two-check-families oracle is the no-params Then.** Comparator ownership is only the kind string; both named-family Thens are assertion-owned.

## Happy path — focused vitest

Command: `npx vitest run test/self-hosting-validators.test.ts`

After the observe-severity fix (actual `finding.severity`, unused expected-severity parameter removed from observe):

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol


 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  19:32:18
   Duration  1.07s (transform 488ms, setup 0ms, import 911ms, tests 22ms, environment 0ms)
```

Exit: `0`. 19 tests = 16 newly adopted + 3 kind-evidence.

Scoped checks after the correction:

- `./node_modules/.bin/eslint test/self-hosting-validators.test.ts` — clean
- `./node_modules/.bin/prettier --write test/self-hosting-validators.test.ts` — clean
- `git diff --check -- test/self-hosting-validators.test.ts` — clean
- `rg -n 'bindExample\(' test/self-hosting-validators.test.ts` — zero matches

Earlier (first session) wrong-import probe against `registerUnrelatedScopedSpec` still stands as the suite-depends-on-sibling proof:

```text
npx vitest run test/self-hosting-validators.test.ts
 FAIL  test/self-hosting-validators.test.ts [ test/self-hosting-validators.test.ts ]
ReferenceError: registerUnrelatedScopedSpec is not defined
 ❯ test/self-hosting-validators.test.ts:327:1
Test Files  1 failed (1)
      Tests  no tests
EXIT:1
```

Restored immediately in that session; the live import is `registerUnrelatedScopedSpec`.

## Failure QA

Plan-todo's preflight tamper probe was **not** run: `npm run preflight` is in the serialized-command ban for this wave. The earlier wrong-import probe is the lane-safe substitute.

## Adversarial notes

| Class | Disposition |
| --- | --- |
| `stale_state` | Exercised. Sibling mtimes 18:46:57 all newer than last spec touch 16:44:59 / last specs commit Aug 16. Registrar export names read from the siblings themselves. |
| `misleading_success_output` | Exercised. Happy transcript pasted; 19 tests still execute semantics. Two earlier family judgments were wrong and are now both ADOPT with the one-call SpecContext mapping. |
| `dirty_worktree` | Exercised. Sibling lanes already had pack-markdown / sdp-import / J packets / plan-37 edits. This lane's files: the validators suite + 16 force-added siblings + this evidence file. Kind-evidence tracked siblings were not restaged. |
| `malformed_input` | N/A — no new parser or CLI. |
| `prompt_injection` | N/A — no agent-facing prompt or recipe surface. |
| `cancel_resume` | N/A — product has no cancel/resume path in these families. |
| `hung_commands` | N/A — no watcher; focused vitest finished in ~1s. |
| `repeated_interruptions` | N/A — no interruptible product loop. |
| `flaky_tests` | N/A — no sleeps, polling, or timing waits. |

## Cleanup receipts

- `bindExample` import, `namesFinding`, and `computeDeliveryFacts` removed from the suite.
- All 16 siblings force-added; `git ls-files` count = 16.
- No scratch files, no extra worktree, no git commit, no push.
- No serialized command run.
- Kind-evidence registrar call sites and their three tracked siblings were not byte-touched.
- `anchors.ts`, `specs/`, oracle modules, helpers, recipes.md, other suites: not edited.

## Force-add SHA-256 (16 adopted siblings)

```text
11007c6b0c25417ab25fa5298a4edbd32c065708ebbaba46ac6744c7c028347a  test/validation.readiness-floor.unrelated-scoped-spec.test.generated.ts
24f0651f76185e7484f7895b9c00bf329b9e163729ad9057f5134a3da65507e8  test/validation.readiness-floor.blocking-open-question.test.generated.ts
b7892f98ff502e8d1516a24755c2868c0f85a1e2ed0a7f275d5f9b066fd753ca  test/validation.warn-level-signals.orphan-signal.test.generated.ts
9e795cbe135cdfb03c37105b84082de3a162e69c8d212956016071ddd5c9d908  test/validation.warn-level-signals.ready-gap-signal.test.generated.ts
10c128a7e8478912391209992b1415a06a3e0909259fcfdfb567c275774005a6  test/validation.referential-integrity.dangling-target.test.generated.ts
326b2fc9a856a4d6e8677bf58b3f5c66267312a0e07a1ac20b1676c0d77446cb  test/validation.referential-integrity.did-you-mean.test.generated.ts
42538d277aaf7db9215a1922513580d228a4c6bdb86920896ef578fe3b612deb  test/validation.authored-honesty.section-authored-fact.test.generated.ts
099598a39a3addb4e561cb4dd0c3d352b5ffaae5ef4b4e62c86ae150673e6f37  test/validation.authored-honesty.unearned-stated-fact.test.generated.ts
1600d4a3d6c94a4f527743b7332ed63321e1a08488819f14a4f5db56b347a8b1  test/validation.claim-separation.collapsed-edge-claim.test.generated.ts
0d1a6c3bb069ff9db8a9e49b2dc30fa2845e30442d25dd801272b4733780793b  test/validation.claim-separation.unratified-descriptor.test.generated.ts
05ba6675101d488c8c154979e7d2e0cbbf0972847d482ee238ea597bd773c088  test/validation.verification-linkage.unbound-example.test.generated.ts
1a36a30064fade2f5a2042d12b430a80ee08e49aea126d1d08abd133bc854eab  test/validation.verification-linkage.unresolved-oracle.test.generated.ts
b426d3d22283e652dd6fe86ad0f64292fd187045dfb126de2df3ef38a56a5bdb  test/validation.oracle-target-eligibility.rule-space-accepted.test.generated.ts
120c8382fa66e71fd1d5b0f06fe5cb0bd9c6f6e4304c2000681e834a81b22a27  test/validation.oracle-target-eligibility.missing-space-refused.test.generated.ts
c814ef56febf9fbc0b8d929abf86dfc6726cf430a8099d1f044e028e3fecf6d8  test/validation.pack-coherence.incoherent-aggregate.test.generated.ts
3dcb3688f1fd0e692acdd40660dd741294603949402b6b0ecfd7ee687bc3f0f0  test/validation.two-check-families.split-report.test.generated.ts
```

## Risks

- Wave-boundary writer must flip all 16 `site:` strings in `test/self-hosting-oracle/anchors.ts` (table above).
- Serialized `check:self-hosting` / `preflight` still owe a green over the 16 newly tracked siblings; this lane could not run them.
- Second-Then Spec-param joins remain assertion-owned (friction §1). Same pressure-family evidence as plan 35 task 11.

## DoneClaim

```json
{
  "task": "st_01a01af0",
  "changed_files": [
    "test/self-hosting-validators.test.ts",
    "test/validation.readiness-floor.unrelated-scoped-spec.test.generated.ts",
    "test/validation.readiness-floor.blocking-open-question.test.generated.ts",
    "test/validation.warn-level-signals.orphan-signal.test.generated.ts",
    "test/validation.warn-level-signals.ready-gap-signal.test.generated.ts",
    "test/validation.referential-integrity.dangling-target.test.generated.ts",
    "test/validation.referential-integrity.did-you-mean.test.generated.ts",
    "test/validation.authored-honesty.section-authored-fact.test.generated.ts",
    "test/validation.authored-honesty.unearned-stated-fact.test.generated.ts",
    "test/validation.claim-separation.collapsed-edge-claim.test.generated.ts",
    "test/validation.claim-separation.unratified-descriptor.test.generated.ts",
    "test/validation.verification-linkage.unbound-example.test.generated.ts",
    "test/validation.verification-linkage.unresolved-oracle.test.generated.ts",
    "test/validation.oracle-target-eligibility.rule-space-accepted.test.generated.ts",
    "test/validation.oracle-target-eligibility.missing-space-refused.test.generated.ts",
    "test/validation.pack-coherence.incoherent-aggregate.test.generated.ts",
    "test/validation.two-check-families.split-report.test.generated.ts",
    ".omo/evidence/task-5-plan-37-settling-arc.md"
  ],
  "tests": [
    "npx vitest run test/self-hosting-validators.test.ts → 19 passed (after observe-severity fix)",
    "earlier session: wrong-import probe RED (registerUnrelatedScopedSpec is not defined), then restored green"
  ],
  "manual_qa": [
    "freshness: 16 adopted sibling mtimes 2026-08-19 18:46:57 > last spec touch 2026-08-19 16:44:59",
    "git ls-files non-empty for all 16 adopted siblings",
    "zero bindExample remaining in test/self-hosting-validators.test.ts",
    "16 exact adopted pin flips recorded; no refused pins"
  ],
  "cleanup": [
    "bindExample / namesFinding / computeDeliveryFacts removed from suite",
    "all 16 siblings force-added",
    "no serialized gates run",
    "no commit/push",
    "kind-evidence registrars untouched"
  ],
  "risks": [
    "anchors.ts site: strings still pin bindExample( for the 16 adopted examples until the wave-boundary writer flips them",
    "check:self-hosting and preflight still owed at the serialized wave gate"
  ]
}
```
