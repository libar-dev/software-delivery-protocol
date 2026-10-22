# Annotation review: a map of the engine

This design proposes a curated set of responsibilities a contributor needs to understand before changing the engine. Source anchors stay unchanged. The proposal keeps the existing component boundaries, adds missing shared contracts and policy stages, consolidates duplicate identities, and makes roles describe the work each unit does.

The source and graph read are the lane base `44e62ef7b036ff3d1ce86d968ddf81ca735ebc75`. The platform evidence reads the read-only copy of `sdp/design-at-scale` at `b038bd4`. Measurements below are re-derived observations at that base, not targets. Re-run the commands under Reproduction before accepting an anchor edit.

The law is the significance criterion in `spec:model.structural-patterns`, the keyed rules of `spec:protocol.structural-self-binding`, and the comment-form, binding-grain and architectural-annotation decisions. Proposed rules live in `spec:protocol.significant-units-review`; role meanings live in `spec:protocol.role-vocabulary`. Both state `defined`, and neither has an implementation binding. The owner still reviews the replacement accepted set.

## What the review found

1. Several shared boundaries were bare: the CLI argument and parameter codecs, carrier-stage result types, YAML policy, import-fidelity check, diagram contract, HTML codec, recipe answer shapes, optional Studio inputs and browser proposal schema. A page catalog that actually selects pages also needs an identity. These are named below because changing them affects cooperating providers and callers.
2. Some identities name the same responsibility once per Spec. The proposed merges use plural targets and retain their current realization claims. A registration function that defines empty custom elements loses its own identity; the existing component entry already calls it and satisfies the same component contract.
3. Component uses misses real notation dependencies, while `projections → extract` has no backing import. Builder-only imports explain the remaining apparent omissions. Imports are evidence for these choices, never the source of the accepted set.
4. The role taxonomy separates presentation as `projection`, encoding as `codec`, filesystem publication as `publisher`, browser controls as `interaction` and disposable graph indexes as `read-model`. The last two are proposed corpus role values, not new Protocol concepts. `renderer` is a synonym of projection here; `utility` needs a responsibility review.

## Re-measured baseline

| Observation | Protocol | Platform |
| --- | ---: | ---: |
| Code units | 219 | 76 |
| With role | 176 | 37 |
| Distinct role values | 12 | 11 |
| Components | 14 | 12 |
| Satisfies edges | 297 | 30 |
| References edges | 31 | 49 |
| Membership edges | 167 | 40 |
| Uses edges | 48 | 36 |

Protocol recipe 40 reads all source files through the TypeScript adapter: 156 files, 819 file-import pairs, 36 files without an anchor, 11 component import pairs without uses, and one uses without an import. Its 77 anchored-only files are outside the selected `src` roots, mostly test and document realizations; these are input scope, not missing product membership. Its 36 files outside components are exactly the bare source files listed below.

The platform import input selects `src`, `harness`, `example` and `fixture`, with the generated Convex directories explicitly excluded. It reads 140 files and 749 file-import pairs. It lists 67 bare files, 10 uses edges without component-mapped imports, two import pairs without uses, 102 anchored-only files and 91 files outside components. These are not coverage goals. A broader diagnostic pass including tests and generated declarations inflated the ranking; it was rejected as the guidance example because generated files outranked the authored architecture.

Recipes 12, 13, 15, 17, 27, 28, 32, 40 and 43 were run on the Protocol. Recipe 27 explicitly read `pack:roadmaps-and-slices-v1`, whose capture Specs have no implementation or reference binding. Recipes 17, 28, 40 and 43 were run on the platform. Recipe 43 reports no component designs on either corpus; that means no design follows the convention, not no planned architecture exists.

## The component map and existing code-anchor dispositions

Every CodeNode appears once below, including the realization declarations outside `src`. A kept identity may cover several declarations in its one file. A file locator identifies where to read; the graph still records no symbol identity. Roles after an arrow are proposed. A keep with a relocation changes the binding site, not its identity or targets.

### model: the authored contracts and stable ids

Start with Spec, Pack, sections, relations and the closed anchor envelope. Descriptors and branded ids are shared currencies. The dependency-free anchors export is a real public boundary; the tiny codeAnchor copying function needs no separate identity.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.model` | `src/model/anchors.ts` | not stated → contract | re-role. The model seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.anchor-model` | `src/model/anchors.ts` | contract | keep. binding-only anchor model builders. |
| `impl:protocol.anchors-subpath` | `src/anchors.ts` | contract | keep. The dependency-free package boundary lets constrained runtimes author bindings without loading the engine. |
| `impl:protocol.pack-aggregate` | `src/model/pack.ts` | contract | keep. Pack aggregate and model references. |
| `impl:protocol.spec-descriptors` | `src/model/descriptors.ts` | contract | keep. Spec kind, altitude, and readiness coordinates. |
| `impl:protocol.spec-primitive` | `src/model/spec.ts` | contract | keep. Spec envelope and enrich-in-place shape. |
| `impl:protocol.spec-relations` | `src/model/relations.ts` | contract | keep. declared Spec relation builders. |
| `impl:protocol.spec-sections` | `src/model/sections.ts` | contract | keep. typed Spec section shapes. |
| `impl:protocol.stable-ids` | `src/ids.ts` | codec | keep. stable ID grammar parser. |

### graph: the one graph and its semantic decisions

The versioned GraphSchema contract includes nodes, edge claims, locations and citations. Delivery facts, oracle eligibility and parent-vocabulary compatibility are independent semantic decisions. Entry-address resolution is a query over authored content.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.graph` | `src/graph/schema.ts` | not stated → contract | re-role. The graph seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.delivery-facts` | `src/graph/delivery-facts.ts` | decider | keep. computes delivery facts from resolving binding edges. |
| `impl:protocol.entry-address-resolution` | `src/graph/entry-address.ts` | utility → reader | re-role. resolves entry addresses for prose validation and citation readers. |
| `impl:protocol.example-space` | `src/graph/example-space.ts` | decider | keep. resolves example-space vocabulary for contracts and floors. |
| `impl:protocol.graph-claims` | `src/graph/schema.ts` | contract | merge. Same-file responsibility moves to impl:protocol.schema-version; its complete target transfer is below. |
| `impl:protocol.graph-edge-types` | `src/graph/schema.ts` | contract | merge. Same-file responsibility moves to impl:protocol.schema-version; its complete target transfer is below. |
| `impl:protocol.oracle-target-eligibility` | `src/graph/oracle-bindings.ts` | decider | keep. resolves oracle targets by example-space ownership across Spec kinds. |
| `impl:protocol.schema-version` | `src/graph/schema.ts` | contract | keep. Broaden the label to the versioned GraphSchema contract, including node, claim, edge and located-evidence shapes; keep the stable id used by stamp. |

### notation: step notation and example-space decoding

SlotGroup and SlotDeclaredType pin the notation grammar. SpaceModel, VocabularyEntry and ExamplePointModel connect authored vocabulary to generated contracts. DecodedExampleSpace is the graph-side answer used by readers and the browser.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.notation` | `src/notation/slots.ts` | not stated → codec | re-role. The notation seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.example-space-decoding` | `src/notation/example-space.ts` | codec | keep. shared example-space interpretation for contracts and reader contexts. |
| `impl:protocol.slot-notation` | `src/notation/slots.ts` | codec | keep. parses slot groups and normalizes a step to its skeleton. |

### extract: the carrier and source pipeline

Read discovery, trusted bindings, CarrierReifier/CarrierReification, ReifiedSpec/ReifiedPack, AnchorEnvelope and its FieldReader port, graph derivation and canonical serialization. Each canonical carrier feeds the same reified boundary. The Markdown result union, content stage, YAML policy and shared Gherkin refusal table are missing identities proposed below.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.extract` | `src/extract/index.ts` | not stated → extractor | re-role. The extract seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.anchor-extraction` | `src/extract/anchors.ts` | extractor | keep. AnchorEnvelope and its field readers apply the same closed contract to constant and comment forms. |
| `impl:protocol.authoring-normalization` | `src/extract/authoring-normalization.ts` | codec | keep. normalizes rule markers and question fields after carrier reification. |
| `impl:protocol.carrier-reification` | `src/extract/carrier.ts` | extractor | keep. CarrierReifier and CarrierReification define the common stage contract across the canonical carriers. |
| `impl:protocol.derive-graph` | `src/extract/derive.ts` | extractor | keep. derives the graph from reified carriers and bindings. |
| `impl:protocol.discover-files` | `src/extract/discover.ts` | extractor | keep. Discovery selects canonical carriers and source candidates with explicit exclusions and deterministic order. |
| `impl:protocol.duplicate-id-exclusion` | `src/extract/index.ts` | validator | keep. excludes duplicated carrier ids from the graph. |
| `impl:protocol.entry-citation-scan` | `src/extract/entry-citations.ts` | extractor | keep. The source scanner emits inferred located citations only for anchored source files. |
| `impl:protocol.entry-locations` | `src/extract/derive.ts` | extractor | keep. The graph builder maps authored entry positions into the separate location table. |
| `impl:protocol.envelope-contract` | `src/extract/markdown.ts → src/extract/markdown-frontmatter.ts` | codec | keep. Move this identity to the actual frontmatter parser; the wrapper currently only forwards its input. |
| `impl:protocol.exclusion-surface` | `src/extract/index.ts` | contract | keep. strict root-relative exclusion input for both extraction surfaces. |
| `impl:protocol.extract` | `src/extract/index.ts` | extractor | keep. extracts authored carriers and bindings into one graph. |
| `impl:protocol.gherkin-authoring` | `src/extract/gherkin.ts` | extractor | keep. reifies Gherkin behavior and example authoring into the one carrier path. |
| `impl:protocol.inline-code-spans` | `src/extract/markdown-inline-code.ts` | codec | keep. scans raw HTML outside matched code spans. |
| `impl:protocol.key-markers` | `src/extract/key-markers.ts` | codec | keep. normalizes step and term markers across the three carriers. |
| `impl:protocol.markdown-authoring` | `src/extract/markdown.ts` | extractor | merge. Same-file responsibility moves to impl:protocol.markdown-parser; its complete target transfer is below. |
| `impl:protocol.markdown-body-grammar` | `src/extract/markdown-body.ts` | codec | keep. The body parser assigns typed owners, rejects unsupported syntax and owns narrative placement; absorb the forwarding prose-ownership identity. |
| `impl:protocol.markdown-pack-authoring` | `src/extract/markdown-pack.ts` | extractor | keep. reifies the Markdown Pack manifest into the one carrier path. |
| `impl:protocol.markdown-parser` | `src/extract/markdown.ts` | extractor | keep. One carrier boundary selects Spec or Pack reification; plural targets retain the authored-carrier and parser contracts. |
| `impl:protocol.open-question-keys` | `src/extract/markdown-body-owner-behavior.ts` | codec | keep. reads an open question's optional key from its Markdown marker and refuses a bad or repeated key. |
| `impl:protocol.open-section-order` | `src/extract/serialize.ts` | codec | keep. Canonical serialization preserves authored open-entry order while sorting the regenerable graph structure. |
| `impl:protocol.pack-member-order` | `src/extract/derive.ts` | extractor | keep. The Pack-node derivation preserves authored manifest order while membership edges stay set-like. |
| `impl:protocol.prose-ownership` | `src/extract/markdown.ts` | codec | merge. The forwarding wrapper gives way to the actual body parser; its complete target transfer is below. |
| `impl:protocol.protocol-bindings` | `src/extract/protocol-bindings.ts` | extractor | keep. The trusted package and relative-module resolution policy decides which calls are authoritative authoring. |
| `impl:protocol.static-reification` | `src/extract/reify.ts` | extractor | keep. ReifiedSpec, ReifiedPack, static-value decoding and trusted-builder resolution form the TypeScript carrier boundary. |

### validate: one finding currency and ordered checks

Finding, ValidationReport and Validator are shared contracts. GraphIndex supplies disposable lookup maps. The kind-evidence table and ordered floor clauses govern both stated and derived readings. The finding-id catalog and validateGraph composition are the check catalog; individual checks keep identities because their guarantees change independently.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.validate` | `src/validate/validators.ts` | not stated → validator | re-role. The validate seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.authored-honesty-delivery-facts` | `src/validate/validators.ts` | validator | keep. checks stated delivery facts equal the one recomputed derivation. |
| `impl:protocol.authored-honesty-shape` | `src/validate/validators.ts` | validator | keep. refuses delivery facts smuggled through authored section carriers. |
| `impl:protocol.claim-separation` | `src/validate/validators.ts` | validator | keep. checks graph claims, descriptors, node shapes, and relation endpoint contracts. |
| `impl:protocol.duplicate-ids` | `src/validate/validators.ts` | validator | keep. rejects duplicate node identities from any graph producer. |
| `impl:protocol.graph-index` | `src/validate/graph-index.ts` | utility → read-model | re-role. GraphIndex is the disposable node and edge lookup model shared by validation and the reader, not a generic utility. |
| `impl:protocol.kind-evidence` | `src/validate/readiness-floor.ts` | contract → decider | re-role. The per-kind evidence table computes what counts as scoped and complete evidence for the same floor evaluator. |
| `impl:protocol.next-rung-floor` | `src/validate/readiness-floor.ts` | validator | keep. The shared evaluator reports exact clause failures for an explicitly requested rung. |
| `impl:protocol.oracle-linkage` | `src/validate/validators.ts` | validator | keep. resolves and de-duplicates expected-outcome oracle bindings. |
| `impl:protocol.orphan-signal` | `src/validate/validators.ts` | validator | keep. surfaces relationless Specs as informative orphan warnings. |
| `impl:protocol.pack-coherence` | `src/validate/validators.ts` | validator | keep. checks Pack membership agreement and uniqueness and model-reference kinds. |
| `impl:protocol.prose-mentions` | `src/validate/validators.ts` | validator | keep. checks that prose mentions resolve and warns once per unbacked Spec pair. |
| `impl:protocol.readiness-floor` | `src/validate/readiness-floor.ts` | validator | keep. The stated-floor check and derived rung use the same ordered clause table. |
| `impl:protocol.referential-integrity` | `src/validate/validators.ts` | validator | keep. checks every graph edge endpoint and Pack model reference resolves. |
| `impl:protocol.rule-exercises` | `src/validate/validators.ts` | validator | keep. checks the keys named by declared verifies relations. |
| `impl:protocol.structural-anchors` | `src/validate/validators.ts` | validator | keep. checks structural anchor validity and disjoint realization and reference targets. |
| `impl:protocol.superseded-decision-signal` | `src/validate/validators.ts` | validator | keep. walks decision replacements to surface stale shaping relations. |
| `impl:protocol.typed-dependency-floor` | `src/validate/readiness-floor.ts` | validator | keep. checks stated readiness across all four typed dependencies. |
| `impl:protocol.unbound-example-posture` | `src/validate/validators.ts` | validator | keep. limits unbound example warnings to stated ready. |
| `impl:protocol.validation-contracts` | `src/validate/contracts.ts` | contract | keep. conformance/honesty family currency and finding shapes. |
| `impl:protocol.validation-families` | `src/validate/validators.ts` | contract | keep. The finding-id catalog and validateGraph composition are the single aggregate validation entry. |
| `impl:protocol.verifier-gap-signal` | `src/validate/validators.ts` | validator | keep. surfaces ready Specs without recomputed verifier bindings as informative gaps. |
| `impl:protocol.verifier-semantics` | `src/validate/readiness-floor.ts` | validator | keep. The readiness binding predicates keep verifier presence distinct from runner execution. |
| `impl:protocol.verifies-linkage` | `src/validate/validators.ts` | validator | keep. resolves declared example verification through enabled test bindings. |

### reader: the typed graph contract and body evaluator

Reader, SpecContext, PackContext, CodeUnitBinding and BlastRadius are the public query contract. Pack design and boundary joins are a distinct responsibility inside it. The body evaluator supplies the five bindings and loads shipped recipe bodies; its parse-position handling belongs to that evaluator. Concept matching is shared with browser search.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `api:protocol.evaluate-body` | `src/reader/evaluate-body.ts` | service | keep. evaluates bodies and shipped recipes over one in-memory reader, graph and report. |
| `component:protocol.reader` | `src/reader/reader.ts` | not stated → reader | re-role. The reader seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.agent-surface` | `src/reader/reader.ts` | reader | merge. Same-file responsibility moves to impl:protocol.reader; its complete target transfer is below. |
| `impl:protocol.entry-citation-reader` | `src/reader/entry-citations.ts` | reader | keep. resolves citations and joins file anchors with direct and example-based test verification. |
| `impl:protocol.pack-design` | `src/reader/reader.ts` | reader | keep. PackMemberDesign and boundary assembly define the design reading shared by recipes and publishers. |
| `impl:protocol.query-answer-shapes` | `src/reader/evaluate-body.ts` | service | merge. Same-file responsibility moves to api:protocol.evaluate-body; its complete target transfer is below. |
| `impl:protocol.reader` | `src/reader/reader.ts` | reader | keep. Reader, SpecContext, PackContext, file reach and their joins are the public query boundary; absorb the second name for its agent entry adapters. |
| `impl:protocol.studio-concept-match` | `src/reader/concept-match.ts` | utility → reader | re-role. The graph and browser share deterministic concept matching and its matched-field contract. |

### codegen: contracts and registrar output

GeneratedContracts separates contract files, registrar siblings and findings. Space and step contracts and runnable registrar rendering are separate output responsibilities in the same generator, consumed by the CLI and testing runtime.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.codegen` | `src/codegen/contracts.ts` | not stated → projection | re-role. The codegen seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.executable-contracts` | `src/codegen/contracts.ts` | projection | keep. derives step and example-space contracts from the graph. |
| `impl:protocol.runnable-modules` | `src/codegen/contracts.ts` | projection | keep. derives and publishes runnable registrar modules from the graph. |

### runner: provider-neutral example execution

ExampleContract and StepBindings pin authored parameters and handler keys. planExample produces a sequence the runtime executes against the caller world. Failure rendering names the authored step; it never writes verdicts back to the graph.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.runner` | `src/runner/index.ts` | not stated → service | re-role. The runner seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.example-runner` | `src/runner/index.ts` | service | keep. ExampleContract, StepBindings and the planned step sequence are the provider-neutral execution boundary. |

### adapters: external runtime and source adapters

Vitest registration implements the runner boundary. The TypeScript imports adapter owns ImportsFile and barrel reach; that output is external inferred input for curation, not anchored architecture. The adapters seam keeps those responsibilities together without making imports into intent.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.adapters` | `src/adapters/vitest.ts` | not stated → adapter | re-role. The adapters seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.example-runner-adapter` | `src/adapters/vitest.ts` | adapter | keep. registers one test per example and owns the fresh world lifecycle. |
| `impl:protocol.typescript-imports` | `src/adapters/typescript-imports.ts` | adapter | keep. TypeScript file imports and barrel reach for external curation input. |

### testing: the generated registrar runtime

RunnableExampleAdapters is the provider port. RunnableExampleWorld records local execution state, and the comparator checks observed, expected and Spec-authored outcomes. This is runtime integration, not an undifferentiated utility.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.testing` | `src/testing/index.ts` | not stated → adapter | re-role. The testing seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.example-testing-helpers` | `src/testing/index.ts` | utility → adapter | re-role. RunnableExampleAdapters and the three-way comparator connect generated registrars to Vitest and oracle semantics. |

### projections: read-only output, layout and owned publication

Design Review, census, Mermaid, Gherkin, Studio and vault rendering consume the graph or reader. StudioData and StudioRecipeAnswers cache build answers; SearchIndex crosses into the browser. DiagramInput and the band/context folding policies feed deterministic SVG layout. Page and register contracts, encoding and the page catalog are proposed additions. VaultState/FileList and synchronization guards own a distinct publication protocol inside this existing component.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.projections` | `src/projections/design-review.ts` | not stated → projection | re-role. The projections seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.binding-language-index-table` | `src/projections/design-review-pages.ts` | renderer → projection | re-role. renders index implementation and verifier bindings as present or none. |
| `impl:protocol.binding-language-pack-table` | `src/projections/design-review-pages.ts` | renderer → projection | re-role. renders Pack member implementation and verifier bindings as present or none. |
| `impl:protocol.binding-language-spec-page` | `src/projections/design-review-context.ts` | renderer → projection | re-role. renders implementation, verifier, oracle, and observation binding language. |
| `impl:protocol.census-page` | `src/projections/census.ts` | projection | keep. renders the derived census and runtime taxonomy projection. |
| `impl:protocol.derived-readiness-banner` | `src/projections/design-review-context.ts` | renderer → projection | re-role. renders stated readiness beside the structural floor and dishonest divergence. |
| `impl:protocol.design-review` | `src/projections/design-review.ts` | projection | keep. renders the contextual Design Review projection. |
| `impl:protocol.diagnostic-rendering-design-review` | `src/projections/design-review-context.ts` | renderer → projection | re-role. renders structured finding locations in the Design Review table. |
| `impl:protocol.gherkin-view` | `src/projections/gherkin-view.ts` | projection | keep. renders a generated Gherkin-shaped READ projection of any Spec. |
| `impl:protocol.mermaid-view` | `src/projections/mermaid.ts` | projection | keep. renders bounded Spec one-hop and Pack membership diagrams. |
| `impl:protocol.pack-design-page` | `src/projections/design-review-pages.ts` | renderer → projection | re-role. renders the Pack page from the Pack design. |
| `impl:protocol.pack-design-sections` | `src/projections/design-review-pack-sections.ts` | renderer → projection | re-role. The Pack design sections own how boundary, next-rung, questions and bindings are presented; use projection consistently. |
| `impl:protocol.projections-model` | `src/projections/design-review.ts` | contract | keep. The DesignReviewPage output shape and projection boundary are shared with the CLI publisher. |
| `impl:protocol.studio-architecture-diagrams` | `src/projections/studio/diagrams/architecture.ts` | projection | keep. Context and layer folding decide which components remain drawn while preserving crossing edges. |
| `impl:protocol.studio-architecture-lens` | `src/projections/studio/pages/architecture-page.ts` | projection | keep. renders recipe component rows and planned designs as architecture and member diagrams. |
| `impl:protocol.studio-code-spans` | `src/projections/studio/pages/code-spans.ts` | codec | keep. The code-span encoder is shared with browser controls and preserves literal code without promoting it to markup. |
| `impl:protocol.studio-data` | `src/projections/studio/data.ts` | projection | keep. StudioData, SearchIndex and createStudioData are the shared build-time data contract and cache for all pages. |
| `impl:protocol.studio-diagrams` | `src/projections/studio/diagrams/svg.ts` | projection | keep. The deterministic SVG layout owns box metrics, band geometry, connectors and the text equivalent; it is presentation, not browser interaction. |
| `impl:protocol.studio-diff` | `src/projections/studio/pages/diff-page.ts` | projection | keep. The design-diff page keeps declared changes and binding changes separate for reviewers. |
| `impl:protocol.studio-evidence-lens` | `src/projections/studio/pages/evidence-page.ts` | projection | keep. names the four evidence sources and what would bring each into the Studio. |
| `impl:protocol.studio-frame` | `src/projections/studio/pages/frame.ts` | projection | keep. The page frame owns navigation, responsive structure and the placement of optional composing controls. |
| `impl:protocol.studio-glossary` | `src/projections/studio/pages/glossary-page.ts` | projection | keep. The glossary page presents authored Model terms with resolvable term-address links. |
| `impl:protocol.studio-index-page` | `src/projections/studio/pages/index-page.ts` | projection | keep. The Pack lens owns the corpus entry and navigation by authored grouping. |
| `impl:protocol.studio-maturity-map` | `src/projections/studio/pages/maturity-map.ts` | projection | keep. places resolved Pack members by their stated rung and floor in authored order. |
| `impl:protocol.studio-owner-queue` | `src/projections/studio/pages/queue-page.ts` | projection | keep. The statement queue presents waiting human statements and questions without conferring readiness. |
| `impl:protocol.studio-pack-export` | `src/projections/studio/pages/export-page.ts` | projection | keep. copies rendered canvas content into one inline-styled document with prefixed element references. |
| `impl:protocol.studio-pack-page` | `src/projections/studio/pages/pack-page.ts` | projection | keep. The Pack page composes its members, maturity reading and shared design answers for a reviewer. |
| `impl:protocol.studio-paths` | `src/projections/studio/paths.ts` | utility → codec | re-role. The reversible id-to-page naming convention is shared by build rendering and browser search. |
| `impl:protocol.studio-publish` | `src/projections/studio/publish.ts` | publisher | keep. copies local assets and replaces the Studio directory through its temporary sibling. |
| `impl:protocol.studio-recipes` | `src/projections/studio/recipes.ts` | projection | keep. StudioRecipeAnswers evaluates shipped query bodies once per build, separating recipe answers from rendering. |
| `impl:protocol.studio-registers` | `src/projections/studio/pages/registers-page.ts` | projection | keep. The register pages present questions, decisions, declarations and backlog from shipped query answers. |
| `impl:protocol.studio-relation-diagrams` | `src/projections/studio/diagrams/bands.ts` | projection | keep. Relation, membership and realization band policies determine the diagram slice before SVG layout. |
| `impl:protocol.studio-run-rows` | `src/projections/studio/pages/run-rows.ts` | projection | keep. renders recipe 45 file rows shared by the runs page and verification panel. |
| `impl:protocol.studio-runs-page` | `src/projections/studio/pages/runs-page.ts` | projection | keep. renders readable CTRF inputs, file results, unjoined records and diagnostics. |
| `impl:protocol.studio-search-page` | `src/projections/studio/pages/search-page.ts` | projection | keep. The search entry publishes the serialized search-index contract consumed by the browser. |
| `impl:protocol.studio-spec-page` | `src/projections/studio/pages/spec-page.ts` | projection | keep. The Spec page composes authored intent, relation evidence and implementation bindings. |
| `impl:protocol.studio-spec-structure` | `src/projections/studio/pages/spec-structure.ts` | projection | keep. renders realization and trace diagrams and the recorded structural neighborhood. |
| `impl:protocol.studio-tests-lens` | `src/projections/studio/pages/tests-page.ts` | projection | keep. renders shared rule and example-space coverage with filters and verifier bindings. |
| `impl:protocol.studio-text` | `src/projections/studio/pages/text.ts` | codec | keep. The text codec resolves checked mentions and preserves inline-code presentation across Studio pages. |
| `impl:protocol.studio-verification-panels` | `src/projections/studio/pages/spec-verification.ts` | projection | keep. renders rule coverage, example cards, constraint targets, verifiers and example-space coverage. |
| `impl:protocol.vault-bases` | `src/projections/vault/bases.ts` | projection | keep. Standing .base views are a public projection contract for how a vault is read. |
| `impl:protocol.vault-notes` | `src/projections/vault/notes.ts` | projection | keep. The note projection owns linked Spec, Pack and code-note content and file-name collision refusal. |
| `impl:protocol.vault-sections` | `src/projections/vault/sections.ts` | projection | keep. The section projection preserves keyed blocks and their entry-address links. |
| `impl:protocol.vault-sync` | `src/projections/vault/sync.ts` | publisher | keep. The vault manifest, guards, hashes and temporary-file recovery are an owned-folder synchronization protocol. |
| `impl:protocol.vault-text` | `src/projections/vault/text.ts` | codec | keep. The encoder owns note-path and entry-link encoding, frontmatter values and prose escaping. |

### studio-elements: optional browser behavior and proposal handoff

The entry registers optional controls. View-box pan/zoom acts on already laid out SVG. Search consumes the serialized index and shared concept matcher. IntentPanel owns storage and partition; its element owns controls and feedback. Proposal/ProposalChange and proposalProblems need a contract identity. Empty element registrations do not need their own identity.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.studio-elements` | `src/studio-elements/index.ts` | not stated → interaction | re-role. The studio-elements seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.studio-compose` | `src/studio-elements/compose.ts` | utility → interaction | re-role. opens a native request dialog beside build-rendered scopes without changing their content. |
| `impl:protocol.studio-copy` | `src/studio-elements/copy.ts` | utility → interaction | re-role. Clipboard control and failure feedback at the browser boundary. |
| `impl:protocol.studio-diagram-element` | `src/studio-elements/diagram.ts` | utility → interaction | re-role. adds view-box pan, zoom and pinch to build-rendered SVG without changing its layout. |
| `impl:protocol.studio-expander` | `src/studio-elements/expander.ts` | utility → interaction | re-role. Fragment navigation and print expansion at the browser boundary. |
| `impl:protocol.studio-filter` | `src/studio-elements/filter.ts` | utility → interaction | re-role. Client filtering of build-rendered rows. |
| `impl:protocol.studio-intent-panel` | `src/studio-elements/intent-panel.ts` | service | keep. IntentPanel owns storage, ordering and partition of user requests into proposal and residual scoped intent. |
| `impl:protocol.studio-intent-panel-element` | `src/studio-elements/intent-panel-element.ts` | utility → interaction | re-role. The browser element owns handoff controls and feedback, while IntentPanel owns request semantics. |
| `impl:protocol.studio-proposal-memo` | `src/studio-elements/memo.ts` | projection | keep. The memo projection presents exact proposal fields with collision-safe fences. |
| `impl:protocol.studio-scenario-editor` | `src/studio-elements/scenario-editor.ts` | utility → interaction | re-role. gathers the edited Given, When and Then as exact text scoped to its subject. |
| `impl:protocol.studio-search-form` | `src/studio-elements/search.ts` | utility → interaction | re-role. Search form, URL and fragment navigation contract. |
| `impl:protocol.studio-search-results` | `src/studio-elements/search-results.ts` | projection | keep. The browser query and result rendering share the search-index wire contract with build-time StudioData. |
| `impl:protocol.studio-stamp` | `src/studio-elements/stamp.ts` | utility → interaction | re-role. Published stamp and source-link resolution in the browser. |
| `impl:protocol.studio-view-elements` | `src/studio-elements/views.ts` | utility | drop. These are empty custom-element registrations; the existing component entry already owns registration and the actual view renderers own content. |

### cli: entry points, shared build and publication

runSdpCli is the public dispatcher. BuildArgs/RulesInput, parameter decoding, BuildOutcome and hooks are its shared ports. runBuild owns extraction, deterministic comparison, confined registrars and output invalidation. Query and corpus-rule evaluation remain separate use cases; the latter needs an identity at its actual runner. Watch sources are injectable ports inside the existing watch responsibility, and publication hooks select replaceable renderers.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.cli` | `src/cli/build-command.ts` | not stated → service | re-role. The cli seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.adopter-help` | `src/cli/help.ts` | service | keep. SDP_HELP_TEXT indexes the shipped skills, recipe catalog, schema, walkthrough, glossary and specs/ by package-relative path. |
| `impl:protocol.agent-surface-cli` | `src/cli/sdp.ts` | service | keep. CLI verb dispatcher and agent-surface front of the package CLI. |
| `impl:protocol.build-artifacts` | `src/cli/build-artifacts.ts` | publisher | keep. The catalog-to-dist publisher and engine commit stamp are package contracts; contributors change these before changing shipped recipes. |
| `impl:protocol.build-imports` | `src/cli/build-command.ts` | publisher | keep. This optional pipeline stage emits explicitly inferred file imports, kept apart from the authored graph. |
| `impl:protocol.build-pipeline-emit` | `src/cli/build-command.ts` | service | keep. The shared build owns extraction, deterministic output comparison, registrar confinement and projection invalidation; merge its duplicate promise labels here. |
| `impl:protocol.build-pipeline-query` | `src/cli/q-command.ts` | service | keep. runQuery reads one body, derives the graph once for the reader, raw graph and report, and prints the return or refuses on stderr. |
| `impl:protocol.census-page-cli` | `src/cli/census-command.ts` | publisher | keep. publishes the census through the explicit `sdp census` surface. |
| `impl:protocol.corpus-rules` | `src/cli/validate-view-command.ts` | service | keep. runs copied rule bodies after Protocol validation and composes the separate corpus report, output and exit. |
| `impl:protocol.diagnostic-rendering-cli` | `src/cli/output.ts` | renderer → codec | re-role. The diagnostic codec turns one finding currency into a located line for terminal users. |
| `impl:protocol.engine-provenance-cli` | `src/cli/sdp.ts` | service | keep. prints sdp version and the commit parsed from the build-info file beside the compiled CLI. |
| `impl:protocol.extraction-determinism` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.generate-command` | `src/cli/generate-command.ts` | publisher | keep. prepares all prior roots before one shared build and publishes with each verb's checks. |
| `impl:protocol.gherkin-view-cli` | `src/cli/gherkin-command.ts` | publisher | keep. publishes the Gherkin view through the explicit `sdp gherkin` surface. |
| `impl:protocol.mermaid-view-cli` | `src/cli/mermaid-command.ts` | publisher | keep. publishes Mermaid through the explicit `sdp mermaid` surface. |
| `impl:protocol.query-params` | `src/cli/q-command.ts` | service | keep. reads --params as JSON data and injects it as the sink's fourth binding, params. |
| `impl:protocol.regenerability` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.sdp-import` | `src/cli/import-command.ts` | service | keep. plans, refuses, and publishes TypeScript-to-Markdown Spec imports. |
| `impl:protocol.sdp-import-publish` | `src/cli/import-publish.ts` | service | keep. The atomic no-overwrite publication stage is a real filesystem boundary, despite its identity-only binding. |
| `impl:protocol.sdp-import-scan` | `src/cli/import-scan.ts` | service | keep. The independent import-source discovery stage canonicalizes paths and reports source omissions. |
| `impl:protocol.spec-scaffolder` | `src/cli/new-spec-command.ts` | service | keep. scaffolds an honest idea-rung Markdown Spec through `sdp new spec`. |
| `impl:protocol.stamp-command` | `src/cli/stamp-command.ts` | publisher | keep. writes the publishing stamp without extraction or rendering. |
| `impl:protocol.studio-base-input` | `src/cli/studio-inputs.ts` | codec | keep. Optional base and run readers check placement and parsing before a publisher invalidates output. |
| `impl:protocol.studio-build-invalidation` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.studio-command` | `src/cli/studio-command.ts` | publisher | keep. validates and renders the Studio with independent byte checks and diagnostic exit codes. |
| `impl:protocol.studio-watch` | `src/cli/studio-command.ts` | service | keep. awaits the plain Studio publication in each coalesced carrier-watch cycle. |
| `impl:protocol.validate-summary` | `src/cli/validate-view-command.ts` | renderer → codec | re-role. The diagnostic codec summarizes errors and warnings without assigning the aggregate one family. |
| `impl:protocol.validate-watch` | `src/cli/validate-watch.ts` | service | keep. watches carrier directories and coalesces events into a pending validation rerun. |
| `impl:protocol.vault-command` | `src/cli/vault-command.ts` | publisher | keep. validates after vault preflight and retains prior notes behind a failed-extraction index. |
| `impl:protocol.vault-watch` | `src/cli/vault-command.ts` | service | keep. reuses the coalescing watcher with source suffixes and a synchronous vault cycle. |
| `impl:protocol.wholesale-view-build-invalidation` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.wholesale-view-rewrite` | `src/cli/validate-view-command.ts` | publisher | keep. publishes each Design Review as one wholesale temporary-directory replacement. |

### import: canonical conversion with a fidelity boundary

ImportResult and the import use case compose static reification, emission and explicit refusals. The Markdown emitter is a codec. Its reparse comparator owns the no-loss check and warrants an identity; record/text accessors remain helpers.

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.import` | `src/import/import.ts` | not stated → service | re-role. The import seam groups its reviewed responsibilities and declares the dependencies below. |
| `impl:protocol.sdp-import-core` | `src/import/import.ts` | service | keep. The import use case reifies a canonical source, emits Markdown and refuses a lossy result. |
| `impl:protocol.sdp-import-markdown-emit` | `src/import/emit-markdown.ts` | codec | keep. The emitter serializes every owned section and calls the fidelity check before returning content. |

### Realizations outside engine membership

These code anchors realize shipped recipes, guidance, corpus declarations and audits through asserting suites. They are retained as explicit exceptions, not fabricated members of the reader or model components. Their file locations describe the realization convention, not the product architecture.

| Identity | File | Role | Disposition and reason |
| --- | --- | --- | --- |
| `impl:protocol.address-and-cycle-recipes` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped address resolution and dependency cycle recipes. It gains no engine component. |
| `impl:protocol.adopter-on-ramp` | `test/skills.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped adopter teaching in the authoring skill. It gains no engine component. |
| `impl:protocol.answer-shape-recipes` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the catalog's compact and detailed answers. It gains no engine component. |
| `impl:protocol.architecture-walk-recipe` | `test/architecture-recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped architecture walk recipe. It gains no engine component. |
| `impl:protocol.authoring-grammar-recipes` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts the authoring grammar's realization in docs/agent-surface/recipes.md. It gains no engine component. |
| `impl:protocol.authoring-on-ramp` | `test/skills.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped graph-first authoring skill document. It gains no engine component. |
| `impl:protocol.authoring-recipes` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped authoring recipe catalog. It gains no engine component. |
| `impl:protocol.capability-adoption-recipe` | `test/upgrade-kit.test.ts` | projection | keep. Retain the document, recipe or audit realization at its asserting suite: realizes capability adoption in the shipped recipe catalog. It gains no engine component. |
| `impl:protocol.context-bundle-recipe` | `test/iteration-recipes.test.ts` | projection | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the context bundle in the shipped recipe catalog. It gains no engine component. |
| `impl:protocol.curation-recipe` | `test/curation-recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts the curation report over external inferred imports. It gains no engine component. |
| `impl:protocol.delivery-session-on-ramp` | `test/skills.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped advisory delivery-session skill document. It gains no engine component. |
| `impl:protocol.design-diff-recipe` | `test/iteration-recipes.test.ts` | projection | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the design diff in the shipped recipe catalog. It gains no engine component. |
| `impl:protocol.design-recipes` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped design recipes. It gains no engine component. |
| `impl:protocol.entry-citation-recipe` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of Entry citations in docs/agent-surface/recipes.md. It gains no engine component. |
| `impl:protocol.entry-location-recipes` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the entry lines the entry search and address resolution recipes return. It gains no engine component. |
| `impl:protocol.example-space-coverage-recipe` | `test/studio-s1.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of shipped recipe 44. It gains no engine component. |
| `impl:protocol.external-registers-recipe` | `test/external-registers.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped external-registers recipe. It gains no engine component. |
| `impl:protocol.graph-first-planning` | `test/skills.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: realizes placement homes and advisory session guidance in the shipped skills. It gains no engine component. |
| `impl:protocol.perspective-filter-recipe` | `test/iteration-recipes.test.ts` | projection | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the perspective filter in the shipped recipe catalog. It gains no engine component. |
| `impl:protocol.planned-components-recipe` | `test/architecture-recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped planned against realized components recipe. It gains no engine component. |
| `impl:protocol.proposal-memo-recipe` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the catalog proposal memo through its verbatim body check. It gains no engine component. |
| `impl:protocol.proposal-schema-and-recipe` | `test/iteration-recipes.test.ts` | contract | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the shipped proposal schema and proposal check in the recipe catalog. It gains no engine component. |
| `impl:protocol.reading-on-ramp` | `test/skills.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped graph-reading skill document. It gains no engine component. |
| `impl:protocol.recipe-parameters-catalog` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the catalog recipes that read their parameter from params. It gains no engine component. |
| `impl:protocol.register-recipes` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped register recipes. It gains no engine component. |
| `impl:protocol.rule-key-proposal-recipe` | `test/upgrade-kit.test.ts` | projection | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the rule-key proposal in the shipped recipe catalog. It gains no engine component. |
| `impl:protocol.run-evidence-recipe` | `test/recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of Run evidence in docs/agent-surface/recipes.md. It gains no engine component. |
| `impl:protocol.self-hosting` | `test/self-hosting-graph.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the self-hosted corpus through the shared extraction and validation path. It gains no engine component. |
| `impl:protocol.shipped-protocol-corpus` | `test/package-smoke.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts the published package ships the Protocol corpus. It gains no engine component. |
| `impl:protocol.slimming-recipe` | `test/curation-recipes.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped slimming-candidates recipe. It gains no engine component. |
| `impl:protocol.statement-queue-recipe` | `test/self-hosting-readiness-planner.test.ts` | projection | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the statement queue in the shipped recipe catalog. It gains no engine component. |
| `impl:protocol.structural-self-binding` | `test/self-hosting-oracle/structural-edges.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the declared significant-unit set and its structural self-binding. It gains no engine component. |
| `impl:protocol.studio-on-ramp` | `test/skills.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped Studio skill document. It gains no engine component. |
| `impl:protocol.studio-preview-workflow` | `test/studio-s4.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts the reusable Studio preview workflow and Protocol CI caller. It gains no engine component. |
| `impl:protocol.upgrade-guide` | `test/upgrade-kit.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: realizes the shipped upgrade guide document. It gains no engine component. |
| `impl:protocol.validator-probe-table` | `test/helpers/validator-probes.ts` | utility → contract | re-role. Retain the document, recipe or audit realization at its asserting suite: The probe catalog is the independent contract for the validator audit, outside product component membership.. It gains no engine component. |
| `impl:protocol.validator-self-testing` | `test/helpers/validator-audit.ts` | utility → validator | re-role. Retain the document, recipe or audit realization at its asserting suite: The validator audit compares independent probes with actual findings; it is a check, not generic test plumbing.. It gains no engine component. |
| `impl:protocol.vault-on-ramp` | `test/skills.test.ts` | not stated | keep. Retain the document, recipe or audit realization at its asserting suite: asserts realization of the shipped vault skill document. It gains no engine component. |

## Missing responsibilities and proposed anchors

Each proposal uses one top-level comment-form anchor at the named file, so it introduces no builder import. Its component membership is explicit. The uses list is empty because the reviewed component pairs below already carry its architectural dependencies. Empty satisfies and references lists mean identity-only, not an invented realization claim. For an existing implemented target, an added satisfying unit joins the current complete set; it does not replace the other satisfying units.

| Proposed identity | File and form | Role and component | Satisfies | References | Uses | Why a contributor needs it |
| --- | --- | --- | --- | --- | --- | --- |
| `impl:protocol.build-args` | `src/cli/build-args.ts`; comment | codec; `component:protocol.cli` | `spec:consumers.command-line` | empty | empty | BuildArgs, RulesInput and parseBuildArgs are the shared argv contract for publishers and rules; the omission changes many command paths. |
| `impl:protocol.parameter-codec` | `src/cli/params.ts`; comment | codec; `component:protocol.cli` | `spec:consumers.agent-surface.recipe-parameters` | empty | empty | The shared JSON, @file and keyed-file parameter decoder owns duplicate-key refusals for queries and rules. |
| `impl:protocol.corpus-rule-runner` | `src/cli/corpus-rules.ts`; comment | service; `component:protocol.cli` | `spec:validation.corpus-rules` | empty | empty | The body runner isolates each selected rule, validates its returned findings and keeps failures apart from Protocol findings. |
| `impl:protocol.markdown-results` | `src/extract/markdown-types.ts`; comment | contract; `component:protocol.extract` | empty | empty | empty | The parser-stage success/refusal union and entry-line payload are the interface frontmatter and body providers share; it needs no invented realization target. |
| `impl:protocol.markdown-yaml-policy` | `src/extract/markdown-yaml-policy.ts`; comment | codec; `component:protocol.extract` | `spec:carrier.envelope-contract`, `spec:carrier.markdown-pack-authoring` | empty | empty | The bounded YAML policy, relation-target forms and scalar refusals are a carrier contract, rather than a mechanical parser helper. |
| `impl:protocol.markdown-content` | `src/extract/markdown-body-content.ts`; comment | codec; `component:protocol.extract` | `spec:carrier.markdown-body-grammar` | empty | empty | The content stage turns located lines into list entries and typed fences; unsupported blocks are refused before owner mapping. |
| `impl:protocol.gherkin-kind-policy` | `src/extract/gherkin-kind-honesty.ts`; comment | decider; `component:protocol.extract` | `spec:carrier.gherkin-authoring`, `spec:carrier.sdp-import` | empty | empty | The kind refusal table is shared by canonical Gherkin reification and import analysis and prevents silent truth-category loss. |
| `impl:protocol.import-fidelity` | `src/import/markdown-fidelity.ts`; comment | validator; `component:protocol.import` | `spec:carrier.sdp-import` | empty | empty | The reparse comparator rejects an emitted Markdown document that changes authored meaning; this is an independent fidelity boundary. |
| `impl:protocol.studio-diagram-model` | `src/projections/studio/diagrams/model.ts`; comment | contract; `component:protocol.projections` | `spec:consumers.spec-studio.diagrams` | empty | empty | DiagramInput, DiagramBox, DiagramEdge, aggregation and draw bounds are the contract the layout and each diagram producer share. |
| `impl:protocol.studio-html` | `src/projections/studio/pages/html.ts`; comment | codec; `component:protocol.projections` | `spec:consumers.spec-studio.shell` | empty | empty | PageContext and the shared escaping, source-location and link encoders form the boundary all Studio pages rely on. |
| `impl:protocol.studio-inputs` | `src/projections/studio/inputs.ts`; comment | contract; `component:protocol.projections` | `spec:consumers.spec-studio.data.inputs` | empty | empty | The named base graph and run input shape is shared with CLI preflight and recipe evaluation. |
| `impl:protocol.studio-proposal-contract` | `src/studio-elements/proposal.ts`; comment | contract; `component:protocol.studio-elements` | `spec:consumers.intent-composition.proposal` | empty | empty | Proposal, ProposalChange and proposalProblems pin the browser handoff shape to the proposal checker and shipped schema. |
| `impl:protocol.design-review-codec` | `src/projections/design-review-markdown.ts`; comment | codec; `component:protocol.projections` | `spec:consumers.design-review` | empty | empty | The shared Markdown path, link and inline-code encoder is the representation contract used by Design Review page and section providers. |
| `impl:protocol.studio-register-contracts` | `src/projections/studio/pages/register-answers.ts`; comment | contract; `component:protocol.projections` | empty | `spec:consumers.spec-studio.data.recipe-answers` | empty | The question, decision, declaration, backlog, queue and diff result shapes are shared between recipe providers and their page renderers. |
| `impl:protocol.studio-page-catalog` | `src/projections/studio/pages/index.ts`; comment | projection; `component:protocol.projections` | `spec:consumers.spec-studio.publisher` | empty | empty | renderStudio owns the page catalog, conditional input pages and Pack exports; its public page-set policy is more than a forwarding barrel. |

The existing `impl:protocol.envelope-contract` moves from `src/extract/markdown.ts` to `src/extract/markdown-frontmatter.ts`, still in extract, still a codec, with the same satisfies target and empty references/uses. This exposes the actual parser rather than adding a second forwarding identity. Its source and graph expectations must move together.

## Merge and drop realization ledger

No false realization claim is removed in this proposal. Each merge retains all the source identity's target promises at the destination and leaves other satisfying units intact. A set-preservation simulation over the graph retains every currently implemented Spec. That checks target bookkeeping; the source review remains the evidence that a surviving responsibility realizes those promises. Source files are never combined into one identity.

| Removed identity | Destination | Satisfies to retain | References to retain | Promise reading |
| --- | --- | --- | --- | --- |
| `impl:protocol.wholesale-view-build-invalidation` | `impl:protocol.build-pipeline-emit` | `spec:consumers.wholesale-view-rewrite` | empty | runBuild still performs this output or determinism promise; the surviving build identity owns that same pipeline. |
| `impl:protocol.studio-build-invalidation` | `impl:protocol.build-pipeline-emit` | `spec:consumers.spec-studio.publisher` | empty | runBuild still performs this output or determinism promise; the surviving build identity owns that same pipeline. |
| `impl:protocol.extraction-determinism` | `impl:protocol.build-pipeline-emit` | `spec:extraction.determinism` | empty | runBuild still performs this output or determinism promise; the surviving build identity owns that same pipeline. |
| `impl:protocol.regenerability` | `impl:protocol.build-pipeline-emit` | `spec:extraction.regenerability` | empty | runBuild still performs this output or determinism promise; the surviving build identity owns that same pipeline. |
| `impl:protocol.agent-surface` | `impl:protocol.reader` | `spec:consumers.agent-surface` | empty | The same file and same pipeline/parser/reader responsibility owns the promises; use the union of the two target sets. |
| `impl:protocol.query-answer-shapes` | `api:protocol.evaluate-body` | `spec:consumers.agent-surface.evaluation-sink` | empty | The same file and same pipeline/parser/reader responsibility owns the promises; use the union of the two target sets. |
| `impl:protocol.markdown-authoring` | `impl:protocol.markdown-parser` | `spec:carrier.markdown-authoring` | empty | The same file and same pipeline/parser/reader responsibility owns the promises; use the union of the two target sets. |
| `impl:protocol.prose-ownership` | `impl:protocol.markdown-body-grammar` | `spec:carrier.prose-ownership-rule` | empty | The current markdown.ts wrapper calls parseMarkdownBody in markdown-body.ts. The target moves to that actual owner-mapping implementation; other carrier realization units stay intact. |
| `impl:protocol.graph-claims` | `impl:protocol.schema-version` | `spec:extraction.claim-taxonomy` | empty | The same schema module owns these graph shapes; broaden the surviving label to the versioned graph schema contract. |
| `impl:protocol.graph-edge-types` | `impl:protocol.schema-version` | `spec:extraction.derive-graph` | `spec:decisions.anchor-binding-grain` | The same schema module owns these graph shapes; broaden the surviving label to the versioned graph schema contract. |
| `impl:protocol.studio-view-elements` | `component:protocol.studio-elements` already satisfies the target | `spec:consumers.spec-studio.components` remains on the existing component entry | No transfer required; the Spec's decision relation and surviving view units retain the shaping design | Keep registerViews and its call. Remove only the empty-registration identity. The component's registration flow still realizes the same promise. |

Every incoming or outgoing structural edge must be retargeted if it names a removed identity. None of the proposed removals currently has a uses endpoint; the retained schema-version identity keeps the stamp dependency. Remove the old membership and anchor expectation rows, union target lists without duplicates, and keep satisfies and references disjoint. A different code change requires a fresh promise pass rather than inheriting this ledger.

## Every component pair with import or uses evidence

This table covers the union of declared cross-component uses and component-mapped import pairs, rather than all possible component combinations. Same-component collaborations remain lawful data and need no new crossing. The imported file pair is a reproducible witness, not a generated architecture verdict. Type-only imports of shared contracts count. Barrel reach is included by the adapter.

| From → to | Existing uses | Import witness | Proposed action and reading |
| --- | --- | --- | --- |
| `component:protocol.adapters → component:protocol.model` | absent | `src/adapters/vitest.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.adapters → component:protocol.runner` | present | `src/adapters/vitest.ts → src/runner/index.ts` | Keep. Vitest binds the public example execution contract. |
| `component:protocol.cli → component:protocol.adapters` | present | `src/cli/build-command.ts → src/adapters/typescript-imports.ts` | Keep. The build calls the optional inferred-import adapter. |
| `component:protocol.cli → component:protocol.codegen` | present | `src/cli/build-command.ts → src/codegen/contracts.ts`; `src/cli/vault-command.ts → src/codegen/contracts.ts` | Keep. CLI orchestration consumes the named codegen provider or shared contract. |
| `component:protocol.cli → component:protocol.extract` | present | `src/cli/build-command.ts → src/extract/index.ts`; `src/cli/build-command.ts → src/extract/protocol-bindings.ts` | Keep. CLI orchestration consumes the named extract provider or shared contract. |
| `component:protocol.cli → component:protocol.graph` | present | `src/cli/build-command.ts → src/graph/schema.ts`; `src/cli/generate-command.ts → src/graph/schema.ts` | Keep. CLI orchestration consumes the named graph provider or shared contract. |
| `component:protocol.cli → component:protocol.import` | present | `src/cli/import-command.ts → src/import/import.ts`; `src/cli/import-scan.ts → src/import/import.ts` | Keep. CLI orchestration consumes the named import provider or shared contract. |
| `component:protocol.cli → component:protocol.model` | present | `src/cli/build-command.ts → src/ids.ts`; `src/cli/census-command.ts → src/ids.ts` | Keep. The scaffolder consumes the kind and descriptor vocabulary beyond anchor authoring. |
| `component:protocol.cli → component:protocol.notation` | absent | `src/cli/build-command.ts → src/notation/example-space.ts`; `src/cli/vault-command.ts → src/notation/example-space.ts` | Declare `component:protocol.cli` uses `component:protocol.notation`. Build and vault preparation decode example spaces to determine generated contracts and owned registrar paths. |
| `component:protocol.cli → component:protocol.projections` | present | `src/cli/census-command.ts → src/projections/census.ts`; `src/cli/generate-command.ts → src/projections/studio/publish.ts` | Keep. CLI orchestration consumes the named projections provider or shared contract. |
| `component:protocol.cli → component:protocol.reader` | present | `src/cli/census-command.ts → src/reader/concept-match.ts`; `src/cli/census-command.ts → src/reader/entry-citations.ts` | Keep. CLI orchestration consumes the named reader provider or shared contract. |
| `component:protocol.cli → component:protocol.validate` | present | `src/cli/build-command.ts → src/validate/contracts.ts`; `src/cli/import-command.ts → src/validate/contracts.ts` | Keep. CLI orchestration consumes the named validate provider or shared contract. |
| `component:protocol.codegen → component:protocol.graph` | present | `src/codegen/contracts.ts → src/graph/example-space.ts`; `src/codegen/contracts.ts → src/graph/schema.ts` | Keep. Contract generation consumes the graph and example eligibility. |
| `component:protocol.codegen → component:protocol.model` | absent | `src/codegen/contracts.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.codegen → component:protocol.notation` | present | `src/codegen/contracts.ts → src/notation/example-space.ts`; `src/codegen/contracts.ts → src/notation/slots.ts` | Keep. Vocabulary, slot types and bound points determine generated signatures. |
| `component:protocol.codegen → component:protocol.validate` | present | `src/codegen/contracts.ts → src/validate/contracts.ts`; `src/codegen/contracts.ts → src/validate/graph-index.ts` | Keep. Generation shares graph indexing and the finding currency. |
| `component:protocol.extract → component:protocol.graph` | present | `src/extract/derive.ts → src/graph/delivery-facts.ts`; `src/extract/derive.ts → src/graph/schema.ts` | Keep. Derivation, serialization and citations emit the graph contract. |
| `component:protocol.extract → component:protocol.model` | present | `src/extract/anchors.ts → src/ids.ts`; `src/extract/anchors.ts → src/model/anchors.ts` | Keep. Carrier and anchor parsing consumes the actual model vocabulary and id parser. |
| `component:protocol.extract → component:protocol.notation` | present | `src/extract/key-markers.ts → src/notation/slots.ts` | Keep. Key normalization uses slot skeletons. |
| `component:protocol.extract → component:protocol.validate` | present | `src/extract/anchors.ts → src/validate/contracts.ts`; `src/extract/anchors.ts → src/validate/validators.ts` | Keep. Reifiers share findings and structural policy checks. |
| `component:protocol.graph → component:protocol.model` | present | `src/graph/delivery-facts.ts → src/ids.ts`; `src/graph/entry-address.ts → src/ids.ts` | Keep. The graph schema and address resolver consume model types and id grammar. |
| `component:protocol.graph → component:protocol.notation` | present | `src/graph/example-space.ts → src/notation/slots.ts` | Keep. Example-vocabulary eligibility consumes parsed slot types. |
| `component:protocol.import → component:protocol.extract` | present | `src/import/emit-markdown.ts → src/extract/reify.ts`; `src/import/import.ts → src/extract/carrier.ts` | Keep. Conversion uses carrier reification and the fidelity reparse boundary. |
| `component:protocol.import → component:protocol.model` | absent | `src/import/emit-markdown.ts → src/ids.ts`; `src/import/import.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.import → component:protocol.notation` | absent | `src/import/emit-markdown.ts → src/notation/slots.ts` | Declare `component:protocol.import` uses `component:protocol.notation`. The Markdown emitter parses structured step slots when emitting fences. |
| `component:protocol.import → component:protocol.validate` | present | `src/import/import.ts → src/validate/contracts.ts` | Keep. Import results share the finding currency. |
| `component:protocol.notation → component:protocol.graph` | absent | `src/notation/example-space.ts → src/graph/schema.ts` | Declare `component:protocol.notation` uses `component:protocol.graph`. The decoder consumes GraphSchema and PrimitiveNode, a type dependency that is architectural. |
| `component:protocol.notation → component:protocol.model` | absent | `src/notation/slots.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.notation → component:protocol.validate` | absent | `src/notation/example-space.ts → src/validate/contracts.ts` | Declare `component:protocol.notation` uses `component:protocol.validate`. The decoder emits Finding values in the one validation currency, a type dependency that is architectural. |
| `component:protocol.projections → component:protocol.extract` | present | No mapped import | Remove this component uses. No source file in the complete projections scope imports extract; the old declaration is stale. |
| `component:protocol.projections → component:protocol.graph` | present | `src/projections/census.ts → src/graph/schema.ts`; `src/projections/mermaid.ts → src/graph/schema.ts` | Keep. Views consume the graph contract. |
| `component:protocol.projections → component:protocol.model` | present | `src/projections/census.ts → src/model/anchors.ts`; `src/projections/census.ts → src/model/descriptors.ts` | Keep. Rungs, layers and section shapes label the views. |
| `component:protocol.projections → component:protocol.notation` | present | `src/projections/vault/sections.ts → src/notation/slots.ts` | Keep. Vault sections render authored step text. |
| `component:protocol.projections → component:protocol.reader` | present | `src/projections/census.ts → src/reader/concept-match.ts`; `src/projections/census.ts → src/reader/entry-citations.ts` | Keep. Page and note providers consume query answers. |
| `component:protocol.projections → component:protocol.validate` | present | `src/projections/census.ts → src/validate/contracts.ts`; `src/projections/design-review-context.ts → src/validate/contracts.ts` | Keep. Views render findings, clauses and checked mention tokens. |
| `component:protocol.reader → component:protocol.graph` | present | `src/reader/entry-citations.ts → src/graph/delivery-facts.ts`; `src/reader/entry-citations.ts → src/graph/entry-address.ts` | Keep. Queries join bindings, resolve addresses and recompute delivery facts. |
| `component:protocol.reader → component:protocol.model` | present | `src/reader/evaluate-body.ts → src/ids.ts`; `src/reader/reader.ts → src/model/anchors.ts` | Keep. Query contracts expose descriptors, sections and structural attributes. |
| `component:protocol.reader → component:protocol.notation` | absent | `src/reader/reader.ts → src/notation/example-space.ts` | Declare `component:protocol.reader` uses `component:protocol.notation`. createReader decodes example spaces for its public SpecContext answers. |
| `component:protocol.reader → component:protocol.validate` | present | `src/reader/entry-citations.ts → src/validate/graph-index.ts`; `src/reader/evaluate-body.ts → src/validate/contracts.ts` | Keep. The reader uses the shared index, validation report and floor evaluator. |
| `component:protocol.runner → component:protocol.model` | absent | `src/runner/index.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.runner → component:protocol.notation` | present | `src/runner/index.ts → src/notation/slots.ts` | Keep. Step labels render bound notation. |
| `component:protocol.studio-elements → component:protocol.projections` | present | `src/studio-elements/compose.ts → src/projections/studio/pages/code-spans.ts`; `src/studio-elements/copy.ts → src/projections/studio/pages/code-spans.ts` | Keep. Browser search and controls share code-span escaping and id-to-page encoding. |
| `component:protocol.studio-elements → component:protocol.reader` | present | `src/studio-elements/search-results.ts → src/reader/concept-match.ts` | Keep. Browser search reuses deterministic concept matching. |
| `component:protocol.testing → component:protocol.adapters` | present | `src/testing/index.ts → src/adapters/vitest.ts` | Keep. The registrar runtime registers execution through Vitest. |
| `component:protocol.testing → component:protocol.model` | absent | `src/testing/index.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.testing → component:protocol.runner` | present | `src/testing/index.ts → src/runner/index.ts` | Keep. The runtime consumes ExampleContract and StepBindings. |
| `component:protocol.validate → component:protocol.graph` | present | `src/validate/contracts.ts → src/graph/schema.ts`; `src/validate/graph-index.ts → src/graph/schema.ts` | Keep. Validators consume graph shapes, facts and binding eligibility. |
| `component:protocol.validate → component:protocol.model` | present | `src/validate/contracts.ts → src/ids.ts`; `src/validate/graph-index.ts → src/ids.ts` | Keep. Checks consume ratified descriptor and section vocabularies. |
| `component:protocol.validate → component:protocol.notation` | present | `src/validate/readiness-floor.ts → src/notation/slots.ts` | Keep. Floor checks use structured-step compatibility. |

The five new component declarations belong on the existing cli, import, notation and reader component anchors. Remove `component:protocol.projections` uses `component:protocol.extract`. Keep all other current uses, including existing unit-level dependencies. New units default to an empty unit uses list; the component declaration carries the dependency once.

Unassigned files were read separately. CLI argument parsing, corpus rules and Studio HTML consume already-declared component pairs. The YAML policy and Markdown result contract also add no new pair. The import fidelity comparator uses extract, which import already declares. No further crossing is hidden by the reviewed bare helpers. Paths and directory names were used to organize this reading, never to create anchored membership.

## The complete source walk

All 156 TypeScript source files were walked through their declarations, imports and owning responsibility; the policy and shared-boundary candidates were then read at their implementations. The list below is the decision for every file with no current anchor. Every other source file is accounted for by the existing-anchor table above. It includes contracts and data shapes inside already-anchored files: their containing responsibility is named in the component map rather than creating an identity per exported type.

| Bare file | Proposal or consuming responsibility | Reason |
| --- | --- | --- |
| `src/model/code-anchor.ts` | leave bare; `impl:protocol.anchor-model` | The public builder is a mechanical shallow copy; anchor-model and anchors-subpath own its envelope and dependency-free export contract. |
| `src/projections/studio/pages/html.ts` | add `impl:protocol.studio-html` | PageContext and the shared escaping, source-location and link encoders form the boundary all Studio pages rely on. |
| `src/cli/build-args.ts` | add `impl:protocol.build-args` | BuildArgs, RulesInput and parseBuildArgs are the shared argv contract for publishers and rules; the omission changes many command paths. |
| `src/extract/markdown-types.ts` | add `impl:protocol.markdown-results` | The parser-stage success/refusal union and entry-line payload are the interface frontmatter and body providers share; it needs no invented realization target. |
| `src/extract/markdown-support.ts` | leave bare; `impl:protocol.markdown-parser` | Finding construction, location calculation and the bounded finding collector are parser mechanics under the carrier refusal contract. |
| `src/projections/owned-prose.ts` | leave bare; `impl:protocol.design-review` | Prose escaping and line splitting are local presentation helpers; they introduce no new authored owner or public contract. |
| `src/studio-elements/dom.ts` | leave bare; `impl:protocol.studio-search-results` | The button and live-output constructors are mechanical DOM helpers shared by the actual interaction owners. |
| `src/cli/artifacts.ts` | leave bare; `impl:protocol.build-pipeline-emit` | Removal and error-forwarding helpers implement the owning publishers' recovery, without a separate publication policy. |
| `src/extract/set-own.ts` | leave bare; `impl:protocol.markdown-parser` | Safe assignment of an arbitrary authored key is a parser implementation detail; the parser owns key fidelity. |
| `src/projections/design-review-markdown.ts` | add `impl:protocol.design-review-codec` | The shared Markdown path, link and inline-code encoder is the representation contract used by Design Review page and section providers. |
| `src/projections/studio/diagrams/model.ts` | add `impl:protocol.studio-diagram-model` | DiagramInput, DiagramBox, DiagramEdge, aggregation and draw bounds are the contract the layout and each diagram producer share. |
| `src/extract/markdown-body-content.ts` | add `impl:protocol.markdown-content` | The content stage turns located lines into list entries and typed fences; unsupported blocks are refused before owner mapping. |
| `src/cli/params.ts` | add `impl:protocol.parameter-codec` | The shared JSON, @file and keyed-file parameter decoder owns duplicate-key refusals for queries and rules. |
| `src/projections/diagnostic-banner.ts` | leave bare; `impl:protocol.design-review` | Counting findings for a banner owns no independent diagnostic semantics. |
| `src/projections/studio/inputs.ts` | add `impl:protocol.studio-inputs` | The named base graph and run input shape is shared with CLI preflight and recipe evaluation. |
| `src/projections/studio/pages/register-answers.ts` | add `impl:protocol.studio-register-contracts` | The question, decision, declaration, backlog, queue and diff result shapes are shared between recipe providers and their page renderers. |
| `src/projections/studio/pages/register-common.ts` | leave bare; `impl:protocol.studio-registers` | Shared title links and filter markup are rendering mechanics; register result contracts are separately proposed. |
| `src/extract/gherkin-kind-honesty.ts` | add `impl:protocol.gherkin-kind-policy` | The kind refusal table is shared by canonical Gherkin reification and import analysis and prevents silent truth-category loss. |
| `src/extract/markdown-body-owner-support.ts` | leave bare; `impl:protocol.markdown-body-grammar` | Single-value assignment, key parsing and owner-description helpers implement the body grammar. |
| `src/extract/markdown-envelope.ts` | leave bare; `impl:protocol.envelope-contract` | The frontmatter byte-frame helper is consumed by the moved frontmatter identity; it owns no independent parser API. |
| `src/import/markdown-fidelity.ts` | add `impl:protocol.import-fidelity` | The reparse comparator rejects an emitted Markdown document that changes authored meaning; this is an independent fidelity boundary. |
| `src/projections/studio/pages/index.ts` | add `impl:protocol.studio-page-catalog` | renderStudio owns the page catalog, conditional input pages and Pack exports; its public page-set policy is more than a forwarding barrel. |
| `src/cli/build-info.ts` | leave bare; `impl:protocol.build-artifacts` | Build-commit serialization supports the publisher and CLI version reader; no separate persistence responsibility exists. |
| `src/cli/path-identity.ts` | leave bare; `impl:protocol.studio-base-input` | Physical-path and containment helpers support each publication boundary's own input-placement checks. |
| `src/extract/markdown-frontmatter.ts` | relocate `impl:protocol.envelope-contract` | Bind the existing envelope identity at the actual parser instead of its forwarding wrapper. |
| `src/projections/studio/diagrams/index.ts` | leave bare; `impl:protocol.studio-diagrams` | This module forwards diagram providers and types only; the model and layout have their own identities. |
| `src/studio-elements/proposal.ts` | add `impl:protocol.studio-proposal-contract` | Proposal, ProposalChange and proposalProblems pin the browser handoff shape to the proposal checker and shipped schema. |
| `src/cli/corpus-rules.ts` | add `impl:protocol.corpus-rule-runner` | The body runner isolates each selected rule, validates its returned findings and keeps failures apart from Protocol findings. |
| `src/extract/markdown-body-owner-sections.ts` | leave bare; `impl:protocol.markdown-body-grammar` | The typed owner mappers are one grammar responsibility, consumed by the body parser. |
| `src/extract/markdown-body-owners.ts` | leave bare; `impl:protocol.markdown-body-grammar` | The owner dispatch composes that grammar's mappers and adds no independent extension port. |
| `src/extract/markdown-yaml-policy.ts` | add `impl:protocol.markdown-yaml-policy` | The bounded YAML policy, relation-target forms and scalar refusals are a carrier contract, rather than a mechanical parser helper. |
| `src/import/data-access.ts` | leave bare; `impl:protocol.sdp-import-markdown-emit` | Record and string guards are mechanical emitter accessors. |
| `src/projections/design-review-section-content.ts` | leave bare; `impl:protocol.design-review` | Closed-section formatting is local to the Design Review projection. |
| `src/projections/design-review-sections.ts` | leave bare; `impl:protocol.design-review` | The section dispatch implements the existing Design Review projection; it is not a separate catalog contract. |
| `src/projections/studio/pages/diff-keyed-rows.ts` | leave bare; `impl:protocol.studio-diff` | Keyed diff-row formatting is a helper of the diff page and has no independent query contract. |
| `src/index.ts` | leave bare; `impl:protocol.anchor-model` | The package barrel forwards existing public contracts; it adds no runtime or architecture responsibility of its own. |

A consuming responsibility in this table is review explanation, not a binding at the helper file. A graph file-impact answer for a bare file correctly remains coverage-unknown. The all-source imports input includes `src/cli/build-artifacts.ts`, which is build tooling outside the shipped runtime entry; that publisher still owns a significant package contract.

## Role vocabulary and changes

The carrying Model is `spec:protocol.role-vocabulary`; its keyed terms are the vocabulary to read, rather than a second definition table in this record. The baseline has adapter, codec, contract, decider, extractor, projection, publisher, reader, renderer, service, utility and validator. The proposal adds interaction and read-model as corpus values. It retains the historical renderer and utility terms to explain existing anchors until build edits replace or remove them.

Use projection for every current renderer, except the two CLI diagnostic formatters, which are codecs over a finding rather than a graph view. Use interaction for browser controls, reader for concept/address queries, read-model for GraphIndex, adapter for the registrar integration, decider for the kind-evidence table, validator for the audit and contract for its independent probe catalog. Component anchors receive the role of the responsibility their seam owns. Other realization exceptions remain lawfully unlabelled. No validator checks the Model's vocabulary, and no adopter has to use these spellings.

## The platform evidence and guidance lessons

The platform graph contains 76 code units, 37 with a role across 11 values, and 12 components. Its role values event-store, operator-entry, query, schema and use-case are meaningful application patterns. The Protocol's vocabulary must not rename them to its own roles. Schema is a useful role for persisted table/index shapes there; contract is the better word for the Protocol's non-persistent graph interfaces.

| Platform source | What matters | Guidance conclusion |
| --- | --- | --- |
| `src/audit/write.ts` | writeAudit and writeOperatorAudit are the fail-closed persistence boundary for command and gate audit records. | Propose impl:operations.audit-writer, role adapter, membership component:platform.audit; references spec:operations.baseline-operations while its full promise set is unfinished. |
| `src/audit/tables.ts` | AuditDataModel, AuditRecord and table/index validators are shared persistence contracts. | Propose impl:operations.audit-schema, role schema, membership component:platform.audit; references the same unfinished design. These files explain audit → command and audit → context imports that recipe 40 cannot currently map. |
| `src/operations/diagnostic.ts` | DiagnosticSink, the bounded line codec and the non-throwing emission path are a port and its policy. | Propose impl:operations.diagnostic, role codec, membership component:platform.operations; references spec:operations.baseline-operations. The current component uses are backed by this bare file's imports. |
| `src/context/text.ts` | utf8Length and shared byte bounds have many callers, but the helper owns no independent execution or persistence boundary. | Leave the mechanical byte counter bare; record its consuming command/context/diagnostic contracts. A high fan-in is a prompt to read, not an anchor requirement. |
| `src/context/adapter.ts` | The persistence provider and its batch-shaped API are already anchored, but service does not name the runtime-adapter responsibility well. | Recommend the platform review adapter as the role, preserving its existing targets; no edit was made. |
| `harness/*` | Process launch, backend selection and evidence collection are reusable infrastructure contracts, while wait/path wrappers need no individual architecture identity. | The graph has harness realization anchors without component membership. Review the actual harness provider boundaries before proposing a component design; do not infer a component from the directory. |
| `example/convex/inventory/operations.ts and example/convex/orders/operations.ts` | Each context imports the other domain's event/type contract. | The two imports-without-uses are real contract dependencies to review, not enough evidence to invent cross-context use-case or workflow intent. |

Ten platform uses-without-import rows remain after selecting all authored runtime and example roots. Several involve bare audit/diagnostic providers or imports into those providers; inspect those files before deleting an edge. The parent/context and gate/context rows also need the adopter's file-to-component review, including generated API and composition boundaries. This lane makes no stale-edge ruling for the platform. Its component anchors for audit and operations reference an unfinished design, contrary to the component-reference guidance; recommend keeping those component identities structural and placing references on the actual realizing units. Never replace those references with satisfies until the whole design's promises are realized.

The guidance lesson is to separate three things: a significant responsibility that needs a binding, a bare helper consumed by it, and missing component assignment in an external-import comparison. A missing planned-component row only says the corpus has not authored the component-design convention. It does not justify fabricating CodeNodes or component designs from paths.

## Where the arc lands

| Capability | Existing home | Component-design conclusion |
| --- | --- | --- |
| Capability map and its page | Reader queries through the recipe catalog; Studio page providers in projections | No new component. The query and page each receive a realizing identity when implemented. |
| Roadmap query, memo and page | Recipe bodies, projections and the existing body evaluator | No scheduler, scoring service or new component. The owner's priority ruling remains separate. |
| Design-slice query and page | Recipe catalog and Studio projection over Pack and architecture answers | No new component. The existing reader and projection contracts already provide the seam. |
| New diagram kinds | Diagram model, deterministic layout and per-kind producers inside projections; optional controls in studio-elements | No new component merely for a drawing type. A genuinely independent layout provider would require a component design before any component anchor, but no such provider is proposed here. |

Lane G should preserve the component/role register as the text route into architecture, keep omitted roles and membership visible, and separate it from bounded diagrams. It can reuse the proposed DiagramInput contract and existing layout identity rather than creating an identity for every box. Lane S should select units through recorded membership, uses and design bindings; no path-derived architecture. Lanes E and R need no extra architectural nodes from this lane. The prototype below shows current anchored data, including current omissions and role spellings, rather than pretending the proposed source edits have happened.

## Proposed architecture-page register

Add a readable register to the existing architecture page. It has component headings with their recorded context, layer and role, then native disclosures by member role. A row shows its identity, local label, file and line, its satisfies targets and its references targets separately. Not-stated role and no-component sections stay visible. It is a graph view of anchors, never a claim that the graph stores review approval. The independently curated source roster stays in the self-hosting oracle.

The desktop rail links directly to component sections; the mobile view puts that index into a disclosure. The first component is expanded for orientation. All rows remain available with JavaScript disabled. The prototype uses the current Studio CSS and no new drawing. This proposal needs agreement with lane G on placement and final Spec ownership; it adds no public command, recipe number or external register input.

Prototype assets live under `reviews/assets/plan47-prototypes/A-register/`: `register.mjs`, `studio.css`, `protocol.html`, `platform.html`, desktop and mobile screenshots, and `README.md`. The script reads both graphs with sdp q. Role meanings on the Protocol page come from its role-vocabulary Model; the adopter's unfamiliar values remain visible without a finding. A page-wide accepted badge would be false and is deliberately absent.

## Exact follow-up text for files this lane cannot edit

Replace the first paragraph under Curate the anchors in `.agents/skills/sdp-authoring/SKILL.md` with:

```md
Anchors are curated, never a coverage quota. Start with the public contracts and cross-component responsibilities a designer or builder must understand: ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters. Read the code before adding an identity. An export, an import ranking, a test expectation or a desired file-impact answer does not establish significance. Leave a mechanical wrapper, forwarding barrel, empty registration or formatting helper bare unless it owns an independent contract. Record the consuming responsibility without claiming a binding at the helper file.

An identity has one file owner. Several Specs realized by one responsibility normally share an anchor with plural targets; distinct responsibilities in one file may keep distinct identities when their separate design use is clear. Before merging or dropping an identity, list every promise its targets carry and name the surviving units that still realize it. Transfer targets only when that set remains true, or explicitly record a false claim being removed. Review imported value and type contracts when declaring component uses, exclude imports made only to author anchors, and inspect external-input omissions and unassigned files before deleting an edge. A realizing unit documents its local how, never a paraphrase of the Spec's what or why.
```

Replace only the architecturally significant unit definition in `specs/model/structural-patterns.sdp.md` with:

```md
- **architecturally significant unit** — A code unit with exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand to change a system guarantee. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters may qualify; being exported, re-exporting other units or appearing in an import ranking is insufficient by itself. Its anchor records component membership, a role and references to the designs it answers to. An architectural dependency is declared as `uses`, normally between components; a unit's own `uses` is optional.
```

This sharpens the existing criterion rather than changing it into a required catalog of patterns. The structural-self-binding criterion still applies. No change is proposed to CONTEXT.md, the decision registry, Pack manifests, recipe contracts or Protocol validators. No new Spec ids need adding to `pack:roadmaps-and-slices-v1`; retain the existing significant-units-review then role-vocabulary reading order.

## Build sequence and evidence

1. The owner reviews the disposition and role choices, including the single dropped identity and the proposed internal-contract additions. The executing thread reviews the two defined Specs and proposes any ready statements separately.
2. Apply the target-transfer ledger, the frontmatter-anchor relocation, missing anchors, roles and component uses in coherent units. Do not change implementation behavior while editing bindings. Keep recipe/document realizations outside product membership.
3. Replace the independent expectations in `test/self-hosting-oracle/structural-edges.ts`, the anchor and binding expectations in `test/self-hosting-oracle/anchors.ts`, and the changed Spec/relations snapshots. Preserve rejection of unrostered membership. Replace count-only assertions with row equality where row equality already proves the set; a total is a close measurement, never an acceptance target.
4. Keep the existing missing-member and extra-member checks meaningful, cover the relocated parser binding and the role taxonomy, and add the current-to-proposed register rendering cases to `test/studio-pages.test.ts` or the architecture page suite. Verify omitted role/membership, no inferred approval badge, role groups, source locations and the separation of realization from reference.
5. Integrate the register with lane G's page design, update the authoring guidance and structural-patterns text deliberately, and rerun recipes 12, 13, 15, 17, 27, 28, 32, 40 and 43. Derive fresh imports outside generated output, inspect diagnostics and omissions, then run npm run check after source and oracle edits.

This design pass runs carrier validation, temporal hygiene and formatting. It does not claim the full engine gate against stale pinned snapshots. The relevant current check must report zero errors and exactly honesty/gaps on spec:model.spec-sections. No engine, test, Pack, glossary, decision-registry or skill file changes belong to this lane commit.

## Reproduction

The prototype README supplies exact commands for rebuilding imports and rerunning every requested recipe. The Protocol input is `{ "adapter": "typescript", "tsconfig": "tsconfig.json", "roots": ["src"] }`. The platform input selects `src`, `harness`, `example` and `fixture` and excludes each `_generated` directory in those roots. Build imports on `/tmp/plan47-platform-A`, never on the read-only platform copy. Copy the emitted imports file out of generated before using it as recipe input. Graph queries do not publish or mutate the source corpus.

## Evidence bindings outside the architecture roster

The following accounts for every remaining Anchor node. Keep each test/oracle identity for its literal verification or expected-outcome binding, without adding it to the engine architecture roster. This is a binding inventory for the review, not proof of execution or outcome. The architecture classification above covers all 219 CodeNodes; these rows cover the other 324 anchors.

<details>
<summary>Every test and oracle binding</summary>

| Identity | File | Disposition and reason |
| --- | --- | --- |
| `oracle:protocol.capability-adoption` | `test/upgrade-kit.test.ts` | Keep expected-outcome binding to `spec:consumers.upgrade-kit.capability-adoption`. No architectural membership proposed. |
| `oracle:protocol.command-line` | `test/self-hosting-command-line.test.ts` | Keep expected-outcome binding to `spec:consumers.command-line`. No architectural membership proposed. |
| `oracle:protocol.consumers.agent-surface.address-and-cycle-recipes` | `test/reach-examples.test.ts` | Keep expected-outcome binding to `spec:consumers.agent-surface.address-and-cycle-recipes`. No architectural membership proposed. |
| `oracle:protocol.consumers.agent-surface.evaluation-sink` | `test/reach-examples.test.ts` | Keep expected-outcome binding to `spec:consumers.agent-surface.evaluation-sink`. No architectural membership proposed. |
| `oracle:protocol.context-bundle-parts` | `test/self-hosting-bundle-parts.test.ts` | Keep expected-outcome binding to `spec:consumers.context-bundle`. No architectural membership proposed. |
| `oracle:protocol.corpus-rules-watch` | `test/reach-examples.test.ts` | Keep expected-outcome binding to `spec:validation.corpus-rules`. No architectural membership proposed. |
| `oracle:protocol.entry-citations` | `test/entry-citations.test.ts` | Keep expected-outcome binding to `spec:extraction.entry-citations`. No architectural membership proposed. |
| `oracle:protocol.external-registers` | `test/self-hosting-external-registers.test.ts` | Keep expected-outcome binding to `spec:validation.external-registers`. No architectural membership proposed. |
| `oracle:protocol.inline-code-spans` | `test/self-hosting-inline-code.test.ts` | Keep expected-outcome binding to `spec:carrier.inline-code-spans`. No architectural membership proposed. |
| `oracle:protocol.kind-evidence` | `test/self-hosting-validators.test.ts` | Keep expected-outcome binding to `spec:validation.kind-evidence`. No architectural membership proposed. |
| `oracle:protocol.next-rung-floor` | `test/self-hosting-next-rung-floor.test.ts` | Keep expected-outcome binding to `spec:validation.next-rung-floor`. No architectural membership proposed. |
| `oracle:protocol.open-question-fields` | `test/self-hosting-carrier.test.ts` | Keep expected-outcome binding to `spec:model.open-question-fields`. No architectural membership proposed. |
| `oracle:protocol.open-question-keys` | `test/self-hosting-open-question-keys.test.ts` | Keep expected-outcome binding to `spec:model.open-question-keys`. No architectural membership proposed. |
| `oracle:protocol.oracle-target-eligibility` | `test/self-hosting-validators.oracle.ts` | Keep expected-outcome binding to `spec:validation.oracle-target-eligibility`. No architectural membership proposed. |
| `oracle:protocol.reader-entry-map` | `test/self-hosting-consumers.oracle.ts` | Keep expected-outcome binding to `spec:consumers.reader`. No architectural membership proposed. |
| `oracle:protocol.readiness-planner` | `test/self-hosting-readiness-planner.test.ts` | Keep expected-outcome binding to `spec:consumers.readiness-planner`. No architectural membership proposed. |
| `oracle:protocol.rule-key-proposal` | `test/upgrade-kit.test.ts` | Keep expected-outcome binding to `spec:consumers.upgrade-kit.rule-key-proposal`. No architectural membership proposed. |
| `oracle:protocol.run-evidence` | `test/studio-s4.test.ts` | Keep expected-outcome binding to `spec:observation.run-evidence`. No architectural membership proposed. |
| `oracle:protocol.runs-page` | `test/studio-s4.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.runs-page`. No architectural membership proposed. |
| `oracle:protocol.slot-notation` | `test/self-hosting-carrier.test.ts` | Keep expected-outcome binding to `spec:carrier.slot-notation`. No architectural membership proposed. |
| `oracle:protocol.studio-architecture` | `test/studio-s1.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.lenses.architecture`. No architectural membership proposed. |
| `oracle:protocol.studio-citations` | `test/studio-s2.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.spec-page`. No architectural membership proposed. |
| `oracle:protocol.studio-coverage` | `test/studio-s1.test.ts` | Keep expected-outcome binding to `spec:consumers.agent-surface.example-space-coverage`. No architectural membership proposed. |
| `oracle:protocol.studio-diagrams` | `test/studio-s1.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.diagrams`. No architectural membership proposed. |
| `oracle:protocol.studio-diff-page` | `test/studio-s3.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.diff-page`. No architectural membership proposed. |
| `oracle:protocol.studio-export` | `test/studio-s5.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.export`. No architectural membership proposed. |
| `oracle:protocol.studio-glossary-page` | `test/studio-s3.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.glossary-page`. No architectural membership proposed. |
| `oracle:protocol.studio-inputs` | `test/studio-s4.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.data.inputs`. No architectural membership proposed. |
| `oracle:protocol.studio-intents` | `test/studio-s5.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.intent-panel`. No architectural membership proposed. |
| `oracle:protocol.studio-memo` | `test/studio-s5.test.ts` | Keep expected-outcome binding to `spec:consumers.intent-composition.proposal.memo`. No architectural membership proposed. |
| `oracle:protocol.studio-owner-queue` | `test/studio-s3.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.owner-queue`. No architectural membership proposed. |
| `oracle:protocol.studio-registers` | `test/studio-s3.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.registers`. No architectural membership proposed. |
| `oracle:protocol.studio-rule-coverage` | `test/studio-s2.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.verification-panels`. No architectural membership proposed. |
| `oracle:protocol.studio-sharing` | `test/studio-s4.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.sharing`. No architectural membership proposed. |
| `oracle:protocol.studio-tests` | `test/studio-s1.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.lenses.tests`. No architectural membership proposed. |
| `oracle:protocol.studio-watch` | `test/studio-s5.test.ts` | Keep expected-outcome binding to `spec:consumers.spec-studio.publisher.watch`. No architectural membership proposed. |
| `oracle:protocol.superseded-decision-signal` | `test/self-hosting-validators.test.ts` | Keep expected-outcome binding to `spec:validation.superseded-decision-signal`. No architectural membership proposed. |
| `oracle:protocol.typed-dependency-floor` | `test/self-hosting-typed-dependency.test.ts` | Keep expected-outcome binding to `spec:validation.typed-dependency-floor`. No architectural membership proposed. |
| `oracle:protocol.unbound-example-posture` | `test/self-hosting-unbound-example.test.ts` | Keep expected-outcome binding to `spec:validation.unbound-example-posture`. No architectural membership proposed. |
| `oracle:protocol.validator-self-testing` | `test/validator-audit.test.ts` | Keep expected-outcome binding to `spec:validation.validator-self-testing`. No architectural membership proposed. |
| `oracle:protocol.vault` | `test/vault-examples.test.ts` | Keep expected-outcome binding to `spec:consumers.obsidian-vault`. No architectural membership proposed. |
| `oracle:protocol.vault-bases` | `test/vault-examples.test.ts` | Keep expected-outcome binding to `spec:consumers.obsidian-vault.bases`. No architectural membership proposed. |
| `oracle:protocol.vault-iteration` | `test/vault-examples.test.ts` | Keep expected-outcome binding to `spec:consumers.obsidian-vault.iteration`. No architectural membership proposed. |
| `oracle:protocol.vault-notes` | `test/vault-examples.test.ts` | Keep expected-outcome binding to `spec:consumers.obsidian-vault.notes`. No architectural membership proposed. |
| `test:protocol.address-and-cycle-recipes` | `test/recipes.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.address-and-cycle-recipes`. No architectural membership proposed. |
| `test:protocol.adopter-on-ramp` | `test/skills.test.ts` | Keep verifier binding to `spec:consumers.adopter-on-ramp`. No architectural membership proposed. |
| `test:protocol.agent-surface.demand-map-entries` | `test/self-hosting-consumers.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.demand-map-entries`. No architectural membership proposed. |
| `test:protocol.agent-surface.scripted-context-body` | `test/self-hosting-consumers.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.scripted-context-body`. No architectural membership proposed. |
| `test:protocol.anchors.lookalike-refusal` | `test/self-hosting-model.test.ts` | Keep verifier binding to `spec:model.anchors.lookalike-refusal`. No architectural membership proposed. |
| `test:protocol.anchors.physical-identity` | `test/self-hosting-model.test.ts` | Keep verifier binding to `spec:model.anchors.physical-identity`. No architectural membership proposed. |
| `test:protocol.answer-shape-recipes` | `test/recipes.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.answer-shapes`. No architectural membership proposed. |
| `test:protocol.authored-honesty.section-authored-fact` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.authored-honesty.section-authored-fact`. No architectural membership proposed. |
| `test:protocol.authored-honesty.unearned-stated-fact` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.authored-honesty.unearned-stated-fact`. No architectural membership proposed. |
| `test:protocol.authoring-grammar` | `test/authoring-grammar.test.ts` | Keep verifier binding to `spec:model.rule-keys`, `spec:model.open-question-fields`, `spec:model.relation-reasons`. No architectural membership proposed. |
| `test:protocol.authoring-grammar-recipes` | `test/recipes.test.ts` | Keep verifier binding to `spec:model.rule-keys`, `spec:model.open-question-fields`, `spec:model.relation-reasons`. No architectural membership proposed. |
| `test:protocol.authoring-on-ramp` | `test/skills.test.ts` | Keep verifier binding to `spec:consumers.authoring-on-ramp`. No architectural membership proposed. |
| `test:protocol.authoring-recipes` | `test/recipes.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.authoring-recipes`. No architectural membership proposed. |
| `test:protocol.binding-language-views.bound-spec-page` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.binding-language-views.bound-spec-page`. No architectural membership proposed. |
| `test:protocol.binding-language-views.pack-member-table` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.binding-language-views.pack-member-table`. No architectural membership proposed. |
| `test:protocol.build-pipeline.same-invocation` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.build-pipeline.same-invocation`. No architectural membership proposed. |
| `test:protocol.capability-adoption.counts-a-corpus` | `test/upgrade-kit.test.ts` | Keep verifier binding to `spec:consumers.upgrade-kit.capability-adoption.counts-a-corpus`. No architectural membership proposed. |
| `test:protocol.census-page` | `test/census.test.ts` | Keep verifier binding to `spec:consumers.census-page`. No architectural membership proposed. |
| `test:protocol.claim-separation.collapsed-edge-claim` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.claim-separation.collapsed-edge-claim`. No architectural membership proposed. |
| `test:protocol.claim-separation.unratified-descriptor` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.claim-separation.unratified-descriptor`. No architectural membership proposed. |
| `test:protocol.claim-taxonomy` | `test/graph-schema.test.ts` | Keep verifier binding to `spec:extraction.claim-taxonomy`. No architectural membership proposed. |
| `test:protocol.command-line.generate-check-failure` | `test/self-hosting-command-line.test.ts` | Keep verifier binding to `spec:consumers.command-line.generate-check-failure`. No architectural membership proposed. |
| `test:protocol.command-line.generate-writes-every-root` | `test/self-hosting-command-line.test.ts` | Keep verifier binding to `spec:consumers.command-line.generate-writes-every-root`. No architectural membership proposed. |
| `test:protocol.command-line.verb-help-touches-nothing` | `test/self-hosting-command-line.test.ts` | Keep verifier binding to `spec:consumers.command-line.verb-help-touches-nothing`. No architectural membership proposed. |
| `test:protocol.consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing`. No architectural membership proposed. |
| `test:protocol.consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run`. No architectural membership proposed. |
| `test:protocol.consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run`. No architectural membership proposed. |
| `test:protocol.consumers.agent-surface.evaluation-sink.exported-evaluator` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.evaluation-sink.exported-evaluator`. No architectural membership proposed. |
| `test:protocol.consumers.agent-surface.evaluation-sink.recipe-call` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.evaluation-sink.recipe-call`. No architectural membership proposed. |
| `test:protocol.consumers.agent-surface.evaluation-sink.unknown-recipe` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.evaluation-sink.unknown-recipe`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.bases.views-match-sources` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.bases.views-match-sources`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.changed-note-refused` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.changed-note-refused`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.failed-extraction-keeps-notes` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.failed-extraction-keeps-notes`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.failed-extraction-recovered` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.failed-extraction-recovered`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.fresh-vault` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.fresh-vault`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.hidden-file-refused` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.hidden-file-refused`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.interrupted-run-recovered` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.interrupted-run-recovered`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.iteration.watch-rewrites-changed-notes` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.iteration.watch-rewrites-changed-notes`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.iteration.watch-source-anchor` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.iteration.watch-source-anchor`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.notes.case-collision-refused` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.notes.case-collision-refused`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.notes.entry-address-link` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.notes.entry-address-link`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.notes.term-address-link` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.notes.term-address-link`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.notes.unresolved-mention-stays` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.notes.unresolved-mention-stays`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.person-notes-survive` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.person-notes-survive`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.unknown-note-refused` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.unknown-note-refused`. No architectural membership proposed. |
| `test:protocol.consumers.obsidian-vault.vault-in-build-path-refused` | `test/vault-examples.test.ts` | Keep verifier binding to `spec:consumers.obsidian-vault.vault-in-build-path-refused`. No architectural membership proposed. |
| `test:protocol.context-bundle-recipe` | `test/iteration-recipes.test.ts` | Keep verifier binding to `spec:consumers.context-bundle`. No architectural membership proposed. |
| `test:protocol.context-bundle.oversized-member-named` | `test/self-hosting-bundle-parts.test.ts` | Keep verifier binding to `spec:consumers.context-bundle.oversized-member-named`. No architectural membership proposed. |
| `test:protocol.context-bundle.parts-cover-the-pack` | `test/self-hosting-bundle-parts.test.ts` | Keep verifier binding to `spec:consumers.context-bundle.parts-cover-the-pack`. No architectural membership proposed. |
| `test:protocol.core-model` | `test/builders.test.ts` | Keep verifier binding to `spec:model.core-model`. No architectural membership proposed. |
| `test:protocol.curation-imports` | `test/curation-imports.test.ts` | Keep verifier binding to `spec:consumers.impact-graph.curation-assist`, `spec:consumers.impact-graph`. No architectural membership proposed. |
| `test:protocol.curation-recipe` | `test/curation-recipes.test.ts` | Keep verifier binding to `spec:consumers.impact-graph.curation-assist`. No architectural membership proposed. |
| `test:protocol.delivery-facts` | `test/extract.test.ts` | Keep verifier binding to `spec:extraction.delivery-facts`. No architectural membership proposed. |
| `test:protocol.delivery-session-on-ramp` | `test/skills.test.ts` | Keep verifier binding to `spec:consumers.delivery-session-on-ramp`. No architectural membership proposed. |
| `test:protocol.derived-readiness-banner.dishonest-divergence` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.derived-readiness-banner.dishonest-divergence`. No architectural membership proposed. |
| `test:protocol.derived-readiness-banner.honest-headroom` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.derived-readiness-banner.honest-headroom`. No architectural membership proposed. |
| `test:protocol.derived-readiness-banner.idea-floor-unmet` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.derived-readiness-banner`. No architectural membership proposed. |
| `test:protocol.design-diff-recipe` | `test/iteration-recipes.test.ts` | Keep verifier binding to `spec:consumers.design-diff`. No architectural membership proposed. |
| `test:protocol.design-recipes` | `test/recipes.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.design-recipes`. No architectural membership proposed. |
| `test:protocol.design-review.pure-projection` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.design-review.pure-projection`. No architectural membership proposed. |
| `test:protocol.diagnostic-rendering.composed-location` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:validation.diagnostic-rendering.composed-location`. No architectural membership proposed. |
| `test:protocol.diagnostic-rendering.table-cell-location` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:validation.diagnostic-rendering.table-cell-location`. No architectural membership proposed. |
| `test:protocol.duplicate-ids.dual-carrier` | `test/self-hosting-duplicate-ids.test.ts` | Keep verifier binding to `spec:validation.duplicate-ids.dual-carrier`. No architectural membership proposed. |
| `test:protocol.engine-provenance` | `test/cli.test.ts` | Keep verifier binding to `spec:consumers.engine-provenance`. No architectural membership proposed. |
| `test:protocol.entry-citations.code-comment-cites-declaration` | `test/entry-citations.test.ts` | Keep verifier binding to `spec:extraction.entry-citations.code-comment-cites-declaration`. No architectural membership proposed. |
| `test:protocol.entry-citations.test-title-cites-declaration` | `test/entry-citations.test.ts` | Keep verifier binding to `spec:extraction.entry-citations.test-title-cites-declaration`. No architectural membership proposed. |
| `test:protocol.entry-citations.unanchored-file-unread` | `test/entry-citations.test.ts` | Keep verifier binding to `spec:extraction.entry-citations.unanchored-file-unread`. No architectural membership proposed. |
| `test:protocol.entry-citations.unresolved-citation` | `test/entry-citations.test.ts` | Keep verifier binding to `spec:extraction.entry-citations.unresolved-citation`. No architectural membership proposed. |
| `test:protocol.entry-locations` | `test/entry-locations.test.ts` | Keep verifier binding to `spec:extraction.entry-locations`, `spec:validation.prose-mentions`. No architectural membership proposed. |
| `test:protocol.envelope-contract` | `test/markdown-reifier.test.ts` | Keep verifier binding to `spec:carrier.envelope-contract`. No architectural membership proposed. |
| `test:protocol.evaluation-sink` | `test/cli-q.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.evaluation-sink`. No architectural membership proposed. |
| `test:protocol.example-runner-cleanup` | `test/vitest-adapter.test.ts` | Keep verifier binding to `spec:extraction.example-runner`. No architectural membership proposed. |
| `test:protocol.example-runner.red-step-naming` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.example-runner.red-step-naming`. No architectural membership proposed. |
| `test:protocol.example-runner.step-order` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.example-runner.step-order`. No architectural membership proposed. |
| `test:protocol.excludes.refused-path` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.excludes.refused-path`. No architectural membership proposed. |
| `test:protocol.excludes.segment-boundary` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.excludes.segment-boundary`. No architectural membership proposed. |
| `test:protocol.executable-contracts.case-colliding-path` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.executable-contracts.case-colliding-path`. No architectural membership proposed. |
| `test:protocol.executable-contracts.concreteness-refusal` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.executable-contracts.concreteness-refusal`. No architectural membership proposed. |
| `test:protocol.executable-contracts.multi-entry-example` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.executable-contracts.multi-entry-example`. No architectural membership proposed. |
| `test:protocol.external-registers.uncited-on-request` | `test/self-hosting-external-registers.test.ts` | Keep verifier binding to `spec:validation.external-registers.uncited-on-request`. No architectural membership proposed. |
| `test:protocol.external-registers.unknown-and-retired` | `test/self-hosting-external-registers.test.ts` | Keep verifier binding to `spec:validation.external-registers.unknown-and-retired`. No architectural membership proposed. |
| `test:protocol.extract` | `test/extract.test.ts` | Keep verifier binding to `spec:extraction.derive-graph`. No architectural membership proposed. |
| `test:protocol.extraction-determinism` | `test/cli.test.ts` | Keep verifier binding to `spec:extraction.determinism`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.authored-fact-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.authored-fact-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.contract-parity` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.contract-parity`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.description-location-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.description-location-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.duplicate-surface-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.duplicate-surface-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.example-space-extraction` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.example-space-extraction`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.malformed-relation-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.malformed-relation-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.missing-id-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.missing-id-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.multi-finding-bounded` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.multi-finding-bounded`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.parent-child-extraction` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.parent-child-extraction`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.step-less-scenario-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.step-less-scenario-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.unbound-ready-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.unbound-ready-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.unknown-tag-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.unknown-tag-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-authoring.unsupported-construct-refused` | `test/self-hosting-carrier-gherkin.test.ts` | Keep verifier binding to `spec:carrier.gherkin-authoring.unsupported-construct-refused`. No architectural membership proposed. |
| `test:protocol.gherkin-view` | `test/gherkin-view.test.ts` | Keep verifier binding to `spec:consumers.gherkin-view`. No architectural membership proposed. |
| `test:protocol.graph-first-planning` | `test/skills.test.ts` | Keep verifier binding to `spec:consumers.graph-first-planning`. No architectural membership proposed. |
| `test:protocol.inline-code-spans.description` | `test/self-hosting-inline-code.test.ts` | Keep verifier binding to `spec:carrier.inline-code-spans.description`. No architectural membership proposed. |
| `test:protocol.inline-code-spans.list` | `test/self-hosting-inline-code.test.ts` | Keep verifier binding to `spec:carrier.inline-code-spans.list`. No architectural membership proposed. |
| `test:protocol.inline-code-spans.narrative` | `test/self-hosting-inline-code.test.ts` | Keep verifier binding to `spec:carrier.inline-code-spans.narrative`. No architectural membership proposed. |
| `test:protocol.inline-code-spans.pack` | `test/self-hosting-inline-code.test.ts` | Keep verifier binding to `spec:carrier.inline-code-spans.pack`. No architectural membership proposed. |
| `test:protocol.keyed-content` | `test/keyed-content.test.ts` | Keep verifier binding to `spec:carrier.step-keys`, `spec:model.term-addresses`. No architectural membership proposed. |
| `test:protocol.kind-evidence.constraints-alone` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.kind-evidence.constraints-alone`. No architectural membership proposed. |
| `test:protocol.kind-evidence.empty-promoted-child` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.kind-evidence.empty-promoted-child`. No architectural membership proposed. |
| `test:protocol.kind-evidence.second-entry-untargeted` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.kind-evidence.second-entry-untargeted`. No architectural membership proposed. |
| `test:protocol.kind-evidence.untargeted-constraint` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.kind-evidence.untargeted-constraint`. No architectural membership proposed. |
| `test:protocol.markdown-authoring` | `test/import-round-trip.test.ts` | Keep verifier binding to `spec:carrier.markdown-authoring`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.continuation-line-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.continuation-line-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.foreign-fence-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.foreign-fence-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.h3-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.h3-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.integer-term-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.integer-term-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.keyed-bullet-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.keyed-bullet-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.ordered-list-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.ordered-list-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.plain-bullet-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.plain-bullet-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.raw-html-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.raw-html-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.repeated-field-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.repeated-field-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.second-primary-owner-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.second-primary-owner-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.shared-description-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.shared-description-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.table-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.table-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.trailing-prose-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.trailing-prose-refused`. No architectural membership proposed. |
| `test:protocol.markdown-body-grammar.unrecognized-heading-refused` | `test/self-hosting-markdown-grammar.test.ts` | Keep verifier binding to `spec:carrier.markdown-body-grammar.unrecognized-heading-refused`. No architectural membership proposed. |
| `test:protocol.markdown-pack-authoring.markdown-ts-parity` | `test/self-hosting-pack-markdown.test.ts` | Keep verifier binding to `spec:carrier.markdown-pack-authoring.markdown-ts-parity`. No architectural membership proposed. |
| `test:protocol.markdown-pack-authoring.spec-envelope-refused` | `test/self-hosting-pack-markdown.test.ts` | Keep verifier binding to `spec:carrier.markdown-pack-authoring.spec-envelope-refused`. No architectural membership proposed. |
| `test:protocol.markdown-parser` | `test/markdown-reifier.test.ts` | Keep verifier binding to `spec:carrier.markdown-parser`. No architectural membership proposed. |
| `test:protocol.markdown-parser.bounded-parity` | `test/self-hosting-carrier.test.ts` | Keep verifier binding to `spec:carrier.markdown-parser.bounded-parity`. No architectural membership proposed. |
| `test:protocol.mermaid-view` | `test/mermaid-render.test.ts` | Keep verifier binding to `spec:consumers.mermaid-view`. No architectural membership proposed. |
| `test:protocol.model.planned-architecture.differing-layer-and-uses` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:model.planned-architecture.differing-layer-and-uses`. No architectural membership proposed. |
| `test:protocol.model.planned-architecture.matching-design` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:model.planned-architecture.matching-design`. No architectural membership proposed. |
| `test:protocol.model.planned-architecture.unrealized-design` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:model.planned-architecture.unrealized-design`. No architectural membership proposed. |
| `test:protocol.next-rung-floor.blocking-question` | `test/self-hosting-next-rung-floor.test.ts` | Keep verifier binding to `spec:validation.next-rung-floor.blocking-question`. No architectural membership proposed. |
| `test:protocol.next-rung-floor.typed-dependency-targets` | `test/self-hosting-next-rung-floor.test.ts` | Keep verifier binding to `spec:validation.next-rung-floor.typed-dependency-targets`. No architectural membership proposed. |
| `test:protocol.open-question-fields.dropped-list-warns` | `test/self-hosting-carrier.test.ts` | Keep verifier binding to `spec:model.open-question-fields.dropped-list-warns`. No architectural membership proposed. |
| `test:protocol.open-question-keys.keyed-question-resolves` | `test/self-hosting-open-question-keys.test.ts` | Keep verifier binding to `spec:model.open-question-keys.keyed-question-resolves`. No architectural membership proposed. |
| `test:protocol.open-question-keys.renamed-key-breaks` | `test/self-hosting-open-question-keys.test.ts` | Keep verifier binding to `spec:model.open-question-keys.renamed-key-breaks`. No architectural membership proposed. |
| `test:protocol.open-question-keys.repeated-key-refused` | `test/self-hosting-open-question-keys.test.ts` | Keep verifier binding to `spec:model.open-question-keys.repeated-key-refused`. No architectural membership proposed. |
| `test:protocol.open-section-order` | `test/graph-schema.test.ts` | Keep verifier binding to `spec:extraction.open-section-order`. No architectural membership proposed. |
| `test:protocol.oracle-target-eligibility.missing-space-refused` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.oracle-target-eligibility.missing-space-refused`. No architectural membership proposed. |
| `test:protocol.oracle-target-eligibility.rule-space-accepted` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.oracle-target-eligibility.rule-space-accepted`. No architectural membership proposed. |
| `test:protocol.pack-builder` | `test/builders.test.ts` | Keep verifier binding to `spec:model.pack-aggregate`. No architectural membership proposed. |
| `test:protocol.pack-coherence.incoherent-aggregate` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.pack-coherence.incoherent-aggregate`. No architectural membership proposed. |
| `test:protocol.pack-design` | `test/pack-design.test.ts` | Keep verifier binding to `spec:consumers.pack-design`, `spec:model.design-maturity`. No architectural membership proposed. |
| `test:protocol.pack-design-page` | `test/design-review-pack-page.test.ts` | Keep verifier binding to `spec:consumers.design-review.pack-design-page`. No architectural membership proposed. |
| `test:protocol.pack-member-order` | `test/self-hosting-pack-member-order.test.ts` | Keep verifier binding to `spec:extraction.pack-member-order.manifest-order-kept`. No architectural membership proposed. |
| `test:protocol.perspective-filter-recipe` | `test/iteration-recipes.test.ts` | Keep verifier binding to `spec:consumers.review-perspectives`. No architectural membership proposed. |
| `test:protocol.projections-model.publication` | `test/cli.test.ts` | Keep verifier binding to `spec:consumers.projections-model`. No architectural membership proposed. |
| `test:protocol.projections-model.reader` | `test/reader.test.ts` | Keep verifier binding to `spec:consumers.projections-model`. No architectural membership proposed. |
| `test:protocol.projections-model.rendering` | `test/design-review.test.ts` | Keep verifier binding to `spec:consumers.projections-model`. No architectural membership proposed. |
| `test:protocol.proposal-schema-and-recipe` | `test/iteration-recipes.test.ts` | Keep verifier binding to `spec:consumers.intent-composition.proposal`. No architectural membership proposed. |
| `test:protocol.prose-mentions` | `test/validators.test.ts` | Keep verifier binding to `spec:validation.prose-mentions`. No architectural membership proposed. |
| `test:protocol.prose-ownership` | `test/markdown-reifier.test.ts` | Keep verifier binding to `spec:carrier.prose-ownership-rule`. No architectural membership proposed. |
| `test:protocol.query-answer-shapes` | `test/cli-q.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.evaluation-sink`, `spec:consumers.agent-surface.recipe-parameters`. No architectural membership proposed. |
| `test:protocol.query-params` | `test/cli-q.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.recipe-parameters`. No architectural membership proposed. |
| `test:protocol.reader.changeset-entry` | `test/self-hosting-consumers.test.ts` | Keep verifier binding to `spec:consumers.reader.changeset-entry`. No architectural membership proposed. |
| `test:protocol.reader.concept-entry` | `test/self-hosting-consumers.test.ts` | Keep verifier binding to `spec:consumers.reader.concept-entry`. No architectural membership proposed. |
| `test:protocol.reader.file-entry` | `test/self-hosting-consumers.test.ts` | Keep verifier binding to `spec:consumers.reader.file-entry`. No architectural membership proposed. |
| `test:protocol.readiness-floor` | `test/readiness.test.ts` | Keep verifier binding to `spec:validation.readiness-floor`. No architectural membership proposed. |
| `test:protocol.readiness-floor.blocking-open-question` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.readiness-floor.blocking-open-question`. No architectural membership proposed. |
| `test:protocol.readiness-floor.unrelated-scoped-spec` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.readiness-floor.unrelated-scoped-spec`. No architectural membership proposed. |
| `test:protocol.readiness-planner.cycle-shares-a-round` | `test/self-hosting-readiness-planner.test.ts` | Keep verifier binding to `spec:consumers.readiness-planner.cycle-shares-a-round`. No architectural membership proposed. |
| `test:protocol.readiness-planner.decision-first` | `test/self-hosting-readiness-planner.test.ts` | Keep verifier binding to `spec:consumers.readiness-planner.decision-first`. No architectural membership proposed. |
| `test:protocol.readiness-planner.dependency-order` | `test/self-hosting-readiness-planner.test.ts` | Keep verifier binding to `spec:consumers.readiness-planner.dependency-order`. No architectural membership proposed. |
| `test:protocol.readiness-planner.owner-question-holds` | `test/self-hosting-readiness-planner.test.ts` | Keep verifier binding to `spec:consumers.readiness-planner.owner-question-holds`. No architectural membership proposed. |
| `test:protocol.reading-on-ramp` | `test/skills.test.ts` | Keep verifier binding to `spec:consumers.reading-on-ramp`. No architectural membership proposed. |
| `test:protocol.recipe-parameters` | `test/recipes.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.recipe-parameters`. No architectural membership proposed. |
| `test:protocol.referential-integrity.dangling-target` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.referential-integrity.dangling-target`. No architectural membership proposed. |
| `test:protocol.referential-integrity.did-you-mean` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.referential-integrity.did-you-mean`. No architectural membership proposed. |
| `test:protocol.regenerability` | `test/cli.test.ts` | Keep verifier binding to `spec:extraction.regenerability`. No architectural membership proposed. |
| `test:protocol.register-recipes` | `test/recipes.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.register-recipes`, `spec:extraction.contract-declarations`. No architectural membership proposed. |
| `test:protocol.relation-builders` | `test/builders.test.ts` | Keep verifier binding to `spec:model.relations`. No architectural membership proposed. |
| `test:protocol.rule-key-proposal.collision-and-unkeyable` | `test/upgrade-kit.test.ts` | Keep verifier binding to `spec:consumers.upgrade-kit.rule-key-proposal.collision-and-unkeyable`. No architectural membership proposed. |
| `test:protocol.rule-key-proposal.proposal-applies-clean` | `test/upgrade-kit.test.ts` | Keep verifier binding to `spec:consumers.upgrade-kit.rule-key-proposal.proposal-applies-clean`. No architectural membership proposed. |
| `test:protocol.run-absolute` | `test/studio-s4.test.ts` | Keep verifier binding to `spec:observation.run-evidence.absolute-path-joins`. No architectural membership proposed. |
| `test:protocol.run-external` | `test/studio-s4.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.runs-page.external-evidence`. No architectural membership proposed. |
| `test:protocol.run-unjoined` | `test/studio-s4.test.ts` | Keep verifier binding to `spec:observation.run-evidence.unanchored-file-unjoined`. No architectural membership proposed. |
| `test:protocol.runnable-modules` | `test/testing.test.ts` | Keep verifier binding to `spec:extraction.runnable-modules`. No architectural membership proposed. |
| `test:protocol.runnable-modules-generation` | `test/codegen.test.ts` | Keep verifier binding to `spec:extraction.runnable-modules`. No architectural membership proposed. |
| `test:protocol.runnable-modules-types` | `test/runnable-modules.typecheck.ts` | Keep verifier binding to `spec:extraction.runnable-modules`. No architectural membership proposed. |
| `test:protocol.schema-versioning.declared-version` | `test/self-hosting-extraction.test.ts` | Keep verifier binding to `spec:extraction.schema-versioning.declared-version`. No architectural membership proposed. |
| `test:protocol.sdp-import.round-trip` | `test/self-hosting-sdp-import.test.ts` | Keep verifier binding to `spec:carrier.sdp-import.round-trip`. No architectural membership proposed. |
| `test:protocol.self-hosting` | `test/self-hosting-graph.test.ts` | Keep verifier binding to `spec:protocol.self-hosting`. No architectural membership proposed. |
| `test:protocol.shipped-protocol-corpus` | `test/package-smoke.test.ts` | Keep verifier binding to `spec:consumers.shipped-protocol-corpus`, `spec:consumers.adopter-on-ramp`. No architectural membership proposed. |
| `test:protocol.slimming-recipe` | `test/curation-recipes.test.ts` | Keep verifier binding to `spec:model.enrichment-lifecycle`. No architectural membership proposed. |
| `test:protocol.slot-notation.one-literal-binding` | `test/self-hosting-carrier.test.ts` | Keep verifier binding to `spec:carrier.slot-notation.one-literal-binding`. No architectural membership proposed. |
| `test:protocol.slot-notation.refused-guess` | `test/self-hosting-carrier.test.ts` | Keep verifier binding to `spec:carrier.slot-notation.refused-guess`. No architectural membership proposed. |
| `test:protocol.slot-notation.typed-declaration` | `test/self-hosting-carrier.test.ts` | Keep verifier binding to `spec:carrier.slot-notation.typed-declaration`. No architectural membership proposed. |
| `test:protocol.stable-ids.malformed-refusal` | `test/self-hosting-model.test.ts` | Keep verifier binding to `spec:model.stable-ids.malformed-refusal`. No architectural membership proposed. |
| `test:protocol.stable-ids.namespaced-round-trip` | `test/self-hosting-model.test.ts` | Keep verifier binding to `spec:model.stable-ids.namespaced-round-trip`. No architectural membership proposed. |
| `test:protocol.stable-ids.unsectioned-address-refused` | `test/self-hosting-model.test.ts` | Keep verifier binding to `spec:model.stable-ids.unsectioned-address-refused`. No architectural membership proposed. |
| `test:protocol.step-keys.conflicting-example-key-withheld` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.conflicting-example-key-withheld`. No architectural membership proposed. |
| `test:protocol.step-keys.gherkin-keyed-step-stays-bound` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.gherkin-keyed-step-stays-bound`. No architectural membership proposed. |
| `test:protocol.step-keys.key-equal-to-a-skeleton-withheld` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.key-equal-to-a-skeleton-withheld`. No architectural membership proposed. |
| `test:protocol.step-keys.malformed-marker-refused` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.malformed-marker-refused`. No architectural membership proposed. |
| `test:protocol.step-keys.renamed-key-breaks` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.renamed-key-breaks`. No architectural membership proposed. |
| `test:protocol.step-keys.repeated-key-refused` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.repeated-key-refused`. No architectural membership proposed. |
| `test:protocol.step-keys.reworded-keyed-step-stays-bound` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.reworded-keyed-step-stays-bound`. No architectural membership proposed. |
| `test:protocol.step-keys.reworded-unkeyed-step-breaks` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.reworded-unkeyed-step-breaks`. No architectural membership proposed. |
| `test:protocol.step-keys.two-keys-on-one-step-refused` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.two-keys-on-one-step-refused`. No architectural membership proposed. |
| `test:protocol.step-keys.typescript-keyed-step-imports-keyed` | `test/self-hosting-step-keys.test.ts` | Keep verifier binding to `spec:carrier.step-keys.typescript-keyed-step-imports-keyed`. No architectural membership proposed. |
| `test:protocol.structural-self-binding` | `test/self-hosting-graph.test.ts` | Keep verifier binding to `spec:protocol.structural-self-binding`, `spec:model.structural-patterns`. No architectural membership proposed. |
| `test:protocol.studio-architecture-planned-apart` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.lenses.architecture.planned-apart`. No architectural membership proposed. |
| `test:protocol.studio-cited-declaration` | `test/studio-s2.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.spec-page.cited-declaration`. No architectural membership proposed. |
| `test:protocol.studio-concept-match` | `test/concept-match.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.search`. No architectural membership proposed. |
| `test:protocol.studio-coverage-literal` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.example-space-coverage.uncovered-literal`. No architectural membership proposed. |
| `test:protocol.studio-coverage-number` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.agent-surface.example-space-coverage.number-not-enumerable`. No architectural membership proposed. |
| `test:protocol.studio-data` | `test/studio-data.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.data`, `spec:consumers.spec-studio.publisher`. No architectural membership proposed. |
| `test:protocol.studio-diagram-folds-context` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.diagrams.folds-by-context`. No architectural membership proposed. |
| `test:protocol.studio-diagram-folds-layer` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.diagrams.folds-by-layer`. No architectural membership proposed. |
| `test:protocol.studio-diagram-within-bound` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.diagrams.within-bound`. No architectural membership proposed. |
| `test:protocol.studio-diff-changed-entry` | `test/studio-s3.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.diff-page.changed-entry`. No architectural membership proposed. |
| `test:protocol.studio-export-contained` | `test/studio-s5.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.export.self-contained`. No architectural membership proposed. |
| `test:protocol.studio-glossary-same-word-twice` | `test/studio-s3.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.glossary-page.same-word-twice`. No architectural membership proposed. |
| `test:protocol.studio-graph-only` | `test/studio-s4.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.data.inputs.graph-only`. No architectural membership proposed. |
| `test:protocol.studio-inputs-both-given` | `test/studio-s4.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.data.inputs.both-given`. No architectural membership proposed. |
| `test:protocol.studio-intent-handoff` | `test/studio-s5.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.intent-panel`, `spec:consumers.edit-model`, `spec:consumers.intent-composition`, `spec:consumers.spec-studio.responsive`, `spec:consumers.spec-studio.export`, `spec:consumers.spec-studio.components`. No architectural membership proposed. |
| `test:protocol.studio-intents-refresh` | `test/studio-s5.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.intent-panel.refresh-keeps-intents`. No architectural membership proposed. |
| `test:protocol.studio-lenses` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.lenses`, `spec:consumers.spec-studio.lenses.packs`, `spec:consumers.spec-studio.lenses.evidence`, `spec:consumers.spec-studio.data.recipe-answers`. No architectural membership proposed. |
| `test:protocol.studio-memo-shared` | `test/studio-s5.test.ts` | Keep verifier binding to `spec:consumers.intent-composition.proposal.memo.shared`. No architectural membership proposed. |
| `test:protocol.studio-navigation` | `test/studio-s3.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.navigation`. No architectural membership proposed. |
| `test:protocol.studio-on-ramp` | `test/skills.test.ts` | Keep verifier binding to `spec:consumers.studio-on-ramp`. No architectural membership proposed. |
| `test:protocol.studio-page-elements` | `test/studio-elements.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.page-elements`, `spec:consumers.spec-studio.search`. No architectural membership proposed. |
| `test:protocol.studio-pages` | `test/studio-pages.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.shell`, `spec:consumers.spec-studio.index-page`, `spec:consumers.spec-studio.pack-page`, `spec:consumers.spec-studio.spec-page.core`, `spec:consumers.spec-studio.search`. No architectural membership proposed. |
| `test:protocol.studio-panels` | `test/studio-s2.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.spec-page`, `spec:consumers.spec-studio.verification-panels`, `spec:consumers.spec-studio.pack-page.maturity-map`. No architectural membership proposed. |
| `test:protocol.studio-publisher` | `test/studio-publisher.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.publisher`, `spec:consumers.spec-studio`. No architectural membership proposed. |
| `test:protocol.studio-queue-dependency-first` | `test/studio-s3.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.owner-queue.dependency-first`. No architectural membership proposed. |
| `test:protocol.studio-registers-blocking-first` | `test/studio-s3.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.registers.blocking-first`. No architectural membership proposed. |
| `test:protocol.studio-rule-coverage` | `test/studio-s2.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.verification-panels.rule-coverage`. No architectural membership proposed. |
| `test:protocol.studio-stamp-apart` | `test/studio-s4.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.sharing.stamp-written-apart`. No architectural membership proposed. |
| `test:protocol.studio-tests-coverage-row` | `test/studio-s1.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.lenses.tests.coverage-row`. No architectural membership proposed. |
| `test:protocol.studio-watch-plain` | `test/studio-s5.test.ts` | Keep verifier binding to `spec:consumers.spec-studio.publisher.watch.matches-plain-run`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.branch-names-every-end` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.branch-names-every-end`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.chain-end-named` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.chain-end-named`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.closed-chain-named` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.closed-chain-named`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.dependency-unread` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.dependency-unread`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.end-and-loop-named` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.end-and-loop-named`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.live-replacement-warns` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.live-replacement-warns`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.replaced-ruling-warns` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.replaced-ruling-warns`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.replacement-below-ready-named` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.replacement-below-ready-named`. No architectural membership proposed. |
| `test:protocol.superseded-decision-signal.superseded-subject-silent` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.superseded-decision-signal.superseded-subject-silent`. No architectural membership proposed. |
| `test:protocol.term-addresses.keyed-term-resolves` | `test/self-hosting-term-addresses.test.ts` | Keep verifier binding to `spec:model.term-addresses.keyed-term-resolves`. No architectural membership proposed. |
| `test:protocol.term-addresses.malformed-term-marker-refused` | `test/self-hosting-term-addresses.test.ts` | Keep verifier binding to `spec:model.term-addresses.malformed-term-marker-refused`. No architectural membership proposed. |
| `test:protocol.term-addresses.repeated-term-key-refused` | `test/self-hosting-term-addresses.test.ts` | Keep verifier binding to `spec:model.term-addresses.repeated-term-key-refused`. No architectural membership proposed. |
| `test:protocol.term-addresses.typescript-term-imports-keyed` | `test/self-hosting-term-addresses.test.ts` | Keep verifier binding to `spec:model.term-addresses.typescript-term-imports-keyed`. No architectural membership proposed. |
| `test:protocol.term-addresses.unknown-term-key-refused` | `test/self-hosting-term-addresses.test.ts` | Keep verifier binding to `spec:model.term-addresses.unknown-term-key-refused`. No architectural membership proposed. |
| `test:protocol.two-check-families.split-report` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.two-check-families.split-report`. No architectural membership proposed. |
| `test:protocol.typed-dependency-floor.missing-targets` | `test/self-hosting-typed-dependency.test.ts` | Keep verifier binding to `spec:validation.typed-dependency-floor.missing-targets`. No architectural membership proposed. |
| `test:protocol.typed-dependency-floor.relation-rungs` | `test/self-hosting-typed-dependency.test.ts` | Keep verifier binding to `spec:validation.typed-dependency-floor.relation-rungs`. No architectural membership proposed. |
| `test:protocol.typed-dependency-floor.stated-readiness` | `test/self-hosting-typed-dependency.test.ts` | Keep verifier binding to `spec:validation.typed-dependency-floor.stated-readiness`. No architectural membership proposed. |
| `test:protocol.typed-dependency-floor.unsettled-fact` | `test/self-hosting-typed-dependency.test.ts` | Keep verifier binding to `spec:validation.typed-dependency-floor.unsettled-fact`. No architectural membership proposed. |
| `test:protocol.unbound-example-posture.lower-rungs` | `test/self-hosting-unbound-example.test.ts` | Keep verifier binding to `spec:validation.unbound-example-posture.lower-rungs`. No architectural membership proposed. |
| `test:protocol.unbound-example-posture.parent-traces` | `test/self-hosting-unbound-example.test.ts` | Keep verifier binding to `spec:validation.unbound-example-posture.parent-traces`. No architectural membership proposed. |
| `test:protocol.unbound-example-posture.warning-cases` | `test/self-hosting-unbound-example.test.ts` | Keep verifier binding to `spec:validation.unbound-example-posture.warning-cases`. No architectural membership proposed. |
| `test:protocol.upgrade-guide` | `test/upgrade-kit.test.ts` | Keep verifier binding to `spec:consumers.upgrade-kit`. No architectural membership proposed. |
| `test:protocol.validate-watch` | `test/cli.test.ts` | Keep verifier binding to `spec:consumers.validate-watch`. No architectural membership proposed. |
| `test:protocol.validate-watch-rules` | `test/corpus-rules.test.ts` | Keep verifier binding to `spec:consumers.validate-watch`. No architectural membership proposed. |
| `test:protocol.validation.architecture-constraints.forbidden-layer-pair` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:validation.architecture-constraints.forbidden-layer-pair`. No architectural membership proposed. |
| `test:protocol.validation.architecture-constraints.isolated-context-as-rule` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:validation.architecture-constraints.isolated-context-as-rule`. No architectural membership proposed. |
| `test:protocol.validation.architecture-constraints.unstated-layer-unclassified` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:validation.architecture-constraints.unstated-layer-unclassified`. No architectural membership proposed. |
| `test:protocol.validation.corpus-rules.copies-contain-changes` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:validation.corpus-rules.copies-contain-changes`. No architectural membership proposed. |
| `test:protocol.validation.corpus-rules.error-finding-fails` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:validation.corpus-rules.error-finding-fails`. No architectural membership proposed. |
| `test:protocol.validation.corpus-rules.malformed-finding-fails` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:validation.corpus-rules.malformed-finding-fails`. No architectural membership proposed. |
| `test:protocol.validation.corpus-rules.params-edit-starts-a-cycle` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:validation.corpus-rules.params-edit-starts-a-cycle`. No architectural membership proposed. |
| `test:protocol.validation.corpus-rules.rules-edit-starts-a-cycle` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:validation.corpus-rules.rules-edit-starts-a-cycle`. No architectural membership proposed. |
| `test:protocol.validation.corpus-rules.unreadable-params-fail-one-file` | `test/reach-examples.test.ts` | Keep verifier binding to `spec:validation.corpus-rules.unreadable-params-fail-one-file`. No architectural membership proposed. |
| `test:protocol.validation.corpus-rules.warning-finding-informs` | `test/self-hosting-corpus-checks.test.ts` | Keep verifier binding to `spec:validation.corpus-rules.warning-finding-informs`. No architectural membership proposed. |
| `test:protocol.validator-self-testing.duplicate-pair-named` | `test/validator-audit.test.ts` | Keep verifier binding to `spec:validation.validator-self-testing.duplicate-pair-named`. No architectural membership proposed. |
| `test:protocol.validator-self-testing.overeager-check-named` | `test/validator-audit.test.ts` | Keep verifier binding to `spec:validation.validator-self-testing.overeager-check-named`. No architectural membership proposed. |
| `test:protocol.validator-self-testing.shipped-checks-paired` | `test/validator-audit.test.ts` | Keep verifier binding to `spec:validation.validator-self-testing.shipped-checks-paired`. No architectural membership proposed. |
| `test:protocol.validator-self-testing.silent-check-named` | `test/validator-audit.test.ts` | Keep verifier binding to `spec:validation.validator-self-testing.silent-check-named`. No architectural membership proposed. |
| `test:protocol.validator-self-testing.unpaired-check-named` | `test/validator-audit.test.ts` | Keep verifier binding to `spec:validation.validator-self-testing.unpaired-check-named`. No architectural membership proposed. |
| `test:protocol.validator-self-testing.unregistered-id-named` | `test/validator-audit.test.ts` | Keep verifier binding to `spec:validation.validator-self-testing.unregistered-id-named`. No architectural membership proposed. |
| `test:protocol.vault-on-ramp` | `test/skills.test.ts` | Keep verifier binding to `spec:consumers.vault-on-ramp`. No architectural membership proposed. |
| `test:protocol.verification-linkage.unbound-example` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.verification-linkage.unbound-example`. No architectural membership proposed. |
| `test:protocol.verification-linkage.unresolved-oracle` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.verification-linkage.unresolved-oracle`. No architectural membership proposed. |
| `test:protocol.warn-level-signals.orphan-signal` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.warn-level-signals.orphan-signal`. No architectural membership proposed. |
| `test:protocol.warn-level-signals.ready-gap-signal` | `test/self-hosting-validators.test.ts` | Keep verifier binding to `spec:validation.warn-level-signals.ready-gap-signal`. No architectural membership proposed. |
| `test:protocol.wholesale-view-rewrite.build-invalidates-view` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.wholesale-view-rewrite.build-invalidates-view`. No architectural membership proposed. |
| `test:protocol.wholesale-view-rewrite.failed-run-view-removed` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.wholesale-view-rewrite.failed-run-view-removed`. No architectural membership proposed. |
| `test:protocol.wholesale-view-rewrite.late-stale-page` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.wholesale-view-rewrite.late-stale-page`. No architectural membership proposed. |
| `test:protocol.wholesale-view-rewrite.stale-page-removed` | `test/self-hosting-projections.test.ts` | Keep verifier binding to `spec:consumers.wholesale-view-rewrite.stale-page-removed`. No architectural membership proposed. |

</details>
