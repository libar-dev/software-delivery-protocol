# 04 — Authoring & Binding

How truth gets into the repo. Authoring has three ruled **carriers**, all framework-neutral: the **Markdown carrier (`.sdp.md`)**, the default for Specs and Packs; the **TypeScript Spec DSL (`.sdp.ts`)**, an import source and lawful per-ID option (the carrier ruling, MD-18, completed by the Pack syntax ruling, MD-25); and **graph-aware Gherkin (`.sdp.gherkin`)**, a lawful per-ID option for behavior and example Specs only (the Gherkin carrier option, MD-27, and the `.sdp.gherkin` extension, MD-28). **Generic source anchors** bind code under any carrier. The interactive harness UI stays named in §4 as **ASPIRATIONAL**. The carrier-independent executable machinery beneath richer surfaces is landed (CORE).

Realises **P5** (statically extractable), **P6** (ID-linked), **P9/P10** (anchors are anchored bindings, not intent), and the epistemic boundary from `01`.

---

## 1. The TypeScript Spec DSL — the TS carrier (CORE)

In the TS carrier, specs are authored as typed TypeScript in `*.sdp.ts` files, discovered by suffix anywhere under the extraction root (conventionally `/specs/`) — the Protocol's own compound extension (MD-15; the `.stories.tsx` pattern), deliberately **not** `.spec.ts`, which every JS test runner's default glob would try to execute. The DSL is a thin set of helpers (`spec`, `pack`, the branded-ID builders, relation builders) over the `Spec` shape from `spec:model.core-model`.

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
    // content only — never refs (`spec:model.spec-sections`): a promoted example is a child spec that refines/verifies this one
    rules: ["only valid carts can become orders", "creating an order emits OrderCreated"],
    examples: ["an expired payment card is declined before any order is created"],
  },
  relations: [refines(specId("spec:orders.order-management")), dependsOn(specId("spec:payments.authorize-payment"))],
});
```

### The static-data constraint (P5)

A spec file in this carrier is **"a JSON file that TypeScript happens to validate."** The extractor must reify it deterministically, so spec source is restricted to static, side-effect-free literals:

- no loops, conditionals, or computed/interpolated IDs;
- no IO, async, or imports of *product* code (only `@libar-dev/software-delivery-protocol` helpers);
- relation arguments are string-literal IDs, not expressions.

If a non-static expression appears, the extractor responds in **two tiers**, drawn along the same envelope/section line the model is built on (`spec:model.core-model`):

- **Envelope fields are hard errors.** A non-static `id`, `kind`, `altitude`, `readiness`, or any **relation target** **fails the build** — these are the keys the graph is built on, so the extractor must never guess, drop, or anonymise them. A spec whose identity or position cannot be reified deterministically is not extracted at all.
- **Optional section detail degrades gracefully.** A non-static expression *inside an optional section* drops *that one property* with a warning, keeping the rest of the spec (graceful partial extraction, L3). It never aborts the build for section detail.

A designed-for lint rule (`sdp/spec-static`) would flag both tiers earlier; the extractor is the backstop.

**The two tiers above are the TS carrier's granularity — graceful degradation is per-carrier.** The TS carrier keeps L3's property-level graceful degradation: a non-static optional-section property drops with a warning, keeping the rest of the spec. The Markdown carrier is deliberately **all-or-nothing per document**: a malformed Markdown document refuses as a whole under one of the four hard finding IDs (`extract/invalid-frontmatter`, `extract/invalid-markdown-structure`, `extract/unrecognized-heading`, `extract/unowned-prose`) and is excluded while healthy sibling documents continue. This is an intentional corpus-scoped hardening, not a contradiction of the two-tier law — one L3 principle (one bad input never poisons the whole build) represented at different granularity per carrier.

### Enrichment in place, refinement into children

Two sanctioned moves, both keeping the same IDs (P4):

- **Enrich in place** — add sections and raise readiness on the *same* spec object (same ID). No artifact migration.
- **Refine into children** — author child specs that `refine` the parent. The parent is retained as long as it expresses current truth (architecture/AI-context/roadmap framing). It is not "superseded ghost state" — it is present in the current repo or it is not (see git is the event log, `01`).

### One canonical surface per ID

For any given Spec or Pack ID, exactly one surface is canonical, with no mixing per ID. Specs and Packs default to Markdown; the TS DSL survives as import source and a lawful per-ID option; behavior and example Specs may instead choose `.sdp.gherkin` (the carrier ruling, MD-18, completed by the Pack syntax ruling, MD-25, plus MD-27/MD-28). Bare `.feature` is never a live canonical surface. A per-ID canonical-surface config is designed-for and deferred (ASPIRATIONAL); the current realization is file-existence-only: the surface that exists is canonical, and any other form is a generated read-only view or foreign material.

---

## 2. Source anchors — binding code to intent (CORE)

The anchor law has moved into Specs. This section keeps only pointers to them, under the concept-documents dissolution decision (`spec:decisions.concept-docs-dissolve`).

- **The anchor model** — `spec:model.anchors`: identity, an optional label, zero or more Spec targets and optional structure, written in the constant form or the comment form, both feeding one closed envelope; code, test and oracle anchors; which builder imports the extractor trusts.
- **The comment form** (MD-36) — `spec:decisions.anchor-comment-form`: a top-level `/** … */` block with reserved `@sdp*` tags binds code that cannot import the package. The decorator form stays an unextracted representation.
- **Bindings are optional, plural, and may reference a design** (MD-37) — `spec:decisions.anchor-binding-grain`: `satisfies` is optional and plural, `verifies` is plural, `references` names a design the code answers to without realizing it, and every target names a whole Spec.
- **Architectural significance is annotated where it is realized** (MD-38) — `spec:decisions.architectural-annotation`: `component`, `uses` and `role`, plus `layer` and `context` on a component anchor. None of them confers a delivery fact, and an anchor-required lint stays optional and warn-level.
- **Binding, never liveness** (MD-7) — `spec:decisions.binding-not-liveness`: a test anchor records that a verifier exists, never that it ran; pass and fail stay in CI.
- **Oracle targets** — `spec:validation.oracle-target-eligibility`: an example space has zero or one resolving oracle, and consumers fail closed.
- **How to write one** — the `sdp-authoring` skill, "Bind code, tests, and oracles".

One point no Spec states, kept here: anchors are framework-neutral. An anchor binds any class, function, route or module, however the runtime is wired, so binding code never needs the framework's composition (§3).

---

## 3. Runtime bindings are framework-neutral (CORE) — deep extraction is ASPIRATIONAL

The MVP records runtime bindings *generically*: **anchors** name routes/handlers by ID (the `runtime` section is gone), and that is enough to derive `impl/route → satisfies → spec` edges (anchored — code → spec). The MVP does **not** read framework composition.

> The only **Principle** in this area is **one runtime truth**: do not run two composition mechanisms as first-class, or the extracted architecture sub-graph becomes unreliable. *Which* mechanism a team uses (Effect Layers, Awilix, a manual factory) is a pure Representation, read later by a framework-specific adapter.

**Explicitly aspirational, and not in the core narrative:** Effect `Layer`/`provides`/`requires` extraction with `R`-parameter completeness analysis, Awilix `defineRegistrations` deep wiring, Fastify plugin trees and request-scope modelling, and any Awilix→Effect migration path. *"Complexities like Effect Layers + Awilix are definitely not required."* These slot in as adapters later without changing anything in the core model.

---

## 4. Gherkin and harnesses — the executable half landed, the surfaces named

The **carrier-independent executable machinery is landed (CORE)**; what stays deferred is named per surface below. The landed half — identical under whichever richer surface arrives, so none of it waits on one:

- **Generated contracts.** `sdp build` emits a per-example **step contract** (the literal-union module a test binds handlers against — spec-side drift is a compile error naming the exact step) and a per-parent **space contract** (the typed dimensions of the example space · every child's bound point · the Outcome union derived from the parent's Then vocabulary). Both derive from the extracted graph, never the evaluated spec module (one validation path, MD-14), and a test may import them *because* they are projections — never the authored spec.
- **The typed example space.** A parent spec's `exampleSpace` declares the parameter-slot vocabulary its steps use (typically a `behavior` spec; any kind may own the space when the vocabulary parameterizes its own law); each `example` child binds one **point** (point-per-example, MD-17 — a table of cases is authoring-surface sugar). The **concreteness law** is one structural cell in the example kind's `defined` floor: an unbound slot in a used step caps the example below `defined`.
- **The oracle.** The authored expected-outcome semantics for a parent's example space — implementation-side, beside the tests, bound by the `specOracle` anchor (§2), never extracted. Typed against the generated space contract on both sides: a renamed slot fails to compile, claiming an outcome the specs never stated is a `tsc` error, and `unspecified` is a first-class answer.
- **The execution half.** The framework-neutral `/runner` core plus the `/vitest` adapter subpath (vitest an optional peer of the adapter alone); failure messages render in the spec's own language.

### Annotated Gherkin (RULED AND REALIZED)

`.sdp.gherkin` files with graph-aware syntax are an equal-canonicity surface for behavior and example Specs, for teams that prefer BDD. The suffix is canonical and collision-safe; it is not a Cucumber execution path. Bare `.feature` stays non-canonical import-source territory (MD-28) and is never discovered beside a Protocol corpus. Markdown remains the default under the carrier ruling (MD-18); the Gherkin carrier option (MD-27), realized by `spec:carrier.gherkin-authoring`, re-points the formerly declined contender as a lawful per-ID option for those two kinds only. Each ID still has one canonical surface with no mixing, and the syntax maps onto the existing envelope, sections, relations, and notation rather than creating a parallel lifecycle or tag registry. Execution stays behind the generated contracts and anchored code-side handlers above: the machinery is carrier-independent by construction.

Consumers associate `*.sdp.gherkin` with Gherkin in the editor when they want highlighting or formatting. VS Code / Cursor use `files.associations` mapping `*.sdp.gherkin` to the `cucumber` language id (this repository ships `.vscode/settings.json`); other editors use their equivalent file-type association. No second grammar ships with the package. Extraction always depends on the pinned runtime packages `@cucumber/gherkin@42.0.1` and `@cucumber/messages@34.2.1`, installed with `@libar-dev/software-delivery-protocol` even for Markdown-only consumers. Do not add a parallel parser, and do not expect those dependencies to load lazily.

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

Specs are not separate from code — they are part of the codebase, committed alongside it. That is the whole point: the repo is the single source of truth (P1), and authoring is editing the canonical carrier + git — Markdown or TypeScript per ID (the MVP write path).
