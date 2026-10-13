# Review 26. A whole-corpus refresh

> A session artifact, not a canonical doc. Its durable findings are folded into the Specs, the
> engine and the docs on the branch `review/spec-refresh` (plan 44); keep reading those for current
> truth. Measured at `46f0280`, the merge of PR 31. Re-run the recipes rather than inheriting a number.

## What was read

Every Spec in `specs/` (258 at the base), the engine under `src/`, the tests, the recipe catalog,
the three skills, `CONTEXT.md`, the concept docs and the decision registry. The corpus was split
into thirteen units: the eight Spec families (the consumers family in four parts), the unbuilt
surfaces (the Spec Studio and the Obsidian vault), the on-ramps and skills, the decisions, the
protocol and observation Specs with the Pack manifests and the engine's own anchors, the
vocabulary and concept docs, and the candidates for the next chunk of work.

Each unit was read twice, under two lenses:

- **Fidelity** (gpt-6-sol, xhigh): each rule, Design entry, contract entry and Model term against
  the code that realizes it and the tests that verify it.
- **Quality** (Opus 5.5, xhigh): each Spec against the other Specs, the vocabulary, the decisions
  and an outside reader; stale text, contradictions, readiness honesty, prose.

Every findings file was then verified by the other model family (Opus 5.5 for gpt-6-sol's,
gpt-6.1-sol for Opus's), each finding confirmed, adjusted or refuted on its own evidence. One
Opus 5.5 pass deduplicated the verified findings into issues and lanes.

## What it found

595 findings were verified. 59 were refuted; 513 held (86 confirmed as written, 412 adjusted, 15
raised by a verifier), and 23 were questions only the owner could settle. They deduplicated into
350 issues: 1 blocker, 91 major, 207 minor, 51 nit.

| Category | Held | What it covered |
| --- | --- | --- |
| stale | 100 | Specs still describing an earlier arc: old recipe behavior, deleted decisions, counts and plan numbers |
| prose | 86 | Unclear, dense or change-record wording |
| missing law | 74 | Behavior the engine enforces that no Spec states (YAML bounds, the English-only Gherkin dialect, the duplicate-ids backstop, stable validator ids) |
| owner question | 66 | Decisions only the owner can make |
| contradiction | 57 | Two homes stating one law differently |
| terminology | 33 | Rejected or unratified terms |
| binding | 28 | Anchors that claim more or less than their code does |
| drift in code | 21 | Code that breaks a promise its Spec makes |
| drift in a Spec | 20 | A Spec that promises what the engine does not do |
| verification | 15 | Verifiers that do not check what their example claims |

## What mattered most

- **A `ready` on-ramp taught superseded law.** `spec:consumers.authoring-on-ramp` still taught one
  realization target per anchor and the constant form only, both overtaken by the comment form and
  plural bindings (MD-36, MD-37). Its skill test passed because it only checked that words appear.
- **Two homes disagreed on joint realization.** The authoring skill read `satisfies` collectively;
  `spec:protocol.structural-self-binding` read it per unit. A strict per-unit reading would have
  moved most of the 32 Specs realized by several units into the build backlog. Ruled as R01.
- **Code that broke its own promises.** Gherkin fact and status lookalikes (`@status.ready`,
  `@implemented.foo`) passed as decoration; a duplicate target could confer `implemented` through
  a later node; anchored verification accepted any anchor namespace; the census and Design Review
  published error findings without the diagnostic label their Specs require; the Gherkin view
  dropped relation reasons silently; `sdp new spec` refused a lawful `.pack.sdp.md` Spec path.
- **Verifiers that did not verify.** The import round-trip test re-ran the emitter instead of
  checking the import result; the Pack parity probe carried no `modelRefs`; the contract-parity
  probe had no ordinary Scenario.
- **Plan 43's grammar never reached the older Specs.** The location table, register recipes,
  catalog, skills and Studio pages left out rule addresses, question fields and relation rows.
- **Unbuilt Specs stated as buildable.** Corpus rules, run evidence and example-space coverage were
  stated `defined` with no Design for their shapes; the Studio's Specs disagreed on page model,
  search and data embedding. Their open questions now carry provisional answers (posture P1).
- **The schema version stood still.** Plan 43 added graph fields at `0.9.0`, so the design diff
  could not tell what a base graph could express.

## Refuted, and worth knowing

- A claimed blocker that an off-claim CodeNode could confer `implemented` was refuted: the
  claim-separation check judges an edge by its own claim and endpoint types, which conferral reads
  exactly; the node's own claim is a separate finding.
- An inferred-claim contradiction between the impact graph and the curation report was refuted:
  neither glossary definition requires a per-edge claim field.

## Rulings

Made by the main thread on the owner's delegation, with advisers, and awaiting the owner's review.
The PR description's second rulings table lists each with its carrying Spec.

| Batch | Adviser | Scope |
| --- | --- | --- |
| R01 | Fable 5.1, gpt-6-astra | Joint realization is collective: the satisfying units together realize every promise; each realizes at least one |
| R02 | Fable 5.1 | The glossary: the one graph narrowed to the sole read model, marker ratified for the bracket prefix, eight terms added, police and provenance narrowed |
| R03 | gpt-6-astra | Engine contracts: schema `0.10.0`, Gherkin reserved heads, the imports exclude list, recipe 11's stated next rung, target-only relation objects accepted, summary-first recipes named |
| R04 | the main thread | The other owner questions, the two postures (questions for later design passes; delete over defer), and the delegated readiness statements |

## Where the findings landed

Eighteen lanes applied the issues, each in its own worktree, each followed by a review from the
other model family and a fix pass. An integration pass landed the cross-lane handoffs, and a PINS
pass re-transcribed the self-hosting oracle from the carriers. A final four-reader review of the
whole branch (engine, law, docs, rulings), cross-verified, found 16 small defects, all fixed; among
them a recipe-40 input guard, an overbroad keyed rule, the `references` definition in three homes,
and three promises of `spec:model.open-question-keys` that no satisfying unit realized.

Plan 44 is the lineage pointer. The graph carries the outcome: the issues are fixed in the Specs,
the engine and the docs; the questions the review raised for unbuilt Specs are keyed open
questions with `decider: owner` and a provisional answer (recipe 20).

## Appendix: delegated rulings as landed

Derived from the branch by the final review's rulings reader and cross-checked, not copied from the
ruling files. Every row awaits the owner's review. `OQ` numbers are the triage's owner questions.

| Ruling | As landed | Carrying Spec or file |
| --- | --- | --- |
| R01 joint realization | `satisfies` is a claim a set of units makes; each unit realizes at least one promise, and the set realizes every promise | `spec:decisions.anchor-binding-grain` (consequence); `spec:protocol.structural-self-binding#rule.decisionReferences`; `.agents/skills/sdp-authoring/SKILL.md` "Choose targets honestly"; `spec:consumers.authoring-on-ramp`; MD-37 gloss |
| OQ-48 (XC-03) restated law | A broader Spec that restates a narrower Spec's law states a definition with a pointer; a unit satisfies it only for promises it alone carries | `spec:decisions.anchor-binding-grain` (consequence) |
| R02 OQ-05 the one graph | Sole read model for current intent and bindings; contract-admitted recipes and views may read separately identified input; validators and shipped projections stay graph-only | `CONTEXT.md` row; `docs/concept/01` P2 |
| R02 OQ-06 perspective | Selects and orders a Pack's members and leaves each member's content whole | `CONTEXT.md` row; `spec:consumers.review-perspectives` narrative |
| R02 OQ-16 marker | Ratified for the bracket prefix; still rejected as a name for the in-code binding | `CONTEXT.md` row and ledger |
| R02 OQ-17 glossary additions | The eight terms entered. The rule-key row differs from R02's prescribed cross-namespace uniqueness: 96886d1 restores "unique among the rule and flow keys" because rule and question addresses have different sections. This is a documented correction awaiting owner review | `CONTEXT.md`; `spec:model.rule-keys#design.duplicateKey` |
| R02 OQ-18 police | Retired only as a description of the Protocol's relation to a project; the guardrail wording stays | `CONTEXT.md` locked usage |
| R02 OQ-19 provenance | The build-origin sense is allowed; the epistemic sense stays `claim` | `CONTEXT.md` ledger |
| R02 OQ-23 design columns | Design is read from the columns and never stated; readiness stays the stated maturity of the intent | `CONTEXT.md` row |
| R02 OQ-24 edge text | A relation owns its reason and a question owns its fields | `spec:decisions.prose-ownership`; `spec:carrier.prose-ownership-rule`; `CONTEXT.md` |
| R03-1 (OQ-04) schema growth | Additive fields, optional ones included, bump the minor version; incompatible changes bump the major; schema `0.10.0` | `spec:extraction.schema-versioning`; `src/graph/schema.ts`; recipes 35 and 38 |
| R03-2 (OQ-57) target-only object | Reads as the plain id; no refusal | `spec:model.relation-reasons#design.envelopeTarget` |
| R03-3 (OQ-44) summary-first | Only recipes 4, 29 and 35 take `detail` and default to summaries | `spec:consumers.agent-surface.answer-shapes` rule 1 and `#design.detailParameter` |
| R03-4 (OQ-36) imports exclusions | Optional root-relative `exclude`, unknown keys refused, exclusions recorded, barrels resolved through excluded files | `spec:consumers.impact-graph.curation-assist`; `src/adapters/typescript-imports.ts`; recipe 40 |
| R03-5 (OQ-31) Gherkin reserved heads | Nine heads refused, matched case-insensitively at a boundary; `@wip` stays decoration | `spec:carrier.gherkin-authoring`; `src/extract/gherkin.ts` |
| R03-6 (OQ-43) lower ladder | Reports the stated next rung and its first unmet clause | `spec:consumers.agent-surface.authoring-recipes` rule 3; recipe 11 |
| OQ-01 (DEC-01) freeze narrowing | Binding-grain and architectural-annotation refine the freeze with reasons; the comment-form part was declined, because the comment form adds no rendering; this correction awaits the owner's review | `spec:decisions.anchor-binding-grain`; `spec:decisions.architectural-annotation`; MD-32 row |
| OQ-02 (DEC-11) host boundary | An element works in a page that loads its script and supplies graph data; a script-stripping host gets a static link | `spec:decisions.studio-web-components`; `spec:consumers.spec-studio.components`, title included |
| OQ-03 (DEC-21) decision refines | A decision refines the Spec whose question it settles, and that Spec names it through `decidedBy`; no edge left unpaired | `spec:decisions.planning-truths-placement`; authoring skill |
| OQ-07 (PRO-03) uses grain | `uses` is declared where a dependency is architectural, normally between components | `spec:protocol.structural-self-binding#rule.architecturalUses`; `spec:model.structural-patterns`; `CONTEXT.md` |
| OQ-08 (SUR-21) coverage | Narrowed to slot-value coverage of literal unions; the glossary's witness unchanged | `spec:consumers.agent-surface.example-space-coverage` |
| OQ-09 (VAL-02) check layers | Types, extraction and graph validators; no payload-schema capture | `spec:validation.two-check-families` rule 3 |
| OQ-10 (VAL-12) superseded signal | Parked on `[blocking #keptRecord]` with decider and trigger; stated `scoped` | `spec:validation.superseded-decision-signal` |
| OQ-11 (XC-04) law-only Specs | Stay below `ready` and unbound; no new exclusion kind | `spec:consumers.edit-model`, `intent-composition`, `impact-graph` (unchanged) |
| OQ-12 (CAR-21) .feature adapter | Captured at `idea` with `[blocking #featureAdapter]`; finding ids and `--dry-run` stated | `spec:carrier.sdp-import.feature-adapter`; `spec:carrier.sdp-import` |
| OQ-13 (DEC-13) homed deferrals | MCP and external `doc:` targets stay on their decision Specs | `spec:decisions.planning-truths-placement` |
| OQ-14 (EXT-17) / OQ-29 (VAL-17) | Deferral sentences deleted from ready rules; present-tense rules; no captures | `spec:extraction.schema-versioning`, `regenerability`; `spec:validation.readiness-floor`, `warn-level-signals`, `kind-evidence` |
| OQ-15 (EXT-20) declarations | Statement-shaped questions and stale narrative deleted; "pinned declaration" kept | `spec:extraction.contract-declarations` |
| OQ-20 (GLO-27) shipped citations | `DECISIONS.md` ships; no shipped Spec or CONTEXT cites a concept-doc path | `package.json` `files` |
| OQ-21 (GLO-28) concept docs | 06 and 07 audited; carried and stale paragraphs deleted; 07 keeps the oracle-versus-determinism criterion | `docs/concept/06`, `docs/concept/07` |
| OQ-22 (MOD-28) model rows | `design-maturity` stated `ready` and satisfied by `impl:protocol.pack-design`; `protocol-domain` deleted; `structural-patterns` keeps `defined` | `spec:model.design-maturity`; `src/reader/reader.ts` |
| OQ-25 (ONS-13) plan records | Plans may keep advisory execution and recovery records; numbering and order never become graph structure | `spec:consumers.graph-first-planning`; `spec:decisions.planning-truths-placement` |
| OQ-26 (PRJ-07) Review content | "Design questions" means the authored open questions and the Pack verifier gaps | `spec:consumers.design-review` rule 1 |
| OQ-27 (PRO-04) accepted set | `gherkin-kind-honesty.ts` accepted with a coarse-grain row | `test/self-hosting-oracle/structural-edges.ts` |
| OQ-28 (PRO-05) epic | Epic and structural-self-binding stay `defined`, with no realization binding; the epic gains `test:protocol.self-hosting` | `test/self-hosting-graph.test.ts` |
| OQ-30 (VAL-20) self-testing | `[non-blocking #evidenceAudit]`, decider owner, provisional as ruled | `spec:validation.validator-self-testing` |
| OQ-32 (EXT-01) relation rows | The location table records every authored relation target in all three carriers | `spec:extraction.entry-locations` |
| OQ-33 (EXT-12) TS lossiness | Three TypeScript reification rules moved to the parser Spec; determinism rule 3 deleted | `spec:carrier.markdown-parser` |
| OQ-34 (GLO-32) catalog size | No catalog size in prose; tests stop pinning it | `spec:consumers.agent-surface.register-recipes`; skills; `AGENTS.md`; `README.md`; `test/skills.test.ts` |
| OQ-35 (LOO-01) proposal conduct | The check reports only; the routing and apply law moved to the hand-off Spec | `spec:consumers.intent-composition#rule.changedScope`; `spec:consumers.intent-composition.proposal` |
| OQ-37 (LOO-11) import claim | The file's schema and label give every relationship `inferred` | `spec:consumers.impact-graph.curation-assist` |
| OQ-38 (ONS-04) reading on-ramp | Captured, bound and stated `ready` | `spec:consumers.reading-on-ramp`; `test/skills.test.ts` |
| OQ-39 (PRJ-01) build invalidation | One-root-at-a-time stated; publish-all deferred, no capture | `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` |
| OQ-40 (PRJ-17) fact names | The ban is scoped to Design Review binding labels; the census lists the names as taxonomy | `spec:consumers.binding-language-views` rule 1 |
| OQ-41 (PRO-02) decision references | Units reach decisions through `satisfies` and `decidedBy`, or reference them directly | `spec:protocol.structural-self-binding#rule.decisionReferences` |
| OQ-42 (SUR-06) evaluation sink | Captured as a child of the agent surface, bound to the q-command units, stated `ready` | `spec:consumers.agent-surface.evaluation-sink`; `src/cli/q-command.ts`; `test/cli-q.test.ts` |
| OQ-45, 46, 47 (VAL-01, 10, 11) | Corpus rules pointed to their own Spec; graph duplicate-id backstop rule plus `impl:protocol.duplicate-ids`; `[#stableIds]` added and its question deleted | `spec:validation.two-check-families`; `spec:validation.duplicate-ids` |
| OQ-49 to 53 (CAR-05, 08, 12, 24, 25) | Question fields on `#constraintEntryCount`; envelope bounds and delimiters as law; slot wording plus `#oneLiteralVocabulary`; English-only Gherkin; import refuses relative builders | `spec:carrier.markdown-body-grammar`, `envelope-contract`, `slot-notation`, `gherkin-authoring`, `sdp-import` |
| OQ-54 (EXT-28) runner parent | `example-runner` `dependsOn` executable-contracts with a reason; its refinement removed | `spec:extraction.example-runner` |
| OQ-55, 56, 58 (MOD-12, 23, 26) | spec-sections keeps its scope; `#designColumnsSufficiency` and `#droppedQuestionList` with provisionals | `spec:model.spec-sections`, `design-maturity`, `open-question-fields` |
| OQ-59 (ONS-14) refinements | delivery-session keeps `refines` with a reason; authoring-on-ramp and engine-provenance switch to `dependsOn` | three consumer Specs |
| OQ-60 (PRO-06) document anchors | The four iteration-recipe document anchors (design diff, perspective filter, context bundle, proposal) and the reading on-ramp anchor carry no component and sit in the exceptions | `test/self-hosting-oracle/structural-edges.ts`; `test/iteration-recipes.test.ts` |
| OQ-61, 62 (PRO-13, SUR-13) | Runtime overlay hold gets decider and trigger; a dirty build names the checked-out commit | `spec:observation.runtime-overlay`; `spec:consumers.engine-provenance` rule 1 |
| OQ-63 (SUR-24) Pack ids, task sheet | Recipe 4's summary lists impacted Pack ids; the task-to-recipe sheet sits in the reading skill | `spec:consumers.agent-surface.answer-shapes#design.impactSummary`; `spec:consumers.reading-on-ramp`; `.agents/skills/sdp-agent-surface/SKILL.md` |
| OQ-64, 65, 66 (VAL-07, 21, 22) | Suggestion within edit distance two; evaluator totality rule; `summaryLine` pinned and bound | `spec:validation.referential-integrity`, `readiness-floor`, `diagnostic-rendering` |
| OQ-67, 68 (PRO-07, 22) | One identity per Spec realized at a site, taught in the skill; role values kept | authoring skill; anchors unchanged |
| OQ-69 (XC-01) site pointers | Site-only "realizing entrypoint" rules deleted; the two table-source laws kept | the family Specs |
| Group E (DEC-09) | MD-41 wording: no table count, "never committed", the Studio beside the Markdown Review | `spec:decisions.studio-html-surface` |
| Group E examples | 34 bound examples stated `ready` | table (b) |
| Accepted-set additions | Rows for `structural-anchors`, `duplicate-ids`, `adopter-help`, `sdp-import-scan`, `sdp-import-publish`, `validate-summary` and `gherkin-kind-honesty` (owner-reviewed declaration) | `test/self-hosting-oracle/structural-edges.ts` |
| Integration corrections | `test:protocol.pack-design` also verifies `design-maturity`; the unused `check-carrier-truth.mjs` was retired on the GLOSSARY handoff; the live-byte fixture-sync test was removed because the carrier twins are a frozen snapshot. Both dispositions are recorded | `test/pack-design.test.ts`; 2890f47 |
