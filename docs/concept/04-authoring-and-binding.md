# 04 — Authoring & Binding

How truth gets into the repo. The MVP has exactly two authoring surfaces, both framework-neutral: the **TypeScript Spec DSL** and **generic source anchors**. Richer surfaces (Gherkin, harnesses) are named here so the model accommodates them, but are clearly **ASPIRATIONAL**.

Realises **P5** (statically extractable), **P6** (ID-linked), **P9/P10** (anchors are anchored bindings, not intent), and the epistemic boundary from `01`.

---

## 1. The TypeScript Spec DSL — canonical (CORE)

Specs are authored as typed TypeScript in `/specs/**/*.sdp.ts` — the Protocol's own compound extension (MD-15; the `.stories.tsx` pattern), deliberately **not** `.spec.ts`, which every JS test runner's default glob would try to execute. The DSL is a thin set of helpers (`spec`, `pack`, relation builders) over the `Spec` shape from `02`.

```ts
import { spec, refines, dependsOn } from "@libar-dev/software-delivery-protocol";

export const CreateOrder = spec({
  id: "spec:orders.create-order",
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "defined",
  intent: {
    actor: "customer",
    outcome: "turn a valid cart into an order",
    value: "customers can complete purchases",
    openQuestions: ["should stock reservation happen before or after order creation?"],
  },
  behavior: {
    // content only — never refs (02 §3): a promoted example is a child spec that refines/verifies this one
    rules: ["only valid carts can become orders", "creating an order emits OrderCreated"],
    examples: ["an expired payment card is declined before any order is created"],
  },
  relations: [refines("spec:orders.order-management"), dependsOn("spec:payments.authorize-payment")],
});
```

### The static-data constraint (P5)

A spec file is **"a JSON file that TypeScript happens to validate."** The extractor must reify it deterministically, so spec source is restricted to static, side-effect-free literals:

- no loops, conditionals, or computed/interpolated IDs;
- no IO, async, or imports of *product* code (only `@libar-dev/software-delivery-protocol` helpers);
- relation arguments are string-literal IDs, not expressions.

If a non-static expression appears, the extractor responds in **two tiers**, drawn along the same envelope/section line the model is built on (`02` §2):

- **Envelope fields are hard errors.** A non-static `id`, `kind`, `altitude`, `readiness`, or any **relation target** **fails the build** — these are the keys the graph is built on, so the extractor must never guess, drop, or anonymise them. A spec whose identity or position cannot be reified deterministically is not extracted at all.
- **Optional section detail degrades gracefully.** A non-static expression *inside an optional section* drops *that one property* with a warning, keeping the rest of the spec (graceful partial extraction, L3). It never aborts the build for section detail.

A lint rule (`sdp/spec-static`) can flag both tiers earlier, but the extractor is the backstop.

### Enrichment in place, refinement into children

Two sanctioned moves, both keeping the same IDs (P4):

- **Enrich in place** — add sections and raise readiness on the *same* spec object (same ID). No artifact migration.
- **Refine into children** — author child specs that `refine` the parent. The parent is retained as long as it expresses current truth (architecture/AI-context/roadmap framing). It is not "superseded ghost state" — it is present in the current repo or it is not (see git is the event log, `01`).

### One canonical surface per ID

For any given spec ID, exactly one surface is canonical. In the MVP that is always the TS DSL. (When Gherkin arrives, a per-ID config decides which surface is canonical for that spec; the other is a generated read-only view. No mixing per ID.)

---

## 2. Generic source anchors — binding code to intent (CORE)

An **anchor** binds a code location to a spec ID and minimal structural facts. It is the anchored layer of the graph. Anchors are **framework-neutral**: they work on any class, function, route, or module, regardless of how the runtime is wired.

```ts
// Decorator form (one Representation)
@arch.node({ id: "impl:orders.create-order-use-case", satisfies: ["spec:orders.create-order"], component: "component:orders.domain" })
export class CreateOrderUseCase { /* ... */ }

// JSDoc form (equivalent)
/** @arch.node id=impl:orders.create-order-use-case satisfies=spec:orders.create-order */
export function createOrder() { /* ... */ }

// Anchor-constant form (equivalent, decorator-free)
export const _anchor = anchorImplementation({ id: "impl:orders.create-order-use-case", satisfies: ["spec:orders.create-order"] });
```

The three syntaxes are interchangeable Representations; the *binding* is the thing. A team picks one style.
The builder generalizes to **`codeAnchor`** over the implementation-flavored code namespaces (`impl` / `api` /
`component`) — the generic `codeAnchor` decision (MD-8), landing with Slice-2 anchor extraction; until then the
DSL ships the narrower `anchorImplementation`.

### Anchors assert a binding — never intent (P9/P10)

An anchor says exactly one thing: *"this code location is the implementation/test **binding** for this Spec ID"* — a binding assertion only, never system-truth content (DECISIONS R1). It binds a code location to a graph ID and its structural bindings (`component`, `satisfies`, `implements`, and — aspirationally — `handles`/`emits`). It is **forbidden** from carrying anything spec-level: behavior, rationale, readiness, acceptance criteria, or delivery facts. This asymmetry is load-bearing:

- **Intent stays centralized** in the spec files, never scattered through code comments.
- Anchors produce **anchored**-`claim` edges, distinct from **declared** relations (P9).
- The direction is one-way: code points *to* spec, never the reverse.

### Test binding — the `verifies` trace (CORE)

A test declares which spec it verifies via a **binding-only test anchor** — identity plus the `verifies`
target, never an executing callback (DECISIONS R3: a binding that carried a `run` body would couple the
graph binding to execution, contradicting "the graph records that an enabled verifier *exists*, never that
it ran"). The test body itself stays an ordinary runner test beside the anchor:

```ts
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

export const createOrderValidCartTest = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart verifies the create-order happy path",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

// ... the real test (plain Vitest/Jest/etc.) lives alongside ...
```

Here the test `verifies` the **example** it backs (`spec:orders.create-order.valid-cart`); that test anchor is exactly what makes the example an **enabled verifier**, so the example's own `verifies` edge can confer `has-verifier` on the parent it targets (the direct, per-spec, non-transitive rule in `02` §2, *Verifier semantics*). This produces the bidirectional spec↔test trace that is a core MVP deliverable: query "what verifies this spec?" and "what does this test cover?" from the graph. The test's *result and its runner status* (pass/fail, skipped, quarantined, glob-excluded) are operational — CI's, never in the graph; the graph records only that an enabled verifier — a **resolvable test binding** — *exists*, never that it ran (the derived `has-verifier` delivery fact, `02` §2).

### An anchor-required lint (optional, CORE-adjacent)

A lint rule can flag designated patterns (e.g. exported use-case classes, route handlers) that lack an anchor, so significant code does not silently fall out of the graph. Useful, not load-bearing.

---

## 3. Runtime bindings are framework-neutral (CORE) — deep extraction is ASPIRATIONAL

The MVP records runtime bindings *generically*: **anchors** name routes/handlers by ID (the `runtime` section is gone), and that is enough to derive `impl/route → satisfies → spec` edges (anchored — code → spec). The MVP does **not** read framework composition.

> The only **Principle** in this area is **one runtime truth**: do not run two composition mechanisms as first-class, or the extracted architecture sub-graph becomes unreliable. *Which* mechanism a team uses (Effect Layers, Awilix, a manual factory) is a pure Representation, read later by a framework-specific adapter.

**Explicitly aspirational, and not in the core narrative:** Effect `Layer`/`provides`/`requires` extraction with `R`-parameter completeness analysis, Awilix `defineRegistrations` deep wiring, Fastify plugin trees and request-scope modelling, and any Awilix→Effect migration path. *"Complexities like Effect Layers + Awilix are definitely not required."* These slot in as adapters later without changing anything in the core model.

---

## 4. Gherkin and harnesses — named, ASPIRATIONAL

These are real future surfaces, kept here so the model is designed for them, but deliberately out of the MVP.

### Annotated Gherkin (ASPIRATIONAL)

`.feature` files with graph-aware tags (`@spec.orders.create-order`, `@readiness.defined`) as an equal-canonicity surface for behaviour specs, for teams that prefer BDD. Requires a Gherkin parser, a tag linter (tags are not type-safe by themselves), and round-trip export/import between Gherkin and the TS DSL. **Cut from the MVP** because it is a second authoring pipeline; the TS DSL already expresses everything Gherkin does via the `behavior` section's examples.

### Interactive harnesses (ASPIRATIONAL)

Modules that declare controls + an `expected()` model + `coverage()`, rendered as interactive panels for "what does this spec do under conditions X, Y, Z?" exploration and coverage-gap discovery. Explicitly *not* test runners and *not* authoritative truth. **Cut from the MVP** because it is a new authoring surface plus interactive UI, not needed to prove the core loop.

---

## 5. Repository shape (MVP)

```
/specs
  checkout.pack.sdp.ts
  orders/create-order.sdp.ts
  payments/authorize-payment.sdp.ts
/src
  orders/
    create-order.use-case.ts      // anchored: impl:orders.create-order-use-case
    create-order.route.ts         // anchored: api:orders.post
/test
  orders/create-order.valid-cart.test.ts   // specTest verifies spec:...
/generated                         // gitignored, disposable (L8)
  graph.json
  view/                            // the one generated read-only view
```

Specs are not separate from code — they are part of the codebase, committed alongside it. That is the whole point: the repo is the single source of truth (P1), and authoring is editing TypeScript + git (the MVP write path).
