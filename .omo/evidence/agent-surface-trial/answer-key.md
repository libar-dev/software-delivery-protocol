# Answer key, derived at bc2c84e before the trials (graph content identical to ca95171)

Score each task: 2 correct and complete, 1 partly right or missing a part, 0 wrong or not found.
Also note: which recipe or body found it, and whether the agent stayed inside the rules.

1. Recipe 1: total 0 ready-unbuilt (66 ready examples and 40 ready decisions excluded, none
   without verifier). Defined, non-example, non-decision, not implemented: 24 Specs, including
   the captures (design-maturity, planned-architecture, open-question-fields, rule-keys,
   relation-reasons, example-space-coverage, context-bundle, design-diff, proposal,
   review-perspectives, superseded-decision-signal, architecture-constraints, corpus-rules,
   run-evidence), Studio (spec-studio, intent-panel, sharing), and older ones (edit-model,
   contract-declarations, protocol-domain, structural-patterns, protocol.self-hosting,
   structural-self-binding, validator-self-testing). Needs a hand-written body; no recipe gives it.
2. Recipe 2: drift alarm empty. Recipe 7: no divergence (empty). No Spec states above its floor.
3. Recipe 30 with params.specs: 8 Specs (pack-design at distance 0; design-recipes,
   pack-design-page Spec, review-perspectives, decisions.pack-design-page, design-maturity at 1;
   example-space-coverage, context-bundle at 2); 7 dependents; 4 units; rows carry
   implementedBy, referencedBy, enabledVerifiers, packs.
4. Recipe 31: narrowedBy = authored-entry-order, pack-design-page, question-key-rendering. No
   supersedes edge exists in the corpus (superseded: 0). Shapes: census-page, design-review,
   gherkin-view, mermaid-view, spec-studio, structural-mermaid. Probe: four older
   decision-to-decision refines now read as narrows (carrier-universality, gherkin-carrier-option,
   pack-markdown-carrier, sdp-gherkin-extension); credit noticing it.
5. Warnings (report binding or recipe 8): honesty/gaps on spec:model.spec-sections only; three
   prose mentions (delivery-session-on-ramp to shipped-projections-frozen, carrier-ruling to
   carrier-universality, planning-truths-placement to impact-graph). 0 errors.
6. Recipe 6 (term "budget") or 23 finds spec:consumers.context-bundle. Rule: the recipe returns a
   budget-exceeded result as data, no partial bundle, with requested scope, budget and minimum
   count needed in the same unit (UTF-16 code units of compact JSON.stringify); sdp q exits 0.
7. Recipe 29: totals heldBelowNextRung 3, waitingForAuthor 13. Held:
   intent-composition.proposal (defined to ready, typed-dependency-targets-are-defined, target
   refines spec:consumers.intent-composition at idea); reference-projection and
   structural-mermaid (idea to scoped, kind-evidence-present). Waiting (13): example-space-coverage,
   design-maturity, planned-architecture, open-question-fields, rule-keys, relation-reasons,
   review-perspectives, context-bundle, design-diff, superseded-decision-signal,
   architecture-constraints, corpus-rules, run-evidence.
8. impl:protocol.pack-design, src/reader/reader.ts line 532, role reader, component
   component:protocol.reader, layer application, context protocol. Verifier test:protocol.pack-design,
   test/pack-design.test.ts line 18, enabled.
9. Recipe 4 / blastRadius(["src/reader/reader.ts"]): impacted 5 (agent-surface, pack-design,
   reader, contract-declarations, entry-locations); at-risk 29; unlinked none; coverage-unknown none.
10. Recipe 32: 40 uses edges, 0 context crossings, 31 layer crossings: edge to application 6,
    edge to domain 7, application to domain 15, adapter to application 3. None outward.
11. Recipe 20: 6 blocking. Triggers: reference-projection#namedOutsideReader,
    structural-mermaid#namedStructuralReader, projections-model.roadmap-views#namedRoadmapReader.
    Design holds: impact-graph#symbolIdentity, enrichment-lifecycle#detailAfterImplementation,
    runtime-overlay#observationIdentity.
12. Recipe 9: stated defined, floor defined; next rung ready fails
    typed-dependency-targets-are-defined: decidedBy spec:decisions.studio-web-components at scoped.
    The decision must state defined (and the owner states ready on the Studio Spec); a human edit.
13. Recipe 25: buildStamp resolves, file specs/consumers/spec-studio.sharing.sdp.md line 24, value
    starts "`stamp.json` beside the page set...". designedRung does not resolve, reason "entry":
    the Spec exists but no question carries that key (answered and removed in the fold). Credit
    for noticing the reason code is terse.
