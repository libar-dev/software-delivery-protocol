# 02 — Core Model

The whole delivery lifecycle is modelled with one primitive: the `Spec`. This document defines its shape, the two axes that position it, the facets that carry detail, stable IDs, and relations. It realises principles **P4** (one enrichable primitive), **P6** (identity is the join key), **P7** (shape vs completeness), **P8** (two orthogonal axes), and **L9** (envelope is a stability contract, facets are the extension surface).

Running domain throughout: Order Management.

---

## 1. The `Spec` primitive

A `Spec` is a persistent statement of desired system truth. It can be tiny and vague, then progressively enriched with examples, rules, constraints, decisions, implementation bindings, and verification — **without changing its artifact type**. Maturity changes *required completeness*, not the object format.

```ts
type Spec = {
  id: SpecId;            // stable, namespaced, unique (P6)
  title: string;
  kind: SpecKind;        // what kind of truth this states
  abstraction: SpecAbstraction;  // level of thinking
  readiness: SpecReadiness;      // completeness / executability

  // all facets optional — types describe shape, validators decide completeness (P7)
  intent?: IntentFacet;
  behavior?: BehaviorFacet;
  constraints?: ConstraintFacet[];
  model?: DomainModelFacet;
  design?: DesignFacet;
  runtime?: RuntimeFacet;     // framework-neutral bindings; deep extraction is aspirational
  bindings?: BindingFacet;
  verification?: VerificationFacet;
  evidence?: EvidenceFacet;   // extractor-populated only, never authored (epistemic boundary)
  ui?: UiFacet;               // references design artifacts; aspirational rendering

  relations?: SpecRelation[];
  tags?: string[];
};
```

The **envelope** — `id`, `title`, `kind`, `abstraction`, `readiness`, `relations` — is intentionally minimal and stable. Variability lives in the facets. New capability is added by enriching facets or extending enums (a MINOR change), not by reshaping the envelope (L9).

The same shape serves an early idea, a semi-refined capability, a business rule, an acceptance example, an NFR, an API contract, an executable scenario, and verified delivery evidence. There is no `Requirement` / `UnimplementedRequirement` / `ImplementedRequirement` split.

---

## 2. The two axes (P8)

A single maturity field is not enough. Two **independent** axes position every spec.

### `SpecAbstraction` — level of thinking

```ts
type SpecAbstraction =
  | "initiative"   // portfolio-level outcome (multi-quarter)
  | "domain"       // a bounded context / sub-domain
  | "capability"   // a capability inside a domain
  | "feature"      // a coherent user- or system-facing feature
  | "scenario"     // a concrete example / acceptance case
  | "operation"    // a single command / query / event handler
  | "component"    // a deployable or compositional unit
  | "contract";    // an interface, schema, or contract
```

### `SpecReadiness` — completeness / executability

```ts
type SpecReadiness =
  | "sketch"      // title + minimal intent; open questions allowed
  | "framed"      // intent, terms, parent relation; rules or examples expected
  | "specified"   // rules and/or examples present; NFR targets measurable
  | "designed"    // components, ports, decisions identified
  | "bound"       // runtime + code bindings exist and resolve
  | "executable"  // verification mode is executable; tests defined
  | "verified";   // a verifying spec/test exists and is enabled (structural; run verdict is CI-side, not in the graph — D3)
```

The axes move freely. A `capability`-level spec can sit at `framed` forever (it is not failing CI as long as nothing claims it is `bound`). A `scenario`-level spec can be `executable`. An NFR can be `specified` but not yet `executable`. A `contract` can be `bound` but not `verified`. A linear pipeline cannot express these states; two axes can.

> Progression is *expected* but not strictly linear: a child spec can be born at a higher readiness than its parent (e.g. a scenario added inside an already-tested feature).

### `SpecKind` — what kind of truth this states

`SpecKind` answers a different question from abstraction: not *how abstract*, but *what category of statement*.

```ts
type SpecKind =
  | "capability"   // an ability of the system
  | "behavior"     // a use case / user-facing feature
  | "rule"         // a business or invariant rule
  | "constraint"   // a quality attribute / NFR / policy
  | "interface"    // an API contract, schema, or event contract
  | "workflow"     // a multi-step process / saga / journey
  | "decision"     // an architectural or product decision (ADR-like)
  | "example";     // a concrete Given/When/Then scenario
```

A spec is exactly one kind. If a fact straddles kinds, model it as two specs with a relation between them.

### Enum reconciliation (the E2 inconsistency)

The analysis (View 1, E2) flagged that the v1 docs listed *different* member sets for these enums across the README, `00`, and `01` — a sign the enums were still settling. This set picks **one coherent member set** and removes the overlaps:

1. **`abstraction` no longer contains `rule`.** A rule is a *kind* of truth, not a *level of thinking*. Removing it from `abstraction` deletes the `capability`/`rule` overlap with `kind`. Abstraction is now a clean ladder of altitudes: `initiative → domain → capability → feature → scenario → operation → component → contract`.
2. **`kind` drops the `quality` alias.** The v1 `kind` had both `constraint` *and* `quality` ("alias for performance/reliability/security target"). An alias is a smell. There is one member — `constraint` — and the *flavour* (business / quality / security / performance / compliance) lives on the `ConstraintFacet` (§3), where a `kind: "performance"` constraint with a measurable `target` *is* an NFR. One concept, one place.
3. **`capability` deliberately appears in both `kind` and `abstraction`** — and that is fine, because they answer different questions. A spec can be `kind: "capability"` (it states an ability) *and* `abstraction: "capability"` (it sits at capability altitude), but the two are set independently. This is the one intentional name-reuse; it is not an inconsistency because the axes are orthogonal.

The result: `abstraction` and `kind` no longer share `rule`; `kind` has no aliases; the only shared token (`capability`) is intentional and orthogonal.

---

## 3. Facets

Facets carry the detail. All are optional on the type (P7); validators require the right ones at each readiness level (`05`).

| Facet | Carries | Notes |
|---|---|---|
| `intent` | actor, problem, outcome, value, risks, assumptions, open questions | `openQuestions` may be flagged `blocking` to prevent promotion past `specified`. |
| `behavior` | examples (Given/When/Then), rules, flows | An example progresses from prose → structured steps → executable binding. |
| `constraints[]` | a `kind` (business / quality / security / performance / compliance), a statement, an optional `target`, optional `measurableBy` | A `performance` constraint with a measurable `target` is an NFR. `target` must be machine-readable (`p95 < 300ms`, not "fast enough") to claim `specified`+. |
| `model` | domain terms, entities, commands, events, states | Used for pack-level coherence checks. |
| `design` | components, ports, dependencies, decisions, tradeoffs | Referenced by ID; ADR bodies are linked, not parsed for semantics. |
| `runtime` | bindings to runtime composition (routes, layers, registrations) | **Framework-neutral in the MVP** — generic markers only. Deep extraction (Effect `R`, Awilix wiring) is aspirational. |
| `bindings` | code, tests, schemas, docs (by ID) | Every binding ID must resolve at `bound`+. |
| `verification` | mode (manual / reviewed / contract / executable), tests | `executable`/`verified` means a linked verifying test *exists and is enabled* (structural). Pass/fail is **not** in the graph — it is CI's, operational (D3). |
| `evidence` | verifiedBy (structural: a verifying spec exists) | **Extractor-populated only**, never authored by hand (epistemic boundary, `01`). MVP is *structural presence* only; `observedIn` / build / run-result evidence is aspirational (`06`, `07` D3) — test *run results* are never ingested. |
| `ui` | references to component stories, design-tool nodes, visual baselines, accessibility status | **Aspirational.** Always links, never owns or renders. |

### Worked example — one spec enriching in place

```ts
// Sketch
export const CreateOrder = spec({
  id: "spec:orders.create-order",
  title: "Customer creates an order",
  kind: "behavior",
  abstraction: "feature",
  readiness: "sketch",
  intent: {
    actor: "customer",
    outcome: "turn a valid cart into an order",
    value: "customers can complete purchases",
  },
  relations: [belongsTo("capability:order-management")],
});
```

Later, the *same* spec — same ID — gains facets and climbs readiness:

```ts
// Bound — same object, enriched (no artifact migration)
export const CreateOrder = spec({
  id: "spec:orders.create-order",
  title: "Customer creates an order",
  kind: "behavior",
  abstraction: "feature",
  readiness: "bound",
  intent: { actor: "customer", outcome: "turn a valid cart into an order", value: "customers can complete purchases" },
  behavior: { examples: [ref("spec:orders.create-order.valid-cart")] },
  constraints: [
    { kind: "performance", statement: "order creation is fast enough for checkout", target: "p95 < 300ms" },
  ],
  bindings: {
    code: ["impl:CreateOrderUseCase"],
    tests: ["test:orders.create-order.valid-cart"],
  },
  runtime: { routes: ["api:POST:/orders"] }, // generic binding; no framework depth in MVP
  relations: [belongsTo("capability:order-management"), decidedBy("adr:007-order-lifecycle")],
});
```

A scenario becomes an executable spec the same way — it is not a separate "test object," it is a `scenario`-abstraction spec that `verifies` its parent:

```ts
export const ValidCartCreatesOrder = spec({
  id: "spec:orders.create-order.valid-cart",
  title: "Valid cart creates an order",
  kind: "example",
  abstraction: "scenario",
  readiness: "executable",
  behavior: {
    examples: [{
      given: ["a customer has a valid cart", "all cart items are available"],
      when: ["the customer submits the order"],
      then: ["an order is created", "an OrderCreated event is emitted"],
    }],
  },
  verification: { mode: "executable", tests: ["test:orders.create-order.valid-cart"] },
  relations: [exemplifies("spec:orders.create-order"), verifies("spec:orders.create-order")],
});
```

---

## 4. `SpecPack` — grouped coherent ideation

A `SpecPack` clusters related specs (a feature initiative, a bounded slice) so a team can ideate at the group level before drilling down.

```ts
export const CheckoutV1 = specPack({
  id: "pack:checkout-v1",
  title: "Checkout v1",
  intent: { outcome: "let customers complete purchases reliably", value: "increase conversion, reduce failed orders" },
  sharedModel: { terms: ["Cart", "Order", "Payment", "OrderCreated"], actors: ["Customer", "Warehouse"] },
  specs: [
    ref("spec:orders.create-order"),
    ref("spec:payment.authorize-payment"),
    ref("spec:inventory.reserve"),
  ],
});
```

A pack is validated for **coherence** (shared terms defined, membership resolves, no duplicated intent without a relation, no dependency on undefined concepts) — *not* for the completeness of any individual member. This supports "a large coherent group of low-detail specs" as a first-class state.

---

## 5. Stable IDs (P6)

IDs are the load-bearing linkage of the entire graph. The grammar is a Representation; the principle is that the ID is stable, unique, namespaced, human-readable, and the *only* binding between intent and code.

```
<namespace>:<dotted.path>          spec:orders.create-order
<namespace>:<dotted.path>#<sub>     spec:orders.create-order#valid-cart   (optional sub-part)
```

Namespaces in the MVP: `spec`, `pack`, `capability`, `impl`, `api`, `test`, `adr`, `component`. Examples from the running domain:

- `pack:checkout-v1`
- `spec:orders.create-order`
- `capability:order-management`
- `impl:CreateOrderUseCase`
- `api:POST:/orders`
- `test:orders.create-order.valid-cart`

Code and specs link by these IDs *in strings*, never by import edges (P6) — which is the only thing that lets either side survive heavy refactoring. The cost of string IDs is typos; that is what referential-integrity validation exists to catch (`05`). The optional generated `spec-ids` union type pushes some of those checks to `tsc`, but it is a convenience, not a load-bearing gate (L8).

> **History note (L4):** the v1 model added ID-freeze-after-`bound` with mandatory supersession to protect graph-resident history. This set drops that machinery. IDs are stable by convention and survive refactors; renaming one is a repo edit that git records. We do not bookkeep ID history in the graph (see `01`, git-as-event-log).

---

## 6. Relations

Relations are authored, directed, declared edges between specs (and from specs to architecture/decision nodes). They are the human-asserted *intent* half of the graph (the epistemic boundary, `01`).

MVP relation vocabulary (a Representation; extensible):

| Relation | Meaning |
|---|---|
| `refines(parent)` | this spec is a more precise child of `parent` |
| `belongsTo(packOrCapability)` | membership |
| `dependsOn(spec)` | needs another spec to hold |
| `constrainedBy(specOrConstraint)` | bounded by a rule / NFR |
| `decidedBy(adr)` | shaped by a decision record |
| `satisfiedBy(implOrRouteOrLayer)` | realised by code/runtime (also derivable from markers) |
| `exemplifies(spec)` | this example illustrates a parent spec |
| `verifies(spec)` | this scenario/test verifies a parent spec |

`supersedes(decision)` is permitted **only** on decision/ADR specs, as a current authored statement about two records that both still exist in the repo — not as graph-resident history (see the L4 resolution in `01`).

All relations carry provenance (declared, here) like every edge (P9). The extractor adds *inferred* and *annotation* edges separately; they are never merged into declared relations.
</content>
