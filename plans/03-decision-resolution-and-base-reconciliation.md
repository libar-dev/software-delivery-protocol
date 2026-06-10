# The grilling agenda — Decision Resolution & Base Reconciliation

> **Status: ✅ EXECUTED 2026-06-10 — the grill ran; all six decisions resolved and ratified (MD-10…MD-15).**
> The base was reconciled inline (`02`/`03`/`04`/`05` + the glossary), and `plans/02` Wave B was rewritten
> execution-ready. This document is kept as the agenda-of-record; the resolutions live in
> `docs/concept/DECISIONS.md`. **Date:** 2026-06-07 · slimmed 2026-06-10 (pre-grill folds) · **grilled
> 2026-06-10** · **Branch:** `feature/mvp-init`.
>
> | Handle | Resolution | Recorded |
> |---|---|---|
> | **D2** | `behavior.rules`/`examples` carry **content only** (prose / structured GWT, maturing in place); linkage lives in relations; promotion is exclusive | **MD-10** |
> | **D1** | **The typing law**: every floor-bearing section is closed-typed — six today (`intent`, `behavior`, `constraints[]`, `model`, `verification`, `decision`); `design`/`ui` stay open bags; `decision.status` rejected | **MD-11** |
> | **D7** | The floor's evidence clause is **kind-conditional at both `scoped` and `defined`** (present → complete); the overlay mechanism dissolves into the per-kind table; `contract` interim = behavior-family row | **MD-12** |
> | **D3** | The floor **table is the single source of truth**: named predicates `(spec, model)`, derived clause-id union, one generic evaluator, no decorative metadata | **MD-13** |
> | **D4** | **One validation path** through the one graph (extract → graph → checks); `AuthoredModel` retires as a public seam (direction now; executes Slice 1/3) | **MD-14** |
> | **D8** | Spec files carry the **`.sdp.ts`** extension (collision-free with JS test-runner globs; the `.stories.tsx` pattern) | **MD-15** |
>
> **Folded out — do not re-litigate (the former §3a/§4).** The resolvable-now items left this agenda in the
> 2026-06-10 fold session: **R1/R2/R3** ratified and applied to the base, and two items recorded **ACCEPTED**
> in `DECISIONS.md` — the **generic-anchor DSL shape** (`codeAnchor` over `impl`/`api`/`component`, MD-8;
> execution rides Slice 2 / plan 02 H10) and the **open-questions canonical home** (`intent.openQuestions`,
> MD-9; execution stays plan 02 Wave B / H2). The source reviews are tracked in `reviews/`.

---

## §0 — Why a separate, fresh session (not a continuation)

- **Grilling needs a fresh context.** Resolving these decisions well means stress-testing each against the
  ratified language with full attention — the `grill-with-docs` discipline (challenge the plan against the
  domain model, sharpen terminology, update `docs/concept` + `DECISIONS.md` inline as decisions crystallise).
  A fresh session is a hard requirement for that.
- **This is design-on-the-base, not coding.** The pivotal decision (D1) *looks* like a TypeScript choice but
  is a **representation of the canonical section shapes** (`02` §1/§3). It must be settled on the base first;
  the types are then a faithful projection, not a fresh source of truth.

## §1 — The method (base-first, not code-first)

The standing trap: typing a section in code *before* its canonical shape is settled in the base bakes any
drift into the type system, where it is expensive to move. So the method is strict:

1. **Settle the canonical section shapes in the core model** (`02` §1/§3): what fields each
   floor/extractor-bearing section *has*, and which are required by which readiness floor (`05` §3) —
   P7: *types describe shape; validators decide completeness*.
2. **Reconcile wording in the same pass** — terminology is ratified (the glossary), so we ratify changes,
   never silently edit; the grill writes its edits into the design docs (`02`/`05`/`06`) and, for term
   changes, the glossary.
3. **Record each decision** in `DECISIONS.md` (an MD-series entry with rationale — lead with meaning, the
   D-handles below are session-local shorthand).
4. **Only then** does plan 02's Wave B type the code as a projection of the now-settled base.

Corollary (the anti-bloat thesis, carried from plan 02 §0): every resolution must **shrink the contract or
hold it flat**, never grow it. A readiness floor is *a floor to clear, never a quota to fill* — type sections
to give authors guardrails + autocomplete, not to train them to pad specs.

## §2 — The root tension (carried from plan 02 §2 — the driver behind D1–D3)

`src/model/sections.ts` types every section as `Record<string, unknown>`. The base (**L9**, `02` §3) intends
**typed-but-optional** sections. Open bags collapse "optional" into "unknown," at three costs:

1. **The tracer bullet proves less than it claims** — the example typechecks against `unknown`, so "it
   compiles" says nothing about the DSL capturing section *shape* (the session's headline goal).
2. **The authoring-shape honesty check is bypassable** — `behavior: { "has-verifier": true }` typechecks
   today and no validator catches it (verified; locked by a gated H8 fixture in plan 02).
3. **Validators string-probe at runtime** (`spec.behavior.given`, `spec.intent.outcome`); a typo in a section
   field name silently passes the floor.

> **The headline forward risk is authoring ergonomics, not graph theory.** If authoring feels heavy, authors
> (human **and** agent) avoid the system or overfit specs to satisfy tooling. Untyped sections give no
> autocomplete and no shape guardrails — the heavy-authoring loop. (H1 was the first symptom in the repo: an
> agent reached for `Object.fromEntries(...) as Record<string, unknown>` instead of a plain literal — fixed
> in Wave A.) So typing the floor-bearing sections is both the honesty fix **and** the single highest-value
> adoption lever. This is why `07` §6 names "authoring ergonomics" as a Slice-2 concern.

## §3 — The six open decisions, in dependency order

> Handle hygiene: D1–D8 below are the *open-decision* code-space used by plans 02/03 — **not** the legacy
> structural D1–D6 table in `DECISIONS.md`. D5 was never assigned; D6 (generic-anchor shape) was folded out
> as MD-8. In prose, lead with meaning.

```
D2 (prose vs refs in behavior.rules AND behavior.examples) ──┐
canonical section shapes (02 §1/§3)                         ──┴──►  D1 (type which sections, how)
                                                                      │
                              ┌───────────────────────────────────────┼──────────────────────────────┐
                            D3 (collapse floor)                H2/H3 field shapes              H8 gated fixtures flip active
D4 (AuthoredModel vs the one graph) — write a direction now, execute at Slice 1/3
D7 (kind-aware `defined` floor) — sequences with D1; de-pads the example
D8 (.spec.ts file-extension collision) — Representation-level; before adopters
```

### D2 — prose-vs-ref duality across `behavior.rules` AND `behavior.examples` (gates typing `behavior`)
- **Tension.** The docs model `behavior.rules` as **prose strings** and `examples` as refs; the example
  currently puts **refs** in `rules` *and* promotes the same rules to standalone `kind:"rule"` specs
  (`refines` create-order) — the linkage exists twice, once invisibly. **The same duality is live in
  `behavior.examples`** (review F5): `create-order.spec.ts` puts **refs** in `examples`, while
  `create-order-valid-cart.spec.ts` puts **prose** in `examples` *and also* carries structured
  `given/when/then` (the prose entry is redundant with its own GWT). So `behavior.examples` is used two
  incompatible ways in the same example.
- **Resolve** the inline-vs-promote duality (`02` §3 "Section ⟷ kind") for **both** fields: prose +
  relations to promoted specs, or typed ref lists with referential-integrity coverage. Must resolve before
  `behavior` is typed (D1), or typing it ossifies whichever shape the first author happened to pick.

### D1 — how much to type sections now (the linchpin)
- **Recommendation (carried, to ratify or revise):** type the **five sections the floors and the extractor
  depend on** — `intent`, `behavior`, `constraints`, `model`, `verification` — and leave `design` /
  `decision` / `ui` as open bags so the unsettled surfaces keep breathing. This closes the honesty bypass
  for object literals and gives authors guardrails, without over-committing volatile surfaces.
- **Alternatives to weigh:** type all eight now; or type none and add a runtime authoring-shape validator
  instead.
- **Unblocks:** H3 (`constraints[]` shape), H2 (open-questions execution — direction already decided, MD-9),
  H4 (section-ref integrity), the gated H8 fixture `invalid-hand-authored-delivery-fact-in-section`, and the
  H9 in-section note.

### D3 — collapse direction for the floor validator (depends on D1)
- **Tension.** `validators.ts` is 453 lines for three checks; clause ids are enumerated in **four** places
  and `authoredPaths` in the floor data is **decorative** (read only by its declaration + tests, never by
  the evaluator — verified).
- **Recommendation (carried):** make the **table the single source of truth** — the evaluator reads
  `authoredPaths` + a few generic predicates (safe once sections are typed), killing the 4× enumeration.
  Alternative: shrink the table, let the evaluator be the spec.

### D7 — make the `defined` floor kind-aware (highest-value item · review F1)
- **Finding.** The `defined` floor requires `rules-and-or-examples` for **every** kind
  (`readiness-floor.ts`); overlays only *add* requirements, never *relax* the base. So a `decision` /
  `model` / `constraint` / `contract` / `workflow` spec cannot reach `defined` on its *natural* content —
  and the tracer bullet pads three specs with throwaway `behavior.rules` purely to clear the floor
  (`order-lifecycle`, `order-model`, `order-latency-constraint`), which `checkout-v1.test.ts` then asserts
  is green. The canonical example embodies the exact anti-pattern **P4's anti-padding corollary forbids**,
  and an AI author will learn to sprinkle `behavior.rules` onto decision records.
- **Proof it is a bug, not taste.** At `scoped` the evidence clause is `rules-examples-or-**constraints**`
  (constraints alone are valid evidence); at `defined` it silently drops `constraints` →
  `rules-and-or-examples`. The maturity ladder is **non-monotonic in the evidence it accepts** — a
  constraint honestly `scoped` on its target suddenly needs behavior content to mature to `defined`. This
  half-delivers the `02`/P8 "kind is a true subtype that *changes* required detail" promise: at the floor
  level `kind` only ever *adds*.
- **Resolution (shrinks the contract).** Make the `defined` evidence clause **defer to the kind**: for a
  kind with an overlay (constraint→target, model→terms, example→GWT) or a natural truth section
  (decision→`decision`), that overlay/section *is* the evidence; require `rules-and-or-examples` only for
  the behavior-family kinds (`behavior`, `rule`, `workflow`). The overlay machinery already exists — this is
  "base evidence clause is kind-conditional," not new infrastructure. Sequences with D1 (typed sections make
  the predicate cheap).
- **Why here, not plan 02.** It is a refinement of the floor table — the model (`05` §3) — so it moves
  *with* the base in the grilling pass; and resolving it de-pads the canonical example (drop three rules), a
  visible quality signal. Wave B then re-authors the example + the H8
  `invalid-defined-constraint-without-target` fixture (which itself currently pads — review §3.1).

### D4 — `AuthoredModel` seam vs the one graph (write a direction now; execute Slice 1/3)
- **Tension (P2).** Validators are designed to run over **the one graph** ("no consumer maintains a parallel
  model"). When the extractor lands, either (a) validators migrate to consume `GraphSchema` and
  `AuthoredModel` retires, or (b) `AuthoredModel` stays as an explicit, documented *pre-graph authoring
  lint*. Avoid two validation code paths drifting apart. (Interacts with the crippled-graph gap strategy,
  `plans/04` §2.)
- **Action:** decide the **direction** in this session even though execution is Slice 1/3.

### D8 — the `.spec.ts` file-extension collision (Representation-level; currently implicit · review 1.3)
- **Finding.** The extractor reads `/specs/**/*.spec.ts` (`03`/`04` §5), but `*.spec.ts` is *the* default
  test glob for Vitest/Jest/Mocha. This repo dodges it (`vitest.config.ts` narrows to `test/**/*.test.ts`),
  but a **consuming** project using the standard `**/*.spec.ts` for its tests will have its runner try to
  execute Spec-primitive files as test suites — a baffling failure for a new adopter. The model name `Spec`
  is well-chosen and stays; only the *file serialization* inherits foreign semantics (the test runner stands
  in for one of the three readers).
- **Decide (before any real adopter):** keep `.spec.ts` with a documented test-glob exclusion, or move to a
  collision-free extension (`.sdp.ts`, `.spec.sdp.ts`). Representation-level, not a model change.

## §4 — What this session unblocks (the Wave-B execution backlog, owned by plan 02)

Once D1–D3 land and the base is reconciled, plan 02's **Wave B** becomes execution-ready: H3
(`constraints[]`), H2 (open-questions execution under MD-9), H5/D3 (collapse the floor validator), H4
(section-ref referential integrity, likely folded into the Slice-1 extractor), the example de-padding that D7
unlocks, and the two gated H8 fixtures flip from `it.todo` to active. H10 (the api/route anchor in the
example) executes with Slice-2 anchor extraction under the MD-8 `codeAnchor` shape.

## §5 — Definition of done for this session — ✅ ALL MET 2026-06-10

- ✅ **D1, D2, D3, D4, D7, D8 resolved** and recorded in `DECISIONS.md` as **MD-10…MD-15** (rationale + what
  each unblocks). The grill went two steps *past* the agenda where the evidence forced it: D7 covers
  **`scoped` too** (the kind-blind scoped clause was what the padding actually cleared), and D1 became a
  **criterion** ("floor-bearing ⟹ typed") rather than a list — which pulled `decision` into the typed set
  and rejected `decision.status` as FSM vocabulary.
- ✅ **The core model and floor reconciled**: `02` §2/§3 (duality laws, typing law, readiness comments,
  worked examples), `05` §2/§3 (one validation path; the two-part floor + per-kind evidence table),
  `04` §1/§5 + `00`/`03`/`jtbd-01` (content-only DSL example, `.sdp.ts`); term changes in the glossary
  (duality entry, `status` rejection, `.sdp.ts` resolution).
- ✅ **Plan 02 Wave B rewritten execution-ready** (locked shapes, de-padding, the `.sdp.ts` rename, the H4
  dissolution).
- ✅ No `src/`/`test/` code changed (PLAN-ONLY held); the only non-doc touches were the two H7 leftovers the
  session was asked to finalize (`.sisyphus/` untracked; `package.json` description + Apache-2.0).
