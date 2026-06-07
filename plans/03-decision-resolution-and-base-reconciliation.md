# Session 3 (next) — Decision Resolution & Base Reconciliation (the grilling agenda)

> **Status: PLAN-ONLY · the agenda for a FRESH grilling session.** This document collects the open
> decisions that the post-Session-1 review surfaced and frames them for resolution **against the
> ratified base** (`docs/concept/ubiquitous-language.md`), in dependency order. It deliberately does
> **not** pre-resolve them — that is the grilling session's job.
> **Date:** 2026-06-07 · **Branch:** `feature/mvp-init` · **Repo state:** Session 1 + the Phase-0
> hardening **Wave A** committed and green (see `plans/02-phase0-hardening.md`).
>
> **Why this exists.** Splitting the post-Session-1 work into three homes was the unlock: the
> *execution* of the decision-free fixes lives in plan 02 (Wave A, done); the *decisions* those fixes'
> siblings depend on live **here**; the concept-wording and roadmap items were routed to
> `docs/concept` (see §4, §6). This separation is what lets the decision work happen in a clean,
> fresh session rather than tangled into an execution diff.
>
> **Absorbed review.** This agenda absorbs the **post-split adversarial review** (a fresh-session report,
> archived in gitignored `.tmp-scratch/04-post-split-adversarial-review.md`; its durable findings are
> folded here so they survive in tracked form). Its highest-value contribution is **D7** (the kind-blind
> floor forces the example to pad); it also **widens D2** (F5), adds **D8** (the `.spec.ts` collision),
> proposes **R3** (F6), and assesses several items as **resolvable now** (§3a).

---

## §0 — Why a separate, fresh session (not a continuation)

- **Grilling needs a fresh context.** Resolving these decisions well means stress-testing each against
  the ratified language with full attention — the `grill-with-docs` discipline (challenge the plan
  against the domain model, sharpen terminology, update `docs/concept` + `DECISIONS.md` inline as
  decisions crystallise). A fresh session is a hard requirement for that.
- **This is design-on-the-base, not coding.** The pivotal decision (D1) *looks* like a TypeScript
  choice but is a **representation of base §2/§3**. It must be settled on the base first; the types are
  then a faithful projection, not a fresh source of truth.

## §1 — The method (base-first, not code-first)

The standing trap: typing a section in code *before* its canonical shape is settled in the base bakes
any drift into the type system, where it is expensive to move. So the method is strict:

1. **Settle the canonical section shapes on the base** (§2/§3 of `ubiquitous-language.md`): what fields
   each floor/extractor-bearing section *has*, and which are required by which readiness floor (P7:
   *types describe shape; validators decide completeness*).
2. **Reconcile wording** (R1/R2, §4) against the base in the same pass — terminology is ratified, so we
   ratify changes, never silently edit.
3. **Record the decision** in `DECISIONS.md` (an `MD-8` / D-series entry with rationale).
4. **Only then** does plan 02's Wave B type the code as a projection of the now-settled base.

Corollary (the §0 anti-bloat thesis, carried from plan 02): every resolution must **shrink the
contract or hold it flat**, never grow it. A readiness floor is *a floor to clear, never a quota to
fill* — type sections to give authors guardrails + autocomplete, not to train them to pad specs.

## §2 — The root tension (carried from plan 02 §2 — the driver behind D1–D3)

`src/model/sections.ts` types every section as `Record<string, unknown>`. The base (**L9**, `02` §3)
intends **typed-but-optional** sections. Open bags collapse "optional" into "unknown," at three costs:

1. **The tracer bullet proves less than it claims** — the example typechecks against `unknown`, so
   "it compiles" says nothing about the DSL capturing section *shape* (the session's headline goal).
2. **The authoring-shape honesty check is bypassable** — `behavior: { "has-verifier": true }`
   typechecks today and no validator catches it (verified; locked by a gated H8 fixture in plan 02).
3. **Validators string-probe at runtime** (`spec.behavior.given`, `spec.intent.outcome`); a typo in a
   section field name silently passes the floor.

> **The headline forward risk is authoring ergonomics, not graph theory.** If authoring feels heavy,
> authors (human **and** agent) avoid the system or overfit specs to satisfy tooling. Untyped sections
> give no autocomplete and no shape guardrails — the heavy-authoring loop. (H1 was the first symptom in
> the repo: an agent reached for `Object.fromEntries(...) as Record<string, unknown>` instead of a
> plain literal — fixed in Wave A.) So typing the floor-bearing sections is both the honesty fix **and**
> the single highest-value adoption lever. This is why §4c routes "authoring ergonomics" to `07` as a
> named Slice-2 concern.

## §3 — Open decisions, in dependency order

```
D2 (behavior.rules: prose vs ref list?)  ──┐
canonical section shapes (base §2/§3)    ──┴──►  D1 (type which sections, how)
                                                   │
                         ┌─────────────────────────┼───────────────────────────────┐
                       D3 (collapse floor)   H2/H3 field shapes   H8 gated fixtures flip active
D4 (AuthoredModel vs the one graph) — write a direction now, execute at Slice 1/3
D6 (generic-anchor DSL shape) — base-determined; record as decided (§3a)
D7 (kind-aware `defined` floor) — sequences with D1; de-pads the example    ← review F1
D8 (.spec.ts file-extension collision) — Representation-level; before adopters  ← review 1.3
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
  relations to promoted specs, or typed ref lists with referential-integrity coverage. Must resolve
  before `behavior` is typed (D1), or typing it ossifies whichever shape the first author happened to
  pick.

### D1 — how much to type sections now (the linchpin)
- **Recommendation (carried, to ratify or revise):** type the **five sections the floors and the
  extractor depend on** — `intent`, `behavior`, `constraints`, `model`, `verification` — and leave
  `design` / `decision` / `ui` as open bags so the unsettled surfaces keep breathing. This closes the
  honesty bypass for object literals and gives authors guardrails, without over-committing volatile
  surfaces.
- **Alternatives to weigh:** type all eight now; or type none and add a runtime authoring-shape
  validator instead.
- **Unblocks:** H3 (`constraints[]` shape), H2 (open-questions home), H4 (section-ref integrity), the
  gated H8 fixture `invalid-hand-authored-delivery-fact-in-section`, and the H9 in-section note.

### D3 — collapse direction for the floor validator (depends on D1)
- **Tension.** `validators.ts` is 453 lines for three checks; clause ids are enumerated in **four**
  places and `authoredPaths` in the floor data is **decorative** (read only by its declaration + tests,
  never by the evaluator — verified).
- **Recommendation (carried):** make the **table the single source of truth** — the evaluator reads
  `authoredPaths` + a few generic predicates (safe once sections are typed), killing the 4×
  enumeration. Alternative: shrink the table, let the evaluator be the spec.

### D7 — make the `defined` floor kind-aware (highest-value resolvable item · review F1) **[NEW]**
- **Finding (currently unowned by D1–D6).** The `defined` floor requires `rules-and-or-examples` for
  **every** kind (`readiness-floor.ts`); overlays only *add* requirements, never *relax* the base. So a
  `decision` / `model` / `constraint` / `contract` / `workflow` spec cannot reach `defined` on its
  *natural* content — and the tracer bullet pads three specs with throwaway `behavior.rules` purely to
  clear the floor (`order-lifecycle`, `order-model`, `order-latency-constraint`), which
  `checkout-v1.test.ts` then asserts is green. The canonical example embodies the exact anti-pattern
  **P4's anti-padding corollary forbids**, and an AI author will learn to sprinkle `behavior.rules` onto
  decision records.
- **Proof it is a bug, not taste.** At `scoped` the evidence clause is
  `rules-examples-or-**constraints**` (constraints alone are valid evidence); at `defined` it silently
  drops `constraints` → `rules-and-or-examples`. The maturity ladder is **non-monotonic in the evidence
  it accepts** — a constraint honestly `scoped` on its target suddenly needs behavior content to mature
  to `defined`. This half-delivers the `02`/P8 "kind is a true subtype that *changes* required detail"
  promise: at the floor level `kind` only ever *adds*.
- **Resolution (shrinks the contract).** Make the `defined` evidence clause **defer to the kind**: for a
  kind with an overlay (constraint→target, model→terms, example→GWT) or a natural truth section
  (decision→`decision`), that overlay/section *is* the evidence; require `rules-and-or-examples` only for
  the behavior-family kinds (`behavior`, `rule`, `workflow`). The overlay machinery already exists — this
  is "base evidence clause is kind-conditional," not new infrastructure. Sequences with D1 (typed
  sections make the predicate cheap).
- **Why here, not plan 02.** It is a base §6 refinement (the floor table is the model), so it moves
  *with* the base in the grilling pass — and resolving it de-pads the canonical example (drop three
  rules), a visible quality signal. Wave B then re-authors the example + the H8
  `invalid-defined-constraint-without-target` fixture (which itself currently pads — review §3.1).

### D4 — `AuthoredModel` seam vs the one graph (write a direction now; execute Slice 1/3)
- **Tension (P2).** Validators are designed to run over **the one graph** ("no consumer maintains a
  parallel model"). When the extractor lands, either (a) validators migrate to consume `GraphSchema`
  and `AuthoredModel` retires, or (b) `AuthoredModel` stays as an explicit, documented *pre-graph
  authoring lint*. Avoid two validation code paths drifting apart.
- **Action:** decide the **direction** in this session even though execution is Slice 1/3.

### D6 — generic-anchor DSL shape (decide now; pairs with Slice-2 anchor extraction)
- **Tension.** The whole point of *generic* anchors is binding **any** code location, but the builders
  are namespace-locked (`anchorImplementation` → `impl:`, `specTest` → `test:`). Generic binding
  implies the `satisfies` anchor should accept the implementation-flavored code namespaces
  (`impl` / `api` / `component`); `api:` already parses in `ids.ts` — only a builder + branded id is
  missing.
- **Decide:** generalize `anchorImplementation` to a `codeAnchor` over those namespaces, or add sibling
  builders. (The example gap this exposes — H10 — is owned by plan 02, executed at Slice 2.)

### D8 — the `.spec.ts` file-extension collision (Representation-level; currently implicit · review 1.3) **[NEW]**
- **Finding.** The extractor reads `/specs/**/*.spec.ts` (`03`/`04` §5), but `*.spec.ts` is *the* default
  test glob for Vitest/Jest/Mocha. This repo dodges it (`vitest.config.ts` narrows to
  `test/**/*.test.ts`), but a **consuming** project using the standard `**/*.spec.ts` for its tests will
  have its runner try to execute Spec-primitive files as test suites — a baffling failure for a new
  adopter. The model name `Spec` is well-chosen and stays; only the *file serialization* inherits foreign
  semantics (the test runner stands in for one of the three readers).
- **Decide (before any real adopter):** keep `.spec.ts` with a documented test-glob exclusion, or move to
  a collision-free extension (`.sdp.ts`, `.spec.sdp.ts`). Representation-level, not a model change.

## §3a — Review-assessed: resolvable now (fast-track, don't re-litigate)

The post-split adversarial review judged four items **already determined by the base** — they need
ratification, not deliberation. Recorded so the grilling session spends its energy on the genuinely open
D1 / D2 / D3 / D4 / D7 / D8:
- **R1, R2** (and **R3**, §4) — explicitly "code already conforms; wording tightening." Zero reversal
  risk; ratify and apply to the base, don't grill.
- **H2 *direction*** — the open-questions home is unambiguously `intent.openQuestions` (`02` §3 + the
  `04` worked example). The *fix* (read from `intent.openQuestions`) is correct **regardless of D1**; D1
  only shortens the predicate. Decouple it: H2 can be fixed and its gated H8 fixture flipped without
  waiting on the typed-sections grill (execution still lands in plan 02 Wave B).
- **D6** — anchors are *generic* by definition; `ids.ts` already parses `api:` / `component:`; only a
  builder + branded id is missing. Record `codeAnchor` over `impl` / `api` / `component` as **decided**
  (sibling-builders alternative noted and rejected for surface bloat).

**Does anything need *reversing*?** The review's answer: **no load-bearing bet** (one-primitive model,
authored/derived `claim` boundary, checked-never-gated, git-as-event-log, agent-surface) needs reversal.
Only refinements: D7 (floor kind-blindness), D8 (`.spec.ts`), and the R-series doc reconciliations — the
recurring shape being *the code is more honest than the docs; reconcile the docs down to it*.

## §4 — Concept-base refinements to ratify (R1, R2, R3)

Recorded as **PROPOSED** in `docs/concept/DECISIONS.md` (the code already conforms in all three cases;
these are wording tightenings, so we flag rather than silently edit the ratified base). Ratify and apply
them to the base in this session:

- **R1** — harmonize "anchor carries identity only" (§2) with "anchored = a human binding" (§4).
- **R2** — "no consumer reads source directly" → permit source *links* recorded in the graph, forbid
  independent re-parsing.
- **R3** (review F6) — reconcile `04`'s `specTest` signature to **binding-only**. `04` §2 documents
  `specTest(id, { verifies, run })` with an executing `run` callback; the code (`anchors.ts`) is
  identity-only (`{ id, label?, verifies }`, **no `run`**), and the code is *more* correct — a binding
  carrying `run` would couple the graph binding to execution, contradicting "records that an enabled
  verifier exists, never that it ran" (MD-7). Doc fidelity bug; reconcile the doc down to the code.

## §5 — What this session unblocks (the Wave-B execution backlog, owned by plan 02)

Once D1–D3 (and D2) land and the base is reconciled, plan 02's **Wave B** becomes execution-ready:
H3 (`constraints[]`), H2 (open-questions → `intent.openQuestions`), H5/D3 (collapse the floor
validator), H4 (section-ref referential integrity, likely folded into the Slice-1 extractor), and the
two gated H8 fixtures flip from `it.todo` to active. H10 (the api/route anchor in the example) executes
with Slice-2 anchor extraction under the D6 shape.

## §6 — Definition of done for this session

- **D1, D2, D3, D4, D6, D7, D8 resolved** and recorded in `DECISIONS.md` (rationale + what each
  unblocks); the §3a fast-track items (R1/R2/R3, H2-direction, D6) ratified with minimal litigation.
- **Base §2/§3 and §6 reconciled** to the resolved section shapes + the kind-aware `defined` floor (D7);
  **R1/R2/R3 ratified** and applied to the base.
- **Plan 02 Wave B rewritten execution-ready** with the now-locked field shapes (no ⊳ markers left),
  including the example de-padding that D7 unlocks.
- No code changed in this session (it is PLAN-ONLY); the code follows in the Wave-B execution session.
