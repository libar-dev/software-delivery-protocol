# Annotation review: a map of the engine

This design proposes a curated set of responsibilities a contributor needs to understand before changing the engine. Source anchors stay unchanged. The proposal recommends moving example-space decoding into the existing reader component without moving its file, adds missing shared contracts and policy stages, consolidates duplicate identities, and makes roles describe the work each unit does.

The source read is the lane base `44e62ef7b036ff3d1ce86d968ddf81ca735ebc75`; source bindings are unchanged, and graph measurements were repeated with this lane's carrier edits. The platform evidence reads the read-only copy of `sdp/design-at-scale` at `b038bd4`. Measurements below are re-derived review observations, not targets. Re-run the commands under Reproduction before accepting an anchor edit.

The law is the significance criterion in `spec:model.structural-patterns`, the keyed rules of `spec:protocol.structural-self-binding`, and the comment-form, binding-grain and architectural-annotation decisions. Proposed rules live in `spec:protocol.significant-units-review`; role meanings live in `spec:protocol.role-vocabulary`. Both state `defined`, and neither has an implementation binding. The owner still reviews the replacement accepted set.

## What the review found

1. Several shared boundaries were bare: the CLI argument and parameter codecs, YAML policy, import-fidelity check, diagram contract, HTML codec, recipe answer shapes, optional Studio inputs and browser proposal schema. A page catalog that actually selects pages also needs an identity. These are named below because changing them affects cooperating providers and callers.
2. Some identities name the same responsibility once per Spec. The proposed merges use plural targets and retain their current realization claims. A registration function that defines empty custom elements loses its own identity; the existing component entry already calls it and satisfies the same component contract.
3. Component uses misses real dependencies. Keep `projections → extract`: its Gherkin view imports the bare kind policy. Keep cli → notation absent because the adapter only follows an unused re-export. Assigning example-space decoding to reader avoids exposing a graph/notation/validate cycle; that boundary choice stays an owner question. Builder-only imports explain the other apparent omissions. Imports are evidence for these choices, never the source of the accepted set.
4. The role taxonomy separates presentation as `projection`, encoding as `codec`, filesystem publication as `publisher`, browser controls as `interaction` and disposable graph indexes as `index`. The last two are proposed corpus role values, not new Protocol concepts. `renderer` is a synonym of projection here; `utility` needs a responsibility review.

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

## Review method and identity grain

This annotation review accounts for each existing CodeNode exactly once and each source file without an anchor. Each proposal names its id, file, form, role, component, realization and design targets, and selected uses. Bare helpers name a consuming responsibility without gaining a file binding. Read source before interpreting import rankings. The source file remains the binding grain; declaration names below are review locators only.

One function or contract realizing several Specs normally has one identity with plural targets. Keep independent contracts, entry points or semantic policies in the same file only when a designer opens them for different changes. Component anchors remain grouping declarations at their realizing site, distinct from member identities. The review preserves every current realization target; a later source edit needs its own whole-Spec promise pass. The proposed skill text owns this general authoring guidance, not the accepted-set behavior Spec.

| File retaining several identities | Why the responsibilities remain independently useful |
| --- | --- |
| `src/model/anchors.ts` | The component declares the model boundary; the member owns the public anchor-envelope builders. |
| `src/graph/schema.ts` | Keep the component and one schema-contract member; merge its per-Spec graph-shape labels into that member. |
| `src/notation/slots.ts` | The component declares the leaf boundary; the member owns slot parsing and normalization. |
| `src/extract/index.ts` | Extraction composition, exclusion input and duplicate-id refusal are distinct pipeline, input-contract and honesty responsibilities. |
| `src/extract/derive.ts` | Entry-location derivation, Pack member ordering and full graph assembly have separate data-loss risks and separately read code paths. |
| `src/validate/validators.ts` | Each validator function can change or fail independently; the catalog identity owns aggregate composition and finding ids, while the component declares membership. |
| `src/validate/readiness-floor.ts` | The kind table, typed-dependency predicate, binding predicates, requested-rung evaluator and derived/stated-floor reading are independent policies or caller contracts over one clause table. |
| `src/reader/reader.ts` | Merge the duplicate reader/front-door labels; keep Pack boundary/design joins as a separately reviewed answer contract and the component as grouping. |
| `src/codegen/contracts.ts` | Step/space contracts and runnable registrars have separate output contracts and rendering paths; the component groups both. |
| `src/runner/index.ts` | Keep the execution member and its provider-neutral component declaration as different graph grains. |
| `src/adapters/vitest.ts` | The adapter component groups Vitest and TypeScript providers; this member implements the Vitest lifecycle alone. |
| `src/testing/index.ts` | The component declares the package boundary; the member implements the registrar runtime and comparator contract. |
| `src/projections/design-review.ts` | The component groups projections; DesignReviewPage is the output contract and renderDesignReview is its provider. |
| `src/projections/design-review-context.ts` | Readiness, binding presence and finding locations have separate render entry points and user meanings. |
| `src/projections/design-review-pages.ts` | Merge the two binding-presence labels; retain the Pack design page for its independent member and boundary composition. |
| `src/cli/build-command.ts` | Merge duplicate runBuild promises; retain the optional imports publication stage and the component declaration at their separate grains. |
| `src/cli/q-command.ts` | Argument/parameter parsing and query execution/result output are independently read entry paths. |
| `src/cli/sdp.ts` | Dispatcher orchestration and version presentation have different responsibilities and roles. |
| `src/cli/studio-command.ts` | A plain publication and the asynchronous watch lifecycle have independently callable entry points. |
| `src/cli/validate-view-command.ts` | Corpus-rule composition, terminal summaries and Design Review publication are separate callable paths. |
| `src/cli/vault-command.ts` | Synchronous vault publication and the asynchronous watch lifecycle are separate callable paths. |
| `src/import/import.ts` | The component groups conversion and emission; its core member owns source acceptance and conversion orchestration. |

## The component map and existing code-anchor dispositions

Every CodeNode appears once below, including the realization declarations outside `src`. A kept identity may cover several declarations in its one file. A file locator identifies where to read; the graph still records no symbol identity. Roles after an arrow are proposed. A keep with a relocation changes the binding site, not its identity or targets.

### model: the authored contracts and stable ids

Start with Spec, Pack, sections, relations and the closed anchor envelope. Descriptors and branded ids are shared currencies. The dependency-free anchors export is a real public boundary; the tiny codeAnchor copying function needs no separate identity.

Start here:

- **Spec envelope**, `src/model/spec.ts`, `contract`. A shape change affects every carrier and every caller that enriches a Spec.
- **Typed sections**, `src/model/sections.ts`, `contract`. Changing an owner or field changes carrier normalization and the readers of that content.
- **Anchor envelope**, `src/model/anchors.ts`, `contract`. Changing this contract affects both authoring forms and which bindings can be trusted.
- **Branded ids**, `src/ids.ts`, `codec`. Changing accepted id text affects authored relations, bindings and page addresses.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.model` | `src/model/anchors.ts` | not stated → contract | re-role. Spec, Pack, descriptor and anchor-envelope contracts dominate this public authoring boundary. |
| `impl:protocol.anchor-model` | `src/model/anchors.ts` | contract | keep. Label stands: binding-only anchor model builders. |
| `impl:protocol.anchors-subpath` | `src/anchors.ts` | contract | keep. The dependency-free package boundary lets constrained runtimes author bindings without loading the engine. |
| `impl:protocol.pack-aggregate` | `src/model/pack.ts` | contract | keep. Label stands: Pack aggregate and model references. |
| `impl:protocol.spec-descriptors` | `src/model/descriptors.ts` | contract | keep. Label stands: Spec kind, altitude, and readiness coordinates. |
| `impl:protocol.spec-primitive` | `src/model/spec.ts` | contract | keep. Label stands: Spec envelope and enrich-in-place shape. |
| `impl:protocol.spec-relations` | `src/model/relations.ts` | contract | keep. Label stands: declared Spec relation builders. |
| `impl:protocol.spec-sections` | `src/model/sections.ts` | contract | keep. Label stands: typed Spec section shapes. |
| `impl:protocol.stable-ids` | `src/ids.ts` | codec | keep. Label stands: stable ID grammar parser. |

</details>

### graph: the one graph and its semantic decisions

The versioned GraphSchema contract includes nodes, edge claims, locations and citations. Delivery facts, oracle eligibility and parent-vocabulary compatibility are independent semantic decisions. Entry-address resolution is a query over authored content.

Start here:

- **GraphSchema**, `src/graph/schema.ts`, `contract`. Changing nodes, edge claims or locations changes every validator and consumer of the one graph.
- **Delivery facts**, `src/graph/delivery-facts.ts`, `decider`. Changing resolution predicates changes implemented and verifier facts across CLI and reader answers.
- **Oracle eligibility**, `src/graph/oracle-bindings.ts`, `decider`. Changing target eligibility changes which expected-outcome bindings codegen may use.
- **Entry addresses**, `src/graph/entry-address.ts`, `reader`. Changing resolution changes checked mentions and source-citation joins together.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.graph` | `src/graph/schema.ts` | not stated → contract | re-role. The versioned graph shapes and semantic fact contracts are the currency every consumer shares. |
| `impl:protocol.delivery-facts` | `src/graph/delivery-facts.ts` | decider | keep. Label stands: computes delivery facts from resolving binding edges. |
| `impl:protocol.entry-address-resolution` | `src/graph/entry-address.ts` | utility → reader | re-role. resolves entry addresses for prose validation and citation readers. |
| `impl:protocol.example-space` | `src/graph/example-space.ts` | decider | keep. Label stands: resolves example-space vocabulary for contracts and floors. |
| `impl:protocol.graph-claims` | `src/graph/schema.ts` | contract | merge. Same-file responsibility moves to impl:protocol.schema-version; its complete target transfer is below. |
| `impl:protocol.graph-edge-types` | `src/graph/schema.ts` | contract | merge. Same-file responsibility moves to impl:protocol.schema-version; its complete target transfer is below. |
| `impl:protocol.oracle-target-eligibility` | `src/graph/oracle-bindings.ts` | decider | keep. Label stands: resolves oracle targets by example-space ownership across Spec kinds. |
| `impl:protocol.schema-version` | `src/graph/schema.ts` | contract | keep. Broaden the label to the versioned GraphSchema contract, including node, claim, edge and located-evidence shapes; keep the stable id used by stamp. |

</details>

### notation: the leaf step codec

SlotGroup and SlotDeclaredType pin the notation grammar. The proposed reader membership for example-space decoding keeps graph-reading and Finding production outside this leaf codec. The source directory alone does not select membership.

Start here:

- **Slot parser**, `src/notation/slots.ts`, `codec`. Changing slot or skeleton interpretation changes carrier keys, bound points and generated parameter types.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.notation` | `src/notation/slots.ts` | not stated → codec | re-role. The remaining membership owns slot parsing and skeleton normalization, with no graph query responsibility. |
| `impl:protocol.slot-notation` | `src/notation/slots.ts` | codec | keep. Label stands: parses slot groups and normalizes a step to its skeleton. |

</details>

### extract: the carrier and source pipeline

Read discovery, trusted bindings, CarrierReifier/CarrierReification, ReifiedSpec/ReifiedPack, AnchorEnvelope and its FieldReader port, graph derivation and canonical serialization. Each canonical carrier feeds the same reified boundary. The content stage, YAML policy and shared Gherkin refusal table need identities. The small Markdown result union stays bare under the parser's coarse-grain coverage.

Start here:

- **Extraction composition**, `src/extract/index.ts`, `extractor`. Changing stage order or duplicate exclusion changes which authored records enter the graph.
- **Carrier port**, `src/extract/carrier.ts`, `extractor`. Changing the reified boundary requires all carrier providers to agree before graph derivation.
- **Binding parser**, `src/extract/anchors.ts`, `extractor`. Changing envelope decoding affects both trusted constants and comment-form bindings.
- **Markdown owner mapping**, `src/extract/markdown-body.ts`, `codec`. Changing owner mapping can move prose or rules to the wrong typed owner.
- **YAML policy**, `src/extract/markdown-yaml-policy.ts`; comment, `codec; `component:protocol.extract``. Changing accepted scalar and relation forms changes Spec and Pack frontmatter together.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.extract` | `src/extract/index.ts` | not stated → extractor | re-role. Discovery, carrier reification and graph derivation form the authored-input pipeline. |
| `impl:protocol.anchor-extraction` | `src/extract/anchors.ts` | extractor | keep. AnchorEnvelope and its field readers apply the same closed contract to constant and comment forms. |
| `impl:protocol.authoring-normalization` | `src/extract/authoring-normalization.ts` | codec | keep. Label stands: normalizes rule markers and question fields after carrier reification. |
| `impl:protocol.carrier-reification` | `src/extract/carrier.ts` | extractor | keep. CarrierReifier and CarrierReification define the common stage contract across the canonical carriers. |
| `impl:protocol.derive-graph` | `src/extract/derive.ts` | extractor | keep. Label stands: derives the graph from reified carriers and bindings. |
| `impl:protocol.discover-files` | `src/extract/discover.ts` | extractor | keep. Discovery selects canonical carriers and source candidates with explicit exclusions and deterministic order. |
| `impl:protocol.duplicate-id-exclusion` | `src/extract/index.ts` | validator | keep. Label stands: excludes duplicated carrier ids from the graph. |
| `impl:protocol.entry-citation-scan` | `src/extract/entry-citations.ts` | extractor | keep. The source scanner emits inferred located citations only for anchored source files. |
| `impl:protocol.entry-locations` | `src/extract/derive.ts` | extractor | keep. The graph builder maps authored entry positions into the separate location table. |
| `impl:protocol.envelope-contract` | `src/extract/markdown.ts → src/extract/markdown-frontmatter.ts` | codec | keep. Move this identity to the actual frontmatter parser; the wrapper currently only forwards its input. |
| `impl:protocol.exclusion-surface` | `src/extract/index.ts` | contract | keep. Label stands: strict root-relative exclusion input for both extraction surfaces. |
| `impl:protocol.extract` | `src/extract/index.ts` | extractor | keep. Label stands: extracts authored carriers and bindings into one graph. |
| `impl:protocol.gherkin-authoring` | `src/extract/gherkin.ts` | extractor | keep. Label stands: reifies Gherkin behavior and example authoring into the one carrier path. |
| `impl:protocol.inline-code-spans` | `src/extract/markdown-inline-code.ts` | codec | keep. Label stands: scans raw HTML outside matched code spans. |
| `impl:protocol.key-markers` | `src/extract/key-markers.ts` | codec | keep. Label stands: normalizes step and term markers across the three carriers. |
| `impl:protocol.markdown-authoring` | `src/extract/markdown.ts` | extractor | merge. Same-file responsibility moves to impl:protocol.markdown-parser; its complete target transfer is below. |
| `impl:protocol.markdown-body-grammar` | `src/extract/markdown-body.ts` | codec | keep. The body parser assigns typed owners, rejects unsupported syntax and owns narrative placement; absorb the forwarding prose-ownership identity. |
| `impl:protocol.markdown-pack-authoring` | `src/extract/markdown-pack.ts` | extractor | keep. Label stands: reifies the Markdown Pack manifest into the one carrier path. |
| `impl:protocol.markdown-parser` | `src/extract/markdown.ts` | extractor | keep. One carrier boundary selects Spec or Pack reification; plural targets retain the authored-carrier and parser contracts. |
| `impl:protocol.open-question-keys` | `src/extract/markdown-body-owner-behavior.ts` | codec | keep. Label stands: reads an open question's optional key from its Markdown marker and refuses a bad or repeated key. |
| `impl:protocol.open-section-order` | `src/extract/serialize.ts` | codec | keep. Canonical serialization preserves authored open-entry order while sorting the regenerable graph structure. |
| `impl:protocol.pack-member-order` | `src/extract/derive.ts` | extractor | keep. The Pack-node derivation preserves authored manifest order while membership edges stay set-like. |
| `impl:protocol.prose-ownership` | `src/extract/markdown.ts` | codec | merge. The forwarding wrapper gives way to the actual body parser; its complete target transfer is below. |
| `impl:protocol.protocol-bindings` | `src/extract/protocol-bindings.ts` | extractor | keep. The trusted package and relative-module resolution policy decides which calls are authoritative authoring. |
| `impl:protocol.static-reification` | `src/extract/reify.ts` | extractor | keep. ReifiedSpec, ReifiedPack, static-value decoding and trusted-builder resolution form the TypeScript carrier boundary. |

</details>

### validate: one finding currency and ordered checks

Finding, ValidationReport and Validator are shared contracts. GraphIndex supplies disposable lookup maps. The kind-evidence table and ordered floor clauses govern both stated and derived readings. The finding-id catalog and validateGraph composition are the check catalog; individual checks keep identities because their guarantees change independently.

Start here:

- **Finding currency**, `src/validate/contracts.ts`, `contract`. Changing the shared report shape affects every validator, publisher and corpus rule.
- **Disposable lookup maps**, `src/validate/graph-index.ts`, `index`. Changing edge indexes affects validator and reader joins over the same graph.
- **Floor evaluator**, `src/validate/readiness-floor.ts`, `validator`. Changing clause order changes stated failures and the structurally reachable rung.
- **Validator catalog**, `src/validate/validators.ts`, `contract`. Changing catalog composition can omit a check or give a finding the wrong family.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.validate` | `src/validate/validators.ts` | not stated → validator | re-role. Its members evaluate graph contracts and report failures in one finding currency. |
| `impl:protocol.authored-honesty-delivery-facts` | `src/validate/validators.ts` | validator | keep. Label stands: checks stated delivery facts equal the one recomputed derivation. |
| `impl:protocol.authored-honesty-shape` | `src/validate/validators.ts` | validator | keep. Label stands: refuses delivery facts smuggled through authored section carriers. |
| `impl:protocol.claim-separation` | `src/validate/validators.ts` | validator | keep. Label stands: checks graph claims, descriptors, node shapes, and relation endpoint contracts. |
| `impl:protocol.duplicate-ids` | `src/validate/validators.ts` | validator | keep. Label stands: rejects duplicate node identities from any graph producer. |
| `impl:protocol.graph-index` | `src/validate/graph-index.ts` | utility → index | re-role. GraphIndex builds disposable node and edge lookup maps over the one graph; it owns no second read model. |
| `impl:protocol.kind-evidence` | `src/validate/readiness-floor.ts` | contract → decider | re-role. The per-kind evidence table computes what counts as scoped and complete evidence for the same floor evaluator. |
| `impl:protocol.next-rung-floor` | `src/validate/readiness-floor.ts` | validator | keep. The shared evaluator reports exact clause failures for an explicitly requested rung. |
| `impl:protocol.oracle-linkage` | `src/validate/validators.ts` | validator | keep. Label stands: resolves and de-duplicates expected-outcome oracle bindings. |
| `impl:protocol.orphan-signal` | `src/validate/validators.ts` | validator | keep. Label stands: surfaces relationless Specs as informative orphan warnings. |
| `impl:protocol.pack-coherence` | `src/validate/validators.ts` | validator | keep. Label stands: checks Pack membership agreement and uniqueness and model-reference kinds. |
| `impl:protocol.prose-mentions` | `src/validate/validators.ts` | validator | keep. Label stands: checks that prose mentions resolve and warns once per unbacked Spec pair. |
| `impl:protocol.readiness-floor` | `src/validate/readiness-floor.ts` | validator | keep. The stated-floor check and derived rung use the same ordered clause table. |
| `impl:protocol.referential-integrity` | `src/validate/validators.ts` | validator | keep. Label stands: checks every graph edge endpoint and Pack model reference resolves. |
| `impl:protocol.rule-exercises` | `src/validate/validators.ts` | validator | keep. Label stands: checks the keys named by declared verifies relations. |
| `impl:protocol.structural-anchors` | `src/validate/validators.ts` | validator | keep. Label stands: checks structural anchor validity and disjoint realization and reference targets. |
| `impl:protocol.superseded-decision-signal` | `src/validate/validators.ts` | validator | keep. Label stands: walks decision replacements to surface stale shaping relations. |
| `impl:protocol.typed-dependency-floor` | `src/validate/readiness-floor.ts` | validator | keep. Label stands: checks stated readiness across all four typed dependencies. |
| `impl:protocol.unbound-example-posture` | `src/validate/validators.ts` | validator | keep. Label stands: limits unbound example warnings to stated ready. |
| `impl:protocol.validation-contracts` | `src/validate/contracts.ts` | contract | keep. Label stands: conformance/honesty family currency and finding shapes. |
| `impl:protocol.validation-families` | `src/validate/validators.ts` | contract | keep. The finding-id catalog and validateGraph composition are the single aggregate validation entry. |
| `impl:protocol.verifier-gap-signal` | `src/validate/validators.ts` | validator | keep. Label stands: surfaces ready Specs without recomputed verifier bindings as informative gaps. |
| `impl:protocol.verifier-semantics` | `src/validate/readiness-floor.ts` | validator | keep. The readiness binding predicates keep verifier presence distinct from runner execution. |
| `impl:protocol.verifies-linkage` | `src/validate/validators.ts` | validator | keep. Label stands: resolves declared example verification through enabled test bindings. |

</details>

### reader: the typed graph contract and body evaluator

Reader, SpecContext, PackContext, CodeUnitBinding and BlastRadius are the public query contract. Pack design and boundary joins are a distinct responsibility inside it. The body evaluator supplies the five bindings and loads shipped recipe bodies; its parse-position handling belongs to that evaluator. Concept matching is shared with browser search.

Start here:

- **Reader contract**, `src/reader/reader.ts`, `reader`. Changing query joins changes CLI bodies, recipes and all page providers.
- **Pack design joins**, `src/reader/reader.ts`, `reader`. Changing boundary or member assembly changes how a Pack reads as one design.
- **Example-space decoder**, `src/notation/example-space.ts`, `codec`. Changing graph interpretation changes contract generation and SpecContext example cards.
- **Body evaluator**, `src/reader/evaluate-body.ts`, `service`. Changing binding injection or recipe loading changes both queries and selected corpus rules.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `api:protocol.evaluate-body` | `src/reader/evaluate-body.ts` | service | keep. Label stands: evaluates bodies and shipped recipes over one in-memory reader, graph and report. |
| `component:protocol.reader` | `src/reader/reader.ts` | not stated → reader | re-role. Query contracts and joins dominate; example-space decoding supplies those joins rather than an independent model. |
| `impl:protocol.agent-surface` | `src/reader/reader.ts` | reader | merge. Same-file responsibility moves to impl:protocol.reader; its complete target transfer is below. |
| `impl:protocol.example-space-decoding` | `src/notation/example-space.ts` | codec | keep; reassign notation → reader, pending the owner question. Decodes graph-owned vocabulary and emits the shared Finding currency; the source file stays where it is. |
| `impl:protocol.entry-citation-reader` | `src/reader/entry-citations.ts` | reader | keep. Label stands: resolves citations and joins file anchors with direct and example-based test verification. |
| `impl:protocol.pack-design` | `src/reader/reader.ts` | reader | keep. PackMemberDesign and boundary assembly define the design reading shared by recipes and publishers. |
| `impl:protocol.query-answer-shapes` | `src/reader/evaluate-body.ts` | service | merge. Same-file responsibility moves to api:protocol.evaluate-body; its complete target transfer is below. |
| `impl:protocol.reader` | `src/reader/reader.ts` | reader | keep. Reader, SpecContext, PackContext, file reach and their joins are the public query boundary; absorb the second name for its agent entry adapters. |
| `impl:protocol.studio-concept-match` | `src/reader/concept-match.ts` | utility → reader | re-role. The graph and browser share deterministic concept matching and its matched-field contract. |

</details>

### codegen: contracts and registrar output

GeneratedContracts separates contract files, registrar siblings and findings. Space and step contracts and runnable registrar rendering are separate output responsibilities in the same generator, consumed by the CLI and testing runtime.

Start here:

- **Contract projection**, `src/codegen/contracts.ts`, `projection`. Changing slot types or outcome unions changes the type contract authored worlds compile against.
- **Registrar projection**, `src/codegen/contracts.ts`, `projection`. Changing generated dispatch or adoption paths changes which authored suites execute which point.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.codegen` | `src/codegen/contracts.ts` | not stated → projection | re-role. Its members derive typed example and registrar content from graph-owned vocabulary. |
| `impl:protocol.executable-contracts` | `src/codegen/contracts.ts` | projection | keep. Label stands: derives step and example-space contracts from the graph. |
| `impl:protocol.runnable-modules` | `src/codegen/contracts.ts` | projection | keep. Label stands: derives and publishes runnable registrar modules from the graph. |

</details>

### runner: provider-neutral example execution

ExampleContract and StepBindings pin authored parameters and handler keys. planExample produces a sequence the runtime executes against the caller world. Failure rendering names the authored step; it never writes verdicts back to the graph.

Start here:

- **Provider-neutral runner**, `src/runner/index.ts`, `service`. Changing the planned step sequence or world lifecycle affects every runtime adapter.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.runner` | `src/runner/index.ts` | not stated → service | re-role. The member coordinates planned steps against provider ports and a caller-supplied world. |
| `impl:protocol.example-runner` | `src/runner/index.ts` | service | keep. ExampleContract, StepBindings and the planned step sequence are the provider-neutral execution boundary. |

</details>

### adapters: external runtime and source adapters

Vitest registration implements the runner boundary. The TypeScript imports adapter owns ImportsFile and barrel reach; that output is external inferred input for curation, not anchored architecture. The adapters component keeps those responsibilities together without making imports into intent.

Start here:

- **Vitest adapter**, `src/adapters/vitest.ts`, `adapter`. Changing registration or fresh-world setup changes isolation between executable examples.
- **Imports adapter**, `src/adapters/typescript-imports.ts`, `adapter`. Changing barrel reach or roots changes curation evidence, which still confers no architecture.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.adapters` | `src/adapters/vitest.ts` | not stated → adapter | re-role. Its members connect Vitest and the TypeScript program to engine-owned contracts. |
| `impl:protocol.example-runner-adapter` | `src/adapters/vitest.ts` | adapter | keep. Label stands: registers one test per example and owns the fresh world lifecycle. |
| `impl:protocol.typescript-imports` | `src/adapters/typescript-imports.ts` | adapter | keep. Label stands: TypeScript file imports and barrel reach for external curation input. |

</details>

### testing: the generated registrar runtime

RunnableExampleAdapters is the provider port. RunnableExampleWorld records local execution state, and the comparator checks observed, expected and Spec-authored outcomes. This is runtime integration, not an undifferentiated utility.

Start here:

- **Registrar runtime**, `src/testing/index.ts`, `adapter`. Changing the three-way comparison can let a Spec mutation pass without checking its authored outcome.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.testing` | `src/testing/index.ts` | not stated → adapter | re-role. Its registrar runtime connects generated suites, worlds and the provider-neutral runner. |
| `impl:protocol.example-testing-helpers` | `src/testing/index.ts` | utility → adapter | re-role. RunnableExampleAdapters and the three-way comparator connect generated registrars to Vitest and oracle semantics. |

</details>

### projections: read-only output, layout and owned publication

Design Review, census, Mermaid, Gherkin, Studio and vault rendering consume the graph or reader. StudioData and StudioRecipeAnswers cache build answers; SearchIndex crosses into the browser. DiagramInput and the band/context folding policies feed deterministic SVG layout. Page and register contracts, encoding and the page catalog are proposed additions. VaultState/FileList and synchronization guards own a distinct publication protocol inside this existing component.

Start here:

- **Diagram contract**, `src/projections/studio/diagrams/model.ts`; comment, `contract; `component:protocol.projections``. Changing boxes, edges or bounds requires diagram producers and SVG layout to agree.
- **Deterministic layout**, `src/projections/studio/diagrams/svg.ts`, `projection`. Changing label metrics or folding geometry can hide recorded structure or make the page unreadable.
- **Studio data contract**, `src/projections/studio/data.ts`, `contract`. Changing cache and search shapes affects build-time pages and browser search together.
- **Recipe evaluation**, `src/projections/studio/recipes.ts`, `service`. Changing evaluation frequency or diagnostics can give pages inconsistent answers for one build.
- **Page catalog**, `src/projections/studio/pages/index.ts`; comment, `projection; `component:protocol.projections``. Changing page selection changes the published page set, optional input pages and Pack exports.
- **Owned-folder publication**, `src/projections/vault/sync.ts`, `publisher`. Changing manifest or recovery rules can overwrite user material or leave stale notes looking current.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.projections` | `src/projections/design-review.ts` | not stated → projection | re-role. Most reviewed members own read-only pages, notes and diagrams; publishers and shared contracts support that presentation responsibility. |
| `impl:protocol.binding-language-index-table` | `src/projections/design-review-pages.ts` | renderer → projection | re-role. Renders index and Pack-table binding language as present or none; absorb the same-file pack-table identity. |
| `impl:protocol.binding-language-pack-table` | `src/projections/design-review-pages.ts` | renderer | merge. Move to impl:protocol.binding-language-index-table; the shared binding-presence rendering has one target and one file owner. |
| `impl:protocol.binding-language-spec-page` | `src/projections/design-review-context.ts` | renderer → projection | re-role. renders implementation, verifier, oracle, and observation binding language. |
| `impl:protocol.census-page` | `src/projections/census.ts` | projection | keep. Label stands: renders the derived census and runtime taxonomy projection. |
| `impl:protocol.derived-readiness-banner` | `src/projections/design-review-context.ts` | renderer → projection | re-role. renders stated readiness beside the structural floor and dishonest divergence. |
| `impl:protocol.design-review` | `src/projections/design-review.ts` | projection | keep. Label stands: renders the contextual Design Review projection. |
| `impl:protocol.diagnostic-rendering-design-review` | `src/projections/design-review-context.ts` | renderer → projection | re-role. renders structured finding locations in the Design Review table. |
| `impl:protocol.gherkin-view` | `src/projections/gherkin-view.ts` | projection | keep. Label stands: renders a generated Gherkin-shaped READ projection of any Spec. |
| `impl:protocol.mermaid-view` | `src/projections/mermaid.ts` | projection | keep. Label stands: renders bounded Spec one-hop and Pack membership diagrams. |
| `impl:protocol.pack-design-page` | `src/projections/design-review-pages.ts` | renderer → projection | re-role. renders the Pack page from the Pack design. |
| `impl:protocol.pack-design-sections` | `src/projections/design-review-pack-sections.ts` | renderer → projection | re-role. The Pack design sections own how boundary, next-rung, questions and bindings are presented; use projection consistently. |
| `impl:protocol.projections-model` | `src/projections/design-review.ts` | contract | keep. The DesignReviewPage output shape and projection boundary are shared with the CLI publisher. |
| `impl:protocol.studio-architecture-diagrams` | `src/projections/studio/diagrams/architecture.ts` | projection | keep. Context and layer folding decide which components remain drawn while preserving crossing edges. |
| `impl:protocol.studio-architecture-lens` | `src/projections/studio/pages/architecture-page.ts` | projection | keep. Label stands: renders recipe component rows and planned designs as architecture and member diagrams. |
| `impl:protocol.studio-code-spans` | `src/projections/studio/pages/code-spans.ts` | codec | keep. The code-span encoder is shared with browser controls and preserves literal code without promoting it to markup. |
| `impl:protocol.studio-data` | `src/projections/studio/data.ts` | projection → contract | re-role. StudioData and SearchIndex pin the build-time cache and browser wire shape all page providers share. |
| `impl:protocol.studio-diagrams` | `src/projections/studio/diagrams/svg.ts` | projection | keep. The deterministic SVG layout owns box metrics, band geometry, connectors and the text equivalent; it is presentation, not browser interaction. |
| `impl:protocol.studio-diff` | `src/projections/studio/pages/diff-page.ts` | projection | keep. The design-diff page keeps declared changes and binding changes separate for reviewers. |
| `impl:protocol.studio-evidence-lens` | `src/projections/studio/pages/evidence-page.ts` | projection | keep. Label stands: names the four evidence sources and what would bring each into the Studio. |
| `impl:protocol.studio-frame` | `src/projections/studio/pages/frame.ts` | projection | keep. The page frame owns navigation, responsive structure and the placement of optional composing controls. |
| `impl:protocol.studio-glossary` | `src/projections/studio/pages/glossary-page.ts` | projection | keep. The glossary page presents authored Model terms with resolvable term-address links. |
| `impl:protocol.studio-index-page` | `src/projections/studio/pages/index-page.ts` | projection | keep. The Pack lens owns the corpus entry and navigation by authored grouping. |
| `impl:protocol.studio-maturity-map` | `src/projections/studio/pages/maturity-map.ts` | projection | keep. Label stands: places resolved Pack members by their stated rung and floor in authored order. |
| `impl:protocol.studio-owner-queue` | `src/projections/studio/pages/queue-page.ts` | projection | keep. The statement queue presents waiting human statements and questions without conferring readiness. |
| `impl:protocol.studio-pack-export` | `src/projections/studio/pages/export-page.ts` | projection | keep. Label stands: copies rendered canvas content into one inline-styled document with prefixed element references. |
| `impl:protocol.studio-pack-page` | `src/projections/studio/pages/pack-page.ts` | projection | keep. The Pack page composes its members, maturity reading and shared design answers for a reviewer. |
| `impl:protocol.studio-paths` | `src/projections/studio/paths.ts` | utility → codec | re-role. The reversible id-to-page naming convention is shared by build rendering and browser search. |
| `impl:protocol.studio-publish` | `src/projections/studio/publish.ts` | publisher | keep. Label stands: copies local assets and replaces the Studio directory through its temporary sibling. |
| `impl:protocol.studio-recipes` | `src/projections/studio/recipes.ts` | projection → service | re-role. Coordinates shipped recipe evaluations once per build and shares their answers with page renderers. |
| `impl:protocol.studio-registers` | `src/projections/studio/pages/registers-page.ts` | projection | keep. The register pages present questions, decisions, declarations and backlog from shipped query answers. |
| `impl:protocol.studio-relation-diagrams` | `src/projections/studio/diagrams/bands.ts` | projection | keep. Relation, membership and realization band policies determine the diagram slice before SVG layout. |
| `impl:protocol.studio-run-rows` | `src/projections/studio/pages/run-rows.ts` | projection | keep. Label stands: renders recipe 45 file rows shared by the runs page and verification panel. |
| `impl:protocol.studio-runs-page` | `src/projections/studio/pages/runs-page.ts` | projection | keep. Label stands: renders readable CTRF inputs, file results, unjoined records and diagnostics. |
| `impl:protocol.studio-search-page` | `src/projections/studio/pages/search-page.ts` | projection | keep. The search entry publishes the serialized search-index contract consumed by the browser. |
| `impl:protocol.studio-spec-page` | `src/projections/studio/pages/spec-page.ts` | projection | keep. The Spec page composes authored intent, relation evidence and implementation bindings. |
| `impl:protocol.studio-spec-structure` | `src/projections/studio/pages/spec-structure.ts` | projection | keep. Label stands: renders realization and trace diagrams and the recorded structural neighborhood. |
| `impl:protocol.studio-tests-lens` | `src/projections/studio/pages/tests-page.ts` | projection | keep. Label stands: renders shared rule and example-space coverage with filters and verifier bindings. |
| `impl:protocol.studio-text` | `src/projections/studio/pages/text.ts` | codec | keep. The text codec resolves checked mentions and preserves inline-code presentation across Studio pages. |
| `impl:protocol.studio-verification-panels` | `src/projections/studio/pages/spec-verification.ts` | projection | keep. Label stands: renders rule coverage, example cards, constraint targets, verifiers and example-space coverage. |
| `impl:protocol.vault-bases` | `src/projections/vault/bases.ts` | projection | keep. Standing .base views are a public projection contract for how a vault is read. |
| `impl:protocol.vault-notes` | `src/projections/vault/notes.ts` | projection | keep. The note projection owns linked Spec, Pack and code-note content and file-name collision refusal. |
| `impl:protocol.vault-sections` | `src/projections/vault/sections.ts` | projection | keep. The section projection preserves keyed blocks and their entry-address links. |
| `impl:protocol.vault-sync` | `src/projections/vault/sync.ts` | publisher | keep. The vault manifest, guards, hashes and temporary-file recovery are an owned-folder synchronization protocol. |
| `impl:protocol.vault-text` | `src/projections/vault/text.ts` | codec | keep. The encoder owns note-path and entry-link encoding, frontmatter values and prose escaping. |

</details>

### studio-elements: optional browser behavior and proposal handoff

The entry registers optional controls. View-box pan/zoom acts on already laid out SVG. Search consumes the serialized index and shared concept matcher. IntentPanel owns storage and partition; its element owns controls and feedback. Proposal/ProposalChange and proposalProblems need a contract identity. Empty element registrations do not need their own identity.

Start here:

- **Proposal contract**, `src/studio-elements/proposal.ts`; comment, `contract; `component:protocol.studio-elements``. Changing the browser handoff shape must remain compatible with the checker and shipped schema.
- **Intent partition**, `src/studio-elements/intent-panel.ts`, `service`. Changing request partition can lose intent that cannot be expressed in a proposal.
- **Diagram controls**, `src/studio-elements/diagram.ts`, `interaction`. Changing view-box controls must preserve the build-rendered diagram and its text equivalent.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.studio-elements` | `src/studio-elements/index.ts` | not stated → interaction | re-role. Optional controls dominate its members; build-time joins and layout stay in projections. |
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

</details>

### cli: entry points, shared build and publication

runSdpCli is the public dispatcher. BuildArgs/RulesInput, parameter decoding, BuildOutcome and hooks are its shared ports. runBuild owns extraction, deterministic comparison, confined registrars and output invalidation. Query and corpus-rule evaluation remain separate use cases; the latter needs an identity at its actual runner. Watch sources are injectable ports inside the existing watch responsibility, and publication hooks select replaceable renderers.

Start here:

- **Shared build**, `src/cli/build-command.ts`, `service`. Changing invalidation or registrar confinement affects every publisher and safe recovery.
- **Argument codec**, `src/cli/build-args.ts`; comment, `codec; `component:protocol.cli``. Changing shared flags affects all publishers and selected corpus-rule inputs.
- **Query entry**, `src/cli/q-command.ts`, `service`. Changing body input or result output affects scripts that consume the agent front door.
- **Rule runner**, `src/cli/corpus-rules.ts`; comment, `service; `component:protocol.cli``. Changing result validation can mix corpus failures into Protocol findings.
- **Import publication**, `src/cli/import-publish.ts`, `publisher`. Changing exclusive staging or rollback can clobber a sibling or leave a partial batch.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.cli` | `src/cli/build-command.ts` | not stated → service | re-role. The dispatcher and shared build coordinate use cases; publisher and codec members support that primary orchestration responsibility. |
| `impl:protocol.adopter-help` | `src/cli/help.ts` | service → projection | re-role. Presents the package help-text catalog; it coordinates no use case. |
| `impl:protocol.agent-surface-cli` | `src/cli/sdp.ts` | service | keep. Label stands: CLI verb dispatcher and agent-surface front of the package CLI. |
| `impl:protocol.build-artifacts` | `src/cli/build-artifacts.ts` | publisher | keep. The catalog-to-dist publisher and engine commit stamp are package contracts; contributors change these before changing shipped recipes. |
| `impl:protocol.build-imports` | `src/cli/build-command.ts` | publisher | keep. This optional pipeline stage emits explicitly inferred file imports, kept apart from the authored graph. |
| `impl:protocol.build-pipeline-emit` | `src/cli/build-command.ts` | service | keep. The shared build owns extraction, deterministic output comparison, registrar confinement and projection invalidation; merge its duplicate promise labels here. |
| `impl:protocol.build-pipeline-query` | `src/cli/q-command.ts` | service | keep. Label stands: runQuery reads one body, derives the graph once for the reader, raw graph and report, and prints the return or refuses on stderr. |
| `impl:protocol.census-page-cli` | `src/cli/census-command.ts` | publisher | keep. Label stands: publishes the census through the explicit `sdp census` surface. |
| `impl:protocol.corpus-rules` | `src/cli/validate-view-command.ts` | service | keep. Label stands: runs copied rule bodies after Protocol validation and composes the separate corpus report, output and exit. |
| `impl:protocol.diagnostic-rendering-cli` | `src/cli/output.ts` | renderer → codec | re-role. The diagnostic codec turns one finding currency into a located line for terminal users. |
| `impl:protocol.engine-provenance-cli` | `src/cli/sdp.ts` | service → projection | re-role. Presents the built engine version and commit at the dispatcher; no pipeline orchestration belongs to this identity. |
| `impl:protocol.extraction-determinism` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.generate-command` | `src/cli/generate-command.ts` | publisher | keep. Label stands: prepares all prior roots before one shared build and publishes with each verb's checks. |
| `impl:protocol.gherkin-view-cli` | `src/cli/gherkin-command.ts` | publisher | keep. Label stands: publishes the Gherkin view through the explicit `sdp gherkin` surface. |
| `impl:protocol.mermaid-view-cli` | `src/cli/mermaid-command.ts` | publisher | keep. Label stands: publishes Mermaid through the explicit `sdp mermaid` surface. |
| `impl:protocol.query-params` | `src/cli/q-command.ts` | service | keep. Label stands: reads --params as JSON data and injects it as the sink's fourth binding, params. |
| `impl:protocol.regenerability` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.sdp-import` | `src/cli/import-command.ts` | service | keep. Label stands: plans, refuses, and publishes TypeScript-to-Markdown Spec imports. |
| `impl:protocol.sdp-import-publish` | `src/cli/import-publish.ts` | service → publisher | re-role and re-target references → satisfies spec:carrier.sdp-import; references becomes empty. Owns exclusive staging, atomic no-clobber publication and rollback. Keep all other realizing units. |
| `impl:protocol.sdp-import-scan` | `src/cli/import-scan.ts` | service | keep and re-target references → satisfies spec:carrier.sdp-import; references becomes empty. Owns source selection, exclusions and physical-identity deduplication. Keep all other realizing units. |
| `impl:protocol.spec-scaffolder` | `src/cli/new-spec-command.ts` | service | keep. Label stands: scaffolds an honest idea-rung Markdown Spec through `sdp new spec`. |
| `impl:protocol.stamp-command` | `src/cli/stamp-command.ts` | publisher | keep. Label stands: writes the publishing stamp without extraction or rendering. |
| `impl:protocol.studio-base-input` | `src/cli/studio-inputs.ts` | codec | keep. Optional base and run readers check placement and parsing before a publisher invalidates output. |
| `impl:protocol.studio-build-invalidation` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.studio-command` | `src/cli/studio-command.ts` | publisher | keep. Label stands: validates and renders the Studio with independent byte checks and diagnostic exit codes. |
| `impl:protocol.studio-watch` | `src/cli/studio-command.ts` | service | keep. Label stands: awaits the plain Studio publication in each coalesced carrier-watch cycle. |
| `impl:protocol.validate-summary` | `src/cli/validate-view-command.ts` | renderer → codec | re-role. The diagnostic codec summarizes errors and warnings without assigning the aggregate one family. |
| `impl:protocol.validate-watch` | `src/cli/validate-watch.ts` | service | keep. Label stands: watches carrier directories and coalesces events into a pending validation rerun. |
| `impl:protocol.vault-command` | `src/cli/vault-command.ts` | publisher | keep. Label stands: validates after vault preflight and retains prior notes behind a failed-extraction index. |
| `impl:protocol.vault-watch` | `src/cli/vault-command.ts` | service | keep. Label stands: reuses the coalescing watcher with source suffixes and a synchronous vault cycle. |
| `impl:protocol.wholesale-view-build-invalidation` | `src/cli/build-command.ts` | service | merge. Same-file responsibility moves to impl:protocol.build-pipeline-emit; its complete target transfer is below. |
| `impl:protocol.wholesale-view-rewrite` | `src/cli/validate-view-command.ts` | publisher | keep. Label stands: publishes each Design Review as one wholesale temporary-directory replacement. |

</details>

### import: canonical conversion with a fidelity boundary

ImportResult and the import use case compose static reification, emission and explicit refusals. The Markdown emitter is a codec. Its reparse comparator owns the no-loss check and warrants an identity; record/text accessors remain helpers.

Start here:

- **Conversion use case**, `src/import/import.ts`, `service`. Changing source acceptance must keep the canonical TypeScript reifier as the only acceptance path.
- **Markdown emitter**, `src/import/emit-markdown.ts`, `codec`. Changing serialization can lose an owned section, relation reason or keyed entry.
- **Fidelity comparison**, `src/import/markdown-fidelity.ts`; comment, `validator; `component:protocol.import``. Changing normalization can accept semantic loss in an emitted Markdown sibling.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and design use |
| --- | --- | --- | --- |
| `component:protocol.import` | `src/import/import.ts` | not stated → service | re-role. The core coordinates reification, emission and fidelity checks; the emitter supplies its codec. |
| `impl:protocol.sdp-import-core` | `src/import/import.ts` | service | keep. The import use case reifies a canonical source, emits Markdown and refuses a lossy result. |
| `impl:protocol.sdp-import-markdown-emit` | `src/import/emit-markdown.ts` | codec | keep. The emitter serializes every owned section and calls the fidelity check before returning content. |

</details>

### Realizations outside engine membership

These code anchors realize shipped recipes, guidance, corpus declarations and audits through asserting suites. They are retained as explicit exceptions, not fabricated members of the reader or model components. Their file locations describe the realization convention, not the product architecture.

The ledger below preserves the independent declarations for recipes, documents and audits. They are deliberate exceptions to product membership.

<details>
<summary>Complete identity dispositions</summary>

| Identity | File | Role | Disposition and reason |
| --- | --- | --- | --- |
| `impl:protocol.address-and-cycle-recipes` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of the shipped address resolution and dependency cycle recipes. |
| `impl:protocol.adopter-on-ramp` | `test/skills.test.ts` | not stated | keep. Label stands: asserts realization of the shipped adopter teaching in the authoring skill. |
| `impl:protocol.answer-shape-recipes` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of the catalog's compact and detailed answers. |
| `impl:protocol.architecture-walk-recipe` | `test/architecture-recipes.test.ts` | not stated | keep. Label stands: asserts realization of the shipped architecture walk recipe. |
| `impl:protocol.authoring-grammar-recipes` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts the authoring grammar's realization in docs/agent-surface/recipes.md. |
| `impl:protocol.authoring-on-ramp` | `test/skills.test.ts` | not stated | keep. Label stands: asserts realization of the shipped graph-first authoring skill document. |
| `impl:protocol.authoring-recipes` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of the shipped authoring recipe catalog. |
| `impl:protocol.capability-adoption-recipe` | `test/upgrade-kit.test.ts` | projection | keep. Label stands: realizes capability adoption in the shipped recipe catalog. |
| `impl:protocol.context-bundle-recipe` | `test/iteration-recipes.test.ts` | projection | keep. Label stands: realizes the context bundle in the shipped recipe catalog. |
| `impl:protocol.curation-recipe` | `test/curation-recipes.test.ts` | not stated | keep. Label stands: asserts the curation report over external inferred imports. |
| `impl:protocol.delivery-session-on-ramp` | `test/skills.test.ts` | not stated | keep. Label stands: asserts realization of the shipped advisory delivery-session skill document. |
| `impl:protocol.design-diff-recipe` | `test/iteration-recipes.test.ts` | projection | keep. Label stands: realizes the design diff in the shipped recipe catalog. |
| `impl:protocol.design-recipes` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of the shipped design recipes. |
| `impl:protocol.entry-citation-recipe` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of Entry citations in docs/agent-surface/recipes.md. |
| `impl:protocol.entry-location-recipes` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of the entry lines the entry search and address resolution recipes return. |
| `impl:protocol.example-space-coverage-recipe` | `test/studio-s1.test.ts` | not stated | keep. Label stands: asserts realization of shipped recipe 44. |
| `impl:protocol.external-registers-recipe` | `test/external-registers.test.ts` | not stated | keep. Label stands: asserts realization of the shipped external-registers recipe. |
| `impl:protocol.graph-first-planning` | `test/skills.test.ts` | not stated | keep. Label stands: realizes placement homes and advisory session guidance in the shipped skills. |
| `impl:protocol.perspective-filter-recipe` | `test/iteration-recipes.test.ts` | projection | keep. Label stands: realizes the perspective filter in the shipped recipe catalog. |
| `impl:protocol.planned-components-recipe` | `test/architecture-recipes.test.ts` | not stated | keep. Label stands: asserts realization of the shipped planned against realized components recipe. |
| `impl:protocol.proposal-memo-recipe` | `test/recipes.test.ts` | not stated | keep. Label stands: realizes the catalog proposal memo through its verbatim body check. |
| `impl:protocol.proposal-schema-and-recipe` | `test/iteration-recipes.test.ts` | contract | keep. Label stands: realizes the shipped proposal schema and proposal check in the recipe catalog. |
| `impl:protocol.reading-on-ramp` | `test/skills.test.ts` | not stated | keep. Label stands: asserts realization of the shipped graph-reading skill document. |
| `impl:protocol.recipe-parameters-catalog` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of the catalog recipes that read their parameter from params. |
| `impl:protocol.register-recipes` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of the shipped register recipes. |
| `impl:protocol.rule-key-proposal-recipe` | `test/upgrade-kit.test.ts` | projection | keep. Label stands: realizes the rule-key proposal in the shipped recipe catalog. |
| `impl:protocol.run-evidence-recipe` | `test/recipes.test.ts` | not stated | keep. Label stands: asserts realization of Run evidence in docs/agent-surface/recipes.md. |
| `impl:protocol.self-hosting` | `test/self-hosting-graph.test.ts` | not stated | keep. Label stands: realizes the self-hosted corpus through the shared extraction and validation path. |
| `impl:protocol.shipped-protocol-corpus` | `test/package-smoke.test.ts` | not stated | keep. Label stands: asserts the published package ships the Protocol corpus. |
| `impl:protocol.slimming-recipe` | `test/curation-recipes.test.ts` | not stated | keep. Label stands: asserts realization of the shipped slimming-candidates recipe. |
| `impl:protocol.statement-queue-recipe` | `test/self-hosting-readiness-planner.test.ts` | projection | keep. Label stands: realizes the statement queue in the shipped recipe catalog. |
| `impl:protocol.structural-self-binding` | `test/self-hosting-oracle/structural-edges.ts` | not stated | keep. Label stands: realizes the declared significant-unit set and its structural self-binding. |
| `impl:protocol.studio-on-ramp` | `test/skills.test.ts` | not stated | keep. Label stands: asserts realization of the shipped Studio skill document. |
| `impl:protocol.studio-preview-workflow` | `test/studio-s4.test.ts` | not stated | keep. Label stands: asserts the reusable Studio preview workflow and Protocol CI caller. |
| `impl:protocol.upgrade-guide` | `test/upgrade-kit.test.ts` | not stated | keep. Label stands: realizes the shipped upgrade guide document. |
| `impl:protocol.validator-probe-table` | `test/helpers/validator-probes.ts` | utility → contract | re-role. Label stands: The probe catalog is the independent contract for the validator audit, outside product component membership. |
| `impl:protocol.validator-self-testing` | `test/helpers/validator-audit.ts` | utility → validator | re-role. Label stands: The validator audit compares independent probes with actual findings; it is a check, not generic test plumbing. |
| `impl:protocol.vault-on-ramp` | `test/skills.test.ts` | not stated | keep. Label stands: asserts realization of the shipped vault skill document. |

</details>

## Missing responsibilities and proposed anchors

Each proposal uses one top-level comment-form anchor at the named file, so it introduces no builder import. Its component membership is explicit. The proposed unit-level uses below select the collaborations a designer needs; other dependencies stay at component grain. An empty Uses cell means omit the field, since a present empty array is unlawful. Every proposed unit has a realization or design target; the small Markdown result union stays bare under the parser. For an existing implemented target, an added satisfying unit joins the current complete set; it does not replace the other satisfying units.

| Proposed identity | File and form | Role and component | Satisfies | References | Uses | Why a contributor needs it |
| --- | --- | --- | --- | --- | --- | --- |
| `impl:protocol.build-args` | `src/cli/build-args.ts`; comment | codec; `component:protocol.cli` | `spec:consumers.command-line` | empty | empty | BuildArgs, RulesInput and parseBuildArgs are the shared argv contract for publishers and rules; the omission changes many command paths. |
| `impl:protocol.parameter-codec` | `src/cli/params.ts`; comment | codec; `component:protocol.cli` | `spec:consumers.agent-surface.recipe-parameters` | empty | empty | The shared JSON, @file and keyed-file parameter decoder owns duplicate-key refusals for queries and rules. |
| `impl:protocol.corpus-rule-runner` | `src/cli/corpus-rules.ts`; comment | service; `component:protocol.cli` | `spec:validation.corpus-rules` | empty | empty | The body runner isolates each selected rule, validates its returned findings and keeps failures apart from Protocol findings. |
| `impl:protocol.markdown-yaml-policy` | `src/extract/markdown-yaml-policy.ts`; comment | codec; `component:protocol.extract` | `spec:carrier.envelope-contract`, `spec:carrier.markdown-pack-authoring` | empty | empty | The bounded YAML policy, relation-target forms and scalar refusals are a carrier contract, rather than a mechanical parser helper. |
| `impl:protocol.markdown-content` | `src/extract/markdown-body-content.ts`; comment | codec; `component:protocol.extract` | `spec:carrier.markdown-body-grammar` | empty | empty | The content stage turns located lines into list entries and typed fences; unsupported blocks are refused before owner mapping. |
| `impl:protocol.gherkin-kind-policy` | `src/extract/gherkin-kind-honesty.ts`; comment | decider; `component:protocol.extract` | `spec:carrier.gherkin-authoring`, `spec:consumers.gherkin-view` | `spec:decisions.carrier-universality` | empty | The kind-refusal policy supplies canonical refusal explanations and the Gherkin view's per-kind loss explanations; no TypeScript importer consumes it. |
| `impl:protocol.import-fidelity` | `src/import/markdown-fidelity.ts`; comment | validator; `component:protocol.import` | `spec:carrier.sdp-import` | empty | empty | The reparse comparator rejects an emitted Markdown document that changes authored meaning; this is an independent fidelity boundary. |
| `impl:protocol.studio-diagram-model` | `src/projections/studio/diagrams/model.ts`; comment | contract; `component:protocol.projections` | `spec:consumers.spec-studio.diagrams` | empty | empty | DiagramInput, DiagramBox, DiagramEdge, aggregation and draw bounds are the contract the layout and each diagram producer share. |
| `impl:protocol.studio-html` | `src/projections/studio/pages/html.ts`; comment | codec; `component:protocol.projections` | `spec:consumers.spec-studio.shell` | empty | empty | PageContext and the shared escaping, source-location and link encoders form the boundary all Studio pages rely on. |
| `impl:protocol.studio-inputs` | `src/projections/studio/inputs.ts`; comment | contract; `component:protocol.projections` | `spec:consumers.spec-studio.data.inputs` | empty | empty | The named base graph and run input shape is shared with CLI preflight and recipe evaluation. |
| `impl:protocol.studio-proposal-contract` | `src/studio-elements/proposal.ts`; comment | contract; `component:protocol.studio-elements` | `spec:consumers.intent-composition.proposal` | empty | empty | Proposal, ProposalChange and proposalProblems pin the browser handoff shape to the proposal checker and shipped schema. |
| `impl:protocol.design-review-codec` | `src/projections/design-review-markdown.ts`; comment | codec; `component:protocol.projections` | `spec:consumers.design-review` | empty | empty | The shared Markdown path, link and inline-code encoder is the representation contract used by Design Review page and section providers. |
| `impl:protocol.studio-register-contracts` | `src/projections/studio/pages/register-answers.ts`; comment | contract; `component:protocol.projections` | empty | `spec:consumers.spec-studio.data.recipe-answers` | empty | The question, decision, declaration, backlog, queue and diff result shapes are shared between recipe providers and their page renderers. |
| `impl:protocol.studio-page-catalog` | `src/projections/studio/pages/index.ts`; comment | projection; `component:protocol.projections` | `spec:consumers.spec-studio.publisher` | empty | empty | renderStudio owns the page catalog, conditional input pages and Pack exports; its public page-set policy is more than a forwarding barrel. |

The existing `impl:protocol.envelope-contract` moves from `src/extract/markdown.ts` to `src/extract/markdown-frontmatter.ts`, still in extract, still a codec, using the comment form because the parser has no builder import, with the same satisfies target and empty references/uses. This exposes the actual parser rather than adding a second forwarding identity. Its source and graph expectations must move together.

## Changes to reviewed coarse-grain coverage

These are reversals of existing owner-reviewed rows, proposed for owner acceptance rather than silently overwritten.

| Existing locator or new row | Proposed change and promise |
| --- | --- |
| `src/cli/params.ts#mergeParams` | Remove its coarseGrainCoverage row covered by query-params. The parameter-codec identity owns the shared JSON, @file, keyed-file and duplicate-key contract promised by spec:consumers.agent-surface.recipe-parameters. |
| `src/import/markdown-fidelity.ts#assertMarkdownEmissionFidelity` | Remove its coarseGrainCoverage row covered by sdp-import-markdown-emit. The import-fidelity identity realizes the sdp-import example-space Then promise, "the emitted Markdown re-parses to an equal graph". That promise has no rule key; do not invent an address for it. The binding-grain set reading binds a promise of the whole Spec and does not require a keyed Behavior rule. It reparses and refuses unequal authored data before emission returns. |
| `src/extract/gherkin-kind-honesty.ts#gherkinKindLieReason` | Remove its coarseGrainCoverage row covered by gherkin-authoring. The shared refusal policy now has its own satisfying identity for canonical kind refusal and the read projection's per-kind loss commentary. |
| `src/extract/markdown-types.ts#MarkdownFrontmatterResult` and `#MarkdownBodyResult` | Add coarse-grain rows covered by impl:protocol.markdown-parser in extract. These are small parser-stage unions, with no independent realization identity. |

The importer scan and publication corrections transfer spec:carrier.sdp-import from references to satisfies on their existing identities. Source selection/deduplication and exclusive publication/rollback are explicit rules of that Spec. Keep its other satisfying units; these edits repair the set reading of an already implemented Spec.

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
| `impl:protocol.binding-language-pack-table` | `impl:protocol.binding-language-index-table` | `spec:consumers.binding-language-views` | empty | The same file owns binding-presence wording for index and Pack tables; keep one plural-use rendering identity. |
| `impl:protocol.studio-view-elements` | `component:protocol.studio-elements` already satisfies the target | `spec:consumers.spec-studio.components` remains on the existing component entry | No transfer required; the Spec's decision relation and surviving view units retain the shaping design | Keep registerViews and its call. Remove only the empty-registration identity. The component's registration flow still realizes the same promise. |

Every incoming or outgoing structural edge must be retargeted if it names a removed identity. None of the proposed removals currently has a uses endpoint; the retained schema-version identity keeps the stamp dependency. Remove the old membership and anchor expectation rows, union target lists without duplicates, and keep satisfies and references disjoint. A different code change requires a fresh promise pass rather than inheriting this ledger.

## Every component pair with import or uses evidence

This table covers the union of declared cross-component uses and component-mapped import pairs, rather than all possible component combinations. Same-component collaborations remain lawful data and need no new crossing. The imported file pair is a reproducible witness, not a generated architecture verdict. Type-only imports of shared contracts count. The adapter includes barrel reach; that observation creates no edge when the importer does not use the re-exported symbol.

| From → to | Existing uses | Import witness | Proposed action and reading |
| --- | --- | --- | --- |
| `component:protocol.adapters → component:protocol.model` | absent | `src/adapters/vitest.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.adapters → component:protocol.runner` | present | `src/adapters/vitest.ts → src/runner/index.ts` | Keep. Vitest binds the public example execution contract. |
| `component:protocol.cli → component:protocol.adapters` | present | `src/cli/build-command.ts → src/adapters/typescript-imports.ts` | Keep. The build calls the optional inferred-import adapter. |
| `component:protocol.cli → component:protocol.codegen` | present | `src/cli/build-command.ts → src/codegen/contracts.ts`; `src/cli/vault-command.ts → src/codegen/contracts.ts` | Keep. CLI orchestration consumes the named codegen provider or shared contract. |
| `component:protocol.cli → component:protocol.extract` | present | `src/cli/build-command.ts → src/extract/index.ts`; `src/cli/build-command.ts → src/extract/protocol-bindings.ts` | Keep. CLI orchestration consumes the named extract provider or shared contract. |
| `component:protocol.cli → component:protocol.graph` | present | `src/cli/build-command.ts → src/graph/schema.ts`; `src/cli/generate-command.ts → src/graph/schema.ts` | Keep. CLI orchestration consumes the named graph provider or shared contract. |
| `component:protocol.cli → component:protocol.import` | present | `src/cli/import-command.ts → src/import/import.ts`; `src/cli/import-scan.ts → src/import/import.ts` | Keep. CLI orchestration consumes the named import provider or shared contract. |
| `component:protocol.cli → component:protocol.model` | present | `src/cli/new-spec-command.ts → src/model/descriptors.ts` | Keep. The scaffolder consumes the kind and descriptor vocabulary beyond anchor authoring. |
| `component:protocol.cli → component:protocol.notation` | absent | `src/cli/build-command.ts → src/notation/example-space.ts`; `src/cli/vault-command.ts → src/notation/example-space.ts` | Keep absent. These are barrel-reach pairs through contracts.ts re-exporting contractsFindingIds; the CLI imports only generateContracts, not a notation symbol. The direct dependency is cli → codegen. |
| `component:protocol.cli → component:protocol.projections` | present | `src/cli/census-command.ts → src/projections/census.ts`; `src/cli/generate-command.ts → src/projections/studio/publish.ts` | Keep. CLI orchestration consumes the named projections provider or shared contract. |
| `component:protocol.cli → component:protocol.reader` | present | `src/cli/q-command.ts → src/reader/reader.ts` | Keep. CLI orchestration consumes the named reader provider or shared contract. |
| `component:protocol.cli → component:protocol.validate` | present | `src/cli/build-command.ts → src/validate/contracts.ts`; `src/cli/import-command.ts → src/validate/contracts.ts` | Keep. CLI orchestration consumes the named validate provider or shared contract. |
| `component:protocol.codegen → component:protocol.graph` | present | `src/codegen/contracts.ts → src/graph/example-space.ts`; `src/codegen/contracts.ts → src/graph/schema.ts` | Keep. Contract generation consumes the graph and example eligibility. |
| `component:protocol.codegen → component:protocol.model` | absent | `src/codegen/contracts.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.codegen → component:protocol.notation` | present | `src/codegen/contracts.ts → src/notation/slots.ts` | Keep. Direct slot parsing still crosses to notation after the decoder joins reader. |
| `component:protocol.codegen → component:protocol.reader` | absent | `src/codegen/contracts.ts → src/notation/example-space.ts` | Declare under the proposed decoder membership. Contract generation consumes its graph-reading vocabulary and bound-point decoder. |
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
| `component:protocol.notation → component:protocol.graph` | absent | `src/notation/example-space.ts → src/graph/schema.ts` | Keep absent under the proposed decoder membership. This real GraphSchema/PrimitiveNode dependency belongs to reader → graph. Retaining decoder membership in notation would instead require this edge and expose the cycle described below. |
| `component:protocol.notation → component:protocol.model` | absent | `src/notation/slots.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.notation → component:protocol.validate` | absent | `src/notation/example-space.ts → src/validate/contracts.ts` | Keep absent under the proposed decoder membership. Its Finding dependency belongs to reader → validate. Retaining decoder membership in notation would require this edge and expose the cycle described below. |
| `component:protocol.projections → component:protocol.extract` | present | `src/projections/gherkin-view.ts → src/extract/gherkin-kind-honesty.ts` | Keep. The Gherkin view consumes the shared kind-refusal policy for loss explanations. Recipe 40 cannot map the policy while it is bare; its proposed extract membership repairs that omission. |
| `component:protocol.projections → component:protocol.graph` | present | `src/projections/census.ts → src/graph/schema.ts`; `src/projections/mermaid.ts → src/graph/schema.ts` | Keep. Views consume the graph contract. |
| `component:protocol.projections → component:protocol.model` | present | `src/projections/census.ts → src/model/anchors.ts`; `src/projections/census.ts → src/model/descriptors.ts` | Keep. Rungs, layers and section shapes label the views. |
| `component:protocol.projections → component:protocol.notation` | present | `src/projections/vault/sections.ts → src/notation/slots.ts` | Keep. Vault sections render authored step text. |
| `component:protocol.projections → component:protocol.reader` | present | `src/projections/design-review-context.ts → src/reader/reader.ts` | Keep. Page and note providers consume query answers. |
| `component:protocol.projections → component:protocol.validate` | present | `src/projections/census.ts → src/validate/contracts.ts`; `src/projections/design-review-context.ts → src/validate/contracts.ts` | Keep. Views render findings, clauses and checked mention tokens. |
| `component:protocol.reader → component:protocol.graph` | present | `src/reader/entry-citations.ts → src/graph/delivery-facts.ts`; `src/reader/entry-citations.ts → src/graph/entry-address.ts` | Keep. Queries join bindings, resolve addresses and recompute delivery facts. |
| `component:protocol.reader → component:protocol.model` | present | `src/reader/reader.ts → src/model/descriptors.ts`; `src/reader/reader.ts → src/model/sections.ts` | Keep. Query contracts expose descriptors, sections and structural attributes. |
| `component:protocol.reader → component:protocol.notation` | absent | `src/notation/example-space.ts → src/notation/slots.ts` | Declare `component:protocol.reader` uses `component:protocol.notation` under the proposed decoder membership. Its slot parser and SlotDeclaredType imports cross the reviewed boundary despite sharing a directory. |
| `component:protocol.reader → component:protocol.validate` | present | `src/reader/entry-citations.ts → src/validate/graph-index.ts`; `src/reader/evaluate-body.ts → src/validate/contracts.ts` | Keep. The reader uses the shared index, validation report and floor evaluator. |
| `component:protocol.runner → component:protocol.model` | absent | `src/runner/index.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.runner → component:protocol.notation` | present | `src/runner/index.ts → src/notation/slots.ts` | Keep. Step labels render bound notation. |
| `component:protocol.studio-elements → component:protocol.projections` | present | `src/studio-elements/compose.ts → src/projections/studio/pages/code-spans.ts`; `src/studio-elements/copy.ts → src/projections/studio/pages/code-spans.ts` | Keep. Browser search and controls share code-span escaping and id-to-page encoding. |
| `component:protocol.studio-elements → component:protocol.reader` | present | `src/studio-elements/search-results.ts → src/reader/concept-match.ts` | Keep. Browser search reuses deterministic concept matching. |
| `component:protocol.testing → component:protocol.adapters` | present | `src/testing/index.ts → src/adapters/vitest.ts` | Keep. The registrar runtime registers execution through Vitest. |
| `component:protocol.testing → component:protocol.model` | absent | `src/testing/index.ts → src/ids.ts` | Keep absent. The only imported ids construct anchors; they do not implement a product dependency. |
| `component:protocol.testing → component:protocol.runner` | present | `src/testing/index.ts → src/runner/index.ts` | Keep. The runtime consumes ExampleContract and StepBindings. |
| `component:protocol.validate → component:protocol.graph` | present | `src/validate/contracts.ts → src/graph/schema.ts`; `src/validate/graph-index.ts → src/graph/schema.ts` | Keep. Validators consume graph shapes, facts and binding eligibility. |
| `component:protocol.validate → component:protocol.model` | present | `src/validate/readiness-floor.ts → src/model/descriptors.ts`; `src/validate/readiness-floor.ts → src/model/sections.ts` | Keep. Checks consume ratified descriptor and section vocabularies. |
| `component:protocol.validate → component:protocol.notation` | present | `src/validate/readiness-floor.ts → src/notation/slots.ts` | Keep. Floor checks use structured-step compatibility. |

Declare import → notation, reader → notation and codegen → reader under the proposed decoder membership. Keep every existing component uses, including projections → extract. The cli → notation adapter pair is unused barrel reach, not a direct dependency.

At the base the component uses graph is acyclic. Simply adding notation → graph and notation → validate would put graph, notation and validate in one strongly connected set because graph → notation and validate → notation already exist. Cycles remain lawful data. The owner question `spec:protocol.significant-units-review#question.notationBoundary` asks whether to keep that boundary and declare the cycle or assign `impl:protocol.example-space-decoding` to reader. This review recommends reader membership at medium confidence. The proposed page applies that provisional choice, keeps the source file and targets unchanged, and adds codegen → reader and reader → notation. The resulting component graph remains acyclic. No component is created and no source move is required.

Unassigned files were read separately. CLI argument parsing, corpus rules and Studio HTML consume already-declared component pairs. The YAML policy and coarse-grain Markdown result types also add no new pair. The import fidelity comparator uses extract, which import already declares. No further crossing is hidden by the reviewed bare helpers. Paths and directory names were used to organize this reading, never to create anchored membership.

## Curated unit-level relationships

All ten current uses edges with at least one non-component endpoint were re-read. They remain below. The review's component pairs describe the broad architecture; these selected unit collaborations explain where a contributor enters a pipeline or preserves a shared contract. No transitive uses is inferred.

| From → to | Action | Direct import witness and design use |
| --- | --- | --- |
| `impl:protocol.example-runner-adapter → impl:protocol.example-runner` | Keep | src/adapters/vitest.ts → src/runner/index.ts; adapter registration consumes ExampleContract and execution. |
| `impl:protocol.stamp-command → impl:protocol.schema-version` | Keep | src/cli/stamp-command.ts → src/graph/schema.ts; stamps schemaVersion. |
| `impl:protocol.vault-command → component:protocol.projections` | Keep | src/cli/vault-command.ts → src/projections/vault/notes.ts and sync.ts; owns orchestration across note rendering and publication. |
| `impl:protocol.derive-graph → impl:protocol.delivery-facts` | Keep | src/extract/derive.ts → src/graph/delivery-facts.ts; graph assembly computes facts from resolving bindings. |
| `impl:protocol.studio-recipes → impl:protocol.reader` | Keep | src/projections/studio/recipes.ts → src/reader/reader.ts; shares the Reader input type across recipe evaluations. |
| `impl:protocol.studio-recipes → api:protocol.evaluate-body` | Keep | src/projections/studio/recipes.ts → src/reader/evaluate-body.ts; calls the evaluator over the build's reader. |
| `impl:protocol.vault-notes → impl:protocol.reader` | Keep | src/projections/vault/notes.ts → src/reader/reader.ts; creates a reader for note context joins. |
| `impl:protocol.reader → impl:protocol.delivery-facts` | Keep | src/reader/reader.ts → src/graph/delivery-facts.ts; resolves binding predicates for query answers. |
| `impl:protocol.reader → impl:protocol.next-rung-floor` | Keep | src/reader/reader.ts → src/validate/readiness-floor.ts; calls the requested-rung evaluator. |
| `impl:protocol.authored-honesty-delivery-facts → impl:protocol.delivery-facts` | Keep | src/validate/validators.ts → src/graph/delivery-facts.ts; independently recomputes facts before comparing them. |
| `impl:protocol.extract → impl:protocol.discover-files` | Add | src/extract/index.ts → src/extract/discover.ts; discovery selects the two authored-input surfaces. |
| `impl:protocol.extract → impl:protocol.carrier-reification` | Add | src/extract/index.ts → src/extract/carrier.ts; canonical Gherkin and TypeScript providers feed the common reified boundary. |
| `impl:protocol.extract → impl:protocol.derive-graph` | Add | src/extract/index.ts → src/extract/derive.ts; assembly consumes reified records and bindings. |
| `impl:protocol.studio-diagrams → impl:protocol.studio-diagram-model` | Add | src/projections/studio/diagrams/svg.ts → src/projections/studio/diagrams/model.ts; layout consumes box/edge shapes and bounds. |
| `impl:protocol.gherkin-authoring → impl:protocol.gherkin-kind-policy` | Add | src/extract/gherkin.ts → src/extract/gherkin-kind-honesty.ts; canonical reification calls the refusal policy. |
| `impl:protocol.gherkin-view → impl:protocol.gherkin-kind-policy` | Add | src/projections/gherkin-view.ts → src/extract/gherkin-kind-honesty.ts; the read projection renders the same per-kind explanations. |

Do not add vault-sync → vault-notes. sync.ts imports no note provider; the CLI coordinates those collaborators. This is a useful example of a plausible relationship the source does not support. No new proposed unit needs its own uses field here; existing providers point to the new policy and diagram contract. Omit every empty field.

## The complete source walk

All 156 TypeScript source files were walked through their declarations, imports and owning responsibility; the policy and shared-boundary candidates were then read at their implementations. The list below is the decision for every file with no current anchor. Every other source file is accounted for by the existing-anchor table above. It includes contracts and data shapes inside already-anchored files: their containing responsibility is named in the component map rather than creating an identity per exported type.

| Bare file | Proposal or consuming responsibility | Reason |
| --- | --- | --- |
| `src/model/code-anchor.ts` | leave bare; `impl:protocol.anchor-model` | The public builder is a mechanical shallow copy; anchor-model and anchors-subpath own its envelope and dependency-free export contract. |
| `src/projections/studio/pages/html.ts` | add `impl:protocol.studio-html` | PageContext and the shared escaping, source-location and link encoders form the boundary all Studio pages rely on. |
| `src/cli/build-args.ts` | add `impl:protocol.build-args` | BuildArgs, RulesInput and parseBuildArgs are the shared argv contract for publishers and rules; the omission changes many command paths. |
| `src/extract/markdown-types.ts` | leave bare; `impl:protocol.markdown-parser` | The small stage-result union supports the parser without an independent satisfying responsibility; add an explicit coarse-grain coverage row. |
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
| `src/extract/gherkin-kind-honesty.ts` | add `impl:protocol.gherkin-kind-policy` | The kind-refusal policy is shared by canonical Gherkin reification and the Gherkin read projection, which renders the per-kind loss explanation. |
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

The carrying Model is `spec:protocol.role-vocabulary`; its keyed terms are the vocabulary to read, rather than a second definition table in this record. The baseline has adapter, codec, contract, decider, extractor, projection, publisher, reader, renderer, service, utility and validator. The proposal adds interaction and index as corpus values. Renderer and utility are migration spellings recorded here only, outside the durable Model.

Use projection for every current renderer, except the two CLI diagnostic formatters, which are codecs over a finding rather than a graph view. Use interaction for browser controls, reader for concept/address queries, index for GraphIndex, adapter for the registrar integration, decider for the kind-evidence table, validator for the audit and contract for its independent probe catalog. Component anchors receive the role of the responsibility their component owns. Other realization exceptions remain lawfully unlabelled. No validator checks the Model's vocabulary, and no adopter has to use these spellings.

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
| Design-slice query and page | Recipe catalog and Studio projection over Pack and architecture answers | No new component. The existing reader and projection contracts already provide the component. |
| New diagram kinds | Diagram model, deterministic layout and per-kind producers inside projections; optional controls in studio-elements | No new component merely for a drawing type. A genuinely independent layout provider would require a component design before any component anchor, but no such provider is proposed here. |

Lane G should preserve the component/role register as the text route into architecture, keep omitted roles and membership visible, and separate it from bounded diagrams. It can reuse the proposed DiagramInput contract and existing layout identity rather than creating an identity for every box. Lane S should select units through recorded membership, uses and design bindings; no path-derived architecture. Lanes E and R need no extra architectural nodes from this lane. The prototype offers current anchored data, including omissions and existing role spellings, beside an explicitly labelled in-memory proposal.

## Proposed significant-units panel on the architecture page

Group recorded members by role within each component, show component source bindings separately, and retain not-stated role and no-component groups. Show labels, files, lines, satisfies and references separately. No accepted badge is inferred from an anchor. Sort component ids, role tokens and unit ids in code-unit order, with not-stated roles last. Show the role token alone; role definitions belong to the existing glossary reading and require no Protocol-corpus id inside the publisher.

This panel belongs in a child of spec:consumers.spec-studio.lenses.architecture. Lane A cannot edit that family, so integration authors the exact child proposed below and coordinates placement with lane G. The panel promise has been removed from the accepted-set Spec. The current and proposed Protocol pages and current platform page prototype the same layout. Only the proposed Protocol page reads this document's proposed edit tables as throwaway simulation input. A shipped page reads the graph only.

Prototype assets are under reviews/assets/plan47-prototypes/A-register. protocol.html and platform.html show current bindings. protocol-proposed.html is explicitly labelled "Proposed, not applied", applies the proposed roster identities, target transfers, roles, membership and uses in memory, and shows no invented source line for a new or relocated site. Its caption calls out the provisional decoder membership. No source anchor or corpus graph is rewritten by the prototype.

## Exact follow-up text for files this lane cannot edit

Replace the first paragraph under Curate the anchors in `.agents/skills/sdp-authoring/SKILL.md` with:

```md
Anchors are curated, never a coverage quota. Start with the public contracts and cross-component responsibilities a designer or builder must understand: ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters. Read the code before adding an identity. An export, an import ranking, a test expectation or a desired file-impact answer does not establish significance. Leave a mechanical wrapper, forwarding barrel, empty registration or formatting helper bare unless it owns an independent contract. Record the consuming responsibility without claiming a binding at the helper file.

An identity has one file owner. Several Specs realized by one responsibility normally share an anchor with plural targets; independent contracts, entry points and semantic policies in one file may keep distinct identities when their separate design use is clear. Before merging or dropping an identity, list every promise its targets carry and name the surviving units that still realize it. Transfer targets only when that set remains true, or explicitly record a false claim being removed. Review imported value and type contracts when declaring component uses, exclude imports made only to author anchors and unused re-export reach, and inspect external-input omissions and unassigned files before deleting an edge. A realizing unit documents its local how, never a paraphrase of the Spec's what or why.
```

Replace only the architecturally significant unit definition in `specs/model/structural-patterns.sdp.md` with:

```md
- **architecturally significant unit** — A code unit with exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand to change a system guarantee. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters may qualify; being exported, re-exporting other units or appearing in an import ranking is insufficient by itself. Its anchor records component membership, a role and references to the designs it answers to. An architectural dependency is declared as `uses`, normally between components; a unit's own `uses` is optional.
```

Replace the criterion rule in specs/protocol/structural-self-binding.sdp.md with:

```md
- rule: [#criterion] The engine applies the structural-patterns model's significance criterion: exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand; being exported alone is insufficient.
```

In CONTEXT.md, replace only the architecturally significant unit row's definition with the following, leaving its aliases unchanged:

```md
a code unit with exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand (being exported or ranking high on imports is not enough by itself), and that warrants graph-visible structural binding, with component membership, a role, and references to the designs it answers to, with uses declared for its architectural dependencies, normally between components (a unit's own uses is optional); annotated on the anchor of the code that realizes it; the accepted set is an owner-reviewed declaration, never derived from imports (carried by `spec:model.structural-patterns`)
```

This reads the architectural-annotation decision's criterion as a necessary condition, consistent with its "anchors are curated, never a coverage quota". It is drift repair, not a new decision. The decision's text changes only by the owner's hand. If the owner wants its consequence aligned, replace only "The engine significance criterion stays exported public surface or cross-component reach" with "The engine significance criterion requires exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand; being exported alone is insufficient". Keep the remainder of that consequence unchanged. No new registry row is proposed.

Integration authors specs/consumers/spec-studio.lenses.architecture.unit-register.sdp.md with this exact text, then lists it after the two annotation Specs in the arc Pack, and after its parent in pack:spec-studio-v1:

```md
---
id: spec:consumers.spec-studio.lenses.architecture.unit-register
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.lenses.architecture
---
# Find significant units by component and role

## Intent

- outcome: Let a contributor find recorded units and their design bindings through their component and role, with omitted structure visible.

## Behavior

- rule: [#recordedOnly] The architecture page groups recorded members by role within each recorded component, and shows a component's own source binding apart from its members. A row shows the recorded id, label, file and line and its satisfies and references targets separately. The page reads graph bindings only, never an annotation review or oracle source file.
- rule: [#omissions] Keep a not-stated role group and a no-component section. A binding confers no review approval or execution verdict, and the page shows no inferred accepted badge.
- rule: [#roleTokens] Show each recorded role token without interpreting it through a Protocol-corpus Spec id. An adopter's unfamiliar roles remain visible and produce no finding.
- rule: [#stableOrder] Sort components by id, role groups by token and members by id in code-unit order, with not-stated roles last and the no-component section after the components.
- rule: [#staticAccess] Every row is available without script through native disclosures. The component index links to the existing component section ids, and narrow screens retain readable source paths and separate realization and reference lists.

## Verification — reviewed

- Render the self-hosted corpus and an adopter with unfamiliar roles, omitted roles and omitted membership. Check ordering, component source rows, target separation, keyboard disclosures and narrow-screen overflow, with no inferred approval badge.
```

The child is a proposal outside lane A's edit ownership, not an authored new Spec in this branch. Its rung and Pack memberships must be re-measured when integration authors it. No recipe number, external register input or new public command is requested.

## Build sequence and evidence

1. The owner reviews the disposition and role choices, including the single dropped identity, reversed coarse-grain rulings and provisional decoder membership. The executing thread reviews the two defined Specs and proposes any ready statements separately.
2. Apply the target-transfer ledger, the frontmatter-anchor relocation, missing anchors, roles and component uses in coherent units. Do not change implementation behavior while editing bindings. Keep recipe/document realizations outside product membership.
3. Replace the independent expectations in `test/self-hosting-oracle/structural-edges.ts`, the anchor and binding expectations in `test/self-hosting-oracle/anchors.ts`, and the changed Spec/relations snapshots. Update `test/recipes.test.ts`, whose architecture cases remove or retain impl:protocol.agent-surface; they must name the surviving impl:protocol.reader instead. Apply the coarse-grain reversals and new parser-result coverage rows above. `impl:protocol.structural-self-binding` adds `spec:protocol.significant-units-review` to satisfies when the replacement roster lands; no source binding claims to realize a review document. Preserve rejection of unrostered membership. Replace count-only assertions with row equality where row equality already proves the set; a total is a close measurement, never an acceptance target.
4. Keep the existing missing-member and extra-member checks meaningful, cover the relocated parser binding and the role taxonomy, and add the current-to-proposed register rendering cases to `test/studio-pages.test.ts` or the architecture page suite. Verify omitted role/membership, no inferred approval badge, role groups, source locations and the separation of realization from reference.
5. Integration authors the proposed architecture child and coordinates the panel with lane G. Update the authoring guidance and all criterion texts deliberately, and rerun recipes 12, 13, 15, 17, 27, 28, 32, 40 and 43. Derive fresh imports outside generated output, inspect diagnostics and omissions, then run npm run check after source and oracle edits.

This design pass runs carrier validation, temporal hygiene and formatting. It does not claim the full engine gate against stale pinned snapshots. The relevant current check must report zero errors and exactly honesty/gaps on spec:model.spec-sections. No engine, test, Pack, glossary, decision-registry or skill file changes belong to this lane commit.

## Reproduction

The prototype README supplies exact commands for rebuilding imports and rerunning every requested recipe. The Protocol input is `{ "adapter": "typescript", "tsconfig": "tsconfig.json", "roots": ["src"] }`. The platform input selects `src`, `harness`, `example` and `fixture` and excludes each `_generated` directory in those roots. Build imports on `/tmp/plan47-platform-A`, never on the read-only platform copy. Copy the emitted imports file out of generated before using it as recipe input. Graph queries do not publish or mutate the source corpus.

## Evidence bindings outside the architecture roster

All test and oracle anchors stay evidence bindings; none gains membership and none changes. The graph currently records 324 such anchors. They remain literal verification or expected-outcome bindings, with no claim about execution or outcome.
