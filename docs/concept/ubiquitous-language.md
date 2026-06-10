# Ubiquitous Language — Glossary (ratified)

> **Status: RATIFIED · LEAN GLOSSARY.** The terminology base of the Libar Software Delivery Protocol — our
> bounded context's vocabulary: **one concept → one word**; the rest are *aliases to avoid*.
>
> This document carries **terms only**; the model exposition lives in the design docs (`00`–`07`),
> rationale in `DECISIONS.md`.

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
| **the Protocol** | the meta-model — the primitive, descriptors, relations, and validators **as typed code**; the conformance contract instances conform to (Phase 0 builds it) | "the process" (reserved, below) · "governs"/"polices" (it defines a contract) |
| **software-delivery process** | the modeled activity teams perform — what the Protocol is a meta-model *of* | — ("process" survives **only** here, in "delivery-process execution," and in the rejected *process state-machine*) |
| **authored model** | a project's authored instances; **conforms** — conformance checked, never workflow-gated | — |
| **derived facts** | machine truth about the authored model (code realises it · a verifier exists · runtime observed it) — derived, never authored | — |

Self-hosting — the Protocol's own repo conforming to its own meta-model — is a later milestone, never a
Phase-0 claim (`00` §3).

## The primitive & its descriptors  (→ `02` §1–§2)

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

## Sections  (→ `02` §3)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **section** | the typed, optional detail-slice of a `Spec` — the **extension surface**; one concern each: `intent` · `behavior` · `constraints` · `model` · `design` · `decision` · `verification` · `ui` | "Facet" · "aspect" |
| **section ⟷ kind duality** | `constraints`/`model`/`decision` — and `behavior.rules`/`behavior.examples` vs the `rule`/`example` kinds — have a `kind` twin: keep **inline** when local detail; **promote** to a standalone `Spec` when shared or needing its own identity/lifecycle/review. **Sections carry content, relations carry linkage** (never a ref inside a section); **promotion is exclusive** (inline XOR promoted — content moves out, MD-10) | — |

## The other authored things  (no system truth — → `02` §4, `04` §2)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`Pack`** | the authored grouping / review **aggregate** over `Spec`s; states **no truth of its own**; its `framing` is a plain descriptive note; a spec may belong to many packs; membership lives on the manifest, the `belongsTo` edge is derived from it | "SpecPack" |
| **anchor** | a human-written pointer **in source code**: *"this code location is the implementation/test **binding** for this Spec ID"* — a binding assertion only, never system-truth content (no behavior, rationale, readiness, acceptance criteria, or delivery facts); yields `anchored`-claim edges | "marker" |

**Two grouping mechanisms, kept distinct:** *refinement* (parent `Spec` → children — authored truth with
descendants) vs *the aggregate* (the `Pack` — a cross-cutting review collection, no truth of its own).

## Claims & the authored/derived split  (→ `01`, `03` §3)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`claim`** | a fact's **epistemic status** — never its ancestry; values `declared` / `anchored` / `inferred`, **never collapsed** | "provenance" |
| **declared** | human-authored *intent* (relations, readiness, decisions) — authoritative intent | — |
| **anchored** | a human *binding* — an anchor points code → a `Spec` ID — authoritative binding, no intent | — |
| **inferred** | machine-derived *structure* (calls, imports) — advisory, never authoritative | — |
| **authored / derived** | the umbrella pair: authored = human claims (`declared` + `anchored`); derived = machine output | — |

No 4th `claim`: an edge computed deterministically from an authored source is a derivation **mechanism, not a
claim category** — it **inherits** its source's `claim` (so `belongsTo` carries `declared`).

## Delivery facts  (derived realization signals — → `02` §2)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **delivery fact** | a derived truth about a `Spec`'s *realization*, computed from edges, shown as a badge — **never authored** (authoring one is an honesty violation) | a readiness rung |
| **`implemented`** | ≥1 `satisfies` edge resolves to the Spec — code **claims** to realise it, *not* that it works or is live | — |
| **`has-verifier`** | ≥1 `verifies` edge from an **enabled verifier** resolves to the Spec — a verifier *exists*, *not* that it passed | — |
| **`observed`** *(aspirational)* | runtime evidence links to the Spec's target — the liveness rung | — |
| **enabled verifier** | a verifying `example`/scenario backed by a **linked, resolvable test anchor** — *structurally bound*, not runner-executed (skip/quarantine is CI's, exactly as pass/fail is) | — |

The payoff queries: `ready ∧ ¬implemented` = the **build backlog**; `implemented ∧ ¬ready` = the **drift
alarm**.

## The graph & extraction  (→ `03`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **the one graph** | the single *derived* read model — a flat, typed, deterministic, regenerable snapshot-projection of the repo at a commit; the **sole** input every consumer reads | "second store" (forbidden) |
| **`extractor`** | the producer — the *only* component that reads source; derives nodes, edges, `claim`s, and the validation report | — |
| **`nodeType` / `specKind`** | structural class (`Primitive`/`Pack`/`Anchor`/`CodeNode`/…) vs the truth-category on `Primitive` nodes — kept split so they never collide | a single `kind` field |
| **git is the event log** | history and prior states live in git; the graph carries only current state | audit tables / lifecycle bookkeeping in the graph |

## Validation & honesty  (→ `05`)

| Term | Definition | Aliases to avoid |
|---|---|---|
| **`validator`** | one individual deterministic check; groups into the two families below | — |
| **conformance checks** | "is this *well-formed* against the meta-model?" — referential integrity · duplicate IDs · `claim` separation · grouping coherence · ambiguity-is-loud | — |
| **honesty checks** | "is this *not pretending*?" — authoring-shape honesty (no hand-authored derived edges/facts) · honest readiness against the floor | — |
| **readiness floor** | the **minimum structural requirement to *state*** a readiness rung — a floor to clear, **never a quota to fill** or a score | "readiness profile" |
| **`gap`** | a surfaced absence (e.g. `ready` with no verifier) — informative, never a gate | — |
| **`orphan`** | a `Spec` with no relations and nothing pointing at it — informative | — |

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
| **context bundle** | a token-budgeted curated slice pushed to an agent | — |
| **MCP surface** | integration for user-facing **apps** (designed-in, deferred build) — distinct from the agent surface: agents *script*, apps *integrate* | — |
| **impact graph** *(aspirational)* | the exhaustive import/symbol structure for blast-radius / find-all-usages; divergence from the curated graph is **curation, not drift** | "mechanical substrate" |
| **intent composition** | the write-affordance: compose **scoped intent**, hand it to an agent that edits source; git records it; conformance checks gate — no patch loop | patch-back / codemod-from-view |
| **scoped intent** | *what* is composed: an explicit change bounded by a `Spec` / its neighbors / a `Pack` / open questions | — |

## Relations  (authored, typed, directed `Spec`→`Spec` edges — → `02` §6)

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
artifact** — approval provenance is git-native, never an authored primitive).

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
- **`ref()`** in the DSL is today a **spec-only** reference builder wearing a generic name (it rejects
  `pack:`/`doc:` targets) — documented on the export (`src/ids.ts`). Consequently `decidedBy` → an
  external `doc:` ADR is a **named deferral** (MD-16, stated in `02` §6); revisit when `doc:`-target
  relations or pack-targeting arrive.

## Term ledger  (locked / rejected / resolved)

- **Locked:** `Spec` · `Pack` · `section` · `anchor` · `claim` (`declared`/`anchored`/`inferred`) · the
  graph · `extractor` · `conformance` · `readiness floor` · `validator` · `gap` · `orphan` · `projection` ·
  `Design Review` · `reader` · `impact graph` · `agent surface` · `context bundle` · `MCP surface` ·
  `intent composition` / `scoped intent` · delivery facts `implemented`/`has-verifier`/`observed`.
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
  checks are **conformance checks + honesty checks**.
- **Resolved (MD-15):** authored Spec files carry the **`.sdp.ts`** extension (never `.spec.ts`, which every
  JS test-runner default glob executes); the model name `Spec` itself was always settled — only the file
  serialization changed.
- **Naming (resolved — MD-5):** product **Libar Software Delivery Protocol** (short form "the Protocol");
  CLI **`sdp`**; npm **`@libar-dev/software-delivery-protocol`** (single package); repo
  `libar-dev/software-delivery-protocol`; namespaces `@libar-dev/` (OSS) vs `@libar-ai/` (commercial).
  "Protocol" names the meta-layer (a conformance contract, not a workflow); "process" is retained only for
  the modeled activity.
