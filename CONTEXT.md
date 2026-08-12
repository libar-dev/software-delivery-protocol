# Ubiquitous Language — Glossary (ratified)

> **Status: RATIFIED · LEAN GLOSSARY.** The terminology base of the Libar Software Delivery Protocol — our
> bounded context's vocabulary: **one concept → one word**; the rest are *aliases to avoid*.
>
> This document carries **terms only**; the model exposition lives in the authored Specs under
> `specs/` and in the surviving design docs under `docs/concept/`. The lean decision registry
> points to carrying Specs; historical rationale lives in git, plans, and those Specs.

## Governing rubric  [SETTLED]

- **Adopt the established delivery *noun*** for any concept the Protocol shares with the industry. Coin/keep a
  distinct word only for a genuine differentiator — and then the word must *name the difference*.
- **Reject process *state-machine / lifecycle gating*** (sprint/ticket FSM, mandatory phase gates). Adopt the
  process *nouns*, not the process *gates*.
- **Two naming tests:** (a) carry epistemic status where it matters (authored vs derived, claimed vs computed);
  (b) concrete & unambiguous to all three readers — typed code/CLI, the coding agent, and a Studio user.

## The meta-levels  (MOF-style meta-levels, made executable → `00` §2)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **the Protocol** | the meta-model — the primitive, descriptors, relations, and validators **as typed code**; the conformance contract instances conform to (Phase 0 built it) | "the process" (reserved, below) · "governs"/"polices" (it defines a contract) |
| **software-delivery process** | the modeled activity teams perform — what the Protocol is a meta-model *of* | — ("process" survives **only** here, in "delivery-process execution," and in the rejected *process state-machine*) |
| **authored model** | a project's authored instances; **conforms** — conformance checked, never workflow-gated | — |
| **derived facts** | machine truth about the authored model (code realises it · a verifier exists · runtime observed it) — derived, never authored | — |

Self-hosting — the Protocol's own repo conforming to its own meta-model — is a later milestone, never a
Phase-0 claim (`00` §3).

## The primitive & its descriptors  (→ `spec:model.core-model`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`Spec`** | the one authored truth-primitive: a durable, **enrich-in-place** statement of intended system truth, never migrated to a different artifact type | "model element" · `Requirement`/`ImplementedRequirement` splits |
| **envelope** | the stable minimal outer shape — `id` · `title` · `kind` · `altitude` · `readiness` · `relations`; changes almost never (L9) | — |
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
| **capability / domain** | a **projection** (Capability Map over high-altitude `behavior` `Spec`s) and/or a **`Pack` grouping** | a kind or an altitude |

## Sections  (→ `spec:model.spec-sections`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **section** | the typed, optional detail-slice of a `Spec` — the **extension surface**; one concern each: `intent` · `behavior` · `constraints` · `model` · `design` · `decision` · `verification` · `ui` | "Facet" · "aspect" |
| **section ⟷ kind duality** | `constraints`/`model`/`decision` — and `behavior.rules`/`behavior.examples` vs the `rule`/`example` kinds — have a `kind` twin: keep **inline** when local detail; **promote** to a standalone `Spec` when shared or needing its own identity/lifecycle/review. **Sections carry content, relations carry linkage** (never a ref inside a section); **promotion is exclusive** (inline XOR promoted — content moves out, MD-10) | — |

## The other authored things  (no system truth — → `spec:model.pack-aggregate`, `04` §2)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`Pack`** | the authored grouping / review **aggregate** over `Spec`s; states **no truth of its own**; its `framing` is a plain descriptive note; a spec may belong to many packs; membership lives on the manifest, the `belongsTo` edge is derived from it | "SpecPack" |
| **anchor** | a human-written pointer **in source code**: *"this code location is the implementation/test **binding** for this Spec ID"* — a binding assertion only, never system-truth content (no behavior, rationale, readiness, acceptance criteria, or delivery facts); yields `anchored`-claim edges | "marker" |

**Two grouping mechanisms, kept distinct:** *refinement* (parent `Spec` → children — authored truth with
descendants) vs *the aggregate* (the `Pack` — a cross-cutting review collection, no truth of its own).

## Claims & the authored/derived split  (→ `01`, `spec:extraction.claim-taxonomy`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`claim`** | a fact's **epistemic status** — never its ancestry; values `declared` / `anchored` / `inferred`, **never collapsed** | "provenance" |
| **declared** | human-authored *intent* (relations, readiness, decisions) — authoritative intent | — |
| **anchored** | a human *binding* — an anchor points code → a `Spec` ID — authoritative binding, no intent | — |
| **inferred** | machine-derived *structure* (calls, imports) — advisory, never authoritative | — |
| **authored / derived** | the umbrella pair: authored = human claims (`declared` + `anchored`); derived = machine output | — |

No 4th `claim`: an edge computed deterministically from an authored source is a derivation **mechanism, not a
claim category** — it **inherits** its source's `claim` (so `belongsTo` carries `declared`).

## Delivery facts  (derived realization signals — → `spec:model.core-model`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **delivery fact** | a derived truth about a `Spec`'s *realization*, computed from edges, shown as a badge — **never authored** (authoring one is an honesty violation) | a readiness rung |
| **`implemented`** | ≥1 `satisfies` edge resolves directly to the Spec — code **claims** to realise it, *not* that it works or is live; the fact never propagates through refinement | — |
| **`has-verifier`** | ≥1 `verifies` edge from an **enabled verifier** resolves to the Spec — a verifier *exists*, *not* that it passed | — |
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
| **the one graph** | the single *derived* read model — a flat, typed, deterministic, regenerable snapshot-projection of the repo at a commit; the **sole** input every consumer reads | "second store" (forbidden) |
| **`extractor`** | the producer — the *only* component that reads source; derives nodes, edges, `claim`s, and the validation report | — |
| **`nodeType` / `specKind`** | structural class (`Primitive`/`Pack`/`Anchor`/`CodeNode`/…) vs the truth-category on `Primitive` nodes — kept split so they never collide | a single `kind` field |
| **git is the event log** | history and prior states live in git; the graph carries only current state | audit tables / lifecycle bookkeeping in the graph |

## Validation & honesty  (→ `spec:validation.two-check-families`, `spec:validation.readiness-floor`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`validator`** | one individual deterministic check; groups into the two families below | — |
| **conformance checks** | "is this *well-formed* against the meta-model?" — referential integrity · duplicate IDs · `claim` separation · grouping coherence · ambiguity-is-loud | — |
| **honesty checks** | "is this *not pretending*?" — authoring-shape honesty (no hand-authored derived edges/facts) · honest readiness against the floor | — |
| **readiness floor** | the **minimum structural requirement to *state*** a readiness rung — a floor to clear, **never a quota to fill** or a score | "readiness profile" |
| **`gap`** | a surfaced absence (e.g. `ready` with no verifier) — informative, never a gate | — |
| **`orphan`** | a `Spec` with no relations and nothing pointing at it — informative | — |
| **derived readiness** | the highest rung whose floor clauses pass, computed from the graph ("structural floor reached"); rendered **beside** the stated rung, never overwriting the author's statement | — |

`ready` = the floor cleared **plus a human's `declared` statement**; that a review occurred is never a graph
fact or a checked property (that would be workflow-gating). The honesty bound: claim **"deterministically
validated," never "provably correct."**

## Surfaces & projections  (→ `06`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`projection`** | a pure function of the graph producing a consumer artifact — disposable, regenerable, never a second source | — |
| **Design Review** | the flagship curated review: a `Spec`/`Pack` rendered *in context* — the context in which a human decides to state `ready`; human practice, never a recorded fact or gate | — |
| **agent surface** | a **visible typed graph the agent *scripts*** via the typed CLI — no verb wall; the schema *is* the contract (under-typing hides a capability) | a 30-verb API · raw-JSON-you-rejoin |
| **`reader`** | the thin typed loader: joins + `claim` decode done once, returns composable data; authors/persists nothing — a front door, not a store | "handle" |
| **agent front door** | the CLI-facing realization of the agent surface (MD-22): **two entrances over one seam** — the package exports the `reader` constructor, and the CLI carries the evaluation sink; a composite naming both entrances, distinct from the `reader`'s own "front door, not a store" gloss above, which names the reader's role over the graph | a query API · a verb wall |
| **evaluation sink** | the front door's CLI entrance, the verb `sdp q`: derives the graph in process on every invocation, injects `g` / `graph` / `report`, evaluates the operator-supplied async body, prints its `return`; writes nothing and mints no query vocabulary | a REPL · a second read model |
| **demand map** | the ruled statement of how agents actually arrive — holding a **string**, a **file**, or a **changeset**, never the Spec id they are looking for — carried as clauses on `spec:consumers.agent-surface`; the reason the frozen entry adapters are `findByConcept` · `byFile` · `blastRadius` | — |
| **recipe** | a runnable, documented `sdp q` body composing the frozen adapters — the growth valve past them: when a question is not answered, script it, and a join freezes into the `reader` only at the second-caller bar; catalog at `docs/agent-surface/recipes.md`, every body executed as written by the recipe check | a new query verb |
| **blast radius** | the reader's file-level impact query: a changeset → the directly impacted `Spec`s/`Pack`s (authored at, or bound to, the changed files) + the explicit one-hop neighborhood; never claims exhaustive reach | — |
| **coverage-unknown** | the honest blind spot of file-level impact: a changed file the graph records nothing at, **named in the result** — never silently dropped | — |
| **at-risk** | a node one explicit hop from an impacted node (the connecting edge + its `claim` carried), itself neither impacted nor at a changed file | — |
| **context bundle** | a token-budgeted curated slice pushed to an agent | — |
| **MCP surface** | integration for user-facing **apps** (designed-in, deferred build) — distinct from the agent surface: agents *script*, apps *integrate* | — |
| **impact graph** *(aspirational)* | the exhaustive import/symbol structure for blast-radius / find-all-usages; divergence from the curated graph is **curation, not drift** | "mechanical substrate" |
| **intent composition** | the write-affordance: compose **scoped intent**, hand it to an agent that edits source; git records it; conformance checks gate — no patch loop | patch-back / codemod-from-view |
| **scoped intent** | *what* is composed: an explicit change bounded by a `Spec` / its neighbors / a `Pack` / open questions | — |

## The executable half  (ratified at the plan-12 session — carrier-independent machinery)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **step contract** | a derived, regenerable typed module emitted per `example` spec from the graph (the generated-union pattern): the union of the example's literal step strings; tests bind handlers against it, so spec-side drift is a compile error — derived, never authored, importable *because* it is a projection | importing the authored spec |
| **example space** | the typed parameter vocabulary a parent spec's steps declare — typically a `behavior` spec; any kind may own the space when the vocabulary parameterizes its own law (`rule` and `model` parents are lawful); the space its child examples bind points in — the sibling set shares one vocabulary | "variables" |
| **parameter slot** (short: **slot**) | one typed placeholder in a step's text | — |
| **bound point** | the concrete slot values an `example` child binds for the steps it uses; partial points are honest — an unbound slot in a *used* step caps the example below `defined` (the **concreteness law**, one structural floor clause) | — |
| **space contract** | the per-parent derived sibling of the step contract: the typed dimensions of the example space, every child's bound point, and the Outcome union derived from the parent's Then vocabulary | — |
| **oracle** | the authored expected-outcome semantics for a parent's example space — implementation-side, beside the tests, bound by the space's zero-or-one resolving `specOracle` anchor, never extracted; typed against the space contract on input and the derived Outcome union on output (`unspecified` is a first-class answer); rendered surfaces say **"expected outcome"** | a `model`-kind spec · a derived fact |
| **witness** | an example whose bound point falls in an outcome class — the evidence that class is covered | — |
| **coverage gap** | a region of the example space with no witness (or where the oracle answers `unspecified`) — an informative absence, never a gate | — |
| **world** | the state a bound point's handlers construct and assert against — built by the Given steps, exercised by the When, read by the Then; created fresh per example by the test adapter (the runner core plans and runs steps, never owns world lifecycle) | "fixture" · "test context" |
| **probe** | a synthetic spec, graph, or repository a world constructs so the law under test is the only thing that can refuse (`spec:probe.*` by convention); probes live inside bound suites and never enter the shipped corpus | "dummy" · "mock" |
| **`sdp import`** | one import verb with many source adapters, sharing the document emitter authored once in the winning carrier; the TS→`.sdp.md` adapter landed, the gen-1 `.feature` adapter designed-in and deferred | round-trip sync |

**Structural law (point-per-example, MD-17):** an `example` binds exactly **one** point; a table of cases is
authoring-surface sugar that statically expands to N sibling examples at extraction, and renderers may project
a sibling set back as a table — the graph never holds a multi-point example.

## The authoring carrier  (ratified at the plan-16 ruling — the carrier ruling, MD-18)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **carrier** | the text format that carries the authored `Spec` document — the envelope, the prose, and the owned notation; **ruled: Markdown (`.sdp.md`) for all eight kinds**, the TS DSL remaining the import source and a lawful per-ID option (one canonical surface per ID, `04` §1) | "format"/"file type" (say which layer) · a carrier is never a second store |
| **notation** | the Protocol-**owned** typed step language inside the carrier's fenced blocks — Given/When/Then step text and the slot vocabulary; owned by the Protocol whatever the carrier | "grammar" (the dismissed own-language direction) · "DSL" (reserved for the TS DSL) |

## Relations  (authored, typed, directed `Spec`→`Spec` edges — → `spec:model.relations`)

| Relation | Direction | Means | Industry anchor |
|---|---|---|---|
| **refines** | child → parent | a more precise child; how altitude descends | UML «refine» |
| **dependsOn** | dependent → dependency | needs another `Spec` to hold | UML *Dependency* |
| **constrainedBy** | bounded → constraint | bounded by a rule / NFR / policy `Spec` (a *typed* dependency) | — |
| **decidedBy** | shaped → decision | shaped by a Decision Record (`doc:` only for a genuinely external ADR) | UML «trace» |
| **verifies** | verifier → target | an example/scenario verifies a target — also emitted derived from a test anchor (same type, different `claim`, never collapsed) | UML «verify» |
| **supersedes** | new → old | current forward-pointer between two Decision Records that both still exist | — |

**Derived, never authored:** `satisfies` (code → `Spec`, from an anchor) · `belongsTo` (→ grouping, from the
manifest). **Dropped:** `exemplifies` (= `example` kind + `refines` + `verifies`).

## Delivery-process vocabulary  (adopted nouns, realized only as projections — → `06` §6)

**discipline** (a lens/filter over the graph, not a phase you pass through) · **phase / iteration /
milestone** (descriptive vocabulary, optional roadmap projections, never gates) · **release** (a tagged set —
a git-tag projection) · **baseline** (a named approved snapshot; the **signed git tag is the approval
artifact** — approval remains outside the model, never an authored primitive).

**Guidance-only labels:** `delivery session` and `work shape` describe an agent interaction and
its advisory entry in `sdp-sessions`; neither names a Protocol primitive, descriptor, relation,
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
  division (`01`); a friendlier Studio-facing name is a minor open item.
- **`ref()`** in the DSL is a **spec-only** reference builder wearing a generic name (it rejects
  `pack:`/`doc:` targets) — documented on the export (`src/ids.ts`). Consequently `decidedBy` → an
  external `doc:` ADR is a **named deferral** (MD-16, stated in `spec:decisions.carried-evidence`);
  revisit when `doc:`-target
  relations or pack-targeting arrive.
- ~~Candidate vocabulary from the executable-spec exploration: *notation* · *carrier*~~ — **ratified
  by the carrier ruling (MD-18)**; see **The authoring carrier** above. The rest
  of the exploration's candidates ratified with their referents at the plan-12 session — see **The
  executable half** above.

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
  sense) — the last four ratified at the phase-5 PR review (the front-door ruling, MD-22); the
  **Surfaces & projections** rows above give the referents.
- **Descriptor values locked:** `kind` ∈ {`behavior`,`workflow`,`example`,`rule`,`constraint`,`model`,
  `decision`,`contract`} · `altitude` ∈ {`epic`,`feature`,`story`} · `readiness` ∈
  {`idea`,`scoped`,`defined`,`ready`}.
- **Rejected:** `provenance` (→ `claim`) · `marker` (→ `anchor`) · `Facet` (→ `section`) · `SpecPack`
  (→ `Pack`) · `abstraction` (→ `altitude`) · `candidate` (as a readiness rung — FSM imprint) · FSM /
  status-FSM · `model element` (as the primitive's name) · `genus`/`species` · `Scenario`/`capability`/`NFR`
  as descriptors (labels / projections, not descriptors) · `exemplifies` (relation) · `status` (on the
  `decision` section — FSM imprint; adoption arc = `readiness`, replacement = `supersedes`, rejected paths =
  `alternatives`/`consequences` — MD-11).
- **Locked usage:** readiness is **"stated/asserted," never "claimed"** ("claim" is reserved for the `claim`
  taxonomy) · the meta-model defines the **contract**, **instances conform**; "govern"/"police" retired ·
  checks are **conformance checks + honesty checks** · **pre-graph** = upstream of graph derivation in the
  one validation path (the authored layer before the extractor runs) — a layer checks never live in:
  validators consume the one graph only, never a second validation path (one validation path, MD-14).
- **Resolved (MD-15):** Markdown Spec files use the **`.sdp.md`** extension by default; **`.sdp.ts`**
  identifies the lawful TypeScript carrier without colliding with every JS test-runner's default glob.
  The model name `Spec` itself was always settled — only the file serialization changed.
- **Resolved (the carrier ruling, MD-18, completed by the Pack syntax ruling, MD-25):** Specs and
  Packs default to Markdown; the TS DSL survives as import source and a lawful per-ID option. The
  surviving law is **one canonical surface per ID, no mixing** (`04` §1); the `.sdp.ts` extension
  law (MD-15) is re-pointed, not repealed — its rationale carries to the `.sdp.md` sibling.
- **Resolved (the prose-ownership law, MD-19):** free prose enters the graph as **description values on
  typed owners** — the owning section or the `Spec` itself (the spec-level narrative slot); never a
  heading-path store, never a file-only pointer; the edge-text ownership rule is the surface-design
  session's named deliverable, and unowned prose refuses loudly until it lands.
- **Naming (resolved — the protocol naming, MD-5):** product **Libar Software Delivery Protocol** (short form "the Protocol");
  CLI **`sdp`**; npm **`@libar-dev/software-delivery-protocol`** (single package); repo
  `libar-dev/software-delivery-protocol`; namespaces `@libar-dev/` (OSS) vs `@libar-ai/` (commercial).
  "Protocol" names the meta-layer (a conformance contract, not a workflow); "process" is retained only for
  the modeled activity.
