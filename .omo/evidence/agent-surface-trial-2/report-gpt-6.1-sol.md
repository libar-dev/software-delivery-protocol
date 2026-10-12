## 1. Answers

Read-only throughout; no files written. These answers describe the current graph. Its only metadata is `schemaVersion: "0.9.0"`; confirming branch/commit `0ab4e3d` is **not answerable from the graph**. Commands Q1–Q23 are listed below. Where IDs share a prefix, I list that prefix once.

1. **Implementation backlog:** no ready implementation work lacks a binding: Q1/R1 returned `"total": 0`, excluding 66 examples and 41 decisions. Q4/R33 returned **19 defined, unimplemented Specs**: `spec:consumers.`{`agent-surface.example-space-coverage`, `edit-model`, `impact-graph`, `intent-composition`, `spec-studio`, `spec-studio.intent-panel`, `spec-studio.sharing`}; `spec:extraction.contract-declarations`; `spec:model.`{`design-maturity`, `planned-architecture`, `protocol-domain`, `structural-patterns`}; `spec:observation.run-evidence`; `spec:protocol.`{`self-hosting`, `structural-self-binding`}; `spec:validation.`{`architecture-constraints`, `corpus-rules`, `superseded-decision-signal`, `validator-self-testing`}. All 19 reach the ready floor. **Confidence: high for binding state; friction: F6—“unimplemented” cannot establish absence of unbound code.**

2. **Readiness honesty:** neither implementation below ready nor stated readiness above its floor occurs. Q2/R2: `"total": 0, "alarms": []`; Q3/R7: `[]`. **Confidence: high; friction: none.**

3. **Changing pack-design:** Q17/R30 reports `"dependents": 8, "units": 10`. Direct dependents: `spec:consumers.`{`agent-surface.design-recipes`, `design-review.pack-design-page`, `review-perspectives`}, `spec:decisions.pack-design-page`, `spec:model.design-maturity`; transitive: `spec:consumers.`{`agent-surface.answer-shapes`, `agent-surface.example-space-coverage`, `context-bundle`}. Following units, including the changed Spec’s implementation, are `impl:protocol.`{`pack-design`, `design-recipes`, `pack-design-page`, `pack-design-sections`, `perspective-filter-recipe`, `answer-shape-recipes`, `query-answer-shapes`, `authoring-grammar-recipes`, `reader`, `context-bundle-recipe`}. Enabled verifiers: `test:protocol.`{`pack-design`, `design-recipes`, `pack-design-page`, `perspective-filter-recipe`, `answer-shape-recipes`, `query-answer-shapes`, `context-bundle-recipe`}. Packs: `pack:`{`design-management-v1`, `design-iteration-v1`, `self-hosting-v1`}. These follow declared dependency/refinement paths and anchored bindings, not exhaustive import reach. **Confidence: high; friction: F2.**

4. **Projection freeze:** Q7/R31 lists `"refinedBy"` as `spec:decisions.`{`authored-entry-order`, `pack-design-page`, `question-key-rendering`}; these narrow the freeze. No decision currently supersedes another: `"superseded": 0`, `"replacements": []`. The freeze directly shapes `spec:consumers.`{`census-page`, `design-review`, `gherkin-view`, `mermaid-view`, `spec-studio`, `structural-mermaid`}. **Confidence: high; friction: none.**

5. **Verifier gaps and warnings:** Q16 finds **42 ready Specs without verifier bindings**: `spec:model.spec-sections` and **all 41 decision-kind Specs**; Q7 establishes that all decisions state ready. Decisions are exempt from gap warnings. Q5/R8 reports `"errors": 0, "warnings": 4`: one gap for spec-sections and three prose-mention warnings for missing declared relations between delivery-session-on-ramp → shipped-projections-frozen, carrier-ruling → carrier-universality, and planning-truths-placement → impact-graph.symbol-reach. **Confidence: high; friction: F3.**

6. **Protected bundle content exceeds budget:** Q13/R23 locates `spec:consumers.context-bundle`, rule `rules[7]`, source line **31**, saying it returns “a budget-exceeded result as data and no partial bundle”; exit is 0. Design entry `#design.budgetExceeded`, line **44**, specifies `{ scope, budget, budgetExceeded: true, protectedLength, leftOut }`. Units are UTF-16 code units of compact JSON. Q22/R36 with budget 0 returned `"budgetExceeded": true, "protectedLength": 5691`, matching that shape. **Confidence: high; friction: none.**

7. **Design-management holds:** Q8/R29 reports `"heldBelowNextRung": 2, "waitingForAuthor": 7`. Q18 identifies reference-projection and structural-mermaid, both held below **scoped** by `kind-evidence-present`; neither failure names a target. Waiting only for the author’s ready statement: example-space-coverage, design-maturity, planned-architecture, superseded-decision-signal, architecture-constraints, corpus-rules, run-evidence, with the namespace prefixes used in answer 1. Their `"failures": []`. The two held Specs’ blocking reader questions would also matter for defined, but are not the immediate-next-rung failures. **Confidence: high; friction: minor distinction between immediate and later holds.**

8. **Pack-design realization:** Q9/R3 identifies `impl:protocol.pack-design`, **`src/reader/reader.ts:544`**, role reader, component `component:protocol.reader`, layer **application**, context **protocol**. Its enabled anchored verifier is `test:protocol.pack-design`, **`test/pack-design.test.ts:18`**. Output explicitly says “the graph never records pass or fail.” **Confidence: high for bindings; test success is not answerable from the graph; friction: none.**

9. **Changing reader.ts:** Q10/R4 reports **6 directly impacted Specs, 29 at-risk Specs, 14 other at-risk nodes**, zero unknown files and zero unlinked units. Direct Specs: consumers.{agent-surface, agent-surface.answer-shapes, pack-design, reader}, extraction.{contract-declarations, entry-locations}. The 29 at-risk Specs are carrier.inline-code-spans; consumers.{agent-surface.authoring-recipes, agent-surface.demand-map-entries, agent-surface.design-recipes, agent-surface.recipe-parameters, agent-surface.register-recipes, agent-surface.scripted-context-body, context-bundle, design-review.pack-design-page, projections-model, reader.changeset-entry, reader.concept-entry, reader.file-entry, review-perspectives, spec-studio, spec-studio.data}; decisions.{agent-front-door, agent-surface-scripts-graph, pack-design-page, typing-law}; extraction.{delivery-facts, derive-graph, determinism, executable-contracts, pack-member-order}; model.{design-maturity, open-question-keys}; validation.{corpus-rules, next-rung-floor}. Other nodes: six `impl:protocol.`{agent-surface-cli, answer-shape-recipes, authoring-grammar-recipes, entry-location-recipes, entry-locations, query-answer-shapes}; `oracle:protocol.reader-entry-map`; four `test:protocol.`{answer-shape-recipes, entry-locations, pack-design, query-answer-shapes}; and the three Packs in answer 3. Q20 confirms `"packs": []` for **directly impacted** Packs; those three are **at risk**. **Confidence: high for reported reach; friction: F4.**

10. **Architecture crossings:** Q11/R32 reports `"usesEdges": 40`, `"resolvedToComponents": 40`, `"contextCrossings": 0`. Cross-layer directions: adapter → application **3**, application → domain **15**, edge → application **6**, edge → domain **7**. Same-layer directions: adapter → adapter **1**, application → application **1**, domain → domain **6**, edge → edge **1**. No domain → edge or other outward dependency from domain occurs among these anchored edges. **Confidence: high for declared coverage; friction: none.**

11. **Blocking questions:** Q12/R20 reports `"blocking": 5, "deferrals": 4, "holds": 1`. Deferrals: impact-graph.symbol-reach#question.symbolIdentity asks for language-neutral symbol identity/extraction, triggered by a reader needing reach beyond files/anchors; projections-model.roadmap-views#question.namedRoadmapReader asks whether release/baseline/roadmap views have a named reader; reference-projection#question.namedOutsideReader asks for an outside consumer; structural-mermaid#question.namedStructuralReader asks for code-rooted diagrams, plus a decision on the generated-view posture. The latter three explicitly await named demand; symbol-reach names a reader’s need without requiring the reader to be named. The design hold is observation.runtime-overlay#question.observationIdentity: which external identity and freshness boundary supports honest `observed` evidence? **Confidence: high; friction: none.**

12. **Can spec-studio state ready?** **Yes, structurally.** Q14/R9 returns `"statedReadiness": "defined", "floorReached": "ready"`, no failures, and `"promotionRequiresHumanStatement": true`. No floor repair is required; an author must make the statement. That does not settle every child design: Q23/R29 reports 19 open questions in the Studio Pack, all non-blocking, and zero members with implementations. **Confidence: high about floor eligibility; design sufficiency remains judgment; friction: F6.**

13. **Entry resolution:** Q15/R25 resolves sharing#design.buildStamp at **`specs/consumers/spec-studio.sharing.sdp.md:24`**. Value: “`stamp.json` beside the page set, written by the publishing step and never by the Studio's build,” containing schemaVersion, commit or unknown, engine version, and build time. designedRung does not resolve: `"reason": "section", "available": []`; the Spec exists but has no question section. Q21 gives the present rationale: the owner ruled that design is read from derived columns, with no added rung, floor clause, or design fact. Precisely when/how the old question disappeared is **not answerable from the graph**. **Confidence: high; friction: F5.**

## 2. Friction log

| ID | Wanted | Tried | Got | Did instead | Cost |
|---|---|---|---|---|---|
| F1 | Fast orientation | Read glossary, three skills, catalog index | Accurate but long, overlapping bootstrap and vocabulary instructions | Selected shipped bodies using the index | Slowed |
| F2 | Read complete impact/architecture answers | Batched Q6–Q12 | Tool transport truncated aggregate output; individual JSON was verbose | Reran impact as compact Q17 | Slowed |
| F3 | All ready Specs lacking verifiers | Q5 warning recipe | One gap, with decisions reported only as an exemption count | Q16 explicitly filtered delivery facts | Minor |
| F4 | Understand file impact scope | Q10/R4 | Zero impacted Packs alongside three at-risk Packs; binding reasons omitted by default; impacted Pack rows absent from recipe | Q20 inspected raw radius and reasons | Slowed |
| F5 | Explain missing designedRung address | Q15/R25 | Correct but terse `reason: "section"`; no replacement/rationale pointer | Q21 read current narrative; historical removal remains unavailable | Minor |
| F6 | Distinguish floor eligibility, design sufficiency, actual realization | Q4, Q14, Q19, Q23 | All 19 defined backlog Specs reach ready; Studio parent has zero keyed design entries, while children carry unresolved detail | Kept these claims separate and inspected child columns/questions | Slowed |
| F7 | Attribute results to requested commit | Q19 inspected graph metadata | Only schemaVersion; no branch/commit stamp | Qualified report as current graph; no git workaround | Blocked |

## 3. Assessment

Scale: 1 poor, 5 excellent.

| Dimension | Rating | Evidence |
|---|---:|---|
| Finding recipe/body | 5 | Every numbered task had a clear catalog route; budget search found one Spec and nine entries. |
| Output shape | 3 | Useful counts, IDs, and `leftOut`; large answers needed wrapping, and file impact categories required inspection. |
| Errors/diagnostics | 4 | Address failure distinguished absent section; budget failure was structured data. Parser/CLI errors were not tested. |
| Vocabulary | 4 | Claims and readiness distinctions are precise; “floor reached” versus “stated next rung” takes attention. |
| Skill accuracy | 5 | Observed recipe behavior matched the skills; summary/detail and binding limitations were explained correctly. |
| Claims/delivery facts | 5 | Anchored references stayed separate from realization; verifier existence was explicitly distinguished from passing. |
| Speed | 4 | Calls generally took about 1.3–2.3 seconds; repeated derivation was tolerable, output reading cost more. |

First five improvements, ranked:

1. **Shorten the trial/onboarding path:** one task-to-recipe sheet, with deeper glossary and bootstrap material linked once. **F1**
2. **Make impact outputs easier to compare:** explicitly distinguish direct impact from at-risk neighbors, include impacted Pack IDs, and offer a compact union of units/verifiers/Packs. **F2, F4**
3. **Expose design uncertainty beside floor eligibility:** keep it advisory, but make “floor allows ready” and “design still has unresolved detail” visible together. **F6**
4. **Add optional extraction identity:** commit and dirty-state metadata would make graph-only reports attributable. **F7**
5. **Make absence explanations richer:** show the current related narrative/entry when available, and clearly identify warning exemptions as different from missing bindings. **F3, F5**

What worked best: parameterized shipped recipes ran successfully, graph search exposed authored text and source lines, and the surface let me reshape answers without reading implementation files or inventing new verbs. Every trial question was answerable at the graph’s stated level of evidence.

## 4. The open task

The graph describes a substantial bound implementation: **253 Specs**, 187 ready, **80 implemented**, **180 with verifiers**, and **79 with both**. The sole implemented Spec without a verifier binding is model.spec-sections. These are existence signals, not passing-test evidence. Validation has zero errors, four warnings, no implementation/readiness drift, and no overstated floors. Q19 supplies the counts; Q2, Q3, and Q5 supply the checks.

The ready implementation backlog is empty, but design work is not: **19 defined Specs lack implementation bindings**. They include Studio, impact graph, intent composition, planned architecture, run evidence, and further validation capabilities. All structurally reach ready; 17 have no keyed Design/UI entries. Q4 therefore shows why floor clearance alone cannot prioritize implementation.

The thinnest captures are five idea Specs: symbol reach, roadmap views, reference projection, structural Mermaid, and runtime overlay. Four explicitly defer for reader demand or an extraction need; runtime overlay still lacks its identity/freshness design. Q12 and Q19 support that distinction.

My recommended next arc is **a bounded Studio design pass before implementation**. Its Pack has zero implementation/reference bindings, seven scoped child Specs, and 19 non-blocking questions; several ask how old UI promises map to the present graph. Settle that mapping, retain the parent’s five reader-task acceptance criterion, and mature the selected child Specs honestly. Q21 and Q23 provide the reason and scope. Resolve the spec-sections verifier gap alongside that work. Keep the four demand-led deferrals deferred until their triggers occur.

## 5. Commands

**23 `sdp q` calls**, all through `pnpm --silent sdp:q`, all with `--json`. Shipped recipes used `$(cat dist/recipes/<NN>-<slug>.js)`; wrappers evaluated that body in an async function and filtered its return.

- **Q1–Q5:** R1 build backlog; R2 drift alarm; R7 readiness divergence; R33 design backlog; R8 warnings.
- **Q6:** R30, `specs: ["spec:consumers.pack-design"]`.
- **Q7:** R31 wrapper → totals, freeze row, rows with supersedes.
- **Q8:** R29, `pack: "pack:design-management-v1"`.
- **Q9:** R3, `spec: "spec:consumers.pack-design"`.
- **Q10:** R4, `files: ["src/reader/reader.ts"]`.
- **Q11:** R32 architecture crossings.
- **Q12:** R20 wrapper → totals, Specs with blocking questions, malformed entries.
- **Q13:** R23, `term: "budget"`.
- **Q14:** R9, `spec: "spec:consumers.spec-studio"`.
- **Q15:** R25, the two task-13 addresses.
- **Q16:** `g.specs().filter(ready && !hasVerifier)` → count, IDs, kind counts.
- **Q17:** R30 rerun → IDs, distance, path types, binding IDs, verifiers, Packs.
- **Q18:** `g.packContext(designManagement).members.filter(hasNextRung)` → next rung and failures.
- **Q19:** `g.specs()` → rung/fact counts, missing verifiers, below-defined design columns; graph metadata keys.
- **Q20:** `g.blastRadius(params.files)` → impacted Packs, at-risk IDs/types, direct binding reasons.
- **Q21:** `g.specContext` for design-maturity and spec-studio → file, narrative, sections, outgoing relations.
- **Q22:** R36, `specs: ["spec:consumers.context-bundle"], budget: 0`.
- **Q23:** R29 Studio wrapper → totals, held members, members waiting for author.
