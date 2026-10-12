# Answer key, derived at 0ab4e3d before the re-run

The same brief and thirteen tasks as the first trial (`../agent-surface-trial/`), with only the
branch line changed. Answers re-derived from the graph after plan 43's lanes merged and the gate
went green. Score each task: 2 correct and complete, 1 partly right or missing a part, 0 wrong or not
found. Also note which recipe or body found it and whether the agent stayed inside the rules.

1. Recipe 1: total 0 ready-unbuilt (66 ready examples and 41 ready decisions excluded, none
   without a verifier). Recipe 33, the design backlog, lists the 19 Specs stated `defined` with no
   implementation, excluding examples and decisions: example-space-coverage, edit-model,
   impact-graph, intent-composition, spec-studio, spec-studio.intent-panel, spec-studio.sharing,
   contract-declarations, design-maturity, planned-architecture, protocol-domain,
   structural-patterns, run-evidence, protocol.self-hosting, structural-self-binding,
   architecture-constraints, corpus-rules, superseded-decision-signal, validator-self-testing.
   Credit using recipe 33 instead of a hand-written body.
2. Recipe 2: drift alarm empty. Recipe 7: empty. No Spec states above its floor.
3. Recipe 30 with `params.specs`: 9 Specs (pack-design at distance 0; design-recipes,
   design-review.pack-design-page, review-perspectives, decisions.pack-design-page, design-maturity
   at 1; answer-shapes, example-space-coverage, context-bundle at 2); 8 dependents; 10 units.
4. Recipe 31: `refinedBy` of the freeze = authored-entry-order, pack-design-page,
   question-key-rendering, each with a `reasons` entry saying what it carves out. No `supersedes`
   edge (superseded: 0). Shapes: census-page, design-review, gherkin-view, mermaid-view,
   spec-studio, structural-mermaid. The probe from the first trial is gone: the fields are named
   after the relation, and the four other decision refinements carry reasons that say they bound,
   admit, extend or fix rather than narrow.
5. Recipe 8: 0 errors, 4 warnings: honesty/gaps on spec:model.spec-sections only; three prose
   mentions (delivery-session-on-ramp to shipped-projections-frozen, carrier-ruling to
   carrier-universality, planning-truths-placement to impact-graph.symbol-reach). `exemptions`
   names `decision`, exempting 41 ready Specs.
6. spec:consumers.context-bundle, rule at line 31 (recipe 23 finds it with its line): the recipe
   returns a budget-exceeded result as data, no partial bundle, with the requested scope, the
   budget and the minimum the protected content needs in the same unit (UTF-16 code units of the
   compact `JSON.stringify`); `sdp q` exits 0.
7. Recipe 29 on pack:design-management-v1: 24 members, heldBelowNextRung 2 (reference-projection
   and structural-mermaid, idea to scoped, kind-evidence-present), waitingForAuthor 7
   (example-space-coverage, design-maturity, planned-architecture, superseded-decision-signal,
   architecture-constraints, corpus-rules, run-evidence). The default answer is a summary.
8. impl:protocol.pack-design, src/reader/reader.ts line 544, role reader, component
   component:protocol.reader, layer application, context protocol. Verifier
   test:protocol.pack-design, test/pack-design.test.ts line 18, enabled.
9. Recipe 4 on src/reader/reader.ts: 6 impacted (agent-surface, answer-shapes, pack-design,
   reader, contract-declarations, entry-locations); at-risk Specs 29 (19 incoming, 13 outgoing,
   some both), 14 other nodes; no coverage-unknown file; no unlinked unit. The default answer is a
   summary.
10. Recipe 32: 40 uses edges, 0 context crossings, 31 layer crossings (edge to application 6,
    edge to domain 7, application to domain 15, adapter to application 3), 9 same-layer edges.
    None outward.
11. Recipe 20: 5 blocking; 4 deferrals by their `trigger` field (impact-graph.symbol-reach,
    projections-model.roadmap-views, reference-projection, structural-mermaid) and 1 hold
    (runtime-overlay#observationIdentity).
12. Recipe 9 on spec:consumers.spec-studio: stated defined, floor ready; `aboveStated` is ready
    with no failing clause, so it waits only for its author's statement; a human edit.
13. Recipe 25: buildStamp resolves, specs/consumers/spec-studio.sharing.sdp.md line 24, value
    opens "`stamp.json` beside the page set". designedRung does not resolve: reason `section`
    (spec:model.design-maturity has no open questions left), `available: []`.
