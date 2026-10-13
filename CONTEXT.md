# Ubiquitous Language — Glossary (ratified)

> **Status: RATIFIED · LEAN GLOSSARY.** The terminology base of the Libar Software Delivery Protocol — our
> bounded context's vocabulary: **one concept → one word**; the rest are *aliases to avoid*.
>
> This document carries **terms only**; the model exposition lives in the authored Specs under
> `specs/` (shipped with the package) and, in a source checkout of the repository, in the surviving
> design docs under `docs/concept/`. The lean decision registry, `docs/concept/DECISIONS.md`
> (shipped with the package), names each ratified decision and points to its carrying Spec;
> historical rationale lives in git, plans, and those Specs.

## Governing rubric  [SETTLED]

- **Adopt the established delivery *noun*** for any concept the Protocol shares with the industry. Coin/keep a
  distinct word only for a genuine differentiator — and then the word must *name the difference*.
- **Reject process *state-machine / lifecycle gating*** (sprint/ticket FSM, mandatory phase gates). Adopt the
  process *nouns*, not the process *gates*.
- **Two naming tests:** (a) carry epistemic status where it matters (authored vs derived, stated vs computed);
  (b) concrete & unambiguous to all three readers — typed code/CLI, the coding agent, and a Studio user.

## The meta-levels  (MOF-style meta-levels, made executable → `spec:decisions.executable-meta-model`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **the Protocol** | the meta-model — the primitive, descriptors, relations, and validators **as typed code**; the conformance contract instances conform to (Phase 0 built it) | "the process" (reserved, below) · "governs"/"polices" (it defines a contract) |
| **software-delivery process** | the modeled activity teams perform — what the Protocol is a meta-model *of* | — ("process" survives **only** here, in "delivery-process execution," and in the rejected *process state-machine*) |
| **authored model** | a project's authored instances; **conforms** — conformance checked, never workflow-gated | — |
| **derived facts** | machine truth about the authored model (code realizes it · a verifier exists · runtime observed it) — derived, never authored | — |

Self-hosting, the Protocol's own repo conforming to its own meta-model, came after Phase 0;
`spec:protocol.self-hosting` carries it.

## The primitive & its descriptors  (→ `spec:model.core-model`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`Spec`** | the one authored truth-primitive: a durable, **enrich-in-place** statement of intended system truth, never migrated to a different artifact type | "model element" · `Requirement`/`ImplementedRequirement` splits |
| **envelope** | the stable minimal outer shape — `id` · `title` · `kind` · `altitude` · `readiness` · `relations`; changes almost never | — |
| **`kind`** | the category of truth — a **true subtype** (changes required detail + validation); 8 values, below | "genus/species" |
| **`altitude`** | size/scope — a **position**: `epic → feature → story`; `epic` is the ceiling (above-epic defers) | "abstraction" |
| **`readiness`** | design maturity — a **position**: `idea → scoped → defined → ready`; **stated** by the author, checked against a floor | "status" · "candidate" (FSM imprint) · readiness is never "claimed" |

**`kind` — the 8 specializations** (literal → display): `behavior` → Use Case / Behavior · `workflow` →
Workflow · `example` → Example / Scenario · `rule` → Business Rule · `constraint` → Constraint (NFR) ·
`model` → Domain Model · `decision` → Decision Record · `contract` → Contract.

The familiar delivery nouns are **named coordinates on the one primitive, never separate authored types**:

| Label | Is | Is not |
|---|---|---|
| **Scenario** | a low-altitude `example`-kind `Spec` that `refines`/`verifies` a Story | an altitude or a kind |
| **NFR** | a `constraint` with a measurable `target`; the *flavor* (performance / security / …) lives on the section | a separate kind |
| **Executable Spec** | an `example` that **has a verifier** (a delivery fact) | a readiness rung |
| **capability / domain** | a **`Pack` grouping** and/or a designed-for Capability Map projection over high-altitude `behavior` Specs; no Capability Map is built, and the Studio groups Specs by Pack and draws no capability tree (`spec:consumers.spec-studio.lenses#rule.packGrouping`) | a kind or an altitude |

## Sections  (→ `spec:model.spec-sections`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **section** | the typed, optional detail-slice of a `Spec` — the **extension surface**; one concern each: `intent` · `behavior` · `constraints` · `model` · `design` · `decision` · `verification` · `ui` | "Facet" · "aspect" |
| **section ⟷ kind duality** | `constraints`/`model`/`decision` — and `behavior.rules`/`behavior.examples` vs the `rule`/`example` kinds — have a `kind` twin: keep **inline** when local detail; **promote** to a standalone `Spec` when shared or needing its own identity/lifecycle/review. **Sections carry content, relations carry linkage** (never a ref inside a section); **promotion is exclusive** (inline XOR promoted — content moves out, MD-10) | — |
| **primary behavior owner** | the one of Behavior, Rule, Workflow or Contract a Spec uses; its entries are the ones a rule key addresses (`spec:carrier.markdown-body-grammar`) | — |
| **question key** | the optional lower-camel key an open question carries in its marker, as in `[blocking #arcBoundary]`, unique in its Spec, which gives the question the entry address `spec:<id>#question.<key>` (`spec:model.open-question-keys`) | "question id" · "anchor" |
| **question field** | one of the four optional lines an open question carries beside its text, flag and key: `decider`, `links`, `provisional`, `trigger`; a `trigger` marks a deferral, none moves a floor (`spec:model.open-question-fields`) | "status" · "owner" (of a question) |
| **rule key** | the optional lower-camel key an entry of a Spec's primary behavior owner carries in its marker, unique among the rule and flow keys of that Spec, giving the entry the address `spec:<id>#rule.<key>`; an example's `verifies` lists the keys it exercises (`spec:model.rule-keys`) | "rule id" |
| **marker** | the bracketed prefix that opens an open question's or a keyed entry's text in a carrier: `[blocking #key]`, `[non-blocking #key]` or `[#key]`; carrier syntax, never a binding (`spec:model.open-question-keys`, `spec:model.rule-keys`) | "anchor" (the in-code binding) · "flag" (names the blocking part only) |
| **distillation boundary** | the point past which a Design entry may leave its Spec: the Spec is implemented with a verifier and a bound artifact carries the entry; explanatory prose always stays (`spec:model.enrichment-lifecycle`) | "slimming" (the act) |

## The other authored things  (no system truth — → `spec:model.pack-aggregate`, `spec:model.anchors`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`Pack`** | the authored grouping / review **aggregate** over `Spec`s; states **no truth of its own**; its `framing` is a plain descriptive note; a spec may belong to many packs; membership lives on the manifest, the `belongsTo` edge is derived from it | "SpecPack" |
| **anchor** | a human-written pointer **in source code**: *"this code location is a **binding** into the graph"* — identity, an optional label, zero or more Spec targets, and optional structure; a binding assertion only, never system-truth content (no behavior, rationale, readiness, status, acceptance criteria, or delivery facts); yields `anchored`-claim edges; written in one of **two representations**, the constant form or the comment form, feeding one closed envelope (`spec:model.anchors`); in prose, the verb **"annotate"** means "write an anchor" | "marker" · "annotation" |
| **constant form** | the anchor as a top-level `const` initialized with a trusted builder call (`codeAnchor` · `specTest` · `specOracle`), reified statically; trust is by a Protocol builder binding: the package, its zero-dependency `/anchors` subpath, or a relative import of the package's own `ids`, `anchors` or `model/code-anchor` module (`spec:model.anchors`) | "anchor constant" (the old name) · "marker constant" |
| **comment form** | the anchor as a top-level `/** … */` block in a `.ts`/`.tsx` file, above a statement, after the last one, or alone in the file, carrying reserved camelCase, TSDoc-compatible tags (`@sdpAnchor` · `@sdpSatisfies` · `@sdpReferences` · `@sdpRole` · …); `@sdpAnchor <id>` opens it, only the reserved tags are read, prose authors nothing, and no import is required (the comment-form ruling, MD-36) | "JSDoc anchor" · "doc tag" |
| **references** | the derived, `anchored` CodeNode → `Spec` edge from a code anchor's `references` list: *this code answers to that design* without claiming to realize it; the unit follows the design without realizing any of its promises, or realizes part of a Spec whose remaining promises no unit yet realizes, so a change to the design asks the code to follow; one direction only, so a design that builds on existing code says so by its own `dependsOn` or `refines` to the Spec the code satisfies, never by a reference from the code; a target names a whole Spec; it confers no delivery fact, moves no floor, and the drift alarm ignores it (the binding-grain ruling, MD-37) | "see-also" · "satisfies" (a realization claim) · "dependsOn" (a Spec relation) |
| **role** | the optional one-token value on a code anchor, lowercase kebab and never normalized, naming the architectural pattern its unit plays (`service` · `decider` · `projection` · …); a corpus-owned vocabulary whose taxonomy the census renders with counts, checked against no list (the architectural-annotation ruling, MD-38) | "pattern" · "kind" (reserved for the Spec descriptor) · "tag" |
| **layer** | the optional closed-set attribute of a `component:` anchor — `edge` · `application` · `domain` · `adapter` · `infrastructure`; outside the set, or on a non-component anchor, an envelope error | "tier" |
| **context** | the optional one-token value on a `component:` anchor, in the token grammar of `role`, naming its bounded context; on a non-component anchor, an envelope error | "bounded_context" (the v0 field) · "domain" |
| **architecturally significant unit** | a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding — component membership, a role, and references to the designs it answers to, with uses declared for its architectural dependencies, normally between components (a unit's own uses is optional); annotated on the anchor of the code that realizes it; the accepted set is an owner-reviewed declaration, never derived from imports (carried by `spec:model.structural-patterns`) | "pattern" (refused by the architectural-annotation ruling, MD-38, which replaced MD-34) |

**Two grouping mechanisms, kept distinct:** *refinement* (parent `Spec` → children — authored truth with
descendants) vs *the aggregate* (the `Pack` — a cross-cutting review collection, no truth of its own).

## Claims & the authored/derived split  (→ `spec:extraction.claim-taxonomy`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`claim`** | a fact's **epistemic status** — never its ancestry; values `declared` / `anchored` / `inferred`, **never collapsed** | "provenance" |
| **declared** | human-authored *intent* (relations, readiness, decisions) — authoritative intent | — |
| **anchored** | a human *binding* — an anchor binds a code unit, test, or oracle into the graph, pointing at zero or more `Spec` IDs (an identity-only code anchor binds structure alone) — authoritative binding, no intent | — |
| **inferred** | machine-derived *structure* (calls, imports) — advisory, never authoritative | — |
| **authored / derived** | the umbrella pair: authored = human claims (`declared` + `anchored`); derived = machine output | — |

No 4th `claim`: an edge computed deterministically from an authored source is a derivation **mechanism, not a
claim category** — it **inherits** its source's `claim` (so `belongsTo` carries `declared`).

## Delivery facts  (derived realization signals — → `spec:model.core-model`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **delivery fact** | a derived truth about a `Spec`'s *realization*, computed from edges, shown as a badge — **never authored** (authoring one is an honesty violation) | a readiness rung |
| **`implemented`** | ≥1 `satisfies` edge resolves directly to the Spec — code **claims** to realize it, *not* that it works or is live; the fact never propagates through refinement | — |
| **`has-verifier`** | a resolving test anchor `verifies` the Spec directly, or an **enabled verifier** verifies it — a verifier *exists*, *not* that it passed | — |
| **`observed`** *(aspirational)* | runtime evidence links to the Spec's target — the liveness rung | — |
| **enabled verifier** | a verifying `example`/scenario backed by a **linked, resolvable test anchor** — *structurally bound*, not runner-executed (skip/quarantine is CI's, exactly as pass/fail is) | — |

The payoff queries: ready unimplemented Specs excluding kinds `example` and `decision` form the
operational **build backlog**; `implemented ∧ ¬ready` is the **drift alarm**. The raw
`ready ∧ ¬implemented` expression also names ready example evidence and registry-ratified decision
records; the example realization posture (MD-24) and decision readiness posture (MD-26) keep those
facts literal while the canonical recipe reports both audited exclusions.

## The graph & extraction  (→ `spec:extraction.derive-graph`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **the one graph** | the single *derived* read model — a flat, typed, deterministic, regenerable snapshot-projection of the repo at a commit; the sole read model for current authored intent and bindings. A recipe or view whose contract admits it may read explicitly supplied input beside the graph (a base graph, imports, a perspective, a proposal, run records), identified apart from the graph and never answering in its name; validators and the shipped projections stay graph-only | "second store" (forbidden) · "sole input" (recipes take `--params`) |
| **`extractor`** | the producer — the *only* component that reads source; derives nodes, edges, `claim`s, and the validation report | — |
| **`nodeType` / `specKind`** | structural class (`Primitive` · `Pack` · `Anchor` · `CodeNode`, a closed set) vs the truth-category on `Primitive` nodes — kept split so they never collide | a single `kind` field |
| **git is the event log** | history and prior states live in git; the graph carries only current state | audit tables / lifecycle bookkeeping in the graph |
| **location table** | the graph's table, beside its nodes and edges, of the source line of every keyed Design and UI entry, every rule and flow entry, every open question and its fields, and every authored relation target; a location is never an identity or a binding target, and Primitive and Pack nodes carry no lines (`spec:extraction.entry-locations`) | "source map" · "entry anchor" |

## Validation & honesty  (→ `spec:validation.two-check-families`, `spec:validation.readiness-floor`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`validator`** | one individual deterministic check; groups into the two families below | — |
| **conformance checks** | "is this *well-formed* against the meta-model?" — referential integrity · duplicate IDs · `claim` separation · grouping coherence · ambiguity-is-loud | — |
| **honesty checks** | "is this *not pretending*?" — authoring-shape honesty (no hand-authored derived edges/facts) · honest readiness against the floor | — |
| **corpus rule** | an operator-selected graph body a corpus runs through its own `validate --rules` invocation; its findings name their rule and rules file and sit outside the conformance and honesty families; neither a rule-kind Spec nor a Protocol validator (`spec:validation.corpus-rules`) | "corpus check" · "custom validator" |
| **readiness floor** | the **minimum structural requirement to *state*** a readiness rung — a floor to clear, **never a quota to fill** or a score | "readiness profile" |
| **`gap`** | a surfaced absence (e.g. `ready` with no verifier) — informative, never a gate | — |
| **`orphan`** | a `Spec` with no relations and nothing pointing at it — informative | — |
| **derived readiness** | the highest rung whose floor clauses pass, computed from the graph ("structural floor reached"); rendered **beside** the stated rung, never overwriting the author's statement | — |
| **stated next rung** | the rung above a Spec's stated rung, with the floor clauses that keep the floor from reaching it; with no failing clause the rung waits only for its author's statement, which the Pack page writes as `nothing blocks`, never a promotion. It differs from the floor's next rung, the rung above the floor reached; promotion preflight (recipe 9) reports both, as `aboveStated` and `aboveFloor` (`spec:consumers.pack-design`) | "next rung" alone · "target rung" |
| **mention** | a `spec:` id written in a Spec's narrative or section text, outside the `gwt` and `gwt-vocabulary` fences; checked for resolution and for a backing declared relation in either direction, and it mints no edge (the checked-mentions decision, `spec:decisions.checked-mentions`) | "reference" · "citation" · "link" |
| **entry address** | a Spec id followed by `#`, a section name (`design`, `ui`, `question`, or `rule`), a dot, and the entry's lower-camel ASCII key, naming one keyed entry of that Spec's open section, one of its open questions, or one entry of its primary behavior owner that carries that key; admitted in prose and by `parseId` and refused in every id slot, so a Spec's own id never carries `#`; checked in prose by `spec:validation.prose-mentions` | "anchor" (reserved for the in-code binding) · "fragment" · "sub-id" |
| **dependency cycle** | a set of two or more Specs in which each reaches every other through declared `dependsOn` edges, or a Spec that declares `dependsOn` on itself; recipe 26 reports each and nothing refuses it (`spec:consumers.agent-surface.address-and-cycle-recipes`) | "circular dependency" · "loop" |

`ready` = the floor cleared **plus a human's `declared` statement**; that a review occurred is never a graph
fact or a checked property (that would be workflow-gating). The honesty bound: claim **"deterministically
validated," never "provably correct."**

## Surfaces & projections  (→ `spec:consumers.projections-model`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`projection`** | a pure function of the graph producing a consumer artifact — disposable, regenerable, never a second source | — |
| **Design Review** | the flagship curated review: a `Spec`/`Pack` rendered *in context* — the context in which a human decides to state `ready`; human practice, never a recorded fact or gate | — |
| **census** | the projection of taxonomy, readiness divergence, structural bindings and findings that `sdp census` publishes (`spec:consumers.census-page`) | "inventory" |
| **agent surface** | a **visible typed graph the agent *scripts*** via the typed CLI — no verb wall; the schema *is* the contract (under-typing hides a capability) | a 30-verb API · raw-JSON-you-rejoin |
| **`reader`** | the thin typed loader: joins + `claim` decode done once, returns composable data; authors/persists nothing — a front door, not a store | "handle" |
| **agent front door** | the CLI-facing realization of the agent surface (MD-22): **two entrances over one seam** — the package exports the `reader` constructor, and the CLI carries the evaluation sink; a composite naming both entrances, distinct from the `reader`'s own "front door, not a store" gloss above, which names the reader's role over the graph | a query API · a verb wall |
| **evaluation sink** | the front door's CLI entrance, the verb `sdp q`: derives the graph in process on every invocation, injects `g` / `graph` / `report` / `params`, evaluates the operator-supplied async body, prints its `return`; writes nothing and mints no query vocabulary (`spec:consumers.agent-surface.evaluation-sink`) | a REPL · a second read model |
| **demand map** | the ruled statement of how agents actually arrive — holding a **string**, a **file**, or a **changeset**, never the Spec id they are looking for — carried as clauses on `spec:consumers.agent-surface`; the reason the frozen entry adapters are `findByConcept` · `byFile` · `blastRadius` | — |
| **recipe** | a runnable, documented `sdp q` body composing the frozen adapters — the growth valve past them: when a question is not answered, script it, and a join freezes into the `reader` only at the second-caller bar; catalog at `docs/agent-surface/recipes.md`, every body executed as written by the recipe check | a new query verb |
| **recipe parameter** | the input a caller passes a recipe as data through `--params`, after the body under `sdp q` or after its file's `--rules` under `sdp validate`, read by the body from `params`, falling back to the catalog's sample when the catalog gives one (`spec:consumers.agent-surface.recipe-parameters`) | "argument" · "recipe flag" |
| **Pack design** | the reader's per-Pack assembly of each member's stated next rung, design columns and code bindings, with the Pack's boundary; the Design Review's Pack page renders it (`spec:consumers.pack-design`) | "Pack page" (names the rendering) · "capability page" |
| **design columns** | the counts and lists derived for a Spec beside its readiness: its keyed Design and UI entries, pinned declarations, open and blocking questions, and the decisions it names; never a score or a rung; what design a Spec carries is read from these columns and never stated, while readiness stays the author's stated design maturity of the intent (`spec:model.design-maturity`) | "design score" · "designed" (the original design's stage) |
| **boundary** | the Specs outside a Pack joined to a member by one of the four typed relations `refines`, `dependsOn`, `constrainedBy` and `decidedBy`: the Pack **rests on** a Spec a member names by one of them and is **rested on by** a Spec that names a member by one of them; outside Specs that `verifies` or `supersedes` a member list apart as `verifiedBy` and `supersededBy` (`spec:consumers.pack-design`) | "outside dependencies" · "perimeter" |
| **perspective** | a reader's concern a Pack is read from, such as the domain model, operations or the runtime platform: corpus data a recipe takes as a parameter to select and order a Pack's members, leaving each member's content whole, adding no kind, stage or sequence; the corpus owns its perspectives and the Protocol ships none (`spec:consumers.review-perspectives`) | "lens" (names the Studio's graph views) · "discipline" (the kind-or-section filter) |
| **blast radius** | the reader's file-level impact query: a changeset → the directly impacted `Spec`s/`Pack`s (authored at, or bound to, the changed files) + the explicit one-hop neighborhood; a changed identity-only CodeNode, bound to no Spec, is reported in its own bucket, neither dropped nor folded into coverage-unknown; never claims exhaustive reach | — |
| **coverage-unknown** | the honest blind spot of file-level impact: a changed file the graph records nothing at, **named in the result** — never silently dropped | — |
| **at-risk** | a node one explicit hop from an impacted node (the connecting edge + its `claim` carried), itself neither impacted nor at a changed file | — |
| **context bundle** | the reading material for one design pass, composed from the graph on each invocation by a catalog recipe within a budget counted in UTF-16 code units, stating its scope and what it left out; never saved (`spec:consumers.context-bundle`) | "token-budgeted slice" · "AI slice" |
| **MCP surface** | integration for user-facing **apps** (designed-in, deferred build) — distinct from the agent surface: agents *script*, apps *integrate* | — |
| **curated graph** | the declared intent and anchored bindings the one graph holds, sparse by design, read apart from the `inferred` impact graph (`spec:consumers.impact-graph`) | "authored graph" |
| **impact graph** | the mechanical code structure derived beside the curated graph under the `inferred` claim: file-level imports feed the curation report, and exhaustive symbol reach stays designed-in and deferred; divergence from the curated graph is **curation, not drift** (`spec:consumers.impact-graph`) | "mechanical substrate" |
| **intent composition** | the write-affordance: compose **scoped intent**, hand it to an agent that edits source; git records it; conformance checks gate — no patch loop | patch-back / codemod-from-view |
| **scoped intent** | *what* is composed: an explicit change bounded by a `Spec` / its neighbors / a `Pack` / open questions | — |

## The executable half  (carrier-independent machinery)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **step contract** | a derived, regenerable typed module emitted per `example` spec from the graph (the generated-union pattern): the union of the example's literal step strings; tests bind handlers against it, so spec-side drift is a compile error — derived, never authored, importable *because* it is a projection | importing the authored spec |
| **example space** | the typed parameter vocabulary a parent spec's steps declare — typically a `behavior` spec; any kind may own the space when the vocabulary parameterizes its own law (`rule` and `model` parents are lawful); the space its child examples bind points in — the sibling set shares one vocabulary | "variables" |
| **parameter slot** (short: **slot**) | one typed placeholder in a step's text | — |
| **bound point** | the concrete slot values an `example` child binds for the steps it uses; partial points are honest — an unbound slot in a *used* step caps the example below `defined` (the **concreteness law**, one structural floor clause) | — |
| **space contract** | the per-parent derived sibling of the step contract: the typed dimensions of the example space, every child's bound point, and the Outcome union derived from the parent's Then vocabulary | — |
| **pinned declaration** | a keyed Design entry whose value opens with a code span, stating one signature, type, validator or table a derived module can hold code to; recipe 24 lists them (`spec:extraction.contract-declarations`) | "pin" alone · "stub" |
| **oracle** | the authored expected-outcome semantics for a parent's example space — implementation-side, beside the tests, bound by the space's zero-or-one resolving `specOracle` anchor, never extracted; typed against the space contract on input and the derived Outcome union on output (`unspecified` is a first-class answer); rendered surfaces say **"expected outcome"** | a `model`-kind spec · a derived fact |
| **witness** | an example whose bound point falls in an outcome class — the evidence that class is covered | — |
| **coverage gap** | a region of the example space with no witness (or where the oracle answers `unspecified`) — an informative absence, never a gate | — |
| **world** | the state a bound point's handlers construct and assert against — built by the Given steps, exercised by the When, read by the Then; created fresh per example by the test adapter (the runner core plans and runs steps, never owns world lifecycle) | "fixture" · "test context" |
| **probe** | a synthetic spec, graph, or repository a world constructs so the law under test is the only thing that can refuse (`spec:probe.*` by convention); probes live inside bound suites and never enter the shipped corpus | "dummy" · "mock" |
| **`sdp import`** | one import verb with many source adapters, sharing the document emitter authored once in the winning carrier; the TS→`.sdp.md` adapter landed, the gen-1 `.feature` adapter designed-in and deferred | round-trip sync |

**Structural law (point-per-example, MD-17):** an `example` binds exactly **one** point; a table of cases is
authoring-surface sugar that statically expands to N sibling examples at extraction, and renderers may project
a sibling set back as a table — the graph never holds a multi-point example.

## The authoring carrier  (the carrier ruling, MD-18)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **carrier** | the text format that carries the authored `Spec` document — the envelope, the prose, and the owned notation; **ruled: Markdown (`.sdp.md`) for all eight kinds**, Gherkin (`.sdp.gherkin`) as a lawful per-ID carrier for behavior and example Specs, and the TS DSL as the import source and a lawful per-ID option (one canonical surface per ID, `spec:decisions.carrier-ruling`, completed for Packs and Gherkin by their carrying decisions); bare `.feature` is non-canonical import-source territory | "format"/"file type" (say which level) · a carrier is never a second store |
| **notation** | the Protocol-**owned** typed step language inside the carrier's fenced blocks — Given/When/Then step text and the slot vocabulary; owned by the Protocol whatever the carrier | "grammar" (the dismissed own-language direction) · "DSL" (reserved for the TS DSL) |

## Relations  (authored, typed, directed `Spec`→`Spec` edges — → `spec:model.relations`)

| Relation | Direction | Means | Industry anchor |
|---|---|---|---|
| **refines** | child → parent | a more precise child; how altitude descends; a decision that narrows one part of another decision refines it | UML «refine» |
| **dependsOn** | dependent → dependency | needs another `Spec` to hold | UML *Dependency* |
| **constrainedBy** | bounded → constraint | bounded by a `rule` or `constraint` Spec (a *typed* dependency) | — |
| **decidedBy** | shaped → decision | shaped by a Decision Record (an external `doc:` ADR target is a named deferral, below) | UML «trace» |
| **verifies** | verifier → target | an example/scenario verifies a target — also emitted derived from a test anchor (same type, different `claim`, never collapsed) | UML «verify» |
| **supersedes** | new → old | the newer Decision Record replaces the older one whole; the older record and the edge stay only while its text explains something a reader still needs, otherwise the newer record carries what survives and the older one is deleted, with git as its history | — |

**Derived, never authored:** `satisfies` (code → `Spec`, from an anchor; one edge per target) · `references`
(code → `Spec`, from an anchor; confers nothing) · `models` (oracle → `Spec`) · `belongsTo` (→ grouping, from the
manifest) · `memberOf` and `uses` (CodeNode → CodeNode, anchored structure). The edge list is **closed at
twelve**: these six plus the six authored relations above (`spec:extraction.derive-graph`). **Dropped:**
`exemplifies` (= `example` kind + `refines` + `verifies`).

| Term | Definition | Aliases to avoid |
|---|---|---|
| **relation reason** | the one optional line of prose an authored relation carries saying why it holds, owned by that relation; intent, never a fact, a floor or an edge (`spec:model.relation-reasons`) | "strength" · "aspect" · "rationale" (on an edge) |

## Delivery-process vocabulary  (adopted nouns; any realization is a projection, and none is built — `spec:decisions.adopt-the-nouns`, `spec:consumers.projections-model.roadmap-views`)

**discipline** (a filter over the graph by kind or section, not a phase you pass through) · **phase / iteration /
milestone** (descriptive vocabulary, optional roadmap projections, never gates) · **release** (a tagged set —
a git-tag projection) · **baseline** (a named approved snapshot; the **signed git tag is the approval
artifact** — approval remains outside the model, never an authored primitive).

**Guidance-only labels:** `delivery session` and `work shape` describe an agent interaction and
its advisory entry in `sdp-sessions`; `design pass`, `design diff`, `change proposal`, `design
backlog` and `curation report` name a design activity or a recipe's answer, and their carrying
Specs supply their meaning. None of them names a Protocol primitive, descriptor, relation,
delivery fact, workflow state, or graph state.

## A worked dialogue  (the language in use)

> **Engineer:** Is `spec:orders.create-order` ready to implement?
> **Agent:** It *states* `defined`, and the floor checks out — rules and examples present, every constraint
> target machine-readable, no blocking open questions in `intent`. It is not `ready`: its `dependsOn` target
> `spec:payments.authorize-payment` is still `scoped`.
> **Engineer:** And the scenario under it?
> **Agent:** `spec:orders.create-order.valid-cart` is an `example` at `story` altitude that `refines` and
> `verifies` the parent. Its test anchor resolves, so it is an **enabled verifier** — the parent carries
> `has-verifier`. That edge is `anchored`; the example's own `verifies` is `declared`. Never collapsed.
> **Engineer:** Anything dishonest in the pack?
> **Agent:** One **drift alarm**: `spec:orders.order-inventory-rule` is `implemented ∧ ¬ready` — an anchor
> binds code to it, but the design isn't mature. And one `gap`, informative only: the NFR has no verifier.

## Flagged ambiguities  (named, not silently resolved)

- **"epistemic boundary"** is a *working name* for the humans-assert-intent / machines-assert-structure
  division (`spec:extraction.claim-taxonomy`, `spec:model.anchors`); a friendlier Studio-facing
  name is a minor open item.
- **`ref()`** in the DSL is a **spec-only** reference builder wearing a generic name (it rejects
  `pack:`/`doc:` targets); a source checkout also notes this on the export in `src/ids.ts`. Consequently `decidedBy` → an
  external `doc:` ADR is a **named deferral** (MD-16, stated in `spec:decisions.carried-evidence`);
  revisit when `doc:`-target
  relations or pack-targeting arrive.
- **"vault"** is Obsidian's word for a folder of linked notes, used by the `idea` captures in
  `pack:obsidian-vault-v1` for a projection regenerated from the graph. That projection stands
  alone, beside the Studio and not as its local half (`spec:consumers.obsidian-vault`), and waits
  for a reader, so the term stays unratified until it is built; a **term address**
  (`spec:model.term-addresses`) is a candidate too.

## Term ledger  (locked / rejected / resolved)

- **Locked:** `Spec` · `Pack` · `section` · `anchor` · `claim` (`declared`/`anchored`/`inferred`) · the
  graph · `extractor` · `conformance` · `readiness floor` · `validator` · `gap` · `orphan` · `projection` ·
  `Design Review` · `reader` · `impact graph` · `agent surface` · `context bundle` · `MCP surface` ·
  `intent composition` / `scoped intent` · delivery facts `implemented`/`has-verifier`/`observed` ·
  `blast radius` / `coverage-unknown` / `at-risk` · `derived readiness` · `step contract` ·
  `space contract` · `example space` · `parameter slot` (short *slot*) · `bound point` · `oracle`
  (`specOracle` anchor; rendered as "expected outcome") · `witness` · `coverage gap` · `sdp import` ·
  `carrier` · `notation` (both ratified at the carrier ruling, MD-18) ·
  `agent front door` · `evaluation sink` / `sdp q` · `demand map` · `recipe` (the growth-valve
  sense) — the last four by the front-door ruling, MD-22; the **Surfaces & projections** rows give
  the referents · `constant form` · `comment form` · `references` · `role` · `layer` · `context` —
  the six of the comment form, binding-grain and architectural significance rulings, MD-36 to
  MD-38 · `question key` · `stated next rung` · `design columns` · `Pack design` · `boundary`
  (rests on, rested on by) · `location table` · `recipe parameter` · `pinned declaration` ·
  `dependency cycle` · `perspective` · `mention` · `entry address` · `primary behavior owner` ·
  `question field` · `rule key` · `marker` (the bracket prefix) · `distillation boundary` ·
  `corpus rule` · `census` · `curated graph` · `relation reason` — carried by the named Specs
  cited in their glossary rows; mention and entry address follow the checked-mentions decision.
- **Descriptor values locked:** `kind` ∈ {`behavior`,`workflow`,`example`,`rule`,`constraint`,`model`,
  `decision`,`contract`} · `altitude` ∈ {`epic`,`feature`,`story`} · `readiness` ∈
  {`idea`,`scoped`,`defined`,`ready`}.
- **Rejected:** `provenance` (as a fact's epistemic status → `claim`; the build-origin sense, the
  package version and commit `sdp --version` names, keeps the word, `spec:consumers.engine-provenance`) ·
  `marker` (as a name for the in-code binding → `anchor`; the bracket prefix `[#key]` /
  `[blocking #key]` keeps the word) · `Facet` (→ `section`) · `SpecPack` (→ `Pack`) ·
  `abstraction` (→ `altitude`) · `candidate` (as a readiness rung — FSM imprint) · FSM / status-FSM ·
  `model element` (as the primitive's name) · `genus`/`species` · `Scenario`/`capability`/`NFR`
  as descriptors (labels / projections, not descriptors) · `exemplifies` (relation) · `status` (on the
  `decision` section — FSM imprint; adoption arc = `readiness`, replacement = `supersedes`, rejected paths =
  `alternatives`/`consequences` — MD-11) · `pattern` (as an architectural primitive, kind, or
  `pattern:` namespace — ordinary English remains; the architectural-annotation ruling, MD-38,
  which replaced MD-34) · `annotation` (→ `anchor`; the verb "annotate" survives as "write an anchor").
- **Locked usage:** readiness is **"stated/asserted," never "claimed"** ("claim" is reserved for the `claim`
  taxonomy) · the meta-model defines the **contract**, **instances conform**; the Protocol neither
  governs nor polices a project, so "govern" and "police" never describe its relation to one;
  "checks police conformance and honesty" stays the guardrail's wording, because checks do enforce · checks are
  **conformance checks + honesty checks** · **pre-graph** = upstream of graph derivation in the
  one validation path (the authored level before the extractor runs) — a level checks never live in:
  validators consume the one graph only, never a second validation path (one validation path, MD-14).
- **Resolved (MD-15):** Markdown Spec files use the **`.sdp.md`** extension by default; **`.sdp.ts`**
  identifies the lawful TypeScript carrier without colliding with every JS test-runner's default glob.
  The model name `Spec` itself was always settled — only the file serialization changed. MD-28 applies
  the same collision-safety law to the Gherkin option as **`.sdp.gherkin`**.
- **Resolved (the carrier ruling, MD-18, completed by the Pack syntax ruling, MD-25, the
  Gherkin carrier option, MD-27, and the `.sdp.gherkin` extension, MD-28):** Specs and Packs default
  to Markdown; the TS DSL survives as import source and a lawful per-ID option; behavior and example
  Specs may instead use a `.sdp.gherkin` carrier. Bare `.feature` stays non-canonical import-source
  territory. The surviving law is **one canonical surface per ID, no mixing**
  (`spec:decisions.carrier-ruling`); the `.sdp.ts` extension law (MD-15) is re-pointed, not
  repealed — its rationale carries to the `.sdp.md` and `.sdp.gherkin` siblings.
- **Resolved (the prose-ownership law, MD-19):** free prose enters the graph as **description values on
  typed owners** — the owning section or the `Spec` itself (the spec-level narrative slot); never a
  heading-path store, never a file-only pointer; a relation owns its one-line reason
  (`spec:model.relation-reasons`), an open question owns its four fields
  (`spec:model.open-question-fields`), and unowned prose refuses loudly.
- **Naming (resolved — the protocol naming, MD-5):** product **Libar Software Delivery Protocol** (short form "the Protocol");
  CLI **`sdp`**; npm **`@libar-dev/software-delivery-protocol`** (single package); repo
  `libar-dev/software-delivery-protocol`; namespaces `@libar-dev/` (OSS) vs `@libar-ai/` (commercial).
  "Protocol" names the meta-level (a conformance contract, not a workflow); "process" is retained only for
  the modeled activity.
