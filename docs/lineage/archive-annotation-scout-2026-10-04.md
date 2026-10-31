> **Research report, 2026-10-04.** A read-only scout of the first generation's annotation model (`libar-dev/architect` at `854f4a7`), of this repository's two decisions that refuse it, and of the original design in this folder, written for the owner's decision on annotations in code. It is dated evidence, not current truth: on any disagreement with `specs/`, the Specs win until a decision supersedes them. Paths to gen 1 link to its public repository at the commit read; references to the adopter's working notes are not published.

# Annotations in code: gen 1, the original design and today

## 1. Gen 1’s annotation model

**Gen 1 formally defines one graph authored through tagged Gherkin and TypeScript; its current implementation supports a narrower—and partly different—tag set than the formal specification.**

The authoritative starting points are [formal-spec/README.md](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/README.md), [03-tag-system.md](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/03-tag-system.md) (**F03** below), [04-tag-registry.md](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/04-tag-registry.md) (**F04**), and [10-pattern-graph.md](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/10-pattern-graph.md) (**F10**). Sections in these documents are named rather than numbered; the references below use those names.

[00, “Five Core Concepts”](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/00-overview.md#L39) defines a pattern as a named architectural unit: feature, service, component, decision, or capability. Gherkin carries behavior, rules, and delivery state; TypeScript carries runtime structure and relationships. F10, “Overview” and “Build Pipeline,” makes the immutable `PatternGraph` the common read model for documentation, queries, agents, and UI.

[01, “Conformance Levels”](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/01-conformance.md#L16) distinguishes minimal metadata, complete specifications, and enforced lifecycle/projections. Thus “present in the registry,” “required for this artifact/tier,” and “checked by the extractor” are different claims.

**Inventory notation.** Every suffix below means `@architect-<suffix>`. `V`: formal TypeScript `@architect-x value`, Gherkin `@architect-x:value`; `CSV`: corresponding comma-separated values; `Q`: quoted TypeScript value, colon-delimited Gherkin token; `F`: bare flag. Current TypeScript accepts colon or whitespace separators; skills specifically teach colons for `role`/`bounded-context` and whitespace for `pattern`/`uses`/`implements`. Gherkin requires colons and cannot contain whitespace inside a tag.

Counts are **TypeScript/Gherkin authored occurrences** in Architect’s configured, deduplicated source inputs at `854f4a7`: opted-in JSDoc blocks and actual Feature-header tags, excluding documentation examples, scenario payloads, and fixtures outside those inputs. `shape` additionally counts declaration-level markers. The live graph contained **349 patterns: 227 TypeScript and 122 Gherkin**; these counts measure authoring, not semantic correctness.

Checks below: **T** = TypeScript comment parser plus `DocDirective`/pattern schemas; **G** = Gherkin registry dispatch plus extraction diagnostics/schemas; **R** = relationship resolution/dangling validation; **P** = process/tier/hierarchy guard. None of the JSDoc values is checked by `tsc`.

| Tag | Syntax | Formal definition → current graph meaning | Allowed values and actual checker | Uses TS/G |
|---|---|---|---|---:|
| `@architect` | F | F03 “Gate Tag”; extraction opt-in, not a node | Exact gate; T/G | 227/122 |
| `pattern` | V | F04 Group 1; pattern identity → node identity/name | Formally unique PascalCase; T/G extract; duplicate-feature guard checks collisions before merging | 227/122 |
| `status` | V | F04 Group 1; lifecycle attribute and status views | `candidate`, `roadmap`, `active`, `completed`, `deferred`; T/G enums, P transitions | 227/122 |
| `maturity` | V | F04 Group 1 and “Status → Maturity Defaults”; authored override, otherwise derived | `idea`, `plan`, `design`, `executable`; **not registered in graph extraction**; P separately reads explicit idea marker | 0/3 |
| `role` | V; commonly colon in TS | F04 Group 2; architectural classification attribute | `projection`, `service`, `decider`, `read-model`, `codec`, `contract`, `barrel`, `utility`; configured registry, T/G | 227/31 |
| `bounded-context` | V; commonly colon in TS | F04 Group 2; context attribute/grouping | Free string; T/G; no closed context registry | 227/12 |
| `arch-layer` | V | F04 Group 2; formally an architecture attribute | `application`, `domain`, `infrastructure`; **absent from live registry**, despite formal requirement | 0/0 |
| `product-area` | V | F04 Group 2; organizational attribute and documentation grouping | Dogfood: `Annotation`, `Configuration`, `Generation`, `Validation`, `DataAPI`, `CoreTypes`, `Process`, `Projection`; G checks configured list; TS transport does not enforce that list equivalently | 16/112 |
| `team` | V | F04 Group 3 note; canonical feature ownership metadata | Project string; **not registered**, therefore no standard graph extraction | 0/0 |
| `uses` | CSV | F04 Group 4; A depends on B; reverse views derived | Pattern-name list; T/G parse; R resolves/detects dangling targets; P uses dependency status | 144/20 |
| `implements` | CSV | F04 Group 4; realization edge, reversed as `implementedBy` | Pattern-name list; T/G/R; used both code→spec and executable-feature→production-pattern | 14/75 |
| `extends` | V | F04 Group 4; specialization/generalization edge | One pattern name; T/G/R | 0/0 |
| `see-also` | CSV | F04 Group 4; informational edge without dependency implication | Pattern-name list; T/G/R | 0/15 |
| `enforces-decision` | CSV | F04 Group 4 calls it “derived” and excludes it from the authored set; **code registers an authored edge** to decisions, with reverse `enforcedBy` | Decision-pattern names; T/G and decision resolution | 7/2 |
| `level` | V | F04 Group 7; hierarchy attribute | `epic`, `phase`, `task`, `slice`; T/G enums, P | 0/2 |
| `parent` | V | F04 Group 7; parent edge | Pattern name; P requires a strictly higher hierarchy level; epic/slice parent exemption | 1/7 |
| `target` | V | F04 Group 9; stub’s intended production path | Path string; T/G transport; formal MUST for stubs | 0/0 |
| `unlock-reason` | Q | F04 Group 11; explanation suppressing advisory reopen warnings | G/P require meaningful, non-placeholder text of at least ten characters; TS initially transports text | 0/41 |
| `adr` | V | F04 Group 6; ADR identifier attribute | Number-like identifier padded by transform; G; TS parser does not transport ADR fields into its directive | 0/15 |
| `adr-status` | V | F04 Group 6; decision lifecycle attribute | `proposed`, `accepted`, `deprecated`, `superseded`; G; formal reserves supersession for post-bootstrap append-only use | 0/15 |
| `adr-category` | V | F04 Group 6; decision classification | `architecture`, `process`, `testing`, `documentation`; G | 0/15 |
| `adr-theme` | V | F04 Group 6; decision theme | Formal examples: `performance`, `security`, `scalability`; live enum: `persistence`, `isolation`, `commands`, `projections`, `coordination`, `taxonomy`, `testing`; G | 0/15 |
| `adr-layer` | V | F04 summary/F03 ADR requirements; evolutionary decision layer, **not** architecture layer | `foundation`, `infrastructure`, `refinement`; G | 0/15 |
| `adr-supersedes` | V | F04 Group 6; decision supersession reference | ADR identifier, padded; G; unavailable through TS directive transport | 0/0 |
| `adr-superseded-by` | V | F04 Group 6; inverse supersession reference | Same | 0/0 |
| `usecase` | Q | Still appears in F04 summary; formerly usage guidance | **Retired from registry, schemas, and projection**; surviving occurrences confer no structured field | 4/0 |
| `overview` | F | F04 summary; aggregation selector | Registered selector targeting `OVERVIEW.md`; TS document extraction, not a relationship | 0/0 |
| `decision` | F | F04 summary; documentation aggregation | Registered selector targeting `DECISIONS.md`; **different from `enforces-decision`** | 1/0 |
| `intro` | F | F04 summary; package-introduction selector | Registered template selector; no target document; TS document extraction | 0/0 |
| `executable-specs` | CSV | Additional live tag; forward link used by design-spec deletion/value-transfer checks | Feature paths; T/G transport, session/deletion checks | 0/2 |
| `title` | Q | Additional live registry tag; intended display attribute | String; registered but omitted from final TS/Gherkin pattern construction | 0/0 |
| `shape` | F, optional group text | Additional live tag; selects exported AST declarations for API documentation | Exported interface/type/enum/const/function; AST shape extractor; no equivalent Gherkin output | 238/0 |
| `depends-on` | CSV | F04 Group 4 explicitly retires authored form; live `dependsOn` view is populated from `uses` | Unregistered; no independent authored edge | 0/0 |
| `enables` | CSV | F04 Group 4 explicitly retires authored form; live reverse dependency view derives from `uses` | Unregistered; surviving example is ignored | 0/1 |
| `used-by` | CSV | F04 Group 4 retires authored form; reverse of `uses` | Derived, not authored | 0/0 |

F04’s other explicitly removed names—`phase`, `effort`, `priority`, `release`, `quarter`, `risk`, `business-value`, `user-role`, `constraints`, sequence `orchestrator`/`step`/`module`/`error`, four `discovered-*` tags, `include`, `since`, `shapes`, `workflow`, `api-ref`, `depends-on-external`, `parent-external`—each have **0/0** occurrences in the counted corpus. They have no standard live extraction semantics. Historical `completed` and `effort-actual` also have 0/0. Unregistered bare `cli`, `lint`, and `validation` survive in 9, 10, and 6 TypeScript identity blocks respectively; they are not canonical roles.

[05, §7 “Scenarios”](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/05-feature-spec-format.md#L288) additionally defines non-Architect scenario flags: `@acceptance-criteria` plus one of `@happy-path`, `@validation`, `@edge-case`. The configured opted-in features contain respectively **301, 348, 86, 28** such occurrences. These classify scenarios; they do not create independent pattern nodes.

**Implementation and checks.** The current registry contains **24 metadata tags + three aggregation tags + the gate**. Its source is [registry-builder.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/src/taxonomy/registry-builder.ts); schemas and registry merging are in [tag-registry.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/src/validation-schemas/tag-registry.ts), with workspace roles/source globs in [self-hosting.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/src/config/self-hosting.ts) and product-area configuration in [architect.config.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/architect.config.ts). The generated taxonomy digest deliberately hides `title`, `target`, and `unlock-reason`; its smaller count is not the full registry count.

[ast-parser.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/src/scanner/ast-parser.ts) uses the TypeScript ESTree parser to find comments, then tag-specific text extraction and explicit directive-field transport. [gherkin-ast-parser.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/src/scanner/gherkin-ast-parser.ts) parses Cucumber syntax and dispatches Feature tags through the registry. [relationship-resolver.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/src/generators/pipeline/relationship-resolver.ts) constructs forward/reverse indexes. Unknown tags are generally ignored, not automatically rejected.

Additional formal/code discrepancies: F03 requires status, while TS extraction defaults missing status to `roadmap`; Gherkin requires the identifying header and diagnoses/skips missing metadata. F04 says explicit maturity always overrides its default, while the graph derives maturity from status. F10 retains completion-date and timeline-related descriptions that the implementation retired. TS enum extraction also uses a value-matching regex rather than the Gherkin parser’s exact-membership path.

**Adding a tag.** Formally, F03 “Tag Taxonomy” and 01 “Extension Points” permit project tags without changing standard semantics. In code, registering a tag supplies syntax/metadata, but does **not** guarantee graph support: add its schema field and parser/extractor transport, then any relation resolution, checks, and projection consumers. Roles and product areas have configuration hooks; arbitrary graph fields are not automatically admitted by those hooks.

**How agents were taught.** [architect-base](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/.agents/skills/architect-base/SKILL.md) teaches the taxonomy, lifecycle, and durable value transfer; [architect-graph-handle](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/.agents/skills/architect-graph-handle/SKILL.md) requires reading actual graph results. [architect-sessions](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/.agents/skills/architect-sessions/SKILL.md) and [architect-refactor-session](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/.agents/skills/architect-refactor-session/SKILL.md) require preserving executable rules and refreshing relationships. Their [ownership guidance](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/.agents/skills/architect-base/references/annotation-ownership.md) distinguishes feature-owned behavior from code-owned structural patterns, prohibits duplicate identities, and makes production annotations curated rather than a completion quota. The refactor guidance still prescribes `usecase`, despite its removal.

## 2. How Gen 1 generates documentation

**Documentation is a projection of the same assembled graph, combining annotation metadata with source prose, Gherkin rules, and extracted TypeScript declarations.**

F10 “Build Pipeline” specifies configuration → TS/Gherkin extraction → reconciliation → hierarchy/schema validation → indexes → immutable graph. [12, “Architecture” and “Invariants”](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/formal-spec/12-live-documentation-api.md#L50) explicitly places structured document output before rendering: markdown and interactive UI are consumers of that representation.

The current [documentation bundle](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-projection/src/projections/documentation-composition/documentation-bundle.ts) composes graph projections into typed fragments; rendering and [output routing](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-projection/src/projections/documentation-composition/documentation-type-registry.output-routing.ts) produce files. [generate-docs.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-cli/src/cli/generate-docs.ts) is the CLI composition root.

| Outputs generated in this inspection | Principal graph inputs |
|---|---|
| `PATTERNS`, `ARCHITECTURE`, architecture child views, `DESIGN-REVIEW` | Identity, role, context, dependencies, status, source location |
| `API-REFERENCE` and package pages | `shape` markers, exported AST declarations, declaration JSDoc |
| `DECISIONS` and individual ADR/PDR pages | ADR tags; feature Context/Decision/Consequences and Rules |
| `BUSINESS-RULES` and package pages | Gherkin Rules, invariants, rationale, scenarios, realization links |
| `ROADMAP`, `CURRENT-WORK`, `CHANGELOG` | Lifecycle views; current changelog is completed patterns, not release history |
| `REQUIREMENTS-EXECUTABLE`, `REQUIREMENTS-SPECS`, `TRACEABILITY` | Source type, product area, status, identity, `implements` |
| `VALIDATION-RULES`, `TAXONOMY`, `INDEX` | Validation-rule content, live registry/configuration, generated-document manifest |

I ran CLI help/list and explicitly selected the 15 whole-file generators, writing only to scratch/annotation-scout-docs-854f4a7 (in the adopter unit's working notes, not published). The run generated **46 files from 349 patterns**. I avoided `--all`: it also updates embedded generated regions inside the repository.

A concrete example is TRACEABILITY.md (in the adopter unit's working notes, not published). [shape-extractor.ts](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/src/extractor/shape-extractor.ts#L1) declares `ShapeExtractor`, status `active`, role `service`, context `extractor`. [shape-extraction-types.feature](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/packages/architect-core/tests/features/extractor/shape-extraction-types.feature#L1) declares `ShapeExtraction`, `implements:ShapeExtractor`, status `completed`, area `Annotation`. The generated page joins the production pattern to that executable feature and its source path. Their different statuses remain distinct.

The example’s `@architect-enables:DocGenerationProofOfConcept` contributes **nothing**: it is unregistered. Its Rules and scenarios do contribute documentation. Similarly, the generated ADR-013 page (in the adopter unit's working notes, not published) projects decision prose and consequences, not merely its header tags.

## 3. What drifted in Gen 1’s history

**History shows deliberate vocabulary contraction, residual documentation/skill drift, and specific extraction defects; it does not establish that two source formats caused the contraction.**

| Date / commit | Evidence, including commit wording | What changed |
|---|---|---|
| 2026-05-16 `ee58aac` | Standalone extraction baseline | Runtime registry already had 23 metadata tags plus three aggregation tags; the formal registry described roughly 50. |
| 2026-05-17 `1a1eb0b` | “Review and fix false claims in formal specs” | Formal taxonomy was narrowed to approximately 26. This is not evidence of a shipped runtime registry shrinking directly from 50 to 26 in this repository. |
| 2026-05-17 `691da3c` | “refactor(taxonomy): retire @architect-usecase”; “Free text was the wrong substrate.” | Removed registry entry, extraction, schemas, and rendered usage guidance. The message says trigger conditions duplicated Gherkin Scenario titles’ actor/goal/outcome structure. |
| Subsequent `bf6cb87`, `784880f` | Shape extraction and decision-resolution additions | Added useful vocabulary: `shape` and authored `enforces-decision`. Contraction was not a blanket rejection of annotations. |
| 2026-06-01 `a84aa4e` | Registry/extractor cleanup | Registered already-parsed `executable-specs`; removed remaining orphaned `usecase` parser handling. |
| 2026-06-05 `51d00fc` | “Update decision records and complete first part of refactoring” | Removed temporal machinery: quarter, numeric phase, release, completion date, and associated views/fields. |
| 2026-06-05 `1654ebe`, `5b14f64` | “refactor(taxonomy): retire metadata residue”; “refactor: finalize taxonomy retirement cleanup” | Removed effort/actual effort/risk/priority/since/user-role/business-value residue across schemas and consumers. |

[ADR-013](https://github.com/libar-dev/architect/blob/854f4a75936dda043d3683a977be0eeee4ade655/architect/decisions/adr-013-retire-unpopulated-temporal-axes.feature) gives the recorded rationale: these dimensions carried “no (or near zero) populated data” and were inherited monorepo machinery. It states that `release` had never been a registered taxonomy tag; its data path was an unused table column. The decision also removes temporal/historical state from the live graph in favor of git history.

F04 Groups 3, 5, 8, 10, 12 and its summary document the wider formal removals: planning/business/discovery/sequence tags and redundant authored reverse relationships. The README changelog also records removal of external-dependency/parent and sequence/extraction-marker vocabulary. That documentary history must be distinguished from executable parser removals.

The extraction defects are separately identifiable:

| Commit | Commit’s own diagnosis | Defect and repair |
|---|---|---|
| `c398088`, 2026-05-29 | “featureIndex map silently last-write-wins” | Two Gherkin files shared identity; merging dropped one file’s rules. Added duplicate detection on raw features before collapse and split the identities. |
| `bda27f4`, 2026-05-29 | Graph “reported fiction patterns” | Throwaway CLI fixtures carried real tags and entered the production scan; removed them. |
| `85bbc4c`, 2026-06-13 | “fix 2 tooling gaps”; “silent-failure-to-zero” | Added missing package-local feature globs and a Gherkin space-form tag lint; corrected missing gates and non-comma dependency syntax. |

Current mismatches in item 1—retired tags still taught by skills, formally canonical fields absent from extraction, and differing TS/Gherkin transport—are observable drift. They are not evidence that an annotation graph requires separate, divergent read models.

## 4. Gen 2’s refusals and the original typed concept

**Today’s Gen 2 restricts source authoring to a small anchor constant; the owner-selected v0 design explicitly supported typed markers, JSDoc, richer architectural nodes, and three distinct edge provenances.**

The operative text of [jsdoc-graph-extraction-refused](../../specs/decisions/jsdoc-graph-extraction-refused.sdp.md) is:

> “Ordinary JSDoc and local commentary never author graph content — no nodes, no relations, no component membership, no delivery facts, no Spec intent.”
> “The only write path from source into the graph is the statically reified anchor constant under `spec:model.anchors`, and it is identity only.”

Its alternative explicitly includes structured tags in the refusal:

> “Extracting identity tags from JSDoc (the v0 JSDoc marker style) stays refused with the decorator form — both are unextracted representations, and the anchor constant is the single binding syntax.”

The operative parts of [architectural-significance-rides-primitives](../../specs/decisions/architectural-significance-rides-primitives.sdp.md) say:

> “no ‘pattern’ term or kind is ratified.”
> “code linkage rides the `satisfies` → `decidedBy` join”
> “New `codeAnchor`s minted under this ruling satisfy only Specs the unit already realizes; anchors are never pointed at decision Specs or unfinished Specs to manufacture coverage.”

That record expressly gives up “CodeNode-grain roles” and machine-checked forbidden dependencies. It allows architectural significance on existing Spec kinds according to the truth being stated, existing relations, component membership, and `uses`.

Current [anchors.ts](../../src/model/anchors.ts) exposes `id`, optional `label`, **one required `satisfies`**, optional `component`, and optional `uses`. [Source extraction](../../src/extract/anchors.ts) admits statically reifiable top-level constants using trusted builders, not arbitrary executable metadata. A resolving `CodeNode → satisfies → Spec` confers structural `implemented` under [delivery-facts.ts](../../src/graph/delivery-facts.ts); it does not inspect whether the implementation fulfills the claim.

For the original design, **C01–C05** below mean [01 Core primitives](../../docs/lineage/v0-design/01-core-primitives.md), [02 System architecture](../../docs/lineage/v0-design/02-system-architecture.md), [03 Graph metamodel](../../docs/lineage/v0-design/03-graph-metamodel.md), [04 Authoring surfaces](../../docs/lineage/v0-design/04-authoring-surfaces.md), and [05 Runtime anchors](../../docs/lineage/v0-design/05-runtime-anchors.md). C01–C03 were read in full.

**The refined concept’s model.** C01 §§1.1–1.4 defines one persistent Spec with kind, abstraction, readiness, and optional typed facets. Types constrain shape; validators determine completeness. §2.5 permits design components, ports, dependencies, and decisions before runtime bindings (§2.6) or code bindings (§2.7). §§6–8 retain the Spec’s identity through enrichment and refinement. Thus an unrealized design is already legitimate graph content.

**Its architectural graph.** C03 §§2.5–2.7 distinguishes declared Components, Ports, and source-bound Implementations; a Component can exist in architecture declarations before code. Component fields include `layer` and `bounded_context`. §§3–3.1 defines `contains`, `dependsOn`, `satisfiedBy`, `implements`, and other architectural edges. Here `implements` means **Implementation→Port**; code realization of a Spec is represented by **Spec→satisfiedBy→Implementation**, not Gen 1’s overloaded `implements` spelling.

**Its provenance.** C03 §§4.1–4.3 explicitly separates **declared** edges from Spec/architecture files, **annotation** edges from code markers, and **inferred** edges from extractors, with location/marker or extractor/reasoning/confidence. Inferred findings are advisory and cannot alone become validator errors. C02 §§1, 4.1, 7 puts all extractors through one canonical graph and makes every projection a function of that graph. Three edge sources do not mean three read models.

**Its carriers.** C04 §2 says, “Three marker styles, all equally supported by the extractor”: decorator object literals, JSDoc tags, and typed marker helpers. §2.3 writes a function as `markImplementation({ id, kind, component, satisfies: [...] })(functionBody)`; the wrapper is runtime identity and statically recognizable. §2.4 makes `satisfies?: SpecId[]` optional and admits component/capability/port/event links, visibility, and tags. It excludes readiness, intent, behavior, and verification from implementation markers.

**Its compiler guarantees.** C01 §7.2 and C03 §6.4 combine nominal ID brands with a **generated union of known IDs**; typed helpers constrain namespaces, enum values, object shape, and referenced IDs when that union is generated and used. C04 §1.1 preserves literals through generic constructors. C02 §11 addresses stale unions by regenerating before typechecking. Neither branding alone nor JSDoc gives compile-time referential integrity; graph validation still checks resolution, uniqueness, completeness, and relationships.

**The runtime examples are concrete, not merely comment decoration.** C05 §2.1 says `defineRoute` both wraps route registration and “Is recognisable by the extractor”; it yields a Route node, structural membership/realization, and inspected invocation links. C05 §4.2’s `defineRegistrations({...} as const)` declares IDs, lifetimes, `dependsOn`, and `satisfies`: dependencies produce runtime `requires`; satisfaction produces Spec→implementation/layer `satisfiedBy`.

**`ed5f6ad^`.** Its parent is `64cf1c3`. Reading `git show ed5f6ad^:docs/concept/01-core-primitives.md` and sibling chapters finds the original model above. The present C01–C05 bodies match those parent versions after removing the later lineage header. Their later restoration date does not make the underlying concept later than `5d9681f`; they are nevertheless the design basis selected by the owner for this report.

**`5d9681f`, 2026-06-06.** The relevant paths are `docs/concept/02-core-model.md`, `03-the-one-graph.md`, and `04-authoring-and-binding.md`. Chapter 04 §2 still presents interchangeable decorator, JSDoc, and `markImplementation({ id, satisfies: [...], component })` constant forms, producing **annotation-provenance** bindings/structure while forbidding Spec intent in markers. Chapter 02 §§1–3 provides typed Spec shapes; §5 makes the generated ID union **optional**, with referential integrity enforced by validation. It therefore describes type-safe TS authoring, but not compiler proof of every ID reference in every carrier. Compared with Gen 1, it separates Spec truth from code identity; compared with today, it permits multiple marker representations and plural satisfaction, and does not reduce all source bindings to today’s required single-Spec constant.

## Progression through the concept

**The history moves from a broad typed metamodel to a smaller implemented anchor contract; the owner now selects the preserved broad v0 model as the basis for reconsideration.**

- **2026-06-06 06:46, `3c0a8f6`:** “Intialize with first synthesis.” Original C01 §§1, 2, 7, C02 §§1, 4, and C03 §§2–5 already contain typed Specs, architectural nodes, three marker forms, and declared/annotation/inferred provenance.
- **2026-06-06 09:12, `64cf1c3` = `ed5f6ad^`:** “Record ephemeral prototype synthesis analysis.” The original annotation chapters remain unchanged; this is the parent snapshot now preserved as v0.
- **2026-06-06 10:36, `ed5f6ad`:** “Update inital concept to the very first initial version.” Narrows the MVP, defers deep runtime/Gherkin/harness work, makes generated-ID typing optional, and treats verification structurally; the three generic marker representations remain.
- **2026-06-06 12:22, `5d9681f`:** “Review and update both stories and concept docs.” Retains chapter 04 §2’s interchangeable markers and annotation provenance; chapter 02 §5 leaves reference existence primarily to graph validation.
- **2026-06-06 13:27, `9bc360a`:** “Polish fundamental concepts.” Architectural significance governs detail; established shapes are referenced rather than repeatedly restated. Marker grammar is not replaced.
- **2026-06-07, `7140c3d`, `0ca7ed5`:** Terminology shifts toward anchor/anchored and altitude; readiness and delivery facts separate. The distinction between authored truth and source binding persists.
- **2026-06-10, `4bc5645`, `4638089`, `27c0eed`:** Source/test bindings become assertion-only; the implemented `codeAnchor` path settles on statically extracted constants and one required `satisfies`. Decorator/JSDoc concepts remain unimplemented.
- **2026-07-18, `0a06882`:** Markdown becomes the default Spec authoring surface, with per-ID canonicity; code anchors remain TypeScript.
- **2026-08-13, `778ce2a`:** Restores original C01–C05 under `docs/lineage/v0-design/`; C03 §4’s three-source provenance is preserved as documentary design, not restored runtime functionality.
- **2026-08-14–15, `29b11c0`, `7e22c63`, `14cc559`:** Adds structural `component`/`uses` and self-binding without additional delivery facts.
- **2026-08-21, `723bf95`, `1ea9741`:** Ratifies the no-pattern-vocabulary and no-JSDoc rulings.
- **2026-09-06, `57a67d2`:** Broadens architectural responsibility across existing Spec kinds and uses exported-public **or** cross-component significance; the closed anchor fields and absence of code-grain roles remain.

## 5. The smallest set on Gen 2’s graph

**The smallest defensible set preserves identity, role, context, realization, dependency, lifecycle, and an informational design reference; `depends-on` and `enables` need no separate source tags.**

The Studio claim map (in the adopter unit's working notes, not published) is an **81-row reading of Protocol code at `e945811`**, held in adopter calibration context: 5 realized, 25 partly, 25 not built, 25 departed, 1 not placed. Its draft twelve-member Studio Pack was unanchored. It is not a census of implemented Studio code in `libar-platform`. At the inspected current state, the ten `spec:consumers.spec-studio*` Specs had no delivery facts; the adopter graph had 243 Specs, 40 CodeNodes, no structural `memberOf`/`uses` edges, and no Studio Specs.

The proposed carrier is the **v0 typed marker model**, with a JSDoc representation feeding the same normalized schema. Typed markers receive compiler checks; JSDoc receives equivalent extractor/validator checks. Each code identity has one canonical authored representation. This restores representation choice without creating another graph.

| Gen-1 meaning retained | Gen-1 formal definition | v0 node, edge, and provenance | Mapping onto today’s Gen 2; required departure | Carrier |
|---|---|---|---|---|
| Gate + `pattern`: named architectural unit | F03 “Gate Tag”; F04 Group 1; F10 “Identity Fields” | C01 §§1.1, 7; C03 §§2.1, 2.7, 5 distinguish desired Spec identity and source Implementation identity; C02 §4.1 extracts both | Keep Spec/CodeNode IDs. A shared architectural pattern can be an explicitly named Spec of an existing suitable kind; no new `Pattern` node kind is necessary. Code identity must be possible without mandatory realization. | Typed marker or gated JSDoc for code; canonical Spec surface for desired truth |
| `role` | F04 Group 2; F10 “Architecture” | C03 §2 supplies node metadata, but **does not define Gen 1’s role enum**; C01 §1.1 permits tags, not equivalent role semantics; C02 §4.1 provides extraction placement | Add a closed, configurable role field on CodeNode/marker. This is a small metamodel extension, not something already supplied by `label`. | Both; shared enum/schema |
| `bounded-context` | F04 Group 2; F10 “Architecture” | C01 §2.5 references design Components; C03 §2.5 defines Component `bounded_context`; §3.1 `contains`; §§4.1–4.2 distinguish declared grouping from annotated membership; C02 §4.1 | Preserve `component`→`memberOf`; add declared Component context metadata. Context and component need not be synonymous. Today’s id-family grouping does not encode this attribute. | Context on component declaration; component membership in either marker carrier |
| `implements`: code realizes a Spec | F04 Group 4; F10 “Relationships”; 08 “N:1 Pattern Mapping” | C01 §2.7 and §4; C03 §3.1 `satisfiedBy`, annotation source §4.2; C02 §4.1 | Existing `satisfies` is the corresponding reversed edge. Restore v0 optional/plural binding where needed. Do not copy v0 `implements`, which targets Ports. Gherkin test realization maps to test/verification linkage, not automatically code implementation. | Both, with explicit realization semantics |
| `uses`: code collaboration | F04 Group 4, “Relationship Semantics” | C03 §§3–3.1 structural `dependsOn`, §4.2 annotation provenance; C02 §4.1; C01 §2.5 carries design dependencies separately | Reuse CodeNode `uses`. Keep authored collaboration distinct from inferred `imports`/`calls`; current model refuses that inferred structural layer. | Both; typed target IDs or validated JSDoc CSV |
| `depends-on`: genuine design need | F04 Group 4 retires separate tag; `uses` supplies the dependency | C01 §4 `dependsOn`; C03 §3.1 semantic dependency, §4.1 declared provenance; C02 §4.1 | Reuse Spec `dependsOn`. For an unrealized Studio part, declare its need on the Spec and traverse to the depended-on Spec’s code; do not invent a CodeNode for nonexistent code. | Spec declaration; no extra source tag |
| `enables`: reverse dependency view | F04 Group 4 retires authored form; F10 “Relationship Index” retains derived view | Reverse projection of C03 §3.1 `dependsOn`, preserving §4 provenance; C02 §7 makes projections derived | Compute reverse dependencies. `refines` means specialization and is not a general synonym for “enables.” A capability association uses C01 §4/C03 §§2.3, 3.1 membership when that is the actual assertion. | Derived; no authored marker |
| `status` | F04 Group 1; 09 “States”; F10 “Status and Lifecycle” | C01 §§1.4, 2.8–2.9; C03 §§2.1, 7; C02 §4.1 separates authored readiness and observed evidence | Keep Spec readiness and delivery facts separate. Do not transplant `completed` into a code marker or equate it with a passing test. Today’s structural facts already differ from v0’s richer observed-evidence model. | Spec declaration plus derived evidence; excluded from code markers |
| `see-also`: code refers to an unrealized design | F04 Group 4 explicitly defines informational reference without dependency | C01 §§2.5, 6, 8 permit design before binding; C03 §4.2 can record annotation provenance, but **no exact informational code→Spec edge is defined**; C02 §4.1 supplies extraction path | Add a non-conferring `references`/`seeAlso` edge and marker field. It must not be reduced to `satisfies`, `dependsOn`, or `refines`. This is an explicit extension to both v0 and today. | Both; typed Spec IDs or validated JSDoc CSV |

All source-authored rows above use **annotation provenance** under C03 §4.2; Spec/component declarations use **declared provenance** under §4.1. If import/call extraction is later used to assist discovery, it remains **inferred** under §4.3, carrying its extractor/confidence and never silently replacing an authored relationship. Today’s `declared`/`anchored`/`inferred` claim classification does not reproduce v0’s full per-edge provenance payload or its implemented inference layer.

**Naming an unrealized Spec without a delivery fact:** an existing reader’s marker can carry `references: ["spec:consumers.spec-studio.lenses"]` while omitting `satisfies`. The Spec exists as desired truth; the reader remains an actual source node; the annotation records relevance to that design. Only a separately authored realization edge participates in the `implemented` derivation. A wholly unrealized component belongs in declared design, not as a fabricated source anchor. Today’s mandatory `satisfies` and closed marker fields must change to admit this distinction.

**Making the claim map a projection requires authored claims as well as annotations.** Give each independently assessable claim a stable Spec or addressable claim identity; record its intended relationships, actual realizing code/tests, and explicit decision departures. Then the shared `Reader → pages` design, reader/renderer/publisher roles, context membership, dependencies, and realization paths become queryable rather than reconstructed from similar-looking code.

The exact five-way assessment cannot be derived from tag presence alone. “Partly” needs smaller claims or explicit coverage; “departed” needs a recorded decision relationship; “not built” requires an asserted scope or evidence beyond missing annotations. The minimal projection can truthfully show **unbound**, **linked as design context**, **realized**, and **verified by a named test**, while preserving authored assessments where the graph lacks sufficient evidence.

## Evidence-based corrections

- “About 50 tags shrank to 26” describes the formal-vocabulary cleanup; the standalone repository does not show a shipped 50-entry runtime registry becoming 26.
- The history identifies unused temporal/process machinery, duplicate identities, scan scope, and syntax handling; it does not establish dual TS/Gherkin extraction as the root cause.
- The JSDoc refusal’s rationale says it is “about prose, not identity,” but its operative alternative also refuses structured identity tags.
- Multiple typed/JSDoc extractors do not inherently create multiple read models: Gen 1 F10 and v0 C02 §7 explicitly converge them into one graph.
- Gen 1’s current `enables` is derived; the owner’s sample authored `enables` tag is surviving, ignored vocabulary.
- Gen 1 is not perfectly synchronized: formal specification, registry, extractor transport, and skill instructions disagree in the specific places reported above.
- “Fully type-safe” needs qualification: generated known-ID unions can check references; brands alone cannot, and neither compiler checks nor annotations prove behavioral fulfillment.
- V0 itself contains edge-example inconsistencies: C03 §11 reverses `satisfiedBy` relative to §3.1, and §4.2 illustrates `implements` to a Spec despite §3 defining Implementation→Port. The mapping above follows the explicit edge table.
