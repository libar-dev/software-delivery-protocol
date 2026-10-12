# Integration handoff ledger

Checked the merged tree at `5e70b7e`, then applied missing work in the main checkout on `review/spec-refresh`. Repeated handoffs point to the same landed change. Fix-report instructions supersede their original apply-report instructions.

| Source | Handoff | Result |
| --- | --- | --- |
| CARRIER | CAR-03, import source-retention message and assertion | done-by-lane, ENG-CLI |
| CARRIER | CAR-07, reserved keys in the authoring skill | done-by-lane, ONRAMPS-DOCS |
| CARRIER | OQ-31, case-insensitive reserved Gherkin heads with boundaries | done-by-lane, ENG-EXTRACT |
| CARRIER | EXT-12, static reification satisfies markdown-parser | landed-by-you, `src/extract/reify.ts` |
| CARRIER | Feature-adapter self-hosting membership | landed-by-you, after round-trip |
| CARRIER | Frozen carrier fixtures stay unchanged | done-by-lane; integration removes the stale test that required those frozen bytes to equal live carriers |
| CONS-LOOP | LOO-06, recipe 40 exclusion echo and configuration example | done-by-lane, ONRAMPS-RECIPES |
| CONS-LOOP | LOO-06, adapter closed configuration, exclusions, sorted output, barrel traversal | done-by-lane, ENG-EXTRACT |
| CONS-LOOP | LOO-04, intent-panel packScope question and fields | done-by-lane, CONS-STUDIO |
| CONS-LOOP | OQ-06, perspective leaves member content whole | done-by-lane, GLOSSARY |
| CONS-ONRAMP | OQ-59, engine-provenance dependsOn with reason instead of refines | landed-by-you |
| CONS-ONRAMP | ONS-04, reading document realization and verifier anchors | done-by-lane, ONRAMPS-DOCS |
| CONS-ONRAMP | ONS-05, arcHandoff entry address in the session skill | done-by-lane, ONRAMPS-DOCS |
| CONS-ONRAMP | ONS-06, shipped corpus has intent only, no source bindings | done-by-lane, ONRAMPS-DOCS |
| CONS-ONRAMP | ONR-22, collective promise test in the authoring skill | done-by-lane, ONRAMPS-DOCS |
| CONS-ONRAMP | ONS-06, help sentence and smoke regex | done-by-lane, ENG-CLI |
| CONS-ONRAMP | Decision registry shipping allowlist | landed-by-you in packedAssets, following ENG-CLI's fix report; help discovery remains scoped to its index |
| CONS-ONRAMP | ECLI-06, helpNamesOnRamps rule key | done-by-lane, CONS-ONRAMP |
| CONS-ONRAMP | Optional plan-record wording in planning-truths-placement | done-by-lane, DECISIONS fix |
| CONS-ONRAMP | Reading-on-ramp self-hosting membership | landed-by-you, after authoring-on-ramp |
| CONS-ONRAMP | Re-check reading-on-ramp floor and both bindings | done-by-lane; integration confirms ready floor, implementation and enabled verifier |
| CONS-ONRAMP | Optional shipped rule 3 canonicalDiscovery address | declined, the existing whole-Spec discovery dependency is honest; no repair is needed |
| CONS-PROJ | PRJ-05, Design Review rendering-law comment | done-by-lane, ENG-RENDER |
| CONS-PROJ | PRJ-06, index calls itself the Design Review and golden follows | done-by-lane, ENG-RENDER |
| CONS-PROJ | PRJ-08, stated-next-rung copy, tests and checkout golden | done-by-lane, ENG-RENDER |
| CONS-PROJ | R01, question keys and referencing units realized by the renderer set | done-by-lane; integration confirms renderDesignReview calls renderSpecPage, renderSections/renderIntent and renderBindings |
| CONS-PROJ | OQ-39, all-root invalidation in reading and authoring skills | done-by-lane, ONRAMPS-DOCS |
| CONS-PROJ | Publisher invalidation and suite certification in catalog | landed-by-you, explicit all-root sentence; suite-certification explanation was already landed |
| CONS-PROJ | GLO-14, generated design questions in concept 06 | done-by-lane, GLOSSARY dissolved the superseded passages |
| CONS-PROJ | DEC-01, binding-grain and annotation refine the freeze with reasons | done-by-lane, DECISIONS |
| CONS-STUDIO | STU-22, corpus-rules operatorNamed, exitCode and brokenRuleFails keys | landed-by-you, texts unchanged |
| CONS-STUDIO | STU-22, architecture-constraints walk key | landed-by-you, text unchanged |
| CONS-STUDIO | PRJ-20, structural-mermaid reverse question link | landed-by-you; intended additional prose-mention warning |
| CONS-STUDIO | Optional components title | declined, no replacement text or defect was specified |
| CONS-SURFACE | SUR-06, q-command parse-position and whole-sink bindings | done-by-lane, ENG-CLI fix; preserved its more precise parse-position label |
| CONS-SURFACE | SUR-06, evaluation-sink verifier and parameter-suite retarget | done-by-lane, ENG-CLI fix |
| CONS-SURFACE | OQ-42, evaluation-sink delegated ready statement | landed-by-you after recipe 9 and both binding conditions cleared |
| CONS-SURFACE | SUR-06, sink law pointers and console caveat in catalog and skill | done-by-lane, ONRAMPS |
| CONS-SURFACE | SUR-14, law pointers for recipes 9, 25, 31 and 32 | done-by-lane, ONRAMPS-RECIPES |
| CONS-SURFACE | OQ-63, recipe 4 impacted Pack ids | done-by-lane, ONRAMPS-RECIPES |
| CONS-SURFACE | R03, recipe 11 stated next rung and first unmet clause | done-by-lane, ONRAMPS-RECIPES |
| CONS-SURFACE | OQ-63, delivery-task sheet in reading skill | done-by-lane, ONRAMPS-DOCS |
| CONS-SURFACE | OQ-63, reading-on-ramp rule for that sheet | landed-by-you |
| CONS-SURFACE | STU-07, verification-panels coverage dependency and question link | done-by-lane, CONS-STUDIO; its reason reflects the ruled per-slot coverage |
| CONS-SURFACE | Evaluation-sink self-hosting membership | landed-by-you, after answer-shapes |
| CONS-SURFACE | Optional glossary evaluation-sink citation | done-by-lane, GLOSSARY |
| DECISIONS | DEC-01, MD-32 rendering gloss and carrying pointers | landed-by-you; GLOSSARY's conditional fallback removes the unlanded comment-form refinement |
| DECISIONS | DEC-11, MD-42 script/data and script-stripping host boundary | landed-by-you |
| DECISIONS | Optional MD-37 collective realization gloss | landed-by-you |
| DECISIONS | Optional MD-33 paired decision relations gloss | landed-by-you |
| DECISIONS | DEC-21, decision refinement convention in authoring skill | done-by-lane, ONRAMPS-DOCS, in Place what is not settled |
| DECISIONS | DEC-11, Studio component host boundary | done-by-lane, CONS-STUDIO and DECISIONS; the component rule requires script/data and its decidedBy decision owns static-link fallback |
| DECISIONS | DEC-21, no extra parent Design Review decidedBy needed | done-by-lane, the decision refines the Pack-page child and that child names it back |
| ENG-CLI | SUR-06 sink retargeting and readiness integration | bindings done-by-lane in fix report; ready statement landed-by-you |
| ENG-CLI | GLO-27 packedAssets includes registry | landed-by-you; later fix report supersedes the original adopterAssets recommendation |
| ENG-CLI | ECLI-05 catalog says findings are queryable data | done-by-lane, ONRAMPS-RECIPES |
| ENG-CORE | R03 graph-schema title and assertions | done-by-lane, ENG-CORE fix, all use 0.10.0 |
| ENG-CORE | R03 Design Review version and checkout goldens | done-by-lane, ENG-RENDER; test reads schemaVersion and versioned goldens are 0.10.0 |
| ENG-CORE | EXT-06 declared-version bound point and registrar | done-by-lane, EXTRACTION |
| ENG-CORE | EXT-16 delivery-facts names test namespace | done-by-lane, EXTRACTION |
| ENG-CORE | ECORE-10 authoring-grammar recipe satisfies targets | done-by-lane, ONRAMPS-RECIPES |
| ENG-CORE fix | Pack-order bound point version replacement | declined as obsolete; EXTRACTION removed that point's version slot and suite assertion, keeping its member-order concern |
| ENG-CORE fix | Prose-schema audit version and dissolved concept pins | landed-by-you; current carrying-Spec needles also follow refreshed wording |
| ENG-EXTRACT | EEXT-02 reserved Gherkin tag-head law | done-by-lane, CARRIER |
| ENG-EXTRACT | MOD-25 target-only relation object equivalence | done-by-lane, MODEL |
| ENG-EXTRACT | EXT-01 relation-location law | done-by-lane, EXTRACTION fix |
| ENG-EXTRACT | EXT-05 explicit exclusion refusal law | done-by-lane, EXTRACTION |
| ENG-EXTRACT | LOO-06 curation-assist exclusion contract | done-by-lane, CONS-LOOP |
| ENG-EXTRACT | LOO-06 recipe 40 input echo, incomplete coverage and tests | done-by-lane, ONRAMPS-RECIPES |
| ENG-RENDER | BlastRadius structural roster uses impl:protocol.reader | declined here, PINS owns structural-edges.ts; preserved in lane-pins.md |
| ENG-RENDER | Unique membership pairs for shared reader roster identity | declined here, PINS owns structural-edges.ts; preserved in lane-pins.md |
| ENG-RENDER | Anchor row additions/removals and combined totals | declined here, PINS owns anchors.ts; integration supplies current totals and delta |
| ENG-RENDER | R03 schema declaration | done-by-lane, ENG-CORE |
| ENG-RENDER | R04 design-maturity ready and implementation binding | done-by-lane, MODEL and ENG-RENDER; integration adds the existing design-column suite's verifier target |
| EXTRACTION | EXT-12 TypeScript refusal laws on markdown-parser | done-by-lane, CARRIER |
| EXTRACTION | EXT-01 model rule-key/question-field location dependencies | done-by-lane, MODEL |
| EXTRACTION | EXT-01 full location-table wording in glossary and reading skill | done-by-lane, GLOSSARY and ONRAMPS-DOCS |
| EXTRACTION | R03 schema and full EntryLocation doc comment | done-by-lane, ENG-CORE |
| EXTRACTION | EXT-05 exclusion code fix | done-by-lane, ENG-EXTRACT |
| EXTRACTION | EXT-01 relation rows in Markdown and TypeScript tests | done-by-lane, ENG-EXTRACT |
| EXTRACTION | EXT-01 Feature relation-tag rows | landed-by-you, gherkin.ts and regression test |
| EXTRACTION | EXT-01 Scenario tag heads and distinct target lines | landed-by-you, metadata retains each relation's tag line |
| EXTRACTION | EXT-01 defaulted Gherkin relations at Scenario line | landed-by-you; reads the ruled identity-line phrase as the Scenario keyword line, as the fix report requests |
| EXTRACTION | EXT-19 canonicalDiscovery law address | done-by-lane, address exists and resolves |
| GLOSSARY | GLO-27 registry in adopterAssets | landed-by-you in packedAssets instead, following ENG-CLI's later fix handoff |
| GLOSSARY | Retire dissolved concept/version pins in prose-schema audit | landed-by-you |
| GLOSSARY | Retire or rebaseline unwired carrier-truth audit | landed-by-you, retired; no callers, git retains it |
| GLOSSARY | Validator comment drops stale concept 07 pointer | done-by-lane, ENG-CORE uses carrying Specs |
| GLOSSARY | AGENTS concept 06/07 pointer describes surviving material | landed-by-you |
| GLOSSARY | AGENTS drops old concept 07 roadmap pointer | landed-by-you |
| GLOSSARY | Sink capture resolves glossary citation | done-by-lane, CONS-SURFACE; integration confirms resolution |
| GLOSSARY | MD-32 expects three annotation decisions to refine freeze | declined for comment form, which adds no rendering; registry trimmed to actual refinements |
| GLOSSARY | Optional architecture curation-input sentence | done-by-lane, ONRAMPS-DOCS |
| GLOSSARY | GLO-24 rule/question key uniqueness Spec text | landed-by-you, follows R02 instead of its suggested drafting-slip alternative |
| GLOSSARY | GLO-24 cross-key refusal and Markdown/TypeScript tests | landed-by-you; disabling refusal makes both corrected regression cases fail |
| GLOSSARY | GLO-15 Protocol builder binding includes anchors module | landed-by-you |
| MODEL | Delete protocol-domain member/modelRefs; self-hosting points at core-model | done-by-lane, PROTO-PACKS |
| MODEL | Readiness-floor points at core-model | done-by-lane, VALIDATION |
| MODEL | Pack-design satisfies design-maturity | done-by-lane, ENG-RENDER |
| MODEL | Architectural unit glossary keeps unit-level uses optional | done-by-lane, GLOSSARY |
| ONRAMPS-DOCS | ONR-01 authoring recipe implementation/verifier anchor insertion | landed-by-you after register pair; address-and-cycle pair moved beside its suite |
| ONRAMPS-DOCS | GLO-32 recipe tests drop catalog-size assertions | done-by-lane, ONRAMPS-RECIPES |
| ONRAMPS-DOCS | Location-table glossary includes relation targets | done-by-lane, GLOSSARY |
| ONRAMPS-DOCS fix | Resolve arcHandoff and buildInvalidates through recipe 25 | done-by-lane, target keys landed; integration query resolves both |
| ONRAMPS-DOCS fix | Check sink id separately from recipe 25 | done-by-lane, sink carrier landed; integration specContext resolves it |
| ONRAMPS-RECIPES | ONR-01 remove old skills anchors and insert recipe anchors | removal done-by-lane, ONRAMPS-DOCS; insertion landed-by-you |
| ONRAMPS-RECIPES | R03 schema minimum | done-by-lane, ENG-CORE |
| ONRAMPS-RECIPES | LOO-06 import adapter exclusion output | done-by-lane, ENG-EXTRACT |
| ONRAMPS-RECIPES | GLO-27 package files ships decision registry | done-by-lane, GLOSSARY |
| ONRAMPS-RECIPES fix | Remove extractFixture schema override, keep explicit historical inputs | landed-by-you, iteration-recipes.test.ts |
| PROTO-PACKS | Feature-adapter after round-trip | landed-by-you |
| PROTO-PACKS | Evaluation-sink after answer-shapes | landed-by-you |
| PROTO-PACKS | Reading-on-ramp after authoring-on-ramp | landed-by-you |
| PROTO-PACKS | PRO-06 recipe implementation anchors are outside reader component, keep role | done-by-lane, ONRAMPS-RECIPES |
| PROTO-PACKS | PRO-07 authoring skill architecture convention | done-by-lane, ONRAMPS-DOCS |
| PROTO-PACKS | PRO-09 run-result question fields | done-by-lane, CONS-STUDIO |
| PROTO-PACKS | PINS roster and Pack updates | declined here, PINS owns pins; preserved in lane-pins.md |
| VALIDATION | R01 diagnostic summary realizing anchor | landed-by-you, impl:protocol.validate-summary |
| VALIDATION | VAL-17 contract-kind comment | landed-by-you |
| VALIDATION | Optional decision-readiness-posture test-comment pointer | landed-by-you |
| VALIDATION | VAL-10 duplicate-id anchor and VAL-11 registry header | done-by-lane, ENG-CORE |
| VALIDATION | ERND-06 next-rung-floor reader binding | done-by-lane, ENG-RENDER |
| VALIDATION | MOD-22 exercisesValidator and structuralValidator entries | done-by-lane, MODEL |
| VALIDATION | Readiness-floor deletion leaves no protocol-domain target | done-by-lane, VALIDATION and MODEL; graph validates |

The other fix reports change no handoff. Their PINS supplements are preserved in lane-pins.md.
