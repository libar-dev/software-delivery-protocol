# Ubiquitous Language

This is the broad working glossary for Libar Omni.

It is intentionally wider than [/Users/darkomijic/dev-projects/libar-omni-concept/docs/concept/GLOSSARY.md](/Users/darkomijic/dev-projects/libar-omni-concept/docs/concept/GLOSSARY.md): it keeps the canonical Omni terms, the translation layer from Libar Architect, and the failure modes most likely to matter in a deep grilling session.

Use it with one bias: familiarity is not authority. When Architect and Omni diverge, prefer the Omni term and treat the Architect term as lineage, not destiny.

## Framing

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Founding Principle - One Graph** | The doctrine that repo truth is authored once and every consumer artifact fans out from one derived graph. | big doc, sync layer, pattern catalog |
| **Principle** | A load-bearing law the design stands or falls on. | implementation detail, preference |
| **Representation** | A chosen mechanism that serves a principle but could change without changing the design's meaning. | law, invariant |
| **CORE** | A rule or capability that belongs to the first honest MVP slice. | future work, stretch goal |
| **ASPIRATIONAL** | A rule or capability deliberately designed in but deferred from the MVP build. | vague future, maybe later |
| **Canonical repo** | The committed repository contents treated as the only authoritative store. | cache, generated output, app state |
| **Canonical source of truth** | The typed specs, code, and markers committed in the repo. | second store, docs cache |
| **Projection** | A pure function of the graph that produces a consumer artifact or view. | copy, dump, export layer |
| **Event log** | Git history as the record of changes and prior states. | event store, event sourcing |
| **Epistemic boundary** | The rule that humans author intent and machines derive structure. | shared authority, loose trust model |
| **No-second-store rule** | The rule that no consumer may keep a parallel authoritative model outside the repo and the derived graph. | sync strategy, replicated source of truth |

## Core Authored Model

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Spec** | The one persistent primitive: a statement of desired system truth that is enriched in place. | pattern, ticket, story, artifact |
| **Envelope** | The stable minimal outer shape of a Spec. | header, shell, schema |
| **Stability contract** | The expectation that the Spec envelope changes rarely while growth happens through facets and enum expansion. | frozen schema, permanent shape |
| **Facet** | An optional typed slice of detail on a Spec. | field, blob, section |
| **Enrichment in place** | Adding detail to the same Spec ID instead of converting it into a different artifact type. | migration, promotion, artifact hop |
| **Refinement into children** | Adding precision by authoring child Specs linked with `refines`. | replacement tree, decomposition only |
| **One canonical surface per ID** | The rule that exactly one authoring surface owns a given ID at a time. | dual write, mixed ownership |
| **Static-data constraint** | The rule that authored spec source must be statically extractable and side-effect free. | executable spec file, dynamic DSL |
| **Significance governs detail** | The rule that detail follows architectural importance, not tier-filling pressure. | fill the level, boilerplate completeness |
| **Kind** | The category of truth a Spec states. | artifact type, class, bucket |
| **Abstraction** | The intent altitude of a Spec. | level, tier, scope |
| **Altitude** | The prose name for a Spec's abstraction value. | level |
| **Readiness** | The author-claimed design maturity of a Spec. | status, phase, delivery state |
| **Rung** | The prose name for a readiness value. | level |
| **Delivery fact** | A derived realization signal computed from graph edges rather than authored by a human. | status, workflow state, readiness |

## Readiness Rungs

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Sketch** | The minimal intentionally vague statement of desired outcome or parent/child intent. | candidate, idea note |
| **Framed** | A Spec with enough connected structure to show what it relates to and what kind of truth it carries. | scoped, outlined |
| **Specified** | A Spec whose behavior or constraints are concrete enough to reason about a viable solution. | detailed enough, almost designed |
| **Designed** | A Spec whose structure and decisions are concrete enough to guide implementation. | bound, active |
| **Ready** | A Spec that is designed, reviewed in context, and not blocked by unresolved design uncertainty. | completed, approved, implemented |
| **Claimed readiness** | The explicit readiness rung authored on a Spec. | trusted status |
| **Derived readiness** | The optional computed readiness inferred from what the Spec actually contains. | real status |

## Abstraction Altitudes

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Domain** | A subdomain or bounded-context-scale statement of truth. | epic, area, pack |
| **Capability** | A durable ability the system must possess. | feature set, module |
| **Feature** | A cohesive user or system outcome that realizes part of a capability. | task, ticket |
| **Scenario** | A concrete example or verification path through behavior. | test case only, edge item |

## Spec Kinds

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **`capability`** | A kind of Spec that states an ability, regardless of its abstraction altitude. | feature family |
| **`behavior`** | A kind of Spec that states how the system should act. | requirement blob |
| **`workflow`** | A kind of Spec that states ordered coordination across steps or actors. | process note |
| **`example`** | A kind of Spec that states a concrete illustrative or verifying case. | sample only |
| **`rule`** | A kind of Spec that states a must-hold policy or invariant. | checklist item |
| **`constraint`** | A kind of Spec that states a limiting bound such as quality, security, performance, compliance, operational, or policy truth. | business rule catch-all |
| **`model`** | A kind of Spec whose main job is to define domain vocabulary. | schema, read model |
| **`decision`** | A kind of Spec whose main job is to record a durable system decision. | ADR by default |
| **`contract`** | A kind of Spec that states an interface or boundary agreement. | abstraction level |

## Facets And Content

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Intent facet** | The facet that states why a Spec exists and what outcome it seeks. | brief, summary blob |
| **Behavior facet** | The facet that carries rules and examples that make expected behavior legible. | acceptance prose |
| **Constraint facet** | The facet that carries bounds a solution must respect. | NFR dump, policy blob |
| **DomainModelFacet** | The facet that defines terms and concepts, not schema or persistence design. | ERD, database model |
| **Design facet** | The facet that carries structure, dependencies, and implementation-shaping decisions. | implementation plan |
| **Decision facet** | The facet that carries context, chosen option, rationale, alternatives, and consequences for a decision Spec. | meeting notes |
| **Verification facet** | The facet that states how a Spec should be verified, not whether a verifier already exists. | test result, pass/fail |
| **UI facet** | The facet that carries user-facing interaction or presentation detail. | frontend ticket |
| **Open question** | A recorded unresolved uncertainty on a Spec. | TODO, casual note |
| **Blocking open question** | An open question that prevents a Spec from honestly claiming `ready`. | comment, nit |
| **Invariant** | A must-always-hold rule or constraint. | assumption, guideline |
| **Verifier** | An executable artifact that can prove or check a Spec. | passing test, evidence |
| **Verification mode** | The declared style of verification, such as executable versus illustrative. | readiness value |
| **Criteria** | Concrete conditions a verifier or reviewer can judge against. | vague intent |

## Grouping And Domain Vocabulary

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Pack** | A reified aggregate over Specs used as a recurring review unit. | bounded context, epic, folder |
| **Review unit** | A slice meant to be assessed in context rather than Spec-by-Spec isolation. | backlog bucket |
| **Manifest** | A Pack's explicit member list and the single source of membership truth. | index, membership mirror |
| **Model** | The domain-vocabulary sense only: terms and concepts, never the graph or persistence schema. | read model, schema, ERD |
| **Term** | A precisely defined domain word. | label, synonym |
| **Concept** | A named domain thing such as an actor, event, state, or command. | object, record |
| **modelRefs** | Pack references to `kind:"model"` Specs that share vocabulary without duplicating it. | sharedModel |
| **Bounded context** | The DDD boundary that maps most closely to a domain-altitude Spec, not to a Pack. | pack, product area |
| **Domain Spec** | A Spec at `abstraction:"domain"` that often carries the bounded-context-scale frame. | pack, epic |

## Graph, Provenance, And Derivation

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **The graph** | The single derived read source made of flat nodes and edges. | pattern graph, database, the model |
| **Single read model** | The rule that all downstream consumers read the graph and only the graph. | many local models |
| **Node** | A graph element with an ID and typed payload. | row, record |
| **Edge** | A graph element that links two nodes with a typed relationship and provenance. | loose reference, arrow only |
| **nodeType** | The field that says what broad class of node something is. | overloaded kind |
| **specKind** | The field that says which Spec kind a Spec node carries. | node kind only |
| **Extractor** | The deterministic producer that reads source and emits the graph plus validation output. | sync engine, crawler |
| **Derivation** | The pure transformation `graph = f(repo)` and `output = f(graph)`. | synchronization, mutation |
| **Determinism** | The rule that the same repo state yields byte-identical graph output. | best effort reproducibility |
| **Regenerability** | The rule that generated output can be deleted and rebuilt from source without loss. | cached state |
| **Graph diff** | The comparison of two graph projections from two commits. | history database |
| **Marker** | An in-code pointer from code to Spec identity and minimal structural facts. | tag, annotation, decorator in the abstract |
| **Declared** | Provenance for human-authored intent written directly in spec or pack source. | guessed, machine-derived |
| **Annotation** | Provenance for an edge emitted from a code marker. | marker itself, comment |
| **Inferred** | Provenance for machine-derived structural facts that are advisory and never authoritative. | declared, trusted intent |
| **Evidence** | Observed runtime truth populated by pipeline or operations, never by hand authoring. | verification, authored result |
| **Curated surface** | The editorially sparse architectural surface derived from declared and annotation truth. | full code graph |
| **Mechanical substrate** | The exhaustive derived import/symbol structure used for impact and curation assist. | the graph, second architecture |
| **Graceful partial extraction** | The rule that one bad input degrades locally instead of aborting the whole derivation. | fail hard everywhere |
| **Ambiguity is loud** | The rule that genuine conflicts fail explicitly instead of being silently merged. | deterministic tie-break on contradictions |
| **Curation, not drift** | The rule that sparse curated architecture need not mirror the mechanical firehose to be correct. | missing inferred edges = defect |

## Relations

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **`refines`** | An authored edge stating that one Spec is a more precise child of another. | contains, includes |
| **`dependsOn`** | An authored edge stating that one Spec needs another Spec to hold. | uses, blocks on |
| **`constrainedBy`** | An authored edge stating that one Spec is bounded by a rule or constraint Spec. | limitedBy |
| **`decidedBy`** | An authored edge stating that one Spec is shaped by a decision Spec or linked external decision doc. | ADR link, noted in |
| **`verifies`** | A trace edge stating that a scenario, example, or test checks a target Spec. | tests, covers loosely |
| **`supersedes`** | A current authored forward pointer from one decision record to another decision record that still exists. | replaces in history |
| **`belongsTo`** | A derived edge stating Pack membership based on the Pack manifest. | authored membership |
| **`satisfies`** | An annotation edge stating that code realizes a Spec. | satisfiedBy, implements loosely |

## Validation, Honesty, And Trace

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Validator** | A deterministic CI check over the graph. | ProcessGuard, linter only |
| **Readiness profile** | The minimum a readiness claim must satisfy in order to be honest. | quota, artifact checklist |
| **Base profile** | The small readiness requirement set common across kinds. | universal full matrix |
| **Kind-aware overlay** | The small extra readiness rule applied only where a kind genuinely differs. | per-kind bureaucracy |
| **Authoring-shape honesty** | The rule that humans must not hand-author data the pipeline should derive. | convenience write-back |
| **Referential integrity** | The property that every referenced ID resolves to an existing node. | loose linkage |
| **Duplicate-ID conflict** | The error state where more than one node claims the same ID. | merge preference |
| **Coherence** | A Pack-wide consistency check distinct from the completeness of any one member Spec. | member readiness |
| **Orphan** | A Spec with no relations and nothing pointing at it. | dangling reference |
| **Gap-warning** | A surfaced absence that informs without necessarily blocking a build. | failure, ignoreable note |
| **False readiness claim** | A claimed readiness rung the Spec does not structurally earn. | optimistic status |
| **Build backlog** | The query set `ready && !implemented`. | roadmap by hand |
| **Drift alarm** | The query set `implemented && !ready`. | generic drift |
| **Blast radius** | The set of code or Specs likely affected by a proposed or observed change. | guesswork impact |
| **Impact analysis** | A traversal that relates a change to affected Specs, verifiers, or neighbors. | grep only |
| **Curation assist** | Advisory help from the mechanical substrate that proposes or flags architecture candidates without authoring them. | inferred architecture |

## Consumers And Surfaces

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Design-review projection** | The flagship curated view of a Spec or Pack in context, including relations, delivery signals, and review affordances. | static doc page, report dump |
| **Design-review slice** | The pushed subset of design-review context prepared for a specific task or session. | whole graph by default |
| **Design question** | An auto-generated review prompt derived from blocking open questions or validator gaps. | free-form brainstorm |
| **Finding** | A surfaced issue resolved through the edit loop rather than stored as a first-class model primitive. | permanent node type |
| **Context bundle** | A token-budgeted curated slice of graph context supplied to an agent or session. | raw prompt paste |
| **Agent surface** | The coding-agent read surface over the graph. | user-facing API |
| **Visible typed graph** | The committed schema and inspectable data shape that agents can read and script directly. | opaque tool output |
| **Handle** | The thin typed loader that performs joins and decode once and returns composable data. | database, store |
| **CLI transport** | The typed CLI path that moves graph data to coding agents without hiding it behind an API wall. | MCP by default |
| **Entry adapter** | The bridge from grep-oriented starts such as a word, file, symbol, or diff into graph nodes. | bespoke script every time |
| **Human view** | The generated read-only projection aimed at humans. | hand-maintained docs |
| **MCP surface** | The designed-in but deferred integration surface for user-facing apps. | coding-agent surface |
| **Anti-corruption layer** | The ingest/egress boundary that translates adjacent tools into Omni's native model. | importer only, replacement platform |
| **Membrane** | The metaphor name for the anti-corruption layer. | core primitive |
| **Intent composition** | The write affordance where a user scopes intent and an agent edits canonical source directly. | patching, write-back sync |
| **Scoped intent** | An explicit change request bounded by pack, neighbors, siblings, or open questions. | vague request |
| **Push surface** | Context injected into a session up front, usually as a design-review slice or context bundle. | manual grep warmup |
| **Pull surface** | Graph data the agent scripts on demand through the visible typed graph and handle. | hidden API verbs |

## Workflow And Records

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Decision Spec** | An in-system durable decision modeled as `kind:"decision"`. | ADR by default |
| **Decision diary** | A meta-design record about why Libar Omni itself was designed a certain way. | decision Spec |
| **Handoff** | A forward-looking state capture for a later session or agent. | recap, transcript |
| **Pre-flight** | The initial readiness and scope checks run before a session starts. | warmup chatter |
| **Scope-validate** | The session-start check that asks whether the intended work is valid for the current state and scope. | permission slip |
| **Planning session** | A session centered on capturing or refining intent. | implementation pass |
| **Design session** | A session centered on enriching Specs and shaping structure. | coding pass |
| **Implementation session** | A session centered on code changes that realize already-shaped intent. | design pass |
| **Review session** | A session centered on gap-finding, verification, or regression checking. | rewrite by default |
| **Session scope** | The declared set of items a session is allowed to touch. | loose neighborhood |
| **Session exclusion** | The explicit do-not-edit list inside session control. | soft suggestion |

## Legacy Architect Translation Layer

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Pattern** | The Libar Architect name for the primary tracked architectural unit. | use **Spec** as the Omni canonical term |
| **Pattern graph** | The Libar Architect derived read model built from tagged Gherkin and TypeScript. | use **the graph** |
| **Tag** | The Libar Architect `@architect-*` metadata annotation format. | use **marker** only for code pointers in Omni |
| **Gate tag** | The Libar Architect opt-in tag that decided whether a file was extracted. | use TS canonical authoring and marker lint language instead |
| **Feature spec** | The Libar Architect Gherkin artifact for planned behavior. | use **Spec** for the Omni primitive |
| **ADR** | The Libar Architect Gherkin decision record format. | use **decision Spec** for in-system decisions and **decision diary** for meta-design decisions |
| **PDR** | The Libar Architect process decision record. | use **decision diary** or explicit process note depending context |
| **Design stub** | The Libar Architect TypeScript design artifact created at design tier. | use only as a representation-level term, not as the core lifecycle primitive |
| **Code-originated pattern** | The Libar Architect case where canonical identity lived in source code rather than a feature file. | use **one canonical surface per ID** and name the actual owning surface |
| **Executable spec** | The Libar Architect permanent executable Gherkin artifact. | use **verifier**, **example Spec**, or **verification trace** depending meaning |
| **Rule block** | The Libar Architect structured Gherkin unit carrying `Rule`, `Invariant`, `Rationale`, and `Verified by`. | use as a representation-level behavior format, not as a separate Omni primitive |
| **Verified by** | The Libar Architect prose back-link from an invariant to the scenarios that prove it. | use **verifies** for the graph edge and **criteria** or verifier language for intent |
| **Acceptance gate** | The Libar Architect threshold that promoted a candidate artifact onto the delivery track. | use readiness promotion and review language instead of FSM promotion language |
| **ProcessGuard** | The Libar Architect FSM enforcement engine around status transitions. | use **validator** language in Omni |
| **FSM status** | The Libar Architect delivery-state ladder `candidate/roadmap/active/completed/deferred`. | use **readiness** plus **delivery facts** |
| **Unlock reason** | The Libar Architect audit explanation attached to edits on completed work. | use explicit review rationale or decision language instead of lifecycle-tag language |
| **Conformance level** | The Libar Architect implementation tier of the spec itself, not of one business item. | use **CORE/ASPIRATIONAL** or validator coverage language |
| **Deliverable** | The Libar Architect planned file tracked in a Background table. | use **implementation artifact**, code path, or node ID |
| **Value transfer** | The Libar Architect act of moving durable meaning out of an ephemeral design artifact. | use as lineage only; Omni core prefers **enrichment in place** |
| **Ephemeral scaffold** | The Libar Architect temporary design artifact deleted after implementation. | use only for representation-level temporary artifacts, not the core **Spec** |
| **Promoted stub** | The Libar Architect code or contract stub whose identity travelled into production code. | use only as a representation-level migration term |
| **Step-definition stub** | The Libar Architect glue artifact that bound executable Gherkin to code. | use only for harness or BDD representation discussion |
| **Split-ownership principle** | The Libar Architect doctrine that feature files owned what/when and code owned how. | use **epistemic boundary** and **one canonical surface per ID** |
| **Hierarchy axis** | The Libar Architect epic/phase/task/slice decomposition that was independent of maturity. | use packs, domain Specs, and `refines` only if the new model actually needs them |
| **Bipartite pattern graph** | The Libar Architect shape where production and test patterns were separate nodes linked by `implements`. | use **the graph** with explicit provenance and verification edges |
| **`*ExecutableTests`** | The Libar Architect escape hatch for backfilling visibility onto already-shipped code. | use verifier-linked Specs and markers without inventing fake plan history |

## Hazards And Anti-Patterns

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **False settledness** | The condition where docs read as fully resolved even though inherited tensions are still live. | polished certainty |
| **Imprint hazard** | The risk that old Architect language quietly drags old model choices into Omni. | harmless familiarity |
| **Merged progression** | A single ladder that mixes design maturity and delivery realization. | simple status model |
| **Readiness conflation** | Treating derived implementation or verifier facts as if they were authored readiness. | richer readiness |
| **Verb wall** | A tool surface that hides shape behind many verbs instead of letting agents inspect and script typed data. | discoverable API by default |
| **Patch loop** | A write model where a view authors structured patches back into source instead of composing intent and editing source directly. | convenient editor sync |
| **Second store** | Any parallel authoritative model that must be kept in sync with repo truth. | cache, mirror |
| **Silent densification** | Inferring extra architectural edges from code and silently treating them as curated truth. | helpful enrichment |
| **Transcription bloat** | Copying prose between artifacts instead of distilling the durable invariant. | thoroughness |
| **Retroactive plan-level spec** | Authoring a fake planned artifact after code already ships just to manufacture history. | backfill planning |
| **Zombie design spec** | A temporary design artifact left around after its durable value already moved elsewhere. | extra documentation |
| **PM-tool leakage** | Importing sprint/review/QA state into the delivery model as if it were system truth. | richer lifecycle |
| **Dual canonical source** | Two authoring surfaces both claiming to own the same truth. | flexible authoring |

## Relationships

- A **Spec** has exactly one **kind**, one **abstraction**, and one claimed **readiness**, plus zero or more **facets**.
- A **Spec** may refine one or more parent Specs via `refines`, and a parent Spec may have many refined children.
- A **Pack** groups one or more **Specs** through its **Manifest**, and a Spec may belong to many Packs through derived `belongsTo` edges.
- A `kind:"model"` **Spec** may supply vocabulary to zero or more **Packs** through `modelRefs`.
- A **Marker** yields one or more **Annotation** edges but never owns a Spec's intent.
- Code nodes `satisfies` **Specs**, and verifiers `verifies` **Specs**.
- A **Decision Spec** may `supersedes` another decision record that still exists in the current repo.
- The **Extractor** derives **the graph** from the **Canonical repo**, and every **Projection** reads only the graph.
- The **Curated surface** expresses architecture, while the **Mechanical substrate** expresses exhaustive structural possibility.
- A **Design-review projection** may push a **Context bundle** into a session, and the **Agent surface** may pull more context through the **Visible typed graph**.
- **Validators** check claimed **Readiness** and surface **Delivery facts**, but they never author either one.

## Example Dialogue

> **Dev:** "I moved the Pattern to `active` and dropped it into the Checkout bounded-context pack. Is that enough to say it is ready?"
>
> **Domain expert:** "Let's split that up. In Omni the core unit is a **Spec**, not a Pattern; a **Pack** is a review aggregate, while the bounded-context-scale concept usually lives in a **domain** Spec."
>
> **Dev:** "Okay, but code already points at it with a marker. Doesn't that make it ready?"
>
> **Domain expert:** "No. The **Marker** yields an **Annotation** edge and may derive **implemented**, but **Ready** is a claimed **Readiness** rung earned in the **Design-review projection**."
>
> **Dev:** "So if I want the agent to inspect neighbors, I should add more CLI verbs?"
>
> **Domain expert:** "Prefer the **Visible typed graph** plus a thin **Handle**. Push the **Design-review slice** as a **Context bundle**, then let the agent script the graph for the long tail."
>
> **Dev:** "And where do we capture why Omni itself uses this framing?"
>
> **Domain expert:** "That goes in the **Decision diary**. A product or architecture choice inside the modeled system is a **Decision Spec**."

## Flagged Ambiguities

- **`model` is triple-overloaded.** It has meant the domain-vocabulary facet, the `kind:"model"` Spec, and the read model itself; reserve **model** for the vocabulary sense and say **the graph** for the read source.
- **`pattern` versus `Spec`.** Architect used **Pattern** as the universal tracked unit, but Omni's canonical primitive is **Spec**; use **Pattern** only when talking historically about Architect.
- **`pattern graph`, `read model`, and `the graph`.** All three can point at roughly the same read-side idea; prefer **the graph** in Omni and reserve **pattern graph** for historical Architect discussion.
- **`readiness` versus delivery facts.** Old language merged design maturity with realization; keep **Readiness** authored and keep **Delivery facts** derived.
- **`status` versus `readiness`.** Architect's FSM **status** was process/delivery state, while Omni's **readiness** is design maturity; do not substitute one for the other.
- **`pack` versus bounded context.** A **Pack** is a review aggregate, while a **bounded context** is a domain boundary usually carried by a domain-altitude Spec.
- **`tag` versus `marker` versus `annotation`.** A **Tag** is historical Architect syntax, a **Marker** is the in-code pointer, and **Annotation** is the provenance class of the emitted edge.
- **`decision Spec` versus `decision diary` versus `ADR`.** A **decision Spec** is in-system truth, a **decision diary** is meta-design reasoning about Omni itself, and **ADR** is usually the historical Architect format.
- **`verification` versus `evidence`.** **Verification** is design-time intent plus verifier existence, while **Evidence** is observed runtime truth.
- **`kind` versus `abstraction`.** **Kind** answers what category of truth a Spec states, while **Abstraction** answers at what altitude it states it.
- **`capability` appears in both axes.** That shared token is intentional: `kind:"capability"` and `abstraction:"capability"` answer different questions and may vary independently.
- **`contract` is a kind, not an abstraction rung.** Do not put contract into the altitude ladder.
- **`derived` versus authored.** A derived fact may be trustworthy, but it is still not a human-authored intent claim.
- **`drift` is ambiguous.** Use **drift alarm** only for `implemented && !ready`; for curated-versus-mechanical divergence, say **curation, not drift**.
- **`event sourcing` versus event log.** Omni borrows the projection intuition but should say **git is the event log** because the system is snapshot-oriented, not a full event-sourced state fold.
- **`stub` is overloaded.** If you must use it, qualify it as **design stub**, **promoted stub**, or **step-definition stub**; otherwise prefer the more exact Omni term.
