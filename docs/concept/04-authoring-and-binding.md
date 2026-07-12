# 04 — Authoring & Binding

How truth gets into the repo. The MVP has exactly two authoring surfaces, both framework-neutral: the **TypeScript Spec DSL** and **generic source anchors**. Richer surfaces (a Gherkin-like carrier, the interactive harness UI) are named in §4 so the model accommodates them — the carrier an open competition, the harness UI **ASPIRATIONAL** — while the carrier-independent executable machinery beneath them is landed (CORE).

Realises **P5** (statically extractable), **P6** (ID-linked), **P9/P10** (anchors are anchored bindings, not intent), and the epistemic boundary from `01`.

---

## 1. The TypeScript Spec DSL — canonical (CORE)

Specs are authored as typed TypeScript in `*.sdp.ts` files, discovered by suffix anywhere under the extraction root (conventionally `/specs/`) — the Protocol's own compound extension (MD-15; the `.stories.tsx` pattern), deliberately **not** `.spec.ts`, which every JS test runner's default glob would try to execute. The DSL is a thin set of helpers (`spec`, `pack`, the branded-ID builders, relation builders) over the `Spec` shape from `02`.

```ts
import { dependsOn, refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const CreateOrder = spec({
  id: specId("spec:orders.create-order"),
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
  relations: [refines(specId("spec:orders.order-management")), dependsOn(specId("spec:payments.authorize-payment"))],
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

A designed-for lint rule (`sdp/spec-static`) would flag both tiers earlier; the extractor is the backstop.

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

// Anchor-constant form (equivalent, decorator-free) — the one surface the MVP extractor reads
export const _anchor = codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
  satisfies: ref("spec:orders.create-order"),
});
```

The three syntaxes are interchangeable Representations; the *binding* is the thing. A team picks one style;
the MVP extracts the **anchor-constant form** (a top-level `const` initialized with the builder call) — the
decorator and JSDoc forms remain unextracted Representations. The builder is the generic **`codeAnchor`**
over the implementation-flavored code namespaces (`impl` / `api` / `component`) — the generic `codeAnchor`
decision (MD-8, folded into the builder's doc-comment in `src/model/anchors.ts`). One binding target per
anchor (two bindings are two anchors); the decorator sketch above shows an array form and a `component`
field that are possible later Representations, not the landed signature.

### Anchors assert a binding — never intent (P9/P10)

An anchor says exactly one thing: *"this code location is the implementation/test **binding** for this Spec ID"* — a binding assertion only, never system-truth content (DECISIONS R1). The landed contract is exactly that minimal: `id` · an optional display `label` · **one** binding target (`satisfies` on a code anchor, `verifies` on a test anchor, `models` on an oracle anchor). Any other field is an extraction **error** — the anchored-surface twin of authoring-shape honesty. Richer structural bindings (`component`, `implements`, `handles`/`emits`) are **ASPIRATIONAL** — possible later extensions (see the inline-vs-centralized open question, `07` §4), never the MVP contract. An anchor is **forbidden** from carrying anything spec-level: behavior, rationale, readiness, acceptance criteria, or delivery facts. This asymmetry is load-bearing:

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

The third builder beside `codeAnchor` and `specTest` is **`specOracle`** (`oracle:` namespace), under the same binding-only law: identity plus one `models` target, emitted as an **anchored** Anchor → `Spec` edge. It records that an **oracle** — the authored expected-outcome semantics for a parent's example space (§4) — *exists*; the graph never records what the oracle says (the function beside the anchor is never extracted, never authoritative), and the anchor confers **no delivery fact** — discovery is an anchor query. A behavior example space has **zero or one** resolving oracle binding: a non-behavior/no-space target or competing oracle is a conformance error, and consumers fail closed rather than selecting an authority.

### An anchor-required lint (optional, CORE-adjacent)

A lint rule can flag designated patterns (e.g. exported use-case classes, route handlers) that lack an anchor, so significant code does not silently fall out of the graph. Useful, not load-bearing.

---

## 3. Runtime bindings are framework-neutral (CORE) — deep extraction is ASPIRATIONAL

The MVP records runtime bindings *generically*: **anchors** name routes/handlers by ID (the `runtime` section is gone), and that is enough to derive `impl/route → satisfies → spec` edges (anchored — code → spec). The MVP does **not** read framework composition.

> The only **Principle** in this area is **one runtime truth**: do not run two composition mechanisms as first-class, or the extracted architecture sub-graph becomes unreliable. *Which* mechanism a team uses (Effect Layers, Awilix, a manual factory) is a pure Representation, read later by a framework-specific adapter.

**Explicitly aspirational, and not in the core narrative:** Effect `Layer`/`provides`/`requires` extraction with `R`-parameter completeness analysis, Awilix `defineRegistrations` deep wiring, Fastify plugin trees and request-scope modelling, and any Awilix→Effect migration path. *"Complexities like Effect Layers + Awilix are definitely not required."* These slot in as adapters later without changing anything in the core model.

---

## 4. Gherkin and harnesses — the executable half landed, the surfaces named

The **carrier-independent executable machinery is landed (CORE)**; what stays deferred is named per surface below. The landed half — identical under whichever richer surface arrives, so none of it waits on one:

- **Generated contracts.** `sdp build` emits a per-example **step contract** (the literal-union module a test binds handlers against — spec-side drift is a compile error naming the exact step) and a per-parent **space contract** (the typed dimensions of the example space · every child's bound point · the Outcome union derived from the parent's Then vocabulary). Both derive from the extracted graph, never the evaluated spec module (one validation path, MD-14), and a test may import them *because* they are projections — never the authored spec.
- **The typed example space.** A parent `behavior` spec's `exampleSpace` declares the parameter-slot vocabulary its steps use; each `example` child binds one **point** (point-per-example, MD-17 — a table of cases is authoring-surface sugar). The **concreteness law** is one structural cell in the example kind's `defined` floor: an unbound slot in a used step caps the example below `defined`.
- **The oracle.** The authored expected-outcome semantics for a parent's example space — implementation-side, beside the tests, bound by the `specOracle` anchor (§2), never extracted. Typed against the generated space contract on both sides: a renamed slot fails to compile, claiming an outcome the specs never stated is a `tsc` error, and `unspecified` is a first-class answer.
- **The execution half.** The framework-neutral `/runner` core plus the `/vitest` adapter subpath (vitest an optional peer of the adapter alone); failure messages render in the spec's own language.

### Annotated Gherkin (OPEN — the carrier competition)

`.feature`-style files with graph-aware tags (`@spec.orders.create-order`, `@readiness.defined`) as an equal-canonicity surface for behaviour specs, for teams that prefer BDD. This is one contender in **the carrier competition (the plan-12 session record)** — parallel exploration PRs judged on exhibits at a dedicated ruling session — and this document does not pre-rule it. Throughout the competition the TS DSL stays the sole canonical authoring surface, and whichever surface wins executes through the generated contracts above: the machinery is carrier-independent by construction.

### Interactive harnesses (ASPIRATIONAL — a projection plus one anchored oracle)

Interactive panels for "what does this spec do under conditions X, Y, Z?" exploration and coverage-gap discovery. The harness is **a projection plus one anchored oracle**, not an authoring surface plus interactive UI: the panel renders wholly from the graph + the generated space contract — the dials are the example space's dimensions, the presets are the children's bound points — and its only authored half is the ~15-line oracle bound by `specOracle` (§2). Explicitly *not* a test runner and *not* authoritative truth. The UI itself stays **cut** as a named later slice; its rendered spec lives at `explorations/executable-examples/5-harness/render/`.

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
  design-review/                   // the one generated read-only view
```

Specs are not separate from code — they are part of the codebase, committed alongside it. That is the whole point: the repo is the single source of truth (P1), and authoring is editing TypeScript + git (the MVP write path).
