# 04 — Authoring & Binding

How truth gets into the repo. The MVP has exactly two authoring surfaces, both framework-neutral: the **TypeScript Spec DSL** and **generic source markers**. Richer surfaces (Gherkin, harnesses) are named here so the model accommodates them, but are clearly **ASPIRATIONAL**.

Realises **P5** (statically extractable), **P6** (ID-linked), **P9/P10** (markers are annotation, not intent), and the epistemic boundary from `01`.

---

## 1. The TypeScript Spec DSL — canonical (CORE)

Specs are authored as typed TypeScript in `/specs/**/*.spec.ts`. The DSL is a thin set of helpers (`spec`, `specPack`, relation builders) over the `Spec` shape from `02`.

```ts
import { spec, belongsTo, dependsOn, verifies, exemplifies, ref } from "@akg/spec";

export const CreateOrder = spec({
  id: "spec:orders.create-order",
  title: "Customer creates an order",
  kind: "behavior",
  abstraction: "feature",
  readiness: "specified",
  intent: {
    actor: "customer",
    outcome: "turn a valid cart into an order",
    value: "customers can complete purchases",
    openQuestions: ["should stock reservation happen before or after order creation?"],
  },
  behavior: {
    rules: ["only valid carts can become orders", "creating an order emits OrderCreated"],
    examples: [ref("spec:orders.create-order.valid-cart")],
  },
  relations: [belongsTo("capability:order-management"), dependsOn("spec:payment.authorize-payment")],
});
```

### The static-data constraint (P5)

A spec file is **"a JSON file that TypeScript happens to validate."** The extractor must reify it deterministically, so spec source is restricted to static, side-effect-free literals:

- no loops, conditionals, or computed/interpolated IDs;
- no IO, async, or imports of *product* code (only `@akg/spec` helpers);
- relation arguments are string-literal IDs, not expressions.

If a non-static expression appears, the extractor drops *that one property* and emits a warning, keeping the rest of the spec (graceful partial extraction, L3) — it never guesses, and never aborts the build.

A lint rule (`akg/spec-static`) can flag violations earlier, but the extractor is the backstop.

### Enrichment in place, refinement into children

Two sanctioned moves, both keeping the same IDs (P4):

- **Enrich in place** — add facets and raise readiness on the *same* spec object (same ID). No artifact migration.
- **Refine into children** — author child specs that `refine` the parent. The parent is retained as long as it expresses current truth (architecture/AI-context/roadmap framing). It is not "superseded ghost state" — it is present in the current repo or it is not (see L4, `01`).

### One canonical surface per ID

For any given spec ID, exactly one surface is canonical. In the MVP that is always the TS DSL. (When Gherkin arrives, a per-ID config decides which surface is canonical for that spec; the other is a generated read-only view. No mixing per ID.)

---

## 2. Generic source markers — binding code to intent (CORE)

A **marker** binds a code location to a spec ID and minimal structural facts. It is the annotation layer of the graph. Markers are **framework-neutral**: they work on any class, function, route, or module, regardless of how the runtime is wired.

```ts
// Decorator form (one Representation)
@arch.node({ id: "impl:CreateOrderUseCase", satisfies: ["spec:orders.create-order"], component: "component:orders-domain" })
export class CreateOrderUseCase { /* ... */ }

// JSDoc form (equivalent)
/** @arch.node id=impl:CreateOrderUseCase satisfies=spec:orders.create-order */
export function createOrder() { /* ... */ }

// Marker-constant form (equivalent, decorator-free)
export const _mark = markImplementation({ id: "impl:CreateOrderUseCase", satisfies: ["spec:orders.create-order"] });
```

The three syntaxes are interchangeable Representations; the *binding* is the thing. A team picks one style.

### Markers are read-only pointers — never carry intent (P9/P10)

A marker does exactly one thing: bind a code location to a graph ID and its structural bindings (`component`, `satisfies`, `implements`, and — aspirationally — `handles`/`emits`). It is **forbidden** from carrying spec-level facets (intent, behaviour, readiness, verification). This asymmetry is load-bearing:

- **Intent stays centralized** in the spec files, never scattered through code comments.
- Markers produce **annotation**-provenance edges, distinct from **declared** relations (P9).
- The direction is one-way: code points *to* spec, never the reverse.

### Test binding — the `verifies` trace (CORE)

A test declares which spec it verifies, via a marker or a thin wrapper:

```ts
import { specTest } from "@akg/spec-test";

specTest("test:orders.create-order.valid-cart", {
  verifies: "spec:orders.create-order.valid-cart",
  run: async () => { /* ... real test ... */ },
});
```

This produces the bidirectional spec↔test trace that is a core MVP deliverable: query "what verifies this spec?" and "what does this test cover?" from the graph. The *result* of the test (pass/fail) is evidence — observed by the pipeline, never authored (epistemic boundary).

### A marker-required lint (optional, CORE-adjacent)

A lint rule can flag designated patterns (e.g. exported use-case classes, route handlers) that lack a marker, so significant code does not silently fall out of the graph. Useful, not load-bearing.

---

## 3. Runtime bindings are framework-neutral (CORE) — deep extraction is ASPIRATIONAL

The MVP records runtime bindings *generically*: a `runtime` facet (or a marker) names routes/handlers by ID, and that is enough to draw `spec → satisfiedBy → impl/route` edges. The MVP does **not** read framework composition.

> The only **Principle** in this area is **one runtime truth**: do not run two composition mechanisms as first-class, or the extracted architecture sub-graph becomes unreliable. *Which* mechanism a team uses (Effect Layers, Awilix, a manual factory) is a pure Representation, read later by a framework-specific adapter.

**Explicitly aspirational, and not in the core narrative:** Effect `Layer`/`provides`/`requires` extraction with `R`-parameter completeness analysis, Awilix `defineRegistrations` deep wiring, Fastify plugin trees and request-scope modelling, and any Awilix→Effect migration path. *"Complexities like Effect Layers + Awilix are definitely not required."* These slot in as adapters later without changing anything in the core model.

---

## 4. Gherkin and harnesses — named, ASPIRATIONAL

These are real future surfaces, kept here so the model is designed for them, but deliberately out of the MVP.

### Annotated Gherkin (ASPIRATIONAL)

`.feature` files with graph-aware tags (`@spec.orders.create-order`, `@readiness.specified`) as an equal-canonicity surface for behaviour specs, for teams that prefer BDD. Requires a Gherkin parser, a tag linter (tags are not type-safe by themselves), and round-trip export/import between Gherkin and the TS DSL. **Cut from the MVP** because it is a second authoring pipeline; the TS DSL already expresses everything Gherkin does via the `behavior.examples` facet.

### Interactive harnesses (ASPIRATIONAL)

Modules that declare controls + an `expected()` model + `coverage()`, rendered as interactive panels for "what does this spec do under conditions X, Y, Z?" exploration and coverage-gap discovery. Explicitly *not* test runners and *not* authoritative truth. **Cut from the MVP** because it is a new authoring surface plus interactive UI, not needed to prove the core loop.

---

## 5. Repository shape (MVP)

```
/specs
  checkout.pack.ts
  orders/create-order.spec.ts
  payments/authorize-payment.spec.ts
/src
  orders/
    create-order.use-case.ts      // marked: impl:CreateOrderUseCase
    create-order.route.ts         // marked: api:POST:/orders
/test
  orders/create-order.valid-cart.test.ts   // specTest verifies spec:...
/generated                         // gitignored, disposable (L8)
  graph.json
  view/                            // the one generated read-only view
```

Specs are not separate from code — they are part of the codebase, committed alongside it. That is the whole point: the repo is the single source of truth (P1), and authoring is editing TypeScript + git (the MVP write path).
</content>
