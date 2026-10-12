No files were written. Repository reads stayed within the allowlist. One exception to the broader file restriction: an environment instruction required reading the external `unslop/SKILL.md` writing guide.

Below, IDs omit `spec:` unless another namespace appears. Brace lists expand into separate IDs. Q1–Q17 identify calls listed at the end; R denotes a shipped recipe.

The answers:

1. **Ready but unbuilt: none. Defined but unbuilt: 24.** These are `consumers.{agent-surface.example-space-coverage,context-bundle,design-diff,edit-model,intent-composition.proposal,review-perspectives,spec-studio,spec-studio.intent-panel,spec-studio.sharing}`; `extraction.contract-declarations`; `model.{design-maturity,open-question-fields,planned-architecture,protocol-domain,relation-reasons,rule-keys,structural-patterns}`; `observation.run-evidence`; `protocol.{self-hosting,structural-self-binding}`; `validation.{architecture-constraints,corpus-rules,superseded-decision-signal,validator-self-testing}`. Commands: Q1/R1, Q7. Evidence: `"total": 0`; Q7’s `"definedUnbuilt"` array names those 24. Confidence: high for missing implementation bindings, not proof of absent code. Friction: custom filter needed for the second question.

2. **Neither problem occurs.** Commands: Q2/R2+R7. Evidence: `"drift":{"total":0,"alarms":[]}`, `"divergence":[]`. Confidence: high. Friction: none.

3. **Five direct dependents, two transitive dependents.** Direct: `consumers.{agent-surface.design-recipes,design-review.pack-design-page,review-perspectives}`, `decisions.pack-design-page`, `model.design-maturity`. Transitive: `consumers.{agent-surface.example-space-coverage,context-bundle}`, through design-recipes. Following units: `impl:protocol.{pack-design,design-recipes,pack-design-page,pack-design-sections}`. Verifiers: `test:protocol.{pack-design,design-recipes,pack-design-page}`. Packs: `pack:{design-management-v1,self-hosting-v1}`. Command: Q3/R30 with `specs:["spec:consumers.pack-design"]`. Evidence: `"dependents":7,"units":4`, with distances 1 and 2 and explicit paths. Confidence: high for declared relationships and anchored bindings. Friction: none.

4. **Three decisions narrow the freeze:** `decisions.{authored-entry-order,pack-design-page,question-key-rendering}`. No decision currently supersedes another. The freeze directly shapes `consumers.{census-page,design-review,gherkin-view,mermaid-view,spec-studio,structural-mermaid}`. Command: Q4/R31, filtered to the freeze and supersession rows. Evidence: `"narrowedBy"` lists those three, `"supersession":[]`, and `"shapes"` lists those six. Confidence: high. Friction: none.

5. **41 ready Specs lack verifier bindings:** all 40 ready decisions, meaning every decision except `decisions.studio-web-components`, plus `model.spec-sections`. Decision records are intentionally excluded from verifier-gap warnings. Validation reports zero errors and four warnings: one gap for `model.spec-sections`; three unbacked prose mentions, `consumers.delivery-session-on-ramp → decisions.shipped-projections-frozen`, `decisions.carrier-ruling → decisions.carrier-universality`, and `decisions.planning-truths-placement → consumers.impact-graph`. Commands: Q7, Q15. Evidence: `"states readiness \"ready\" with no resolving verifier"`; decision posture says `"verifier-gap signal exclude kind decision"`. Confidence: high. Friction: literal missing bindings and operational gaps require separate answers.

6. **`consumers.context-bundle`, `behavior.rules[5]`.** It returns a budget-exceeded result containing requested scope, budget, and minimum protected-content count, with no partial bundle; `sdp q` exits 0. The unit is UTF-16 code units of compact `JSON.stringify`, including metadata, rather than printed JSON length. Command: Q8/R23, `term:"budget"`. Evidence: `"returns a budget-exceeded result as data and no partial bundle"`; `"line":null,"address":null`. Confidence: high. Friction: the rule is readable, but its source line is not answerable from the graph.

7. **Three members are held below their next stated rung.** `consumers.intent-composition.proposal` cannot reach ready because `typed-dependency-targets-are-defined` targets its `refines` parent `consumers.intent-composition`, stated idea. `consumers.{reference-projection,structural-mermaid}` cannot reach scoped because `kind-evidence-present` fails, with no target. Thirteen await only their author’s next-rung statement: `consumers.{agent-surface.example-space-coverage,review-perspectives,context-bundle,design-diff}`, `model.{design-maturity,planned-architecture,open-question-fields,rule-keys,relation-reasons}`, `validation.{superseded-decision-signal,architecture-constraints,corpus-rules}`, `observation.run-evidence`. Command: Q5/R29, `pack:"pack:design-management-v1"`. Evidence: `"heldBelowNextRung":3,"waitingForAuthor":13`. Confidence: high. Friction: two meanings of “next rung” require care.

8. **`impl:protocol.pack-design` binds realization at [reader.ts:532](/Users/darkomijic/dev-libar/software-delivery-protocol/src/reader/reader.ts:532).** Its component is `component:protocol.reader`, layer `application`, context `protocol`, role `reader`. `test:protocol.pack-design` verifies it at [pack-design.test.ts:18](/Users/darkomijic/dev-libar/software-delivery-protocol/test/pack-design.test.ts:18). Commands: Q13/R3, Q14/context bindings. Evidence: `"claim":"anchored"`, `"layer":"application"`, `"enabled":true`. These are binding locations, not inspected function bodies. Confidence: high. Friction: R3 omits component attributes and verifier line already available in the context.

9. **Five directly impacted Specs:** `consumers.{agent-surface,pack-design,reader}`, `extraction.{contract-declarations,entry-locations}`. There are 29 one-hop at-risk Specs: `carrier.inline-code-spans`; `consumers.agent-surface.{authoring-recipes,demand-map-entries,design-recipes,recipe-parameters,register-recipes,scripted-context-body}`; `consumers.{context-bundle,design-review.pack-design-page,projections-model,reader.changeset-entry,reader.concept-entry,reader.file-entry,review-perspectives,spec-studio,spec-studio.data}`; `decisions.{agent-front-door,agent-surface-scripts-graph,pack-design-page,typing-law}`; `extraction.{delivery-facts,derive-graph,determinism,executable-contracts,pack-member-order}`; `model.{design-maturity,open-question-keys}`; `validation.{corpus-rules,next-rung-floor}`. Other at-risk nodes: `impl:protocol.{agent-surface-cli,entry-location-recipes,entry-locations}`, `oracle:protocol.reader-entry-map`, `test:protocol.{entry-locations,pack-design}`, and both Packs from answer 3. Command: Q12/R4, `files:["src/reader/reader.ts"]`. Evidence distinguishes `"satisfies"` from `"references"` and returns `"coverageUnknownFiles":[],"unlinkedUnits":[]`. Confidence: high for this bounded reach; exhaustive symbol impact is not answerable from the graph. Friction: 3,938 output tokens for one file.

10. **No recorded `uses` edge crosses contexts.** Of 40 edges, all resolve to components; 31 cross layers: adapter→application 3, application→domain 15, edge→application 6, edge→domain 7. No outward direction occurs in these recorded crossings, including domain→edge. Command: Q6/R32. Evidence: `"resolvedToComponents":40,"contextCrossings":0` and the four direction counts. Confidence: high for declared architecture, not unrecorded imports. Friction: none.

11. **Six blocking questions.** Named-reader deferrals: `consumers.projections-model.roadmap-views#question.namedRoadmapReader`, needing unmet roadmap demand; `consumers.reference-projection#question.namedOutsideReader`, needing an outside consumer; `consumers.structural-mermaid#question.namedStructuralReader`, needing code-rooted diagrams and a projection-policy decision. Design holds: `consumers.impact-graph#question.symbolIdentity`, language-neutral exhaustive symbol identity; `model.enrichment-lifecycle#question.detailAfterImplementation`, what detail survives implementation; `observation.runtime-overlay#question.observationIdentity`, observation identity and freshness. Command: Q9/R20, filtered to blocking questions. Evidence: `"blocking":6`; deferral text explicitly says `"Re-entry trigger"` and `"named reader"`. Confidence: high; the classification is my reading of question text. Friction: no typed distinction between deferral and design hold.

12. **No, Studio cannot honestly state ready yet.** `typed-dependency-targets-are-defined` fails because its `decidedBy` target, `decisions.studio-web-components`, states scoped. That target’s floor already reaches ready. Its author must honestly state at least defined; Studio would then need its own ready statement. Commands: Q10/R9, Q15, Q17/R29. Evidence: `"floorReached":"defined"` and target `"statedReadiness":"scoped"`; decision `"floor":"ready"`. Confidence: high for this Spec’s floor, not the whole Pack’s readiness. Friction: the immediate next rung and eventual ready eligibility differ.

13. **`consumers.spec-studio.sharing#design.buildStamp` resolves at [sharing.sdp.md:24](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/consumers/spec-studio.sharing.sdp.md:24).** Value: “`stamp.json` beside the page set, written by the publishing step and never by the Studio's build, holding the graph's `schemaVersion`, the git commit the build came from or `unknown` for a local build, the engine `sdp --version` names, and the build time.” `model.design-maturity#question.designedRung` does not resolve because the Spec has no such question entry now. Commands: Q11/R25, Q15. Evidence: `"reason":"entry"`; current narrative says `"derives design columns beside readiness and adds no rung"`. Confidence: high for current state. Friction: the miss erases parsed identity fields; deletion history is not answerable from the graph.

I recorded these friction incidents:

| ID | Wanted | Tried | Got | Did instead | Cost |
|---|---|---|---|---|---|
| F1 | Compact impact and delivery answers | R4; broad custom census | Large returns; batching also hit my tool’s output cap | Reduced stored results in memory | Slowed |
| F2 | Guarantees and complete bindings | R3 | Section names, reduced binding fields | Selected `sections` and full bindings directly | Slowed |
| F3 | Precise location of budget rule | R23 | Text and rule index, null address/line | Cited Spec and index | Blocked for line |
| F4 | Understand promotion distance | R9 versus R29 | Different, documented meanings of next rung | Compared current statement, floor, and failures | Slowed |
| F5 | Explain missing question address | R25 | `reason:"entry"`; parsed fields null | Read current narrative through context | Minor |
| F6 | All ready Specs without verifiers | Raw fact filter versus findings | 41 missing bindings, one gap warning | Queried decision exemption | Minor |
| F7 | Establish verified delivery | Bindings and delivery facts | Existence of verifiers, no run results | Qualified “verified” throughout | Blocked |

My assessment, on a scale where 5 is best:

| Dimension | Rating | Evidence |
|---|---:|---|
| Finding the recipe/body | 4 | Numbered catalog closely matched tasks; scanning a 2,400-line catalog added setup work. |
| Output shape | 3 | Explicit paths and targets are excellent; R3 drops useful fields while R4 is verbose. |
| Errors and diagnostics | 4 | All 17 calls succeeded; readiness failures name clauses and targets. Address misses are sparse. |
| Vocabulary | 4 | Claims and bindings are precise; the two next-rung concepts take effort. |
| Skill accuracy | 4 | Agent-surface instructions matched observed behavior; R3’s “guarantee” title promises more than its return. |
| Claims and delivery facts | 5 | `anchored`, `declared`, realization, references, and verifier existence stay distinguishable. |
| Speed | 5 | Observed calls took 1.52–2.18 seconds, including concurrent batches. Reading dominated. |

The five improvements I would make first:

1. Give R3 selectable guarantee text and complete binding fields. F2.
2. Add compact summaries and optional detail parameters to large recipes, retaining totals. F1.
3. Show both the stated next rung and remaining path to ready together. F4.
4. Extend source locations to behavior rules; stable rule addresses would help too. F3.
5. Preserve parsed address fields on misses and return available keys or a recovery hint. F5.

What worked best was R30’s explicit dependency paths, readiness failures naming their exact targets, and parameterized shipped bodies that ran unchanged. Most questions needed composition, not source-file escape hatches.

For the open task:

The graph records 250 Specs: 176 ready, 58 defined, 10 scoped, and six idea. Seventy have implementation bindings; 69 also have verifiers. In total, 170 have verifier bindings. Actual passing verification is **not answerable from the graph**. The one implemented verifier gap is `model.spec-sections`. Q16 reports `"implemented":70,"both":69`; Q7 supplies the gap.

There is no ready implementation backlog and no implementation/readiness drift. Twenty-four non-example, non-decision Specs are defined without implementation bindings. That is substantial intended work, but “defined” alone does not establish detailed implementation design.

Studio is the clearest next arc. Its Pack has 50 keyed entries, ten pinned declarations, no implementation bindings, and 19 non-blocking questions. Q17 reports `"entries":50,"declarations":10,"withImplementations":0`. Its root also names concrete adopter acceptance tasks, including finding contracts, decisions, dependencies, and verifier evidence, in Q15.

I would next mature a bounded read-only Studio slice, then implement it. First resolve the Web Components statement and clarify which captured UI promises require unavailable runtime evidence, harness identities, or history. Several child Specs still have dependency barriers to ready.

The thinnest areas are impact-graph identity, runtime observation, and deferred projection demand. Q9 exposes their unresolved questions; Q16 shows zero keyed design entries there. Zero entries does not mean zero useful prose, but those open boundaries make them weaker immediate implementation candidates.

I made **17 `sdp q` calls**, all successful. Every call used `pnpm --silent sdp:q '<body>' --json`; shipped recipe bodies were loaded from `dist/recipes/`. Bodies below are abbreviated.

| Call | Body / parameters |
|---|---|
| Q1 | R1 unchanged |
| Q2 | Execute R2 and R7; return `{drift,divergence}` |
| Q3 | R30; `specs:["spec:consumers.pack-design"]` |
| Q4 | R31; select freeze row and nonempty supersession rows |
| Q5 | R29; `pack:"pack:design-management-v1"`; retain totals/readiness |
| Q6 | R32; retain totals and domain→edge rows |
| Q7 | Filter `g.specs()` for defined/unimplemented and ready/no-verifier; return `report.findings` |
| Q8 | R23; `term:"budget"` |
| Q9 | R20; retain blocking questions and totals |
| Q10 | R9; `spec:"spec:consumers.spec-studio"` |
| Q11 | R25; both requested addresses |
| Q12 | R4; `files:["src/reader/reader.ts"]` |
| Q13 | R3; `spec:"spec:consumers.pack-design"` |
| Q14 | Pack-design context implementations/verifiers; join verifier nodes |
| Q15 | Context sections for Studio, Web Components, design maturity, decision readiness posture |
| Q16 | Group Specs by rung/facts; return lower-rung design columns and next-floor failures |
| Q17 | R29; `pack:"pack:spec-studio-v1"`; retain readiness, design counts, questions |
