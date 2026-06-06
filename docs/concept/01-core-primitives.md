# 01 — Core Primitives

This document defines the smallest possible vocabulary required to describe everything the system models. Every later document refers back to these primitives.

There are five of them:

1. **`Spec`** — the universal durable artifact.
2. **`SpecPack`** — a group of related specs that share intent, model, and constraints.
3. **`Facet`** — a typed bundle of fields attached to a Spec that captures one aspect of its truth.
4. **Two axes** — `abstraction` (what level of thinking) × `readiness` (how complete/executable).
5. **`SpecRelation`** — a typed edge between specs (refines, dependsOn, decidedBy, verifies, …).

Everything else in the system is a *projection*, a *binding*, or a *validation* of these primitives.

---

## 1. The `Spec` primitive

> **A `Spec` is a persistent, identified statement of desired system truth.**

It is the same shape whether it is a half-formed idea or a verified executable example. What changes between those two extremes is which **facets** are populated and how strict the validation profile is.

### 1.1 Outer shape (canonical TypeScript)

```ts
type Spec = {
  // --- identity ---
  id: SpecId;                            // stable string, e.g. "spec:orders.create-order"
  title: string;

  // --- axes ---
  kind: SpecKind;
  abstraction: SpecAbstraction;
  readiness: SpecReadiness;

  // --- optional facets (each is a typed sub-object) ---
  intent?: IntentFacet;
  behavior?: BehaviorFacet;
  constraints?: ConstraintFacet[];
  model?: DomainModelFacet;
  design?: DesignFacet;
  runtime?: RuntimeFacet;
  bindings?: BindingsFacet;
  verification?: VerificationFacet;
  evidence?: EvidenceFacet;
  ui?: UiFacet;

  // --- relations to other specs / nodes ---
  relations?: SpecRelation[];

  // --- bookkeeping ---
  owner?: OwnerRef;
  tags?: string[];
  notes?: string;        // free-form Markdown allowed at any maturity
};
```

The shape is intentionally minimal at the top level. All variability is pushed into:

- The **enums** (`SpecKind`, `SpecAbstraction`, `SpecReadiness`).
- The **facets** (each is itself a discriminated record).
- The **profile validators** (covered in `06-extraction-and-validation.md`).

`★ Insight ─────────────────────────────────────`
Every facet is *optional* at the type level. This is deliberate: the type system gives you *shape*, not *completeness*. Completeness is a property of the readiness level, enforced by graph validators — not by `tsc`. Trying to encode "an `implemented` spec must have a `bindings.code` array" in the type system produces unreadable conditional types that fight `satisfies`. The clean separation: types for shape, validators for completeness.
`─────────────────────────────────────────────────`

### 1.2 `SpecKind`

`SpecKind` answers: *what kind of truth is this Spec stating?*

```ts
type SpecKind =
  | "capability"   // an ability of the system / a domain capacity
  | "behavior"     // a behavioural feature (use case, user-facing feature)
  | "rule"         // a business or invariant rule
  | "constraint"   // a quality attribute / NFR / policy
  | "quality"      // alias for performance / reliability / security target
  | "interface"    // an API contract, schema, event contract
  | "workflow"     // a multi-step process / saga / customer journey
  | "decision"     // an architectural or product decision (ADR-like)
  | "example";     // a concrete Given/When/Then scenario or example case
```

A single Spec is exactly one kind. If a fact straddles kinds (e.g., a workflow that doubles as a rule), it should be modelled as two specs with a `refines`/`constrains` relation between them.

### 1.3 `SpecAbstraction`

`SpecAbstraction` answers: *at what level of thinking does this Spec sit?*

```ts
type SpecAbstraction =
  | "initiative"   // a portfolio-level outcome (multi-quarter)
  | "domain"       // a bounded context or sub-domain
  | "capability"   // a capability inside a domain
  | "feature"      // a coherent user- or system-facing feature
  | "rule"         // an explicit invariant or policy
  | "scenario"     // a concrete example / acceptance case
  | "operation"    // a single command / query / event handler
  | "component"    // a deployable or compositional unit
  | "contract";    // an interface, schema, or contract
```

Abstraction is *not* the same as readiness. A `capability`-level Spec can be `verified` (it has measurable operational evidence). A `scenario`-level Spec can be `sketch` (we only have the title).

### 1.4 `SpecReadiness`

`SpecReadiness` answers: *how complete, validated, executable, and observed is this Spec?*

```ts
type SpecReadiness =
  | "sketch"      // title + minimal intent; open questions allowed
  | "framed"      // intent, terms, parent relation; rules or examples expected
  | "specified"   // rules and/or examples present; NFR targets measurable
  | "designed"    // components, ports, decisions identified
  | "bound"       // runtime bindings (routes, layers) and code bindings exist
  | "executable"  // verification.mode === "executable"; tests defined
  | "verified";   // evidence.verifiedBy present; last result === "passed"
```

The progression is *expected* but not strictly linear. A scenario can be born `executable` if it is added inside an existing tested feature. A capability can hover at `framed` forever — it is not failing CI as long as nothing claims it is `bound`.

Validators key off readiness. Each level has a profile (see `06-extraction-and-validation.md` §6). The cardinal rule:

> **Readiness is a claim. Validators verify the claim.**

You cannot mark a Spec `executable` and ship the build if there is no `verification.tests` entry. You cannot mark it `verified` if the last test run failed.

---

## 2. Facets in detail

A facet is a typed bundle of fields. Facets are independent: any subset can be populated. They are evolved by *enrichment*, never by replacement.

### 2.1 `IntentFacet` — the "why"

```ts
type IntentFacet = {
  actor?: string;                  // primary actor / user persona
  problem?: string;                // problem statement in plain language
  outcome?: string;                // desired observable outcome
  value?: string;                  // business value
  risks?: string[];                // identified risks
  assumptions?: string[];          // explicit assumptions
  openQuestions?: OpenQuestion[];  // tracked, blocking or non-blocking
};

type OpenQuestion = {
  question: string;
  blocking?: boolean;              // if true, prevents promotion past 'specified'
  owner?: OwnerRef;
  links?: string[];                // ADRs, discussions, tickets
};
```

The `intent` facet is the only facet a `sketch` Spec must have something of (either `outcome` or a parent relation). It survives every later readiness level — at `verified`, the intent still answers *why this exists*.

### 2.2 `BehaviorFacet` — the "what (observable)"

```ts
type BehaviorFacet = {
  rules?: RuleSpec[];              // invariants
  examples?: ExampleSpec[];        // Given/When/Then or executable scenarios
  flows?: FlowSpec[];              // multi-step workflows (sagas)
};

type RuleSpec = {
  id?: SpecId;                     // optional; promotable to a standalone Spec
  statement: string;
  rationale?: string;
};

type ExampleSpec = {
  id: SpecId;                      // examples are always promotable Specs
  title: string;
  given: StepOrPhrase[];
  when: StepOrPhrase[];
  then: StepOrPhrase[];
  verification?: VerificationFacet; // when this example is executable
  notes?: string;
};

type StepOrPhrase =
  | string                                  // free-form prose (early maturity)
  | { step: string; args?: Record<string, unknown> }; // step-definition binding

type FlowSpec = {
  id?: SpecId;
  steps: { actor?: string; action: string; observable?: string }[];
};
```

An `ExampleSpec` is the bridge from idea to executable. At low readiness it is prose; at `executable` readiness it has `step()`-form bindings and a `VerificationFacet` pointing at a test. The same `ExampleSpec` object is promoted, never replaced.

### 2.3 `ConstraintFacet` — the "quality / policy"

```ts
type ConstraintFacet = {
  kind: "business" | "quality" | "security" | "performance" | "compliance";
  statement: string;
  target?: string;                 // e.g. "p95 < 300ms"
  measurableBy?: string[];         // dashboards, OTel metric names, test IDs
};
```

A constraint with `kind: "performance"` and a `target` is an NFR. The validator at the `specified` readiness level requires `target` to be present and machine-readable (a parseable threshold, not "fast enough").

### 2.4 `DomainModelFacet` — the "vocabulary"

```ts
type DomainModelFacet = {
  terms?: string[];                // glossary terms in scope
  entities?: string[];             // domain entities
  commands?: string[];             // commands the spec involves
  events?: string[];               // events emitted or consumed
  states?: string[];               // state machine states referenced
};
```

The shared model facet is what keeps a `SpecPack` coherent (see §3). It is also what enables AI projections to be self-contained: a scope file like `order-management.context.json` carries its glossary inline.

### 2.5 `DesignFacet` — the "how (architecture)"

```ts
type DesignFacet = {
  components?: ComponentRef[];     // component IDs the spec realises
  ports?: PortRef[];               // ports / interfaces
  dependencies?: SpecId[];         // architecture-level deps
  decisions?: DecisionRef[];       // ADR IDs
  tradeoffs?: string[];            // textual rationale
  diagrams?: string[];             // LikeC4 view IDs, image paths
};
```

`design` appears at the `designed` readiness level. Before that, the system intentionally does not require an answer to *how*.

### 2.6 `RuntimeFacet` — the "how (composition)"

```ts
type RuntimeFacet = {
  fastifyRoutes?: RouteRef[];      // "api:POST:/orders"
  effectLayers?: LayerRef[];       // "layer:CreateOrderUseCaseLive"
  awilixRegistrations?: string[];  // transitional / legacy DI
  externalSystems?: string[];      // "external:postgres", "external:stripe"
  eventChannels?: string[];        // "queue:order-events"
};
```

This facet *binds the Spec to the runtime composition*. Crucially, the IDs here must resolve to real extracted nodes — the extractor reads the actual Fastify routes and Effect Layer declarations and the validator confirms the IDs exist.

### 2.7 `BindingsFacet` — the "how (code)"

```ts
type BindingsFacet = {
  code?: ImplRef[];                // "impl:CreateOrderUseCase"
  tests?: TestRef[];               // "test:orders.create-order.valid-cart"
  schemas?: SchemaRef[];           // "schema:CreateOrderRequest"
  docs?: string[];                 // markdown or external doc URLs
};
```

`bindings.code` IDs resolve to source locations via the `@arch.node({ id })` decorator or `markImplementation` constant. The validator confirms each ID has an extracted location.

### 2.8 `VerificationFacet` — the "how (proof)"

```ts
type VerificationFacet = {
  mode?: "manual" | "reviewed" | "contract" | "executable";
  examples?: SpecId[];             // example specs that verify this
  tests?: TestRef[];               // direct test references
  runner?: "vitest" | "cucumber" | "playwright" | "custom";
  lastResult?: "unknown" | "passed" | "failed";
  lastRunAt?: ISODateTime;
};
```

For a Spec to legitimately claim `executable` readiness it must have `mode === "executable"` and at least one `tests` entry that resolves.

### 2.9 `EvidenceFacet` — the "did it actually happen"

```ts
type EvidenceFacet = {
  implementedBy?: ImplRef[];       // typically auto-populated from inferred edges
  verifiedBy?: TestRef[];          // tests that passed in last build
  observedIn?: ObservationRef[];   // OTel spans / metrics / logs that fired
  buildProvenance?: ProvenanceRef[]; // SLSA attestations
  lastVerifiedAt?: ISODateTime;
  notes?: string;
};
```

`evidence` is the only facet the extractor populates without explicit authoring. It comes from CI/CD outputs (Cucumber Messages, JUnit XML, OTel exports, SLSA attestations). Authors do not write it; CI updates it; validators read it.

### 2.10 `UiFacet` — the "how it looks"

```ts
type UiFacet = {
  stories?: string[];              // Storybook story IDs
  flows?: string[];                // Playwright flow IDs
  screenshots?: string[];          // paths to visual regression baselines
  accessibilityStatus?: "untested" | "passing" | "failing";
  pencilDocuments?: string[];      // links into Pencil design files
  figmaNodes?: string[];           // Figma node URLs
};
```

`ui` is what makes user-facing Specs feel complete. Linking a Spec to a Storybook story plus a Playwright flow gives the Spec Studio (see `07`) something visual to embed.

---

## 3. `SpecPack` — coherent ideation

A `SpecPack` is a group of specs that share intent, vocabulary, and quality constraints.

```ts
type SpecPack = {
  id: SpecPackId;                  // "pack:checkout-v1"
  title: string;
  intent: IntentFacet;             // pack-level outcome and value
  sharedModel?: DomainModelFacet;  // shared glossary
  constraints?: ConstraintFacet[]; // pack-level NFRs that descend to all specs
  specs: SpecRef[];                // refs by ID
  abstraction: SpecAbstraction;    // typically "initiative" | "domain" | "capability"
  readiness?: SpecReadiness;       // optional; computed from contained specs by default
};
```

Why this matters: early-stage thinking is rarely a single spec. It is a *cluster*. The pack lets you ideate at the group level — *what specs are missing, which ones overlap, which terms are inconsistent, which constraints affect multiple* — without forcing premature drill-down.

Pack-level validation profiles differ from spec-level: at the `sketch` stage of a pack, validators check **coherence** (every referenced term has a definition somewhere; every spec belongs to the pack; no two specs claim the same intent without a `refines` relation) — not completeness of any individual spec.

### Example: a checkout pack

```ts
export const CheckoutV1 = specPack({
  id: "pack:checkout-v1",
  title: "Checkout v1",
  abstraction: "initiative",

  intent: {
    outcome: "Allow customers to complete purchases reliably.",
    value: "Increase conversion and reduce failed orders.",
  },

  sharedModel: {
    terms: ["Cart", "Order", "Payment", "InventoryReservation", "OrderCreated"],
    entities: ["Cart", "Order", "Payment"],
    events: ["CartValidated", "PaymentAuthorized", "OrderCreated", "InventoryReserved"],
  },

  constraints: [
    {
      kind: "performance",
      statement: "Checkout should feel immediate.",
      target: "p95 < 500ms for submit-order",
      measurableBy: ["otel:checkout.submit-order.duration"],
    },
    {
      kind: "reliability",
      statement: "Payment + order creation must not produce duplicate orders.",
    },
  ],

  specs: [
    ref("spec:cart.validate"),
    ref("spec:payment.authorize"),
    ref("spec:orders.create-order"),
    ref("spec:inventory.reserve"),
    ref("spec:notifications.send-order-confirmation"),
  ],
});
```

---

## 4. `SpecRelation` — typed edges

Relations are first-class. Every relation has a discriminated `type` and (depending on type) extra fields.

```ts
type SpecRelation =
  | { type: "refines";       to: SpecId; rationale?: string }
  | { type: "belongsTo";     to: SpecId | SpecPackId }
  | { type: "dependsOn";     to: SpecId; strength?: "hard" | "soft" }
  | { type: "decidedBy";     to: DecisionRef }
  | { type: "constrainedBy"; to: SpecId; aspect?: string }
  | { type: "verifies";      to: SpecId }
  | { type: "exemplifies";   to: SpecId }
  | { type: "satisfiedBy";   to: RouteRef | LayerRef | ImplRef }
  | { type: "supersedes";    to: SpecId; reason?: string };
```

The constructors used in `.spec.ts` files (`refines("spec:...")`, `belongsTo("pack:...")`, etc.) are thin wrappers around this discriminated union. They preserve literal IDs via `as const` so cross-file ID validation can be partially done at compile time.

`★ Insight ─────────────────────────────────────`
Note the absence of `implements` from `SpecRelation`. The "implements" notion is intentionally split: `bindings.code` carries *code-side* implementation, while `satisfiedBy` carries *runtime-side* composition (route/layer). This avoids overloading one edge with two meanings — a recurring trap in earlier requirements-management models.
`─────────────────────────────────────────────────`

---

## 5. The two-axis model in pictures

```
abstraction ↑
   contract  │                                    ▢ schema:CreateOrderRequest
             │
  component  │           ▢ component:orders-api
             │
  operation  │      ▢ command:SubmitOrder
             │
   scenario  │  ▢ valid-cart    ▢ unavailable-item   ◉ duplicate-submit
             │
       rule  │  ◉ rule:only-valid-carts-become-orders
             │
    feature  │       ◇ spec:orders.create-order
             │
 capability  │              ▣ capability:order-management
             │
     domain  │                  ▣ domain:commerce
             │
 initiative  │                       ▣ pack:checkout-v1
             └────────────────────────────────────────────────────→ readiness
                sketch  framed  specified  designed  bound  executable  verified
```

Reading the picture:

- `pack:checkout-v1` is `initiative` abstraction at `specified` readiness. Pack-level intent and constraints are written; specs inside it are at various readiness.
- `spec:orders.create-order` is `feature` abstraction at `bound` readiness. It has rules, examples, design, runtime bindings, code bindings — but not all of its examples are executable yet.
- `duplicate-submit` (a scenario inside `create-order`) is `scenario` abstraction at `sketch` readiness — title only, no steps yet.
- A `valid-cart` scenario in the same feature can sit at `verified` readiness — same parent feature, more mature child.

This independence is what the two-axis model gives you. A linear `idea → requirement → implementation` pipeline cannot represent the picture above without distortion.

---

## 6. Refinement vs replacement

The cardinal *authoring* rule:

> A vague Spec should not be converted into a different artifact. It should either be **enriched in place** or **refined into child specs**.

Two valid moves on any Spec:

### Enrichment (same ID, more facets)

```ts
// Before: readiness "framed"
export const CreateOrder = spec({
  id: "spec:orders.create-order",
  // ...minimal intent, two rules, no examples
});

// After: readiness "specified", same id, more facets
export const CreateOrder = spec({
  id: "spec:orders.create-order",
  // ...same intent
  behavior: { rules: [...], examples: [validCartExample, unavailableItemExample] },
  constraints: [perfTarget],
});
```

No new file, no new ID, no migration — just more facets.

### Refinement (parent stays, children are added)

```ts
// Parent stays (with explanatory intent)
export const CompletePurchase = spec({
  id: "spec:checkout.complete-purchase",
  abstraction: "feature",
  readiness: "framed",
  // ...
});

// Children carry the precision
export const ValidateCart       = spec({ id: "spec:cart.validate",                  /* ... */ });
export const AuthorizePayment   = spec({ id: "spec:payment.authorize",              /* ... */ });
export const CreateOrder        = spec({ id: "spec:orders.create-order",            /* ... */ });
export const ReserveInventory   = spec({ id: "spec:inventory.reserve",              /* ... */ });
export const SendConfirmation   = spec({ id: "spec:notifications.send-order-confirmation", /* ... */ });

// All children declare refines("spec:checkout.complete-purchase")
```

The parent remains useful: it is the place where roadmap, AI context, business alignment, and architecture views start. It does not need to disappear once children exist.

---

## 7. Stable IDs and the ID grammar

Stable identifiers are the load-bearing element of the entire graph. They must be:

- **Globally unique** within the repo.
- **Refactor-stable** — they survive file renames and module restructures.
- **Human-readable** so PRs and AI prompts can quote them.
- **Lint-able** — typos must be caught.

### 7.1 ID grammar

```
<namespace>:<dotted.path>[#<sub-segment>]

namespaces:
  spec      — a Spec
  pack      — a SpecPack
  capability— a capability node (or a Spec with abstraction "capability")
  component — a component
  port      — a port / interface
  impl      — an implementation (class / function / module)
  layer     — an Effect Layer (or DI registration)
  api       — a Fastify route, in shape "api:<METHOD>:<path>"
  test      — a test (Vitest/Cucumber/Playwright) identified by its title + file
  adr       — an ADR document
  decision  — a non-ADR decision node
  external  — an external system or third-party service
  schema    — a JSON schema / data contract
  event     — an event channel or event type
```

Examples:

- `spec:orders.create-order`
- `spec:orders.create-order.valid-cart` (a child example, dotted-path sub-segment)
- `pack:checkout-v1`
- `capability:order-management`
- `component:orders-api`
- `port:OrderRepository`
- `impl:CreateOrderUseCase`
- `layer:CreateOrderUseCaseLive`
- `api:POST:/orders`
- `test:orders.create-order.valid-cart`
- `adr:007-order-lifecycle`
- `external:stripe`
- `schema:CreateOrderRequest`

### 7.2 Type-safe IDs

`SpecId`, `ComponentId`, `LayerId`, `RouteId`, etc. are nominal types (branded strings):

```ts
type SpecId      = string & { readonly __brand: "SpecId" };
type ComponentId = string & { readonly __brand: "ComponentId" };
// ...
```

The DSL helpers (`spec({...})`, `ref(...)`, `belongsTo(...)`) accept the branded types so a misspelled `"spec:orders.creat-order"` will not match `SpecId`. To make this practical, the build can **regenerate a union type** of all known IDs after each `akg build`:

```ts
// /generated/spec-ids.d.ts (regenerated)
export type SpecId =
  | "spec:orders.create-order"
  | "spec:orders.create-order.valid-cart"
  | "spec:checkout.complete-purchase"
  | /* ... */;
```

Code that imports `SpecId` then gets compile-time confirmation that a referenced ID exists. The Gherkin tag linter (`akg lint`) does the equivalent for `.feature` files.

`★ Insight ─────────────────────────────────────`
The "regenerate-on-build union" pattern is the cleanest practical workaround for TypeScript's lack of structural cross-file knowledge. It costs one regeneration step but turns referential integrity into a `tsc` error. The danger is *staleness*: if the union is out of date, `tsc` lies. Mitigation: keep regeneration cheap (it is — `ts-morph` reads existing graph JSON), wire it into `pre-tsc` hooks, and fail loudly if the union is missing.
`─────────────────────────────────────────────────`

---

## 8. Lifecycle of a Spec — concrete walkthrough

The same `spec:orders.create-order` ID across all stages. No artifact migration. Each stage is enrichment.

### Stage 1: `sketch`

```ts
export const CreateOrder = spec({
  id: "spec:orders.create-order",
  title: "Customer creates an order",
  kind: "behavior",
  abstraction: "feature",
  readiness: "sketch",

  intent: {
    actor: "customer",
    outcome: "create an order from a valid cart",
    value: "allow checkout to complete",
    openQuestions: [
      { question: "Should inventory reservation precede payment authorization?", blocking: false },
    ],
  },

  relations: [
    { type: "belongsTo", to: "capability:order-management" },
  ],
});
```

Validator profile (`sketch`): require `id`, `title`, `kind`, `abstraction`, `readiness`, and either `intent.outcome` or a parent relation. Open questions allowed. No implementation required.

### Stage 2: `framed`

Add rules and a domain model:

```ts
export const CreateOrder = spec({
  ...previous,
  readiness: "framed",
  behavior: {
    rules: [
      { statement: "Only valid carts can become orders" },
      { statement: "Creating an order emits OrderCreated" },
    ],
  },
  model: {
    terms: ["Cart", "Order", "OrderCreated"],
    commands: ["CreateOrder"],
    events: ["OrderCreated"],
  },
  relations: [
    { type: "belongsTo", to: "capability:order-management" },
    { type: "dependsOn", to: "spec:payment.authorize" },
  ],
});
```

Validator profile (`framed`): require `intent.outcome`, ≥1 relation, and at least one of (rules, examples, constraints).

### Stage 3: `specified`

Add concrete examples and an NFR target:

```ts
export const CreateOrder = spec({
  ...previous,
  readiness: "specified",
  behavior: {
    ...previous.behavior,
    examples: [
      {
        id: "spec:orders.create-order.valid-cart",
        title: "Valid cart creates an order",
        given: ["customer has a valid cart", "all items are available"],
        when:  ["customer submits the order"],
        then:  ["order is created", "OrderCreated event is emitted"],
      },
    ],
  },
  constraints: [
    {
      kind: "performance",
      statement: "Order creation should be fast enough for checkout UX.",
      target: "p95 < 300ms",
      measurableBy: ["otel:orders.create-order.duration"],
    },
  ],
});
```

Validator profile (`specified`): require ≥1 example or ≥1 rule, NFR targets measurable, no `blocking: true` open questions.

### Stage 4: `designed`

Add architectural and decision facets:

```ts
export const CreateOrder = spec({
  ...previous,
  readiness: "designed",
  design: {
    components: ["component:orders-api", "component:orders-domain"],
    ports:      ["port:OrderRepository", "port:EventBus"],
    decisions:  ["adr:007-order-lifecycle"],
  },
});
```

Validator profile (`designed`): require `design.components` ≥1, `design.decisions` ≥1 for non-trivial specs, all referenced IDs resolve.

### Stage 5: `bound`

Tie to runtime composition and code:

```ts
export const CreateOrder = spec({
  ...previous,
  readiness: "bound",
  runtime: {
    fastifyRoutes: ["api:POST:/orders"],
    effectLayers:  ["layer:CreateOrderUseCaseLive"],
  },
  bindings: {
    code:    ["impl:CreateOrderUseCase"],
    tests:   ["test:orders.create-order.valid-cart"],
    schemas: ["schema:CreateOrderRequest", "schema:CreateOrderResponse"],
  },
});
```

Validator profile (`bound`): every binding/runtime ID must resolve to an extracted node from source.

### Stage 6: `executable`

The `valid-cart` *example* is now executable (child spec, separate object):

```ts
export const ValidCartCreatesOrder = spec({
  id: "spec:orders.create-order.valid-cart",
  title: "Valid cart creates order",
  kind: "example",
  abstraction: "scenario",
  readiness: "executable",
  behavior: {
    examples: [{
      id: "spec:orders.create-order.valid-cart",
      title: "Valid cart creates order",
      given: [
        { step: "customerHasValidCart" },
        { step: "allItemsAreAvailable" },
      ],
      when:  [{ step: "submitOrder" }],
      then:  [{ step: "orderIsCreated" }, { step: "orderCreatedEventIsEmitted" }],
    }],
  },
  verification: {
    mode: "executable",
    runner: "vitest",
    tests: ["test:orders.create-order.valid-cart"],
  },
  relations: [
    { type: "exemplifies", to: "spec:orders.create-order" },
    { type: "verifies",    to: "spec:orders.create-order" },
  ],
});
```

Validator profile (`executable`): `verification.mode === "executable"`, `verification.tests` resolves to real test artifacts.

### Stage 7: `verified`

The extractor populates evidence from the last CI run:

```ts
// Authored:
export const ValidCartCreatesOrder = spec({
  // ...previous
  readiness: "verified",
});

// Extracted (via CI):
// evidence.verifiedBy   = ["test:orders.create-order.valid-cart"]
// evidence.lastVerifiedAt = "2026-05-17T09:14:22Z"
// verification.lastResult = "passed"
```

Validator profile (`verified`): `evidence.verifiedBy` ≥1, `verification.lastResult === "passed"`, `evidence.lastVerifiedAt` within configured TTL.

---

## 9. Why this primitive set is sufficient

The eight inputs explored several alternatives and converged on this one because it is the **smallest closed set** that covers:

| Need | Carried by |
|---|---|
| Idea capture | `Spec(kind="behavior", readiness="sketch", intent)` |
| Capability mapping | `Spec(abstraction="capability")` or `SpecPack(abstraction="capability")` |
| Business rules | `BehaviorFacet.rules` (or `Spec(kind="rule")`) |
| NFRs / quality attributes | `ConstraintFacet` |
| Acceptance criteria | `BehaviorFacet.examples` |
| API contracts | `Spec(kind="interface")` + `RuntimeFacet.fastifyRoutes` + `BindingsFacet.schemas` |
| Architecture decisions | `Spec(kind="decision")` or `adr:*` external reference via `DesignFacet.decisions` |
| Component model | `DesignFacet.components` + extracted `component:*` nodes |
| Dependency graph | `RuntimeFacet.effectLayers` + extracted layer/tag relations |
| Tests | `BindingsFacet.tests` + `VerificationFacet` |
| Executable behaviour | `ExampleSpec` with `step()`-form bindings + `VerificationFacet.mode === "executable"` |
| Runtime evidence | `EvidenceFacet.observedIn` from OTel |
| Build provenance | `EvidenceFacet.buildProvenance` from SLSA |
| Visual design | `UiFacet.figmaNodes`, `UiFacet.pencilDocuments`, `UiFacet.stories` |
| Open questions | `IntentFacet.openQuestions` |
| Decomposition | `relations: [{ type: "refines", to }]` + `SpecPack` |

Anything more (e.g., `Initiative`, `Epic`, `Story`, `Task`, `BoundedContext` as separate primitives) collapses into either an abstraction level or a relation. We resist adding new primitives until the existing ones provably cannot express something — which has not yet happened in the eight rounds of discussion.

---

## 10. What this primitive set does *not* try to model

- **Process state.** Whether a Spec is "in sprint", "in review", or "in QA" is *project management*, not delivery truth. Plug into Linear/Jira via a separate index; do not pollute the Spec model with process flags. (Tagging via `tags` is acceptable for lightweight cases.)
- **Roles / RBAC.** `owner` is a soft pointer to an `OwnerRef` (team or person handle), not an authorisation system.
- **Time-series performance data.** `EvidenceFacet.observedIn` carries pointers to OTel metrics, not the data itself. Querying Prometheus/Honeycomb is downstream.
- **Multi-tenant variations of the same Spec.** If `spec:orders.create-order` legitimately behaves differently per tenant, model the variation as child specs (`spec:orders.create-order.tenant-foo`) refining the parent, not by overloading a single Spec with conditional fields.

These boundaries keep the primitive set tight. The graph stays understandable; ingestion of external truths happens at the edges, not inside the core.
