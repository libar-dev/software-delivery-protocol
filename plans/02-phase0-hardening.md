# Phase 0 Hardening — Fidelity & Simplification Pass (post-Session-1)

> **Status: EXECUTION · Wave A done; Wave B blocked on plan 03 decisions.** This is the **code
> hardening** half of the post-Session-1 review — fidelity corrections and net complexity reductions on
> the already-implemented Phase 0. The decisions these fixes' siblings depend on, the concept-base
> wording tightenings, and the roadmap acceptance criteria were **split out of this plan** into their
> proper homes (see "Where the rest went," below).
> **Date:** 2026-06-07 · **Branch:** `feature/mvp-init` · **Repo state:** Session 1 (`eb6bf2a`) + Wave A
> green (`npm run check`: typecheck ×2, lint, format, **47 tests + 2 todo**, build).
> **2026-06-10 folds:** R1/R2/R3 ratified & applied; the anchor shape (MD-8 `codeAnchor`) and the
> open-questions home (MD-9 `intent.openQuestions`) recorded **decided** — H2's direction and H10's shape
> are no longer open; Wave B's typed-section fixes remain blocked on D1/D2/D3 (the grill, `plans/03`).

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
intends **typed-but-optional** sections. This is the linchpin — its resolution (**D1**) is owned by
**plan 03 §2–§3**, where the full framing and the authoring-ergonomics rationale live. Wave B cannot
execute its field-shape fixes until D1/D2 land there.

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

## §4 — Wave B (blocked on plan 03 decisions) — fidelity fixes, DECISION-GATED

Execution-ready specs, held until the named decision lands in
`plans/03-decision-resolution-and-base-reconciliation.md`. **Sequence after D1/D2/D3.**

### 🟠 H2 — Honesty check points at the wrong section (open questions) · direction **decided** (MD-9); execution-ready independent of D1
- **Finding.** `validators.ts` (`hasNoBlockingOpenQuestions`) and `readiness-floor.ts` read
  `spec.design.openQuestions` / `spec.decision.openQuestions`. The canonical home is
  **`intent.openQuestions`** (`02` §3; the `04` worked example puts it under `intent`).
- **Impact.** A doc-following author who flags a `blocking` question in `intent.openQuestions` can still
  state `defined`/`ready` and the honesty check **won't fire** — the marquee differentiator aimed at the
  wrong target. (Plan↔concept drift introduced by the Session-1 pre-plan; the implementation faithfully
  followed it.)
- **Change.** Read open questions from `intent.openQuestions`; update the floor data `authoredPaths`. A
  typed `IntentSection` (D1) shrinks the predicate to a few lines.
- **Files.** `validators.ts`, `readiness-floor.ts`; `test/readiness.test.ts` / `test/validators.test.ts`.
- **Verify.** Flip the gated H8 fixture `invalid-ready-with-blocking-question` to active: a spec with
  `intent.openQuestions:[{blocking:true}]` stating `defined` **fails**; with `blocking:false`/absent
  **passes**.

### 🟠 H3 — `constraints` must be an array, not a single object · gated on **D1**
- **Finding.** `sections.ts` types `constraints?: ConstraintsSection` (one `Record`); `02` §1 specifies
  `constraints?: ConstraintSection[]`. A spec can be bounded by several NFRs; a single object can't
  express that. `validators.ts` already defends against **both** array and record forms — a tell the
  shape was unsettled.
- **Change.** `constraints?: ConstraintSection[]` (typed per D1: `{ flavor?, statement, target?,
  measurableBy? }`). Update `order-latency-constraint.spec.ts` to author an array. **Simplify** the
  validator: drop the dual array/record handling — one shape only.
- **Files.** `sections.ts`, `order-latency-constraint.spec.ts`, `validators.ts`.
- **Verify.** `constraint` floor test still passes; validator no longer branches on `Array.isArray`.

### 🟡 H5 — Trim the readiness-floor validator (complexity masking a simple design) · gated on **D3**
- **Finding (verified).** `validators.ts` is 453 lines for three checks. Clause ids are enumerated in
  **four** places — `readinessFloors` data, the `ReadinessClauseId` union, the
  `toSupportedReadinessClauseId` switch, and the `evaluateClause` switch (add a clause → edit 3–4 spots;
  miss one and it **silently skips**). `authoredPaths` is **decorative** — referenced only by its
  declaration + tests, never by the evaluator, so the "which field does this clause check" fact lives in
  two places, free to drift.
- **Change.** Per **D3** (recommendation: table-as-single-source-of-truth) — the evaluator reads
  `authoredPaths` + a few generic predicates, killing the 4× enumeration. Safe once sections are typed.
- **Verify.** Same floor test outcomes; clause-id list defined exactly once; no decorative metadata.

### 🟠 H4 — Referential integrity is blind to section-embedded refs · gated on **D1 + D2**; likely Slice 1
- **Finding.** `validateDanglingReferences` checks relations, pack members, `modelRefs`, anchors — but
  not refs inside sections. Yet `create-order.spec.ts` puts real refs there
  (`behavior.rules:[ref(...)]`, `behavior.examples:[ref(...)]`). A typo there escapes the check; `05`
  §2.1 wants *every* referenced ID to resolve.
- **Why deferred-ish.** The proper fix belongs with the extractor, which must know *structurally* where
  refs can live — impossible while sections are `unknown`. Typing `behavior` (D1) + resolving the
  `behavior.rules` shape (**D2**) makes both the check and the extractor tractable.
- **Change (when scheduled).** Extend referential integrity to typed ref-bearing section fields; align
  the example to the resolved D2.

### 🟠 H10 — The example under-proves the generic-anchor claim · shape **decided** (MD-8 `codeAnchor`); pairs with Slice 2
- **Finding.** *Generic* anchors should bind **any** code location, but the example has only `impl` +
  `test` anchors; the docs' own example (`04` §5) includes a route anchor `api:orders.post`. The tracer
  bullet never exercises the genericity claim — the strongest proof is binding a **non-class location**
  (a route/endpoint).
- **Change (when scheduled).** Add an `api`/route anchor to `examples/checkout-v1` under the **MD-8
  `codeAnchor`** shape; it should extract to a `satisfies` edge with `claim:"anchored"` like any other.

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
repo. Full typing of `design`/`decision`/`ui` sections stays deferred per D1.

## §6 — Sequencing

1. **Wave A** — ✅ done (H1, H6, H7, H8-active, H9).
2. **Pre-grill folds (2026-06-10)** — ✅ done: R1/R2/R3 ratified & applied; the anchor shape (MD-8) and the
   open-questions home (MD-9) recorded decided; `plans/03` slimmed to the six open decisions.
3. **Resolve decisions** — the fresh grilling session (`plans/03`): D2 → D1 → D3, plus D4 (direction),
   D7 (kind-aware floor), D8 (file extension).
4. **Wave B** — with typed sections in place: H3, then H2 (+ flip its gated H8 fixture), then H5/D3, then
   H4; H10 with Slice-2 anchor extraction.

**Done gate for Wave B:** the honesty bypass (`behavior: { "has-verifier": true }`) is rejected for
typed sections **and** locked by the (now-active) H8 fixture; open questions read from
`intent.openQuestions`; `constraints` is an array; the floor clause-id list is defined exactly once; the
example still contains only static literals; `npm run check` green.
