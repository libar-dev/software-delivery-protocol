# Phase 0 Hardening — Fidelity & Simplification Pass (post-Session-1)

> **Status: EXECUTION · Wave A done · Wave B EXECUTION-READY (unblocked 2026-06-10 — the grill resolved
> all gates, MD-10…MD-15).** This is the **code hardening** half of the post-Session-1 review — fidelity
> corrections and net complexity reductions on the already-implemented Phase 0. The decisions these fixes'
> siblings depend on, the concept-base wording tightenings, and the roadmap acceptance criteria were
> **split out of this plan** into their proper homes (see "Where the rest went," below).
> **Date:** 2026-06-07 · **Branch:** `feature/mvp-init` · **Repo state:** Session 1 (`eb6bf2a`) + Wave A
> green (`npm run check`: typecheck ×2, lint, format, **47 tests + 2 todo**, build).
> **2026-06-10 folds:** R1/R2/R3 ratified & applied; MD-8 (`codeAnchor`) and MD-9 (`intent.openQuestions`)
> recorded decided. **2026-06-10 grill:** D1/D2/D3/D4/D7/D8 resolved as **MD-10…MD-15** — §4 below is
> rewritten execution-ready against them; run it as the next code session.

This plan covers the gap between *"Slice 0 is green"* and *"Slice 0 is a faithful, lean foundation the
extractor can safely build on."* It stays inside the Slice 0 boundary — **no extractor, no graph
emission, no graph gate** — except where a fix must be *designed now* so the extractor (Slice 1)
doesn't inherit a landmine.

**Where the rest went (the re-home).** This plan was originally one document fusing three kinds of work;
they now live where each gets the right rigor:
- **Open decisions** → `plans/03-decision-resolution-and-base-reconciliation.md` — the grilling agenda,
  now slimmed to the six genuinely-open (D1–D4, D7, D8). Wave B's typed-section fixes are **blocked on
  D1/D2/D3**; the former D6 (anchor shape) was folded out as **decided** (DECISIONS MD-8).
- **Concept-base wording (R1, R2, R3)** → `docs/concept/DECISIONS.md` — **ratified & applied 2026-06-10**
  in the pre-grill folds.
- **Forward-looking acceptance criteria** → `docs/concept/07` §6 (mapped across Slices 1–5).

---

## §0 — Framing commitments (carried from `AGENTS.md` + the founding-ideation review)

- **This is not over-perfection.** Every item is either (a) a divergence from the ratified base
  (`ubiquitous-language.md`, `02`, `04`, `05`) or (b) a *removal* of complexity that masks the design.
  General code-quality/type-coverage polish stays deferred ("let the design breathe").
- **Tracer-bullet discipline.** The example must keep forcing the DSL to be usable — and, from Slice 1
  on, must survive *static* extraction. H1 (done) was exactly where it would have broken that.
- **Phase 0 stays aggressively small.** *"Build the smallest executable conformance contract that Slice
  1 needs."* The standing test against every item: **does it shrink the contract or grow it?** A
  readiness floor is **a floor to clear, never a quota to fill** (`05` §3, P4).

## §1 — Baseline: what is correct and must not regress

- Trust-model boundaries intact: no extractor, no `graph.json`, no graph gate; delivery facts are
  **derived-only types**; anchors are **identity-only** (`@ts-expect-error` fixtures prove they reject
  readiness/intent/facts).
- `graph/schema.ts` faithful and inert: `nodeType` vs `specKind` split, `claim` on every node/edge,
  delivery facts on `PrimitiveNode`, authored vs derived edge types separated.
- IDs (`02` §5): grammar + branding only, namespace policy correctly deferred.
- Relations (`02` §6): direction + `claim:"declared"` exactly per the table; verb-form names correct.
- Core `src/` is domain-neutral (zero order/checkout names). The example's two-edge verifier semantics
  match `02` "Verifier semantics" precisely.
- `AuthoredModel` honestly fenced (doc-comment + `deferredInSession1` clauses).

**Regression gate:** `npm run check` stays green; all invariants above still hold.

## §2 — The root tension (drives the Wave-B fidelity fixes)

`src/model/sections.ts` types every section as `Record<string, unknown>`; the base (**L9**, `02` §3)
intends **typed-but-optional** sections. This was the linchpin — **resolved 2026-06-10**: MD-11 (the typing
law — floor-bearing sections are closed-typed; six today) on MD-10's content-only `behavior` shape. §4/B1
carries the locked field shapes.

---

## §3 — Wave A (decision-free) — ✅ DONE

Quick, contract-shrinking, reversible wins. All landed and verified; `npm run check` green.

### ✅ H1 — Make the example statically extractable (P5)
- **Was.** Both scenario specs built `behavior` via `Object.fromEntries([...]) as Record<string,
  unknown>` (+ a `thenKey` indirection) — not statically evaluable, so the Slice-1 `ts-morph` extractor
  (which reifies without executing, `04` §1) would silently drop the section and flip the `example`
  floor from valid → honesty violation.
- **Done.** Replaced both with plain static object literals.
- **Verified.** `grep -rn "Object.fromEntries\|thenKey\|as Record" examples/` → none; example typecheck
  + tests green.
- **Forward hook (DEFER, named).** Slice 1's "done" must include *the example survives static extraction
  byte-for-byte*; the `sdp/spec-static` lint rule (`04` §1) is the earlier backstop.

### ✅ H6 — Simplify the tsup build; stop leaking a shebang onto the library entry
- **Was.** `dist/index.js` started with `#!/usr/bin/env node` because `banner.js` applied to **all**
  entries, compensated by an esbuild strip-plugin + an `onSuccess` shebang-normalise hook.
- **Done.** Removed the banner, the strip-plugin, and the hook; rely on esbuild preserving the source
  shebang on the CLI **entry** only.
- **Verified.** `dist/index.js` first line is `// src/ids.ts` (no shebang); `dist/cli/sdp.js` has
  exactly one `#!/usr/bin/env node`; `node dist/cli/sdp.js --help` exits 0.

### ✅ H7 — Hygiene (`.prettierignore`)
- **Done.** Added `.tmp-scratch/**` to `.prettierignore` so `format:check` no longer trips on scratch.
- **Still open (low, optional).** Already-committed `.sisyphus/` files (from `eb6bf2a`) remain tracked
  despite the ignore; `git rm --cached .sisyphus` would untrack them if wanted. `package.json` lacks
  `description`/`license`/`repository` — note for the publish checklist. The `vitest-test.mjs` wrapper
  is optional ergonomics.

### ✅ H8 (active) — A should-fail / should-pass validator fixture suite (`05` §5)
- **Done.** `test/fixtures/authored-model.fixtures.ts` + `test/fixtures.test.ts` with the **active**
  (decision-free) fixtures, each pinning one validator outcome:
  - `valid-minimal-idea-spec` → passes.
  - `invalid-duplicate-id` → `conformance/duplicate-ids`.
  - `invalid-scoped-without-relation` → `honesty/readiness-floor` (`at-least-one-relation`).
  - `invalid-defined-constraint-without-target` → `honesty/readiness-floor`
    (`constraint-machine-readable-target`).
- **Gated stubs (inherited checklist, `it.todo`):** `invalid-ready-with-blocking-question` (flips active
  with **H2**) · `invalid-hand-authored-delivery-fact-in-section` (flips active with **D1**). The
  extractor-era fixtures (`invalid-non-static-id`, `invalid-non-static-section`,
  `invalid-hand-authored-satisfies-edge`, `invalid-ready-with-unresolved-dependency`,
  `invalid-ready-with-target-below-defined`) remain named for Slice 1+.

### ✅ H9 — Lock the type-level honesty defenses with compile-time fixtures
- **Done.** Added `@ts-expect-error` fixtures in `test/builders.typecheck.ts`: the `Spec` envelope
  rejects a top-level `implemented` / `has-verifier`; the `Pack` rejects `intent` / `readiness` /
  `constraints`. `npm run typecheck` consumes them (an unused directive would fail the build, so they
  *prove* the defenses fire).
- **Note (tracked with D1).** The **in-section** bypass (`behavior: { "has-verifier": true }`) is *not*
  closed by these — it is closed only by typing sections (D1, plan 03) and locked by the gated H8
  fixture.

---

## §4 — Wave B — ✅ UNBLOCKED 2026-06-10 (the grill resolved every gate: MD-10…MD-15) — EXECUTION-READY

One execution session, four steps in order; `npm run check` green after each. The decision pointers are
the contract — when a shape question comes up mid-execution, the MD entry wins, then the base (`02`/`05`).

### B1 — Type the six floor-bearing sections (MD-11 + MD-10; absorbs old H3)
- **`sections.ts`** — closed shapes (no index signature); fields optional per P7 (types describe shape,
  validators decide completeness):
  - `IntentSection { actor?; problem?; outcome?; value?; risks?: string[]; assumptions?: string[];
    openQuestions?: (string | { question: string; blocking?: boolean })[] }`
  - `BehaviorSection { rules?: string[]; examples?: (string | { given: string[]; when: string[];
    then: string[] })[]; flows?: string[] }` — **content only, never refs** (MD-10)
  - `constraints?: ConstraintSection[]` with `ConstraintSection { flavor?; statement: string; target?;
    measurableBy? }` — the array shape (old H3); **drop the validator's dual array/record handling**
  - `ModelSection { terms?: Record<string, string> }` (richer concepts stay deferred)
  - `VerificationSection { mode?: "manual" | "reviewed" | "contract" | "executable"; criteria?: string[] }`
  - `DecisionSection { context?: string; decision?: string; rationale?: string[]; alternatives?: string[];
    consequences?: string[] }` — **no `status`** (MD-11; rejected vocabulary)
  - `design` / `ui` stay open bags (`Record<string, unknown>`).
- **Verify:** the in-section honesty bypass `behavior: { "has-verifier": true }` now **fails to typecheck**
  — so the gated H8 fixture `invalid-hand-authored-delivery-fact-in-section` lands as a `@ts-expect-error`
  compile-time fixture beside the H9 set (not a runtime fixture); `order-latency-constraint` authors a
  constraints **array**.

### B2 — Rewrite the floor as the kind-conditional table (MD-12 + MD-13 + MD-9; absorbs old H2 + H5)
- **`readiness-floor.ts` becomes THE table**, mirroring `05` §3 row-for-row: kind-blind structural clauses
  + the per-kind evidence map (`scoped` = evidence *present*, `defined` = evidence *complete*). Rows carry
  `{ id, description, predicate }` — named predicates with a `(spec, model)` signature (promotion-neutrality
  needs the model: behavior-family evidence counts refining `rule`/`example` children and `constrainedBy`
  targets). The clause-id union is **derived** (`typeof`); delete the overlay mechanism, the hand-written
  `ReadinessClauseId` union, `toSupportedReadinessClauseId`, and decorative `authoredPaths`.
- **Old H2 lands inside this step** (MD-9): blocking open questions read from `intent.openQuestions` — the
  typed `IntentSection` makes the predicate a few lines. Flip the gated H8 fixture
  `invalid-ready-with-blocking-question` active: `intent.openQuestions: [{ blocking: true }]` stating
  `defined` **fails**; `blocking: false`/absent **passes**.
- The `example`-kind evidence reads **structured `behavior.examples` entries** (MD-10), not the flat
  `behavior.given/when/then` the Session-1 overlay probed.
- **Verify:** same outcomes for the non-padding fixtures; clause list defined exactly once; `model`- and
  `decision`-kind fixtures reach `scoped`/`defined` on natural content alone.

### B3 — De-pad and re-author the example (MD-10/11/12 — the visible quality signal)
- **Delete the throwaway `behavior.rules`** from `order-lifecycle`, `order-model`,
  `order-latency-constraint` — each now clears the floor on its natural evidence (`decision` section ·
  `model.terms` · `constraints.target`).
- **`create-order`**: drop both ref lists from `behavior` (the rules/examples children already
  `refines`/`verifies` it — promotion-neutral evidence); keep inline prose only if it states something no
  child does.
- **`create-order-valid-cart` / `-invalid-cart`**: drop the redundant prose `examples` entry; author the
  GWT as one **structured `examples` entry** (nested, per MD-10).
- **`order-lifecycle`**: drop `decision.status: "accepted"` (MD-11 — the adoption arc is `readiness`).
- **Re-author the H8 fixture `invalid-defined-constraint-without-target`** (it currently pads with
  `behavior.rules` itself) and re-assert `checkout-v1.test.ts` green on the de-padded example.

### B4 — The `.sdp.ts` rename (MD-15)
- `examples/checkout-v1/specs/**/*.spec.ts` → `*.sdp.ts`; `checkout.pack.ts` → `checkout.pack.sdp.ts`.
- Update `tsconfig.examples.json` includes and any glob that names `.spec.ts`; confirm vitest still sees
  only `test/**/*.test.ts` (the config narrowing stays, but is no longer load-bearing for the collision).

### Dissolved / re-homed by the grill
- **H4 (section-embedded ref integrity) is dissolved for `behavior`** (MD-10): refs cannot exist in
  sections, so there is nothing to check — the cheapest validator is the one a model rule makes
  unnecessary. What remains of H4 is only **F4** (`modelRefs` targets must be `kind:"model"`), which rides
  the Slice-1/3 graph validators under the one-path rule (MD-14).
- **H10 unchanged**: the api/route anchor rides Slice-2 anchor extraction under MD-8 `codeAnchor`.
- **`AuthoredModel`** needs no Wave-B work: it stays the honestly-fenced Session-1 stand-in until the
  extractor lands, then retires per MD-14 (Slice 1/3 — not this wave).

### Carried review backlog (post-split adversarial review · small, ride Wave B / Slice 1)

Captured so the signal survives — the review is tracked in `reviews/04-post-split-adversarial-review.md`.
None block the split; each is small, decision-free, or doc-level.
- **F2 — `ref` is a spec-only brand wearing a generic name.** `ids.ts` exports `specId as ref`, so
  `ref()` rejects `pack:` / `doc:` targets. Harmless today (every call site wants a spec); add a doc
  note, and revisit when `doc:`-target relations (`decidedBy` → external ADR) / pack-targeting arrive.
- **F3 — `validateAuthoredModel` mislabels its aggregate `family`.** It returns `family:"conformance"`
  but folds in `honesty` readiness-floor findings (individual findings carry the correct family). The two
  families are load-bearing (`05` §1); give the aggregate a neutral / no single family. Tiny.
- **F4 — `modelRefs` integrity doesn't enforce `kind:"model"`.** `02` §3 / `05` §4 say `modelRefs`
  "always points at standalone `kind:"model"` specs," but `validateDanglingReferences` only checks the
  ref *resolves*. Needs the kind — likely Slice-1/3 (graph) territory; named so prose doesn't
  over-promise vs. the check.
- **Cross-refs (owned elsewhere).** F1 → **D7** (plan 03, a floor-table refinement — `05` §3 — de-pads the
  example and the H8 constraint fixture in Wave B). F6 → **R3 — applied 2026-06-10** (Fold-B; `04` §2 is
  now binding-only). **H2's *direction* is decided** (MD-9: `intent.openQuestions`) — execution is
  decoupled from D1 and lands in Wave B. **F7 — DONE**: the H9 envelope-defense caveat (excess-property /
  inline-literal scope) is now recorded in `test/builders.typecheck.ts`.

---

## §5 — Explicitly out of scope (still deferred)

The `ts-morph` extractor · `graph.json` / graph emission · the graph-level validator gate ·
`--check-clean` · reader / views / Design Review · architecture rules · custom team rules · `--lenient`
· derived-readiness banner · runtime `observed` path · MCP surface · self-hosting the Protocol's own
repo. Typing of `design`/`ui` stays deferred per the typing law (MD-11 — they become typed when a floor
clause reads them); a dedicated `contract` section is a named deferral (MD-12).

## §6 — Sequencing

1. **Wave A** — ✅ done (H1, H6, H7, H8-active, H9).
2. **Pre-grill folds (2026-06-10)** — ✅ done: R1/R2/R3 ratified & applied; the anchor shape (MD-8) and the
   open-questions home (MD-9) recorded decided; `plans/03` slimmed to the six open decisions.
3. **Resolve decisions** — ✅ done (2026-06-10 grill): all six resolved and recorded as **MD-10…MD-15**;
   the base reconciled inline; H7's leftovers finalized (`.sisyphus/` untracked; `package.json`
   description + Apache-2.0).
4. **Wave B** — ← **NEXT** (the next code session): B1 (typed sections) → B2 (the floor table) → B3
   (de-pad + re-author the example) → B4 (the `.sdp.ts` rename); H10 rides Slice-2 anchor extraction.

**Done gate for Wave B:** the in-section honesty bypass (`behavior: { "has-verifier": true }`) **fails to
typecheck**, locked by a `@ts-expect-error` fixture; blocking open questions read from
`intent.openQuestions` with the H8 fixture active; `constraints` is a typed array (no dual-shape
validator); the floor is one kind-conditional table mirroring `05` §3, clause ids defined exactly once, no
decorative metadata; the example is **de-padded** (no `behavior.rules` on `decision`/`model`/`constraint`
specs, no section refs, no `decision.status`, GWT nested) and every spec file is `*.sdp.ts`; the example
still contains only static literals; `npm run check` green.
