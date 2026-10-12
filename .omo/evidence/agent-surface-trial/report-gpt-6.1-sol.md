## 1. Answers

Read-only trial completed; no files written. The supplied branch and commit were assumed, since revision verification was outside the permitted surface. Below, Spec names omit `spec:`; grouped names retain their family prefix. Q-numbers refer to the commands in section 5. “Implemented” and “has-verifier” describe resolving bindings, not execution or passing tests.

1. **Ready implementation work: none. Defined without implementation: 24 Specs:** `consumers.{agent-surface.example-space-coverage, context-bundle, design-diff, edit-model, intent-composition.proposal, review-perspectives, spec-studio, spec-studio.intent-panel, spec-studio.sharing}`; `extraction.contract-declarations`; `model.{design-maturity, open-question-fields, planned-architecture, protocol-domain, relation-reasons, rule-keys, structural-patterns}`; `observation.run-evidence`; `protocol.{self-hosting, structural-self-binding}`; `validation.{architecture-constraints, corpus-rules, superseded-decision-signal, validator-self-testing}`. **Commands:** Q1/R1 and Q3; evidence: `"total": 0`, and Q3 rows such as `"id": "spec:consumers.context-bundle", "floor": "ready", "facts": []`. **Confidence: high. Friction:** the existing backlog recipe needed a custom companion for defined work.

2. **Neither inconsistency occurs:** no implemented Spec states below ready; none states above its structural floor. **Commands:** Q2/R2, Q4; evidence: `"total": 0, "alarms": []` and `[]`. **Confidence: high. Friction: none.**

3. **Changing `consumers.pack-design` reaches seven dependent Specs:** directly, `consumers.{agent-surface.design-recipes, design-review.pack-design-page, review-perspectives}`, `decisions.pack-design-page`, `model.design-maturity`; transitively, `consumers.{agent-surface.example-space-coverage, context-bundle}`. Four code units follow, including the changed Spec’s own realization: `impl:protocol.{pack-design, design-recipes, pack-design-page, pack-design-sections}`. Their sites are `src/reader/reader.ts:532`, `test/recipes.test.ts:4314`, `src/projections/design-review-pages.ts:127`, and `src/projections/design-review-pack-sections.ts:19`; the last is a reference binding. Verifiers: `test:protocol.{pack-design, design-recipes, pack-design-page}`. Packs: `pack:{design-management-v1, self-hosting-v1}`. **Command:** Q5/R30; evidence: `"dependents": 7, "units": 4`, with distances 1 and 2. **Confidence: high. Friction: none;** this recipe supplied the complete join.

4. **The freeze is narrowed by** `decisions.{authored-entry-order, pack-design-page, question-key-rendering}`. No decision currently supersedes another. The freeze directly shapes `consumers.{census-page, design-review, gherkin-view, mermaid-view, spec-studio, structural-mermaid}` through `decidedBy`. **Command:** Q6/R31; evidence: `"superseded": 0`, and the freeze row’s `"narrowedBy"` and `"shapes"` lists. **Confidence: high. Friction:** the whole decision register was substantially larger than this answer required.

5. **Ready without a verifier binding:** `model.spec-sections` plus **all 40 ready decision Specs**; the only remaining decision, `decisions.studio-web-components`, is scoped. Validation reports only the non-decision gap, plus three prose-mention warnings: `consumers.delivery-session-on-ramp` mentions the freeze; `decisions.carrier-ruling` mentions carrier universality; `decisions.planning-truths-placement` mentions `consumers.impact-graph`, each without a declared relation between the pair. **Commands:** Q7/R8, Q17, Q6/R31; evidence: `"total": 41`, `"others": ["spec:model.spec-sections"]`, `"errors": 0`, `"warnings": 4`, and `"conformance/prose-mentions": 3`. **Confidence: high. Friction:** warning-policy gaps and raw missing bindings require separate queries.

6. **The rule is in `consumers.context-bundle`, `behavior.rules[5]`:** when protected content exceeds the budget after all permitted cuts, return a **budget-exceeded result as data, without a partial bundle**, containing requested scope, budget and minimum required count; `sdp q` exits 0. The count measures compact returned JSON in UTF-16 code units, not printed JSON or actual tokens. **Command:** Q8/R23 with `term=budget`; evidence: “the recipe returns a budget-exceeded result as data and no partial bundle.” **Confidence: high. Friction:** its source line is not answerable from the graph here: `"line": null`.

7. **Design-management holds three members below their stated next rung:** `consumers.intent-composition.proposal` cannot reach ready because `typed-dependency-targets-are-defined` names its `refines` target `consumers.intent-composition`, stated idea; `consumers.reference-projection` and `consumers.structural-mermaid` cannot reach scoped because `kind-evidence-present` fails, with no target attached. **Thirteen await only their author’s statement:** `consumers.{agent-surface.example-space-coverage, review-perspectives, context-bundle, design-diff}`; `model.{design-maturity, planned-architecture, open-question-fields, rule-keys, relation-reasons}`; `validation.{superseded-decision-signal, architecture-constraints, corpus-rules}`; `observation.run-evidence`. **Commands:** Q9/R29, Q12; evidence: `"heldBelowNextRung": 3, "waitingForAuthor": 13`, followed by the compact failure lists. **Confidence: high. Friction:** R29 exceeded the tool output limit; a custom projection recovered the answer.

8. **Pack-design realization:** `impl:protocol.pack-design`, `src/reader/reader.ts:532`, component `component:protocol.reader`, layer `application`, context `protocol`, role `reader`. **Verifier:** enabled `test:protocol.pack-design`, `test/pack-design.test.ts:18`. Both bindings are anchored. **Command:** Q10; evidence: `"layer": "application", "context": "protocol"` and `"enabled": true`. **Confidence: high. Friction: none.**

9. **Changing `src/reader/reader.ts` directly impacts five Specs:** `consumers.{agent-surface, pack-design, reader}`, `extraction.{contract-declarations, entry-locations}`. The explicit one-hop neighborhood contains **29 at-risk Specs:** `carrier.inline-code-spans`; `consumers.agent-surface.{authoring-recipes, demand-map-entries, design-recipes, recipe-parameters, register-recipes, scripted-context-body}`; `consumers.{context-bundle, design-review.pack-design-page, projections-model, reader.changeset-entry, reader.concept-entry, reader.file-entry, review-perspectives, spec-studio, spec-studio.data}`; `decisions.{agent-front-door, agent-surface-scripts-graph, pack-design-page, typing-law}`; `extraction.{delivery-facts, derive-graph, determinism, executable-contracts, pack-member-order}`; `model.{design-maturity, open-question-keys}`; `validation.{corpus-rules, next-rung-floor}`. Other at-risk nodes: `impl:protocol.{agent-surface-cli, entry-location-recipes, entry-locations}`, `oracle:protocol.reader-entry-map`, `pack:{design-management-v1, self-hosting-v1}`, `test:protocol.{entry-locations, pack-design}`. **Command:** Q11/R4; evidence includes `"edgeType": "references", "claim": "anchored"` for contract declarations, and empty `"coverageUnknownFiles"`/`"unlinkedUnits"`. **Confidence: high for this curated neighborhood; exhaustive reach is not answerable from the graph. Friction:** verbose repeated reasons.

10. **No recorded `uses` edge crosses a bounded context.** All 40 resolve to components; 31 cross layers: adapter→application **3**, application→domain **15**, edge→application **6**, edge→domain **7**. No recorded direction runs outward from domain, including domain→edge. **Command:** Q13/R32; evidence: `"contextCrossings": 0` and `"byLayerPair"` with those four directions. **Confidence: high for anchored dependencies. Friction: none.**

11. **Six blocking questions:** named-reader deferrals are `consumers.projections-model.roadmap-views#question.namedRoadmapReader` (unserved release/baseline/roadmap demand with measurable need), `consumers.reference-projection#question.namedOutsideReader` (an outside human consumer unserved by the four roots), and `consumers.structural-mermaid#question.namedStructuralReader` (code-rooted diagram demand, plus a decision about the one-generated-view posture). **Design holds:** `consumers.impact-graph#question.symbolIdentity` asks for language-neutral symbol identity/extraction boundaries; `model.enrichment-lifecycle#question.detailAfterImplementation` asks what detail survives implementation; `observation.runtime-overlay#question.observationIdentity` asks for observation identity and freshness boundaries. **Command:** Q14/R20; evidence: `"blocking": 6`, “Re-entry trigger: a named reader…” versus “Which language-neutral identity and extraction boundary…”. **Confidence: high; classification follows question prose. Friction:** the register has no structured deferral/design-hold distinction.

12. **The Studio cannot state ready now.** Its floor reaches defined; `typed-dependency-targets-are-defined` fails because its `decidedBy` target `decisions.studio-web-components` states scoped. That decision already clears the ready floor. Its author must state at least defined to remove this structural hold; owner ratification would normally state the decision ready, after which the Studio still needs its own human readiness statement. **Commands:** Q15/R9, Q18; evidence: `"statedReadiness": "scoped"` in the failing target and `"floor": "ready"` for the decision. **Confidence: high. Friction:** promotion preflight and Pack design use different meanings of next rung, requiring care.

13. **Sharing resolves:** `consumers.spec-studio.sharing#design.buildStamp`, `specs/consumers/spec-studio.sharing.sdp.md:24`, value: “`stamp.json` beside the page set, written by the publishing step and never by the Studio's build, holding the graph's `schemaVersion`, the git commit the build came from or `unknown` for a local build, the engine `sdp --version` names, and the build time.” **DesignedRung does not resolve:** its Spec exists, but that question entry does not. Current model text places design maturity in derived design columns and says the designed-stage question reopens if adopter design passes show those columns insufficient. Why the former entry disappeared historically is **not answerable from the graph**. **Commands:** Q16/R25, Q18; evidence: `"reason": "entry"` and the current `"designed stage"` definition. **Confidence: high. Friction:** failed resolution discards parsed subject fields and offers no nearby entries.

## 2. Friction log

| ID | Wanted | Tried | Got | Did instead | Cost |
|---|---|---|---|---|---|
| F1 | Locate relevant recipes quickly | Read skills and catalog; scan headings | Useful routing across a long, 32-recipe catalog | Used numbered headings and shipped bodies | Minor |
| F2 | Compact Pack holds and file impact | R29 and R4 | R29 exceeded tool output limit; R4 repeated many reason objects | Wrote Q12; condensed Q11’s returned data | Slowed |
| F3 | Every ready Spec lacking bindings | R8 | Policy-filtered warnings, not the complete raw set | Wrote Q17; distinguished 40 decisions | Minor |
| F4 | Understand blocking-question categories | R20 | Flags and prose, no category | Classified triggers from wording | Minor |
| F5 | Exact budget rule and source line | R23, `budget` | Excellent rule text; null line; budget actually uses UTF-16 units | Reported rule path and unavailable line | Minor |
| F6 | Read guarantees through the advertised context recipe | Inspected R3 | `sections: Object.keys(...)`, not guarantee prose | Used entry search and selected `sections` directly | Minor |
| F7 | Explain stale address | R25, then Q18 | `reason: entry`; parsed fields null; no historical explanation | Read current model text; preserved historical uncertainty | Minor |
| F8 | Establish passing verification | Delivery facts and verifier bindings | Existence only; no execution evidence | Reported binding coverage; pass status unavailable | Blocked |

## 3. Assessment

Scores use **5 = strongest**.

| Dimension | Score | Evidence |
|---|---:|---|
| Finding the right recipe/body | 4 | Skills routed nearly every task; catalog navigation still required scanning (F1). |
| Output shape | 3 | Clear JSON and paths, but R29 overflowed and R4 repeated substantial data (F2). |
| Errors and diagnostics | 4 | Clause IDs and target rungs explained holds; address failure was terse (F7). Invalid-body diagnostics were not tested. |
| Vocabulary | 4 | Claims and readiness are precise; next-rung meanings and “token-budgeted” terminology need attention (F5). |
| Skill accuracy | 5 | Observed APIs, parameters, bindings and limitations matched the skills; no operational mismatch found. |
| Claims and delivery facts | 5 | Anchored versus declared, references versus realization, and verifier existence stayed explicit. |
| Speed | 5 | Calls completed in approximately 1.2–2.0 seconds, including graph derivation. |

**First five improvements, ranked:**

1. Offer compact summary projections alongside detailed recipe outputs, especially R29/R4; preserve counts and provide explicit omitted-row information (F2).
2. Make R3 return guarantee text, or rename it and point directly to a content-reading body (F6).
3. Present raw missing verifier bindings beside policy-filtered gaps and audited exclusions (F3).
4. Improve entry navigation: retain parsed fields on failed addresses, offer nearby keys, and extend source locations to rule entries (F5, F7).
5. Give recipes a concise task index and a documented way to distinguish deferral triggers from design holds without repeatedly interpreting prose (F1, F4).

**What worked best:** shipped recipes with JSON parameters; R30’s transitive paths and follow-on bindings; R23’s direct retrieval of authored rules; named floor clauses with target readiness; and explicit limits on what delivery facts prove. I answered all substantive tasks without opening carriers or source.

## 4. The open task

The graph contains **250 Specs**, of which **70 have implementation bindings and 69 of those have verifier bindings** (Q19: `"implemented": 70, "implementedWithVerifier": 69`). The remaining implemented Spec, `model.spec-sections`, is the single validation verifier gap. Passing tests are not answerable from the graph; neither is runtime realization, and Q19 reports `"observed": 0`.

The ready implementation backlog is empty, while 24 non-example, non-decision Specs state defined without implementation (Q1/Q3). Designed but unbuilt work includes context bundles, design diff, review perspectives, declaration modules, architecture modeling/checks and run evidence. Clearing the structural ready floor does not settle their design: the design-management Pack reports **zero keyed design entries**, **23 open questions**, and **13 author-only waits** (Q9).

The thinnest design is around exhaustive impact, runtime observation and post-implementation detail retention: each has a blocking boundary question (Q14). Additional projections explicitly wait for named demand.

I would make the next arc a **bounded Studio design pass followed by its read-only first build**. Q20 names actual readers and five concrete adopter acceptance tasks; every Studio Pack member remains unimplemented. First resolve the web-components decision’s stated rung, then settle which historical UI promises map to existing graph values, especially run results, harnesses, header metadata and architecture views. Keep acceptance tied to finding and explaining intended truth and bindings. This trial also supports improving compact recipe outputs and content navigation before adding more surfaces.

## 5. Commands

**20 `sdp q` calls.** All used `pnpm --silent sdp:q … --json` from the repository root. Recipe calls supplied the body with `"$(cat dist/recipes/<NN>-<slug>.js)"`; listed parameters used `--params '<json>'`. Custom bodies below are abbreviated.

| Call | Recipe or body |
|---|---|
| Q1 | R1: build backlog |
| Q2 | R2: drift alarm |
| Q3 | `g.specs().filter(defined && !example/decision && !implemented).map(id,floor,facts)` |
| Q4 | Compare stated and derived indices in `["idea","scoped","defined","ready"]`; return overstatements |
| Q5 | R30; `{"specs":["spec:consumers.pack-design"]}` |
| Q6 | R31: decision register |
| Q7 | R8: orphans and gaps |
| Q8 | R23; `{"term":"budget"}` |
| Q9 | R29; `{"pack":"pack:design-management-v1"}` |
| Q10 | `g.specContext("spec:consumers.pack-design")`; return implementations and verifiers |
| Q11 | R4; `{"files":["src/reader/reader.ts"]}` |
| Q12 | `g.packContext("pack:design-management-v1")`; select held members and author-only waits |
| Q13 | R32: architecture crossings |
| Q14 | R20: open-question register |
| Q15 | R9; `{"spec":"spec:consumers.spec-studio"}` |
| Q16 | R25; `addresses` = the two task-13 addresses |
| Q17 | Filter ready without `has-verifier`; separate decisions and others |
| Q18 | Contexts for web-components decision and design-maturity; return sections and floor evidence |
| Q19 | Count Specs/rungs/implementation/verifier/observed facts; summarize idea/scoped contexts |
| Q20 | Studio context rules and Studio Pack member readiness, holds, design counts and bindings |
