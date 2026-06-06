# 04 — Authoring Surfaces

This document defines the **human-facing inputs** to the system: where you actually write specs, how you mark code, and how Gherkin and harnesses fit in. The graph metamodel (`03`) describes the *output*; this document describes the *input*.

There are four authoring surfaces, ranked by canonicity:

1. **The TypeScript Spec DSL** (`/specs/**/*.spec.ts`, `/arch/**/*.ts`) — canonical, typed, refactorable, the source of truth.
2. **Source-code markers** (decorators / JSDoc / marker constants in `/src/`) — bind code locations to graph IDs.
3. **Annotated Gherkin** (`/features/**/*.feature`) — for human-readable behaviour specs; equal-canonicity with the TS DSL for `kind: "behavior"` specs that authors prefer to write that way.
4. **Harness modules** (`/specs/harnesses/*.ts`) — interactive scenario controllers for Spec Studio.

Each surface has rules about what it can express, what it cannot, and how it round-trips with the patch loop.

---

## 1. The TypeScript Spec DSL

### 1.1 The DSL is a thin facade

`@akg/spec` exports a small set of constructors. They are pure functions that return typed objects — no runtime registration, no global state. The "DSL" is really just **TypeScript with constraints**.

```ts
import {
  spec,
  specPack,
  example,
  rule,
  quality,
  business,
  ref,
  belongsTo,
  refines,
  dependsOn,
  decidedBy,
  constrainedBy,
  exemplifies,
  satisfies,
  verifies,
  supersedes,
} from "@akg/spec";
```

Why a constructor function instead of just object literals?

- **Branded ID enforcement.** `spec({ id: "spec:..." })` cross-checks the `id` against the namespace tag and the `kind` against `SpecKind` at call time.
- **`satisfies`-style preserved literals.** Constructors return `<T extends Spec>` so literal IDs flow forward into other constructors.
- **Extraction hooks.** The extractor matches `CallExpression` with the function name `spec` to find spec definitions deterministically — much more reliable than scanning for object literals.
- **Future-proofing.** Adding lifecycle hooks (e.g., `experimental:` markers, deprecation pointers) is cheap when constructors mediate.

### 1.2 What the DSL is *not*

The DSL deliberately does *not* include:

- Loops, conditionals, or external IO at the top level. Spec files are *statically extractable*. `if (process.env.NODE_ENV === "test") spec(...)` is forbidden — the extractor will refuse to evaluate it.
- Imports from product code. A spec file imports only `@akg/spec` (and `@akg/graph/ids` for branded types). It never imports `../src/orders/...`. This is enforced by ESLint and by extractor sanity checks.
- Computed IDs. `spec({ id: \`spec:${name}\` })` is forbidden. The ID must be a string literal.
- Async/Promise expressions. Spec files are evaluated as static data.

These limitations are what makes the DSL *deterministic to extract* with `ts-morph`. If you need dynamic spec generation (e.g., per-tenant variants), generate the `.spec.ts` files via codemod at design time — not at runtime.

`★ Insight ─────────────────────────────────────`
The "ban dynamic constructs" rule is what separates this DSL from frameworks like Effect or NestJS. Those frameworks *want* you to express runtime behaviour through their abstractions. The Spec DSL wants the *opposite*: each `.spec.ts` file should be a static document that happens to be type-checkable. Treat it as a JSON file that TypeScript happens to validate.
`─────────────────────────────────────────────────`

### 1.3 Constructor signatures (core)

```ts
function spec<S extends Spec>(s: S): S;
function specPack<P extends SpecPack>(p: P): P;

function example(e: ExampleSpec): ExampleSpec;
function rule(statement: string, opts?: { rationale?: string }): RuleSpec;
function quality(c: ConstraintFacet & { kind: "performance" | "reliability" | "security" }): ConstraintFacet;
function business(c: ConstraintFacet & { kind: "business" | "compliance" }): ConstraintFacet;

function ref<T extends NodeId>(id: T): { id: T };
function belongsTo(to: SpecId | SpecPackId): SpecRelation;
function refines(to: SpecId, rationale?: string): SpecRelation;
function dependsOn(to: SpecId, strength?: "hard" | "soft"): SpecRelation;
function decidedBy(to: DecisionRef): SpecRelation;
function constrainedBy(to: SpecId, aspect?: string): SpecRelation;
function exemplifies(to: SpecId): SpecRelation;
function satisfies(to: RouteRef | LayerRef | ImplRef): SpecRelation;
function verifies(to: SpecId): SpecRelation;
function supersedes(to: SpecId, reason: string): SpecRelation;

function executableExample(e: ExecutableExampleSpec): ExampleSpec;
function step<A extends Record<string, unknown>>(name: string, args?: A): StepOrPhrase;
function enrichSpec<S extends Spec>(id: SpecId, addition: Partial<S>): S;
```

`enrichSpec` is the "later facet" idiom from the input docs — it merges into an existing spec at extraction time, so authors can split a spec across files (intent in `intent.ts`, design in `design.ts`, runtime in `runtime.ts`). The extractor unifies them by ID.

### 1.4 Worked example — a complete `create-order.spec.ts`

```ts
// specs/orders/create-order.spec.ts
import {
  spec, example, rule, quality, belongsTo, refines, dependsOn,
  decidedBy, exemplifies, verifies,
} from "@akg/spec";

export const CreateOrder = spec({
  id:          "spec:orders.create-order",
  title:       "Customer creates an order",
  kind:        "behavior",
  abstraction: "feature",
  readiness:   "bound",

  intent: {
    actor:   "customer",
    outcome: "create an order from a valid cart",
    value:   "allow checkout to complete",
    risks:   ["duplicate orders on retry", "stale inventory at submission time"],
    assumptions: [
      "payment authorization completes before final order persistence",
    ],
    openQuestions: [],
  },

  behavior: {
    rules: [
      rule("Only valid carts can become orders"),
      rule("Creating an order emits exactly one OrderCreated event",
           { rationale: "Downstream consumers (notifications, analytics) rely on this." }),
      rule("Duplicate submissions must not create duplicate orders",
           { rationale: "Customer may retry on flaky network." }),
    ],
  },

  constraints: [
    quality({
      kind: "performance",
      statement: "Order creation should be fast enough for checkout UX.",
      target: "p95 < 300ms",
      measurableBy: ["otel:orders.create-order.duration"],
    }),
  ],

  model: {
    terms:    ["Cart", "Order", "OrderCreated"],
    entities: ["Cart", "Order"],
    commands: ["CreateOrder"],
    events:   ["OrderCreated"],
  },

  design: {
    components: ["component:orders-api", "component:orders-domain"],
    ports:      ["port:OrderRepository", "port:EventBus"],
    decisions:  ["adr:007-order-lifecycle"],
    tradeoffs:  [
      "Create-then-emit vs emit-then-create: chose create-then-emit for atomicity.",
    ],
  },

  runtime: {
    fastifyRoutes: ["api:POST:/orders"],
    effectLayers:  ["layer:CreateOrderUseCaseLive"],
    externalSystems: ["external:postgres"],
  },

  bindings: {
    code:    ["impl:CreateOrderUseCase"],
    schemas: ["schema:CreateOrderRequest", "schema:CreateOrderResponse"],
    tests:   ["test:orders.create-order.valid-cart"],
  },

  verification: {
    mode:   "executable",
    runner: "vitest",
    tests:  ["test:orders.create-order.valid-cart"],
  },

  ui: {
    stories: ["story:checkout.order-summary.valid-cart"],
    flows:   ["playwright:checkout.successful-checkout"],
    pencilDocuments: ["pencil:checkout-flows.pen#node-create-order"],
  },

  relations: [
    belongsTo("capability:order-management"),
    refines("spec:checkout.complete-purchase"),
    dependsOn("spec:payment.authorize"),
    decidedBy("adr:007-order-lifecycle"),
  ],

  owner: { kind: "team", handle: "orders-team" },
  tags:  ["customer-facing", "p0"],
});

// child example, same id-prefix
export const ValidCartCreatesOrder = spec({
  id: "spec:orders.create-order.valid-cart",
  title: "Valid cart creates order",
  kind: "example",
  abstraction: "scenario",
  readiness: "executable",

  behavior: {
    examples: [
      example({
        id: "spec:orders.create-order.valid-cart",
        title: "Valid cart creates order",
        given: ["a customer has a valid cart", "all items are available"],
        when:  ["the customer submits the order"],
        then:  ["an order is created", "an OrderCreated event is emitted"],
      }),
    ],
  },

  verification: {
    mode:   "executable",
    runner: "vitest",
    tests:  ["test:orders.create-order.valid-cart"],
  },

  relations: [
    exemplifies("spec:orders.create-order"),
    verifies("spec:orders.create-order"),
  ],
});
```

This is one file. It is type-checked by `tsc`, extracted by `akg build`, and renderable in the Spec Studio. If the author misspells `"spec:orders.creat-order"` the `SpecId` brand catches it. If they claim `readiness: "bound"` but omit `runtime` and `bindings`, `akg validate` fails CI.

### 1.5 File organisation conventions

```
/specs/
  checkout/
    checkout.pack.ts            # specPack({ id: "pack:checkout-v1", ... })
    complete-purchase.spec.ts   # spec({ id: "spec:checkout.complete-purchase", ... })

  orders/
    create-order.spec.ts        # spec + child example specs
    cancel-order.spec.ts
    fulfill-order.spec.ts

  payment/
    authorize.spec.ts
    capture.spec.ts

  inventory/
    reserve.spec.ts

  notifications/
    send-order-confirmation.spec.ts

  glossary/
    commerce.terms.ts           # term definitions (DomainModelFacet building blocks)

  experiments/                  # not committed in main; for spike work
    new-checkout-flow.spec.ts

/arch/
  capabilities.ts               # capability nodes (lightweight or full Specs)
  components.ts                 # component nodes
  ports.ts                      # port / interface declarations
  external-systems.ts           # external integrations
  decisions/
    adr-007-order-lifecycle.md
    adr-012-event-emission.md
  views.ts                      # LikeC4 view configuration overrides
```

Conventions:

- One file per top-level spec (parent + its child examples). Splitting examples into separate files is allowed; the extractor unifies by ID.
- Pack files (`*.pack.ts`) live in the same directory as the specs they contain.
- ADRs stay as markdown — the graph references them by ID, not by parsing prose.
- `glossary/` files declare domain terms; specs reference them via `model.terms`. This catches typo-drift.

### 1.6 Spec files vs source code — strict separation

```
✘ specs/orders/create-order.spec.ts          imports ../../src/orders/...   (forbidden)
✓ specs/orders/create-order.spec.ts          imports "@akg/spec"             (allowed)
✓ src/orders/create-order.use-case.ts        imports "@akg/markers"          (allowed)
✓ src/orders/create-order.use-case.ts        imports type { SpecId } from "@akg/graph/ids"  (allowed)
✘ src/orders/create-order.use-case.ts        imports CreateOrder from "../../specs/..."   (forbidden)
```

Spec files describe *intent*. Source code carries *implementation*. They are linked by **IDs in strings**, not by TypeScript import edges. This is the only way the system survives heavy refactoring of either side.

ESLint rule `akg/no-cross-imports` enforces both directions.

---

## 2. Source-code markers

Source markers do *one thing*: they bind a code location to a graph ID. They are not for storing business logic, not for influencing runtime, and not for replacing types. They are the static "you are here" pin on a class or function.

Three marker styles, all equally supported by the extractor:

### 2.1 Decorators (preferred when classes are involved)

```ts
import { arch } from "@akg/markers";

@arch.node({
  id:        "impl:CreateOrderUseCase",
  kind:      "implementation",
  component: "component:orders-api",
  capability:"capability:order-management",
  satisfies: ["spec:orders.create-order"],
})
export class CreateOrderUseCase {
  constructor(private deps: {
    orderRepository: OrderRepository;
    eventBus:        EventBus;
  }) {}

  async execute(command: CreateOrderCommand): Promise<OrderId> {
    /* … */
  }
}
```

Important constraints:

- The decorator factory accepts a **plain object literal**. The extractor evaluates it statically — no spread, no computed keys, no function references.
- The decorator is treated as **metadata only**. `@akg/markers` decorators do not register anything at runtime in production builds. (`reflect-metadata` is *not* required; modern TS decorators that do not depend on emit metadata are fine.)
- Per-class only. `@arch.node` does not decorate parameters, methods, or properties — those would dramatically expand the metamodel surface for little gain.

For things like `handles`/`emits`, use *method-attaching* helpers that look like decorators but are actually marker constants:

```ts
export class OrderEventHandler {
  @arch.handles({ event: "event:OrderCreated", id: "impl:OrderCreatedHandler" })
  async onOrderCreated(event: OrderCreated): Promise<void> { /* … */ }
}
```

### 2.2 JSDoc tags (for functions, constants, modules)

When decorators are awkward (top-level functions, exported constants, modules), use JSDoc:

```ts
/**
 * @akg.node     impl:CreateOrderRoute
 * @akg.kind     implementation
 * @akg.component component:orders-api
 * @akg.satisfies spec:orders.create-order
 */
export async function createOrderRoute(app: FastifyInstance) { /* … */ }
```

JSDoc tags follow the TSDoc-compatible convention defined in `tsdoc.json`. The extractor parses them via the standard TSDoc parser, so IDE tooling (TypeDoc, API Extractor) sees them too — useful for `typedoc-plugin-markdown` projections.

Multi-line and array values use a brace syntax:

```ts
/**
 * @akg.node      impl:CheckoutRoutes
 * @akg.satisfies { spec:orders.create-order, spec:checkout.complete-purchase }
 */
export async function checkoutRoutes(app: FastifyInstance) { /* … */ }
```

### 2.3 Marker constants (for things without decorator/JSDoc affinity)

For function expressions, third-party-instantiated objects, or anywhere a sigil-style marker reads better than a decorator:

```ts
import { markImplementation } from "@akg/markers";

export const createOrder = markImplementation({
  id:        "impl:CreateOrderUseCase",
  kind:      "implementation",
  component: "component:orders-api",
  satisfies: ["spec:orders.create-order"],
})(async (command: CreateOrderCommand) => {
  /* … */
});
```

`markImplementation` is the identity function at runtime; its only purpose is to be syntactically recognisable to `ts-morph`. The extractor matches a `CallExpression` whose `expression` is `markImplementation` and reads the argument literal.

### 2.4 What markers *can* express

```ts
type ArchNodeMarker = {
  id:          NodeId;                   // required, branded
  kind:        NodeKind;                 // required

  // optional declarative bindings:
  component?:  ComponentRef;
  capability?: SpecId;                   // capability:*
  satisfies?:  SpecId[];
  implements?: PortRef[];                // for impl → port
  handles?:    EventRef;                 // for event handlers
  emits?:      EventRef[];               // for emitters
  exposes?:    PortRef;                  // for components

  // discoverability metadata:
  visibility?: "public" | "internal";
  tags?:       string[];
};
```

Note what is *not* allowed:

- `readiness`, `abstraction` — these are properties of *Specs*, not of *implementations*. A class doesn't have a readiness.
- `behavior`, `intent`, etc. — these are spec-level facets. Putting them in a marker would make the implementation file authoritative for intent, which violates the separation.
- `verification` — verification is a property of the spec; tests link the implementation to the spec.

The asymmetry is deliberate: **markers are read-only pointers from code to spec, never the reverse.**

### 2.5 ESLint rule `akg/marker-required`

For chosen "significant" patterns (configurable), a class/function without a marker is a lint error:

```ts
// .eslintrc.akg.json
{
  "rules": {
    "akg/marker-required": ["error", {
      "patterns": [
        { "fileGlob": "src/**/*.use-case.ts",   "expect": "impl:*" },
        { "fileGlob": "src/**/*.route.ts",      "expect": "api:*" },
        { "fileGlob": "src/**/*.layer.ts",      "expect": "layer:*" },
        { "fileGlob": "src/**/*.repository.ts", "expect": "impl:*" }
      ]
    }]
  }
}
```

This catches the everyday "I added a new use case and forgot to mark it" case without forcing markers on everything.

---

## 3. Annotated Gherkin

Gherkin is an equal-canonicity authoring surface for `kind: "behavior"` specs that authors prefer to write in BDD form. The extractor parses `.feature` files and produces the same kind of graph nodes a TypeScript spec file would.

### 3.1 Tag vocabulary

```
@spec.<id-after-prefix>       e.g. @spec.orders.create-order
@pack.<id>
@capability.<id>
@readiness.<level>            sketch | framed | specified | designed | bound | executable | verified
@component.<id>
@api.<METHOD>.<path-segments>
@layer.<id>
@adr.<id>
@nfr.<id>
@risk.<short-name>
@owner.<team-handle>
```

Multiple readiness tags are allowed at different levels — the most precise wins:

```gherkin
@spec.orders.create-order
@readiness.specified
Feature: Customer creates an order

  Rule: Only valid carts can become orders

    @example.valid-cart
    @readiness.executable
    Scenario: Valid cart creates an order
      Given a customer has a valid cart
      And all items are available
      When the customer submits the order
      Then an order is created
      And an OrderCreated event is emitted
```

Here the feature is `specified` (it has rules and concrete examples), the `valid-cart` scenario is `executable` (it has step definitions).

### 3.2 Gherkin descriptions for intent

Cucumber Gherkin allows free-form description blocks below `Feature`, `Rule`, and `Scenario`. The extractor captures these into:

- `Feature` description → `IntentFacet.outcome`/`value`/`assumptions`/`openQuestions`.
- `Rule` description → `RuleSpec.rationale`.
- `Scenario` description → `ExampleSpec` notes.

We use a lightweight convention:

```gherkin
@spec.orders.create-order
@readiness.framed
Feature: Customer creates an order

  Intent:
  A customer should be able to submit a valid cart and receive an order confirmation.

  Value:
  Allows checkout to complete; creates a durable order record.

  Risks:
  - Duplicate orders on flaky network.
  - Stale inventory at submission time.

  Open questions:
  - Should inventory reservation happen before or after payment authorization?
  - Should OrderCreated be emitted before or after confirmation email scheduling?
```

The parser recognises `Intent:`, `Value:`, `Risks:`, `Assumptions:`, `Open questions:` as section headers. Anything outside named sections becomes `notes`.

### 3.3 Gherkin steps and step definitions

Step bodies (`Given`, `When`, `Then`) start as prose. They become *executable* by adding step definitions in TypeScript:

```ts
// features/steps/orders.steps.ts
import { Given, When, Then } from "@cucumber/cucumber";
import { Effect } from "effect";
import { expect } from "vitest";
import { testRuntime } from "../support/test-runtime";
import { CreateOrderUseCase } from "../../src/orders/create-order.layer";

Given("a customer has a valid cart", async function () {
  this.cart = await fixtures.createValidCart();
});

Given("all items are available", async function () {
  await fixtures.makeAllItemsAvailable(this.cart);
});

When("the customer submits the order", async function () {
  this.result = await Effect.runPromise(
    Effect.gen(function* () {
      const useCase = yield* CreateOrderUseCase;
      return yield* useCase.execute({ cartId: this.cart.id });
    }).pipe(Effect.provide(testRuntime))
  );
});

Then("an order is created", function () {
  expect(this.result.orderId).toBeDefined();
});

Then("an OrderCreated event is emitted", async function () {
  await expectEvent("OrderCreated", { orderId: this.result.orderId });
});
```

The extractor pairs step definitions with their scenarios via Cucumber Messages, then emits `Test` nodes and `verifies` edges in the graph.

### 3.4 Round-tripping Gherkin ↔ TypeScript specs

A common question: *if a `.feature` file and a `.spec.ts` file describe the same behaviour, which is canonical?*

Answer: **whichever the team chose at authoring time.** The graph treats them as equivalent. The Spec Studio can render either form. The patch loop can update either form.

Two valid styles:

1. **Gherkin-first.** Authors write `.feature` files; the extractor produces graph nodes; an optional `akg export-ts` command writes equivalent `.spec.ts` files for IDE refactoring leverage. The `.feature` files remain canonical.
2. **TS-first.** Authors write `.spec.ts` files; `akg export-gherkin` produces `.feature` files for stakeholder review. The `.spec.ts` files remain canonical.

We do *not* support mixing — for a given spec ID, exactly one authoring surface is canonical. This is recorded in `akg.config.ts`:

```ts
specs: {
  canonicalFormat: "ts",                    // or "gherkin", or per-pattern
  exports: { gherkin: { enabled: true } }   // generate the other form for reading
}
```

### 3.5 Gherkin lint (`akg lint`)

Gherkin tags are strings; typos do not fail compilation. The lint pass closes the gap:

```bash
$ akg lint features/**/*.feature
features/orders/create-order.feature:1
  @spec.orders.creat-order
  ✗ unknown spec id

  Did you mean: @spec.orders.create-order ?
```

The lint reads from `/generated/spec-ids.d.ts` (the regenerated union) so any TypeScript-authored ID is automatically known to the Gherkin linter.

`akg lint` runs as a pre-commit hook and in CI.

---

## 4. Harness modules

Harnesses are a *fourth* authoring surface, designed for scenarios where humans want to interactively explore "what does this spec actually do under conditions X, Y, Z?".

A harness is a TypeScript module that declares interactive controls and an `expected` function:

```ts
// specs/harnesses/orders.create-order.harness.ts
import { harness, select, boolean, slider } from "@akg/spec";

export const CreateOrderHarness = harness({
  id:   "harness:orders.create-order",
  spec: "spec:orders.create-order",

  controls: {
    cartState:         select(["valid", "empty", "unavailable-item"]),
    paymentState:      select(["authorized", "failed", "pending"]),
    duplicateSubmit:   boolean(),
    latencyBudgetMs:   slider({ min: 100, max: 1000, default: 300 }),
  },

  expected: ({ cartState, paymentState, duplicateSubmit }) => {
    if (cartState !== "valid")           return "order-not-created";
    if (paymentState !== "authorized")   return "order-not-created";
    if (duplicateSubmit)                 return "existing-order-returned";
    return "order-created";
  },

  coverage: ({ cartState, paymentState, duplicateSubmit }) => {
    // returns the matching example spec id, if any
    if (cartState === "valid" && paymentState === "authorized" && !duplicateSubmit) {
      return "spec:orders.create-order.valid-cart";
    }
    return undefined;
  },
});
```

The Spec Studio renders the harness as an interactive panel:

```
[ cart state: valid ▼ ]   [ payment: authorized ▼ ]   [ duplicate: ☐ ]   [ latency: ▒▒▒▒░░░░ 300ms ]

  Expected result:   order-created
  Covered by:        spec:orders.create-order.valid-cart  (executable, passing)

  ✗ No executable test for { cartState: "valid", paymentState: "failed" }
  ✗ No executable test for { cartState: "valid", paymentState: "authorized", duplicateSubmit: true }

  [Propose scenarios]   [Export as patch]
```

The "Propose scenarios" button generates spec patches for the uncovered combinations and writes them to `/generated/patches/`.

### 4.1 What harnesses are good for

- **Pre-implementation exploration.** "What permutations matter? Which ones do we have tests for?"
- **Stakeholder reviews.** Product / design can play with inputs and confirm expectations before sprints commit.
- **Documentation.** Generated HTML embeds the harness; readers learn by twiddling, not just by reading.
- **AI-augmented scenario generation.** An agent can enumerate `controls` permutations and produce structured patches for missing coverage.

### 4.2 What harnesses are *not*

- **Not test runners.** A harness's `expected` function is a *human-readable* model, not a tested oracle. Use Vitest/Cucumber tests for verification.
- **Not authoritative truth.** If the harness's `expected` disagrees with the implementation, it is the harness or the implementation that is wrong — *the canonical answer is in the spec's rules and examples.*

---

## 5. UI / visual design surfaces

For specs with a user-facing surface (`kind: "behavior"`, `abstraction: "feature"` or `"scenario"`), the `UiFacet` lets you link visual artifacts. The links are by ID/URL — Libar Omni does not render or own the visuals.

### 5.1 Storybook story references

```ts
ui: {
  stories: [
    "story:checkout.order-summary.valid-cart",
    "story:checkout.order-summary.unavailable-item",
  ],
}
```

The Spec Studio embeds the story iframe (or screenshot) inline, and links to the live Storybook. Story IDs follow Storybook's slugged convention (`<component>--<story>`).

### 5.2 Pencil / Figma references

```ts
ui: {
  pencilDocuments: ["pencil:checkout-flows.pen#node-create-order"],
  figmaNodes:      ["https://figma.com/file/.../?node-id=42:7"],
}
```

The Spec Studio renders a thumbnail (via cached export) and a link.

### 5.3 Playwright flow IDs

```ts
ui: {
  flows: ["playwright:checkout.successful-checkout"],
}
```

The Spec Studio shows the latest Playwright run status, screenshots, and a link to the trace viewer.

### 5.4 Visual regression baselines

```ts
ui: {
  screenshots: [
    "tests/visual/checkout/order-summary.success.png",
  ],
  accessibilityStatus: "passing",
}
```

`accessibilityStatus` is ingested from Axe / Playwright accessibility reports; the Spec Studio displays it as a status pill.

---

## 6. Authoring lifecycle by reader type

A short list of who tends to author what:

| Persona | Primary surface | Secondary surface |
|---|---|---|
| Product / business analyst | Gherkin (or Spec Studio editor + patch loop) | TS spec DSL (occasional) |
| Domain engineer | TS spec DSL + source markers | Gherkin (for shared behavior specs) |
| Architect | TS spec DSL (`/arch/*.ts` + capabilities/components) + ADRs | LikeC4 imports |
| QA / test engineer | Step definitions + `specTest` wrappers + Playwright `tag`/`annotation` | Gherkin scenarios |
| Designer | Pencil/Figma → references appear in `UiFacet` | Storybook stories |
| AI agent | Generates patches against TS spec DSL | Annotates source via markers |

No persona is forced to learn an unfamiliar surface. The Spec Studio is the *reading* surface for everyone; authoring surfaces remain native to each role.

---

## 7. The "what stays in code" rule

A repeated question across the inputs: *which decisions should live in code, and which in /arch model files?*

Pragmatic answer:

- **Stays in the implementation file (via marker):** what *kind* of thing this is (`impl`, `route`, `layer`), which component it belongs to, which spec(s) it satisfies, which port it implements, which events it handles/emits.
- **Stays in `/arch/*.ts`:** capabilities, components, ports, ADR references, external systems, architecture views, forbidden-dependency rules.
- **Stays in `/specs/*.spec.ts`:** intent, behaviour (rules + examples), constraints, design facet (components & decisions for *this* spec), runtime bindings (which routes/layers realise *this* spec), code bindings (which `impl:*` realise *this* spec).

The triangulation rule:

```
A code-level marker says:    "I am impl:X, I satisfy spec:Y, I belong to component:Z"
A spec file says:            "spec:Y is satisfied by impl:X via layer:L on route:R"
An arch file says:           "component:Z belongs to capability:C; component:Z exposes port:P"
```

The graph reconciles these. If the spec says `bindings.code = ["impl:X"]` but no implementation file claims `impl:X`, the validator fires `missing-implementation`. If two implementations claim `impl:X`, the validator fires `duplicate-node-id`. If `impl:X` claims `component:Z` but `/arch/components.ts` has no `component:Z`, the validator fires `unknown-component`.

This three-way consistency is what makes the architecture "real" rather than aspirational.
