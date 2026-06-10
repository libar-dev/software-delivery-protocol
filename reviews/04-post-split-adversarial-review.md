I've now absorbed the full concept (README + `00`–`07` + ubiquitous-language + DECISIONS), the three plans, and read every Phase-0 source file, the tracer-bullet example, and the test suites. Here is my adversarial review — feedback only, no repo changes made.

---

## Overall read

This is unusually disciplined work. The concept is internally coherent to a degree I rarely see: the principle/representation split, the CORE/ASPIRATIONAL split, the authored/derived (`claim`) boundary, and the "checked, never workflow-gated" guardrail are applied *consistently* across nine documents and then faithfully projected into types. The DECISIONS.md ↔ ubiquitous-language.md separation, and the three-way split of the hardening plan, are themselves a clean application of the Protocol's own thesis (review in context, never mid-edit). The code is honest about its own seams (`deferredInSession1`, the `it.todo` stubs, the H9 `@ts-expect-error` notes that *call out* the bypass they don't yet close).

So my job here is to push hard on the few places where the polish hides a real tension. I found one finding that I think is more important than anything currently on the D1–D6 / H-list, several smaller fidelity gaps, and a set of decisions that I believe are **already resolvable now** (which is exactly what you asked for in Split 3).

Let me organize by your three views, then end with the "what's resolvable / what might need reversing" answer you specifically asked for.

---

## View 1 — Holistic design: adversarial probes

The strengths are real and I won't pad the review by re-listing them. Four adversarial angles:

### 1.1 The tracer bullet proves materially less than the prose claims — and the gap is concentrated exactly on the marquee feature

Every spec in `checkout-v1` is at `readiness: "defined"`. **Nothing is `ready`.** That means the entire `ready` floor — the most complex floor, the one carrying the "honest readiness" differentiator — has *zero* live exercise. Worse, all three of its non-trivial clauses (`all-relations-resolve`, `depends-on-and-refines-targets-are-defined`, `anchors-resolve`) are `deferredInSession1: true`, so even the *data* for the headline check is inert and untested-as-behavior.

Combined with the fact that determinism (P3), the one-graph (P1/P2), and `claim`-never-collapsed (P9) are all unexercised until the extractor lands, the honest status is: **the trust model ships as types and prose, but the parts that make it falsifiable do not yet run.** This is *expected* at Slice 0 — but the docs (e.g. `07` "the entire trust model ships at MVP") read as if the guarantee is already load-bearing. I'd recommend the roadmap explicitly mark "the `ready` honesty path has no coverage until a spec in the example reaches `ready` AND the deferred clauses activate" as a named Slice-3 risk, and add at least one `ready` spec to the tracer bullet at that point. Right now a reader of `07` would overestimate what's proven.

### 1.2 "`kind` is a true subtype that changes required detail" is only half-delivered

`02`/P8 promise that `kind` behaves like a discriminated union — "changes required detail + validation." But the `05` §6 floor table implements `kind`-variation only as **additive overlays** (constraint→target, example→GWT, model→terms). The *base* `defined` floor requires `rules-and-or-examples` for **every** kind. So `kind` never *replaces* required detail; it only *adds*. This is the root of finding F1 in View 2 — and it means the discriminated-union framing is, at the floor level, aspirational. That's worth saying plainly in the base rather than letting the example paper over it.

### 1.3 `Spec` + `.spec.ts` collides head-on with the universal JS test-file convention — an adoption landmine

The extractor is specified to read `/specs/**/*.spec.ts` (`03` §"what the extractor reads", `04` §5). But `*.spec.ts` is *the* default test glob for Vitest/Jest/Mocha across the JS ecosystem. In *this* repo you've dodged it — `vitest.config.ts` narrows `include` to `["test/**/*.test.ts"]`, so the example's `.spec.ts` files aren't picked up. But a **consuming** project that uses the standard `**/*.spec.ts` for its tests (overwhelmingly common) will have its test runner try to execute Spec-primitive files as test suites. They'll either error or "pass" emptily, and the failure will be baffling to a new adopter.

This isn't reachable from inside the ratified language (the *name* `Spec` is well-chosen for the model), but the **file-extension representation** deserves a conscious decision before adoption: `.spec.ts` for the primitive vs. something collision-free (`.sdp.ts`, `.spec.sdp.ts`, a `specs/` dir excluded from the test glob by convention with documented setup). I'd flag this as a Representation-level decision that is currently implicit and risky.

`★ Insight ─────────────────────────────────────`
This is the classic "ubiquitous language wins the model but loses the toolchain" trap: the domain term (`Spec`) is correct, but its *serialization* (`.spec.ts`) inherits semantics from a foreign bounded context (the JS test runner). The Protocol's own principle — "carry epistemic status where it matters, unambiguous to all three readers" — argues for disambiguating the *file*, because one of the three readers (the test runner, a stand-in for CI tooling) already reads `.spec.ts` as "test."
`─────────────────────────────────────────────────`

### 1.4 Minor: the front-loaded design risks ossification, but the split discipline is the right antidote

A year of design before an engine is a real bet against learning-by-building. The mitigation you've chosen — keep the base ratified, route every new pressure through a *flagged* PROPOSED entry + a fresh grilling session rather than silent edits — is the correct one, and the R1/R2 handling proves it works. No action needed; I'm noting it so the bet is named.

---

## View 2 — Phase 0 implementation: adversarial code review

Fidelity is high and the trust-model boundaries hold (anchors identity-only and proven so by `@ts-expect-error`; delivery facts are derived-only types; `src/` is domain-neutral; the two-edge verifier semantics match `02`). The known items (H2 wrong section, H3 single-vs-array, H5 453-line/4×-enumeration, `authoredPaths` decorative) are all real — I confirmed each in the source. Below are the findings that are **new** (not on the H/D list), ordered by importance.

### F1 — The kind-blind `defined` floor forces the example to *pad*, violating P4's anti-padding rule (highest-value finding)

The `defined` floor requires `rules-and-or-examples` (`readiness-floor.ts:79`, enforced via `hasBehaviorRulesOrExamples` at `validators.ts:127`). There is **no** kind exemption — overlays add requirements, they never relax the base. Consequence: a `decision`, `model`, `constraint`, `contract`, or `workflow` spec cannot reach `defined` on its *natural* content. The tracer bullet demonstrates the workaround three times:

- `order-lifecycle.spec.ts` (`kind: decision`) — real content is in `decision: {…}`, but carries `behavior.rules: [...]` solely to clear the floor.
- `order-model.spec.ts` (`kind: model`) — real content is `model.terms`, but carries a meta-rule `behavior.rules: ["The authored slice uses shared term definitions instead of inlining conflicting vocabulary."]`.
- `order-latency-constraint.spec.ts` (`kind: constraint`) — real content is `constraints`, but carries `behavior.rules: ["The create-order path stays inside a machine-readable latency budget."]`, duplicating the constraint statement.

And `checkout-v1.test.ts:8` asserts `validateAuthoredModel(checkoutV1Model).findings` equals `[]` — so those padded rules are **load-bearing for the green build.** Remove any one of them and the floor fails. The canonical example of the Protocol therefore embodies the exact anti-pattern P4's corollary forbids ("padding a spec to 'fill a level' destroys signal… AI authors especially replicate the prevailing detail level even where it does not fit"). An AI author following this example will learn to sprinkle `behavior.rules` onto decision records.

There's a sharper internal inconsistency that proves it's a bug, not a taste call: at `scoped`, the evidence clause is `rules-examples-or-**constraints**` (`constraints` alone is valid evidence). At `defined`, the clause silently drops `constraints` and becomes `rules-and-or-examples`. So a constraint spec can be honestly `scoped` on its target, but maturing it to `defined` suddenly demands behavior content it structurally doesn't have. The maturity ladder is not monotonic in the evidence it accepts.

**This is resolvable now and is not owned by any current decision.** The fix is to make the `defined` evidence clause *defer to the kind*: for a kind that has an overlay (constraint→target, model→terms, example→GWT) or a natural truth section (decision→`decision`), the overlay/section *is* the evidence; require `rules-and-or-examples` only for the behavior-family kinds (`behavior`, `rule`, `workflow`). The overlay machinery already exists — the change is "base evidence clause is kind-conditional," not new infrastructure. I'd add this as a first-class item to `plans/03` (it's a base §6 refinement, so it belongs in the grilling pass, and it shrinks the contract by removing the cross-kind padding pressure). See View 3.3.

### F2 — `ref` is a spec-only brand wearing a generic name

`ids.ts:141`: `export { specId as ref }`. So `ref("...")` requires the `spec:` namespace and brands `SpecId`. It reads as "a reference to anything," but it can't reference a `pack:` or a `doc:`. Today every call site happens to want a spec, so it's harmless — but it's a latent trap for the agent-author audience (the docs lean on `ref()` heavily). At minimum the name deserves a doc note ("`ref` = a spec reference"); better, when `doc:`-target relations (`decidedBy` to an external ADR) or pack-targeting needs arrive, `ref` will quietly reject them with a confusing namespace error.

### F3 — `validateAuthoredModel` mislabels its aggregate `family`

`validators.ts:445` returns the composed report with `family: "conformance"`, but it folds in `validateReadinessFloors` findings, which are `honesty`. Individual findings carry the correct family, so nothing downstream is *wrong* yet — but the top-level `family` on the aggregate report is dishonest by the Protocol's own standard (the two families are a load-bearing distinction in `05` §1). Either the aggregate shouldn't carry a single `family`, or it should be a neutral value. Small, but this codebase holds itself to "don't let one kind masquerade as another," so it's worth fixing for consistency.

### F4 — `modelRefs` referential check doesn't enforce `kind:"model"`

`02` §3 and `05` §4 both state `modelRefs` on a `Pack` "always points at standalone `kind:"model"` specs." `validateDanglingReferences` (`validators.ts:399`) only checks that each `modelRef` resolves to *some* spec — a `modelRef` pointing at a `behavior` spec passes. This is a coherence gap that the base explicitly claims is closed. Probably Slice-1/3 territory (needs the graph), but it should be named; today the prose over-promises relative to the check.

### F5 — D2's prose-vs-ref ambiguity also infects `behavior.examples`, but the plan scopes D2 only to `rules`

`plans/03` frames D2 narrowly as "`behavior.rules`: prose vs ref list." But the same unresolved duality is live in `behavior.examples` *right now*: `create-order.spec.ts:23` puts **refs** in `examples` (`[ref("spec:orders.create-order.valid-cart"), …]`), while `create-order-valid-cart.spec.ts:14` puts **prose** in `examples` (`["Valid cart becomes an order with the computed total."]`) *and also* carries structured `given/when/then`. So `behavior.examples` is used two incompatible ways in the same example, and the prose entry in the scenario is redundant with its own GWT. D2 must cover `examples` too, or typing `behavior` (D1) will bake in whichever shape the first author happened to pick. Recommend widening D2's statement in `plans/03` §3 to "the prose-vs-ref duality across `behavior.rules` **and** `behavior.examples`."

### F6 — `specTest` doc↔code divergence (the code is the more faithful one)

`04` §2 documents `specTest("test:…", { verifies, run: async () => {…} })` — a positional id plus a `run` callback that *executes* the test. The implementation (`anchors.ts:23`, used at `create-order.valid-cart.test.ts`) is a single identity-only object — `{ id, label?, verifies }`, **no `run`.** The code is *more* correct: a binding anchor that carried `run` would couple the graph binding to execution, which contradicts "the graph records that an enabled verifier exists, never that it ran" (`04` §2 itself, MD-7). So this is a **doc fidelity bug, not a code gap** — reconcile `04` to a binding-only `specTest` signature (this is a clean R-series candidate; the code already conforms, which is the R1/R2 pattern exactly).

### F7 — Note on the H9 envelope defense (not a defect, a caveat to record)

The `@ts-expect-error` proofs in `builders.typecheck.ts` that the `Spec` envelope rejects top-level `implemented`/`has-verifier` rely on TypeScript's **excess-property checking**, which only fires on object literals passed directly. Because P5 mandates inline literals, this is sound *in practice* — but the guarantee is "rejected for inline literals," not "rejected structurally." Worth one sentence in the test file so a future reader doesn't over-trust it (the in-section bypass note is already there; this is its envelope-level sibling).

---

## View 3 — the split (the meta-product), and the resolvable decisions

### 3.1 Split 1 (addressable & addressed) — the code review

The Wave-A landings are genuinely well-executed and I verified each holds: H1 (static literals — confirmed no `Object.fromEntries`/`as Record` anywhere in `examples/`), H6 (shebang only on the CLI entry), H8 (four active fixtures, each pinning one validator outcome via `validatorId`/`relatedId`), H9 (the compile-time honesty proofs). The `it.todo` seam is the right mechanism — it encodes the Wave-B target without baking current buggy behavior into a green test. One small thing: the H8 `invalid-defined-constraint-without-target` fixture *itself* pads the constraint with `behavior.rules` (`authored-model.fixtures.ts:112`) to isolate the target failure — which is more evidence for F1: even your fixture author had to pad to write the test.

### 3.2 Split 2 (decisions made) — is everything correctly filed?

The three-way split (code = reversible/test-gated; decisions = ratify-against-base; concept/roadmap = single-canonical-source) is the right structural move and I'd keep it. The `★ Insight` you wrote about "un-fusing the three work-kinds" is correct. My only filing critique is that **two items currently sitting in the "to be decided" pile (Split 3) don't actually need a grilling session** — they're already determined by the base. Moving them to "decided" is exactly the enrichment you asked for. See 3.3.

### 3.3 Split 3 (decisions to be made) — what is *already resolvable now*

You asked specifically: "if there are decisions which stick out as resolvable, that would be genuinely valuable feedback," and "hope no decisions will need reversing." Here's my honest answer.

**Resolvable now — promote from "to decide" → "decided" (low risk, base already determines them):**

1. **R1 and R2** — both are explicitly "the code already conforms; wording tightening." They are not model changes; they carry zero reversal risk. They don't need a *grilling* session, only ratification. I'd ratify them immediately and let the grilling session focus its energy on the genuinely open D1/D2/D3. (Keeping them queued behind a fresh session is over-process for a no-op-on-code change.)

2. **H2's *direction*** (open-questions canonical home = `intent.openQuestions`). The base is unambiguous: `02` §3 and the `04` worked example both put `openQuestions` under `intent`. The plan gates H2 on D1 — but that conflates two things. The *fix* (read from `intent.openQuestions` instead of `design`/`decision` at `validators.ts:200`) is correct **regardless of how sections get typed**; D1 only makes the predicate *shorter*. This is a faithfulness bug with a determined answer; it can be fixed and its gated H8 fixture flipped without waiting on the D1 grilling. Decouple it.

3. **D6 (generic-anchor DSL shape).** The base already forces the answer: anchors are *generic* by definition (`04` §2, P-level), `ids.ts` already parses `api:`/`component:`, and the only thing missing is a builder + branded id. "Generalize `anchorImplementation` into a `codeAnchor` over `impl`/`api`/`component`" is the base-implied shape, not an open choice. I'd record it as decided (with the trivial alternative — sibling builders — noted and rejected for surface bloat) rather than re-litigating it.

**New decision that *should* be on the agenda but isn't (the one that "sticks out"):**

4. **F1 — make the `defined` floor kind-aware.** This is the highest-value resolvable item and it's currently *unowned* by any of D1–D6 or H2–H10. It's a base §6 refinement (so it belongs in the grilling pass, not in a code-only diff), it directly serves the anti-padding thesis, and it *shrinks* the contract (removes the cross-kind behavior-padding pressure). Resolving it will also clean up the example (drop three padded `behavior.rules`) — which is a visible quality signal for the canonical tracer bullet. I'd add it to `plans/03` §3 as **D7**, sequenced with D1 (typed sections make the kind-conditional evidence clause cheap to express).

**Genuinely open — leave for the grilling session (correctly filed):** D1 (how much to type now), D2 (prose-vs-ref — *widened to include `examples`*, per F5), D3 (floor-validator collapse, depends on D1), D4 (`AuthoredModel` seam vs the one graph — this is a real architectural fork worth the deliberation).

**Does anything need *reversing*?** — Your honest answer: **no load-bearing bet needs reversal.** The one-primitive model, the authored/derived `claim` boundary, "checked never gated," git-as-event-log, and the agent-surface stance all hold up under adversarial pressure. What needs **refinement** (not reversal) is narrower:
- the §6 `defined` floor's kind-blindness (F1 / proposed D7) — a refinement of a representation, not a reversal of a principle;
- the `.spec.ts` file-extension convention (View 1.3) — a Representation-level reconsideration, the model name `Spec` stays;
- the `04` `specTest` signature (F6) — a doc reconciliation toward what the code already does.

`★ Insight ─────────────────────────────────────`
The pattern across F1, H2, and F6 is one signal: the *implementation* is currently more honest than the *base/docs* in several places (code conforms; prose over-claims). That's the inverse of the usual drift and it's a healthy sign — but it means the grilling session's real job is **reconciling docs down to the code's honesty**, not designing new behavior. R1/R2 already proved this is the dominant mode; F1 is the one exception where *both* the base and the code need to move together.
`─────────────────────────────────────────────────`

---

## The three things I'd act on first

1. **Add D7 to `plans/03`: kind-aware `defined` floor** (F1) — highest value, currently unowned, fixes the canonical example's padding, serves the anti-padding principle directly.
2. **Decouple/ratify the determined items** — R1, R2, H2-direction, and D6 don't need to wait on the D1 grilling; promoting them shrinks the open-decision surface so the grilling session concentrates on D1/D2/D3/D4.
3. **Make a conscious call on `.spec.ts`** before any real adopter hits the test-runner glob collision, and widen D2 to cover `behavior.examples` (F5) so typing `behavior` doesn't ossify the wrong shape.

Everything else (F3, F4, F6, F7, the `ref` naming) is small and can ride the Wave-B execution session. Nothing I found undermines the foundation — the work is strong, and the few real cracks are all the kind you can fix while the cement is still wet.