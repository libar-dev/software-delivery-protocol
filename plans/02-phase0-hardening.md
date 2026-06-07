# Phase 0 Hardening — Fidelity & Simplification Pass (post-Session-1 review)

> **Status: DRAFT · iterating to implementation-ready.** This plan records the findings of the Session 1
> implementation review and turns them into actionable work items. It is **not** locked: several items carry an
> **open decision** (marked ⊳) that we will resolve together before this is execution-ready. Sequencing here is a
> first cut, not a contract.
> **Date:** 2026-06-07 · **Branch:** `feature/mvp-init` · **Repo state:** Session 1 committed (`eb6bf2a`); fully
> green (`npm run check`: typecheck ×2, lint, format, 43 tests, build).
>
> **Three perspectives layered.** (1) a *fresh* implementation review of the committed code; (2) the *planning
> session* that formed the pre-plan context before the first line of code, framed by the full MVP; (3) the
> *founding-ideation* review (the ChatGPT web session that seeded the project), framed by the **whole MVP scope**
> more than Session 1's. This revision absorbs (3): it confirms the concept spine, hard-reinforces the anti-bloat
> thesis, supplies a should-fail/should-pass fixture set that exercises these findings, and seeds forward-looking
> acceptance criteria + two concept-wording tightenings.

This plan covers the gap between *"Slice 0 is green"* and *"Slice 0 is a faithful, lean foundation the extractor
can safely build on."* It is a **hardening pass on the already-implemented Phase 0**, not new scope. It deliberately
stays inside the Slice 0 boundary — **no extractor, no graph emission, no graph gate** — except where a fix must be
*designed now* so the extractor (Slice 1) doesn't inherit a landmine.

---

## §0 — How this fits

Session 1 implemented Slice 0 (the protocol as typed code) + bootstrap + the `checkout-v1` tracer bullet, and it is
green and largely faithful to the ratified base. The review found a through-line of issues that are **fidelity
corrections and net complexity reductions**, not polish — so they belong *before* the design ossifies under the
extractor, while it is still cheap to move.

Three framing commitments carried from `AGENTS.md` (and reinforced by the founding-ideation review):

- **This is not over-perfection.** Every "now" item below is either (a) a divergence from the ratified base
  (`docs/concept/ubiquitous-language.md`, `02`, `04`, `05`) or (b) a *removal* of complexity that masks the design.
  General code-quality/type-coverage polish stays deferred per the working discipline ("let the design breathe").
- **Tracer-bullet discipline.** The example must keep forcing the DSL to be usable — and, from Slice 1 on, must
  survive *static* extraction. One finding (H1) is precisely where the current example would break that.
- **Phase 0 stays aggressively small.** The founding review's blunt warning: *"Do not build a beautiful protocol
  framework in Phase 0. Build the smallest executable conformance contract that Slice 1 needs."* Phase 0 is exactly
  the place scope quietly expands. This is the full-scope lens on H5 (the floor validator is already 453 lines for
  three checks) — and the standing test against every "now" item: does it shrink the contract or grow it?
  Corollary (`05` §3, P4): a readiness floor is **a floor to clear, never a quota to fill** — validators must make
  *dishonesty* fail without training authors or agents to pad specs with low-signal content.

---

## §1 — Baseline: what is correct and must not regress

Recorded so the hardening pass is measured against it:

- Trust-model boundaries intact: no extractor, no `graph.json`, no graph gate; delivery facts are **derived-only
  types**; anchors are **identity-only** (`@ts-expect-error` fixtures prove they reject readiness/intent/facts).
- `graph/schema.ts` is faithful and inert: `nodeType` vs `specKind` split (`03`/`05`), `claim` on every node/edge,
  delivery facts on `PrimitiveNode`, authored vs derived edge types separated.
- IDs (`02` §5): grammar + branding only, namespace policy correctly deferred.
- Relations (`02` §6): direction + `claim:"declared"` exactly per the table; verb-form names correct.
- Core `src/` is domain-neutral (zero order/checkout names). The example's two-edge verifier semantics (test
  `verifies` the example; example `verifies` the parent) match `02` "Verifier semantics" precisely.
- `AuthoredModel` is honestly fenced (doc-comment + `deferredInSession1` clauses).

**Regression gate for this pass:** `npm run check` stays green; all current invariants above still hold.

---

## §2 — The root tension (drives H2–H5)

`src/model/sections.ts:14-23` types every section as `Record<string, unknown>`. The ratified design (**L9**,
`02` §3) intends **typed-but-optional** sections; **P7** ("types describe *shape*; validators decide
*completeness*") governs *which fields are required*, not *whether fields are typed at all*. Open bags collapse
"optional" into "unknown," with three concrete costs:

1. **The tracer bullet proves less than it claims.** The example typechecks against `unknown`, so "it compiles"
   says nothing about the DSL capturing section *shape* — the session's headline goal.
2. **The authoring-shape honesty check (`05` #5) is bypassable.** Verified: the envelope rejects a top-level
   `implemented: true` (excess-property check), but `behavior: { "has-verifier": true }` **typechecks** — a
   hand-authored delivery fact hides one level down, and no validator catches it in Session 1.
3. **Validators must string-probe at runtime** (`spec.behavior.given`, `spec.intent.outcome`); a typo in a section
   field name silently passes the floor.

⊳ **Open decision D1 — how much to type now.** Recommendation: type the **five sections the floors and the
extractor depend on** — `intent`, `behavior`, `constraints`, `model`, `verification` — and leave `design` /
`decision` / `ui` as open bags so the unsettled surfaces keep breathing. This closes H2/H3/H4 and the honesty
bypass for object literals, without over-committing the volatile sections. (Alternatives: type all eight now; or
type none and add a runtime authoring-shape validator instead. To resolve.)

---

## §3 — Work items

Severity: 🔴 act before Slice 1 · 🟠 fidelity fix · 🟡 simplification · ⚪ hygiene.
Disposition: **NOW** (this pass) · **DEFER** (named, later).

### 🔴 H1 — Make the example statically extractable (P5) · **NOW**

- **Finding.** Both scenario specs build `behavior` via a runtime call:
  `examples/checkout-v1/specs/orders/create-order-valid-cart.spec.ts:5` and
  `…/create-order-invalid-cart.spec.ts:5` use `const thenKey = "then"` +
  `Object.fromEntries([...]) as Record<string, unknown>`.
- **Why it matters.** `04` §1 (the static-data constraint, P5): a spec file is "a JSON file that TypeScript happens
  to validate"; the Slice 1 `ts-morph` extractor **reifies without executing**. `Object.fromEntries(...)` cannot be
  statically evaluated. Per the two-tier rule, a non-static *section* is **silently dropped with a warning** (L3) —
  so under Slice 1 these scenarios lose their `given/when/then`, and the `example` readiness floor (which requires
  them at `defined`+) flips them from valid → honesty violation. The tracer bullet would mine the very extractor it
  exists to de-risk.
- **Verified root cause.** The dynamic form buys nothing: a plain object literal with a `then` key **lints clean
  (eslint exit 0)** and typechecks. The `thenKey`/`Object.fromEntries` indirection is gratuitous.
- **Change.** Replace both with plain static object literals (no `thenKey`, no `Object.fromEntries`).
- **Files.** the two scenario `*.spec.ts` only.
- **Verify.** `tsc --noEmit -p tsconfig.examples.json` green; `npm test` green; manual: no function calls remain in
  `examples/**/specs/**`.
- **Forward hook (DEFER, but name now).** Slice 1's "done" must include *the example survives static extraction
  byte-for-byte*; the `sdp/spec-static` lint rule (`04` §1) is the earlier backstop.

### 🟠 H2 — Honesty check points at the wrong section (blocking open questions) · **NOW**

- **Finding.** `src/validate/validators.ts:199-206` (`hasNoBlockingOpenQuestions`) and
  `src/validate/readiness-floor.ts:91,105` read `spec.design.openQuestions` / `spec.decision.openQuestions`. The
  canonical home is **`intent.openQuestions`** (`02` §3: "openQuestions may be flagged `blocking` to prevent stating
  a readiness past `defined`"; the `04` worked example puts it under `intent`). `design`/`decision` do not
  canonically carry open questions.
- **Impact.** A doc-following author who flags a `blocking` question in `intent.openQuestions` can still state
  `defined`/`ready` and the honesty check **won't fire** — the marquee differentiator aimed at the wrong target.
  (Note: the Session-1 pre-plan introduced this path; the implementation faithfully followed the plan. It is a
  plan↔concept drift to correct at the source.)
- **Change.** Read open questions from `intent.openQuestions`; update the floor data `authoredPaths` to match. With
  a typed `IntentSection` (D1) this predicate shrinks to a few lines.
- **Files.** `validators.ts`, `readiness-floor.ts`; tests in `test/readiness.test.ts` / `test/validators.test.ts`.
- **Verify.** New test: a spec with `intent.openQuestions:[{blocking:true}]` stating `defined` **fails**; with
  `blocking:false` (or absent) **passes**.

### 🟠 H3 — `constraints` must be an array, not a single object · **NOW**

- **Finding.** `src/model/sections.ts:18` types `constraints?: ConstraintsSection` (one `Record`); `02` §1
  specifies `constraints?: ConstraintSection[]`. A spec can be bounded by several NFRs (perf + security + …); a
  single object can't express that. `validators.ts:139-165` already defends against **both** array and record forms
  — a tell that the shape was unsettled.
- **Change.** `constraints?: ConstraintSection[]` (typed per D1: `{ flavor?, statement, target?, measurableBy? }`,
  all optional except where the floor requires). Update the example (`order-latency-constraint.spec.ts`) to author
  an array. **Simplify** the validator: drop the dual array/record handling — one shape only.
- **Files.** `sections.ts`, `order-latency-constraint.spec.ts`, `validators.ts`.
- **Verify.** `constraint` floor test still passes; validator no longer branches on `Array.isArray`.

### 🟠 H4 — Referential integrity is blind to section-embedded refs · **DECIDE (likely DEFER to Slice 1)**

- **Finding.** `validateDanglingReferences` (`validators.ts:363-414`) checks relations, pack members, `modelRefs`,
  anchors — but not refs inside sections. Yet `create-order.spec.ts:22-26` puts real refs there
  (`behavior.rules:[ref(...)]`, `behavior.examples:[ref(...)]`). A typo there escapes the check. `05` §2.1 wants
  *every* referenced ID to resolve.
- **Why deferred-ish.** Session 1's dangling-ref scope was explicitly relations/packs/anchors. The proper fix
  belongs with the extractor, which must know *structurally* where refs can live — impossible while sections are
  `unknown` (this is a direct consequence of §2). Typing `behavior` (D1) makes both the check and the extractor
  tractable.
- ⊳ **Open decision D2 — modeling of `behavior.rules`.** The docs model `behavior.rules` as **prose strings** and
  only `examples` as refs; the example currently puts refs in `rules` *and* promotes the same rules to standalone
  `kind:"rule"` specs (`refines` create-order) — the linkage exists twice, once invisibly. Resolve the
  inline-vs-promote duality (`02` §3 "Section ⟷ kind"): pick prose-in-`rules` + relations for the promoted specs,
  or a typed ref list with referential-integrity coverage. To resolve before typing `behavior`.
- **Change (when scheduled).** Extend referential integrity to typed ref-bearing section fields; align the example
  to the resolved D2.

### 🟡 H5 — Trim the readiness-floor validator (complexity masking a simple design) · **NOW (small)**

- **Finding.** `validators.ts` is 453 lines for three tiny checks. Duplicate-IDs and dangling-refs are clean (~50
  lines); the bulk is readiness-floor machinery with a **two-sources-of-truth** smell, verified:
  - Clause ids are enumerated in **four** places — the `readinessFloors` data (`readiness-floor.ts`), the
    `ReadinessClauseId` union (`validators.ts:22-36`), the `toSupportedReadinessClauseId` switch
    (`validators.ts:265-285`), and the `evaluateClause` switch (`validators.ts:224-255`). Add a clause → edit 3–4
    spots; miss one and `toSupportedReadinessClauseId` **silently skips it**.
  - `authoredPaths` in the floor data is **decorative** — grep confirms it is referenced only by its own
    declaration and by tests, **never by the evaluator**, which hardcodes a predicate per clause id. The "which
    field does this clause check" fact lives in two places, free to drift (already visible:
    `constraints.*.target` in the `defined` floor vs `constraints.target` in the overlay).
- ⊳ **Open decision D3 — which direction to collapse.** Either (a) make the table the single source of truth — the
  evaluator reads `authoredPaths` + a few generic predicates (cleanest once sections are typed, D1), or (b) shrink
  the table and let the evaluator be the spec, dropping the redundant union/switches. Recommendation: (a), because
  typed sections make path-driven predicates safe and it kills the 4× enumeration. To resolve.
- **Verify.** Same floor test outcomes; clause-id list defined once; no decorative metadata.

### 🟡 H6 — Simplify the tsup build; stop leaking a shebang onto the library entry · **NOW**

- **Finding.** `dist/index.js` starts with `#!/usr/bin/env node` because `tsup.config.ts` applies `banner.js` to
  **all** entries — contradicting the implementer's own recorded decision (`.sisyphus/notepads/.../decisions.md:1`:
  "use a source-file shebang … so the library build stays clean"). The config compensates with an esbuild plugin to
  strip the CLI's source shebang **and** an `onSuccess` hook to collapse the resulting doubled CLI shebang — an
  elaborate dance around a wrong default.
- **Change.** Remove the `banner`; keep the source shebang only on `src/cli/sdp.ts`; delete the strip-plugin and the
  normalize hook (or split the CLI into its own minimal tsup build). Net: less config, correct output.
- **Files.** `tsup.config.ts` (+ confirm `src/cli/sdp.ts` keeps its source shebang).
- **Verify.** `dist/index.js` has **no** shebang; `dist/cli/sdp.js` first line is exactly `#!/usr/bin/env node`;
  `node dist/cli/sdp.js --help` exits 0.

### ⚪ H7 — Hygiene · **MOSTLY RESOLVED**

- **DONE (user):** `.tmp-scratch/` is now gitignored; `plans/` is un-ignored (tracked, the more logical setup now);
  `.sisyphus/` is now fully gitignored going forward.
- **Still open — `.tmp-scratch/` is not prettier-ignored**, so `npm run check` (format:check) still trips on scratch
  files locally. Add `.tmp-scratch/` to `.prettierignore`. (CI is unaffected — scratch is uncommitted.)
- **Note — already-committed `.sisyphus/` files** (`boulder.json` + notepads, from `eb6bf2a`) remain tracked despite
  the new ignore; a `git rm --cached .sisyphus` would stop tracking them if that's wanted. (Open, low.)
- `vitest-test.mjs` wrapper exists only so `npm test -- --run x` doesn't double-`--run`. Optional: revert to
  `"test": "vitest run"` unless the `-- --run` ergonomic is wanted.
- `package.json` lacks `description`/`license`/`repository` — fine until publish; note for the publish checklist.

### 🟡 H8 — A should-fail / should-pass validator fixture suite (`05` §5) · **NOW**

- **Finding.** The validators have good *exact-message* tests, but no systematic should-fail/should-pass fixture
  set. `05` §5 ("Validator self-testing") asks each validator to ship fixtures so a regression that stops it firing
  is itself caught. The founding review independently proposes nearly the same set as the Phase-0 "done" gate.
- **Why now.** It is cheap insurance, it is concept-sanctioned, and — critically — it is the lock that proves the
  honesty fixes (§2 bypass, H2, H3) actually fire. Several fixtures map 1:1 onto findings, so authoring them *is*
  the regression net for this whole pass.
- **Fixtures (active in Session-1 authored-layer scope):**
  - `valid-minimal-idea-spec` → passes.
  - `invalid-duplicate-id` → duplicate-ids error.
  - `invalid-scoped-without-relation` → readiness-floor error.
  - `invalid-defined-constraint-without-target` → readiness-floor error.
  - `invalid-ready-with-blocking-question` → readiness-floor error **(locks H2 — must be `intent.openQuestions`)**.
  - `invalid-hand-authored-delivery-fact-in-section` → **must fail once §2/D1 lands** (today it silently passes —
    this is the bypass made executable).
- **Fixtures (deferred — they need the extractor/graph; name now, write at Slice 1+):**
  `invalid-non-static-id` (P5 envelope tier) · `invalid-non-static-section` (P5 section tier, the H1 case) ·
  `invalid-hand-authored-satisfies-edge` · `invalid-ready-with-unresolved-dependency` ·
  `invalid-ready-with-target-below-defined`.
- **Files.** `test/fixtures/**` (invalid fixtures live in tests, never under `examples/checkout-v1`), wired into
  `test/validators.test.ts`.
- **Verify.** Each active fixture asserts the expected validator id + finding; the deferred set exists as skipped/
  documented stubs so Slice 1 inherits the checklist.

### 🟡 H9 — Lock the type-level honesty defenses with compile-time fixtures · **NOW (cheap)**

- **Finding.** Two type defenses already work but are **untested**, so a future refactor could silently open them:
  - The `Spec` envelope rejects a top-level hand-authored delivery fact (`spec({ …, implemented: true })` →
    TS2353) — verified, untested.
  - `Pack` rejects truth-bearing fields (`pack({ …, intent })` / `readiness` / `constraints` → TS2353) — verified,
    untested. This is the founding review's #7 ("keep `Pack` truthless, but defend it with types"); the current
    `Pack` shape already matches the suggested restrictive type exactly.
- **Change.** Add `@ts-expect-error` fixtures (alongside the existing anchor ones in `test/builders.typecheck.ts`)
  for: `Spec` rejecting `implemented`/`has-verifier` at the envelope; `Pack` rejecting `intent`/`readiness`/
  `constraints`. Note explicitly that the **in-section** bypass (`behavior:{ "has-verifier": true }`) is *not* closed
  by these — it is closed by typing sections (D1) — so the two items are tracked together.
- **Files.** `test/builders.typecheck.ts`.
- **Verify.** `npm run typecheck` consumes the new `@ts-expect-error`s.

---

## §4 — Forward-looking decision (resolve before Slice 3, name now)

⊳ **Open decision D4 — the `AuthoredModel` seam vs the one graph (P2).** The design says validators run over **the
one graph** ("no consumer maintains a parallel model", P2). When the extractor lands, either (a) these validators
migrate to consume `GraphSchema` and `AuthoredModel` retires, or (b) `AuthoredModel` stays as an explicit,
documented *pre-graph authoring lint*. Avoid two validation code paths drifting apart — H1 is already a preview of
authored-model-truth ≠ extracted-graph-truth. Pick a direction now; execute at Slice 1/3.

---

## §4b — Concept-base refinements (proposed; route to `docs/concept`, not code)

The founding review surfaced two wording imprecisions in the ratified base. The **code is already correct** in both
cases; these are language tightenings to consider against the base (terminology is ratified, so we *flag* rather
than silently edit — `AGENTS.md` working discipline). No code change.

- ⊳ **R1 — "anchor carries identity only" → "binding assertion only, never system-truth content."** An anchor emits
  a `satisfies`/`verifies` edge, which is a *binding assertion*, not "identity" in the ordinary sense — so the
  current phrasing (`ubiquitous-language.md` §2/§4) risks reading as self-contradictory next to the `anchored`
  claim. Suggested: *"an anchor says 'this code location is the implementation/test binding for this Spec ID'; it
  must never carry behavior, rationale, readiness, acceptance criteria, or delivery facts."* The code already
  enforces exactly this (anchors hold only `id`/`label`/target; `@ts-expect-error` proves the rest is rejected).
- ⊳ **R2 — "no consumer reads source directly" → permit source *links*, forbid independent re-parsing.** The
  principle (`03`/`05`/`06`) is right, but a Design Review linking to source locations *recorded in the graph* is
  legitimate. Suggested: *"Consumers may link to source locations recorded in the graph; consumers must not
  independently parse source to derive their own model."* Matters when the Slice 4 Design Review lands.

## §4c — Forward-looking acceptance criteria, seeded by the full-MVP review (route to `07`)

Not Phase-0 work; recorded here so the full-scope lens isn't lost, to fold into the roadmap (`docs/concept/07`) and
the relevant slice's "done." Each is honesty-posture-aligned.

- **Golden-graph determinism fixture (P3) — at Slice 1.** Generalizes H1's forward hook: a tiny fixture repo with
  `expected/graph.json`; every extractor change must rebuild **byte-identically** (`diff` clean after deleting
  `generated/`). Forces the hard calls early — path normalization, line-number stability, sort order, schema
  versioning, unknown-reference handling, claim inheritance, delivery-fact derivation.
- **`implemented` is a UI hazard — at Slice 4.** Keep the internal fact name `implemented` (it powers the
  `implemented ∧ ¬ready` drift query), but render binding language in views: *"Implementation binding: present /
  Verifier binding: present / Runtime observation: not tracked."* Don't let the view overpromise liveness.
- **Derived-readiness banner in the MVP view if cheap — at Slice 4.** *"Stated readiness: ready · Structural floor
  reached: defined · Problem: blocking open question."* It teaches the core honesty concept (stated, then checked).
  Cheaply enabled by H5: a floor evaluator that reports *which clause fails* is exactly the banner's substrate.
- **`coverage-unknown` as a first-class reader/impact output — Slice 4 acceptance.** File-level blast-radius must
  report changed-but-unanchored files as `coverage-unknown`, never silently under-report (honest "impact is bounded"
  vs false "impact is complete"). Make it acceptance, not a design note.
- **Authoring ergonomics is the biggest remaining risk — Slice 5 / ongoing.** Optimize the loop early
  (`sdp new spec`, `sdp explain`, `sdp validate --watch`, great error messages, copy-pasteable examples, minimal
  boilerplate). Threads back to the anti-padding corollary in §0: validators make dishonesty fail without rewarding
  low-signal filler.
- **Adopt the founding review's MVP acceptance checklist** (spec extraction · anchor extraction · claim honesty ·
  readiness honesty · delivery facts · traceability · determinism · view) as the roadmap's acceptance suite,
  mapped across Slices 1–5.

---

## §5 — Explicitly out of scope (still deferred)

Unchanged from the roadmap; this pass does **not** introduce any of them: the `ts-morph` extractor · `graph.json` /
graph emission · the graph-level validator gate · `--check-clean` · reader / views / Design Review · architecture
rules · custom team rules · `--lenient` · derived-readiness banner · runtime `observed` path · MCP surface ·
self-hosting the Protocol's own repo. Full typing of `design`/`decision`/`ui` sections stays deferred per D1.

---

## §6 — Sequencing (first cut — to iterate)

A loose ordering, not a contract; we will refine once D1–D4 are settled.

1. **Quick, decision-free wins:** H1 (static example), H6 (tsup), H9 (compile-time honesty fixtures), the remaining
   H7 bit (`.prettierignore` for `.tmp-scratch`).
2. **Regression net:** H8 — author the active should-fail/should-pass fixtures now (all except the in-section
   delivery-fact one, which is gated on D1); stub the deferred extractor-era fixtures.
3. **Resolve D1** (how much to type) → then H3 (`constraints` array), the typed `intent`/`behavior` shapes, and the
   H8 `invalid-hand-authored-delivery-fact-in-section` fixture flips to failing.
4. **With typed sections in place:** H2 (open-questions home) and H5 (collapse the floor validator, D3).
5. **Resolve D2** → H4 (section-ref referential integrity), likely folded into the Slice 1 extractor work.
6. **Resolve D4** as a written direction before Slice 3; **R1/R2** routed to `docs/concept` (no code). §4c items
   routed to `07`. No code this pass for §4b/§4c.

**Done gate for the pass:** `npm run check` green; §1 baseline invariants intact; the example contains only static
literals; the honesty bypass (`behavior: { "has-verifier": true }`) is rejected for typed sections **and** locked by
the H8 fixture; the floor clause-id list is defined exactly once; `dist/index.js` carries no shebang; the H8 active
fixture suite passes; H9 `@ts-expect-error` honesty fixtures are in place.

---

## §7 — Open decisions to resolve (collected)

| # | Decision | Recommendation |
|---|---|---|
| **D1** | How much to type sections now | Type `intent`, `behavior`, `constraints`, `model`, `verification`; leave `design`/`decision`/`ui` open |
| **D2** | `behavior.rules` — prose vs ref list; inline-vs-promote duality | Resolve `02` §3 "Section ⟷ kind" before typing `behavior` |
| **D3** | Collapse direction for the floor validator | Table-as-single-source-of-truth (path-driven predicates) once D1 lands |
| **D4** | `AuthoredModel` future vs the one graph (P2) | Decide migrate-to-`GraphSchema` vs documented pre-graph lint; execute Slice 1/3 |
| **R1** | Tighten "anchor = identity only" → "binding assertion only" (`§4b`) | Adopt against the ratified base; code already conforms |
| **R2** | Tighten "no consumer reads source" → links-ok, re-parse-no (`§4b`) | Adopt before Slice 4 Design Review |
| **D5** | Pull the derived-readiness banner into the MVP view? (`§4c`) | Yes if cheap; H5 already produces the substrate |
| (H7) | Untrack already-committed `.sisyphus/` files? | `git rm --cached` if runner state shouldn't stay in history |
