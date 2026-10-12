# Lane instructions for PINS

These are the lanes' PINS sections, copied from their apply and fix reports. A fix report supplements or replaces its apply report as it says. Lane-only totals are historical measurements. Re-derive the integrated tree; the integration delta in WHAT_WAS_TESTED.md takes precedence over stale sites and totals.

## carrier.apply.md

**Totals:** specs 258 → 259, nodes 550 → 551, edges 1304 → 1321 (+17). Contracts stay at 144 modules. Warnings are unchanged: the same 4, none added or removed by this lane. Anchors are unchanged.

**New Spec:** `spec:carrier.sdp-import.feature-adapter` (behavior, story, idea). Its Pack membership is not added; the main thread adds it.

**Stated readiness:** defined −20, ready +20, idea +1. The 20 examples:

- `spec:carrier.inline-code-spans.{description,list,narrative,pack}`
- `spec:carrier.markdown-pack-authoring.{markdown-ts-parity,spec-envelope-refused}`
- `spec:carrier.markdown-body-grammar.{continuation-line,foreign-fence,h3,integer-term,keyed-bullet,ordered-list,plain-bullet,raw-html,repeated-field,second-primary-owner,shared-description,table,trailing-prose,unrecognized-heading}-refused`

**Declared relations added (17):**

| From | Relation | Target |
| --- | --- | --- |
| gherkin-authoring | decidedBy | `spec:decisions.prose-ownership` |
| gherkin-authoring | decidedBy | `spec:decisions.pack-markdown-carrier` |
| gherkin-authoring | dependsOn | `spec:model.rule-keys` |
| gherkin-authoring.unbound-ready-refused | verifies | `spec:validation.kind-evidence` |
| markdown-body-grammar | dependsOn | `spec:model.spec-sections` |
| markdown-body-grammar | dependsOn | `spec:model.rule-keys` |
| markdown-body-grammar | dependsOn | `spec:model.open-question-fields` |
| markdown-body-grammar | dependsOn | `spec:validation.kind-evidence`, reason "the open constraint-cardinality question concerns the law that reads every constraint entry" |
| envelope-contract | dependsOn | `spec:model.relation-reasons` |
| envelope-contract | dependsOn | `spec:model.rule-keys` |
| envelope-contract | constrainedBy | `spec:validation.authored-honesty` |
| prose-ownership-rule | dependsOn | `spec:carrier.markdown-body-grammar` |
| prose-ownership-rule | dependsOn | `spec:model.relation-reasons` |
| prose-ownership-rule | dependsOn | `spec:model.open-question-fields` |
| markdown-parser | dependsOn | `spec:carrier.markdown-body-grammar` |
| sdp-import | decidedBy | `spec:decisions.carrier-ruling` |
| sdp-import.feature-adapter | refines | `spec:carrier.sdp-import` |

**Edge attributes:** the 14 body-grammar children's declared `verifies` now carry `exercises`, mapped as in CAR-23.

**Carrier content to re-transcribe** (`test/self-hosting-oracle/carrier.ts`, Spec by section):

- `gherkin-authoring`: Behavior rules (now 21, five keyed), Design `reservedTagHeads`, and the vocabulary (+ the `messageText` Then).
- `gherkin-authoring.unbound-ready-refused`: title, outcome.
- `gherkin-authoring.unknown-tag-refused`: point (+1 Then).
- `markdown-body-grammar`: problem, outcome, `#constraintEntryCount` text and fields, rules (15, 11 keyed; the pointer rule deleted), Example space description, and the vocabulary (+ the sibling Then).
- `markdown-body-grammar` children: all 14 points (+ the sibling Then); foreign-fence and h3 titles; the integer-term assumption removed.
- `envelope-contract`: Contract entries 3 and 5, new entries 7 and 8; the pointer entry deleted.
- `slot-notation`: rule 1 (oracle line 768), rule 5, the new bare-group rule, the pointer deleted, and `#oneLiteralVocabulary`.
- `prose-ownership-rule`: title, entries 2 and 4, the new owners entry; the pointer deleted.
- `inline-code-spans`: rules 3 and 4; the pointer rule deleted; both questions gain fields; the Example space description.
- `inline-code-spans` children (description, list, narrative, pack): Intent assumptions trimmed.
- `markdown-pack-authoring`: title, rules 1 and 2, Design deleted (5 keys), vocabulary (+ the equality Then).
- `markdown-pack-authoring.markdown-ts-parity`: point (+1 Then).
- `markdown-parser`: title, rules 1 and 2, the four prefixes, three new TypeScript rules, Verification.
- `markdown-parser.bounded-parity`: outcome.
- `prose-ownership-rule` and `sdp-import`: titles.
- `sdp-import`: outcome and value; rules (now 9, including the hand-off rule, the package-only rule and the new rule 6); Design `findingIds` and `dryRun`.
- `sdp-import.round-trip`: Verification.

**Recipe-visible moves:**

- Recipe 24, pinned declarations: +2 (`sdp-import#design.findingIds`, `#design.dryRun`).
- Recipe 34, rule coverage: body grammar 11/11 exercised; gherkin-authoring 5 keyed, 0 exercised.
- The location table shifts for every edited carrier.

**Binding follow-up (EXT-12, R01; lands with the ENG-EXTRACT handoff below):** in `test/self-hosting-oracle/anchors.ts`, add `["impl:protocol.static-reification", "satisfies", "spec:carrier.markdown-parser"]` to `expectedBindingEdges` beside the existing determinism row (line 2890), and re-measure the edge pins it moves: the `expectedBindingEdges` length (308 → 309 in `test/self-hosting-graph.test.ts:223`) and the total edge count. The anchor's entry in `expectedAnchors` (line 1519) and its `structural-edges.ts` row keep their shape; only the target list grows. `spec:carrier.markdown-parser`'s delivery facts do not move.

**Adopted registrars** regenerated and committed (16): `carrier.markdown-body-grammar.*` (14), `carrier.gherkin-authoring.unknown-tag-refused`, and `carrier.markdown-pack-authoring.markdown-ts-parity`. No suite was added to or removed from `contract-dependent-suites.mjs`.

## carrier.fix.md

- **Add:** `["impl:protocol.static-reification", "satisfies", "spec:carrier.markdown-parser"]` goes in `expectedBindingEdges` (`test/self-hosting-oracle/anchors.ts`), beside line 2890. Re-measure the moved pins:
  - the `expectedBindingEdges` length, 308 → 309 (`test/self-hosting-graph.test.ts:223`)
  - the total edge count, +1 beyond the lane's 1321

  This applies only once ENG-EXTRACT's anchor edit merges.
- **Drop:** nothing.

## cons-loop.apply.md

- **`spec:consumers.context-bundle`:**
  - Title, both narrative paragraphs and `intent.actor` changed.
  - New open question `#declarationCut` (non-blocking, `decider: owner`, provisional).
  - `behavior.rules[2]` and `[5]` have spelling fixes.
  - `rules[6]` is replaced and keyed: `ruleKeys { cutOrder: rules[6] }`.
  - `design.memberShape` gained a sentence and `design.fifthCut` was replaced.
  - Stated `ready`, unchanged.
- **`spec:consumers.design-diff`:**
  - Relations: new `dependsOn` on `spec:consumers.agent-surface.recipe-parameters` with reason "the base graph is supplied as recipe-parameter data, including the KEY=@PATH file form". `constrainedBy` on `spec:extraction.determinism` gains the reason "equal sources derive equal graphs, so a difference records a source change".
  - Title, narrative paragraph 1 and `intent.outcome` changed.
  - Rules: `[0]` and `[1]` replaced; `[5]`, `[7]` and the last rule reworded; a new `[8]`, the rule-and-flow order rule. Old `[8]` and `[9]` are now `[9]` and `[10]`.
  - `design.diffShape` and `design.baseRecipe` replaced.
- **`spec:consumers.review-perspectives`:**
  - Narrative paragraph 1 has an appended sentence.
  - `rules[0]` is keyed: `ruleKeys { contentIntact: rules[0] }`.
  - `design.perspectiveObject` is replaced, and its pinned-declaration span is now `{ "name": "models", "select": { "kinds": ["model"] } }`.
- **`spec:consumers.intent-composition`:**
  - New narrative, which mentions `spec:consumers.edit-model`; the `refines` relation backs it.
  - Rules are now three: `[0]` and `[1]` replaced, and a new `[2]` keyed `changedScope`.
- **`spec:consumers.intent-composition.proposal`:**
  - Relations: `dependsOn` on address-and-cycle-recipes gains the reason "the check resolves entry-address scopes through address resolution".
  - Contract: entry 1 and entry 6 replaced, and old entry 8 deleted, leaving nine entries.
  - `design.checkRows` replaced and a new `design.incomparableScope` added.
- **`spec:consumers.edit-model`:** `rules[3]` deleted.
- **`spec:consumers.impact-graph`:**
  - New narrative, which mentions both children; their `refines` back it.
  - `rules[1]` deleted.
  - `rules[0]` keyed: `ruleKeys { inferredApart: rules[0] }`.
- **`spec:consumers.impact-graph.curation-assist`:**
  - Relations: `dependsOn` on `spec:model.planned-architecture` gains the reason "the report uses the component-design convention to identify unrealized planned components".
  - Narrative replaced; it no longer mentions `spec:consumers.impact-graph`.
  - Rules: `[1]`, `[4]` and `[5]` replaced, and a new `[7]` for exclusions. Old `[7]` to `[9]` are now `[8]` to `[10]`.
  - Design: `importsFlag` and `importsFile` replaced, with new pinned-declaration spans. `barrelImports` gained a clause, `curationInput` changed, and a new `importForms` follows `barrelImports`.
- **`spec:consumers.impact-graph.symbol-reach`:**
  - New `decidedBy` on `spec:decisions.planning-truths-placement` with reason "that decision homes a deferral as a blocking open question on its own Spec, as symbol identity is here".
  - `rules[0]` replaced; its entry-address mention is backed by `refines`.
- **Warnings:**
  - Removed: the prose-mentions pair planning-truths-placement → `spec:consumers.impact-graph.symbol-reach`, now backed by the new `decidedBy`.
  - Pins to update: `test/self-hosting-oracle/index.ts:72` and `test/cli.test.ts:300-304`.
  - No new warning. `validate` shows 3 warnings, down from 4.
- **Totals:** edges go from 1304 to 1306, the two new declared relations. Specs, Packs, anchors, nodes, rungs and memberships are unchanged.
- **Other:** pinned declarations (recipe 24) and every location-table line in these nine carriers move.
- **Unchanged:** no new or deleted Spec, no anchor change and no rung change.

## cons-loop.fix.md

- No additions or removals. The apply report's `spec:consumers.review-perspectives` narrative paragraph 1 entry now also drops "four" from "four advisor lenses". The oracle string is at `test/self-hosting-oracle/consumers.ts:2095`.
- No relation, rung, anchor, membership, warning or total changes.

## cons-onramp.apply.md

Every Spec below changed its section text. Transcribe each from its carrier.

- `spec:consumers.authoring-on-ramp`: `behavior.rules`, now 13 entries in a new order. Rules 3, 4 and 8 have new text, and four rules are new.
- `spec:consumers.delivery-session-on-ramp`:
  - New narrative.
  - `behavior.rules`, now 10 entries: rules 2 and 3 extended, rule 4 replaced, rule 6 is `[#arcHandoff]`, and three rules are new.
- `spec:consumers.adopter-on-ramp`: title, new narrative, `intent.problem`, and rules 1, 2, 6, 7 (keyed `helpNamesOnRamps`) and 8.
- `spec:consumers.shipped-protocol-corpus`: title, new narrative, and `behavior.rules`, now 4 entries (old rules 1 and 5 removed).
- `spec:consumers.graph-first-planning`:
  - Title and outcome.
  - New open question `nextPacks` (non-blocking) with fields `decider` and `provisional`.
  - `behavior.rules`, now 7 entries.
- **New Spec** `spec:consumers.reading-on-ramp`: behavior, story, `ready`, file `specs/consumers/reading-on-ramp.sdp.md`, one outcome and five rules. It joins no Pack yet; the main thread adds it to `pack:self-hosting-v1` at merge.

**Relation changes** (`declared-relations.ts`). Every reason is verbatim in its carrier.

- **Removed:**
  - authoring-on-ramp `refines` edit-model
  - graph-first-planning `refines` delivery-session-on-ramp
- **Added, authoring-on-ramp:**
  - `dependsOn` edit-model (reason)
  - `dependsOn` model.open-question-keys, model.open-question-fields, model.rule-keys, model.relation-reasons, carrier.gherkin-authoring, carrier.markdown-pack-authoring
  - `decidedBy` decisions.anchor-comment-form, decisions.anchor-binding-grain, decisions.architectural-annotation
- **Added, delivery-session-on-ramp:** `dependsOn`, each with a reason, on model.enrichment-lifecycle, consumers.design-diff, consumers.context-bundle, consumers.review-perspectives and consumers.intent-composition.proposal.
- **Added, shipped-protocol-corpus:** `dependsOn` extraction.excludes (reason).
- **Added, graph-first-planning:**
  - `refines` authoring-on-ramp (reason)
  - `dependsOn` delivery-session-on-ramp (reason)
  - `dependsOn` model.open-question-fields (reason)
- **Added, reading-on-ramp:** `refines` consumers.agent-surface; `decidedBy` decisions.agent-front-door.
- **Reason gained on an existing relation:**
  - delivery-session-on-ramp `refines` authoring-on-ramp
  - adopter-on-ramp `dependsOn` shipped-protocol-corpus

**Warnings** (`index.ts` `expectedWarnings`, `test/cli.test.ts:288-294`):
- Remove the `conformance/prose-mentions` pair delivery-session-on-ramp → shipped-projections-frozen.
- In this worktree alone, one transient `honesty/gaps` warning appears on `spec:consumers.reading-on-ramp` (`ready` with no verifier). It disappears when ONRAMPS's test anchor merges. If that anchor does not land, it becomes a pinned warning.

**Rungs and totals:**
- Stated `ready` +1 (reading-on-ramp).
- Specs 258 → 259.
- Authored relation edges +19 (validate went from 1304 to 1323 edges here).
- `belongsTo` +1 once the Pack membership lands.
- Anchors follow from ONRAMPS's two reading-on-ramp anchors.
- No anchor in this lane changed.

## cons-onramp.fix.md

- **Add:** relation reasons on two authoring-on-ramp edges in `declared-relations.ts`, verbatim:
  - `decidedBy` spec:decisions.anchor-comment-form: "the skill teaches both extracted anchor forms and their silent non-binding hazards under this ruling"
  - `decidedBy` spec:decisions.anchor-binding-grain: "the skill teaches optional and plural targets, references and the collective promise test under this ruling"
- **Drop:** nothing. Edge count, warnings, rungs and totals are unchanged.

## cons-proj.apply.md

**No new Spec, no deleted Spec, no Pack-membership change, no rung change, no new warning.**

**Consumer text pins (`test/self-hosting-oracle/consumers.ts`):**
- `spec:consumers.design-review`:
  - Behavior rules 1 and 4 are replaced.
  - Rule 6 is split into four keyed rules (`linkTargets`, `fieldEscaping`, `openSectionList`, `inlineCode`).
  - Two rules are new: the question key, and the referencing units.
  - Rule 7 is replaced by "The renderer reads the reader and returns pages; writing them is the caller's job."
  - Behavior now has 12 rules.
  - UI `specPage` and `indexPage` are replaced.
- `spec:consumers.census-page`:
  - The outcome is replaced.
  - Rule 2 gains a sentence.
  - Rule 5 becomes three rules.
  - The "owns only" rule (now 10) and the root-swap rule (now 11) are changed.
  - Behavior now has 13 rules.
- `spec:consumers.mermaid-view`: rules 2, 4, 7, 10 and 11.
- `spec:consumers.gherkin-view`: the outcome, and rules 2, 3, 4, 6 and 7.
- `spec:consumers.projections-model`: the open question `bindingLanguagePromotion` is deleted, and the Model terms `curated graph` and `discipline` are replaced.
- `spec:consumers.binding-language-views`:
  - A new narrative.
  - Rule entries 1, 2, 4 and 5 are changed; entry 5 carries the key `aggregateColumns`.
  - Entries 6 and 7 are deleted, leaving 5 entries.
  - The Example space gains the oracle Then step.
- `spec:consumers.binding-language-views.bound-spec-page`: the title, the outcome, and the `gwt` gains `Then the spec page renders the expected-outcome oracle as {oracle: "none"}`.
- `spec:consumers.binding-language-views.pack-member-table`: the title and the outcome.
- `spec:consumers.derived-readiness-banner`: entries 1 and 2 are changed and entry 7 is deleted, leaving 6 entries.
- `spec:consumers.wholesale-view-rewrite`: entry 1 is changed, entry 4 is replaced and keyed `buildInvalidates`, and entry 7 is deleted, leaving 6 entries.
- `spec:consumers.design-review.pack-design-page`: rules 1, 2, 3, 4 and 7 are changed and rule 8 is deleted, leaving 7 rules.
- `spec:consumers.structural-mermaid`: the narrative, the `namedStructuralReader` trigger, and the `layerAndContext` question gaining `decider` and `provisional`.
- `spec:consumers.reference-projection` and `spec:consumers.projections-model.roadmap-views`: the narratives.
- The location table gains keyed rule rows: design-review `rule[5..8]` (the four new keys), binding-language `rule[4]` (`aggregateColumns`) and wholesale `rule[3]` (`buildInvalidates`). It also gains new question-field rows for `layerAndContext`. Rule indices shift in every Spec listed above.

**Declared relations (`declared-relations.ts`):** 12 new edges, plus reasons on existing edges.

| From | Relation | Target | Reason |
| --- | --- | --- | --- |
| census-page | dependsOn | wholesale-view-rewrite | yes (new edge) |
| census-page | decidedBy | architectural-annotation | yes (new edge) |
| census-page | decidedBy | anchor-binding-grain | yes (new edge) |
| mermaid-view | dependsOn | wholesale-view-rewrite | yes (new edge) |
| gherkin-view | dependsOn | wholesale-view-rewrite | yes (new edge) |
| gherkin-view | decidedBy | prose-ownership | yes (new edge) |
| design-review | decidedBy | authored-entry-order | yes (new edge) |
| design-review | decidedBy | question-key-rendering | yes (new edge) |
| design-review | decidedBy | anchor-binding-grain | yes (new edge) |
| design-review | decidedBy | architectural-annotation | yes (new edge) |
| projections-model | decidedBy | shipped-projections-frozen | none (new edge) |
| design-review.pack-design-page | dependsOn | derived-readiness-banner | yes (new edge) |
| projections-model | decidedBy | mcp-deferred | added to an existing edge |
| wholesale-view-rewrite | dependsOn | extraction.determinism | added to an existing edge |

**Anchors (`anchors.ts`) and binding edges:**
- New `test:protocol.derived-readiness-banner.idea-floor-unmet`:
  - Location: `test/self-hosting-projections.test.ts:518`.
  - Label: "a Spec below the idea floor renders the floor reached as none and the banner below idea".
  - It adds one anchored `verifies` edge to `spec:consumers.derived-readiness-banner`.
- The anchors below it in that file moved by +39 lines:

  | Anchor | Was | Now |
  | --- | --- | --- |
  | bound-spec-page | 750 | 789 |
  | pack-member-table | 760 | 799 |
  | stale-page-removed | 921 | 960 |
  | late-stale-page | 957 | 996 |
  | failed-run-view-removed | 993 | 1032 |
  | build-invalidates-view | 1025 | 1064 |
  | diagnostic-rendering.composed-location | 1238 | 1277 |
  | diagnostic-rendering.table-cell-location | 1253 | 1292 |

**Totals:**
- +1 anchor node, +1 anchored edge and +12 declared edges.
- In this worktree, measured at close: 258 Specs · 5 Packs · 288 anchors → 551 nodes · 1317 edges. Re-derive these rather than inheriting them.
- Warnings are unchanged: the same 4, none in this lane.

## cons-proj.fix.md

Nothing to add or drop. The fix touches only the apply report: there is no rung, floor, relation, anchor or warning change.

## cons-studio.apply.md

- **Totals:** edges 1304 → 1318 (+14 declared `dependsOn`). Specs, Packs, anchors and nodes are unchanged.
  - No Spec is new or deleted.
  - No anchor, Pack membership or stated rung changed.
- **Derived readiness:** `spec:consumers.spec-studio.spec-page` goes from `defined` to `scoped`, from the new blocking `#sourceLinks`. Its stated rung stays `scoped`. Every other floor is unchanged, and recipe 9 shows no current-floor failure on any of the 14 Specs.
- **Warnings:** 4 → 9. Five new prose-mentions pairs, all intended:

  | Mentioning Spec | Target | Location |
  |---|---|---|
  | `spec:consumers.spec-studio.lenses` | `spec:consumers.structural-mermaid` | `intent.openQuestions[1].links[0]` |
  | `spec:consumers.spec-studio.lenses` | `spec:observation.run-evidence` | `intent.openQuestions[2].links[0]` |
  | `spec:consumers.spec-studio.verification-panels` | `spec:observation.run-evidence` | `intent.openQuestions[0].links[0]` |
  | `spec:consumers.obsidian-vault` | `spec:consumers.spec-studio` | `intent.openQuestions[0].links[0]` |
  | `spec:consumers.obsidian-vault.iteration` | `spec:consumers.validate-watch` | `intent.openQuestions[1].links[0]` |

- **New `dependsOn` edges** (each with its reason, where it has one):
  - **data** → pack-design, entry-locations.
  - **shell** → lenses ("the top navigation opens each lens").
  - **lenses** → rule-keys ("the tests lens's rule coverage rests on rule keys") and verification-panels ("the evidence lens renders the verification panels' evidence fields and absence labels").
  - **spec-page** → open-question-fields, rule-keys, relation-reasons, entry-locations, pack-design.
  - **verification-panels** → example-space-coverage ("the grid consumes its decoded per-slot coverage report") and rule-keys.
  - **vault** → reader ("the generator reads the graph through the reader's joined values").
  - **notes** → binding-language-views ("rendered binding labels must state existence rather than liveness").
- **Reasons added to existing edges:**
  - parent → edit-model: "wanted changes leave the view as intent for an ordinary source edit".
  - lenses → runtime-overlay and verification-panels → runtime-overlay: "future observation consumers need the observed-fact design".
- **Rule keys:**
  - `spec:consumers.spec-studio` `{ noSecondGraph: rules[7] }`.
  - `spec:consumers.spec-studio.verification-panels` `{ evidenceNotTracked: rules[1] }`.
- **Pinned declarations (recipe 24):** `components#design.harness` and `#design.diagramView` no longer open with a code span, so components' declarations go from 9 to 7. Rows for `traceGraph`, `maturityMap` and `intentPanel` changed text.
- **Design columns (open/blocking):**

  | Spec | Open questions | Blocking | Other |
  |---|---|---|---|
  | parent | 0 → 4 | 0 | |
  | sharing | 0 → 1 | 0 | |
  | intent-panel | 0 → 2 | 0 | |
  | responsive | 1 → 2 | 0 | |
  | spec-page | 6 → 7 | 0 → 1 | UI entries 12 → 14 |
  | verification-panels | 2 → 3 | 0 | |
  | vault | 2 → 3 | 1 → 2 | |
  | notes | 4 → 6 | 2 → 4 | |

- **Per Spec** (recipe 35 against the base graph lists the same parts):
  - **`spec:consumers.spec-studio`:**
    - `intent.actor` replaced and `intent.problem` added.
    - Questions added: `phaseZeroSplit`, `pageModel`, `recipeValues`, `acceptanceMeasure`.
    - Rules are now 9: old rule 1 is deleted, rule 2 moved, and rule 11 is deleted; rule 9 is reworded and rule 10 keyed. Rules as now numbered:
      - `[0]` ships in the open-source package
      - `[1]` projection
      - `[2]` single-page app
      - `[3]` offline
      - `[4]` reproducible
      - `[5]` read-rich
      - `[6]` write-careful
      - `[7]` `noSecondGraph`
      - `[8]` stands beside the shipped projections
    - Example space: the third Then step's text changed.
    - New section `verification` (manual) with 1 entry.
  - **`spec:consumers.spec-studio.data`:**
    - `aiSlices` text changed and gained a decider.
    - Contract is now 3 entries: `[1]` replaced, old `[2]` deleted.
    - `design.specContexts` and `design.packContexts` replaced.
  - **`spec:consumers.spec-studio.shell`:**
    - Outcome changed.
    - Fields added on all 3 questions.
    - `rules[1]` replaced.
    - `ui.topNavigation`, `ui.leftRail` and `ui.search` replaced.
  - **`spec:consumers.spec-studio.lenses`:**
    - Outcome changed.
    - `capabilityGrouping` and `ruleCoverage` texts replaced and fields added; `architectureVocabulary` and `testRunResults` fields added.
    - `ui.packsLens` and `ui.evidenceLens` replaced.
  - **`spec:consumers.spec-studio.spec-page`:**
    - New narrative and outcome changed.
    - Questions: `runtimeComposition` text replaced; `questionMetadata` text replaced with fields; `headerFields` and `rungColors` decider added; new `sourceLinks`.
    - `rules[3]` replaced.
    - UI: `header`, `readinessColors`, `intentPanel`, `behaviorPanel`, `designPanel`, `bindingsPanel` and `evidencePanel` replaced. New `relationsPanel` before `impactPanel`, and new `entryIds` last.
  - **`spec:consumers.spec-studio.verification-panels`:**
    - Questions: `runResults` fields added; `coverageSource` replaced with fields; new `deliveryArtifacts`.
    - `rules[1]` keyed and `rules[2]` replaced.
    - UI: `ruleList`, `constraintTarget`, `verifierList`, `coverageGrid` and `evidencePanel` replaced.
  - **`spec:consumers.spec-studio.components`:**
    - Outcome changed, and fields added on both questions; the `harnessElement` text changed.
    - Contract `[0]` and `[1]` replaced.
    - Design: `traceGraph`, `maturityMap`, `harness`, `diagramView` and `intentPanel` replaced.
  - **`spec:consumers.spec-studio.intent-panel`:**
    - Outcome changed.
    - New Open questions heading with `proposalBase` and `packScope`.
    - Rules are now 6: `[1]` replaced, `[2]` and `[5]` reworded, old `[6]` deleted.
    - `ui.composingActions` changed.
    - Example space: the When step's text changed.
  - **`spec:consumers.spec-studio.responsive`:**
    - Actor changed.
    - `summaryMode` question replaced with fields, and new `phoneBreakpoint`.
    - `ui.singleColumn` and `ui.summaryMode` replaced.
  - **`spec:consumers.spec-studio.sharing`:** new Open questions heading with `stampLoading`.
  - **`spec:consumers.obsidian-vault`:**
    - Narrative ¶1 and ¶2 and `intent.problem` changed.
    - `studioRelation` gained `links`, and new `regenerationScope`.
  - **`spec:consumers.obsidian-vault.notes`:**
    - Outcome changed.
    - `noteNames` and `propertySet` provisionals changed.
    - New `termNoteGrain` and `mentionSource`.
  - **`spec:consumers.obsidian-vault.bases`:** narrative ¶1 phrase and the `standingViews` provisional changed.
  - **`spec:consumers.obsidian-vault.iteration`:** `regenerationTrigger` gained `links`, and its provisional changed.
- **Location table:** lines move in all 14 carriers.

## cons-studio.fix.md

- `spec:consumers.spec-studio#question.phaseZeroSplit`: the `provisional` text changed.
- `spec:consumers.spec-studio.spec-page#ui.entryIds`: the text changed.
- `spec:consumers.spec-studio.spec-page#question.questionMetadata`: gains a `provisional` field, with a new location row `question[<i>].provisional`. The Spec's provisionals are now `questionMetadata` and `sourceLinks`.
- `spec:consumers.spec-studio.lenses#question.capabilityGrouping` and `#question.ruleCoverage`: each gains a `provisional` field. Every later line in the lenses carrier moves down.
- Nothing to drop. Edges, warnings, rungs, floors, relations, Pack membership and anchors are unchanged. The graph totals are still 258 Specs, 5 Packs, 287 anchors, 550 nodes and 1318 edges.

## cons-surface.apply.md

New Spec:
- `spec:consumers.agent-surface.evaluation-sink`: behavior, story, `defined`. Relations: `refines` agent-surface, `decidedBy` agent-front-door. Intent has problem and outcome; Behavior has 5 rules; Design has `parseErrorLine`. Its Pack membership is added by the main thread.

Changed entries, by Spec:

`spec:consumers.agent-surface`
- Narrative added.
- Rule 1 replaced. Rules 4 and 5 deleted.
- Former rules 6 to 9 are now 4 to 7, with the keys `demandMap`, `entryAdapters`, `noSymbolEntry` (text replaced) and `growByRecipe`, so the Spec gains `ruleKeys`.

`spec:consumers.agent-surface.demand-map-entries`
- `verifies` now carries `exercises: [demandMap, entryAdapters, noSymbolEntry]`.

`spec:consumers.agent-surface.answer-shapes`
- Narrative replaced.
- `dependsOn` gains evaluation-sink, with a reason.
- Rules left: the new rule 1, guarantees, orphans and gaps, design backlog, and the new catalog rule. The preflight, address, decision-register, same-layer and parse rules are deleted.
- Design entries replaced: `detailParameter`, `impactSummary`, `impactDetail`, `packDesignSummary`, `guaranteeShape`, `gapExemptions`, `preflightRungs`, `catalogIndex`.
- Design entries deleted: `addressMiss`, `decisionRefinement`, `sameLayerTally`, `parseErrorLine` (moved to evaluation-sink), `recipeNumbers`.
- Unchanged: `designBacklog`, `wrapIdiom`.

`spec:consumers.agent-surface.authoring-recipes`
- Rules 1, 2 and 3 replaced.

`spec:consumers.agent-surface.register-recipes`
- Three `dependsOn` added, each with a reason.
- Problem replaced.
- Rule order and texts as listed under SUR-01.

`spec:consumers.agent-surface.address-and-cycle-recipes`
- Title replaced, narrative added.
- `dependsOn` gains recipe-parameters and rule-keys, each with a reason.
- Problem replaced. Rules 1, 2 and 5 replaced.

`spec:consumers.agent-surface.design-recipes`
- Rules 1 and 2 replaced.
- Rules 4 and 5 have sentences appended.

`spec:consumers.agent-surface.example-space-coverage`
- Narrative sentence replaced.
- `dependsOn` gains executable-contracts, with a reason.
- Problem and outcome replaced.
- `combinationCoverage` gains `decider`, `links` and `provisional`.
- New question `coverageShape` (non-blocking), with `decider`, `links` and `provisional`.
- Rules 2, 3 and 4 replaced.

`spec:consumers.agent-surface.recipe-parameters`
- Problem replaced. Rules 1 to 5 edited. Rule 6 deleted.

`spec:consumers.reader`
- `decidedBy` gains agent-front-door, anchor-binding-grain and decision-readiness-posture.
- `@exercises` tags added: concept-entry → `conceptEntry`; file-entry → `fileEntry`; changeset-entry → `blastRadius`, `reasonsAsData`.
- Rules, in order:
  1. createReader (replaced)
  2. method set (new)
  3. `conceptEntry` (replaced)
  4. `fileEntry` (keyed)
  5. `blastRadius` (replaced)
  6. `reasonsAsData` (replaced)
  7. file-level reach (kept)
  8. specContext (new)
  9. packContext returns (new)
  10. packContext order (kept)
  11. verifier gaps (new)
- The old rule 2 and the entrypoint rule are deleted.

`spec:consumers.pack-design`
- `dependsOn` gains open-question-fields, with a reason.
- New `decidedBy` to architectural-annotation, with a reason.
- Narrative sentence edited. Outcome edited.
- Rules 1 to 5 and rule 7 replaced. Rule 9 deleted.

`spec:consumers.validate-watch`
- `dependsOn` gains `spec:extraction.excludes`.
- Problem replaced. Rule 2 replaced. Rule 6 deleted.

`spec:consumers.engine-provenance`
- Problem replaced. Rule 1 extended. Rule 4 deleted.

Other changes:
- **Relations**: 15 declared relations added. They are listed above; re-derive the count.
- **Rungs**: one new `defined`, and no other rung change.
- **Anchors**: none changed in this lane.
- **Warnings**: a new `conformance/prose-mentions` warning, `spec:consumers.agent-surface.example-space-coverage` → `spec:consumers.spec-studio.verification-panels`, from the `links:` field of `#combinationCoverage`. It disappears once CONS-STUDIO's STU-07 adds verification-panels `dependsOn` example-space-coverage (U06-Q-19). If STU-07 does not land, pin it.
- **Expected red here**: `test/self-hosting-graph.test.ts` fails 7 tests (totals, roster, consumer descriptors, families, declared relations, readiness distribution, warnings), and `test/cli.test.ts` fails "views the self-hosting corpus" (4 → 5 warnings).

## decisions.apply.md

Decision text (`test/self-hosting-oracle/decisions.ts`). c*n* means the *n*-th consequence, numbered as it was before this lane:

- `spec:decisions.anchor-binding-grain`: context, decision, c1, c3; two consequences inserted after c3 (set test, restatement).
- `spec:decisions.anchor-comment-form`: context, c3, c4, c14, c15.
- `spec:decisions.architectural-annotation`: context, rationale 1, c7, c10, c14, c17, c22, c23.
- `spec:decisions.authored-entry-order`: context, c1.
- `spec:decisions.binding-not-liveness`: rationale.
- `spec:decisions.carried-evidence`: decision, rationale, c1; two consequences appended.
- `spec:decisions.carrier-ruling`: c2 deleted.
- `spec:decisions.carrier-universality`: context, decision, rationale, c1, c3, c4, alternative 2; c6 deleted.
- `spec:decisions.checked-mentions`: outcome, rationale 2, rationale 3, rationale 4, alternative 5; c7 deleted.
- `spec:decisions.concept-docs-dissolve`: context.
- `spec:decisions.gherkin-carrier-option`: c1, c4.
- `spec:decisions.kind-conditional-floor`: decision.
- `spec:decisions.mcp-deferred`: c1.
- `spec:decisions.pack-design-page`: outcome, context, decision, rationale, alternative 1; c1 deleted.
- `spec:decisions.pack-markdown-carrier`: context.
- `spec:decisions.plain-language-references`: c1.
- `spec:decisions.planning-truths-placement`: decision, c1; two consequences appended (the refines convention, the decision-homed deferrals).
- `spec:decisions.prose-ownership`: one consequence appended.
- `spec:decisions.question-key-rendering`: decision; its only consequence deleted.
- `spec:decisions.sdp-gherkin-extension`: rationale.
- `spec:decisions.shipped-projections-frozen`: context.
- `spec:decisions.studio-html-surface`: outcome, context, decision, alternative, c2.
- `spec:decisions.studio-web-components`: outcome, context, rationale 1, rationale 2; one consequence appended.

Relations (`declared-relations.ts`):

- New: `anchor-binding-grain` refines `shipped-projections-frozen`, with reason "carves out the Design Review's Referenced by list and the census References table".
- New: `architectural-annotation` refines `shipped-projections-frozen`, with reason "carves out the census Roles, Layers and Contexts tables and the role, layer and context on the Design Review's code unit rows".
- Retargeted: `pack-design-page` refines `spec:consumers.design-review`, which becomes `spec:consumers.design-review.pack-design-page`. The edge count does not change.
- Reason changed: `carrier-universality` refines `gherkin-carrier-option`.
- Reasons added:
  - `carrier-universality` dependsOn `pack-markdown-carrier`: "leaves the Pack carrier to its separate syntax ruling".
  - `studio-html-surface` dependsOn `spec:extraction.regenerability`: "disposable HTML can be regenerated from the graph instead of committed as authored source".
  - `decision-readiness-posture` dependsOn `kind-conditional-floor`: "decision maturity uses decision content as natural evidence instead of implementation or verifier bindings".
  - `anchor-comment-form` dependsOn `one-validation-path`: "both anchor forms feed the same extraction and graph-validation path".

Warnings removed (DEC-04, DEC-06): the carrier-ruling → carrier-universality mention (`index.ts:64-70`, `cli.test.ts:295-299`), and the planning-truths-placement → `spec:consumers.impact-graph.symbol-reach` mention (`index.ts:71-77`, `cli.test.ts:300-304`). In this lane alone, validate goes from 4 warnings to 2.

Totals: edges go from 1304 to 1306 in this lane alone (the two new `refines`).

Recipes:
- Recipe 31: the freeze's refiners gain anchor-binding-grain and architectural-annotation.
- Recipe 30: closures change through the new freeze edges and the pack-design-page retarget.

No rung, anchor, Pack membership, location-table row, or new or deleted Spec changes. Recipe 9 holds `ready` on all seven Specs whose envelope changed. Recipe 7 (readiness divergence) is empty, and recipe 26 finds no cycles.

## decisions.fix.md

These add to the apply report's list:

- `spec:decisions.planning-truths-placement`: add the **outcome** (Intent) to the changed entries. The decision and c1 are already listed and change again.
- `spec:decisions.authored-entry-order`: the context is already listed, and its text changes again.
- No relation, rung, anchor, Pack membership or warning changes, and nothing to drop.

## eng-cli.apply.md

Add these comment-form CodeNodes to `expectedAnchors` and `expectedCommentAnchorIds` in `test/self-hosting-oracle/anchors.ts`. Each has role `service` and an anchored `memberOf` edge to `component:protocol.cli`.

| Anchor | File and nearby site | Exact label |
| --- | --- | --- |
| `impl:protocol.adopter-help` | `src/cli/sdp.ts`, `export const SDP_HELP_TEXT =` | `prints the package-relative skill and reference index from SDP_HELP_TEXT` |
| `impl:protocol.sdp-import-scan` | `src/cli/import-scan.ts`, `export function scanImportPaths(` | `collects .sdp.ts paths and reports scan failures` |
| `impl:protocol.sdp-import-publish` | `src/cli/import-publish.ts`, `export function publishImports(` | `stages Markdown siblings and publishes them with atomic hard links` |

Add these anchored binding edges to `expectedBindingEdges` in `anchors.ts`:

- `impl:protocol.adopter-help` → `satisfies` → `spec:consumers.adopter-on-ramp`.
- `impl:protocol.sdp-import-scan` → `references` → `spec:carrier.sdp-import`.
- `impl:protocol.sdp-import-publish` → `references` → `spec:carrier.sdp-import`.
- `test:protocol.shipped-protocol-corpus` → `verifies` → `spec:consumers.adopter-on-ramp`. Preserve its shipped-protocol-corpus target.

Add the three membership edges above and `component:protocol.cli` → `uses` → `component:protocol.adapters` to `test/self-hosting-oracle/structural-edges.ts`.

Replace these label pins in `anchors.ts`:

- `impl:protocol.validate-watch`: `watches carrier directories and coalesces events into a pending validation rerun`.
- `impl:protocol.engine-provenance-cli`: `prints sdp version and the commit parsed from the build-info file beside the compiled CLI`.
- `impl:protocol.build-pipeline-emit`: `runBuild stages graph, contracts and registrar outputs in temporary paths before publishing them, repeating derivation under --check-clean`.

Re-measure anchor, comment-anchor, node, edge, binding, membership and uses totals after merge. This lane alone derives 553 nodes, 1,312 edges and 41 uses edges; these are close measurements, not integration pins. No Spec content, declared relation, Pack membership, readiness rung or warning changed. No Spec was added or deleted. The evaluation-sink retargets below are pending, not landed pins. Oracle files were not edited.

## eng-cli.fix.md

Keep the original apply report's other pin changes. Add `test:protocol.evaluation-sink` to `expectedAnchors` in `test/self-hosting-oracle/anchors.ts`, as an anchored test `Anchor` at `test/cli-q.test.ts:81`, with label `front-door checks verify how the sink takes a body, prints its return and refuses`. It uses the constant form, so `expectedCommentAnchorIds` does not change for this addition.

Replace or add these anchored rows in `expectedBindingEdges`:

| Source | Type | Target | Change |
| --- | --- | --- | --- |
| `impl:protocol.query-answer-shapes` | `satisfies` | `spec:consumers.agent-surface.evaluation-sink` | Replace its answer-shapes target. |
| `impl:protocol.build-pipeline-query` | `satisfies` | `spec:consumers.agent-surface.evaluation-sink` | Add; preserve its build-pipeline target. |
| `test:protocol.evaluation-sink` | `verifies` | `spec:consumers.agent-surface.evaluation-sink` | Add with the new test anchor. |
| `test:protocol.query-answer-shapes` | `verifies` | `spec:consumers.agent-surface.evaluation-sink` | Replace its answer-shapes target. |
| `test:protocol.query-answer-shapes` | `verifies` | `spec:consumers.agent-surface.recipe-parameters` | Add for the merged-parameter checks. |

Drop the old `impl:protocol.query-answer-shapes` satisfies answer-shapes row and `test:protocol.query-answer-shapes` verifies answer-shapes row. Preserve `impl:protocol.answer-shape-recipes` and `test:protocol.answer-shape-recipes` targeting answer-shapes.

Replace these labels, including the adopter-help label row in the apply report:

- `impl:protocol.adopter-help`: `SDP_HELP_TEXT indexes the shipped skills, recipe catalog, schema, walkthrough, glossary and specs/ by package-relative path`.
- `impl:protocol.build-pipeline-query`: `runQuery reads one body, derives the graph once for the reader, raw graph and report, and prints the return or refuses on stderr`.

Keep `impl:protocol.query-answer-shapes`'s label `reports parse positions in the caller's query body`. No additional structural edge, comment-anchor, Spec content, declared relation, Pack membership or readiness change. No Spec added or deleted. The four baseline warnings are unchanged.

Replace the apply report's lane-only close totals with the re-measured 554 nodes and 1,315 edges. These are this checkout's measurements before integration, not merge pins. Re-measure totals after merge. The four temporary missing-target errors below must disappear when CONS-SURFACE's carrier merges; do not pin them as integration expectations.

## eng-core.apply.md

All edge changes below carry claim `anchored`.

- ECORE-04: Add CodeNode `impl:protocol.structural-anchors` in `src/validate/validators.ts`, constant `structuralAnchorsAnchor`, site `function checkStructuralAnchors`, role `validator`, label `checks structural anchor validity and disjoint realization and reference targets`. Add satisfies to `spec:model.anchors`, memberOf to `component:protocol.validate`, and references to `spec:decisions.architectural-annotation` and `spec:decisions.anchor-binding-grain`.
- VAL-10: Add CodeNode `impl:protocol.duplicate-ids` in `src/validate/validators.ts`, constant `duplicateIdsAnchor`, site `function checkDuplicateIds`, role `validator`, label `rejects duplicate node identities from any graph producer`. Add satisfies to `spec:validation.duplicate-ids` and memberOf to `component:protocol.validate`.
- ECORE-08: Add `["impl:protocol.validation-contracts", "satisfies", "spec:validation.diagnostic-rendering"]`.
- ECORE-09: Add `["impl:protocol.oracle-linkage", "satisfies", "spec:validation.oracle-target-eligibility"]`; retain the existing eligibility-helper edge.
- ECORE-10: Replace `["impl:protocol.rule-exercises", "references", "spec:model.rule-keys"]` with `["impl:protocol.rule-exercises", "satisfies", "spec:model.rule-keys"]`.
- Add these structural roster rows in `test/self-hosting-oracle/structural-edges.ts`:

```ts
{ unit: "src/validate/validators.ts#checkStructuralAnchors", anchorId: "impl:protocol.structural-anchors", componentId: "component:protocol.validate" },
{ unit: "src/validate/validators.ts#checkDuplicateIds", anchorId: "impl:protocol.duplicate-ids", componentId: "component:protocol.validate" },
```

- Re-derive locations for `impl:protocol.delivery-facts`, `test:protocol.prose-mentions`, and these existing anchors in `src/validate/validators.ts`: `impl:protocol.validation-families`, `component:protocol.validate`, `impl:protocol.referential-integrity`, `impl:protocol.claim-separation`, `impl:protocol.verifies-linkage`, `impl:protocol.unbound-example-posture`, `impl:protocol.oracle-linkage`, `impl:protocol.pack-coherence`, `impl:protocol.orphan-signal`, `impl:protocol.prose-mentions`, `impl:protocol.rule-exercises`, `impl:protocol.authored-honesty-shape`, `impl:protocol.authored-honesty-delivery-facts`, and `impl:protocol.verifier-gap-signal`.
- EXT-06 / R03: The derived graph's schemaVersion is `0.10.0`. Re-measure schema, binding, census, and recipe totals at integration.
- No Spec section, declared relation, Pack membership, readiness rung, or normal-corpus delivery fact changed in this lane. No Spec was added or deleted. The four validation warnings are unchanged. Recipes 1 and 2 both report total `0`. Oracle files were not edited.

## eng-core.fix.md

Keep the original apply report's binding, schemaVersion and structural-roster instructions. Add these two location updates and refine the existing prose-mentions location instruction, measured through `sdp q` after the fixes:

- `component:protocol.model`, `src/model/anchors.ts`: line 94 to line 95.
- `impl:protocol.anchor-model`, `src/model/anchors.ts`: line 101 to line 102.
- `test:protocol.prose-mentions`, `test/validators.test.ts`: line 1321 to line 1316.

No original For PINS entry is dropped. No graph node, binding, declared relation, Pack membership, readiness rung, Spec section or warning changed in this fix pass. The four validation findings match the baseline exactly. Oracle files were not edited.

## eng-extract.apply.md

All edges below carry `anchored`.

| Anchor | Pin change |
| --- | --- |
| `component:protocol.testing` | Replace its `satisfies` target `spec:extraction.example-runner` with `spec:extraction.runnable-modules`; site remains `src/testing/index.ts:33`. |
| `impl:protocol.example-testing-helpers` | Same target replacement; site remains `src/testing/index.ts:44`. |
| `impl:protocol.derive-graph` | Add `satisfies` to `spec:extraction.claim-taxonomy`, retaining its other edges; site remains `src/extract/derive.ts:229`. |
| `test:protocol.runnable-modules-generation` | New Anchor at `test/codegen.test.ts:14`, label "checks registrar generation, sibling paths and competing suite paths", with `verifies` to `spec:extraction.runnable-modules`. |
| `test:protocol.runnable-modules-types` | New Anchor at `test/runnable-modules.typecheck.ts:5`, label "checks registrar skeletons and required authored adapters", with `verifies` to `spec:extraction.runnable-modules`. |
| `component:protocol.adapters` | Label becomes "Protocol adapters: Vitest examples and TypeScript file imports"; site and edges unchanged. |
| `impl:protocol.gherkin-authoring` | Source-line pin moves from 1284 to 1298 in `src/extract/gherkin.ts`; targets unchanged. |

Update the anchor records, binding-edge triples, runnable-modules verifier bindings and aggregate totals. This lane adds two Anchor nodes and three net edges. Re-measured in this worktree: 258 Specs, 5 Packs, 289 anchors, 552 nodes and 1307 edges. Re-run after merge rather than inheriting these totals.

No Spec section, declared relation, Pack membership, readiness or delivery-fact change. No Spec added or deleted. The warning set remains the baseline's three prose-mention warnings and one `honesty/gaps` warning on `spec:model.spec-sections`.

## eng-render.apply.md

- In `test/self-hosting-oracle/anchors.ts`, remove `impl:protocol.reader-impact` from `expectedAnchors` and `expectedCommentAnchorIds`, and delete `["impl:protocol.reader-impact", "satisfies", "spec:consumers.reader"]` from `expectedBindingEdges`.
- Add `["impl:protocol.reader", "satisfies", "spec:validation.next-rung-floor"]` and `["impl:protocol.pack-design", "satisfies", "spec:model.design-maturity"]` to `expectedBindingEdges`. Both edges carry `anchored` claim.
- The removed structural edge is `["impl:protocol.reader-impact", "component:protocol.reader"]`. Repoint the accepted `src/reader/reader.ts#BlastRadius` roster row to `impl:protocol.reader`, keeping its component. This makes two accepted rows share that identity, so derive unique membership edges as shown below.
- `spec:model.design-maturity` gains `implemented`. Its isolated envelope remains `defined`, with floor `ready`; recipe 2 reports this one temporary drift alarm until MODEL's delegated `ready` statement merges. `spec:consumers.reader` and `spec:validation.next-rung-floor` retain their existing delivery facts.
- Re-measure anchor/node totals, binding-edge totals, membership totals, contract-role counts, and implemented-Spec totals after merging all lanes. Verifier-gap answers and Pack pages omit decisions; they mint no graph edges.
- No Spec text, authored relation, Pack membership, readiness statement, anchor label, or new Spec changed in this lane. One code anchor was deleted. Validation's four warning identities remain unchanged. Source-line movement is derived; remaining anchor identities and sites are preserved.

## eng-render.fix.md

- Add the revised introduction at `test/fixtures/checkout-v1/expected-design-review/pack/checkout-v1.md:143`, under `## Verifier coverage gaps`:

```md
Members other than decisions with no verifier binding — a surfaced absence, informative, never a gate. `ready` members are the priority slice (designed, stated done, unverified):
```

- Drop nothing from `eng-render.apply.md`'s For PINS list. Its anchor and binding-edge changes, roster repoint, unique membership pairs, totals to re-measure, and MODEL readiness handoff remain applicable.
- These corrections change no Spec content, relation, Pack membership, rung, anchor identity, label, binding target or warning identity. Mermaid source-line movement is derived. The rendering comment creates no graph content.

## extraction.apply.md

- **New and deleted Specs:** none. Pack membership: no change. Anchors: no change.
- **Rung:** `spec:extraction.pack-member-order.manifest-order-kept` changes from `defined` to `ready`.
- **Relations (+7 edges; 1304 → 1311):**
  - derive-graph adds `dependsOn` `spec:model.relations` and `spec:model.anchors` (each with a reason) and `decidedBy` `spec:decisions.anchor-binding-grain`. Its `dependsOn` delivery-facts gains a reason.
  - runnable-modules adds `dependsOn` `spec:extraction.build-pipeline` (with a reason) and `decidedBy` `anchor-comment-form`, `binding-not-liveness` and `point-per-example`.
  - example-runner: `refines` executable-contracts is replaced by `dependsOn` executable-contracts, with a reason.
  - contract-declarations: `decidedBy` typing-law gains a reason.
  - Ten example `verifies` edges gain `exercises` (listed under EXT-11).
- **Titles:** contract-declarations ("Pinned declarations give an adopter a derived module to typecheck") and executable-contracts ("The build derives step and space contracts from graph examples").
- **Narratives:** contract-declarations, derive-graph and entry-locations are rewritten; open-section-order gains a narrative.
- **Section entries changed** (rule indexes shift where entries were added or deleted, and every location row of these Specs moves):
  - build-pipeline: outcome; the open question is removed; flows 0-3 are new; rules 0-3 (keyed); the Example space step text.
  - same-invocation: the gwt step text.
  - claim-taxonomy: `claim inheritance`.
  - contract-declarations: outcome; three open questions are removed; rule 5.
  - delivery-facts: outcome; rules 2, 3 and 7.
  - derive-graph: rules 0, 1, 2 and 6; Design: 6 entries added.
  - determinism: `measurableBy`; rule 0; rule 2 is deleted.
  - entry-locations: outcome; rules 0 and 2; a new rule 3; the old rule 6 is deleted.
  - example-runner: the open question is removed; rules 0-2 (keyed, rule 1 rewritten); rule 5 is deleted; Design `failureMessage`.
  - excludes: rules 0-3 (canonicalDiscovery, rule 1, segmentBoundary, refusedPaths); the site rule is deleted.
  - executable-contracts: outcome; the open question is removed; rules 1-9 (keys concreteness, onePoint, outcomeIdentity and caseCollision); the site rule is deleted; Design `findingIds`.
  - open-section-order: problem; rules 2-6 are new; the version rule is deleted; the last rule is rewritten.
  - pack-member-order: rule 0 (keyed); rule 4 is replaced; the version and site rules are deleted; one vocabulary line is removed.
  - manifest-order-kept: one gwt line is removed.
  - regenerability: rule 2.
  - runnable-modules: Intent (3 entries); rules 0, 2, 4, 5, 8, 9, 12 and 15; the Example space is removed; Design: 5 entries.
  - schema-versioning: rules 0-1; rule 2 is deleted.
  - declared-version: the bound point is now `0.10.0`.
- **Generated contracts:** 144 → 143 modules, because the runnable-modules space contract is gone. The adopted registrars for same-invocation and manifest-order-kept were regenerated and committed.
- **Warnings:** no change (4 warnings: 3 `prose-mentions`, 1 `honesty/gaps`, all outside this lane).
- **Recipe 34** now reports keyed extraction rules, so any rule-coverage totals pin moves.

## extraction.fix.md

- No change to the list. Rules 2 and 3 of `spec:extraction.entry-locations` are the same entries with new text; pin the text in the file at `bf357f2`.
- When the ENG-EXTRACT fix lands, the location table gains `relation.dependsOn.spec:extraction.delivery-facts`, `relation.refines.spec:consumers.agent-surface` and `relation.decidedBy.spec:decisions.agent-surface-scripts-graph` for `spec:consumers.reader`, each at its Feature tag line.

## glossary.apply.md

- No Spec or Pack carrier changed, and no relation, Pack membership, rung, anchor, location row or warning changed. There are no new or deleted Specs.
- `validate` gives the same four warnings as at base.
- CONTEXT.md is not a carrier, so its new `spec:` citations mint no mention warnings.
- Nothing to transcribe from this lane's own edits. Handoffs 9 and 10 add three entries for PINS once MODEL lands them: `spec:model.rule-keys` Rule 1 and Design `duplicateKey`, and `spec:model.anchors` Model `Protocol builder binding`.

## glossary.fix.md

- This lane's own edits add or drop nothing: CONTEXT.md and docs/concept are not carriers.
- PINS adds three entries once MODEL lands handoffs 9 and 10: `spec:model.rule-keys` Rule 1 and Design `duplicateKey`, and `spec:model.anchors` Model term `Protocol builder binding`.

## model.apply.md

**Deleted Spec:** `spec:model.protocol-domain`. Remove its `modelSpecs` entry, its declared `refines` → protocol.self-hosting, its Pack membership and `modelRefs[0]` (pack-members.ts), and the two inbound `dependsOn` (self-hosting, readiness-floor), which are now repointed to core-model by the other lanes.

**Rungs:** these five move `defined` → `ready`:
- `spec:model.design-maturity`
- `spec:model.open-question-keys.keyed-question-resolves`
- `spec:model.open-question-keys.renamed-key-breaks`
- `spec:model.open-question-keys.repeated-key-refused`
- `spec:model.stable-ids.unsectioned-address-refused`

**Warnings:** add `honesty/gaps` on `spec:model.design-maturity` (ready, no verifier; the fix forbids binding the pack-design test to it). No prose-mention pair is added or removed.

**Delivery facts and recipes:** design-maturity has no facts until ENG-RENDER's `satisfies` lands. Until then it sits in recipe 1, and it leaves recipe 33 together with protocol-domain. Recipe 34 now has rows: `spec:model.stable-ids#rule.idGrammar`, and `spec:model.open-question-keys#rule.keyGrammar`, `#rule.markdownMarker` and `#rule.questionAddress`.

**Relations (`declared-relations.ts`):**
- relations `decidedBy` planning-truths-placement, with reason
- core-model `refines` self-hosting gains a reason
- spec-sections `decidedBy` anchor-comment-form, with reason
- stable-ids `decidedBy` checked-mentions
- stable-ids' three examples: `verifies` gains `exercises: [idGrammar]`
- the open-question-keys examples' `verifies` gains exercises:
  - keyed-question-resolves `[keyGrammar, markdownMarker, questionAddress]`
  - renamed-key-breaks `[questionAddress]`
  - repeated-key-refused `[keyGrammar, markdownMarker]`
- open-question-fields:
  - `dependsOn` entry-locations, with reason
  - `decidedBy` adopt-the-nouns gains a reason
  - `decidedBy` planning-truths-placement, with reason
- rule-keys `dependsOn` gains entry-locations (with reason) beside open-question-keys; `decidedBy` checked-mentions and shipped-projections-frozen (with reasons)
- relation-reasons `decidedBy` prose-ownership gains a reason
- enrichment-lifecycle `dependsOn` contract-declarations, with reason
- planned-architecture `dependsOn` anchors gains a reason
- term-addresses `dependsOn` stable-ids and rule-keys, with reasons

**Carrier text (`model.ts`):**
- relations: terms `refines`, `verifies`, `supersedes`.
- core-model: terms `kind`, `altitude`, `delivery fact`.
- spec-sections: term `enabled verifier`.
- anchors: terms `constant form`, `code anchor`, `component realization convention`, `executable binding boundary`, `untrusted builder`; new `design.structuralValidator`.
- stable-ids: rule 2 is keyed `idGrammar` and rewritten; rules 4 and 5 are replaced; rule 6 is deleted; `ruleKeys` is added.
- open-question-keys:
  - rules 1 (`keyGrammar`) and 2 (`markdownMarker`; text otherwise unchanged) are keyed
  - rule 4 is replaced; rule 5 (`questionAddress`) is keyed and rewritten
  - rule 7 is deleted
  - `ruleKeys` is added
- open-question-fields:
  - title (H1) and narrative
  - new question `#droppedQuestionList`
  - rule 4 is replaced, and a new rule 5 is inserted after it; old rules 5, 7 and 9 (now 6, 8 and 10) are reworded
  - design `questionObject`, `fieldLocations`, `registerColumns`
- rule-keys: narrative; rule 6 (ADR three-part test); design `ruleKeysField`, `ruleLocations`, new `exercisesValidator`.
- relation-reasons: both narrative paragraphs; rules 3 and 4; design `envelopeTarget`, `builderArgument`, `edgeReason`, `intendedMentions`.
- enrichment-lifecycle: outcome.
- design-maturity: readiness, narrative, problem, new question `#designColumnsSufficiency`, terms `design columns`, `designed stage`.
- planned-architecture: first narrative paragraph; `decider` on `#providerSelection` and `#oneRuntimeOwner`; new `#comparisonShape`.
- structural-patterns: outcome; terms `architecturally significant unit`, `structural attributes`, `accepted set`.
- term-addresses: narrative; `decider` on `#glossaryTerms`; new `#addressSection`.

**Location rows:** every edited carrier's lines shift. New rows:
- `rule[i]` rows carrying `key` on stable-ids and open-question-keys
- question rows on open-question-fields, design-maturity, planned-architecture and term-addresses
- `design.structuralValidator` (anchors) and `design.exercisesValidator` (rule-keys)

No anchor changed in this lane, and the generated registrars are unchanged.

## model.fix.md

Nothing to add or drop. The apply report already lists relation-reasons "both narrative paragraphs; rules 3 and 4" under carrier text (`model.ts`). The oracle's copies of both sentences at `test/self-hosting-oracle/model.ts:801` and `:814` take the new text when PINS re-transcribes. Both replacements stay on one line, so no location row shifts. No relation, rung, warning or anchor changes.

## onramps-docs.apply.md

- **Anchors** (`test/self-hosting-oracle/anchors.ts`):
  - **Remove** the `test/skills.test.ts` rows for `impl:protocol.authoring-recipes` and `test:protocol.authoring-recipes`. ONRAMPS-RECIPES re-adds both in `test/recipes.test.ts`. The test label becomes "recipe checks verify promotion preflight, the verifier audit and the lower ladder" (U05-F-07); the file and site also change.
  - **Add:**
    - `{ id: "impl:protocol.reading-on-ramp", nodeType: "CodeNode", label: "asserts realization of the shipped graph-reading skill document", file: "test/skills.test.ts", constant: "readingOnRampImplementationAnchor", site: 'describe("the graph-reading on-ramp",' }`
    - `{ id: "test:protocol.reading-on-ramp", nodeType: "Anchor", label: "skill-asset checks verify the graph-reading on-ramp", file: "test/skills.test.ts", constant: "readingOnRampTestAnchor", site: 'describe("the graph-reading on-ramp",' }`
  - The other skill anchors keep their constants and sites. Their lines shift (44, 51, 133, 140, 496, 503), which the oracle reads from the source.
- **Binding edges:**
  - Add `impl:protocol.reading-on-ramp satisfies spec:consumers.reading-on-ramp` and `test:protocol.reading-on-ramp verifies spec:consumers.reading-on-ramp`.
  - The authoring-recipes edge rows keep their ids and stay valid once ONRAMPS-RECIPES re-adds the anchors.
- **Delivery facts:** `spec:consumers.reading-on-ramp` gains `implemented` and `has-verifier`. Probed with CONS-ONRAMP's carrier copied in: floor `ready`, no failures, 0 errors.
- **byFile / blast radius** for `test/skills.test.ts`: the reading-on-ramp anchors come in and the authoring-recipes anchors leave.
- **Totals:** anchors in `test/skills.test.ts` net 0 (−2, +2). After the recipe suite re-adds two, the corpus has 2 more anchors than base. Edges: +2 once the reading on-ramp resolves.
- No Spec text, relation, Pack membership, rung, warning or verbatim corpus string changes in this lane. No Spec was created or deleted.

## onramps-docs.fix.md

- Nothing to add or drop.
- The added lines move `test/skills.test.ts` anchors below line 413:
  - the reading on-ramp pair: id lines 462 and 469
  - the adopter pair: id lines 512 and 519

  The oracle reads these lines from the source. No id, constant, site, label or edge changes.

## onramps-recipes.apply.md

- `anchors.ts`: replace the three anchored `references` from `impl:protocol.authoring-grammar-recipes` to `spec:model.rule-keys`, `spec:model.open-question-fields` and `spec:model.relation-reasons` with anchored `satisfies`. Keep the reference to `spec:consumers.agent-surface.answer-shapes`.
- `anchors.ts`: add anchored `references` from `impl:protocol.curation-recipe` to `spec:model.planned-architecture`.
- `structural-edges.ts`: remove the four anchored `memberOf` edges to `component:protocol.reader` from `impl:protocol.design-diff-recipe`, `impl:protocol.perspective-filter-recipe`, `impl:protocol.context-bundle-recipe` and `impl:protocol.proposal-schema-and-recipe`. Move these ids into `structuralMembershipExceptions` and remove their `acceptedArchitecturalUnits` rows. Preserve the three `projection` roles and the proposal's `contract` role.
- Re-measured binding delta: `satisfies` +3, `references` -2, `memberOf` -4, total edges -3. Nodes and delivery facts are unchanged. No Spec content, authored relation, Pack membership or rung changed; no Spec or anchor was added or deleted. The warning set is unchanged.
- Re-transcribe these node-site rows in `anchors.ts`. Sites are measured at this lane's commit; re-derive after integration and the ONR-01 move.

| Anchor id | Site |
| --- | --- |
| `test:protocol.slimming-recipe` | `test/curation-recipes.test.ts:39` |
| `test:protocol.curation-recipe` | `test/curation-recipes.test.ts:44` |
| `impl:protocol.design-diff-recipe` | `test/iteration-recipes.test.ts:27` |
| `test:protocol.design-diff-recipe` | `test/iteration-recipes.test.ts:34` |
| `impl:protocol.perspective-filter-recipe` | `test/iteration-recipes.test.ts:760` |
| `test:protocol.perspective-filter-recipe` | `test/iteration-recipes.test.ts:767` |
| `impl:protocol.context-bundle-recipe` | `test/iteration-recipes.test.ts:772` |
| `test:protocol.context-bundle-recipe` | `test/iteration-recipes.test.ts:779` |
| `impl:protocol.proposal-schema-and-recipe` | `test/iteration-recipes.test.ts:1300` |
| `test:protocol.proposal-schema-and-recipe` | `test/iteration-recipes.test.ts:1307` |
| `impl:protocol.recipe-parameters-catalog` | `test/recipes.test.ts:4228` |
| `test:protocol.recipe-parameters` | `test/recipes.test.ts:4234` |
| `impl:protocol.design-recipes` | `test/recipes.test.ts:4515` |
| `test:protocol.design-recipes` | `test/recipes.test.ts:4521` |
| `impl:protocol.entry-location-recipes` | `test/recipes.test.ts:5676` |
| `impl:protocol.answer-shape-recipes` | `test/recipes.test.ts:5911` |
| `test:protocol.answer-shape-recipes` | `test/recipes.test.ts:5917` |
| `test:protocol.authoring-grammar-recipes` | `test/recipes.test.ts:6277` |
| `impl:protocol.authoring-grammar-recipes` | `test/recipes.test.ts:6287` |

## onramps-recipes.fix.md

- Keep the apply report's binding delta and structural-membership changes. This fix adds no Spec, anchor, relation, Pack membership, readiness or delivery-fact change. The four warning identities remain unchanged. Re-measured graph totals remain 550 nodes and 1301 edges.
- Replace these two site values from the apply report's table. Every other listed site remains unchanged in this isolated lane; re-derive all affected rows after integration.

| Anchor id | Drop old site | Add current site |
| --- | --- | --- |
| `test:protocol.authoring-grammar-recipes` | `test/recipes.test.ts:6277` | `test/recipes.test.ts:6284` |
| `impl:protocol.authoring-grammar-recipes` | `test/recipes.test.ts:6287` | `test/recipes.test.ts:6294` |

- ONR-01: after the coordinated move below, retain the two authoring-recipes nodes and their existing binding edges; re-transcribe their file, site and test label in `anchors.ts`. Do not drop the nodes or `spec:consumers.agent-surface.authoring-recipes`'s `implemented` and `has-verifier` facts because onramps-docs removed the source anchors. Re-derive the affected `byFile` and blast-radius rows.
- EXT-06: after the helper cleanup below, re-derive the shifted node sites in `test/iteration-recipes.test.ts`. The cleanup changes no binding edges.

## proto-packs.apply.md

**Rungs:** none moved. Delivery facts: `spec:protocol.self-hosting` gains `has-verifier`.

**Warnings:** unchanged. Validate in this worktree reports the four pinned warnings.

**New anchor (`anchors.ts`):**
- `{ id: "test:protocol.self-hosting", nodeType: "Anchor", label: "checks that the corpus derives one graph through the one validation path", file: "test/self-hosting-graph.test.ts", constant: "selfHostingTestAnchor", site: "void selfHostingTestAnchor" }`
- It sits before the structural-self-binding anchor.
- Binding edge: `["test:protocol.self-hosting", "verifies", "spec:protocol.self-hosting"]`.

**Label (`anchors.ts`):** `test:protocol.structural-self-binding` becomes "checks the accepted membership and helper coverage, authored uses, and pinned anchor roles, layers and contexts". Its line moves down 7.

**Declared relations (`declared-relations.ts`):**
- protocol.self-hosting:
  - `dependsOn` carrier.markdown-authoring gains the reason "the self-hosted corpus uses the Markdown carrier"
  - `dependsOn` model.protocol-domain becomes model.core-model, with the reason "the self-hosted corpus is authored as Specs on the Protocol's core model"
  - new `decidedBy` decisions.one-validation-path
- protocol.structural-self-binding:
  - new `dependsOn` model.structural-patterns, with the reason "this model defines the significance criterion and the owner-reviewed accepted set"
  - new `decidedBy` decisions.anchor-binding-grain (architectural-annotation is kept)
- observation.run-evidence:
  - `dependsOn` extraction.delivery-facts gains the reason "the view reads verifier bindings while leaving their delivery facts unchanged"
  - new `dependsOn` consumers.agent-surface.recipe-parameters, with the reason "the caller passes run records to the recipe as data"

**Carrier text (`protocol.ts`):**
- self-hosting: outcome.
- structural-self-binding: outcome; all eight rules (rewritten and keyed); new `ruleKeys`: criterion, membership, architecturalUses, componentUses, acceptedSet, layerAndContext, role, decisionReferences.

**Carrier text (`observation.ts`):**
- run-evidence:
  - narrative (two paragraphs)
  - `#freshness` gains `decider` and `provisional`
  - new questions `#recipeContract` and `#studioRuns`, each non-blocking with `decider` and `provisional`
  - rules 1 to 3 are keyed (graphUntouched, fileGrain, ctrfInput) and rule 2 is rewritten
  - rule 6 is rewritten
  - new `ruleKeys`
- runtime-overlay: `#observationIdentity` gains `decider` and `trigger`, so it is now a deferral in recipe 20.

**Packs (`pack-members.ts`):**
- `expectedPackMembers` is the 257-entry `specs` list of `specs/self-hosting.pack.sdp.md`, in its new order. Transcribe it from the manifest.
- Self-hosting framing; `modelRefs: ["spec:model.core-model"]`.
- Framings for design-management, design-iteration and spec-studio. Their members are unchanged.

**Roster (`structural-edges.ts`)**, as ruled:
- PRO-04: append to `coarseGrainCoverage`: `{ unit: "src/extract/gherkin-kind-honesty.ts#gherkinKindLieReason", coveredBy: "impl:protocol.gherkin-authoring", componentId: "component:protocol.extract", rationale: "src/extract/gherkin.ts#decorationTagFinding value-calls gherkinKindLieReason" }`.
- PRO-06, once ONRAMPS drops `component` from the four anchors in `test/iteration-recipes.test.ts`:
  - Move the four ids into `structuralMembershipExceptions`, under the recipe-realization comment: `impl:protocol.design-diff-recipe`, `impl:protocol.perspective-filter-recipe`, `impl:protocol.context-bundle-recipe` and `impl:protocol.proposal-schema-and-recipe`.
  - Delete their four `test/iteration-recipes.test.ts#runRecipe` rows in `acceptedArchitecturalUnits`.
  - Drop their `component` in `anchors.ts`. That is four fewer `memberOf` edges.

**Location rows:** every edited carrier's lines shift. New rows:
- `rule[i]` with key on run-evidence (3) and structural-self-binding (8)
- question and field rows on run-evidence (3 questions) and runtime-overlay (2 fields)

**Recipes:** recipe 34 gains 11 unexercised keyed rules; recipe 20 changes as above; recipe 33's rows are unchanged.

**Totals:**
- This worktree alone: `258 specs · 5 packs · 288 anchors → 551 nodes · 1310 edges`.
- With MODEL's deletion and VALIDATION's repoint simulated: `257 specs · 288 anchors → 550 nodes · 1309 edges`.
- PRO-06 subtracts 4 `memberOf` edges when it lands.
- Re-measure after merge.

## proto-packs.fix.md

Nothing to add or drop. The only roster row is still the `gherkin-kind-honesty.ts` coarse-grain row, and the new candidates authorize no anchor or row.

## validation.apply.md

These modules are affected: `test/self-hosting-oracle/validation.ts`, `declared-relations.ts`, the location rows, and the totals. No anchor, Pack membership, Spec creation or deletion, or warning change: validate still reports the same 4 warnings. In this worktree, derived edges went from 1304 to 1313 (+9 declared edges). Re-measure after the merge.

| Spec (`spec:validation.`) | Pinned changes |
|---|---|
| `two-check-families` | `intent.openQuestions` removed (`registryLawPromotion`). `rules[0]` and `rules[2]` text. Old `rules[5]` (entrypoints) deleted. New `rules[5]` is "A validator id, once shipped…"; `ruleKeys {stableIds: rules[5]}`. |
| `readiness-floor` | `intent.outcome`. `openQuestions` removed (`headerLawPromotion`). Final 14 rules, by index: 2 (ideaFloor) new text; 3-5 text unchanged but keyed; 6, 9, 10 new text; 11 new (totality); 12 new (shipped clause table); 13 keyed `floorTable`, text unchanged. `ruleKeys`: ideaFloor→rules[2], scopedFloor→[3], definedFloor→[4], readyFloor→[5], floorTable→[13]. Relation: `dependsOn` protocol-domain removed; `dependsOn` core-model added with its reason. |
| `kind-evidence` | `rules[1]`, `[3]`, `[7]` text. `decidedBy` becomes a list: kind-conditional-floor, then carried-evidence with its reason. |
| `next-rung-floor` | title. `intent.outcome`. `rules[0]`, `[1]`, `[2]`, `[4]` text. `rules[5]` deleted (5 rules left). |
| `verification-linkage` | title. outcome. `rules[0]`, `[1]` text. `rules[3]` deleted (3 rules left). |
| `verification-linkage.unbound-example` | outcome. |
| `verification-linkage.unresolved-oracle` | title. outcome. |
| `unbound-example-posture` | `rules[2]`, `[3]`, `[4]` text. `rules[5]` deleted (5 rules left). |
| `unbound-example-posture.lower-rungs` and `.warning-cases` | `intent.assumptions[2]`. Readiness `ready`. |
| `unbound-example-posture.parent-traces` | `intent.assumptions[2]`. Readiness `ready`. |
| `next-rung-floor.blocking-question`, `.typed-dependency-targets`; `typed-dependency-floor.missing-targets`, `.relation-rungs`, `.stated-readiness`, `.unsettled-fact` | Readiness `ready`. |
| `typed-dependency-floor` | `narrative` new (was null). `rules[1]` text. New `rules[3]` (self-target); old 3-5 move to 4-6. |
| `authored-honesty` | outcome. Rules become two new rules. The entrypoint rule is deleted. |
| `claim-separation` | `rules[2]` deleted. `dependsOn` claim-taxonomy and derive-graph added, with no reasons. |
| `referential-integrity` | `rules[1]` text. `rules[2]` deleted. |
| `pack-coherence` | `narrative` new. `rules[3]` loses its last sentence. `rules[4]` deleted. `dependsOn` pack-aggregate added with its reason. |
| `warn-level-signals` | `rules[1]`, `[2]`, `[3]` text. `rules[4]` deleted. |
| `warn-level-signals.orphan-signal`, `.ready-gap-signal` | title. outcome. |
| `readiness-floor.blocking-open-question` | title. Declared `verifies` gains `exercises ["definedFloor"]`. |
| `readiness-floor.unrelated-scoped-spec` | title. Declared `verifies` gains `exercises ["scopedFloor"]`. |
| `prose-mentions` | `rules[0]` text. Final 11 rules: new rule at 3 (links) and new rule at 9 (line). `dependsOn` open-question-fields added with its reason. |
| `diagnostic-rendering` | Old `rules[5]` deleted. New `design: { summaryLine }` and its location row `design.summaryLine`. |
| `duplicate-ids` | New `behavior.rules[1]`. The markdown-parser `dependsOn` gains its reason. |
| `oracle-target-eligibility` | `rules[2]` text. |
| `validator-self-testing` | `narrative` new. `openQuestions` `[evidenceAudit]` (non-blocking, `decider: owner`, provisional). Two rules; `ruleKeys {bothDirections: rules[0]}`. |
| `corpus-rules` | `narrative` paragraph 2. `openQuestions` `rulesRepresentation`, `findingCurrency`, `ruleIsolation` (each non-blocking, `decider: owner`, provisional). `rules[0]` text. `dependsOn` adds diagnostic-rendering with its reason. `decidedBy` architectural-annotation with its reason. |
| `architecture-constraints` | `narrative` paragraph 2. `ruleForms` text, plus `decider` and `provisional`. New `walkInvocation` (non-blocking, `decider`, `provisional`). `rules[5]` text. |
| `superseded-decision-signal` | Readiness `scoped`. `narrative` (paragraph 1 changed, paragraph 2 deleted). `openQuestions`: `keptRecord` (blocking, `decider`, `trigger`), `signalReach` (+`decider`, +`provisional`), `supersededChain` (+`decider`). Old rules 0-2 become one rule (5 rules). `dependsOn` adds graph-first-planning with its reason. `decidedBy` planning-truths-placement with its reason. |

Derived consequences for PINS to re-measure:
- Recipe 33 (design backlog) drops superseded-decision-signal.
- The readiness census gains 9 `ready` and 1 `scoped`, and loses 10 `defined`.
- Rule coverage (recipe 34) reports keyed rules now. readiness-floor has 5 keyed rules, 2 of them exercised.
- Location rows: the deleted question rows and the shifted rule rows in the Specs above, plus new question-field rows.
- Recipe totals in `test/recipes.test.ts` and the totals in `test/self-hosting-graph.test.ts`.

## validation.fix.md

Add to the apply report's rows (both are text-only changes, with no new location rows, relations, rungs or warnings):
- `spec:validation.corpus-rules`: the `openQuestions` `findingCurrency` question text and its `provisional` text.
- `spec:validation.diagnostic-rendering`: the `design.summaryLine` text.

Nothing to drop.

## cons-surface.fix.md

- For PINS: nothing to add or drop. The lane report's list stands as written.

## eng-extract.fix.md

- For PINS: add nothing and drop nothing. Retain the entire `eng-extract.apply.md` For PINS list; the fresh validation has the same baseline warning set.

## ENG-RENDER handoffs owned by PINS

- PINS, `test/self-hosting-oracle/structural-edges.ts`: replace the BlastRadius row with:

```ts
{
  unit: "src/reader/reader.ts#BlastRadius",
  anchorId: "impl:protocol.reader",
  componentId: "component:protocol.reader",
},
```

- PINS, the same file: the roster contains two units using `impl:protocol.reader` after that replacement. Replace the membership derivation with unique pairs so the roster does not manufacture a duplicate graph edge:

```ts
export const expectedMemberOfEdges = acceptedArchitecturalUnits
  .map((row) => [row.anchorId, row.componentId])
  .filter(
    ([anchorId, componentId], position, rows) =>
      rows.findIndex(([anchor, component]) => anchor === anchorId && component === componentId) === position,
  );
```

- PINS, `test/self-hosting-oracle/anchors.ts`: apply the exact row additions and removals listed above, then re-measure combined totals.
