# Todo 18 independent adversarial verification

```json
{
  "AdversarialVerify": {
    "taskId": "st_01a01e1d",
    "commit": "8e6a86bf946dd28958a01d5034ce849d97d88731",
    "verdict": "confirmed",
    "reason": "Close record, live measurements, 68-sibling arithmetic, J dispositions, and K stand-down all re-measure true. Premature Todo-18 checkbox is a process finding, not a content fail."
  }
}
```

I did not author this commit. I read the current Todo 18, the Plan-35 close-record shape, Plan-36 expected leftovers, the primary Plan-37 close record, the owner bundle, Todo-16/17 verifier artifacts, the frozen K definition and verdict, and the parent-to-commit diff. Then I re-ran the named surfaces and rebuilt the I ledger from the live tree.

## Verdict

`confirmed`

The close record is a real close, not a copy of commission. Validate, recipes 1/2/8, and the bind census match what Todo 18 pasted. Every later ADOPT names a tracked sibling. Every REFUSE still sits on `bindExample` with the current registrar shape. Recipe 2 is exactly the three DEFINED Specs. K is `STAND-DOWN (unmet)`. Status stays EXECUTING. Todo 20 is not claimed green.

The executor checked the Todo 18 box in this commit before this verification existed. That is a process finding. The content now makes the checked state true, so it does not fail the verdict by itself.

## Commit and scope

Subject bytes are exact, including the em dash U+2014:

`docs(plans): plan-37 close record — I ledger, J dispositions, K verdict, re-derived measurements`

Footer is exact: `Plan: .omo/plans/plan-37-settling-arc.md`

Parent `7f768d1679d3c78e57aef86638609b372f8dc5a0`. Manifest is the authorized 14 paths:

```text
A  .omo/evidence/plan-37-k-measurement/candidate-session-paths.txt
A  .omo/evidence/plan-37-k-measurement/census-run-1.txt
A  .omo/evidence/plan-37-k-measurement/census-run-2.txt
A  .omo/evidence/plan-37-k-measurement/excluded-session-paths.txt
A  .omo/evidence/plan-37-k-measurement/inventory.md
A  .omo/evidence/plan-37-k-measurement/manual-adjudication.md
A  .omo/evidence/plan-37-k-measurement/qa-missing-record.txt
A  .omo/evidence/plan-37-k-measurement/verdict.md
A  .omo/evidence/task-16-verification-plan-37-settling-arc.md
A  .omo/evidence/task-17-plan-37-settling-arc.md
A  .omo/evidence/task-17-verification-plan-37-settling-arc.md
A  .omo/evidence/task-18-plan-37-settling-arc.md
M  .omo/plans/plan-37-settling-arc.md
M  plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md
```

No Spec, test, oracle, runtime, package, recipe, generated, `AGENTS.md`, Plan-36, or status-header edit. `plans/37` still reads `🔄 EXECUTING`. The close text says Todo 20 owns the gate.

Unrelated current dirt stayed out of the commit and out of this verification:

```text
 M .omo/boulder.json
?? .omo/drafts/sdp-skills-gen1-parity.md
?? .omo/evidence/task-1-sdp-skills-gen1-parity.md
?? .omo/evidence/task-1-sdp-skills-gen1-parity-verification.md
?? .omo/evidence/ulw-20260820-081346.05dmOx.md
?? .omo/plans/sdp-skills-gen1-parity.md
```

The operational plan in this commit also flips Todos 16 and 17 to checked. Todo 16 already landed in `7f768d1`; its verifier artifact rides here. Todo 17's record and verifier ride here too. Those two checkboxes are catch-up after their evidence exists. Todo 18's checkbox is the premature one.

## Fresh measurements

Canonical validate, once:

`npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`

Exit 0. First line `156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)`. Then five `honesty/gaps` warnings, subjects exactly:

- `spec:carrier.markdown-authoring`
- `spec:extraction.claim-taxonomy`
- `spec:model.pack-aggregate`
- `spec:model.relations`
- `spec:model.spec-sections`

Summary `validate: 0 errors · 5 warnings`. Same split the close record calls out: derivation prints 0/0, honesty then adds the five ready-without-verifier warnings. I did not treat exit 0 as enough.

`generated/graph.json` sha256 stayed `a982be7a4c81366bf84df92287a44edbf10cd5fe5487fa6bf67da968672ec911`. Generated status stayed clean.

Recipes 1, 2, and 8 once through `pnpm --silent sdp:q '<body>' --json`, bodies taken from the live `docs/agent-surface/recipes.md` fences.

| Recipe | Exit | sha256 of stdout | Match to both Todo-18 passes |
| --- | --- | --- | --- |
| 1 | 0 | `2b7e82053e7dd0846fe3edcac759771ce6a7610947f6cc3e44cc04a43a2cc849` | byte-identical |
| 2 | 0 | `e352b7975c63477ba3b1fe3522db001a47fd7309762595aacfa8036fa11d48c2` | byte-identical |
| 8 | 0 | `08a20b70245ab5243af01fe086f1607c2a51ef550877f4cc03ea946ec603e2f8` | byte-identical to the pasted JSON |

Recipe 1: `total: 0`, `excludedReadyExamples: 66`, `excludedReadyDecisions: 31`, `excludedWithoutVerifier: []`.

Recipe 2: `total: 3`. Only `spec:consumers.projections-model` (2 bindings), `spec:extraction.regenerability` (1), `spec:model.core-model` (3). All stated `defined`, `floorReached: ready`, `firstUnmetClause: null`. The five READY ids are absent.

Recipe 8: `errors: 0`, `warnings: 5`, `byValidator: { "honesty/gaps": 5 }`, same five subjects.

Bind census, exact command:

`rg -o 'bindExample\(' test/self-hosting-*.test.ts --count-matches`

```text
test/self-hosting-projections.test.ts:1
test/self-hosting-carrier-gherkin.test.ts:2
test/self-hosting-extraction.test.ts:4
test/self-hosting-consumers.test.ts:5
```

1 + 4 + 2 + 5 = 12.

`git ls-files -- 'test/*.test.generated.ts'` is 56. `generated/registrars.json` `files.length` is 68. 12 owed siblings exist on disk, gitignored, untracked.

Markdown format: `npx prettier --check` on the commit's markdown, exit 0.

Scoped `git diff --check` on the Todo-18-authored markdown (plans/37, task-18 evidence, operational plan, K inventory/verdict/adjudication, task-17 records) exit 0.

Whole-commit `git diff --check` exits 2. Census captures have trailing whitespace in recipe previews. `task-16-verification-plan-37-settling-arc.md` has a blank line at EOF. That riding verifier file is not Todo-18 prose, prettier still accepts it, and owned markdown is clean. Not a close-record fail.

`node check-self-hosting-gates.mjs .` exit 0. `currentRecord.status` is `EXECUTING`. I did not flip status and did not run the Todo-20 gate.

## Brief I, rebuilt from the live tree

I did not inherit the ledger. Register calls, bindExample sites, tracked files, and `generated/registrars.json` were counted independently.

Live `register*` activations in `test/self-hosting-*.test.ts`: 56. Live `bindExample(` activations: 12. Owed registrar files: 68. Tracked generated siblings: 56. First-tranche ten still tracked. Later tracked: 46. Untracked owed: 12.

`10 + 46 + 12 = 68`. `46 adopted + 12 refused = 58` deferred sites. The close record names all 68 owed paths. No extra names, no missing names.

### First-tranche ten, still tracked, still `register*`

| Sibling | Current activation |
| --- | --- |
| `test/model.stable-ids.namespaced-round-trip.test.generated.ts` | `registerNamespacedRoundTrip` |
| `test/model.stable-ids.malformed-refusal.test.generated.ts` | `registerMalformedRefusal` |
| `test/model.anchors.physical-identity.test.generated.ts` | `registerPhysicalIdentity` |
| `test/model.anchors.lookalike-refusal.test.generated.ts` | `registerLookalikeRefusal` |
| `test/carrier.slot-notation.typed-declaration.test.generated.ts` | `registerTypedDeclaration` |
| `test/carrier.slot-notation.refused-guess.test.generated.ts` | `registerRefusedGuess` |
| `test/validation.duplicate-ids.dual-carrier.test.generated.ts` | `registerDualCarrier` |
| `test/validation.kind-evidence.constraints-alone.test.generated.ts` | `registerConstraintsAlone` |
| `test/validation.kind-evidence.empty-promoted-child.test.generated.ts` | `registerEmptyPromotedChild` |
| `test/validation.kind-evidence.untargeted-constraint.test.generated.ts` | `registerUntargetedConstraint` |

### I-0 tracer, ADOPT

| Family / site | Outcome | Live check |
| --- | --- | --- |
| `carrier.markdown-parser` / `bounded-parity` | ADOPT | `registerBoundedParity` at `test/self-hosting-carrier.test.ts:142`. Sibling tracked (`git ls-files -s` mode 100644). File is a generated registrar for that example. |

That sibling was force-added at commission `1dae853`, not in the tracer commit `e081071` (test + evidence only). It is still tracked against `**/*.test.generated.ts`. Byte-gate evidence remains.

### I-1 validators, 16 ADOPT

All 16 are `register*` in `test/self-hosting-validators.test.ts` and their siblings are tracked.

| Family | Sites | Activation |
| --- | --- | --- |
| `validation.readiness-floor` | `unrelated-scoped-spec`, `blocking-open-question` | `registerUnrelatedScopedSpec`, `registerBlockingOpenQuestion` |
| `validation.warn-level-signals` | `orphan-signal`, `ready-gap-signal` | `registerOrphanSignal`, `registerReadyGapSignal` |
| `validation.referential-integrity` | `dangling-target`, `did-you-mean` | `registerDanglingTarget`, `registerDidYouMean` |
| `validation.authored-honesty` | `section-authored-fact`, `unearned-stated-fact` | `registerSectionAuthoredFact`, `registerUnearnedStatedFact` |
| `validation.claim-separation` | `collapsed-edge-claim`, `unratified-descriptor` | `registerCollapsedEdgeClaim`, `registerUnratifiedDescriptor` |
| `validation.verification-linkage` | `unbound-example`, `unresolved-oracle` | `registerUnboundExample`, `registerUnresolvedOracle` |
| `validation.oracle-target-eligibility` | `rule-space-accepted`, `missing-space-refused` | `registerRuleSpaceAccepted`, `registerMissingSpaceRefused` |
| `validation.pack-coherence` | `incoherent-aggregate` | `registerIncoherentAggregate` |
| `validation.two-check-families` | `split-report` | `registerSplitReport` |

### I-2 Gherkin, 11 ADOPT / 2 REFUSE

Adopted eleven are `register*` in `test/self-hosting-carrier-gherkin.test.ts`, siblings tracked: `authored-fact-refused`, `duplicate-surface-refused`, `example-space-extraction`, `malformed-relation-refused`, `missing-id-refused`, `parent-child-extraction`, `unknown-tag-refused`, `unsupported-construct-refused`, `description-location-refused`, `step-less-scenario-refused`, `multi-finding-bounded`.

| Site | Outcome | Current binding shape |
| --- | --- | --- |
| `contract-parity` | REFUSE | Still `bindExample` at line 358. Authored Thens rematerialize corpora and call `extract`, `serializeGraph`, and `generateContracts`. Registrar `invoke` is one call. Sibling untracked. |
| `unbound-ready-refused` | REFUSE | Still `bindExample` at line 558. Authored When calls `extract` then `validateGraph`. Registrar `invoke` is one call. Sibling untracked. |

### I-3 projections, 10 ADOPT / 1 REFUSE

Adopted ten are `register*` in `test/self-hosting-projections.test.ts`, siblings tracked: `design-review.pure-projection`, `derived-readiness-banner.{dishonest-divergence,honest-headroom}`, `binding-language-views.pack-member-table`, `wholesale-view-rewrite.{stale-page-removed,late-stale-page,failed-run-view-removed,build-invalidates-view}`, `validation.diagnostic-rendering.{composed-location,table-cell-location}`.

| Site | Outcome | Current binding shape |
| --- | --- | --- |
| `bound-spec-page` | REFUSE | Still `bindExample` at line 751. Generated registrar requires `["specId", "bindings", "packId"]`. Point supplies `specId` and `bindings` only. Completeness refuses before adapters. Sibling untracked. Comment in the test still says unused `packId`. |

### I-4 extraction, 5 ADOPT / 4 REFUSE

Adopted five are `register*` in `test/self-hosting-extraction.test.ts`, siblings tracked: `build-pipeline.same-invocation`, `excludes.{segment-boundary,refused-path}`, `schema-versioning.declared-version`, `example-runner.red-step-naming`.

| Site | Outcome | Current binding shape |
| --- | --- | --- |
| `executable-contracts.concreteness-refusal` | REFUSE | `bindExample` line 582. Sibling requires `["dimension", "exampleId", "binding", "entryCount", "twinId"]`. Point has the first three. |
| `executable-contracts.multi-entry-example` | REFUSE | `bindExample` line 591. Same five required. Point omits `twinId`. |
| `executable-contracts.case-colliding-path` | REFUSE | `bindExample` line 600. Same five required. Point omits `entryCount`. |
| `example-runner.step-order` | REFUSE | `bindExample` line 786. Sibling requires `["occurrences", "failingPhase", "thrown"]`. Point is `{ occurrences: 2 }`. |

### I-5 tails, 3 ADOPT / 5 REFUSE

Adopted three tracked: `carrier.markdown-pack-authoring.{markdown-ts-parity,spec-envelope-refused}` via `registerMarkdownTsParity` / `registerSpecEnvelopeRefused`, and `carrier.sdp-import.round-trip` via `registerRoundTrip`.

| Site | Outcome | Current binding shape |
| --- | --- | --- |
| `consumers.agent-surface.scripted-context-body` | REFUSE | `bindExample` line 251. Parent space `["specId", "concept", "file", "unrecordedFile", "body"]`. Point has `specId` and `body`. |
| `consumers.agent-surface.demand-map-entries` | REFUSE | `bindExample` line 260. Same five. Point has `concept`, `file`, `unrecordedFile`, `body`. Omits `specId`. |
| `consumers.reader.concept-entry` | REFUSE | `bindExample` line 505. Parent space six keys. Point has `concept`, `conceptSpecId`, `entry`. |
| `consumers.reader.file-entry` | REFUSE | `bindExample` line 514. Same six. Point has `boundFile`, `bindingId`, `entry`. |
| `consumers.reader.changeset-entry` | REFUSE | `bindExample` line 523. Same six. Point has `boundFile`, `bindingId`, `unrecordedFile`, `entry`. |

The close record's family-level omit wording is compressed, and it is still true of the parent space. Frozen adapters were not edited in this commit. Friction stays recorded.

## Brief J

Owner bundle `2026-08-20`, statement `Ratify proposed set`. Live carriers, family oracles, and recipe 2 agree.

| Spec | Owner | Carrier | Oracle | Graph / recipe 2 |
| --- | --- | --- | --- | --- |
| `spec:carrier.markdown-authoring` | READY | `readiness: ready` | `carrier.ts:10` ready | honesty/gaps warning, not in recipe 2 |
| `spec:extraction.claim-taxonomy` | READY | ready | `extraction.ts:159` ready | same |
| `spec:model.pack-aggregate` | READY | ready | `model.ts:247` ready | same |
| `spec:model.relations` | READY | ready | `model.ts:129` ready | same |
| `spec:model.spec-sections` | READY | ready | `model.ts:64` ready | same |
| `spec:model.core-model` | DEFINED | defined | `model.ts:31` defined | recipe 2 row, 3 bindings |
| `spec:extraction.regenerability` | DEFINED | defined | `extraction.ts:189` defined | recipe 2 row, 1 binding |
| `spec:consumers.projections-model` | DEFINED | defined | `consumers.ts:113` defined | recipe 2 row, 2 bindings |

Blocking reasons in the close table match the bundle: enrichment-lifecycle still open, quoted regenerability thresholds still unmeasured, projections-model still waiting on impact-graph and measurement work. Recipe 2 contains only those three.

## Brief K

Frozen definition hash `92cfef6a7cb1bfac8c0d02e592ade7f4ad995e7f9251a15696cedb1522d15382`. Catalog `9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87`. Census script `a699205063164edd592914c224341d8337d0312309863940c3fe98f1e37a6794`. Both stored census runs `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66`. Those pins still match Todo-17's independent confirmation.

Inventory INCLUDE rows: I todos 2, 5, 6, 7, 8, 9, 12, 13 (8) and J todos 10, 11, 14, 15 (4). Todo 16 excluded as QA-only. Adequacy `12 >= 6`, I `8 >= 2`, J `4 >= 2`. Qualifying episodes 0. Shared core empty. Manual adjudication keeps Todo 14's `rg` hits as quoted-not-run.

Close row matches that confirmed verdict: **STAND-DOWN (unmet)**. Trigger retained. No later plan. No bundle built.

## Shape and Todo-20 boundary

Plan-35 close shape is present: measured-here disclaimer, re-derived validate and recipes 1/2/8, bind census, delta versus independently sourced commission. I ledger, J table, and K verdict are in the stamp. Plan-36's leftover list for I/J/K is satisfied. Review register and EXECUTED flip remain Todos 19 and 20.

The close record labels the numbers re-derived and says, twice, that it does not claim the Todo-20 gate green.

## verified_row_regression

Todo 16's confirmed recipe-2 membership was re-run against the live tree. Same three ids, same binding counts.

Todo 2's ADOPT of `bounded-parity` was re-read: `registerBoundedParity` is live, sibling still tracked, generated header still names `spec:carrier.markdown-parser.bounded-parity`.

Todo 8's REFUSE of `scripted-context-body` was re-read: still `bindExample`, sibling still requires five parent-space keys, point still omits `concept` / `file` / `unrecordedFile`.

## Adversarial probes

| Class | Result |
| --- | --- |
| `stale_state` | Cited files re-read. Validate, recipes 1/2/8, bind census, tracked/owed counts, carrier/oracle readiness, and K hashes taken from the tree now. |
| `dirty_worktree` | Commit manifest compared with current status. Boulder and parity-plan dirt attributed to neither Todo 18 nor this verifier. |
| `misleading_success_output` | Exit 0 was paired with warning subjects, recipe-2 ids, recipe-8 family, and 10+46+12. |
| `generated_cached_artifacts` | Counts came from live validate and `sdp:q`. Generated outputs were not staged. Graph hash unchanged. |
| `verified_row_regression` | Recipe-2 three-id set, bounded-parity ADOPT, and scripted-context-body REFUSE re-measured. All still true. |
| `test_weakening` | Not applicable. This commit has no test edit. |
| `malformed_input` | Not applicable. No parser or CLI input surface under test here. |
| `prompt_injection` | Not applicable. Recipe bodies were copied from `docs/agent-surface/recipes.md` by this verifier, not from corpus content. |
| `cancel_resume` | Not applicable. No command cancelled or resumed. |
| `hung_or_long_commands` | Not applicable. Validate and the three recipes completed inside bounded timeouts. No sleep or poll. |
| `flaky_tests` | Not applicable. No test run. Measurement commands were deterministic against the recorded Todo-18 bytes. |
| `repeated_interruptions` | Not applicable. No interruption. |

## Cleanup

Scratch recipe bodies and hashes under `/tmp` were removed. No census, finder, or background process remains. No product, plan, recipe, package, test, generated, or executor-evidence file was edited. The only verifier-authored file is this artifact.
