# 02 — Core Model

The whole delivery lifecycle is modelled with one primitive: the `Spec`. This document defines its shape, the three descriptors that position it, the sections that carry detail, stable IDs, and relations. It realises principles **P4** (one enrichable primitive), **P6** (identity is the join key), **P7** (shape vs completeness), **P8** (three independent descriptors), and **L9** (envelope is a stability contract, sections are the extension surface).

Running domain throughout: Order Management.

---

## 1. The `Spec` primitive

A `Spec` is a persistent statement of desired system truth — the one kind of thing a human authors directly. It can be tiny and vague, then progressively enriched **in place** with examples, rules, constraints, decisions, and verification, and bound to code by **anchors** — **without changing its artifact type**. Maturity changes *required completeness*, not the object format. It is the only authored **truth**-primitive; everything the machine reports about its realization is **derived** (§2).

```ts
type Spec = {
  id: SpecId;            // stable, namespaced, unique (P6)
  title: string;
  kind: SpecKind;        // the category of truth — a true subtype
  altitude: SpecAltitude;  // size / scope
  readiness: SpecReadiness;      // design maturity

  // all sections optional — types describe shape, validators decide completeness (P7)
  intent?: IntentSection;
  behavior?: BehaviorSection;
  constraints?: ConstraintSection[];
  model?: DomainModelSection;
  design?: DesignSection;
  decision?: DecisionSection;
  verification?: VerificationSection;
  ui?: UiSection;               // references design artifacts; aspirational rendering

  relations?: SpecRelation[];
};
```

The **envelope** — `id`, `title`, `kind`, `altitude`, `readiness`, `relations` — is intentionally minimal and stable; it changes almost never. Variability lives in the **sections**. New capability is added by adding sections or extending enums (a MINOR change), not by reshaping the envelope (L9).

The same shape serves an early idea, a semi-refined behavior, a business rule, an acceptance example, an NFR, an API contract, and an example with a verifier. There is no `Requirement` / `UnimplementedRequirement` / `ImplementedRequirement` split. Two *other* things are authored but are **not** truth-primitives — the **`Pack`** (§4) and the in-code **`anchor`** (§6, and `04`); everything the machine reports about realization is **derived** (§2).

---

## 2. The three descriptors

A single maturity field is not enough. Three **descriptors** position every `Spec` — one true subtype and two positional descriptors (P8). The familiar delivery nouns (Use Case, NFR, Decision Record; Epic, Feature, Story) are **named coordinates** on these descriptors, never separate authored types.

| Descriptor | Behaves like | Values |
|---|---|---|
| `kind` — category of truth | a **true subtype** (discriminated union — changes required detail + validation) | the 8 below |
| `altitude` — size | a **position** — same shape, different scope | `epic → feature → story` |
| `readiness` — design maturity | a **position** — same shape, different completeness | `idea → scoped → defined → ready` |

### `SpecKind` — the category of truth (a true subtype)

`SpecKind` answers a different question from altitude: not *how big*, but *what category of statement*. Each literal carries a recognized display label.

```ts
type SpecKind =
  | "behavior"     // a use case / behavior            (display: Use Case / Behavior)
  | "workflow"     // a multi-step process / journey   (display: Workflow)
  | "example"      // a concrete Given/When/Then        (display: Example / Scenario)
  | "rule"         // a business or invariant rule      (display: Business Rule)
  | "constraint"   // a quality attribute / NFR / policy (display: Constraint (NFR))
  | "model"        // domain vocabulary                 (display: Domain Model)
  | "decision"     // an architectural / product decision (display: Decision Record)
  | "contract";    // an API contract, schema, or event contract
```

A spec is exactly one kind. If a fact straddles kinds, model it as two specs with a relation between them. `kind` is the genuine specialization — it changes which sections are required and how the spec is validated.

### `SpecAltitude` — size / scope (a position)

```ts
type SpecAltitude =
  | "epic"      // a large outcome spanning many features
  | "feature"   // a coherent user- or system-facing slice
  | "story";    // a single, concrete unit of delivered behavior
```

Altitude is a clean 3-rung ladder. `epic` is the ceiling; above-epic framing (initiative / theme) is deferred, additive later. A **Scenario** is *not* an altitude — it is a low-altitude `example`-kind spec that `refines`/`verifies` a Story.

### `SpecReadiness` — design maturity (a position)

```ts
type SpecReadiness =
  | "idea"      // title + minimal intent; open questions allowed
  | "scoped"    // intent, terms, parent relation; rules or examples expected
  | "defined"   // rules and/or examples present; NFR targets measurable
  | "ready";    // reviewed in context (Design Review) and implementation-ready — carries a readiness floor (`05`)
```

The descriptors move freely. A `feature`-altitude spec can sit at `scoped` forever (it is not failing CI as long as nothing *states* it is `ready`). A `story`-altitude spec can be `ready`. A linear idea→requirement→implementation pipeline cannot express these states; independent descriptors can.

> Progression is *expected* but not strictly linear: a child spec can be born at a higher readiness than its parent (e.g. a low-altitude example added inside an already-`ready` feature). Reaching `ready` itself, however, requires the child's own `refines`/`dependsOn` targets to be ≥ `defined` (the `ready` floor, `05`) — so a child cannot be `ready` while a parent it refines is still `scoped`.

### Why the enums look the way they do

`kind`, `altitude`, and `readiness` are kept as three non-overlapping vocabularies:

1. **`altitude` is only `epic → feature → story`.** It does not contain `rule` (a *kind* of truth, not a level), nor `contract` (a kind), nor `scenario` (a low-altitude `example`). A clean ladder of altitudes — nothing else smuggled in.
2. **`kind` has no `quality` alias.** There is one member — `constraint` — and the *flavor* (quality / security / performance / compliance / operational / policy) lives on the `ConstraintSection` (§3), where a `flavor: "performance"` constraint with a measurable `target` *is* an NFR. One concept, one place.
3. **`capability` and `domain` are neither a `kind` nor an `altitude`.** A capability is a **projection** (the *Capability Map* over high-altitude `behavior` specs); a bounded context / domain is a **`Pack` grouping** and/or projection. Both were removed as descriptors entirely — there is no "capability appears in multiple descriptors" question, because capability is on *none* of them.
4. **NFR and Scenario are labels, not kinds.** An NFR is a `constraint` with a measurable target; a Scenario is an `example`. The recognizable delivery nouns survive as display labels and projections, never as separate primitives.

### Readiness vs delivery facts (the derived realization signals)

`readiness` is **authored** — what the human *states* about design maturity. It is distinct from **delivery facts**, which are **derived** — what the machine *observes* about realization, computed from graph edges and shown as badges. Authoring a delivery fact by hand is a `05` honesty violation.

| Delivery fact | Derived when | Means — and does **not** mean |
|---|---|---|
| `implemented` | ≥1 `satisfies` edge (from an `anchor`) resolves to the spec | code claims to realise it — *not* that it works |
| `has-verifier` | ≥1 `verifies` edge from an enabled verifier resolves to the spec | a verifier **exists** — *not* that it passed (pass/fail is CI's, not the graph's) |
| `observed` *(aspirational)* | runtime evidence links to the spec's target | seen live in production / telemetry |

Because readiness and delivery facts answer *separate* questions, two high-value queries fall out:

- `ready ∧ ¬implemented` → the **build backlog** (designed, not yet built).
- `implemented ∧ ¬ready` → the **drift alarm** (code ran ahead of the design).

A readiness floor (`05`) checks the **structure required to *derive* a fact**, never the fact itself: stating `ready` may require that bindings *resolve* (so `implemented` is *derivable*) — it never requires the spec to *be* `implemented`. Readiness is a *stated position* about the design; delivery facts are observations about the code.

---

## 3. Sections

Sections carry the detail. They are the **extension surface**: the system grows by adding sections (or enum members), never by reshaping the envelope (L9). All are optional on the type (P7); validators require the right ones to *state* a given readiness (`05`).

| Section | Carries | Notes |
|---|---|---|
| `intent` | actor, problem, outcome, value, risks, assumptions, open questions | `openQuestions` may be flagged `blocking` to prevent stating a readiness past `defined`. |
| `behavior` | examples (Given/When/Then), rules, flows | An example progresses from prose → structured steps → a verifier. |
| `constraints[]` | a `flavor` (quality / security / performance / compliance / operational / policy), a statement, an optional `target`, optional `measurableBy` | A `performance` constraint with a measurable `target` is an NFR. `target` must be machine-readable (`p95 < 300ms`, not "fast enough") to state `defined`+. |
| `model` | domain terms and concepts (vocabulary only) | Used for pack-level coherence checks. `DomainConcept.kind` is an open, illustrative list, not a closed enum. |
| `design` | components, ports, dependencies, decisions, tradeoffs | Referenced by ID; decision bodies are linked, not parsed for semantics. |
| `decision` | context, chosen option, rationale, alternatives, consequences | The inline form of a decision; promote to a `kind:"decision"` spec when shared (see the duality rule below). |
| `verification` | mode (manual / reviewed / contract / executable) + criteria | A verifying test *existing and enabled* is the derived `has-verifier` delivery fact (§2), not an authored field here. Pass/fail is **not** in the graph — it is CI's, operational. |
| `ui` | references to component stories, design-tool nodes, visual baselines, accessibility status | **Aspirational.** Always links, never owns or renders. |

### Section ⟷ kind — when a concern is inline vs. its own primitive

Three sections — `constraints`, `model`, `decision` — have a same-named `kind` twin, so the same concern can live two ways. **The rule** (stated here once, not scattered across the other docs):

- Keep it **inline as a section** when it is **local detail** of its host `Spec`.
- **Promote it to a standalone `Spec`** of the matching `kind` (linked by `constrainedBy` / `decidedBy` / `modelRefs`) when it is **referenced by more than one `Spec`, or needs its own identity / lifecycle / review.**

`modelRefs` on a `Pack` always points at standalone `kind:"model"` specs — shared vocabulary is never inlined twice.

### Worked example — one spec enriching in place

```ts
// idea
export const CreateOrder = spec({
  id: "spec:orders.create-order",
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
  intent: {
    actor: "customer",
    outcome: "turn a valid cart into an order",
    value: "customers can complete purchases",
  },
  relations: [refines("spec:orders.order-management")],
});
```

Later, the *same* spec — same ID — gains sections and climbs readiness:

```ts
// ready — same object, enriched (no artifact migration)
export const CreateOrder = spec({
  id: "spec:orders.create-order",
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "ready",
  intent: { actor: "customer", outcome: "turn a valid cart into an order", value: "customers can complete purchases" },
  behavior: { examples: [ref("spec:orders.create-order.valid-cart")] },
  constraints: [
    { flavor: "performance", statement: "order creation is fast enough for checkout", target: "p95 < 300ms" },
  ],
  relations: [
    refines("spec:orders.order-management"),
    decidedBy("spec:decisions.order-lifecycle"),
  ],
});
```

The spec carries **no** code or test fields. The link to code is an **anchor** in the source (see `04`), which the extractor derives into a `satisfies` edge and an `implemented` delivery fact. A `ready` spec with no resolving anchor is the **build backlog**; once the anchor exists, the spec is `implemented ∧ ready` — the healthy state.

A low-altitude example becomes executable the same way — it is not a separate "test object," it is a low-altitude `example`-kind spec that `verifies` its parent:

```ts
export const ValidCartCreatesOrder = spec({
  id: "spec:orders.create-order.valid-cart",
  title: "Valid cart creates an order",
  kind: "example",
  altitude: "story",
  readiness: "ready",
  behavior: {
    examples: [{
      given: ["a customer has a valid cart", "all cart items are available"],
      when: ["the customer submits the order"],
      then: ["an order is created", "an OrderCreated event is emitted"],
    }],
  },
  verification: { mode: "executable", criteria: ["an order row exists", "an OrderCreated event is published"] },
  relations: [refines("spec:orders.create-order"), verifies("spec:orders.create-order")],
});
```

The old `exemplifies` relation is gone: an example simply uses `kind:"example"` + `refines` + `verifies`. `verification` carries `mode` + `criteria` only — the *existence* of an enabled verifying test is the derived `has-verifier` fact, observed from a test **anchor**, never authored here.

---

## 4. `Pack` — grouped coherent ideation

A `Pack` clusters related specs (a feature initiative, a bounded slice) so a team can ideate at the group level before drilling down. It is an authored **aggregate** that states **no truth of its own** — it *references* specs, never owns vocabulary. Its `intent` is **descriptive framing** for ideation and review (a human-readable note on why the group exists), **not** authored system truth: it is never checked for completeness and never reconciled against its members — only the member `Spec`s state truth.

```ts
export const CheckoutV1 = pack({
  id: "pack:checkout-v1",
  title: "Checkout v1",
  intent: { outcome: "let customers complete purchases reliably", value: "increase conversion, reduce failed orders" },
  modelRefs: ["spec:checkout.glossary"],   // → standalone kind:"model" specs; shared vocabulary is never inlined twice
  specs: [
    ref("spec:orders.create-order"),
    ref("spec:payments.authorize-payment"),
    ref("spec:inventory.reserve"),
  ],
});
```

Membership is authored on the `Pack` manifest; the `belongsTo` edge is **derived** from it (it carries `claim:"declared"`, because it is a deterministic re-expression of the declared manifest — see §6 and `04`). A pack is checked for **coherence** (referenced terms and `modelRefs` resolve, membership resolves, no duplicate members) — *not* for the completeness of any individual member, and *not* for "duplicated intent" (a pack has no truth of its own to duplicate). This supports "a large coherent group of low-detail specs" as a first-class state.

**Two grouping mechanisms stay distinct:** *refinement* (a parent spec → its children — authored truth that happens to have descendants) vs *the aggregate* (the `Pack` — a cross-cutting review collection with no truth of its own, which may span or sub-slice the refinement hierarchy). A `Pack` is the unit a **Design Review** (`06`) renders "in context."

---

## 5. Stable IDs (P6)

IDs are the load-bearing linkage of the entire graph. The grammar is a Representation; the principle is that the ID is stable, unique, namespaced, human-readable, and the *only* binding between intent and code.

```
<namespace>:<dotted.path>          spec:orders.create-order
<namespace>:<dotted.path>#<sub>     spec:orders.create-order#valid-cart   (optional sub-part)
```

Namespaces in the MVP: `spec`, `pack`, `impl`, `api`, `test`, `component`, `doc`. Examples from the running domain:

- `pack:checkout-v1`
- `spec:orders.create-order`
- `spec:orders.order-management` — a high-altitude `behavior` spec; the *Capability Map* projection is computed over these
- `spec:decisions.order-lifecycle` — a `kind:"decision"` spec; in-system decisions live under the `spec:decisions.*` convention
- `impl:orders.create-order-use-case`
- `api:orders.post`
- `test:orders.create-order.valid-cart`

`doc:` is reserved for a genuinely *external* document linked from a decision spec (e.g. `doc:adr-order-lifecycle`) — never for an in-system decision, which is a `spec:decisions.*` spec.

Code and specs link by these IDs *in strings*, never by import edges (P6) — which is the only thing that lets either side survive heavy refactoring. The cost of string IDs is typos; that is what referential-integrity checks exist to catch (`05`). The optional generated `spec-ids` union type pushes some of those checks to `tsc`, but it is a convenience, not a load-bearing gate (L8).

> **IDs carry no history.** IDs are stable by convention and survive refactors; renaming one is a repo edit that git records. The graph does not bookkeep ID history (see `01`, git is the event log).

---

## 6. Relations

Authored relations are typed, directed, **declared** edges between specs (and from specs to decision/model nodes). They are the human-asserted *intent* half of the graph (the authored/derived split, `01`/`04`).

MVP relation vocabulary (a Representation; extensible):

| Relation | Direction | Meaning |
|---|---|---|
| `refines(parent)` | child → parent | a more precise child; also how altitude descends (Story refines Feature refines Epic) |
| `dependsOn(spec)` | dependent → dependency | needs another spec to hold |
| `constrainedBy(specOrConstraint)` | bounded → constraint | bounded by a rule / NFR / policy spec (a *typed* dependency) |
| `decidedBy(decision)` | shaped → decision | shaped by a Decision Record (`doc:` only for a genuinely external ADR) |
| `verifies(spec)` | verifier → target | an example/scenario verifies a target |
| `supersedes(decision)` | new → old | current forward-pointer between two Decision Records that both still exist |

`supersedes` is permitted **only** on decision specs, as a current authored statement about two records that both still exist in the repo — not as graph-resident history (see git is the event log in `01`).

**Derived edges — never authored:**

- `satisfies` (code → spec) — emitted from an **anchor** in source; carries `claim:"anchored"`. This is the inverse of the old `satisfiedBy`: the direction is **code → spec**, and it is **derived from anchors**, never hand-authored.
- `belongsTo` (spec → pack) — a deterministic re-expression of the `Pack` manifest; carries `claim:"declared"` (it inherits the authored manifest's authority — it is *not* advisory `inferred`).

All authored relations carry `claim:"declared"` like every authored edge (P9, and the `claim` taxonomy in `04`). The extractor adds *anchored* and *inferred* edges separately; they are never merged into declared relations.
